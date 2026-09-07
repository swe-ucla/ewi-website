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

export const exportMealCSV = (registrations) => {
  const headers = ["Full Name", "Email", "Status", "Pronouns", "Meal", "Dessert", "Dietary Restrictions"];
  const rows = registrations.map((r) =>
    [
      r.fullName, r.email, r.status,
      r.pronouns === "other" ? r.otherPronouns : r.pronouns,
      r.meal, r.dessert, r.dietaryRestrictions,
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

export const exportAllCSV = (registrations) => {
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
  downloadCSV([headers, ...rows], "ewi_registrations.csv");
};
