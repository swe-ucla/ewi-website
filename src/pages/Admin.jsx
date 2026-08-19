import React, { useState, useEffect } from "react";
import "./Admin.css";
import { db, auth } from "../firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

const provider = new GoogleAuthProvider();

const escapeCSV = (val) => {
  if (val === null || val === undefined) return "";
  const str = String(val);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
};

const Admin = () => {
  const [user, setUser] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [registrations, setRegistrations] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [filter, setFilter] = useState("all");
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

  const filtered = registrations.filter((r) =>
    filter === "all" ? true : r.status === filter
  );

  const registered = registrations.filter((r) => r.status === "registered").length;
  const waitlisted = registrations.filter((r) => r.status === "waitlisted").length;
  const mealCounts = registrations.reduce((acc, r) => {
    if (r.meal) acc[r.meal] = (acc[r.meal] || 0) + 1;
    return acc;
  }, {});

  const exportCSV = () => {
    const headers = [
      "Full Name", "Email", "UID", "Status", "Pronouns", "Year", "Transfer",
      "Major", "Position Type", "Need Sponsorship", "Check-in Time",
      "National SWE ID", "Meal", "Dessert", "Dietary Restrictions",
      "Photo Consent", "Will Call",
      "Company Pref 1", "Company Pref 2", "Company Pref 3", "Company Pref 4",
      "Company Pref 5", "Company Pref 6", "Company Pref 7", "Company Pref 8",
      "Company Pref 9", "Company Pref 10",
      "Resume URL", "Membership Proof URL", "Additional Comments",
    ];

    const rows = registrations.map((r) =>
      [
        r.fullName, r.email, r.uid, r.status,
        r.pronouns === "other" ? r.otherPronouns : r.pronouns,
        r.year, r.transfer,
        r.major === "Other" ? r.otherMajor : r.major,
        r.positionType, r.needSponsorship, r.checkInTime,
        r.membershipId, r.meal, r.dessert, r.dietaryRestrictions,
        r.photoConsent ? "Yes" : "No", r.willCall,
        ...(r.companyPreferences || new Array(10).fill("")),
        r.resume, r.membershipProof, r.additionalComments,
      ].map(escapeCSV)
    );

    const csv = [headers.map(escapeCSV), ...rows]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ewi_registrations.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

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
        <h1>EWI Registrations</h1>
        <div className="admin-header-right">
          <span className="admin-user">{user.email}</span>
          <button className="admin-signout-btn" onClick={handleSignOut}>Sign out</button>
        </div>
      </div>

      <div className="admin-stats">
        <div className="stat-card registered">
          <span className="stat-num">{registered}</span>
          <span className="stat-label">Registered</span>
        </div>
        <div className="stat-card waitlisted">
          <span className="stat-num">{waitlisted}</span>
          <span className="stat-label">Waitlisted</span>
        </div>
        <div className="stat-card total">
          <span className="stat-num">{registrations.length}</span>
          <span className="stat-label">Total</span>
        </div>
        {Object.entries(mealCounts).map(([meal, count]) => (
          <div key={meal} className="stat-card meal">
            <span className="stat-num">{count}</span>
            <span className="stat-label">{meal.split("(")[0].trim()}</span>
          </div>
        ))}
      </div>

      <div className="admin-toolbar">
        <div className="admin-filters">
          {["all", "registered", "waitlisted"].map((f) => (
            <button
              key={f}
              className={`filter-btn ${filter === f ? "active" : ""}`}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
        <button className="export-btn" onClick={exportCSV}>
          Export CSV
        </button>
      </div>

      {error && <p className="admin-error">{error}</p>}

      {dataLoading ? (
        <p className="admin-loading-text">Loading registrations...</p>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>UID</th>
                <th>Status</th>
                <th>Year</th>
                <th>Major</th>
                <th>1st Choice</th>
                <th>2nd Choice</th>
                <th>3rd Choice</th>
                <th>Meal</th>
                <th>Check-in Time</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={11} className="admin-empty">
                    No registrations found.
                  </td>
                </tr>
              ) : (
                filtered.map((r, i) => (
                  <tr key={r.email || i}>
                    <td>{r.fullName}</td>
                    <td>{r.email}</td>
                    <td>{r.uid}</td>
                    <td>
                      <span className={`status-badge ${r.status || "unknown"}`}>
                        {r.status || "—"}
                      </span>
                    </td>
                    <td>{r.year}</td>
                    <td>{r.major === "Other" ? r.otherMajor : r.major}</td>
                    <td>{r.companyPreferences?.[0] || "—"}</td>
                    <td>{r.companyPreferences?.[1] || "—"}</td>
                    <td>{r.companyPreferences?.[2] || "—"}</td>
                    <td>{r.meal}</td>
                    <td>{r.checkInTime}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Admin;
