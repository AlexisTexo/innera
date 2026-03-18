
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


async function sendConfirmEmail({ to, name, confirmUrl }) {
  const displayName = name ? String(name).trim() : '';
  const html = `
  <!doctype html>
  <html lang="es">
    <body style="margin:0; padding:0; background:#fff; font-family:Arial,Helvetica,sans-serif;">
      <div style="max-width:560px; margin:0 auto; padding:24px 12px;">
        <h2 style="margin:0 0 12px;">Holaa ${displayName || '👋'}</h2>
        <p style="margin:0 0 14px; line-height:1.6;">
          Gracias por registrarte. Para completar tu solicitud, confirma tu correo:
        </p>

        <a href="${confirmUrl}"
           style="display:inline-block; padding:12px 18px; background:#000; color:#fff; text-decoration:none; border-radius:10px; font-weight:700;">
          Confirmar registro
        </a>

        <p style="margin:16px 0 0; font-size:12px; color:#444; line-height:1.5;">
          Si tú no hiciste esta solicitud, ignora este correo.
        </p>
      </div>
    </body>
  </html>
  `.trim();

  await mailer.sendMail({
    from: MAIL_FROM,
    to,
    subject: 'Confirma tu registro en Innera',
    html,
  });
}


// Email de agradecimiento
async function sendThanksEmail({ to, name }) {
  const displayName = name ? String(name).trim() : '';
  const html = `
<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Solicitud recibida</title>
  </head>
  <body style="margin:0; padding:0; background-color:#ffffff;">
    <table
      role="presentation"
      cellpadding="0"
      cellspacing="0"
      border="0"
      width="100%"
      style="background-color:#ffffff; padding:24px 12px;"
    >
      <tr>
        <td align="center">
          <table
            role="presentation"
            cellpadding="0"
            cellspacing="0"
            border="0"
            width="100%"
            style="max-width:560px; background-color:#ffffff;"
          >
            <tr>
              <td style="padding:0; font-family:Arial, Helvetica, sans-serif; color:#121212;">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#000000;">
                  <tr>
                    <td align="center" style="padding:20px 24px;">
                      <img
                        src="https://i.imgur.com/QJIoscZ.png"
                        alt="The Inner Code"
                        width="160"
                        style="display:block; width:160px; max-width:100%; height:auto; border:0;"
                      />
                    </td>
                  </tr>
                </table>
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                  <tr>
                    <td align="center" style="padding:0;">
                      <img
                        src="https://i.imgur.com/A4nBfcl.png"
                        alt="INNERA"
                        width="560"
                        style="display:block; width:100%; max-width:560px; height:auto; border:0 "
                      />
                    </td>
                  </tr>
                </table>
                <p style="margin:24px 24px 14px; font-size:28px; line-height:1.2; font-weight:700; color:#121212;">
                  Holaa ${displayName || '👋'},
                </p>
                <p style="margin:0 24px 12px; font-size:16px; line-height:1.6; color:#121212;">
                  Hemos recibido tu solicitud para unirte a <strong>INNERA</strong>.
                </p>
                <p style="margin:0 24px 12px; font-size:16px; line-height:1.6; color:#121212;">
                  INNERA no es una beta abierta.<br />
                  Es una fase de calibración controlada.
                </p>
                <p style="margin:0 24px 12px; font-size:16px; line-height:1.6; color:#121212;">
                  Durante los próximos días, nuestro equipo revisará cuidadosamente cada solicitud para asegurar la alineación entre el sistema y sus primeros participantes.
                </p>
                <p style="margin:0 24px 8px; font-size:16px; line-height:1.6; color:#121212;">
                  Si eres seleccionado, recibirás:
                </p>
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="padding:0 24px 8px;">
                  <tr>
                    <td style="padding:0 0 6px; font-size:16px; line-height:1.6; color:#121212;">
                      • Acceso privado a la beta de INNERA
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:0 0 6px; font-size:16px; line-height:1.6; color:#121212;">
                      • Participación directa en la construcción del MVP final
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:0 0 6px; font-size:16px; line-height:1.6; color:#121212;">
                      • Visión anticipada de tus patrones de diagnóstico interno
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:0 0 6px; font-size:16px; line-height:1.6; color:#121212;">
                      • Estado prioritario para el lanzamiento público
                    </td>
                  </tr>
                </table>
                <p style="margin:8px 24px 12px; font-size:16px; line-height:1.6; color:#121212;">
                  Ten en cuenta:<br />
                  La selección es intencional. No todas las solicitudes serán admitidas en esta fase.
                </p>
                <p style="margin:0 24px 12px; font-size:16px; line-height:1.6; color:#121212;">
                  INNERA fue diseñado para personas dispuestas a observarse con precisión: no de forma casual, sino consciente.
                </p>
                <p style="margin:0 24px 12px; font-size:16px; line-height:1.6; color:#121212;">
                  Si esto resuena contigo, estás en el lugar correcto.
                </p>
                <p style="margin:0 24px 28px; font-size:16px; line-height:1.6; color:#121212;">
                  Sabrás de nosotros pronto.
                </p>
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#000000; border-top:1px solid #1f1f1f;">
                  <tr>
                    <td align="center" style="padding:18px 24px 10px;">
                      <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                        <tr>
                          <td style="padding:0 8px;">
                            <a href="https://www.instagram.com/inneranet/" target="_blank" style="text-decoration:none;">
                              <img
                                src="https://img.icons8.com/ios-filled/50/FFFFFF/instagram-new.png"
                                alt="Instagram"
                                width="22"
                                style="display:block; width:22px; height:22px; border:0;"
                              />
                            </a>
                          </td>
                          <td style="padding:0 8px;">
                            <a href="https://www.facebook.com/" target="_blank" style="text-decoration:none;">
                              <img
                                src="https://img.icons8.com/ios-filled/50/FFFFFF/facebook-new.png"
                                alt="Facebook"
                                width="22"
                                style="display:block; width:22px; height:22px; border:0;"
                              />
                            </a>
                          </td>
                          <td style="padding:0 8px;">
                            <a href="https://x.com/inneramanager" target="_blank" style="text-decoration:none;">
                              <img
                                src="https://img.icons8.com/ios-filled/50/FFFFFF/twitterx--v1.png"
                                alt="X"
                                width="22"
                                style="display:block; width:22px; height:22px; border:0;"
                              />
                            </a>
                          </td>
                          <td style="padding:0 8px;">
                            <a href="https://www.tiktok.com/@innera.net" target="_blank" style="text-decoration:none;">
                              <img
                                src="https://img.icons8.com/ios-filled/50/FFFFFF/tiktok--v1.png"
                                alt="TikTok"
                                width="22"
                                style="display:block; width:22px; height:22px; border:0;"
                              />
                            </a>
                          </td>
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
    subject: 'Muchas Gracias por registrarte en Inner Code',
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

    await pendingRef.set({
      email,
      name,
      lastName,
      depth,
      stopReason,
      unclear,
      locale,
      tokenHash,
      expiresAt,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });

    // 5) Enviar correo con link de confirmación
  //  const confirmUrl = `${SITE_URL}/api/testusers/test-users/confirm?id=${encodeURIComponent(id)}&token=${encodeURIComponent(token)}`;
const confirmUrl = `${API_BASE_URL}/testusers/test-users/confirm?id=${encodeURIComponent(id)}&token=${encodeURIComponent(token)}`;
    try {
      await sendConfirmEmail({ to: email, name, confirmUrl });
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
        dateCreation: data.dateCreation ? data.dateCreation.toDate().toISOString() : null
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
      return res.redirect(`${SITE_URL}/?confirmed=1&already=1`);
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

    if (total >= 100) {
      // opcional: borra pending para no dejar basura
      await pendingRef.delete().catch(() => {});
      //return res.redirect(`${SITE_URL}/innera?confirmed=0&closed=1`);
      return res.redirect(`${SITE_URL}/?confirmed=0&closed=1`);
    }

    // Guardar ya confirmado en TestUsers
    await confirmedRef.set({
      email,
      depth: pending.depth || 'curiosity',
      stopReason: pending.stopReason || '',
      unclear: pending.unclear || '',
      locale: pending.locale || 'en',
      dateCreation: admin.firestore.FieldValue.serverTimestamp(),
      confirmedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // borra pending
    await pendingRef.delete().catch(() => {});

    // Redirige a tu landing con flag de éxito
   // return res.redirect(`${SITE_URL}/innera?confirmed=1`);
    return res.redirect(`${SITE_URL}/?confirmed=1`);
  } catch (e) {
    console.error('Error confirm:', e);
    return res.status(500).send('Server error');
  }
});

module.exports = router;