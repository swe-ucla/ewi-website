import React, { useState, useEffect } from "react";
import "./Admin.css";
import { db, auth } from "../firebase";
import { collection, getDocs, doc, getDoc, setDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import PieChartView from "../components/admin/PieChartView";
import { exportMealCSV, exportCompanyPrefsCSV, exportAllCSV } from "../components/admin/adminExports";
import { exportResumesByMajorZip, exportAllResumesZip } from "../utils/resumeExports";

const provider = new GoogleAuthProvider();


const Admin = () => {
  const [user, setUser] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [registrations, setRegistrations] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("companies");
  const [confirmRemove, setConfirmRemove] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [error, setError] = useState(null);
  const [editingCapacityId, setEditingCapacityId] = useState(null);
  const [capacityDraft, setCapacityDraft] = useState("");
  const [newCompanyName, setNewCompanyName] = useState("");
  const [newCompanyCapacity, setNewCompanyCapacity] = useState("");

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
    fetchData();
  }, [isAuthorized]);

  const handleSignIn = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error("Sign in failed:", err);
    }
  };

  const handleSignOut = () => signOut(auth);

  const handleExport = (e) => {
    const val = e.target.value;
    if (val === "meals") exportMealCSV(registrations);
    else if (val === "companies") exportCompanyPrefsCSV(registrations);
    else if (val === "all") exportAllCSV(registrations);
    else if (val === "resumes") exportAllResumesZip();
    else if (val === "resumes-by-major") exportResumesByMajorZip();
    e.target.value = "";
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

      {dataLoading ? (
        <p className="admin-loading-text">Loading registrations...</p>
      ) : (
        <>
          {activeTab === "companies" && (
            <>
              <form className="admin-add-company-row" onSubmit={handleAddCompany}>
                <input
                  className="admin-search-input"
                  type="text"
                  placeholder="Company name"
                  value={newCompanyName}
                  onChange={(e) => setNewCompanyName(e.target.value)}
                />
                <input
                  className="admin-search-input capacity-input"
                  type="number"
                  min="0"
                  placeholder="Capacity (optional)"
                  value={newCompanyCapacity}
                  onChange={(e) => setNewCompanyCapacity(e.target.value)}
                />
                <button type="submit" className="add-company-btn">+ Add Company</button>
              </form>

              <div className="admin-table-wrapper companies-table-wrapper">
                <table className="admin-table companies-table">
                  <thead>
                    <tr>
                      <th>company</th>
                      <th>capacity</th>
                      <th># of first choices</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {companies.map((company) => (
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
                            <span
                              className="capacity-display"
                              onClick={() => startEditingCapacity(company)}
                            >
                              {company.capacity ?? "—"}
                            </span>
                          )}
                        </td>
                        <td data-label="# of first choices">
                          {registrations.filter((r) => r.companyPreferences?.[0] === company.name).length}
                        </td>
                        <td className="remove-cell">
                          <button className="remove-btn" onClick={() => setConfirmRemove(company)}>remove</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
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
              <option value="resumes">Export Resumes</option>
              <option value="resumes-by-major">Export Resumes by Major</option>
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
