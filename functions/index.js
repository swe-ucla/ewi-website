const {setGlobalOptions} = require("firebase-functions");
const {onDocumentWritten, onDocumentCreated} = require("firebase-functions/firestore");
const logger = require("firebase-functions/logger");
const {initializeApp} = require("firebase-admin/app");
const {getFirestore} = require("firebase-admin/firestore");

initializeApp();
const db = getFirestore();

// cap how many copies/containers of the function that will run at once
setGlobalOptions({maxInstances: 10});

// recount every company's firstChoiceCount from the actual Registrations rows
async function recomputeFirstChoiceCounts() {
  await db.runTransaction(async (tx) => {
    
    const registrationsSnap = await tx.get(db.collection("Registrations"));
    const companiesSnap = await tx.get(db.collection("Companies"));

    const tally = {};
    registrationsSnap.forEach((doc) => {
      const firstChoice = doc.data().companyPreferences?.[0];
      if (firstChoice) tally[firstChoice] = (tally[firstChoice] || 0) + 1;
    });

    companiesSnap.forEach((doc) => {
      const correctCount = tally[doc.data().name] || 0;
      if (doc.data().firstChoiceCount !== correctCount) {
        tx.update(doc.ref, {firstChoiceCount: correctCount});
      }
    });
  });
  logger.info("Recomputed first-choice counts");
}

// runs on every registration create, overwrite, and delete
exports.onRegistrationWritten = onDocumentWritten("Registrations/{email}", async (event) => {
  const before = event.data.before.data()?.companyPreferences?.[0];
  const after = event.data.after.data()?.companyPreferences?.[0];
  if (before === after) return; // first choice unchanged, counts unaffected
  await recomputeFirstChoiceCounts();
});

// a newly added company should pick up any registrations that already list it first
exports.onCompanyCreated = onDocumentCreated("Companies/{name}", async () => {
  await recomputeFirstChoiceCounts();
});
