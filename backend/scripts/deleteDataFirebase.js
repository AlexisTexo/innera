const admin = require("firebase-admin");
const serviceAccount = require("../serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://theinnercode-1a595.firebaseio.com"
});

const db = admin.firestore();

// Lista de todas las colecciones que quieres limpiar
const collections = [
  "Users",
  "Archetypes",
  "Logbook",
  "TriggerQuestions",
  "WeeklySummary",
  "DataUser",
  "Notifications",
  "Purpose",
  "InnerBluePrint" ,
  "Personality",
  "TestUsers",
];

async function deleteAllData() {
  for (const collectionName of collections) {
    const snapshot = await db.collection(collectionName).get();

    if (snapshot.empty) {
      console.log(`${collectionName} está vacía`);
      continue;
    }

    const batchSize = 500;
    let deleted = 0;

    // Borra en lotes por límites de Firestore
    while (!snapshot.empty) {
      const batch = db.batch();
      snapshot.docs.slice(0, batchSize).forEach(doc => {
        batch.delete(doc.ref);
      });
      await batch.commit();
      deleted += Math.min(snapshot.size, batchSize);
      console.log(`${deleted} documentos eliminados de ${collectionName}`);
      if (snapshot.size < batchSize) break;
    }
  }

  console.log("Todas las colecciones han sido limpiadas.");
}

deleteAllData().catch(console.error);