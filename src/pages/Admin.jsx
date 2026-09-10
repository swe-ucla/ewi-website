import React, { useState, useEffect } from "react";
import "./Admin.css";
import { db, auth } from "../firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import PieChartView from "../components/admin/PieChartView";
import { exportMealCSV, exportCompanyPrefsCSV, exportAllCSV } from "../components/admin/adminExports";
import companiesData from "../data/companies.json";

const provider = new GoogleAuthProvider();
const COMPANIES = companiesData.companies;


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
