const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://theinnercode-1a595.firebaseio.com" // Project ID
});

module.exports = admin;
