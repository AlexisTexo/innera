// delete-all-auth-users.js
const admin = require("firebase-admin");
const serviceAccount = require("../serviceAccountKey.json"); // ajusta la ruta si es necesario

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

async function deleteAllUsers() {
  let nextPageToken;
  let total = 0;

  do {
    const { users, pageToken } = await admin.auth().listUsers(1000, nextPageToken);
    nextPageToken = pageToken;

    const uids = users.map(u => u.uid);
    if (uids.length) {
      const res = await admin.auth().deleteUsers(uids);
      total += res.successCount;
      console.log(`[AUTH] Eliminados: +${res.successCount}, Fallidos: ${res.failureCount}`);
      (res.errors || []).forEach(e =>
        console.error(`[AUTH][ERR] idx=${e.index} -> ${e.error?.message}`)
      );
    }
  } while (nextPageToken);

  console.log(`[AUTH] COMPLETADO. Usuarios eliminados: ${total}`);
}

deleteAllUsers().catch(err => {
  console.error(err);
  process.exit(1);
});
