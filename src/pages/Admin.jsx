import React, { useState, useEffect } from "react";
import "./Admin.css";
import { db, auth } from "../firebase";
import { collection, getDocs, doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import PieChartView from "../components/admin/PieChartView";
import { exportMealCSV, exportCompanyPrefsCSV, exportAllCSV } from "../components/admin/adminExports";
import companiesData from "../data/companies.json";

const provider = new GoogleAuthProvider();
const COMPANIES = companiesData.companies;
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


const InfoTip = ({ children }) => {
  const [open, setOpen] = useState(false);
  return (
    <span className="info-tip" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button type="button" className="info-tip-btn" aria-label="What does this mean?" aria-expanded={open}
        onClick={() => setOpen(true)} onBlur={() => setOpen(false)}
        onKeyDown={(e) => e.key === "Escape" && setOpen(false)}>?</button>
      {open && <span className="info-tip-text" role="tooltip">{children}</span>}
    </span>
  );
};

const Admin = () => {
  const [user, setUser] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [registrations, setRegistrations] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("companies");
  const [confirmRemove, setConfirmRemove] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [error, setError] = useState(null);
  const [matchingResults, setMatchingResults] = useState(null);
  const [matchingLoading, setMatchingLoading] = useState(false);
  const [matchingError, setMatchingError] = useState(null);
  const [showMatchingConfirm, setShowMatchingConfirm] = useState(false);
  const [matchingSettings, setMatchingSettings] = useState(DEFAULT_MATCHING_SETTINGS);
  const [savedSettings, setSavedSettings] = useState(DEFAULT_MATCHING_SETTINGS);
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [settingsError, setSettingsError] = useState(null);
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
      try {
        const snapshot = await getDocs(collection(db, "Registrations"));
        setRegistrations(snapshot.docs.map((d) => d.data()));
      } catch (err) {
        setError("Failed to load registrations. Check Firestore rules.");
        console.error(err);
      } finally {
        setDataLoading(false);
      }
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

      const companies = COMPANIES.map((name) => ({
        name,
        rolesHired: "",
        majorsHired: "",
        requiresCitizenship: "",
      }));

      const idToken = await user.getIdToken();
      const res = await fetch(`${process.env.REACT_APP_FIREBASE_FUNCTIONS_URL}/runMatchingAlgorithm`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${idToken}` },
        body: JSON.stringify({
          students,
          companies,
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

  const handleExport = (e) => {
    const val = e.target.value;
    if (val === "meals") exportMealCSV(registrations);
    else if (val === "companies") exportCompanyPrefsCSV(registrations);
    else if (val === "all") exportAllCSV(registrations);
    e.target.value = "";
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

  if (authLoading) {
    return <div className="admin-center"><p className="admin-loading-text">Loading...</p></div>;
  }

  if (!user) {
    return (
      <div className="admin-center">
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
      <div className="admin-center">
        <div className="admin-login-card">
          <h1>Access Denied</h1>
          <p><strong>{user.email}</strong> is not authorized to access this page.</p>
          <button className="admin-signout-btn" onClick={handleSignOut}>Sign out</button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <div className="admin-header-right">
          <span className="admin-user">{user.email}</span>
          <button className="admin-signout-btn" onClick={handleSignOut}>Sign out</button>
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

      <div className="admin-tabs">
        {["companies", "majors", "years", "matching"].map((tab) => (
          <button
            key={tab}
            className={`filter-btn ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === "companies" ? "Companies" : tab === "majors" ? "Majors" : tab === "years" ? "Years" : "Run Matching"}
          </button>
        ))}
      </div>

      {dataLoading ? (
        <p className="admin-loading-text">Loading registrations...</p>
      ) : (
        <>
          {activeTab === "companies" && (
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>company</th>
                    <th>capacity</th>
                    <th># of first choices</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {COMPANIES.map((company) => (
                    <tr key={company}>
                      <td>{company}</td>
                      <td>—</td>
                      <td>
                        {registrations.filter((r) => r.companyPreferences?.[0] === company).length}
                      </td>
                      <td>
                        <button className="remove-btn" onClick={() => setConfirmRemove(company)}>remove</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "majors" && (
            <PieChartView
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
              data={Object.entries(
                registrations.reduce((acc, r) => {
                  const y = r.year || "Unknown";
                  acc[y] = (acc[y] || 0) + 1;
                  return acc;
                }, {})
              ).map(([name, value]) => ({ name, value }))}
            />
          )}

          {activeTab === "matching" && (
            <div className="admin-matching">
              <p className="admin-matching-desc">Runs the table sorting algorithm against all current student registrations.</p>
              <fieldset className="matching-settings">
                <legend>Settings</legend>

                <div className="setting-row">
                  <label htmlFor="seatsPerTable">Seats per table</label>
                  <InfoTip>How many students sit at each company's table.</InfoTip>
                  <input id="seatsPerTable" type="number" min="1" value={matchingSettings.seatsPerTable}
                    onChange={(e) => updateSetting("seatsPerTable", e.target.value)} />
                </div>
                <div className="setting-row">
                  <label htmlFor="maxPerMajor">Max of one major per table</label>
                  <InfoTip>
                    No more than this many students with the same major at one table, so each company meets
                    a mix of majors. With 4, a table can't have 5 Computer Science students.
                  </InfoTip>
                  <input id="maxPerMajor" type="number" min="1" value={matchingSettings.maxPerMajor}
                    onChange={(e) => updateSetting("maxPerMajor", e.target.value)} />
                </div>
                <div className="setting-row">
                  <label htmlFor="protectedPercent">Can't lose their seat</label>
                  <InfoTip>
                    Students are lined up by when they signed up (#1 signed up first). The first {matchingSettings.protectedPercent}% of the line
                    keep whatever seat they get. Right now that's {lineSpots(lockedCount).toLowerCase()} of {registrations.length}.
                  </InfoTip>
                  <span className="setting-input">
                    <input id="protectedPercent" type="number" min="0" max="100" value={matchingSettings.protectedPercent}
                      onChange={(e) => updateSetting("protectedPercent", e.target.value)} />
                    <span>%</span>
                  </span>
                </div>
                <div className="setting-row">
                  <label htmlFor="canBumpPercent">Can take someone's seat</label>
                  <InfoTip>
                    If someone in the first {matchingSettings.canBumpPercent}% of the line gets none of their picks, they can take a seat from a
                    student later in line who ranked that company only 3rd or 4th. Right now
                    that's {lineSpots(secondChanceCount).toLowerCase()} of {registrations.length}.
                  </InfoTip>
                  <span className="setting-input">
                    <input id="canBumpPercent" type="number" min="0" max="100" value={matchingSettings.canBumpPercent}
                      onChange={(e) => updateSetting("canBumpPercent", e.target.value)} />
                    <span>%</span>
                  </span>
                </div>

                <div className="setting-subhead">
                  <span>Larger tables</span>
                  <InfoTip>Companies hosting a bigger table get their own limits instead of the ones above.</InfoTip>
                </div>
                {matchingSettings.largeTables.length > 0 && (
                  <div className="large-table-head" aria-hidden="true">
                    <span>Company</span><span>Seats</span><span>Max of one major</span><span></span>
                  </div>
                )}
                {matchingSettings.largeTables.map((t, i) => (
                  <div className="large-table-row" key={i}>
                    <select id={`largeCompany${i}`} aria-label="Company" value={t.company}
                      onChange={(e) => updateLargeTable(i, "company", e.target.value)}>
                      <option value="">Select company</option>
                      {COMPANIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <input id={`largeSeats${i}`} aria-label="Seats" type="number" min="1" value={t.seats}
                      onChange={(e) => updateLargeTable(i, "seats", e.target.value)} />
                    <input id={`largeMajor${i}`} aria-label="Max of one major" type="number" min="1" value={t.maxPerMajor}
                      onChange={(e) => updateLargeTable(i, "maxPerMajor", e.target.value)} />
                    <button type="button" className="large-table-remove" aria-label="Remove larger table"
                      onClick={() => removeLargeTable(i)}>×</button>
                  </div>
                ))}
                <div className="matching-settings-actions">
                  <button type="button" className="remove-btn" onClick={addLargeTable}>+ add larger table</button>
                  <button type="button" className="remove-btn" onClick={() => setMatchingSettings(DEFAULT_MATCHING_SETTINGS)}>reset to defaults</button>
                  <button type="button" className="settings-save-btn" onClick={saveSettings}
                    disabled={!settingsChanged || settingsSaving}>
                    {settingsSaving ? "Saving..." : settingsChanged ? "Save settings" : "Saved"}
                  </button>
                </div>
                {settingsChanged && !settingsSaving && (
                  <p className="settings-unsaved">Unsaved changes. Runs use these values, but they reset on reload until you save.</p>
                )}
                {settingsError && <p className="admin-error">{settingsError}</p>}
              </fieldset>
              <button
                className="admin-signin-btn"
                onClick={() => setShowMatchingConfirm(true)}
                disabled={matchingLoading}
              >
                {matchingLoading ? "Running..." : "Run Matching Algorithm"}
              </button>
              {matchingError && <p className="admin-error" style={{ marginTop: "1rem" }}>{matchingError}</p>}
              {matchingResults && (
                <div className="admin-table-wrapper" style={{ marginTop: "1.5rem" }}>
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Company</th>
                        <th># Students</th>
                        <th>Students</th>
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
          )}

          <div className="admin-search-row">
            <input
              className="admin-search-input"
              type="text"
              placeholder="Search name/uid"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <select
              className="admin-sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="name">Sort by: Name</option>
              <option value="status">Sort by: Status</option>
              <option value="year">Sort by: Year</option>
              <option value="major">Sort by: Major</option>
            </select>
            <select className="admin-export-select" onChange={handleExport} defaultValue="">
              <option value="" disabled>Export...</option>
              <option value="meals">Export Meals</option>
              <option value="companies">Export Company Prefs</option>
              <option value="all">Export All</option>
            </select>
          </div>
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>major/Yr</th>
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
                  sortedFiltered.map((r, i) => (
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
        </>
      )}
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
            <p>Are you sure you want to delete <strong>{confirmRemove}</strong>?</p>
            <div className="modal-actions">
              <button className="modal-cancel" onClick={() => setConfirmRemove(null)}>Cancel</button>
              <button className="modal-delete" onClick={() => setConfirmRemove(null)}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
