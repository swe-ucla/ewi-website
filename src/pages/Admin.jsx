import React, { useState, useEffect, useRef } from "react";
import { FiCheck, FiChevronRight } from "react-icons/fi";
import "./Admin.css";
import { db, auth } from "../firebase";
import { collection, getDocs, doc, getDoc, setDoc, updateDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import PieChartView from "../components/admin/PieChartView";
import { exportMealCSV, exportCompanyPrefsCSV, exportAllCSV, exportMatchingCSV, normalizeCompanyName } from "../components/admin/adminExports";
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
];

const EXPORT_OPTIONS = [
  { value: "meals", label: "Export Meals" },
  { value: "companies", label: "Export Company Prefs" },
  { value: "all", label: "Export All" },
  { value: "resumes", label: "Export Resumes" },
  { value: "resumes-by-major", label: "Export Resumes by Major" },
];

const provider = new GoogleAuthProvider();
// .env.local can point this at the local emulator
const FUNCTIONS_URL = process.env.REACT_APP_FIREBASE_FUNCTIONS_URL || "https://us-central1-swe-ewi.cloudfunctions.net";
// Students are seated strictly in order — workshop attendees first, then by
// registration time — and nobody loses a seat once assigned. canBumpPercent: 0
// switches off the second-chance pass that would let a student who got none of
// their picks take a seat from someone later in line; the inputs for it are
// hidden in the UI. Raising it here re-enables that pass.
const DEFAULT_MATCHING_SETTINGS = {
  seatsPerTable: 8,
  maxPerMajor: 4,
  protectedPercent: 100,
  canBumpPercent: 0,
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

const TABLE_PAGE_SIZE = 6;
const REG_PAGE_SIZE = 10;

// Attending this many of the five "Prep for EWI" workshops earns priority in
// matching. Counts are imported from the attendance exports by
// functions/import-workshops.js.
const WORKSHOP_PRIORITY_THRESHOLD = 4;

// A few students registered twice under different email addresses, which the
// form's duplicate check can't catch because registrations are keyed by email.
// Both records are kept, but matching should see each student once — and the
// algorithm itself keys students by name, so duplicates would collide there.
// The most recent registration wins, as it holds their latest preferences.
const dedupeByStudent = (registrations) => {
  const byStudent = new Map();
  for (const r of registrations) {
    const key = String(r.uid || "").trim() || (r.fullName || "").trim().toLowerCase();
    if (!key) continue;
    const existing = byStudent.get(key);
    const time = r.createdAt?.toMillis?.() ?? 0;
    if (!existing || time > (existing.createdAt?.toMillis?.() ?? 0)) byStudent.set(key, r);
  }
  return [...byStudent.values()];
};

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
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [error, setError] = useState(null);
  const [editingCapacityId, setEditingCapacityId] = useState(null);
  const [capacityDraft, setCapacityDraft] = useState("");
  const [showAddCompany, setShowAddCompany] = useState(false);
  const [newCompanyName, setNewCompanyName] = useState("");
  const [newCompanyCapacity, setNewCompanyCapacity] = useState("");
  const [matchingResults, setMatchingResults] = useState(null);
  // Results render below the settings, so scroll them into view once a run
  // finishes — otherwise it looks like nothing happened.
  const matchingResultsRef = useRef(null);
  const [matchingLoading, setMatchingLoading] = useState(false);
  const [matchingError, setMatchingError] = useState(null);
  const [showMatchingConfirm, setShowMatchingConfirm] = useState(false);
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

  const capacityTables = tablesFromCapacity(companies, matchingSettings);
  const capacityTableNames = new Set(capacityTables.map((table) => table.company));

  // How the last run turned out: seated, how many got their top pick, and
  // whether anyone was left out. Students are matched back by name, which is
  // what the algorithm returns.
  const matchingSummary = (() => {
    if (!matchingResults) return { seated: 0, firstChoice: 0, unseated: 0 };
    const firstChoiceByName = new Map(
      registrations.map((r) => [
        (r.fullName || "").trim().toLowerCase(),
        (r.companyPreferences || []).filter(Boolean)[0],
      ])
    );
    let seated = 0;
    let firstChoice = 0;
    for (const [company, data] of Object.entries(matchingResults)) {
      for (const name of data.students || []) {
        seated += 1;
        const theirFirst = firstChoiceByName.get((name || "").trim().toLowerCase());
        if (normalizeCompanyName(theirFirst) === normalizeCompanyName(company)) firstChoice += 1;
      }
    }
    return { seated, firstChoice, unseated: Math.max(0, dedupeByStudent(registrations).length - seated) };
  })();

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
        .then((snap) => setRegistrations(snap.docs.map((d) => d.data())))
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

  useEffect(() => {
    if (matchingResults) {
      matchingResultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [matchingResults]);

  const handleSignIn = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error("Sign in failed:", err);
    }
  };

  const handleSignOut = () => signOut(auth);

  const handleRunMatching = async () => {
    setShowMatchingConfirm(false);
    setMatchingLoading(true);
    setMatchingError(null);
    setMatchingResults(null);
    try {
      const students = dedupeByStudent(registrations)
        // Students who attended 4 of 5 prep workshops are promised their top
        // company choice, so they go first; everyone else is first come,
        // first serve by registration time.
        .sort((a, b) => {
          const aQualifies = (a.workshopsAttended ?? 0) >= WORKSHOP_PRIORITY_THRESHOLD;
          const bQualifies = (b.workshopsAttended ?? 0) >= WORKSHOP_PRIORITY_THRESHOLD;
          if (aQualifies !== bQualifies) return aQualifies ? -1 : 1;
          return (a.createdAt?.toMillis?.() ?? 0) - (b.createdAt?.toMillis?.() ?? 0);
        })
        .map((r) => ({
          fullName: r.fullName,
          major: r.major === "Other" ? r.otherMajor : r.major,
          year: YEAR_LABELS[r.year] || r.year,
          role: r.positionType,
          isInternational: r.needSponsorship === "yes" ? "Yes" : "No",
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
      setMatchingResults(data.matches);
    } catch (err) {
      console.error("Matching error:", err);
      setMatchingError(err.message);
    } finally {
      setMatchingLoading(false);
    }
  };

  const handleExport = (val) => {
    if (!val) return;
    if (val === "meals") exportMealCSV(registrations);
    else if (val === "companies") exportCompanyPrefsCSV(registrations);
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

  const attending = registrations.filter((r) => r.status === "registered").length;
  const onWaitList = registrations.filter((r) => r.status === "waitlisted").length;
  const onWillCall = registrations.filter((r) => r.willCall).length;

  const sortedFiltered = registrations
    .filter((r) => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        (r.fullName || "").toLowerCase().includes(q) ||
        (r.uid || "").toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      if (sortBy === "name") return (a.fullName || "").localeCompare(b.fullName || "");
      if (sortBy === "status") return (a.status || "").localeCompare(b.status || "");
      if (sortBy === "year") return (a.year || "").localeCompare(b.year || "");
      if (sortBy === "major") return (a.major || "").localeCompare(b.major || "");
      return 0;
    });

  const companiesWithStats = companies
    .map((company) => ({
      ...company,
      firstChoiceCount: registrations.filter(
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
  }, [searchQuery, sortBy, registrations.length]);

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
          {["companies", "majors", "years"].map((tab) => (
            <button
              key={tab}
              className={`filter-btn ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === "companies" ? "Companies" : tab === "majors" ? "Majors" : "Years"}
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
              <div className="admin-matching-intro">
                <h2 id="admin-matching-title" className="admin-matching-title">
                  Table Matching
                </h2>
                <p className="admin-matching-desc">
                  Runs the sorting algorithm against all current student registrations.
                </p>
              </div>
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
                {capacityTables.length > 0 && (
                  <p
                    className={`matching-override-note${
                      capacityTables.length === companies.length ? " is-warning" : ""
                    }`}
                  >
                    {capacityTables.length === companies.length
                      ? `Warning: all ${companies.length} companies have their own seat count, so the settings below aren't used.`
                      : `${capacityTables.length} of ${companies.length} companies have their own seat count and ignore the settings below.`}
                  </p>
                )}
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
                  {/* The "can't lose their seat" / "can take someone's seat"
                      inputs lived here. They only applied to students who got
                      none of their ten picks, which can't happen while there
                      are more seats than students, and the rule they encoded —
                      a later student taking an earlier one's seat — is not the
                      one we want. DEFAULT_MATCHING_SETTINGS switches the pass
                      off; restore these inputs to tune it again. */}
                </div>

                <div className="matching-large-tables">
                  <div className="setting-subhead">
                    <div className="setting-label">
                      <span>Custom tables</span>
                      <InfoTip id="hint-large-tables">
                        A company appears here when its capacity — set on the
                        Companies tab — is different from Seats per table. Its
                        max of one major scales to match. To give a company a
                        size that isn't its capacity, add a row for it.
                      </InfoTip>
                    </div>
                  </div>
                  <p className="setting-subhead-note">Overrides both settings above</p>
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
              {matchingResults && (
                <div className="admin-matching-results" ref={matchingResultsRef}>
                  <div className="matching-results-head">
                    <p className="matching-results-summary">
                      {matchingSummary.seated} students seated ·{" "}
                      {matchingSummary.firstChoice} got their first choice
                      {matchingSummary.unseated > 0
                        ? ` · ${matchingSummary.unseated} not seated`
                        : ""}
                    </p>
                    <button
                      type="button"
                      className="matching-download-btn"
                      onClick={() => exportMatchingCSV(matchingResults, registrations)}
                    >
                      Download table assignments (CSV)
                    </button>
                  </div>
                  <div className="admin-table-wrapper">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>company</th>
                          <th># students</th>
                          <th>students</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(matchingResults).map(([company, data]) => (
                          <tr key={company}>
                            <td>{company}</td>
                            <td>{data.students.length}</td>
                            <td>{data.students.join(", ") || "—"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
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
              data={Object.entries(
                registrations.reduce((acc, r) => {
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
              data={Object.entries(
                registrations.reduce((acc, r) => {
                  const y = r.year || "Unknown";
                  acc[y] = (acc[y] || 0) + 1;
                  return acc;
                }, {})
              ).map(([name, value]) => ({ name, value }))}
            />
          )}

          <div className="admin-search-row">
            <input
              className="admin-search-input"
              type="text"
              placeholder="Search name/uid"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
          </div>
          <div className="admin-table-wrapper">
            <table className="admin-table registrations-table">
              <thead>
                <tr>
                  <th>name</th>
                  <th>major/yr</th>
                  <th>status</th>
                  <th>top choice</th>
                </tr>
              </thead>
              <tbody>
                {sortedFiltered.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="admin-empty">No registrations found.</td>
                  </tr>
                ) : (
                  pagedRegistrations.map((r, i) => {
                    const rowKey = r.email || r.uid || `${r.fullName}-${i}`;
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
                            <span className={`status-badge ${r.status || "unknown"}`}>
                              {r.status || "—"}
                            </span>
                          </td>
                          <td>{r.companyPreferences?.[0] || "—"}</td>
                        </tr>
                        {open && (
                          <tr className="admin-prefs-row">
                            <td colSpan={4} id={`reg-prefs-${safeRegsPage}-${i}`}>
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
