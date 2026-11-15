const escapeCSV = (val) => {
  if (val === null || val === undefined) return "";
  const str = String(val);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
};

const timestamp = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}_${String(d.getHours()).padStart(2,"0")}${String(d.getMinutes()).padStart(2,"0")}`;
};

const downloadCSV = (rows, filename) => {
  const [name, ext] = filename.split(".");
  filename = `${name}_${timestamp()}.${ext}`;
  const csv = rows.map((row) => row.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

// export const exportMealCSV = (registrations) => {
//   const headers = ["Full Name", "Email", "Status", "Pronouns", "Meal", "Dessert", "Dietary Restrictions"];
//   const rows = registrations.map((r) =>
//     [
//       r.fullName, r.email, r.status,
//       r.pronouns === "other" ? r.otherPronouns : r.pronouns,
//       r.meal, r.dessert, r.dietaryRestrictions,
//     ].map(escapeCSV)
//   );
//   downloadCSV([headers, ...rows], "ewi_meal_preferences.csv");
// };

export const exportMealCSV = (registrations) => {
  const headers = ["Full Name", "Email", "Status", "Pronouns", "Meal", "Dietary Restrictions"];
  const rows = registrations.map((r) =>
    [
      r.fullName, r.email, r.status,
      r.pronouns === "other" ? r.otherPronouns : r.pronouns,
      r.meal ? "Vegan" : "Vegetarian", r.dietaryRestrictions,
    ].map(escapeCSV)
  );
  downloadCSV([headers, ...rows], "ewi_meal_preferences.csv");
};

export const exportCompanyPrefsCSV = (registrations) => {
  const headers = [
    "Full Name", "Email", "Status", "Year", "Major",
    "Company Pref 1", "Company Pref 2", "Company Pref 3", "Company Pref 4", "Company Pref 5",
    "Company Pref 6", "Company Pref 7", "Company Pref 8", "Company Pref 9", "Company Pref 10",
  ];
  const rows = registrations.map((r) =>
    [
      r.fullName, r.email, r.status, r.year,
      r.major === "Other" ? r.otherMajor : r.major,
      ...(r.companyPreferences || new Array(10).fill("")),
    ].map(escapeCSV)
  );
  downloadCSV([headers, ...rows], "ewi_company_preferences.csv");
};

// export const exportAllCSV = (registrations) => {
//   const headers = [
//     "Full Name", "Email", "UID", "Status", "Pronouns", "Year", "Transfer",
//     "Major", "Position Type", "Need Sponsorship", "Check-in Time",
//     "National SWE ID", "Meal", "Dessert", "Dietary Restrictions",
//     "Photo Consent", "Will Call",
//     "Company Pref 1", "Company Pref 2", "Company Pref 3", "Company Pref 4",
//     "Company Pref 5", "Company Pref 6", "Company Pref 7", "Company Pref 8",
//     "Company Pref 9", "Company Pref 10",
//     "Resume URL", "Membership Proof URL", "Additional Comments",
//   ];
//   const rows = registrations.map((r) =>
//     [
//       r.fullName, r.email, r.uid, r.status,
//       r.pronouns === "other" ? r.otherPronouns : r.pronouns,
//       r.year, r.transfer,
//       r.major === "Other" ? r.otherMajor : r.major,
//       r.positionType, r.needSponsorship, r.checkInTime,
//       r.membershipId, r.meal, r.dessert, r.dietaryRestrictions,
//       r.photoConsent ? "Yes" : "No", r.willCall,
//       ...(r.companyPreferences || new Array(10).fill("")),
//       r.resume, r.membershipProof, r.additionalComments,
//     ].map(escapeCSV)
//   );
//   downloadCSV([headers, ...rows], "ewi_registrations.csv");
// };

export const exportAllCSV = (registrations) => {
  const headers = [
    "Full Name", "Email", "UID", "Status", "Pronouns", "Year", "Transfer",
    "Major", "Position Type", "Need Sponsorship", "Check-in Time",
    "National SWE ID", "Meal", "Dietary Restrictions",
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
      r.membershipId,
      r.meal ? "Vegan" : "Vegetarian", r.dietaryRestrictions,
      r.photoConsent ? "Yes" : "No", r.willCall,
      ...(r.companyPreferences || new Array(10).fill("")),
      r.resume, r.membershipProof, r.additionalComments,
    ].map(escapeCSV)
  );
  downloadCSV([headers, ...rows], "ewi_registrations.csv");
};

// Table assignments from a matching run, one row per student. The algorithm
// returns student names only, so the rest comes from their registration.
export const exportMatchingCSV = (matchingResults, registrations) => {
  const byName = new Map(
    registrations.map((r) => [(r.fullName || "").trim().toLowerCase(), r])
  );

  const headers = [
    "Company", "Rep 1", "Rep 2", "Full Name", "Email", "UID",
    "Year", "Major", "Position Type", "Workshops Attended",
    "Choice Rank", "Dietary Restrictions",
  ];

  const rows = [];
  for (const [company, data] of Object.entries(matchingResults)) {
    for (const studentName of data.students || []) {
      const r = byName.get((studentName || "").trim().toLowerCase()) || {};
      const prefs = (r.companyPreferences || []).filter(Boolean);
      const rank = prefs.indexOf(company);
      rows.push(
        [
          company, data.rep1, data.rep2, studentName, r.email, r.uid,
          r.year, r.major === "Other" ? r.otherMajor : r.major,
          r.positionType, r.workshopsAttended ?? 0,
          rank === -1 ? "not ranked" : `#${rank + 1}`,
          r.dietaryRestrictions,
        ].map(escapeCSV)
      );
    }
  }

  rows.sort((a, b) => a[0].localeCompare(b[0]) || a[3].localeCompare(b[3]));
  downloadCSV([headers, ...rows], "ewi_table_assignments.csv");
};
