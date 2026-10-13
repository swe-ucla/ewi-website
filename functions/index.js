const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();
const bucket = admin.storage().bucket();

const ALLOWED_MIME_TYPES = {
    "25504446": "application/pdf",  // %PDF
    "ffd8ffe0": "image/jpeg",
    "ffd8ffe1": "image/jpeg",
    "ffd8ffdb": "image/jpeg",
    "89504e47": "image/png",
};

// Uploads file to Storage and returns only the storage path — no URL stored
async function uploadFileBase64(base64, filename) {
    const buffer = Buffer.from(base64, "base64");

    // Validate file type by checking magic bytes
    const magic = buffer.subarray(0, 4).toString("hex").toLowerCase();
    if (!ALLOWED_MIME_TYPES[magic]) {
        throw new Error("Invalid file type. Only PDF and images are allowed.");
    }
    const contentType = ALLOWED_MIME_TYPES[magic];

    const dest = `student-uploads/${Date.now()}_${filename.replace(/[^a-zA-Z0-9.\-_]/g, "_")}`;
    const file = bucket.file(dest);
    await file.save(buffer, { resumable: false, contentType });
    return { storagePath: dest };
}

exports.registerStudent = functions.https.onRequest(async (req, res) => {
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    if (req.method === "OPTIONS") {
        return res.status(204).send("");
    }

    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const {
            fullName,
            email,
            major,
            year,
            role,
            isInternational,
            preferences,
            overwrite = false,
            waitlist = false,
            fileBase64,
            fileName,
        } = req.body || {};

        if (!email) return res.status(400).json({ error: "Missing required field: email" });

        const studentsRef = db.collection("Registrations");
        const existingQuery = await studentsRef.where("email", "==", email).limit(1).get();
        if (!existingQuery.empty && !overwrite) {
            return res.status(409).json({
                error: "duplicate",
                message: "A registration with this email already exists.",
            });
        }

        let uploadMeta = null;
        if (fileBase64 && fileName) {
            uploadMeta = await uploadFileBase64(fileBase64, fileName);
        }

        const payload = {
            fullName: fullName || null,
            email,
            major: major || null,
            year: year || null,
            role: role || null,
            isInternational: isInternational || null,
            preferences: preferences || [],
            waitlist: !!waitlist,
            storagePath: uploadMeta ? uploadMeta.storagePath : null,
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
        };

        let docRef;
        if (!existingQuery.empty && overwrite) {
            const doc = existingQuery.docs[0];
            await studentsRef.doc(doc.id).set(payload, { merge: true });
            docRef = studentsRef.doc(doc.id);
        } else {
            docRef = await studentsRef.add(payload);
        }

        return res.status(200).json({ id: docRef.id });
    } catch (err) {
        console.error("registerStudent error:", err);
        return res.status(500).json({ error: "internal", message: err.message });
    }
});

// Generates a fresh 1-hour signed URL for a resume — admin only
exports.getResumeUrl = functions.https.onRequest(async (req, res) => {
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    if (req.method === "OPTIONS") return res.status(204).send("");
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

    const token = (req.headers.authorization || "").split("Bearer ")[1];
    if (!token) return res.status(401).json({ error: "Unauthorized" });
    try {
        const decoded = await admin.auth().verifyIdToken(token);
        const adminDoc = await db.collection("admins").doc(decoded.email).get();
        if (!adminDoc.exists) return res.status(403).json({ error: "Forbidden" });
    } catch {
        return res.status(403).json({ error: "Forbidden" });
    }

    const { storagePath } = req.body || {};
    if (!storagePath) return res.status(400).json({ error: "Missing storagePath" });

    try {
        const file = bucket.file(storagePath);
        const [url] = await file.getSignedUrl({ action: "read", expires: Date.now() + 60 * 60 * 1000 });
        return res.status(200).json({ url });
    } catch (err) {
        console.error("getResumeUrl error:", err);
        return res.status(500).json({ error: "internal", message: err.message });
    }
});

// ─── Table Matching Algorithm ────────────────────────────────────────────────

// A major can fall into several buckets (e.g. "Computational Biology" → CS and Bioengineering)
function majorBuckets(major) {
    if (!major) return [];
    const m = major.toLowerCase();
    const buckets = [];
    if (["dse", "data", "computing", "computation", "computer", "ling", "cog"].some(k => m.includes(k))) buckets.push("Computer Science");
    if (m.includes("undeclared")) buckets.push("Undeclared");
    if (m.includes("math")) buckets.push("Mathematics");
    if (m.includes("bio")) buckets.push("Bioengineering");
    return buckets.length ? buckets : [major];
}

function splitMajors(majorsHired) {
    return (majorsHired || "").split(", ").map(m => m.trim());
}

const COMPANY_NAME_MAP = {
    "boeing": "The Boeing Company",
    "trimas aerospace": "TriMas Aerospace",
    "takeda pharmaceuticals": "Takeda Pharmaceutical Company Ltd.",
    "siemens": "Siemens Digital Industries Software",
    "socal gas": "SoCalGas",
    "acco engineering systems": "ACCO Engineered Systems",
};

function normalizeCompanyName(name) {
    if (!name) return name;
    return COMPANY_NAME_MAP[name.trim().toLowerCase()] || name.trim();
}

// Port of Python SequenceMatcher.find_longest_match loop; removes every occurrence like str.replace
function findSimilarStrings(s1, s2, minLength = 2) {
    const common = [];
    let a = s1, b = s2;
    while (true) {
        let bestLen = 0, bestI = 0;
        for (let i = 0; i < a.length; i++) {
            for (let j = 0; j < b.length; j++) {
                let len = 0;
                while (i + len < a.length && j + len < b.length && a[i + len] === b[j + len]) len++;
                if (len > bestLen) { bestLen = len; bestI = i; }
            }
        }
        if (bestLen < minLength) break;
        const substr = a.slice(bestI, bestI + bestLen);
        common.push(substr);
        a = a.split(substr).join("");
        b = b.split(substr).join("");
    }
    return common;
}

function majorMatch(students, companies) {
    const infoDict = {};
    for (const company of companies) infoDict[company.name] = [];

    const studentsByMajor = {};
    for (const student of students) {
        for (const major of majorBuckets(student.major)) {
            if (!studentsByMajor[major]) studentsByMajor[major] = [];
            studentsByMajor[major].push(student.fullName);
        }
    }

    for (const company of companies) {
        const companyMajors = splitMajors(company.majorsHired);
        for (const major of companyMajors) {
            if (studentsByMajor[major]) infoDict[company.name].push(...studentsByMajor[major]);
        }
    }
    return infoDict;
}

function intlMatch(students, companies, infoDict) {
    const intlStudents = new Set(
        students.filter(s => s.isInternational === true || s.isInternational === "Yes").map(s => s.fullName)
    );

    for (const company of companies) {
        if (company.name === "The Boeing Company") continue;
        const req = (company.requiresCitizenship || "").toLowerCase();
        if (["citizenship required", "yes, we require citizenship", "yes"].some(k => req.includes(k))) {
            infoDict[company.name] = infoDict[company.name].filter(name => !intlStudents.has(name));
        }
    }
    return infoDict;
}

function roleMatch(students, companies, infoDict, manuallyAdded) {

    for (const company of companies) {
        if (company.name === "The Boeing Company") continue;
        const companyRole = (company.rolesHired || "")
            .toLowerCase()
            .replaceAll("summer internship", "internship")
            .replaceAll("spring/ongoing interns", "internship");

        for (const student of students) {
            const name = student.fullName;
            if (manuallyAdded.has(name)) continue;

            const lowerRole = (student.role || "").toLowerCase();
            const studentRole = lowerRole === "full time" ? "full-time" : lowerRole;
            const similar = findSimilarStrings(companyRole, studentRole);

            if (!similar.includes(studentRole) && infoDict[company.name].includes(name)) {
                infoDict[company.name] = infoDict[company.name].filter(n => n !== name);
            }

            const year = (student.year || "").toLowerCase();
            if (year.includes("grad student - master's") || year.includes("grad student - phd")) {
                if (!companyRole.includes("full-time") && infoDict[company.name].includes(name)) {
                    infoDict[company.name] = infoDict[company.name].filter(n => n !== name);
                } else if (studentRole === "internship" && !infoDict[company.name].includes(name)) {
                    const intl = String(student.isInternational || "").toLowerCase();
                    const sponsorsIntl = (company.requiresCitizenship || "").toLowerCase().includes("not require citizenship or a green card");
                    const takesMajor = !!student.major && (company.majorsHired || "").includes(student.major);
                    if (takesMajor && (intl === "no" || (intl === "yes" && sponsorsIntl))) {
                        infoDict[company.name].push(name);
                    }
                }
            }
        }
    }
    return infoDict;
}

const DEFAULT_SETTINGS = {
    seatsPerTable: 8,
    maxPerMajor: 4,
    largeTables: {},
    protectedPercent: 40,
    canBumpPercent: 60,
};

function tableLimits(settings, companyName) {
    return settings.largeTables[companyName] || { seats: settings.seatsPerTable, maxPerMajor: settings.maxPerMajor };
}

function isWholeNumber(n, min, max) {
    return Number.isInteger(n) && n >= min && n <= max;
}

// Returns merged settings, or null if anything is out of range
function parseSettings(input) {
    const s = { ...DEFAULT_SETTINGS, ...(input || {}) };
    if (!isWholeNumber(s.seatsPerTable, 1, 100)) return null;
    if (!isWholeNumber(s.maxPerMajor, 1, s.seatsPerTable)) return null;
    if (!isWholeNumber(s.protectedPercent, 0, 100) || !isWholeNumber(s.canBumpPercent, 0, 100)) return null;
    if (!s.largeTables || typeof s.largeTables !== "object" || Array.isArray(s.largeTables)) return null;
    const largeTables = {};
    for (const [name, t] of Object.entries(s.largeTables)) {
        if (!t || !isWholeNumber(t.seats, 1, 100) || !isWholeNumber(t.maxPerMajor, 1, t.seats)) return null;
        largeTables[normalizeCompanyName(name)] = { seats: t.seats, maxPerMajor: t.maxPerMajor };
    }
    return { ...s, largeTables };
}

function fcfs(students, companies, infoDict, priorityLists, manuallyAdded, settings) {
    const matches = {};
    const matchedStudents = new Set();
    const noPreferences = [];
    const majorCounts = {};

    for (const company of companies) {
        matches[company.name] = [];
        majorCounts[company.name] = Object.fromEntries(splitMajors(company.majorsHired).map(m => [m, 0]));
    }

    const manuallyAddedSet = new Set();
    for (const [companyName, studentList] of Object.entries(manuallyAdded)) {
        for (const name of studentList) {
            matches[companyName] = matches[companyName] || [];
            matches[companyName].push(name);
            matchedStudents.add(name);
            manuallyAddedSet.add(name);
        }
    }

    for (const student of students) {
        if (!manuallyAddedSet.has(student.fullName)) noPreferences.push(student.fullName);
    }

    for (const student of students) {
        const name = student.fullName;
        if (!priorityLists[name] || manuallyAddedSet.has(name)) continue;

        for (const companyName of priorityLists[name]) {
            const company = companies.find(c => c.name === companyName);
            if (!company || !infoDict[companyName] || !infoDict[companyName].includes(name)) continue;

            const major = student.major;
            const currentMajorCount = (majorCounts[companyName] || {})[major] || 0;
            const limits = tableLimits(settings, companyName);

            // Original used `<= 7` for an 8-seat table, so "fewer than seats" keeps the same behavior
            if (matches[companyName].length < limits.seats && currentMajorCount < limits.maxPerMajor) {
                matches[companyName].push(name);
                matchedStudents.add(name);
                if (majorCounts[companyName]) majorCounts[companyName][major] = currentMajorCount + 1;
                const idx = noPreferences.indexOf(name);
                if (idx !== -1) noPreferences.splice(idx, 1);
                break;
            }
        }
    }

    return { matches, matchedStudents, noPreferences, majorCounts };
}

function moreMatching(students, matches, infoDict, priorityLists, noPreferences, manuallyAddedMatches, settings) {
    const manuallyAdded = new Set(Object.values(manuallyAddedMatches).flat());
    const SKIP_COMPANIES = new Set(["Lightship RV", "Takeda Pharmaceutical Company Ltd."]);
    const rematchCount = {};
    const matchedStudents = new Set(Object.values(matches).flat());
    const studentIndexMap = Object.fromEntries(students.map((s, i) => [s.fullName, i]));
    const earlyThreshold = Math.floor(students.length * (settings.canBumpPercent / 100));
    const protectedThreshold = Math.floor(students.length * (settings.protectedPercent / 100));

    let i = 0;
    while (i < noPreferences.length) {
        const studentName = noPreferences[i];
        if (!priorityLists[studentName]) { i++; continue; }

        const studentIdx = studentIndexMap[studentName] ?? Infinity;
        if (studentIdx >= earlyThreshold) { i++; continue; }

        const reversedPriority = [...priorityLists[studentName]].reverse();
        let matchMade = false;

        for (const companyName of reversedPriority) {
            if (SKIP_COMPANIES.has(companyName)) continue;
            const currentMatches = [...matches[companyName] || []].reverse();

            for (const otherStudent of currentMatches) {
                if (manuallyAdded.has(otherStudent)) continue;
                const otherIdx = studentIndexMap[otherStudent] ?? Infinity;
                if (otherIdx <= protectedThreshold) continue;
                if ((rematchCount[otherStudent] || 0) >= 3) continue;

                const otherPriority = priorityLists[otherStudent] || [];
                const otherRank = otherPriority.indexOf(companyName);
                if (otherRank !== 2 && otherRank !== 3) continue; // 3rd or 4th choice (0-indexed)

                matches[companyName] = matches[companyName].filter(n => n !== otherStudent);
                matchedStudents.delete(otherStudent);
                matches[companyName].push(studentName);
                matchedStudents.add(studentName);
                if (!infoDict[companyName]) infoDict[companyName] = [];
                infoDict[companyName].push(studentName);

                noPreferences.push(otherStudent);
                noPreferences.splice(i, 1);

                rematchCount[otherStudent] = (rematchCount[otherStudent] || 0) + 1;
                rematchCount[studentName] = (rematchCount[studentName] || 0) + 1;

                matchMade = true;
                break;
            }
            if (matchMade) break;
        }
        if (!matchMade) i++;
    }

    return { matches, noPreferences };
}

function matchToFirstAvail(students, companies, matches, infoDict, noPreferences, settings) {
    const matchedStudents = new Set(Object.values(matches).flat());

    for (const studentName of noPreferences) {
        const student = students.find(s => s.fullName === studentName);
        const major = student ? student.major : "";

        if (major === "Mechanical Engineering" || major === "Civil Engineering") {
            if ((matches["ACCO Engineered Systems"] || []).length < tableLimits(settings, "ACCO Engineered Systems").seats) {
                matches["ACCO Engineered Systems"] = matches["ACCO Engineered Systems"] || [];
                matches["ACCO Engineered Systems"].push(studentName);
                matchedStudents.add(studentName);
                continue;
            }
        }

        for (const company of companies) {
            if ((matches[company.name] || []).length < tableLimits(settings, company.name).seats) {
                matches[company.name] = matches[company.name] || [];
                matches[company.name].push(studentName);
                matchedStudents.add(studentName);
                break;
            }
        }
    }

    return matches;
}

exports.runMatchingAlgorithm = functions.https.onRequest(async (req, res) => {
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    if (req.method === "OPTIONS") return res.status(204).send("");
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

    // Verify Firebase Auth token and confirm user is in admins collection
    const token = (req.headers.authorization || "").split("Bearer ")[1];
    if (!token) return res.status(401).json({ error: "Unauthorized" });
    try {
        const decoded = await admin.auth().verifyIdToken(token);
        const adminDoc = await db.collection("admins").doc(decoded.email).get();
        if (!adminDoc.exists) return res.status(403).json({ error: "Forbidden" });
    } catch {
        return res.status(403).json({ error: "Forbidden" });
    }

    try {
        let { students, companies, reps, manualMatches } = req.body || {};

        if (!students || !companies) {
            return res.status(400).json({ error: "Missing required fields: students, companies" });
        }

        const settings = parseSettings(req.body.settings);
        if (!settings) {
            return res.status(400).json({ error: "invalid_settings", message: "Matching settings must be whole numbers in range, and max per major can't exceed seats." });
        }

        // Normalize company names in input data
        companies = companies.map(c => ({ ...c, name: normalizeCompanyName(c.name) }));
        reps = (reps || []).map(r => ({ ...r, companyName: normalizeCompanyName(r.companyName) }));

        // Build manually added set (flat set of student names across all companies)
        const manuallyAddedSet = new Set(Object.values(manualMatches || {}).flat());
        const normalizedManualMatches = {};
        for (const [company, studentList] of Object.entries(manualMatches || {})) {
            normalizedManualMatches[normalizeCompanyName(company)] = studentList;
        }

        // Build priority lists with normalized company names
        const priorityLists = {};
        for (const student of students) {
            if (student.preferences) {
                priorityLists[student.fullName] = student.preferences.map(normalizeCompanyName);
            }
        }

        // Run matching pipeline
        let infoDict = majorMatch(students, companies);
        infoDict = intlMatch(students, companies, infoDict);
        infoDict = roleMatch(students, companies, infoDict, manuallyAddedSet);

        let { matches, noPreferences } = fcfs(students, companies, infoDict, priorityLists, normalizedManualMatches, settings);
        ({ matches, noPreferences } = moreMatching(students, matches, infoDict, priorityLists, noPreferences, normalizedManualMatches, settings));
        matches = matchToFirstAvail(students, companies, matches, infoDict, noPreferences, settings);

        // Build output with rep info merged in
        const repMap = {};
        for (const r of reps) repMap[r.companyName] = r;

        const output = {};
        for (const [companyName, studentList] of Object.entries(matches)) {
            const rep = repMap[companyName] || {};
            output[companyName] = {
                rep1: rep.rep1 || null,
                rep2: rep.rep2 || null,
                students: studentList,
            };
        }

        return res.status(200).json({ matches: output });
    } catch (err) {
        console.error("runMatchingAlgorithm error:", err);
        return res.status(500).json({ error: "internal", message: err.message });
    }
});
