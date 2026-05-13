
/* eslint-disable no-console */
const express = require('express');
const router = express.Router();

const admin = require('../firebase');
const db = admin.firestore();

const ExcelJS = require('exceljs');

const jwt = require('jsonwebtoken');
const verifyToken = require('../middlewares/verifyToken');

const crypto = require('crypto');
const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');

/* =========================
   SMTP (IONOS u otro)
   ========================= */
const mailer = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.ionos.mx',
  port: Number(process.env.SMTP_PORT || 587),
  secure: (process.env.SMTP_SECURE === 'true') ? true : false,
  auth: {
    user: process.env.SMTP_USER || 'no-reply@theinnercode.net',
    pass: process.env.SMTP_PASS || 'qspqDAb56DT2.6L'  
  }
});

const MAIL_FROM = process.env.MAIL_FROM || '"The Inner Code" <no-reply@theinnercode.net>';

const FALLBACK_SITE_URL = 'https://innera.theinnercode.net';
const SITE_URL = (() => {
  const raw = process.env.SITE_URL || FALLBACK_SITE_URL;
  try {
    return new URL(raw).origin;
  } catch {
    return FALLBACK_SITE_URL;
  }
})();

const FALLBACK_API_URL = 'https://apiinnercode.theinnercode.net';
const API_BASE_URL = (() => {
  const raw = process.env.API_BASE_URL || FALLBACK_API_URL;
  try {
    return new URL(raw).origin;
  } catch {
    return FALLBACK_API_URL;
  }
})();

function sha256(input) {
  return crypto.createHash('sha256').update(String(input)).digest('hex');
}

function makeConfirmToken() {
  return crypto.randomBytes(32).toString('hex'); // token “secreto” para el link
}

/* =========================
   Helpers
   ========================= */

// ID determinístico a partir del email (evita duplicados)
function docIdFromEmail(email) {
  const norm = String(email || '').trim().toLowerCase();
  return crypto.createHash('sha256').update(norm).digest('hex');
}

function serializePendingUserDoc(doc, now = Date.now()) {
  const data = doc.data() || {};
  const createdAtMs = data.createdAt?.toMillis?.() ?? 0;
  const expiresAtMs = data.expiresAt?.toMillis?.() ?? 0;

  return {
    id: doc.id,
    email: String(data.email || '').trim(),
    name: data.name || '',
    lastName: data.lastName || '',
    locale: data.locale || 'en',
    depth: data.depth || 'curiosity',
    stopReason: data.stopReason || '',
    unclear: data.unclear || '',
    status: data.status || 'pending',
    createdAt: createdAtMs ? new Date(createdAtMs).toISOString() : null,
    expiresAt: expiresAtMs ? new Date(expiresAtMs).toISOString() : null,
    expired: expiresAtMs > 0 && now > expiresAtMs,
  };
}

function sortByCreatedAtDesc(a, b) {
  return String(b.createdAt || '').localeCompare(String(a.createdAt || ''));
}

async function deleteSnapshotDocs(docs) {
  let deleted = 0;

  for (let i = 0; i < docs.length; i += 450) {
    const chunk = docs.slice(i, i + 450);
    const batch = db.batch();
    chunk.forEach(doc => batch.delete(doc.ref));
    await batch.commit();
    deleted += chunk.length;
  }

  return deleted;
}

async function deletePendingIds(ids) {
  const uniqueIds = [...new Set(
    (Array.isArray(ids) ? ids : [])
      .map(id => String(id || '').trim())
      .filter(Boolean)
  )];

  let deleted = 0;
  for (let i = 0; i < uniqueIds.length; i += 450) {
    const chunk = uniqueIds.slice(i, i + 450);
    const batch = db.batch();
    chunk.forEach(id => batch.delete(db.collection('PendingTestUsers').doc(id)));
    await batch.commit();
    deleted += chunk.length;
  }

  return deleted;
}

async function deleteTestUserIds(ids) {
  const uniqueIds = [...new Set(
    (Array.isArray(ids) ? ids : [])
      .map(id => String(id || '').trim())
      .filter(Boolean)
  )];

  let deleted = 0;
  for (let i = 0; i < uniqueIds.length; i += 450) {
    const chunk = uniqueIds.slice(i, i + 450);
    const batch = db.batch();
    chunk.forEach(id => batch.delete(db.collection('TestUsers').doc(id)));
    await batch.commit();
    deleted += chunk.length;
  }

  return deleted;
}


async function sendConfirmEmail({ to, name, confirmUrl, locale }) {
  const isEn = String(locale || 'en').startsWith('en');

  const i18n = isEn ? {
    title: 'Confirm your registration',
    subject: 'INNERA – Confirm your registration',
    greeting: 'Hello,',
    received: 'We have received your request to join <strong>INNERA</strong>.',
    notBeta: 'INNERA is not an open beta.<br />It is a controlled calibration phase.',
    review: 'Over the next few days, our team will carefully review each application to ensure alignment between the system and its first participants.',
    selectedTitle: 'If you are selected, you will receive:',
    bullet1: 'Private access to the INNERA beta',
    bullet2: 'Direct participation in building the final MVP',
    bullet3: 'An early look at your internal diagnostic patterns',
    bullet4: 'Priority status for the public launch',
    note: 'Please note:<br />Selection is intentional. Not all applications will be admitted in this phase.',
    designed: 'INNERA was designed for people willing to observe themselves with precision — not casually, but consciously.',
    resonates: 'If this resonates with you, you are in the right place.',
    soon: 'You will hear from us soon.',
    confirmBtn: 'Confirm registration',
    ignore: 'If you did not make this request, ignore this email.',
  } : {
    title: 'Solicitud recibida',
    subject: 'INNERA – Confirma tu registro',
    greeting: 'Hola,',
    received: 'Hemos recibido tu solicitud para unirte a <strong>INNERA</strong>.',
    notBeta: 'INNERA no es una beta abierta.<br />Es una fase de calibración controlada.',
    review: 'Durante los próximos días, nuestro equipo revisará cuidadosamente cada solicitud para asegurar la alineación entre el sistema y sus primeros participantes.',
    selectedTitle: 'Si eres seleccionado, recibirás:',
    bullet1: 'Acceso privado a la beta de INNERA',
    bullet2: 'Participación directa en la construcción del MVP final',
    bullet3: 'Visión anticipada de tus patrones de diagnóstico interno',
    bullet4: 'Estado prioritario para el lanzamiento público',
    note: 'Ten en cuenta:<br />La selección es intencional. No todas las solicitudes serán admitidas en esta fase.',
    designed: 'INNERA fue diseñado para personas dispuestas a observarse con precisión: no de forma casual, sino consciente.',
    resonates: 'Si esto resuena contigo, estás en el lugar correcto.',
    soon: 'Sabrás de nosotros pronto.',
    confirmBtn: 'Confirmar registro',
    ignore: 'Si tú no hiciste esta solicitud, ignora este correo.',
  };

  const html = `
<!doctype html>
<html lang="${isEn ? 'en' : 'es'}">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${i18n.title}</title>
  </head>
  <body style="margin:0; padding:0; background-color:#ffffff;">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#ffffff; padding:24px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:560px; background-color:#ffffff;">
            <tr>
              <td style="padding:0; font-family:Arial, Helvetica, sans-serif; color:#121212;">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#000000;">
                  <tr>
                    <td align="center" style="padding:20px 24px;">
                      <img src="https://i.imgur.com/QJIoscZ.png" alt="The Inner Code" width="160" style="display:block; width:160px; max-width:100%; height:auto; border:0;" />
                    </td>
                  </tr>
                </table>
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                  <tr>
                  </tr>
                </table>
                <p style="margin:24px 24px 14px; font-size:28px; line-height:1.2; font-weight:700; color:#121212;">
                  ${i18n.greeting}
                </p>
                <p style="margin:0 24px 12px; font-size:16px; line-height:1.6; color:#121212;">
                  ${i18n.received}
                </p>
                <p style="margin:0 24px 12px; font-size:16px; line-height:1.6; color:#121212;">
                  ${i18n.notBeta}
                </p>
                <p style="margin:0 24px 12px; font-size:16px; line-height:1.6; color:#121212;">
                  ${i18n.review}
                </p>
                <p style="margin:0 24px 8px; font-size:16px; line-height:1.6; color:#121212;">
                  ${i18n.selectedTitle}
                </p>
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="padding:0 24px 8px;">
                  <tr><td style="padding:0 0 6px; font-size:16px; line-height:1.6; color:#121212;">• ${i18n.bullet1}</td></tr>
                  <tr><td style="padding:0 0 6px; font-size:16px; line-height:1.6; color:#121212;">• ${i18n.bullet2}</td></tr>
                  <tr><td style="padding:0 0 6px; font-size:16px; line-height:1.6; color:#121212;">• ${i18n.bullet3}</td></tr>
                  <tr><td style="padding:0 0 6px; font-size:16px; line-height:1.6; color:#121212;">• ${i18n.bullet4}</td></tr>
                </table>
                <p style="margin:8px 24px 12px; font-size:16px; line-height:1.6; color:#121212;">
                  ${i18n.note}
                </p>
                <p style="margin:0 24px 12px; font-size:16px; line-height:1.6; color:#121212;">
                  ${i18n.designed}
                </p>
                <p style="margin:0 24px 12px; font-size:16px; line-height:1.6; color:#121212;">
                  ${i18n.resonates}
                </p>
                <p style="margin:0 24px 20px; font-size:16px; line-height:1.6; color:#121212;">
                  ${i18n.soon}
                </p>
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="padding:0 24px 20px;">
                  <tr>
                    <td align="center">
                      <a href="${confirmUrl}" style="display:inline-block; padding:12px 18px; background:#000; color:#fff; text-decoration:none; border-radius:10px; font-weight:700;">
                        ${i18n.confirmBtn}
                      </a>
                    </td>
                  </tr>
                </table>
                <p style="margin:0 24px 20px; font-size:12px; color:#444; line-height:1.5;">
                  ${i18n.ignore}
                </p>
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#000000; border-top:1px solid #1f1f1f;">
                  <tr>
                    <td align="center" style="padding:18px 24px 10px;">
                      <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                        <tr>
                          <td style="padding:0 8px;"><a href="https://www.instagram.com/inneranet/" target="_blank" style="text-decoration:none;"><img src="https://img.icons8.com/ios-filled/50/FFFFFF/instagram-new.png" alt="Instagram" width="22" style="display:block; width:22px; height:22px; border:0;" /></a></td>
                          <td style="padding:0 8px;"><a href="https://www.facebook.com/people/Innera/61588072216975/" target="_blank" style="text-decoration:none;"><img src="https://img.icons8.com/ios-filled/50/FFFFFF/facebook-new.png" alt="Facebook" width="22" style="display:block; width:22px; height:22px; border:0;" /></a></td>
                          <td style="padding:0 8px;"><a href="https://x.com/InneraManager" target="_blank" style="text-decoration:none;"><img src="https://img.icons8.com/ios-filled/50/FFFFFF/twitterx--v1.png" alt="X" width="22" style="display:block; width:22px; height:22px; border:0;" /></a></td>
                          <td style="padding:0 8px;"><a href="https://www.tiktok.com/@innera.net" target="_blank" style="text-decoration:none;"><img src="https://img.icons8.com/ios-filled/50/FFFFFF/tiktok--v1.png" alt="TikTok" width="22" style="display:block; width:22px; height:22px; border:0;" /></a></td>
                          <td style="padding:0 8px;"><a href="https://www.linkedin.com/in/innera-net-0549253b2/" target="_blank" style="text-decoration:none;"><img src="https://img.icons8.com/ios-filled/50/FFFFFF/linkedin.png" alt="LinkedIn" width="22" style="display:block; width:22px; height:22px; border:0;" /></a></td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td align="center" style="padding:0 24px 22px; font-size:12px; line-height:1.5; color:#ffffff;">
                      INNERA by TheInnerCode
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`.trim();

  await mailer.sendMail({
    from: MAIL_FROM,
    to,
    subject: i18n.subject,
    html,
  });
}


// Email de agradecimiento (actualmente no se llama en ningún endpoint)
async function sendThanksEmail({ to, locale }) {
  const isEn = String(locale || 'en').startsWith('en');

  const i18n = isEn ? {
    subject: 'INNERA - Welcome to the controlled calibration phase',
    greeting: 'Welcome,',
    thanks: 'Thank you for confirming your registration. Welcome to <strong>INNERA</strong>.',
    next: 'You are now part of the controlled calibration phase. We will contact you soon with next steps.',
    soon: 'See you soon.',
  } : {
    subject: 'INNERA - Bienvenido a la fase de calibración controlada ',
    greeting: 'Bienvenido,',
    thanks: 'Gracias por confirmar tu registro. Bienvenido a <strong>INNERA</strong>.',
    next: 'Ahora eres parte de la fase de calibración controlada. Te contactaremos pronto con los siguientes pasos.',
    soon: 'Nos vemos pronto.',
  };

  const html = `
<!doctype html>
<html lang="${isEn ? 'en' : 'es'}">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${i18n.subject}</title>
  </head>
  <body style="margin:0; padding:0; background-color:#ffffff;">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#ffffff; padding:24px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:560px; background-color:#ffffff;">
            <tr>
              <td style="padding:0; font-family:Arial, Helvetica, sans-serif; color:#121212;">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#000000;">
                  <tr>
                    <td align="center" style="padding:20px 24px;">
                      <img src="https://i.imgur.com/QJIoscZ.png" alt="The Inner Code" width="160" style="display:block; width:160px; max-width:100%; height:auto; border:0;" />
                    </td>
                  </tr>
                </table>
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                  <tr>
                    <td align="center" style="padding:0;">
                      <img src="https://i.imgur.com/xLv8O0q.png" alt="INNERA" width="560" style="display:block; width:100%; max-width:560px; height:auto; border:0;" />
                    </td>
                  </tr>
                </table>
                <p style="margin:24px 24px 14px; font-size:28px; line-height:1.2; font-weight:700; color:#121212;">
                  ${i18n.greeting}
                </p>
                <p style="margin:0 24px 12px; font-size:16px; line-height:1.6; color:#121212;">
                  ${i18n.thanks}
                </p>
                <p style="margin:0 24px 12px; font-size:16px; line-height:1.6; color:#121212;">
                  ${i18n.next}
                </p>
                <p style="margin:0 24px 28px; font-size:16px; line-height:1.6; color:#121212;">
                  ${i18n.soon}
                </p>
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#000000; border-top:1px solid #1f1f1f;">
                  <tr>
                    <td align="center" style="padding:18px 24px 10px;">
                      <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                        <tr>
                          <td style="padding:0 8px;"><a href="https://www.instagram.com/inneranet/" target="_blank" style="text-decoration:none;"><img src="https://img.icons8.com/ios-filled/50/FFFFFF/instagram-new.png" alt="Instagram" width="22" style="display:block; width:22px; height:22px; border:0;" /></a></td>
                          <td style="padding:0 8px;"><a href="https://www.facebook.com/people/Innera/61588072216975/" target="_blank" style="text-decoration:none;"><img src="https://img.icons8.com/ios-filled/50/FFFFFF/facebook-new.png" alt="Facebook" width="22" style="display:block; width:22px; height:22px; border:0;" /></a></td>
                          <td style="padding:0 8px;"><a href="https://x.com/InneraManager" target="_blank" style="text-decoration:none;"><img src="https://img.icons8.com/ios-filled/50/FFFFFF/twitterx--v1.png" alt="X" width="22" style="display:block; width:22px; height:22px; border:0;" /></a></td>
                          <td style="padding:0 8px;"><a href="https://www.tiktok.com/@innera.net" target="_blank" style="text-decoration:none;"><img src="https://img.icons8.com/ios-filled/50/FFFFFF/tiktok--v1.png" alt="TikTok" width="22" style="display:block; width:22px; height:22px; border:0;" /></a></td>
                          <td style="padding:0 8px;"><a href="https://www.linkedin.com/in/innera-net-0549253b2/" target="_blank" style="text-decoration:none;"><img src="https://img.icons8.com/ios-filled/50/FFFFFF/linkedin.png" alt="LinkedIn" width="22" style="display:block; width:22px; height:22px; border:0;" /></a></td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td align="center" style="padding:0 24px 22px; font-size:12px; line-height:1.5; color:#ffffff;">
                      INNERA by TheInnerCode
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`.trim();

  await mailer.sendMail({
    from: MAIL_FROM,
    to,
    subject: i18n.subject,
    html,
  });
}

/* =========================
   POST /test-users
   Body: { name, lastName, email }
   - Idempotente por email (no duplica)
   - Envía correo SÓLO al registrarse por 1ª vez
   ========================= */
router.post('/test-users', async (req, res) => {
  try {
    let { name, lastName, email, stopReason, unclear, depth, locale, captchaToken } = req.body || {};

    if (!email) return res.status(400).json({ message: 'Falta "email"' });
    if (!captchaToken) return res.status(400).json({ message: 'Falta "captchaToken"' });

    // 1) Verificar captcha
    const ip =
      (req.headers["x-forwarded-for"] || "").toString().split(",")[0].trim() ||
      req.socket?.remoteAddress;

    const captchaResult = await verifyRecaptcha({ token: captchaToken, ip });
    if (!captchaResult?.success) {
      return res.status(400).json({ message: "captcha_failed" });
    }

    // normaliza
    email = String(email).trim().toLowerCase();
    name = String(name || '').trim();
    lastName = String(lastName || '').trim();
    stopReason = String(stopReason || '').trim();
    unclear = String(unclear || '').trim();
    depth = String(depth || 'curiosity').trim();
    locale = String(locale || 'en').trim();

    const id = docIdFromEmail(email);

    // 2) Si ya está confirmado en TestUsers → no hacemos nada más
    const confirmedRef = db.collection('TestUsers').doc(id);
    const confirmedSnap = await confirmedRef.get();
    if (confirmedSnap.exists) {
      return res.status(200).json({
        message: 'Este correo ya está registrado en TestUsers',
        alreadyRegistered: true,
        id
      });
    }

    // 3) (Opcional) límite SOLO cuando confirman:
    // NO cuentes aquí si no quieres “reservar cupo”.
    // Si sí quieres reservar cupo, haz la cuenta aquí (y considerar también pendientes).

    // 4) Crear/actualizar PendingTestUsers
    const pendingRef = db.collection('PendingTestUsers').doc(id);

    const token = makeConfirmToken();
    const tokenHash = sha256(token);

    const expiresAtMs = Date.now() + (24 * 60 * 60 * 1000); // 24h
    const expiresAt = admin.firestore.Timestamp.fromMillis(expiresAtMs);

    const userAgent = req.headers['user-agent'] || '';
    const referrer = req.headers['referer'] || req.headers['referrer'] || '';

    await pendingRef.set({
      email,
      name,
      lastName,
      depth,
      stopReason,
      unclear,
      locale,
      ip: ip || '',
      userAgent,
      referrer,
      tokenHash,
      expiresAt,
      status: 'pending',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });

    // 5) Enviar correo con link de confirmación
  //  const confirmUrl = `${SITE_URL}/api/testusers/test-users/confirm?id=${encodeURIComponent(id)}&token=${encodeURIComponent(token)}`;
const confirmUrl = `${API_BASE_URL}/testusers/test-users/confirm?id=${encodeURIComponent(id)}&token=${encodeURIComponent(token)}`;
    try {
      await sendConfirmEmail({ to: email, name, confirmUrl, locale });
    } catch (e) {
      console.error('No se pudo enviar correo de confirmación:', e.message);
      // si quieres, puedes decidir borrar el pending si falla el mail:
      // await pendingRef.delete().catch(()=>{});
    }

    return res.status(200).json({
      message: 'Solicitud pendiente. Revisa tu correo para confirmar.',
      alreadyRegistered: false,
      pending: true,
      id
    });

  } catch (error) {
    console.error('Error POST /test-users:', error);
    return res.status(500).json({ message: 'Error al crear solicitud pendiente', error: error.message });
  }
});

//GET /test-users/count
router.get('/test-users/count', async (_req, res) => {
  try {
    // Intento con agregación (Admin SDK moderno)
    if (typeof db.collection('TestUsers').count === 'function') {
      const aggSnap = await db.collection('TestUsers').count().get();
      const total = aggSnap.data().count || 0;
      return res.status(200).json({ count: total });
    }

    // Fallback (si la versión del SDK no soporta count())
    const snap = await db.collection('TestUsers').get();
    return res.status(200).json({ count: snap.size });

  } catch (error) {
    console.error('Error GET /test-users/count:', error);
    return res.status(500).json({ message: 'Error al contar TestUsers', error: error.message });
  }
});


// GET /test-users/export.xlsx (solo correos, protegido con JWT)
router.get('/test-users/export.xlsx', verifyToken, async (req, res) => {
  try {
    const query = db.collection('TestUsers').orderBy('dateCreation', 'asc');
    const snapshot = await query.get();

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('TestUsers');

    // Solo columna de correos
    worksheet.columns = [
      { header: 'email', key: 'email', width: 40 }
    ];

    snapshot.forEach(doc => {
      const data = doc.data() || {};
      worksheet.addRow({
        email: (data.email || '').trim()
      });
    });

    const filename = `test-users-emails-${new Date().toISOString().slice(0,10)}.xlsx`;
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error('Error GET /test-users/export.xlsx:', error);
    res.status(500).json({ message: 'Error al exportar correos de TestUsers', error: error.message });
  }
});

// GET /test-users/all | Devuelve todos los usuarios registrados en TestUsers
router.get('/test-users/all', verifyToken, async (req, res) => {
  try {
    const showUsers = String(process.env.ANALYTICS_SHOW_USERS || '').toUpperCase() === 'TRUE';
    if (!showUsers) {
      return res.status(403).json({ message: 'User data access is disabled' });
    }
    const snapshot = await db.collection('TestUsers')
      .orderBy('dateCreation', 'asc')
      .get();

    const users = snapshot.docs.map(doc => {
      const data = doc.data() || {};
      return {
        id: doc.id,
        name: data.name || null,
        lastName: data.lastName || null,
        email: (data.email || '').trim(),
        depth: data.depth || 'curiosity',
        stopReason: data.stopReason || '',
        unclear: data.unclear || '',
        locale: data.locale || 'en',
        ip: data.ip || '',
        userAgent: data.userAgent || '',
        referrer: data.referrer || '',
        dateCreation: data.dateCreation ? data.dateCreation.toDate().toISOString() : null,
        confirmedAt: data.confirmedAt ? data.confirmedAt.toDate().toISOString() : null,
      };
    });

    return res.status(200).json({
      count: users.length,
      users
    });
  } catch (error) {
    console.error('Error GET /test-users/all:', error);
    return res.status(500).json({ message: 'Error al obtener usuarios', error: error.message });
  }
});

// POST /test-users/confirmed/delete-selected | Elimina usuarios confirmados seleccionados
router.post('/test-users/confirmed/delete-selected', verifyToken, async (req, res) => {
  try {
    const ids = Array.isArray(req.body?.ids) ? req.body.ids : [];
    if (ids.length === 0) {
      return res.status(400).json({ message: 'No confirmed user IDs provided' });
    }

    const deleted = await deleteTestUserIds(ids);
    return res.status(200).json({ deleted });
  } catch (error) {
    console.error('Error POST /test-users/confirmed/delete-selected:', error);
    return res.status(500).json({ message: 'Error al eliminar usuarios confirmados seleccionados', error: error.message });
  }
});

// DELETE /test-users/confirmed/:id | Elimina un usuario confirmado
router.delete('/test-users/confirmed/:id', verifyToken, async (req, res) => {
  try {
    const id = String(req.params.id || '').trim();
    if (!id) {
      return res.status(400).json({ message: 'Missing confirmed user ID' });
    }

    await db.collection('TestUsers').doc(id).delete();
    return res.status(200).json({ deleted: 1 });
  } catch (error) {
    console.error('Error DELETE /test-users/confirmed/:id:', error);
    return res.status(500).json({ message: 'Error al eliminar usuario confirmado', error: error.message });
  }
});

// GET /test-users/pending | Devuelve solicitudes pendientes antes de confirmacion
router.get('/test-users/pending', verifyToken, async (_req, res) => {
  try {
    const now = Date.now();
    const snapshot = await db.collection('PendingTestUsers').get();
    const users = snapshot.docs
      .map(doc => serializePendingUserDoc(doc, now))
      .sort(sortByCreatedAtDesc);

    const todayStr = new Date().toISOString().slice(0, 10);
    const pendingToday = users.filter(u => String(u.createdAt || '').slice(0, 10) === todayStr).length;
    const expiredPending = users.filter(u => u.expired).length;

    return res.status(200).json({
      count: users.length,
      pendingToday,
      expiredPending,
      users
    });
  } catch (error) {
    console.error('Error GET /test-users/pending:', error);
    return res.status(500).json({ message: 'Error al obtener pendientes', error: error.message });
  }
});

// DELETE /test-users/pending/expired | Elimina solicitudes pendientes vencidas
router.delete('/test-users/pending/expired', verifyToken, async (_req, res) => {
  try {
    const now = admin.firestore.Timestamp.now();
    const snapshot = await db.collection('PendingTestUsers')
      .where('expiresAt', '<', now)
      .get();

    const deleted = await deleteSnapshotDocs(snapshot.docs);
    return res.status(200).json({ deleted });
  } catch (error) {
    console.error('Error DELETE /test-users/pending/expired:', error);
    return res.status(500).json({ message: 'Error al eliminar pendientes expirados', error: error.message });
  }
});

// POST /test-users/pending/delete-selected | Elimina pendientes seleccionados por ID
router.post('/test-users/pending/delete-selected', verifyToken, async (req, res) => {
  try {
    const ids = Array.isArray(req.body?.ids) ? req.body.ids : [];
    if (ids.length === 0) {
      return res.status(400).json({ message: 'No pending user IDs provided' });
    }

    const deleted = await deletePendingIds(ids);
    return res.status(200).json({ deleted });
  } catch (error) {
    console.error('Error POST /test-users/pending/delete-selected:', error);
    return res.status(500).json({ message: 'Error al eliminar pendientes seleccionados', error: error.message });
  }
});

// DELETE /test-users/pending/:id | Elimina una solicitud pendiente
router.delete('/test-users/pending/:id', verifyToken, async (req, res) => {
  try {
    const id = String(req.params.id || '').trim();
    if (!id) {
      return res.status(400).json({ message: 'Missing pending user ID' });
    }

    await db.collection('PendingTestUsers').doc(id).delete();
    return res.status(200).json({ deleted: 1 });
  } catch (error) {
    console.error('Error DELETE /test-users/pending/:id:', error);
    return res.status(500).json({ message: 'Error al eliminar pendiente', error: error.message });
  }
});

// DELETE /test-users/pending | Elimina todas las solicitudes pendientes
router.delete('/test-users/pending', verifyToken, async (_req, res) => {
  try {
    const snapshot = await db.collection('PendingTestUsers').get();
    const deleted = await deleteSnapshotDocs(snapshot.docs);
    return res.status(200).json({ deleted });
  } catch (error) {
    console.error('Error DELETE /test-users/pending:', error);
    return res.status(500).json({ message: 'Error al eliminar pendientes', error: error.message });
  }
});

/* =========================
   Rate limiter por IP (en memoria)
   ========================= */
const loginAttempts = new Map(); // ip → { count, firstAttempt, lockedUntil }
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;  // 15 min ventana
const LOCKOUT_MS = 30 * 60 * 1000; // 30 min bloqueo

function getLoginAttempt(ip) {
  const now = Date.now();
  const entry = loginAttempts.get(ip);
  if (!entry) return null;
  // limpiar entradas viejas
  if (now - entry.firstAttempt > WINDOW_MS && (!entry.lockedUntil || now > entry.lockedUntil)) {
    loginAttempts.delete(ip);
    return null;
  }
  return entry;
}

function recordFailedAttempt(ip) {
  const now = Date.now();
  const entry = loginAttempts.get(ip) || { count: 0, firstAttempt: now, lockedUntil: 0 };
  entry.count++;
  if (entry.count >= MAX_ATTEMPTS) {
    entry.lockedUntil = now + LOCKOUT_MS;
  }
  loginAttempts.set(ip, entry);
  return entry;
}

function clearAttempts(ip) {
  loginAttempts.delete(ip);
}

// Limpieza periódica cada 10 min
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of loginAttempts) {
    if (now - entry.firstAttempt > WINDOW_MS && (!entry.lockedUntil || now > entry.lockedUntil)) {
      loginAttempts.delete(ip);
    }
  }
}, 10 * 60 * 1000);

// POST /test-users/analytics-login — login dedicado para analytics
router.post('/test-users/analytics-login', async (req, res) => {
  try {
    const ip =
      (req.headers['x-forwarded-for'] || '').toString().split(',')[0].trim() ||
      req.socket?.remoteAddress || 'unknown';

    // Revisar si la IP está bloqueada
    const attempt = getLoginAttempt(ip);
    if (attempt?.lockedUntil && Date.now() < attempt.lockedUntil) {
      const remainMin = Math.ceil((attempt.lockedUntil - Date.now()) / 60000);
      return res.status(429).json({
        message: `Too many attempts. Try again in ${remainMin} min.`,
        locked: true,
        retryInMs: attempt.lockedUntil - Date.now(),
      });
    }

    const { email, password } = req.body || {};
    const validUser = process.env.ANALYTICS_USER;
    const validPass = process.env.ANALYTICS_PASS;

    if (!validUser || !validPass) {
      return res.status(500).json({ message: 'Analytics credentials not configured' });
    }

    if (
      String(email).trim().toLowerCase() !== validUser.trim().toLowerCase() ||
      password !== validPass
    ) {
      const entry = recordFailedAttempt(ip);
      const remaining = Math.max(0, MAX_ATTEMPTS - entry.count);
      return res.status(401).json({
        message: remaining > 0
          ? `Invalid credentials. ${remaining} attempt${remaining === 1 ? '' : 's'} left.`
          : 'Account locked. Too many failed attempts.',
        attemptsRemaining: remaining,
      });
    }

    // Login exitoso → limpiar intentos
    clearAttempts(ip);

    const token = jwt.sign(
      { role: 'analytics', email: validUser },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    const showUsers = String(process.env.ANALYTICS_SHOW_USERS || '').toUpperCase() === 'TRUE';

    return res.status(200).json({ token, showUsers });
  } catch (error) {
    console.error('Error POST /test-users/analytics-login:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// GET /test-users/analytics — resumen agregado (protegido con JWT)
router.get('/test-users/analytics', verifyToken, async (_req, res) => {
  try {
    const showUsers = String(process.env.ANALYTICS_SHOW_USERS || '').toUpperCase() === 'TRUE';
    const [confirmedSnap, pendingSnap] = await Promise.all([
      db.collection('TestUsers').get(),
      db.collection('PendingTestUsers').get(),
    ]);

    const confirmed = confirmedSnap.docs.map(d => d.data());
    const pending = pendingSnap.docs.map(d => d.data());

    // — Conteos generales —
    const totalConfirmed = confirmed.length;
    const totalPending = pending.length;
    const spotsRemaining = Math.max(0, 300 - totalConfirmed);

    // — Distribución por locale —
    const localeCount = { en: 0, es: 0 };
    confirmed.forEach(u => {
      const loc = String(u.locale || 'en').startsWith('en') ? 'en' : 'es';
      localeCount[loc]++;
    });

    // — Distribución por depth —
    const depthCount = {};
    confirmed.forEach(u => {
      const d = u.depth || 'curiosity';
      depthCount[d] = (depthCount[d] || 0) + 1;
    });

    // — Registros por día (últimos 30 días) —
    const now = Date.now();
    const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;
    const dailyMap = {};
    confirmed.forEach(u => {
      const ts = u.dateCreation?.toMillis?.() ?? 0;
      if (ts >= thirtyDaysAgo) {
        const day = new Date(ts).toISOString().slice(0, 10);
        dailyMap[day] = (dailyMap[day] || 0) + 1;
      }
    });
    const registrationsPerDay = Object.entries(dailyMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, count]) => ({ date, count }));

    // — Tiempo promedio de confirmación (ms) —
    let avgConfirmTimeMs = null;
    const confirmTimes = confirmed
      .filter(u => u.dateCreation?.toMillis && u.confirmedAt?.toMillis)
      .map(u => u.confirmedAt.toMillis() - u.dateCreation.toMillis())
      .filter(ms => ms >= 0);
    if (confirmTimes.length) {
      avgConfirmTimeMs = Math.round(confirmTimes.reduce((a, b) => a + b, 0) / confirmTimes.length);
    }

    // — Tasa de conversión (confirmados / (confirmados + pendientes)) —
    const conversionRate = (totalConfirmed + totalPending) > 0
      ? +(totalConfirmed / (totalConfirmed + totalPending) * 100).toFixed(1)
      : 0;

    // — Registros hoy —
    const todayStr = new Date().toISOString().slice(0, 10);
    const registeredToday = confirmed.filter(u => {
      const ts = u.dateCreation?.toMillis?.() ?? 0;
      return ts > 0 && new Date(ts).toISOString().slice(0, 10) === todayStr;
    }).length;
    const pendingToday = pending.filter(u => {
      const ts = u.createdAt?.toMillis?.() ?? 0;
      return ts > 0 && new Date(ts).toISOString().slice(0, 10) === todayStr;
    }).length;

    // — Top referrers —
    const refMap = {};
    confirmed.forEach(u => {
      let ref = String(u.referrer || '').trim();
      if (!ref) ref = 'Direct';
      else {
        try { ref = new URL(ref).hostname; } catch { /* keep raw */ }
      }
      refMap[ref] = (refMap[ref] || 0) + 1;
    });
    const topReferrers = Object.entries(refMap)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([source, count]) => ({ source, count }));

    // — Top dispositivos (simplificado) —
    const deviceMap = { mobile: 0, desktop: 0, other: 0 };
    confirmed.forEach(u => {
      const ua = String(u.userAgent || '').toLowerCase();
      if (/mobile|android|iphone|ipad/.test(ua)) deviceMap.mobile++;
      else if (/windows|macintosh|linux/.test(ua)) deviceMap.desktop++;
      else deviceMap.other++;
    });

    // — Pendientes expirados (token ya venció) —
    const expiredPending = pending.filter(u => {
      const exp = u.expiresAt?.toMillis?.() ?? 0;
      return exp > 0 && now > exp;
    }).length;

    // — Últimos 5 registros confirmados —
    const recentUsers = confirmed
      .filter(u => u.dateCreation?.toMillis)
      .sort((a, b) => b.dateCreation.toMillis() - a.dateCreation.toMillis())
      .slice(0, 5)
      .map(u => ({
        email: u.email?.replace(/(.{2})(.*)(@.*)/, '$1***$3') || '***',
        locale: u.locale || 'en',
        depth: u.depth || 'curiosity',
        date: new Date(u.dateCreation.toMillis()).toISOString(),
      }));

    const pendingUsers = pendingSnap.docs
      .map(d => serializePendingUserDoc(d, now))
      .sort(sortByCreatedAtDesc);

    return res.status(200).json({
      showUsers,
      totalConfirmed,
      totalPending,
      expiredPending,
      spotsRemaining,
      conversionRate,
      avgConfirmTimeMs,
      registeredToday,
      pendingToday,
      localeCount,
      depthCount,
      deviceCount: deviceMap,
      topReferrers,
      recentUsers,
      registrationsPerDay,
      pendingUsers,
    });
  } catch (error) {
    console.error('Error GET /test-users/analytics:', error);
    return res.status(500).json({ message: 'Error al obtener analíticas', error: error.message });
  }
});

async function verifyRecaptcha({ token, ip }) {
  const secret = process.env.RECAPTCHA_SECRET_KEY;

  if (!secret) {
    // En producción esto debería ser error fatal de config
    return { success: false, error: "missing_secret" };
  }

  const params = new URLSearchParams();
  params.append("secret", secret);
  params.append("response", token);
  if (ip) params.append("remoteip", ip);

  const r = await fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });

  return r.json();
}


router.get('/test-users/confirm', async (req, res) => {
  try {
    const { id, token } = req.query || {};
    if (!id || !token) return res.status(400).send('Missing id/token');

    const pendingRef = db.collection('PendingTestUsers').doc(String(id));
    const pendingSnap = await pendingRef.get();
    if (!pendingSnap.exists) return res.status(400).send('Invalid or expired confirmation');

    const pending = pendingSnap.data() || {};
    const now = Date.now();
    const locale = String(pending.locale || 'en').startsWith('es') ? 'es' : 'en';
    const localePath = locale === 'es' ? '/innera/es' : '/innera';

    const expiresAtMs = pending.expiresAt?.toMillis?.() ?? 0;
    if (!expiresAtMs || now > expiresAtMs) {
      await pendingRef.delete().catch(() => {});
      return res.status(400).send('Confirmation link expired');
    }

    const incomingHash = sha256(String(token));
    if (!pending.tokenHash || incomingHash !== pending.tokenHash) {
      return res.status(400).send('Invalid confirmation token');
    }

    const email = String(pending.email || '').trim().toLowerCase();
    const userId = docIdFromEmail(email);

    // Re-checa si ya está confirmado
    const confirmedRef = db.collection('TestUsers').doc(userId);
    const confirmedSnap = await confirmedRef.get();
    if (confirmedSnap.exists) {
      await pendingRef.delete().catch(() => {});
      //return res.redirect(`${SITE_URL}/innera?confirmed=1&already=1`);
      return res.redirect(`${SITE_URL}${localePath}?confirmed=1&already=1`);
    }

    // ✅ Aquí sí aplicas el límite (porque ya confirmó)
    let total = 0;
    if (typeof db.collection('TestUsers').count === 'function') {
      const aggSnap = await db.collection('TestUsers').count().get();
      total = aggSnap.data().count || 0;
    } else {
      const snap = await db.collection('TestUsers').get();
      total = snap.size;
    }

    if (total >= 300) {
      // opcional: borra pending para no dejar basura
      await pendingRef.delete().catch(() => {});
      //return res.redirect(`${SITE_URL}/innera?confirmed=0&closed=1`);
      return res.redirect(`${SITE_URL}${localePath}?confirmed=0&closed=1`);
    }

    // Guardar ya confirmado en TestUsers
    await confirmedRef.set({
      email,
      name: pending.name || '',
      lastName: pending.lastName || '',
      depth: pending.depth || 'curiosity',
      stopReason: pending.stopReason || '',
      unclear: pending.unclear || '',
      locale: pending.locale || 'en',
      ip: pending.ip || '',
      userAgent: pending.userAgent || '',
      referrer: pending.referrer || '',
      dateCreation: admin.firestore.FieldValue.serverTimestamp(),
      confirmedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // borra pending
    await pendingRef.delete().catch(() => {});

    // Enviar correo de agradecimiento (no bloquea el redirect)
    sendThanksEmail({ to: email, locale: pending.locale || 'en' }).catch(err => {
      console.error('No se pudo enviar correo de agradecimiento:', err.message);
    });

    // Redirige a tu landing con flag de éxito
   // return res.redirect(`${SITE_URL}/innera?confirmed=1`);
    return res.redirect(`${SITE_URL}${localePath}?confirmed=1`);
  } catch (e) {
    console.error('Error confirm:', e);
    return res.status(500).send('Server error');
  }
});

// GET /test-users/newsletter-log — historial de envíos (protegido con JWT)
router.get('/test-users/newsletter-log', verifyToken, (_req, res) => {
  try {
    const logPath = path.resolve(__dirname, '../newsletters/sent-log.json');
    if (!fs.existsSync(logPath)) return res.status(200).json({ campaigns: [] });

    const raw = JSON.parse(fs.readFileSync(logPath, 'utf8'));

    const campaigns = Object.entries(raw)
      .map(([name, emails]) => ({ name, sent: emails.length, emails }))
      .sort((a, b) => b.name.localeCompare(a.name));

    return res.status(200).json({ campaigns });
  } catch (e) {
    console.error('Error newsletter-log:', e);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
