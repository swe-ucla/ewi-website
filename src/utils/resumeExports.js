import JSZip from "jszip";
import { db } from "../firebase"; 
import { collection, getDocs } from "firebase/firestore";

// get registrations from firebase and sort by firstname
const getAllRegistrationsWithResumes = async () => {
  const snapshot = await getDocs(collection(db, "Registrations"));
  return snapshot.docs
    .map((doc) => doc.data())
    .filter((reg) => reg.resume) 
    .sort((a, b) => (a.fullName || "").localeCompare(b.fullName || "")); 
};


const sanitizeFilename = (name) => {
  return (name || "unknown").replace(/[^a-zA-Z0-9._-]/g, "_"); 
};

// get original filename for export, if field is empty then just use fullName
const getResumeFilename = (reg) => {
  if (reg.resumeFilename) {
    return sanitizeFilename(reg.resumeFilename);
  }
  const safeName = sanitizeFilename(reg.fullName || "unknown");
  return `${safeName}.pdf`;
};

// fetch file from cloudinary
const fetchFileBlob = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch file: ${url}`);
  }
  return await response.blob();
};

// export all resumes
export const exportAllResumesZip = async () => {
  const registrations = await getAllRegistrationsWithResumes();
  const zip = new JSZip();
  const usedNames = new Set(); // track names already used, to avoid overwrites

  for (const reg of registrations) {
    try {
      const blob = await fetchFileBlob(reg.resume);
      let filename = getResumeFilename(reg);

      // if two people ended up with the same filename, add their email rather than overwrite
      if (usedNames.has(filename)) {
        const base = filename.replace(/\.pdf$/i, "");
        filename = `${base}_${reg.email}.pdf`;
      }
      usedNames.add(filename);

      zip.file(filename, blob);
    } catch (error) {
      console.error(`Skipping resume for ${reg.fullName}:`, error);
    }
  }

  const zipBlob = await zip.generateAsync({ type: "blob" });
  triggerDownload(zipBlob, "all_resumes.zip");
};

// export all resumes separated by majors
export const exportResumesByMajorZip = async () => {
  const registrations = await getAllRegistrationsWithResumes();
  const zip = new JSZip();
  const usedNamesPerFolder = {}; // track used names per-folder, since duplicates across different folders are fine

  for (const reg of registrations) {
    try {
      const blob = await fetchFileBlob(reg.resume);
      const majorFolderName = sanitizeFilename(reg.major || "Unspecified");
      let filename = getResumeFilename(reg);

      if (!usedNamesPerFolder[majorFolderName]) {
        usedNamesPerFolder[majorFolderName] = new Set();
      }
      if (usedNamesPerFolder[majorFolderName].has(filename)) {
        const base = filename.replace(/\.pdf$/i, "");
        filename = `${base}_${reg.email || Math.random().toString(36).slice(2, 6)}.pdf`;
      }
      usedNamesPerFolder[majorFolderName].add(filename);

      // zip.folder(name) creates (or reuses) a folder inside the zip
      zip.folder(majorFolderName).file(filename, blob);
    } catch (error) {
      console.error(`Skipping resume for ${reg.fullName}:`, error);
    }
  }

  const zipBlob = await zip.generateAsync({ type: "blob" });
  triggerDownload(zipBlob, "resumes_by_major.zip");
};

// download from browser
const triggerDownload = (blob, filename) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url); // clean up the temporary URL after use
};