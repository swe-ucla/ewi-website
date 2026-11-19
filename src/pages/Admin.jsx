import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { FiCheck, FiChevronRight, FiEdit2, FiUserCheck } from "react-icons/fi";
import "./Admin.css";
import { db, auth } from "../firebase";
import { collection, getDocs, doc, getDoc, setDoc, updateDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import PieChartView from "../components/admin/PieChartView";
import { exportMealCSV, exportCompanyPrefsCSV, exportAllCSV } from "../components/admin/adminExports";
import { exportResumesByMajorZip, exportAllResumesZip } from "../utils/resumeExports";
import OverlaySelect from "../components/OverlaySelect/OverlaySelect";
import avatarPlaceholder from "../assets/admin/avatar-placeholder.png";

const TrashIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14zM10 11v6M14 11v6"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const SORT_OPTIONS = [
  { value: "name", label: "Name" },
  { value: "status", label: "Status" },
  { value: "year", label: "Year" },
  { value: "major", label: "Major" },
  { value: "submitted-asc", label: "Earliest to latest" },
];

const FILTER_OPTIONS = [
  { value: "all", label: "Everyone" },
  { value: "committee", label: "Committee" },
  { value: "priority", label: "Priority" },
];

const EXPORT_OPTIONS = [
  { value: "meals", label: "Export Meals" },
  { value: "companies", label: "Export Company Prefs" },
  { value: "all", label: "Export All" },
  { value: "resumes", label: "Export Resumes" },
  { value: "resumes-by-major", label: "Export Resumes by Major" },
];

const NA = "N/A";

const isCommitteeMember = (registration) => registration?.participantType === "committee";

const hasPrioritySeat = (registration) =>
  isCommitteeMember(registration) || registration?.priorityMatching === true;

const orNA = (value) => {
  const trimmed = String(value ?? "").trim();
  return trimmed || NA;
};

const committeeDocId = (fullName) => {
  const slug = fullName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "member";
  return `committee-${slug}-${Math.random().toString(36).slice(2, 7)}`;
};

const PRONOUN_OPTIONS = [
  { value: "she/her/hers", label: "she/her/hers" },
  { value: "he/him/hims", label: "he/him/hims" },
  { value: "they/them/theirs", label: "they/them/theirs" },
  { value: "other", label: "Other" },
];

const YEAR_OPTIONS = [
  { value: "first-year", label: "First" },
  { value: "second-year", label: "Second" },
  { value: "third-year", label: "Third" },
  { value: "fourth-year", label: "Fourth" },
  { value: "fifth-year-or-greater", label: "Fifth+" },
  { value: "grad-student-masters", label: "Grad Student - Master's" },
  { value: "grad-student-phd", label: "Grad Student - PhD" },
  { value: "Other", label: "Other" },
];

const YES_NO_OPTIONS = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
];

const POSITION_OPTIONS = [
  { value: "full-time", label: "Full-time" },
  { value: "coop", label: "Co-op" },
  { value: "internship", label: "Internship" },
];

const MAJOR_ABBREVIATIONS = {
  "Aerospace Engineering": "AE",
  "Bioengineering": "BIOE",
  "Chemical Engineering": "ChemE",
  "Civil Engineering": "CE",
  "Computer Engineering": "CompE",
  "Computer Science": "CS",
  "Computer Science and Engineering": "CSE",
  "Electrical Engineering": "EE",
  "Materials Science and Engineering": "MSE",
  "Mechanical Engineering": "ME",
  "Undeclared Engineering": "UND",
  "Other": "Other",
};

const MAJOR_OPTIONS = Object.keys(MAJOR_ABBREVIATIONS).map((name) => ({ value: name, label: name }));

const MAJOR_COLORS = ["#5F4077", "#D48C70", "#E3C4FB", "#A35C45", "#7A5A96", "#E8B8A4", "#2B2133", "#C9A4E8", "#8E6B4A", "#F0D8CE"];

const ADMIN_TABS = [
  { id: "companies", label: "Companies" },
  { id: "majors", label: "Majors" },
  { id: "years", label: "Years" },
  { id: "matches", label: "Matches" },
];

const abbreviateMajor = (major) => {
  const trimmed = String(major || "").trim();
  if (!trimmed || trimmed === NA) return "";
  if (MAJOR_ABBREVIATIONS[trimmed]) return MAJOR_ABBREVIATIONS[trimmed];
  const initials = trimmed
    .split(/\s+/)
    .filter((word) => word && word.toLowerCase() !== "and")
    .map((word) => word[0].toUpperCase())
    .join("");
  return initials.slice(0, 6) || trimmed;
};

const formatSeat = (fullName, major) => {
  const name = String(fullName || "").trim();
  const abbr = abbreviateMajor(major);
  if (!name) return "";
  return abbr ? `${name} (${abbr})` : name;
};

const seatName = (student) => (typeof student === "string" ? student : student?.fullName || "");
const seatMajor = (student) => (typeof student === "string" ? "" : student?.major || "");

const majorLegend = (matches) => {
  const counts = new Map();
  for (const data of Object.values(matches || {})) {
    for (const student of data?.students || []) {
      const major = seatMajor(student) || "Unknown";
      const abbr = abbreviateMajor(major) || "—";
      const key = `${abbr}\0${major}`;
      counts.set(key, (counts.get(key) || 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([key, count]) => {
      const [abbr, major] = key.split("\0");
      return { abbr, major, count };
    })
    .sort((a, b) => b.count - a.count || a.abbr.localeCompare(b.abbr));
};

const majorParts = (students) => {
  const counts = new Map();
  for (const student of students || []) {
    const abbr = abbreviateMajor(seatMajor(student)) || "—";
    const major = seatMajor(student) || "Unknown";
    const key = `${abbr}\0${major}`;
    counts.set(key, (counts.get(key) || 0) + 1);
  }
  return [...counts.entries()]
    .map(([key, count]) => {
      const [abbr, major] = key.split("\0");
      return { abbr, major, count };
    })
    .sort((a, b) => b.count - a.count || a.abbr.localeCompare(b.abbr));
};

const LATEST_MATCH_ID = "latest";

const matchesFromSaved = (row) => {
  const matches = {};
  for (const table of row?.tables || []) {
    matches[table.company] = { students: table.students || [] };
  }
  return matches;
};

const escapeCsv = (value) => {
  const str = String(value ?? "");
  if (/[",\n]/.test(str)) return `"${str.replace(/"/g, '""')}"`;
  return str;
};

const buildMatchingCsv = (matches, companyOrder) => {
  const orderedNames = [
    ...companyOrder.filter((name) => matches[name]),
    ...Object.keys(matches).filter((name) => !companyOrder.includes(name)),
  ];
  const legend = majorLegend(matches);
  const maxStudents = Math.max(
    8,
    ...orderedNames.map((name) => matches[name]?.students?.length || 0)
  );
  const legendRows = [
    ["Abbreviation", "Major", "Count"],
    ...legend.map((item) => [item.abbr, item.major, item.count]),
    [],
  ];
  const headers = ["Company", ...Array.from({ length: maxStudents }, (_, index) => `Student ${index + 1}`)];
  const tableRows = orderedNames.map((name) => {
    const students = matches[name]?.students || [];
    return [
      name,
      ...Array.from({ length: maxStudents }, (_, index) => (
        students[index] ? formatSeat(seatName(students[index]), seatMajor(students[index])) : ""
      )),
    ];
  });
  return [...legendRows, headers, ...tableRows].map((row) => row.map(escapeCsv).join(",")).join("\n");
};

const downloadCsvFile = (csv, filename) => {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

const CHECK_IN_OPTIONS = [
  "5:30 - 5:45 PM",
  "5:45 - 6:00 PM",
  "6:00 - 6:15 PM",
  "6:15 - 6:30 PM",
  "6:30 - 6:45 PM",
].map((time) => ({ value: time, label: time }));

const WILL_CALL_OPTIONS = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No, but I'd like to stay on the waitlist" },
];

const MEAL_OPTIONS = [
  { value: "vegetarian", label: "Vegetarian" },
  { value: "vegan", label: "Vegan" },
];

const knownOption = (value, options) => {
  if (!value || value === NA) return "";
  return options.some((option) => option.value === value) ? value : "";
};

const emptyParticipant = () => ({
  id: null,
  fullName: "",
  company: "",
  email: NA,
  uid: NA,
  pronouns: "",
  otherPronouns: "",
  year: "",
  transfer: "",
  major: "",
  otherMajor: "",
  positionType: "",
  needSponsorship: "",
  checkInTime: "",
  willCall: "",
  dietaryRestrictions: NA,
  meal: "vegetarian",
});

const ParticipantSelect = ({ id, label, value, options, onChange, allowEmpty = true }) => {
  const selected = knownOption(value, options) || (allowEmpty ? "" : options[0]?.value || "");
  return (
    <div className="participant-form__field">
      <label htmlFor={id}>{label}</label>
      <select
        id={id}
        className="participant-form__select"
        value={selected}
        onChange={(e) => onChange(e.target.value)}
      >
        {allowEmpty && <option value="">{NA}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </div>
  );
};

const registrationSubmittedMs = (registration) =>
  registration?.submittedAt?.toMillis?.() ?? registration?.createdAt?.toMillis?.() ?? 0;

const formatSubmittedAt = (registration) => {
  const ms = registrationSubmittedMs(registration);
  if (!ms) return "—";
  return new Date(ms).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

const registrationRowStatus = (registration) => {
  if (registration.status === "cancelled" || registration.registrationStatus === "cancelled") return "cancelled";
  if (registration.status === "waitlisted" || registration.status === "registered") return registration.status;
  if (registration.registrationStatus === "waitlist") return "waitlisted";
  if (registration.registrationStatus) return "registered";
  return "";
};
// The live matching function can still leave a priority student at another table.
// Put each of them on their first choice before the results are shown or downloaded.
const lockPrioritySeats = (matches, students) => {
  const next = {};
  for (const [company, data] of Object.entries(matches || {})) {
    next[company] = { ...data, students: [...(data?.students || [])] };
  }
  for (const student of students) {
    if (!student.priorityMatching) continue;
    const name = (student.fullName || "").trim();
    const topPref = (student.preferences || []).map((company) => String(company).trim()).find(Boolean);
    if (!name || !topPref) continue;
    const copies = Object.values(next).reduce(
      (count, data) => count + (data.students || []).filter((studentName) => String(studentName).trim() === name).length,
      0
    );
    if (copies > 1) continue;
    const known = Object.keys(next).find((company) => company.toLowerCase() === topPref.toLowerCase());
    const top = known || topPref;
    if (!next[top]) next[top] = { rep1: null, rep2: null, students: [] };
    for (const company of Object.keys(next)) {
      next[company].students = next[company].students.filter((studentName) => String(studentName).trim() !== name);
    }
    next[top].students.unshift(name);
  }
  return next;
};

const provider = new GoogleAuthProvider();
// .env.local can point this at the local emulator
const FUNCTIONS_URL = process.env.REACT_APP_FIREBASE_FUNCTIONS_URL || "https://us-central1-swe-ewi.cloudfunctions.net";
const DEFAULT_MATCHING_SETTINGS = {
  seatsPerTable: 8,
  maxPerMajor: 4,
  protectedPercent: 40,
  canBumpPercent: 60,
  largeTables: [],
  majorOverrides: {},
};

const STANDARD_TABLE_SEATS = DEFAULT_MATCHING_SETTINGS.seatsPerTable;

const majorCapForSeats = (seats, settings) => {
  const standardSeats = Number(settings.seatsPerTable) || STANDARD_TABLE_SEATS;
  const standardMajor = Number(settings.maxPerMajor) || DEFAULT_MATCHING_SETTINGS.maxPerMajor;
  const scaled = Math.round((seats * standardMajor) / standardSeats);
  return Math.max(1, Math.min(seats, scaled || 1));
};

const tablesFromCapacity = (companyList, settings) => {
  const tableSeats = Number(settings.seatsPerTable);
  const standardSeats = Number.isInteger(tableSeats) && tableSeats > 0
    ? tableSeats
    : STANDARD_TABLE_SEATS;

  return companyList
    .filter((company) => {
      const capacity = Number(company.capacity);
      return Number.isInteger(capacity) && capacity > 0 && capacity !== standardSeats;
    })
    .map((company) => {
      const seats = Number(company.capacity);
      const stored = Number(settings.majorOverrides?.[company.name]);
      const maxPerMajor = Number.isInteger(stored) && stored >= 1 && stored <= seats
        ? stored
        : majorCapForSeats(seats, settings);
      return { company: company.name, seats, maxPerMajor };
    })
    .sort((a, b) => a.company.localeCompare(b.company));
};
const YEAR_LABELS = {
  "grad-student-masters": "Grad Student - Master's",
  "grad-student-phd": "Grad Student - PhD",
};

const TABLE_PAGE_SIZE = 10;
const REG_PAGE_SIZE = 10;

const pageItems = (items, page, size = TABLE_PAGE_SIZE) => {
  const start = page * size;
  return items.slice(start, start + size);
};

const pageCount = (total, size = TABLE_PAGE_SIZE) =>
  Math.max(1, Math.ceil(total / size));

const AdminPager = ({ page, totalItems, onChange, label, pageSize = TABLE_PAGE_SIZE }) => {
  const pages = pageCount(totalItems, pageSize);
  if (totalItems <= pageSize) return null;

  return (
    <nav className="admin-pager" aria-label={label}>
      <button
        type="button"
        className="admin-pager__btn"
        disabled={page <= 0}
        onClick={() => onChange(page - 1)}
      >
        Prev
      </button>
      {Array.from({ length: pages }, (_, i) => (
        <button
          key={i}
          type="button"
          className={`admin-pager__btn${i === page ? " is-active" : ""}`}
          aria-current={i === page ? "page" : undefined}
          onClick={() => onChange(i)}
        >
          {i + 1}
        </button>
      ))}
      <button
        type="button"
        className="admin-pager__btn"
        disabled={page >= pages - 1}
        onClick={() => onChange(page + 1)}
      >
        Next
      </button>
    </nav>
  );
};

const InfoTip = ({ id, children }) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        className={`info-tip-btn${open ? " is-open" : ""}`}
        aria-label="What does this mean?"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((v) => !v)}
      >
        i
      </button>
      {open && (
        <p id={id} className="setting-hint">
          {children}
        </p>
      )}
    </>
  );
};

const Admin = () => {
  const [user, setUser] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [registrations, setRegistrations] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("companies");
  const [showMatching, setShowMatching] = useState(false);
  const [confirmRemove, setConfirmRemove] = useState(null);
  const [confirmCancel, setConfirmCancel] = useState(null);
  const [confirmRegister, setConfirmRegister] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [participantFilter, setParticipantFilter] = useState("all");
  const [confirmPriority, setConfirmPriority] = useState(null);
  const [error, setError] = useState(null);
  const [editingCapacityId, setEditingCapacityId] = useState(null);
  const [capacityDraft, setCapacityDraft] = useState("");
  const [showAddCompany, setShowAddCompany] = useState(false);
  const [newCompanyName, setNewCompanyName] = useState("");
  const [newCompanyCapacity, setNewCompanyCapacity] = useState("");
  const [matchingResults, setMatchingResults] = useState(null);
  const [savedMatch, setSavedMatch] = useState(null);
  const [matchSaveError, setMatchSaveError] = useState(null);
  const [matchingLoading, setMatchingLoading] = useState(false);
  const [matchingError, setMatchingError] = useState(null);
  const [showMatchingConfirm, setShowMatchingConfirm] = useState(false);
  const [includeCancelledCharts, setIncludeCancelledCharts] = useState(false);
  const [participantEditor, setParticipantEditor] = useState(null);
  const [participantSaving, setParticipantSaving] = useState(false);
  const [participantError, setParticipantError] = useState(null);
  const [matchingSettings, setMatchingSettings] = useState(DEFAULT_MATCHING_SETTINGS);
  const [savedSettings, setSavedSettings] = useState(DEFAULT_MATCHING_SETTINGS);
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [settingsError, setSettingsError] = useState(null);
  const [companyPage, setCompanyPage] = useState(0);
  const [regsPage, setRegsPage] = useState(0);
  const [expandedRegKey, setExpandedRegKey] = useState(null);
  const settingsChanged = JSON.stringify(matchingSettings) !== JSON.stringify(savedSettings);

  const saveSettings = async () => {
    setSettingsSaving(true);
    setSettingsError(null);
    try {
      await setDoc(doc(db, "settings", "matching"), {
        values: matchingSettings,
        updatedBy: user.email,
        updatedAt: serverTimestamp(),
      });
      setSavedSettings(matchingSettings);
    } catch (err) {
      console.error("Saving settings failed:", err);
      setSettingsError("Couldn't save settings. Check that the Firestore rule for settings is published.");
    } finally {
      setSettingsSaving(false);
    }
  };

  const activeRegistrations = registrations.filter((r) => registrationRowStatus(r) !== "cancelled");

  // Mirrors the cutoffs in functions/index.js; the locked cutoff includes one extra student, as in the original script
  const lineCount = (percent, locked = false) => {
    const total = activeRegistrations.length;
    const cutoff = Math.floor(total * ((Number(percent) || 0) / 100));
    return locked ? Math.min(total, cutoff + 1) : cutoff;
  };
  const lineSpots = (count) => (count === 0 ? "Nobody" : count === 1 ? "Student #1" : `Students #1–${count}`);
  const lockedCount = lineCount(matchingSettings.protectedPercent, true);
  const secondChanceCount = lineCount(matchingSettings.canBumpPercent);
  const capacityTables = tablesFromCapacity(companies, matchingSettings);
  const capacityTableNames = new Set(capacityTables.map((table) => table.company));

  const updateSetting = (key, value) =>
    setMatchingSettings((prev) => ({ ...prev, [key]: value === "" ? "" : Number(value) }));

  const updateLargeTable = (index, key, value) =>
    setMatchingSettings((prev) => ({
      ...prev,
      largeTables: prev.largeTables.map((t, i) =>
        i === index ? { ...t, [key]: key === "company" || value === "" ? value : Number(value) } : t
      ),
    }));

  const addLargeTable = () =>
    setMatchingSettings((prev) => ({
      ...prev,
      largeTables: [...prev.largeTables, { company: "", seats: prev.seatsPerTable * 2, maxPerMajor: prev.maxPerMajor * 2 }],
    }));

  const removeLargeTable = (index) =>
    setMatchingSettings((prev) => ({ ...prev, largeTables: prev.largeTables.filter((_, i) => i !== index) }));

  const updateCapacityMajor = (company, seats, raw) => {
    const parsed = Number(raw);
    const next = raw === "" || !Number.isInteger(parsed)
      ? raw
      : Math.max(1, Math.min(seats, parsed));
    setMatchingSettings((prev) => ({
      ...prev,
      majorOverrides: { ...(prev.majorOverrides || {}), [company]: next },
    }));
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        const adminDoc = await getDoc(doc(db, "admins", u.email));
        setIsAuthorized(adminDoc.exists());
      } else {
        setIsAuthorized(false);
      }
      setAuthLoading(false);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!isAuthorized) return;
    const fetchData = async () => {
      setDataLoading(true);
      setError(null);
      const failed = [];

      const registrationsFetch = getDocs(collection(db, "Registrations"))
        .then((snap) => setRegistrations(snap.docs.map((d) => ({ id: d.id, ...d.data() }))))
        .catch((err) => {
          console.error(err);
          failed.push("registrations");
        });

      const companiesFetch = getDocs(collection(db, "Companies"))
        .then((snap) => setCompanies(snap.docs.map((d) => ({ id: d.id, ...d.data() }))))
        .catch((err) => {
          console.error(err);
          failed.push("companies");
        });

      await Promise.all([registrationsFetch, companiesFetch]);

      if (failed.length > 0) {
        setError(`Failed to load ${failed.join(" and ")}. Check Firestore rules.`);
      }
      setDataLoading(false);
    };
    const fetchSettings = async () => {
      try {
        const snap = await getDoc(doc(db, "settings", "matching"));
        if (snap.exists()) {
          const loaded = { ...DEFAULT_MATCHING_SETTINGS, ...snap.data().values };
          setMatchingSettings(loaded);
          setSavedSettings(loaded);
        }
      } catch (err) {
        console.error("Loading saved settings failed:", err);
      }
    };
    fetchData();
    fetchSettings();
  }, [isAuthorized]);

  const handleSignIn = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error("Sign in failed:", err);
    }
  };

  const handleSignOut = () => signOut(auth);

  const companyOrder = companies.map((company) => company.name);

  const downloadMatchingCsv = () => {
    const saved = savedMatch;
    const source = matchingResults || matchesFromSaved(saved);
    if (!saved?.csv && !Object.keys(source).length) return;
    const csv = saved?.csv || buildMatchingCsv(source, companyOrder);
    downloadCsvFile(csv, "ewi_table_matching.csv");
  };

  const attachMajors = (matches, students) => {
    const majorsByName = new Map();
    for (const student of students) {
      const name = (student.fullName || "").trim();
      if (name && !majorsByName.has(name)) majorsByName.set(name, student);
    }
    const next = {};
    for (const [company, data] of Object.entries(matches || {})) {
      next[company] = {
        ...data,
        students: (data?.students || []).map((studentName) => {
          const fullName = String(studentName).trim();
          const source = majorsByName.get(fullName);
          return {
            fullName,
            major: source?.major || "",
            priority: Boolean(source?.priorityMatching),
          };
        }),
      };
    }
    return next;
  };

  const handleRunMatching = async () => {
    setShowMatchingConfirm(false);
    setMatchingLoading(true);
    setMatchingError(null);
    setMatchingResults(null);
    try {
      const students = registrations
        .filter((r) => registrationRowStatus(r) === "registered")
        .map((r) => ({
          fullName: r.fullName,
          email: r.email && r.email !== NA ? r.email : r.id,
          major: r.major === "Other" ? r.otherMajor : r.major,
          year: YEAR_LABELS[r.year] || r.year,
          role: r.positionType,
          isInternational: r.needSponsorship === "yes" ? "Yes" : "No",
          isCommitteeMember: isCommitteeMember(r),
          priorityMatching: hasPrioritySeat(r),
          submittedAt: r.submittedAt?.toMillis?.() ?? r.createdAt?.toMillis?.() ?? 0,
          preferences: (r.companyPreferences || []).filter(Boolean),
        }));

      const companyInputs = companies.map((c) => ({
        name: c.name,
        rolesHired: "",
        majorsHired: "",
        requiresCitizenship: "",
      }));

      const idToken = await user.getIdToken();
      const res = await fetch(`${FUNCTIONS_URL}/runMatchingAlgorithm`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${idToken}` },
        body: JSON.stringify({
          students,
          companies: companyInputs,
          reps: [],
          manualMatches: {},
          settings: {
            seatsPerTable: matchingSettings.seatsPerTable,
            maxPerMajor: matchingSettings.maxPerMajor,
            protectedPercent: matchingSettings.protectedPercent,
            canBumpPercent: matchingSettings.canBumpPercent,
            largeTables: Object.fromEntries(
              [
                ...capacityTables,
                ...matchingSettings.largeTables.filter(
                  (table) => table.company && !capacityTableNames.has(table.company)
                ),
              ].map((table) => [table.company, { seats: table.seats, maxPerMajor: table.maxPerMajor }])
            ),
          },
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Matching failed");
      const seated = attachMajors(lockPrioritySeats(data.matches, students), students);
      const csv = buildMatchingCsv(seated, companyOrder);
      const createdAtMs = Date.now();
      const tables = companyOrder
        .filter((name) => seated[name])
        .concat(Object.keys(seated).filter((name) => !companyOrder.includes(name)))
        .map((company) => ({
          company,
          students: (seated[company]?.students || []).map((student) => ({
            fullName: seatName(student),
            major: seatMajor(student),
            priority: student?.priority === true,
          })),
        }));
      setMatchingResults(seated);
      setMatchSaveError(null);
      const matchRecord = {
        createdAt: serverTimestamp(),
        createdAtMs,
        createdBy: user.email || "",
        csv,
        tables,
      };
      try {
        await setDoc(doc(db, "TableMatches", LATEST_MATCH_ID), matchRecord);
        const older = await getDocs(collection(db, "TableMatches"));
        await Promise.all(
          older.docs
            .filter((entry) => entry.id !== LATEST_MATCH_ID)
            .map((entry) => deleteDoc(entry.ref))
        );
        setSavedMatch({ id: LATEST_MATCH_ID, ...matchRecord });
        setActiveTab("matches");
        setShowMatching(false);
      } catch (saveErr) {
        console.error("Saving table match failed:", saveErr);
        setMatchSaveError("The match ran, but it could not be saved. Check that the Firestore rule for TableMatches is published.");
      }
    } catch (err) {
      console.error("Matching error:", err);
      setMatchingError(err.message);
    } finally {
      setMatchingLoading(false);
    }
  };

  const handleExport = (val) => {
    if (!val) return;
    if (val === "meals") exportMealCSV(activeRegistrations);
    else if (val === "companies") exportCompanyPrefsCSV(activeRegistrations);
    else if (val === "all") exportAllCSV(registrations);
    else if (val === "resumes") exportAllResumesZip();
    else if (val === "resumes-by-major") exportResumesByMajorZip();
  };

  const startEditingCapacity = (company) => {
    setEditingCapacityId(company.id);
    setCapacityDraft(company.capacity != null ? String(company.capacity) : "");
  };

  const cancelEditingCapacity = () => {
    setEditingCapacityId(null);
    setCapacityDraft("");
  };

  const commitCapacity = async (company) => {
    const trimmed = capacityDraft.trim();
    const newCapacity = trimmed === "" ? null : Number(trimmed);
    if (trimmed !== "" && Number.isNaN(newCapacity)) {
      cancelEditingCapacity();
      return;
    }
    cancelEditingCapacity();
    if (newCapacity === (company.capacity ?? null)) return;

    const prevCompanies = companies;
    setCompanies((prev) => prev.map((c) => (c.id === company.id ? { ...c, capacity: newCapacity } : c)));
    try {
      await updateDoc(doc(db, "Companies", company.id), { capacity: newCapacity });
    } catch (err) {
      console.error(err);
      setError("Failed to update capacity.");
      setCompanies(prevCompanies);
    }
  };

  const handleRemoveCompany = async () => {
    if (!confirmRemove) return;
    const company = confirmRemove;
    setConfirmRemove(null);
    const prevCompanies = companies;
    setCompanies((prev) => prev.filter((c) => c.id !== company.id));
    try {
      await deleteDoc(doc(db, "Companies", company.id));
    } catch (err) {
      console.error(err);
      setError("Failed to remove company.");
      setCompanies(prevCompanies);
    }
  };

  const handleMoveToRegistered = async () => {
    const registration = confirmRegister;
    setConfirmRegister(null);
    if (!registration) return;

    const docId = registration.id || registration.email;
    if (!docId) {
      setError("This registration has no email, so it can't be moved.");
      return;
    }

    const prevRegistrations = registrations;
    setRegistrations((prev) =>
      prev.map((r) =>
        (r.id || r.email) === docId
          ? { ...r, status: "registered", registrationStatus: "normal registration" }
          : r
      )
    );
    try {
      await updateDoc(doc(db, "Registrations", docId), {
        status: "registered",
        registrationStatus: "normal registration",
      });
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to move registration off the waitlist.");
      setRegistrations(prevRegistrations);
    }
  };

  const handleCancelRegistration = async () => {
    const registration = confirmCancel;
    setConfirmCancel(null);
    if (!registration) return;

    const docId = registration.id || registration.email;
    if (!docId) {
      setError("This registration has no email, so it can't be cancelled.");
      return;
    }

    const prevRegistrations = registrations;
    setRegistrations((prev) =>
      prev.map((r) =>
        (r.id || r.email) === docId
          ? { ...r, status: "cancelled", registrationStatus: "cancelled" }
          : r
      )
    );
    try {
      await updateDoc(doc(db, "Registrations", docId), {
        status: "cancelled",
        registrationStatus: "cancelled",
      });
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to cancel registration.");
      setRegistrations(prevRegistrations);
    }
  };

  const openParticipantEditor = (registration) => {
    setParticipantError(null);
    if (!registration) {
      setParticipantEditor(emptyParticipant());
      return;
    }
    const storedPronouns = registration.pronouns || "";
    const pronouns = storedPronouns === "other" || knownOption(storedPronouns, PRONOUN_OPTIONS)
      ? knownOption(storedPronouns, PRONOUN_OPTIONS) || (storedPronouns === "other" ? "other" : "")
      : (storedPronouns && storedPronouns !== NA ? "other" : "");
    const storedMajor = registration.major || "";
    const major = storedMajor === "Other" || knownOption(storedMajor, MAJOR_OPTIONS)
      ? knownOption(storedMajor, MAJOR_OPTIONS) || (storedMajor === "Other" ? "Other" : "")
      : (storedMajor && storedMajor !== NA ? "Other" : "");

    setParticipantEditor({
      id: registration.id,
      fullName: registration.fullName || "",
      company: registration.companyPreferences?.[0] || "",
      email: registration.email || NA,
      uid: registration.uid || NA,
      pronouns,
      otherPronouns: pronouns === "other"
        ? (registration.otherPronouns && registration.otherPronouns !== NA
          ? registration.otherPronouns
          : (storedPronouns !== "other" ? storedPronouns : ""))
        : "",
      year: knownOption(registration.year, YEAR_OPTIONS),
      transfer: knownOption(registration.transfer, YES_NO_OPTIONS),
      major,
      otherMajor: major === "Other"
        ? (registration.otherMajor && registration.otherMajor !== NA
          ? registration.otherMajor
          : (storedMajor !== "Other" && storedMajor !== NA ? storedMajor : ""))
        : "",
      positionType: knownOption(registration.positionType, POSITION_OPTIONS),
      needSponsorship: knownOption(registration.needSponsorship, YES_NO_OPTIONS),
      checkInTime: knownOption(registration.checkInTime, CHECK_IN_OPTIONS),
      willCall: knownOption(registration.willCall, WILL_CALL_OPTIONS),
      dietaryRestrictions: registration.dietaryRestrictions || NA,
      meal: registration.meal ? "vegan" : "vegetarian",
    });
  };

  const updateParticipantField = (key, value) => {
    setParticipantEditor((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  const handleSaveParticipant = async (e) => {
    e.preventDefault();
    if (!participantEditor) return;

    const fullName = participantEditor.fullName.trim();
    const company = participantEditor.company.trim();
    if (!fullName || !company) {
      setParticipantError("Full name and top company preference are required.");
      return;
    }

    const existing = participantEditor.id
      ? registrations.find((registration) => registration.id === participantEditor.id)
      : null;
    const companyPreferences = [...(existing?.companyPreferences || Array(10).fill(""))];
    while (companyPreferences.length < 10) companyPreferences.push("");
    companyPreferences[0] = company;

    const pronouns = knownOption(participantEditor.pronouns, PRONOUN_OPTIONS);
    const major = knownOption(participantEditor.major, MAJOR_OPTIONS);

    const saved = {
      fullName,
      email: orNA(participantEditor.email),
      uid: orNA(participantEditor.uid),
      pronouns,
      otherPronouns: pronouns === "other" ? orNA(participantEditor.otherPronouns) : "",
      year: knownOption(participantEditor.year, YEAR_OPTIONS),
      transfer: knownOption(participantEditor.transfer, YES_NO_OPTIONS),
      major,
      otherMajor: major === "Other" ? orNA(participantEditor.otherMajor) : "",
      positionType: knownOption(participantEditor.positionType, POSITION_OPTIONS),
      needSponsorship: knownOption(participantEditor.needSponsorship, YES_NO_OPTIONS),
      checkInTime: knownOption(participantEditor.checkInTime, CHECK_IN_OPTIONS),
      willCall: knownOption(participantEditor.willCall, WILL_CALL_OPTIONS),
      dietaryRestrictions: orNA(participantEditor.dietaryRestrictions),
      meal: participantEditor.meal === "vegan",
      companyPreferences,
      participantType: "committee",
      status: existing?.status || "registered",
      registrationStatus: existing?.registrationStatus || "normal registration",
    };

    setParticipantSaving(true);
    setParticipantError(null);
    try {
      if (participantEditor.id) {
        await updateDoc(doc(db, "Registrations", participantEditor.id), {
          ...saved,
          updatedAt: serverTimestamp(),
        });
        setRegistrations((prev) =>
          prev.map((registration) =>
            registration.id === participantEditor.id ? { ...registration, ...saved } : registration
          )
        );
      } else {
        const id = committeeDocId(fullName);
        await setDoc(doc(db, "Registrations", id), {
          ...saved,
          resume: null,
          resumeFilename: null,
          membershipId: NA,
          membershipProof: null,
          meal: false,
          photoConsent: false,
          additionalComments: "",
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          submittedAt: serverTimestamp(),
        });
        setRegistrations((prev) => [...prev, { id, ...saved }]);
      }
      setParticipantEditor(null);
    } catch (err) {
      console.error(err);
      setParticipantError("Couldn't save this committee member. Check Firestore rules for Registrations.");
    } finally {
      setParticipantSaving(false);
    }
  };

  const togglePriorityMatching = async (registration) => {
    const docId = registration.id || registration.email;
    if (!docId) {
      setError("This registration has no id, so priority matching can't be saved.");
      return;
    }

    const next = !registration.priorityMatching;
    const prevRegistrations = registrations;
    setRegistrations((prev) =>
      prev.map((entry) =>
        (entry.id || entry.email) === docId ? { ...entry, priorityMatching: next } : entry
      )
    );
    try {
      await updateDoc(doc(db, "Registrations", docId), { priorityMatching: next });
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Couldn't update priority matching.");
      setRegistrations(prevRegistrations);
    }
  };

  const handleAddCompany = async (e) => {
    e.preventDefault();
    const trimmedName = newCompanyName.trim();
    if (!trimmedName) return;

    const isDuplicate = companies.some((c) => c.name.toLowerCase() === trimmedName.toLowerCase());
    if (isDuplicate) {
      setError(`"${trimmedName}" is already in the companies list.`);
      return;
    }

    const capTrimmed = newCompanyCapacity.trim();
    const capacity = capTrimmed === "" ? null : Number(capTrimmed);
    if (capTrimmed !== "" && Number.isNaN(capacity)) {
      setError("Capacity must be a number.");
      return;
    }

    try {
      await setDoc(doc(db, "Companies", trimmedName), {
        name: trimmedName,
        capacity,
        firstChoiceCount: 0,
      });
      setCompanies((prev) => [...prev, { id: trimmedName, name: trimmedName, capacity, firstChoiceCount: 0 }]);
      setNewCompanyName("");
      setNewCompanyCapacity("");
      setShowAddCompany(false);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to add company.");
    }
  };

  const attending = registrations.filter((r) => registrationRowStatus(r) === "registered").length;
  const onWaitList = registrations.filter((r) => registrationRowStatus(r) === "waitlisted").length;
  const onWillCall = activeRegistrations.filter((r) => String(r.willCall || "").toLowerCase() === "yes").length;

  const sortedFiltered = registrations
    .filter((r) => {
      if (participantFilter === "committee" && !isCommitteeMember(r)) return false;
      if (participantFilter === "priority" && r.priorityMatching !== true) return false;
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        (r.fullName || "").toLowerCase().includes(q) ||
        (r.uid || "").toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      if (sortBy === "name") return (a.fullName || "").localeCompare(b.fullName || "");
      if (sortBy === "status") return registrationRowStatus(a).localeCompare(registrationRowStatus(b));
      if (sortBy === "year") return (a.year || "").localeCompare(b.year || "");
      if (sortBy === "major") return (a.major || "").localeCompare(b.major || "");
      if (sortBy === "submitted-asc") return registrationSubmittedMs(a) - registrationSubmittedMs(b);
      return 0;
    });

  const companiesWithStats = companies
    .map((company) => ({
      ...company,
      firstChoiceCount: activeRegistrations.filter(
        (r) => r.companyPreferences?.[0] === company.name
      ).length,
    }))
    .sort((a, b) => (a.name || "").localeCompare(b.name || ""));

  const safeCompanyPage = Math.min(
    companyPage,
    pageCount(companiesWithStats.length) - 1
  );
  const safeRegsPage = Math.min(regsPage, pageCount(sortedFiltered.length, REG_PAGE_SIZE) - 1);
  const pagedCompanies = pageItems(companiesWithStats, safeCompanyPage);
  const pagedRegistrations = pageItems(sortedFiltered, safeRegsPage, REG_PAGE_SIZE);

  useEffect(() => {
    setCompanyPage(0);
  }, [companies.length]);

  useEffect(() => {
    setRegsPage(0);
  }, [searchQuery, sortBy, registrations.length, participantFilter]);

  useEffect(() => {
    if (!isAuthorized) return undefined;
    let cancelled = false;
    (async () => {
      try {
        const latestRef = doc(db, "TableMatches", LATEST_MATCH_ID);
        const latestSnap = await getDoc(latestRef);
        if (cancelled) return;
        let row = latestSnap.exists() ? { id: latestSnap.id, ...latestSnap.data() } : null;
        if (!row) {
          const snap = await getDocs(collection(db, "TableMatches"));
          if (cancelled) return;
          const newest = snap.docs
            .map((entry) => ({ id: entry.id, ...entry.data() }))
            .sort((a, b) => (b.createdAtMs || 0) - (a.createdAtMs || 0))[0];
          if (newest) {
            row = {
              id: LATEST_MATCH_ID,
              createdAtMs: newest.createdAtMs || 0,
              createdBy: newest.createdBy || "",
              csv: newest.csv || "",
              tables: newest.tables || [],
            };
            await setDoc(latestRef, {
              createdAt: serverTimestamp(),
              createdAtMs: row.createdAtMs,
              createdBy: row.createdBy,
              csv: row.csv,
              tables: row.tables,
            });
            await Promise.all(
              snap.docs.filter((entry) => entry.id !== LATEST_MATCH_ID).map((entry) => deleteDoc(entry.ref))
            );
          }
        }
        if (!row || cancelled) return;
        setSavedMatch(row);
        setMatchingResults((current) => current || matchesFromSaved(row));
      } catch (err) {
        console.error("Loading saved matches failed:", err);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isAuthorized]);

  useEffect(() => {
    if (!showMatching) return undefined;
    const onKeyDown = (e) => {
      if (e.key === "Escape") setShowMatching(false);
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [showMatching]);

  const activeLegend = majorLegend(matchesFromSaved(savedMatch));
  const majorColor = Object.fromEntries(
    activeLegend.map((item, index) => [item.abbr, MAJOR_COLORS[index % MAJOR_COLORS.length]])
  );
  const priorityNames = new Set(
    registrations
      .filter((registration) => hasPrioritySeat(registration))
      .map((registration) => (registration.fullName || "").trim())
  );
  const studentIsPriority = (student) => {
    if (student?.priority === true) return true;
    if (student?.priority === false) return false;
    return priorityNames.has(String(seatName(student)).trim());
  };

  if (authLoading) {
    return <div className="admin-shell admin-center"><p className="admin-loading-text">Loading...</p></div>;
  }

  if (!user) {
    return (
      <div className="admin-shell admin-center">
        <div className="admin-login-card">
          <h1>EWI Admin</h1>
          <p>Sign in with your authorized Google account to view registration data.</p>
          <button className="admin-signin-btn" onClick={handleSignIn}>
            Sign in with Google
          </button>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="admin-shell admin-center">
        <div className="admin-login-card">
          <h1>Access Denied</h1>
          <p><strong>{user.email}</strong> is not authorized to access this page.</p>
          <button className="admin-signout-btn" onClick={handleSignOut}>Sign out</button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-shell admin-page">
      <div className="admin-panel">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <div className="admin-header-right">
          <div className="admin-user-block">
            <span className="admin-user">{user.email}</span>
            <button type="button" className="admin-signout-link" onClick={handleSignOut}>
              Sign out
            </button>
          </div>
          <img
            className="admin-avatar"
            src={user.photoURL || avatarPlaceholder}
            alt=""
            width={78}
            height={78}
          />
        </div>
      </div>

      <div className="admin-stats">
        <div className="stat-card">
          <span className="stat-num">{registrations.length}</span>
          <span className="stat-label">total responses</span>
        </div>
        <div className="stat-card">
          <span className="stat-num">{attending}</span>
          <span className="stat-label">attending</span>
        </div>
        <div className="stat-card">
          <span className="stat-num">{onWaitList}</span>
          <span className="stat-label">on wait list</span>
        </div>
        <div className="stat-card">
          <span className="stat-num">{onWillCall}</span>
          <span className="stat-label">on will call</span>
        </div>
      </div>

      {error && <p className="admin-error">{error}</p>}

      <div className="admin-tabs-row">
        <div className="admin-tabs">
          {ADMIN_TABS.map((tab) => (
            <button
              key={tab.id}
              className={`filter-btn ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          className={`admin-matching-toggle${showMatching ? " is-open" : ""}`}
          onClick={() => setShowMatching(true)}
          aria-expanded={showMatching}
          aria-controls="admin-matching-panel"
        >
          Run Matching
        </button>
      </div>

      {showMatching && (
        <div
          className="admin-matching-overlay"
          onClick={() => setShowMatching(false)}
          role="presentation"
        >
          <aside
            id="admin-matching-panel"
            className="admin-matching-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-matching-title"
            onClick={(e) => e.stopPropagation()}
          >
            <header className="admin-matching-panel__header">
              <h2 id="admin-matching-title" className="admin-matching-title">
                Table Matching
              </h2>
              <button
                type="button"
                className="admin-matching-panel__close"
                aria-label="Close matching panel"
                onClick={() => setShowMatching(false)}
              >
                ×
              </button>
            </header>

            <div className="admin-matching-panel__body">
              <div className="matching-settings">
                <div className="matching-settings-grid">
                  <div className="setting-row">
                    <div className="setting-copy">
                      <div className="setting-label">
                        <label htmlFor="seatsPerTable">Seats per table</label>
                        <InfoTip id="hint-seats">How many students sit at each company's table.</InfoTip>
                      </div>
                    </div>
                    <input
                      id="seatsPerTable"
                      type="number"
                      min="1"
                      value={matchingSettings.seatsPerTable}
                      onChange={(e) => updateSetting("seatsPerTable", e.target.value)}
                    />
                  </div>
                  <div className="setting-row">
                    <div className="setting-copy">
                      <div className="setting-label">
                        <label htmlFor="maxPerMajor">Max of one major</label>
                        <InfoTip id="hint-max-major">
                          Cap on how many students with the same major can sit at one table, so companies meet a mix.
                        </InfoTip>
                      </div>
                    </div>
                    <input
                      id="maxPerMajor"
                      type="number"
                      min="1"
                      value={matchingSettings.maxPerMajor}
                      onChange={(e) => updateSetting("maxPerMajor", e.target.value)}
                    />
                  </div>
                  <div className="setting-row">
                    <div className="setting-copy">
                      <div className="setting-label">
                        <label htmlFor="protectedPercent">Can't lose their seat</label>
                        <InfoTip id="hint-protected">
                          Students line up by signup order. The first {matchingSettings.protectedPercent}% keep
                          their seat — {lineSpots(lockedCount).toLowerCase()} of {activeRegistrations.length} right now.
                        </InfoTip>
                      </div>
                    </div>
                    <span className="setting-input">
                      <input
                        id="protectedPercent"
                        type="number"
                        min="0"
                        max="100"
                        value={matchingSettings.protectedPercent}
                        onChange={(e) => updateSetting("protectedPercent", e.target.value)}
                      />
                      <span>%</span>
                    </span>
                  </div>
                  <div className="setting-row">
                    <div className="setting-copy">
                      <div className="setting-label">
                        <label htmlFor="canBumpPercent">Can take someone's seat</label>
                        <InfoTip id="hint-bump">
                          If someone in the first {matchingSettings.canBumpPercent}% gets none of their picks,
                          they can take a seat from a later student who ranked that company 3rd or 4th —{" "}
                          {lineSpots(secondChanceCount).toLowerCase()} of {activeRegistrations.length} right now.
                        </InfoTip>
                      </div>
                    </div>
                    <span className="setting-input">
                      <input
                        id="canBumpPercent"
                        type="number"
                        min="0"
                        max="100"
                        value={matchingSettings.canBumpPercent}
                        onChange={(e) => updateSetting("canBumpPercent", e.target.value)}
                      />
                      <span>%</span>
                    </span>
                  </div>
                </div>

                <div className="matching-large-tables">
                  <div className="setting-subhead">
                    <div className="setting-label">
                      <span>Custom tables</span>
                      <InfoTip id="hint-large-tables">
                        A company whose capacity doesn't match Seats per table is listed here and seated at that capacity. Max of one major scales with the table size. Add a row only for an extra override.
                      </InfoTip>
                    </div>
                  </div>
                  {capacityTables.map((table) => (
                    <div className="capacity-table-card" key={table.company}>
                      <p className="capacity-table-card__name">{table.company}</p>
                      <div className="capacity-table-card__stats">
                        <span className="capacity-table-card__stat">
                          <strong>{table.seats}</strong>
                          seats
                        </span>
                        <label className="capacity-table-card__stat">
                          <input
                            type="number"
                            min="1"
                            max={table.seats}
                            aria-label={`Max of one major for ${table.company}`}
                            value={matchingSettings.majorOverrides?.[table.company] ?? table.maxPerMajor}
                            onChange={(e) => updateCapacityMajor(table.company, table.seats, e.target.value)}
                          />
                          per major
                        </label>
                      </div>
                    </div>
                  ))}
                  {matchingSettings.largeTables.some((table) => !capacityTableNames.has(table.company)) && (
                    <div className="large-table-head" aria-hidden="true">
                      <span>Company</span>
                      <span>Seats</span>
                      <span>Major</span>
                      <span />
                    </div>
                  )}
                  {matchingSettings.largeTables.filter((t) => !capacityTableNames.has(t.company)).map((t) => {
                    const i = matchingSettings.largeTables.indexOf(t);
                    return (
                    <div className="large-table-row" key={i}>
                      <select
                        id={`largeCompany${i}`}
                        aria-label="Company"
                        className="large-table-select"
                        value={t.company}
                        onChange={(e) => updateLargeTable(i, "company", e.target.value)}
                      >
                        <option value="">Select company</option>
                        {companies.map((c) => (
                          <option key={c.name} value={c.name}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                      <input
                        id={`largeSeats${i}`}
                        aria-label="Seats"
                        type="number"
                        min="1"
                        value={t.seats}
                        onChange={(e) => updateLargeTable(i, "seats", e.target.value)}
                      />
                      <input
                        id={`largeMajor${i}`}
                        aria-label="Max of one major"
                        type="number"
                        min="1"
                        value={t.maxPerMajor}
                        onChange={(e) => updateLargeTable(i, "maxPerMajor", e.target.value)}
                      />
                      <button
                        type="button"
                        className="large-table-remove"
                        aria-label="Remove custom table"
                        onClick={() => removeLargeTable(i)}
                      >
                        ×
                      </button>
                    </div>
                    );
                  })}
                  <button type="button" className="matching-link-btn" onClick={addLargeTable}>
                    + Add custom table
                  </button>
                </div>

                <div className="matching-settings-actions">
                  <button
                    type="button"
                    className="matching-link-btn"
                    onClick={() => setMatchingSettings(DEFAULT_MATCHING_SETTINGS)}
                  >
                    Reset to defaults
                  </button>
                  <button
                    type="button"
                    className={`settings-save-btn${settingsChanged ? "" : " is-saved"}`}
                    onClick={saveSettings}
                    disabled={!settingsChanged || settingsSaving}
                  >
                    {settingsSaving ? "Saving..." : settingsChanged ? "Save settings" : "Saved"}
                  </button>
                </div>
                {settingsChanged && !settingsSaving && (
                  <p className="settings-unsaved">
                    Unsaved changes. Runs use these values, but they reset on reload until you save.
                  </p>
                )}
                {settingsError && <p className="admin-error">{settingsError}</p>}
              </div>

              {matchingError && <p className="admin-error">{matchingError}</p>}
              {matchSaveError && <p className="admin-error">{matchSaveError}</p>}
            </div>

            <footer className="admin-matching-panel__footer">
              <button
                className="admin-matching-run"
                onClick={() => setShowMatchingConfirm(true)}
                disabled={matchingLoading}
              >
                {matchingLoading ? "Running..." : "Run Matching Algorithm"}
              </button>
            </footer>
          </aside>
        </div>
      )}

      {dataLoading ? (
        <p className="admin-loading-text">Loading registrations...</p>
      ) : (
        <>
          {activeTab === "companies" && (
            <>
              <div className="admin-table-wrapper companies-table-wrapper">
                <table className="admin-table companies-table">
                  <thead>
                    <tr>
                      <th>company</th>
                      <th>capacity</th>
                      <th># of first choices</th>
                      <th aria-label="actions" />
                    </tr>
                  </thead>
                  <tbody>
                    {pagedCompanies.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="admin-empty">No companies yet.</td>
                      </tr>
                    ) : (
                      pagedCompanies.map((company) => (
                        <tr key={company.id}>
                          <td className="company-name-cell">{company.name}</td>
                          <td data-label="capacity">
                            {editingCapacityId === company.id ? (
                              <input
                                type="number"
                                min="0"
                                className="capacity-input"
                                autoFocus
                                value={capacityDraft}
                                onChange={(e) => setCapacityDraft(e.target.value)}
                                onBlur={() => commitCapacity(company)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") e.target.blur();
                                  if (e.key === "Escape") cancelEditingCapacity();
                                }}
                              />
                            ) : (
                              <button
                                type="button"
                                className="capacity-display"
                                onClick={() => startEditingCapacity(company)}
                              >
                                {company.capacity ?? "—"}
                              </button>
                            )}
                          </td>
                          <td data-label="# of first choices">
                            <span className="first-choice-count">{company.firstChoiceCount}</span>
                          </td>
                          <td className="remove-cell">
                            <button
                              type="button"
                              className="admin-trash-btn"
                              aria-label={`Delete ${company.name}`}
                              onClick={() => setConfirmRemove(company)}
                            >
                              <TrashIcon />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              <div className="admin-add-company">
                {showAddCompany ? (
                  <form className="admin-add-company-form" onSubmit={handleAddCompany}>
                    <input
                      className="admin-search-input"
                      type="text"
                      placeholder="Company name"
                      value={newCompanyName}
                      onChange={(e) => setNewCompanyName(e.target.value)}
                      autoFocus
                      required
                    />
                    <input
                      className="admin-search-input admin-add-company-capacity"
                      type="number"
                      min="0"
                      placeholder="Capacity (optional)"
                      value={newCompanyCapacity}
                      onChange={(e) => setNewCompanyCapacity(e.target.value)}
                    />
                    <button type="submit" className="add-company-btn">Add</button>
                    <button
                      type="button"
                      className="admin-add-company-cancel"
                      onClick={() => {
                        setShowAddCompany(false);
                        setNewCompanyName("");
                        setNewCompanyCapacity("");
                      }}
                    >
                      Cancel
                    </button>
                  </form>
                ) : (
                  <button
                    type="button"
                    className="admin-add-company-toggle"
                    onClick={() => setShowAddCompany(true)}
                  >
                    + Add company
                  </button>
                )}
              </div>
              <AdminPager
                page={safeCompanyPage}
                totalItems={companiesWithStats.length}
                onChange={setCompanyPage}
                label="Companies pages"
              />
            </>
          )}

          {activeTab === "majors" && (
            <PieChartView
              title="Majors"
              includeCancelled={includeCancelledCharts}
              onIncludeCancelledChange={setIncludeCancelledCharts}
              data={Object.entries(
                (includeCancelledCharts ? registrations : activeRegistrations).reduce((acc, r) => {
                  const m = r.major === "Other" ? (r.otherMajor || "Other") : (r.major || "Unknown");
                  acc[m] = (acc[m] || 0) + 1;
                  return acc;
                }, {})
              ).map(([name, value]) => ({ name, value }))}
            />
          )}

          {activeTab === "years" && (
            <PieChartView
              title="Years"
              includeCancelled={includeCancelledCharts}
              onIncludeCancelledChange={setIncludeCancelledCharts}
              data={Object.entries(
                (includeCancelledCharts ? registrations : activeRegistrations).reduce((acc, r) => {
                  const y = r.year || "Unknown";
                  acc[y] = (acc[y] || 0) + 1;
                  return acc;
                }, {})
              ).map(([name, value]) => ({ name, value }))}
            />
          )}

          {activeTab === "matches" && (
            <div className="match-view">
              {matchSaveError && <p className="admin-error">{matchSaveError}</p>}
              {!savedMatch ? (
                <p className="match-view__empty">No saved match yet. Run matching and the tables will show up here.</p>
              ) : (
                <>
                  <div className="match-view__toolbar">
                    <button type="button" className="matching-link-btn" onClick={downloadMatchingCsv}>
                      Download CSV
                    </button>
                  </div>
                  <div className="match-view__legend">
                    {activeLegend.map((item) => (
                      <span key={`${item.abbr}-${item.major}`} className="match-key" title={`${item.major} · ${item.count}`}>
                        <i style={{ background: majorColor[item.abbr] }} />
                        {item.abbr}
                      </span>
                    ))}
                    <span className="match-key match-key--priority" title="Priority match">
                      <i />
                      Priority
                    </span>
                  </div>
                  <div className="match-board">
                    {(savedMatch.tables || []).map((table) => {
                      const parts = majorParts(table.students);
                      const total = (table.students || []).length;
                      const people = [...(table.students || [])].sort(
                        (a, b) => Number(studentIsPriority(b)) - Number(studentIsPriority(a))
                      );
                      return (
                        <article className="match-cluster" key={table.company}>
                          <header className="match-cluster__head">
                            <h3 className="match-cluster__name">{table.company}</h3>
                            <span className="match-cluster__count">{total}</span>
                          </header>
                          <div className="match-bar" aria-hidden="true">
                            {parts.map((part) => (
                              <span
                                key={part.abbr}
                                title={`${part.abbr} ${part.count}`}
                                style={{ flexGrow: part.count, background: majorColor[part.abbr] || "#ddd" }}
                              />
                            ))}
                          </div>
                          <ul className="match-people">
                            {people.length === 0 ? (
                              <li className="match-person match-person--empty">No students</li>
                            ) : (
                              people.map((student, index) => {
                                const priority = studentIsPriority(student);
                                const abbr = abbreviateMajor(seatMajor(student));
                                return (
                                  <li
                                    key={`${seatName(student)}-${index}`}
                                    className={`match-person${priority ? " is-priority" : ""}`}
                                  >
                                    <span>{seatName(student)}</span>
                                    {abbr && (
                                      <abbr title={seatMajor(student) || abbr} style={{ color: majorColor[abbr] }}>
                                        {abbr}
                                      </abbr>
                                    )}
                                  </li>
                                );
                              })
                            )}
                          </ul>
                        </article>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          )}

          {activeTab !== "matches" && <>
          <div className="admin-search-row">
            <input
              className="admin-search-input"
              type="text"
              placeholder="Search name/uid"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <OverlaySelect
              id="admin-filter"
              name="participantFilter"
              ariaLabel="Filter registrations"
              size="compact"
              className="admin-filter-select"
              value={participantFilter}
              placeholder="Filter..."
              options={FILTER_OPTIONS}
              onChange={(e) => setParticipantFilter(e.target.value)}
            />
            <OverlaySelect
              id="admin-sort"
              name="sortBy"
              ariaLabel="Sort registrations"
              size="compact"
              className="admin-sort-select"
              value={sortBy}
              placeholder="Sort by..."
              options={SORT_OPTIONS}
              onChange={(e) => setSortBy(e.target.value)}
            />
            <OverlaySelect
              id="admin-export"
              name="export"
              ariaLabel="Export data"
              size="compact"
              className="admin-export-select"
              value=""
              placeholder="Export..."
              options={EXPORT_OPTIONS}
              onChange={(e) => handleExport(e.target.value)}
            />
            <button
              type="button"
              className="admin-add-participant"
              onClick={() => openParticipantEditor(null)}
            >
              + Add committee member
            </button>
          </div>
          <div className="admin-table-wrapper">
            <table className="admin-table registrations-table">
              <thead>
                <tr>
                  <th>name</th>
                  <th>major/yr</th>
                  <th>status</th>
                  <th>top choice</th>
                  <th title="Attended 4 of 5 EWI events">priority</th>
                  <th aria-label="actions" />
                </tr>
              </thead>
              <tbody>
                {sortedFiltered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="admin-empty">No registrations found.</td>
                  </tr>
                ) : (
                  pagedRegistrations.map((r, i) => {
                    const rowKey = r.id || r.email || r.uid || `${r.fullName}-${i}`;
                    const open = expandedRegKey === rowKey;
                    const prefs = (r.companyPreferences || [])
                      .map((name, rank) => ({ rank: rank + 1, name }))
                      .filter((pref) => pref.name);
                    return (
                      <React.Fragment key={rowKey}>
                        <tr className={`${i % 2 === 1 ? "admin-row--alt" : ""}${open ? " is-open" : ""}`}>
                          <td>
                            <button
                              type="button"
                              className={`admin-name-toggle${open ? " is-open" : ""}`}
                              aria-expanded={open}
                              aria-controls={`reg-prefs-${safeRegsPage}-${i}`}
                              onClick={() => setExpandedRegKey(open ? null : rowKey)}
                            >
                              <FiChevronRight className="admin-name-toggle__chevron" aria-hidden="true" />
                              {r.fullName}
                            </button>
                          </td>
                          <td>{(r.major === "Other" ? r.otherMajor : r.major) || "—"} / {r.year || "—"}</td>
                          <td>
                            <div className="status-badges">
                              <span className={`status-badge ${registrationRowStatus(r) || "unknown"}`}>
                                {registrationRowStatus(r) || "—"}
                              </span>
                              {isCommitteeMember(r) && (
                                <span className="status-badge committee">committee</span>
                              )}
                            </div>
                          </td>
                          <td>{r.companyPreferences?.[0] || "—"}</td>
                          <td className="priority-cell">
                            <input
                              type="checkbox"
                              className="priority-toggle"
                              checked={r.priorityMatching === true}
                              aria-label={`Priority matching for ${r.fullName || "this attendee"}. Eligible after attending 4 of 5 EWI events.`}
                              onChange={() => setConfirmPriority(r)}
                            />
                          </td>
                          <td className="remove-cell">
                            {isCommitteeMember(r) && (
                              <button
                                type="button"
                                className="admin-edit-reg"
                                aria-label={`Edit ${r.fullName || "committee member"}`}
                                onClick={() => openParticipantEditor(r)}
                              >
                                <FiEdit2 aria-hidden="true" />
                              </button>
                            )}
                            {registrationRowStatus(r) === "waitlisted" && (
                              <button
                                type="button"
                                className="admin-register-btn"
                                aria-label={`Move ${r.fullName || r.email} to the registered list`}
                                onClick={() => setConfirmRegister(r)}
                              >
                                <FiUserCheck aria-hidden="true" />
                              </button>
                            )}
                            {registrationRowStatus(r) !== "cancelled" && (
                              <button
                                type="button"
                                className="admin-trash-btn"
                                aria-label={`Cancel registration for ${r.fullName || r.email}`}
                                onClick={() => setConfirmCancel(r)}
                              >
                                <TrashIcon />
                              </button>
                            )}
                          </td>
                        </tr>
                        {open && (
                          <tr className="admin-prefs-row">
                            <td colSpan={6} id={`reg-prefs-${safeRegsPage}-${i}`}>
                              <div className="admin-prefs">
                                <div className="admin-prefs__companies">
                                  <p className="admin-prefs__label">Company preferences</p>
                                  {prefs.length === 0 ? (
                                    <p className="admin-prefs__empty">No company preferences.</p>
                                  ) : (
                                    <ol className="admin-prefs__list">
                                      {prefs.map((pref) => (
                                        <li key={pref.rank} className={pref.rank === 1 ? "is-top" : undefined}>
                                          <span className="admin-prefs__rank">{pref.rank}</span>
                                          <span className="admin-prefs__name">{pref.name}</span>
                                        </li>
                                      ))}
                                    </ol>
                                  )}
                                </div>
                                <aside className="admin-prefs__meal">
                                  <div className="admin-prefs__meal-item">
                                    <span className="admin-prefs__meal-label">Submitted</span>
                                    <span className="admin-prefs__meal-notes">{formatSubmittedAt(r)}</span>
                                  </div>
                                  <div className="admin-prefs__meal-item">
                                    <span className="admin-prefs__meal-label">Meal</span>
                                    <p className="admin-prefs__vegan">
                                      <FiCheck aria-hidden="true" />
                                      {r.meal ? "Vegan" : "Vegetarian"}
                                    </p>
                                  </div>
                                  <div className="admin-prefs__meal-item">
                                    <span className="admin-prefs__meal-label">Dietary restrictions</span>
                                    <span className="admin-prefs__meal-notes">
                                      {r.dietaryRestrictions?.trim() || "None"}
                                    </span>
                                  </div>
                                </aside>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          <AdminPager
            page={safeRegsPage}
            totalItems={sortedFiltered.length}
            pageSize={REG_PAGE_SIZE}
            onChange={setRegsPage}
            label="Registrations pages"
          />
          </>}
        </>
      )}
      </div>
      {showMatchingConfirm && (
        <div className="modal-overlay" onClick={() => setShowMatchingConfirm(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <p>
              <strong>Heads up:</strong> running this too many times would exceed the free tier and cost SWE money.
              Please only run it when you need new table assignments.
            </p>
            <div className="modal-actions">
              <button className="modal-cancel" onClick={() => setShowMatchingConfirm(false)}>Cancel</button>
              <button className="modal-delete" onClick={handleRunMatching}>Run anyway</button>
            </div>
          </div>
        </div>
      )}
      {participantEditor && createPortal(
        <div className="participant-overlay">
          <form className="participant-modal" onSubmit={handleSaveParticipant} role="dialog" aria-modal="true" aria-labelledby="participant-editor-title">
            <h2 id="participant-editor-title" className="participant-modal__title">
              {participantEditor.id ? "Edit committee member" : "Add committee member"}
            </h2>
            <p className="participant-modal__note">
              {participantEditor.id
                ? "This entry stays tagged as a committee member. Menus use the same choices as student registration."
                : "They join the applicant pool as a committee member. Anything you don't have yet is saved as N/A."}
            </p>
            <div className="participant-form">
              <div className="participant-form__field">
                <label htmlFor="participant-fullName">Full name</label>
                <input
                  id="participant-fullName"
                  className="participant-form__input"
                  type="text"
                  value={participantEditor.fullName}
                  onChange={(e) => updateParticipantField("fullName", e.target.value)}
                  onFocus={(e) => e.target.select()}
                  required
                />
              </div>
              <div className="participant-form__field">
                <label htmlFor="participant-company">Top company preference</label>
                <select
                  id="participant-company"
                  className="participant-form__select"
                  value={participantEditor.company}
                  onChange={(e) => updateParticipantField("company", e.target.value)}
                  required
                >
                  <option value="">Select company</option>
                  {[...companies].sort((a, b) => (a.name || "").localeCompare(b.name || "")).map((company) => (
                    <option key={company.id || company.name} value={company.name}>{company.name}</option>
                  ))}
                </select>
              </div>
              {participantEditor.id && (
                <>
                  <div className="participant-form__field">
                    <label htmlFor="participant-email">Email</label>
                    <input
                      id="participant-email"
                      className="participant-form__input"
                      type="text"
                      value={participantEditor.email}
                      placeholder={NA}
                      onChange={(e) => updateParticipantField("email", e.target.value)}
                      onFocus={(e) => { if (e.target.value === NA) e.target.select(); }}
                    />
                  </div>
                  <div className="participant-form__field">
                    <label htmlFor="participant-uid">UID</label>
                    <input
                      id="participant-uid"
                      className="participant-form__input"
                      type="text"
                      value={participantEditor.uid}
                      placeholder={NA}
                      onChange={(e) => updateParticipantField("uid", e.target.value)}
                      onFocus={(e) => { if (e.target.value === NA) e.target.select(); }}
                    />
                  </div>
                  <ParticipantSelect
                    id="participant-pronouns"
                    label="Pronouns"
                    value={participantEditor.pronouns}
                    options={PRONOUN_OPTIONS}
                    onChange={(value) => updateParticipantField("pronouns", value)}
                  />
                  {participantEditor.pronouns === "other" && (
                    <div className="participant-form__field">
                      <label htmlFor="participant-otherPronouns">Pronouns</label>
                      <input
                        id="participant-otherPronouns"
                        className="participant-form__input"
                        type="text"
                        value={participantEditor.otherPronouns}
                        placeholder="Enter pronouns"
                        onChange={(e) => updateParticipantField("otherPronouns", e.target.value)}
                      />
                    </div>
                  )}
                  <ParticipantSelect
                    id="participant-year"
                    label="Year"
                    value={participantEditor.year}
                    options={YEAR_OPTIONS}
                    onChange={(value) => updateParticipantField("year", value)}
                  />
                  <ParticipantSelect
                    id="participant-transfer"
                    label="Transfer"
                    value={participantEditor.transfer}
                    options={YES_NO_OPTIONS}
                    onChange={(value) => updateParticipantField("transfer", value)}
                  />
                  <ParticipantSelect
                    id="participant-major"
                    label="Major"
                    value={participantEditor.major}
                    options={MAJOR_OPTIONS}
                    onChange={(value) => updateParticipantField("major", value)}
                  />
                  {participantEditor.major === "Other" && (
                    <div className="participant-form__field">
                      <label htmlFor="participant-otherMajor">Major</label>
                      <input
                        id="participant-otherMajor"
                        className="participant-form__input"
                        type="text"
                        value={participantEditor.otherMajor}
                        placeholder="Enter major"
                        onChange={(e) => updateParticipantField("otherMajor", e.target.value)}
                      />
                    </div>
                  )}
                  <ParticipantSelect
                    id="participant-position"
                    label="Position type"
                    value={participantEditor.positionType}
                    options={POSITION_OPTIONS}
                    onChange={(value) => updateParticipantField("positionType", value)}
                  />
                  <ParticipantSelect
                    id="participant-sponsorship"
                    label="Sponsorship"
                    value={participantEditor.needSponsorship}
                    options={YES_NO_OPTIONS}
                    onChange={(value) => updateParticipantField("needSponsorship", value)}
                  />
                  <ParticipantSelect
                    id="participant-checkin"
                    label="Check-in time"
                    value={participantEditor.checkInTime}
                    options={CHECK_IN_OPTIONS}
                    onChange={(value) => updateParticipantField("checkInTime", value)}
                  />
                  <ParticipantSelect
                    id="participant-willcall"
                    label="Will call"
                    value={participantEditor.willCall}
                    options={WILL_CALL_OPTIONS}
                    onChange={(value) => updateParticipantField("willCall", value)}
                  />
                  <ParticipantSelect
                    id="participant-meal"
                    label="Meal"
                    value={participantEditor.meal}
                    options={MEAL_OPTIONS}
                    allowEmpty={false}
                    onChange={(value) => updateParticipantField("meal", value)}
                  />
                  <div className="participant-form__field">
                    <label htmlFor="participant-dietary">Dietary restrictions</label>
                    <input
                      id="participant-dietary"
                      className="participant-form__input"
                      type="text"
                      value={participantEditor.dietaryRestrictions}
                      placeholder={NA}
                      onChange={(e) => updateParticipantField("dietaryRestrictions", e.target.value)}
                      onFocus={(e) => { if (e.target.value === NA) e.target.select(); }}
                    />
                  </div>
                </>
              )}
            </div>
            {participantError && <p className="admin-error participant-modal__error">{participantError}</p>}
            <div className="modal-actions">
              <button type="button" className="modal-cancel" onClick={() => setParticipantEditor(null)} disabled={participantSaving}>
                Cancel
              </button>
              <button type="submit" className="modal-delete" disabled={participantSaving}>
                {participantSaving ? "Saving..." : participantEditor.id ? "Save changes" : "Add to pool"}
              </button>
            </div>
          </form>
        </div>,
        document.body
      )}
      {confirmPriority && (
        <div className="modal-overlay" onClick={() => setConfirmPriority(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <p>
              {confirmPriority.priorityMatching ? (
                <>Remove priority matching for <strong>{confirmPriority.fullName || "this attendee"}</strong>?</>
              ) : (
                <>
                  Mark <strong>{confirmPriority.fullName || "this attendee"}</strong> for priority matching?
                  This is for attendees who have been to 4 of 5 EWI events. They will be seated at their top company first.
                </>
              )}
            </p>
            <div className="modal-actions">
              <button className="modal-cancel" onClick={() => setConfirmPriority(null)}>Cancel</button>
              <button
                className="modal-delete"
                onClick={() => {
                  const registration = confirmPriority;
                  setConfirmPriority(null);
                  togglePriorityMatching(registration);
                }}
              >
                {confirmPriority.priorityMatching ? "Remove priority" : "Mark priority"}
              </button>
            </div>
          </div>
        </div>
      )}
      {confirmRegister && (
        <div className="modal-overlay" onClick={() => setConfirmRegister(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <p>
              Move <strong>{confirmRegister.fullName || confirmRegister.email}</strong> to the registered list?
              Confirm you have sent them an email.
            </p>
            <div className="modal-actions">
              <button className="modal-cancel" onClick={() => setConfirmRegister(null)}>Not yet</button>
              <button className="modal-delete" onClick={handleMoveToRegistered}>Email sent, move to registered</button>
            </div>
          </div>
        </div>
      )}
      {confirmCancel && (
        <div className="modal-overlay" onClick={() => setConfirmCancel(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <p>
              Cancel registration for <strong>{confirmCancel.fullName || confirmCancel.email}</strong>?
              Their status will be set to cancelled.
            </p>
            <div className="modal-actions">
              <button className="modal-cancel" onClick={() => setConfirmCancel(null)}>Keep registration</button>
              <button className="modal-delete" onClick={handleCancelRegistration}>Cancel registration</button>
            </div>
          </div>
        </div>
      )}
      {confirmRemove && (
        <div className="modal-overlay" onClick={() => setConfirmRemove(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <p>Are you sure you want to delete <strong>{confirmRemove.name}</strong>?</p>
            <div className="modal-actions">
              <button className="modal-cancel" onClick={() => setConfirmRemove(null)}>Cancel</button>
              <button className="modal-delete" onClick={handleRemoveCompany}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
