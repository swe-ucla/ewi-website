import React, { useState, useEffect } from "react";
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
const DEFAULT_MATCHING_SETTINGS = {
  seatsPerTable: 8,
  maxPerMajor: 4,
  protectedPercent: 40,
  canBumpPercent: 60,
  largeTables: [],
};
const YEAR_LABELS = {
  "grad-student-masters": "Grad Student - Master's",
  "grad-student-phd": "Grad Student - PhD",
};

const TABLE_PAGE_SIZE = 6;

const pageItems = (items, page, size = TABLE_PAGE_SIZE) => {
  const start = page * size;
  return items.slice(start, start + size);
};

const pageCount = (total, size = TABLE_PAGE_SIZE) =>
  Math.max(1, Math.ceil(total / size));

const AdminPager = ({ page, totalItems, onChange, label }) => {
  const pages = pageCount(totalItems);
  if (totalItems <= TABLE_PAGE_SIZE) return null;

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
  const [matchingLoading, setMatchingLoading] = useState(false);
  const [matchingError, setMatchingError] = useState(null);
  const [showMatchingConfirm, setShowMatchingConfirm] = useState(false);
  const [matchingSettings, setMatchingSettings] = useState(DEFAULT_MATCHING_SETTINGS);
  const [savedSettings, setSavedSettings] = useState(DEFAULT_MATCHING_SETTINGS);
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [settingsError, setSettingsError] = useState(null);
  const [companyPage, setCompanyPage] = useState(0);
  const [regsPage, setRegsPage] = useState(0);
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

  // Mirrors the cutoffs in functions/index.js; the locked cutoff includes one extra student, as in the original script
  const lineCount = (percent, locked = false) => {
    const total = registrations.length;
    const cutoff = Math.floor(total * ((Number(percent) || 0) / 100));
    return locked ? Math.min(total, cutoff + 1) : cutoff;
  };
  const lineSpots = (count) => (count === 0 ? "Nobody" : count === 1 ? "Student #1" : `Students #1–${count}`);
  const lockedCount = lineCount(matchingSettings.protectedPercent, true);
  const secondChanceCount = lineCount(matchingSettings.canBumpPercent);

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
      const students = [...registrations]
        .sort((a, b) => (a.submittedAt?.toMillis?.() ?? 0) - (b.submittedAt?.toMillis?.() ?? 0))
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
              matchingSettings.largeTables
                .filter((t) => t.company)
                .map((t) => [t.company, { seats: t.seats, maxPerMajor: t.maxPerMajor }])
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
  const safeRegsPage = Math.min(regsPage, pageCount(sortedFiltered.length) - 1);
  const pagedCompanies = pageItems(companiesWithStats, safeCompanyPage);
  const pagedRegistrations = pageItems(sortedFiltered, safeRegsPage);

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
                          their seat — {lineSpots(lockedCount).toLowerCase()} of {registrations.length} right now.
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
                          {lineSpots(secondChanceCount).toLowerCase()} of {registrations.length} right now.
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
                      <span>Larger tables</span>
                      <InfoTip id="hint-large-tables">
                        Companies with a bigger table use their own seat and major limits.
                      </InfoTip>
                    </div>
                  </div>
                  {matchingSettings.largeTables.length > 0 && (
                    <div className="large-table-head" aria-hidden="true">
                      <span>Company</span>
                      <span>Seats</span>
                      <span>Max major</span>
                      <span />
                    </div>
                  )}
                  {matchingSettings.largeTables.map((t, i) => (
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
                        aria-label="Remove larger table"
                        onClick={() => removeLargeTable(i)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <button type="button" className="matching-link-btn" onClick={addLargeTable}>
                    + Add larger table
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
                <div className="admin-table-wrapper admin-matching-results">
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
            <table className="admin-table">
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
                  pagedRegistrations.map((r, i) => (
                    <tr key={r.email || i}>
                      <td>{r.fullName}</td>
                      <td>{(r.major === "Other" ? r.otherMajor : r.major) || "—"} / {r.year || "—"}</td>
                      <td>
                        <span className={`status-badge ${r.status || "unknown"}`}>
                          {r.status || "—"}
                        </span>
                      </td>
                      <td>{r.companyPreferences?.[0] || "—"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <AdminPager
            page={safeRegsPage}
            totalItems={sortedFiltered.length}
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
