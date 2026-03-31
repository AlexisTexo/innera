require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');
const admin = require('firebase-admin');

// ─── Firebase ────────────────────────────────────────────────────────────────

const serviceAccount = require('../serviceAccountKey.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

// ─── Mailer (misma config que testaplication.js) ──────────────────────────────

const mailer = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.ionos.mx',
  port: Number(process.env.SMTP_PORT || 587),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER || 'no-reply@theinnercode.net',
    pass: process.env.SMTP_PASS,
  },
});

const MAIL_FROM = process.env.MAIL_FROM || '"The Inner Code" <no-reply@theinnercode.net>';

// ─── Paths ────────────────────────────────────────────────────────────────────

const TEMPLATES_DIR = path.resolve(__dirname, '../newsletters/templates');
const SENT_LOG_PATH = path.resolve(__dirname, '../newsletters/sent-log.json');

// ─── Helpers ──────────────────────────────────────────────────────────────────

function loadSentLog() {
  if (!fs.existsSync(SENT_LOG_PATH)) return {};
  try {
    return JSON.parse(fs.readFileSync(SENT_LOG_PATH, 'utf8'));
  } catch {
    return {};
  }
}

function saveSentLog(log) {
  fs.writeFileSync(SENT_LOG_PATH, JSON.stringify(log, null, 2), 'utf8');
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const campaign = process.argv[2];
  if (!campaign) {
    console.error('[newsletter] Uso: node send-newsletter.js <nombre-campaña>');
    console.error('[newsletter] Ejemplo: node send-newsletter.js 2026-04-07-edicion-1');
    process.exit(1);
  }

  const templatePath = path.join(TEMPLATES_DIR, `${campaign}.js`);
  if (!fs.existsSync(templatePath)) {
    console.error(`[newsletter] Template no encontrado: ${templatePath}`);
    process.exit(1);
  }

  const template = require(templatePath);
  if (!template.subject || !template.html) {
    console.error('[newsletter] La template debe exportar { subject: {en, es}, html: (user) => string }');
    process.exit(1);
  }

  console.log(`[newsletter] Campaña: ${campaign}`);

  // Cargar sent-log
  const sentLog = loadSentLog();
  const alreadySent = new Set(sentLog[campaign] || []);

  // Obtener usuarios confirmados
  const snapshot = await db.collection('TestUsers').get();
  const users = snapshot.docs.map(d => d.data());

  console.log(`[newsletter] Usuarios encontrados: ${users.length}`);

  const pending = users.filter(u => u.email && !alreadySent.has(u.email));
  const skipped = users.length - pending.length;

  if (skipped > 0) console.log(`[newsletter] Saltando ${skipped} ya enviados`);
  console.log(`[newsletter] Enviando a ${pending.length} usuarios...`);

  if (pending.length === 0) {
    console.log('[newsletter] Nada que enviar.');
    process.exit(0);
  }

  let sent = 0;
  let failed = 0;

  for (const user of pending) {
    const locale = String(user.locale || 'en').startsWith('es') ? 'es' : 'en';
    const subject = template.subject[locale];
    const html = template.html(user);

    try {
      await mailer.sendMail({ from: MAIL_FROM, to: user.email, subject, html });

      if (!sentLog[campaign]) sentLog[campaign] = [];
      sentLog[campaign].push(user.email);
      saveSentLog(sentLog);

      console.log(`[newsletter] ✓ ${user.email} (${locale})`);
      sent++;
    } catch (err) {
      console.error(`[newsletter] ✗ ${user.email} — ${err.message}`);
      failed++;
    }
  }

  console.log(`[newsletter] Completado: ${sent} enviados, ${failed} fallidos`);
  process.exit(failed > 0 ? 1 : 0);
}

main().catch(err => {
  console.error('[newsletter] Error fatal:', err);
  process.exit(1);
});
