const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();
const bucket = admin.storage().bucket();

// Helper to upload base64 file to Storage and return a signed URL
async function uploadFileBase64(base64, filename) {
    const buffer = Buffer.from(base64, "base64");
    const dest = `student-uploads/${Date.now()}_${filename.replace(/[^a-zA-Z0-9.\-_]/g, "_")}`;
    const file = bucket.file(dest);
    await file.save(buffer, { resumable: false, contentType: "application/octet-stream" });
    // Create a signed URL valid for 7 days
    const [url] = await file.getSignedUrl({ action: "read", expires: Date.now() + 7 * 24 * 60 * 60 * 1000 });
    return { storagePath: dest, url };
}

exports.registerStudent = functions.https.onRequest(async (req, res) => {
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.set("Access-Control-Allow-Headers", "Content-Type");
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

        const studentsRef = db.collection("studentRegistrations");
        const existingQuery = await studentsRef.where("email", "==", email).limit(1).get();
        if (!existingQuery.empty && !overwrite) {
            const doc = existingQuery.docs[0];
            return res.status(409).json({
                error: "duplicate",
                message: "A registration with this email already exists.",
                id: doc.id,
                data: doc.data(),
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
            fileUrl: uploadMeta ? uploadMeta.url : null,
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

        const savedDoc = await docRef.get();
        return res.status(200).json({ id: docRef.id, data: savedDoc.data() });
    } catch (err) {
        console.error("registerStudent error:", err);
        return res.status(500).json({ error: "internal", message: err.message });
    }
});

// ─── Table Matching Algorithm ────────────────────────────────────────────────
// TODO: protect runMatchingAlgorithm with Firebase Auth — only verified admin
// users should be able to call this endpoint. Add token verification once the
// admin portal and Firebase Auth are set up.

function normalizeMajor(major) {
    if (!major) return major;
    const m = major.toLowerCase();
    if (["dse", "data", "computing", "computation", "computer", "ling", "cog"].some(k => m.includes(k))) return "Computer Science";
    if (m.includes("undeclared")) return "Undeclared";
    if (m.includes("math")) return "Mathematics";
    if (m.includes("bio")) return "Bioengineering";
    return major;
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

// Finds common substrings between s1 and s2 (port of Python SequenceMatcher logic)
function findSimilarStrings(s1, s2, minLength = 2) {
    const common = [];
    let a = s1, b = s2;
    while (true) {
        let bestLen = 0, bestI = 0, bestJ = 0;
        for (let i = 0; i <= a.length - minLength; i++) {
            for (let j = 0; j <= b.length - minLength; j++) {
                let len = 0;
                while (i + len < a.length && j + len < b.length && a[i + len] === b[j + len]) len++;
                if (len > bestLen) { bestLen = len; bestI = i; bestJ = j; }
            }
        }
        if (bestLen < minLength) break;
        const substr = a.slice(bestI, bestI + bestLen);
        common.push(substr);
        a = a.slice(0, bestI) + a.slice(bestI + bestLen);
        b = b.slice(0, bestJ) + b.slice(bestJ + bestLen);
    }
    return common;
}

function majorMatch(students, companies) {
    const infoDict = {};
    for (const company of companies) infoDict[company.name] = [];

    const studentsByMajor = {};
    for (const student of students) {
        const major = normalizeMajor(student.major) || "Unknown";
        if (!studentsByMajor[major]) studentsByMajor[major] = [];
        studentsByMajor[major].push(student.fullName);
    }

    for (const company of companies) {
        const companyMajors = (company.majorsHired || "").split(",").map(m => m.trim());
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
    const studentMap = Object.fromEntries(students.map(s => [s.fullName, s]));

    for (const company of companies) {
        if (company.name === "The Boeing Company") continue;
        const companyRole = (company.rolesHired || "")
            .toLowerCase()
            .replace("summer internship", "internship")
            .replace("spring/ongoing interns", "internship");

        for (const student of students) {
            const name = student.fullName;
            if (manuallyAdded.has(name)) continue;

            const studentRole = (student.role || "").toLowerCase().replace("full time", "full-time");
            const similar = findSimilarStrings(companyRole, studentRole);

            if (!similar.includes(studentRole) && infoDict[company.name].includes(name)) {
                infoDict[company.name] = infoDict[company.name].filter(n => n !== name);
            }

            const year = (student.year || "").toLowerCase();
            if (year.includes("grad student - master's") || year.includes("grad student - phd")) {
                if (!companyRole.includes("full-time") && infoDict[company.name].includes(name)) {
                    infoDict[company.name] = infoDict[company.name].filter(n => n !== name);
                } else if (studentRole === "internship" && !infoDict[company.name].includes(name)) {
                    const normalizedMajor = normalizeMajor(student.major) || "";
                    const companyMajors = (company.majorsHired || "").split(",").map(m => m.trim());
                    const isIntl = student.isInternational === true || student.isInternational === "Yes";
                    const sponsorsIntl = (company.requiresCitizenship || "").toLowerCase().includes("not require citizenship or a green card");
                    if (companyMajors.includes(normalizedMajor) && (!isIntl || sponsorsIntl)) {
                        infoDict[company.name].push(name);
                    }
                }
            }
        }
    }
    return infoDict;
}

function fcfs(students, companies, infoDict, priorityLists, manuallyAdded) {
    const matches = {};
    const matchedStudents = new Set();
    const noPreferences = [];
    const majorCounts = {};

    for (const company of companies) {
        matches[company.name] = [];
        const companyMajors = (company.majorsHired || "").split(",").map(m => m.trim());
        majorCounts[company.name] = Object.fromEntries(companyMajors.map(m => [m, 0]));
    }

    for (const [companyName, studentList] of Object.entries(manuallyAdded)) {
        for (const name of studentList) {
            matches[companyName] = matches[companyName] || [];
            matches[companyName].push(name);
            matchedStudents.add(name);
        }
    }

    for (const student of students) {
        if (!manuallyAdded[student.fullName]) noPreferences.push(student.fullName);
    }

    for (const student of students) {
        const name = student.fullName;
        if (!priorityLists[name] || manuallyAdded[name]) continue;

        for (const companyName of priorityLists[name]) {
            const company = companies.find(c => c.name === companyName);
            if (!company || !infoDict[companyName] || !infoDict[companyName].includes(name)) continue;

            const normalizedMajor = normalizeMajor(student.major) || student.major;
            const currentMajorCount = (majorCounts[companyName] || {})[normalizedMajor] || 0;
            const isPPG = companyName === "PPG Industries";
            const totalCap = isPPG ? 15 : 7;
            const majorCap = isPPG ? 8 : 4;

            if (matches[companyName].length <= totalCap && (currentMajorCount + 1) <= majorCap) {
                matches[companyName].push(name);
                matchedStudents.add(name);
                if (majorCounts[companyName]) majorCounts[companyName][normalizedMajor] = currentMajorCount + 1;
                const idx = noPreferences.indexOf(name);
                if (idx !== -1) noPreferences.splice(idx, 1);
                break;
            }
        }
    }

    return { matches, matchedStudents, noPreferences, majorCounts };
}

function moreMatching(students, matches, infoDict, priorityLists, noPreferences, manuallyAdded) {
    const SKIP_COMPANIES = new Set(["Lightship RV", "Takeda Pharmaceutical Company Ltd."]);
    const rematchCount = {};
    const matchedStudents = new Set(Object.values(matches).flat());
    const studentIndexMap = Object.fromEntries(students.map((s, i) => [s.fullName, i]));
    const earlyThreshold = Math.floor(students.length * 0.6);
    const protectedThreshold = Math.floor(students.length * 0.4);

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
                if (manuallyAdded[otherStudent]) continue;
                const otherIdx = studentIndexMap[otherStudent] ?? Infinity;
                if (otherIdx <= protectedThreshold) continue;
                if ((rematchCount[otherStudent] || 0) >= 3) continue;

                const otherPriority = priorityLists[otherStudent] || [];
                const otherRank = otherPriority.indexOf(companyName);
                if (otherRank !== 1 && otherRank !== 2) continue; // 2nd or 3rd choice (0-indexed)

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

function matchToFirstAvail(students, companies, matches, infoDict, noPreferences) {
    const matchedStudents = new Set(Object.values(matches).flat());

    for (const studentName of noPreferences) {
        const student = students.find(s => s.fullName === studentName);
        const major = student ? student.major : "";

        if (major === "Mechanical Engineering" || major === "Civil Engineering") {
            if ((matches["ACCO Engineered Systems"] || []).length <= 7) {
                matches["ACCO Engineered Systems"] = matches["ACCO Engineered Systems"] || [];
                matches["ACCO Engineered Systems"].push(studentName);
                matchedStudents.add(studentName);
                continue;
            }
        }

        for (const company of companies) {
            const isPPG = company.name === "PPG Industries";
            const cap = isPPG ? 15 : 7;
            if ((matches[company.name] || []).length <= cap) {
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
    res.set("Access-Control-Allow-Headers", "Content-Type");
    if (req.method === "OPTIONS") return res.status(204).send("");
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

    try {
        let { students, companies, reps, manualMatches } = req.body || {};

        if (!students || !companies) {
            return res.status(400).json({ error: "Missing required fields: students, companies" });
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

        let { matches, noPreferences } = fcfs(students, companies, infoDict, priorityLists, normalizedManualMatches);
        ({ matches, noPreferences } = moreMatching(students, matches, infoDict, priorityLists, noPreferences, normalizedManualMatches));
        matches = matchToFirstAvail(students, companies, matches, infoDict, noPreferences);

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
