/**
 * Recrea la colección TestUsers en Firestore con un documento placeholder.
 * Corre una sola vez: node scripts/init-testusers.js
 * Borra el documento _init después si quieres mantener la colección limpia.
 */
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');

if (!admin.apps.length) {
  admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
}

const db = admin.firestore();

async function main() {
  const placeholder = db.collection('TestUsers').doc('_init');

  await placeholder.set({
    email: '',
    locale: 'en',
    depth: '',
    stopReason: '',
    unclear: '',
    ip: '',
    userAgent: '',
    referrer: '',
    dateCreation: admin.firestore.FieldValue.serverTimestamp(),
    confirmedAt: null,
    _placeholder: true,
  });

  console.log('✓ Colección TestUsers creada con documento _init');
  console.log('  Puedes borrar el documento _init desde la consola de Firebase.');
  process.exit(0);
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
