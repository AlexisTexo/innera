var express = require('express');
var router = express.Router();

//const { classifyActivation } = require('../routes/utils/activationLanguage');

const admin = require('../firebase');
const db = admin.firestore();

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const openai = require('../openai');
const verifyToken = require('../middlewares/verifyToken');

const crypto = require('crypto');
const nodemailer = require('nodemailer');
const path = require('path');

// --- SMTP IONOS ---
const mailer = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.ionos.mx',
  port: Number(process.env.SMTP_PORT || 587),
  secure: (process.env.SMTP_SECURE === 'true') ? true : false,
  auth: {
    user: process.env.SMTP_USER || 'no-reply@theinnercode.net',
    pass: process.env.SMTP_PASS || 'qspqDAb56DT2.6L'
  }
});

// Genera token crudo + su hash SHA-256
function makeActivationToken() {
  const raw = crypto.randomBytes(32).toString('hex');
  const hash = crypto.createHash('sha256').update(raw).digest('hex');
  return { raw, hash };
}

// URL pública base (ajústala a tu dominio); asumiendo app.js monta: app.use('/users', usersRouter)
const PUBLIC_BASE_URL = process.env.PUBLIC_BASE_URL || 'http://localhost:3000';
function buildActivationLink(rawToken) {
  return `${PUBLIC_BASE_URL}/users/activate/${encodeURIComponent(rawToken)}`;
}


async function sendWelcomeEmail({ to, name }) {
  const html = `
  <!doctype html>
  <html lang="es">
  <head>f
    <meta charset="utf-8">
    <title>Bienvenido a TheInnerCode</title>
    <meta name="viewport" content="width=device-width,initial-scale=1">
  </head>
  <body style="margin:0;padding:0;background:#ECEFF4;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#ECEFF4;padding:24px 0;">
      <tr>
        <td align="center">
          <table role="presentation" width="560" cellspacing="0" cellpadding="0" style="background:#ffffff;border-radius:16px;box-shadow:0 4px 20px -2px rgba(30,42,56,0.1);overflow:hidden;">
            <tr>
              <td align="center" style="background:#1E2A38;padding:28px 24px;">
                <img src="cid:tilogo" alt="The Inner Code" width="56" height="56" style="display:block;border-radius:50%;background:rgba(63,208,201,0.2);padding:6px;">
                <div style="font-family:Inter,Segoe UI,Arial,sans-serif;color:#ECEFF4;font-weight:700;font-size:22px;margin-top:10px">
                  ¡Bienvenido a The Inner Code!
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding:22px 24px;font-family:Inter,Segoe UI,Arial,sans-serif;color:#1E2A38;">
                <p style="margin:0 0 12px;font-size:16px;">Hola ${name || ''},</p>
                <p style="margin:0 0 14px;font-size:16px;line-height:1.6;">
                  Tu cuenta en <strong>The Inner Code</strong> fue creada correctamente.
                </p>
                <p style="margin:0 0 14px;font-size:16px;line-height:1.6;">
                  Ya puedes iniciar sesión en la app con tu correo y tu contraseña cuando quieras.
                </p>
                <p style="margin:0;font-size:14px;line-height:1.6;">
                  Gracias por confiar en nosotros para acompañarte en tu proceso de autoconocimiento 🧠✨
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:14px 24px 20px;text-align:center;background:#ffffff;">
                <p style="margin:0;font-size:12px;color:#536173;font-family:Inter,Segoe UI,Arial,sans-serif;">
                  © The Inner Code — introspección con calidez y claridad
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;

  await mailer.sendMail({
    from: process.env.MAIL_FROM || '"The Inner Code" <no-reply@theinnercode.net>',
    to,
    subject: 'Bienvenido a The Inner Code',
    html,
    attachments: [
      {
        filename: 'logo.png',
        path: path.join(__dirname, '..', 'public', 'images', 'logo.png'),
        cid: 'tilogo'
      }
    ]
  });
}



// Email HTML: Activacion de cuenta
async function sendActivationEmail({ to, name, link }) {
  const html = `
  <!doctype html>
  <html lang="es">
  <head>
    <meta charset="utf-8">
    <title>Activa tu cuenta</title>
    <meta name="viewport" content="width=device-width,initial-scale=1">
  </head>
  <body style="margin:0;padding:0;background:#ECEFF4;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#ECEFF4;padding:24px 0;">
      <tr>
        <td align="center">
          <table role="presentation" width="560" cellspacing="0" cellpadding="0" style="background:#ffffff;border-radius:0;box-shadow:0 4px 20px -2px rgba(30,42,56,0.1);overflow:hidden;">
            <!-- Header nuevo -->
            <tr>
              <td align="center" style="background:#1E2A38;padding:32px 24px;">
                
                <!-- Logo circular con cid -->
                <table role="presentation" cellspacing="0" cellpadding="0" style="margin-bottom:16px;">
                  <tr>
                    <td align="center" style="width:80px;height:80px;border-radius:50%;background:rgba(63,208,201,0.2);">
                      <img src="cid:tilogo" alt="TheInnerCode" width="50" height="50" style="display:block;margin:15px auto 0;border:0;outline:none;">
                    </td>
                  </tr>
                </table>

                <!-- Marca -->
                <div style="font-family:Inter,Segoe UI,Arial,sans-serif;font-weight:700;font-size:28px;letter-spacing:.5px;color:#ECEFF4;margin:0 0 8px;">
                  TheInnerCode
                </div>

                <!-- Badge -->
                <div style="display:inline-block;background:rgba(63,208,201,0.3);border:1px solid #3FD0C9;color:#ECEFF4;padding:6px 14px;border-radius:20px;font-family:Inter,Segoe UI,Arial,sans-serif;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:1px;margin-bottom:12px;">
                  Bienvenido a nuestra comunidad
                </div>

                <!-- Títulos del hero -->
                <div style="font-family:Inter,Segoe UI,Arial,sans-serif;color:#ECEFF4;font-weight:700;font-size:34px;line-height:1.2;margin:6px 0 2px;">Descubre Tu</div>
                <div style="font-family:Inter,Segoe UI,Arial,sans-serif;color:#ECEFF4;font-style:italic;font-weight:300;font-size:22px;line-height:1.3;margin:0 0 8px;">Mundo Interior</div>
                <div style="font-family:Inter,Segoe UI,Arial,sans-serif;color:#ECEFF4;opacity:.9;font-size:14px;">
                  Autoconocimiento basado en ciencia e introspección
                </div>
              </td>
            </tr>

            <!-- Contenido principal con funcionalidad antigua -->
            <tr>
              <td style="padding:24px 24px 8px;font-family:Inter,Segoe UI,Arial,sans-serif;color:#1E2A38;">
                <h1 style="margin:0 0 12px;font-size:22px;line-height:1.3;color:#333;font-weight:600;">Activa tu cuenta</h1>
                <p style="margin:0 0 12px;font-size:16px;line-height:1.6;">Hola ${name || ''},</p>
                <p style="margin:0 0 16px;font-size:16px;line-height:1.6;">
                  Gracias por registrarte en <strong>The Inner Code</strong>. Para activar tu cuenta, usa el botón:
                </p>
                <p style="margin:22px 0;text-align:center;">
                  <a href="${link}" style="background:#3FD0C9;color:#1E2A38;text-decoration:none;padding:14px 22px;border-radius:12px;display:inline-block;font-weight:700;font-size:16px;box-shadow:0 4px 20px -2px rgba(63,208,201,0.3);">
                    Activar cuenta
                  </a>
                </p>
                <p style="margin:0 0 6px;font-size:14px;color:#1E2A38;">Si el botón no funciona, copia este enlace:</p>
                <p style="word-break:break-all;margin:0 0 16px;font-size:12px;color:#1E2A38;">
                  ${link}
                </p>
                <p style="margin:8px 0 24px;font-size:12px;color:#1E2A38;">El enlace caduca en 24 horas.</p>
              </td>
            </tr>

            <!-- Separador -->
            <tr>
              <td style="height:8px;background:#FFD75E;"></td>
            </tr>

            <!-- Sección “Lo que te espera” (email-safe) -->
            <tr>
              <td style="padding:20px 24px;background:rgba(236,239,244,0.2);font-family:Inter,Segoe UI,Arial,sans-serif;color:#1E2A38;">
                <h3 style="margin:0 0 14px;font-size:18px;font-weight:600;text-align:center;">Lo Que Te Espera</h3>

                <!-- Item 1 -->
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom:12px;border:1px solid rgba(210,225,238,0.5);border-radius:12px;">
                  <tr>
                    <td style="padding:14px;">
                      <div style="font-weight:700;margin:0 0 6px;font-size:15px;">💬 Lo que aún no has dicho</div>
                      <div style="font-size:14px;line-height:1.5;color:rgba(30,42,56,0.8);">
                        Reflexiona y regula tus emociones a través de conversaciones guiadas con tu acompañante.
                      </div>
                    </td>
                  </tr>
                </table>

                <!-- Item 2 -->
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom:12px;border:1px solid rgba(210,225,238,0.5);border-radius:12px;">
                  <tr>
                    <td style="padding:14px;">
                      <div style="font-weight:700;margin:0 0 6px;font-size:15px;">🗺️ Tu Reflejo Interior</div>
                      <div style="font-size:14px;line-height:1.5;color:rgba(30,42,56,0.8);">
                        Visualiza tu mapa psico-temporal y descubre tus patrones emocionales a través de representaciones científicas y hermosas.
                      </div>
                    </td>
                  </tr>
                </table>

                <!-- Item 3 -->
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border:1px solid rgba(210,225,238,0.5);border-radius:12px;">
                  <tr>
                    <td style="padding:14px;">
                      <div style="font-weight:700;margin:0 0 6px;font-size:15px;">❓ Responder al llamado de hoy</div>
                      <div style="font-size:14px;line-height:1.5;color:rgba(30,42,56,0.8);">
                        Reflexiones guiadas para profundizar en tu autoconocimiento a través de actividades científicamente diseñadas.
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Descarga app (opcional, con # por defecto) -->
            <tr>
              <td align="center" style="background:#1E2A38;padding:22px 24px;color:#ECEFF4;font-family:Inter,Segoe UI,Arial,sans-serif;">
                <div style="font-size:16px;font-weight:600;margin:0 0 12px;">¿Ya descargaste nuestra app?</div>
                <table role="presentation" cellspacing="0" cellpadding="0">
                  <tr>
                    <td align="center" style="padding:6px;">
                      <a href="#" style="display:inline-block;">
                        <img src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" alt="Download on the App Store" height="40" style="display:block;border:0;">
                      </a>
                    </td>
                    <td align="center" style="padding:6px;">
                      <a href="#" style="display:inline-block;">
                        <img src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png" alt="Get it on Google Play" height="48" style="display:block;border:0;">
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding:16px 24px 24px;text-align:center;background:#ffffff;">
                <p style="margin:0;font-size:12px;color:#1E2A38;font-family:Inter,Segoe UI,Arial,sans-serif;">
                  © The Inner Code — introspección con calidez y claridad
                </p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>`;

  await mailer.sendMail({
    from: process.env.MAIL_FROM || '"The Inner Code" <no-reply@theinnercode.net>',
    to,
    subject: 'Activa tu cuenta',
    html,
    attachments: [
      {
        filename: 'logo.png',
        path: path.join(__dirname, '..', 'public', 'images', 'logo.png'),
        cid: 'tilogo' // referencia en <img src="cid:tilogo">
      }
    ]
  });
}

// Email: Weekly Summary (usa centralTheme como título y summaryText de cuerpo)
async function sendWeeklySummaryEmail({ to, name, weekStart, weekEnd, centralTheme, summaryText }) {
  const safeName = name ? String(name).trim() : '';
  const period = weekStart && weekEnd ? `${weekStart} – ${weekEnd}` : '';
  const subject = `Resumen semanal • ${centralTheme || 'Tu semana en Inner Code'}`;

  const html = `
  <!doctype html>
  <html lang="es">
  <head>
    <meta charset="utf-8">
    <title>${subject}</title>
    <meta name="viewport" content="width=device-width,initial-scale=1">
  </head>
  <body style="margin:0;padding:0;background:#ECEFF4;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#ECEFF4;padding:24px 0;">
      <tr>
        <td align="center">
          <table role="presentation" width="560" cellspacing="0" cellpadding="0" style="background:#ffffff;border-radius:16px;box-shadow:0 6px 24px rgba(0,0,0,0.06);overflow:hidden;">
            <tr>
              <td style="padding:24px 24px 0 24px;text-align:center;background:#1E2A38;">
                <img src="cid:tilogo" alt="The Inner Code" style="width:64px;height:auto;margin:8px 0;display:block;margin-left:auto;margin-right:auto;">
                <h1 style="margin:8px 0 6px;font-family:Inter,Segoe UI,Arial,sans-serif;font-size:20px;line-height:1.3;color:#ECEFF4;font-weight:600;">
                  ${centralTheme || 'Resumen semanal'}
                </h1>
                ${period ? `<p style="margin:0 0 16px;font-family:Inter,Segoe UI,Arial,sans-serif;color:#C7D0DD;font-size:13px;">${period}</p>` : ''}
              </td>
            </tr>
            <tr>
              <td style="padding:20px 24px;font-family:Inter,Segoe UI,Arial,sans-serif;color:#1E2A38;">
                ${safeName ? `<p style="margin:0 0 14px;font-size:15px;">Hola ${safeName},</p>` : ''}
                <p style="margin:0 0 12px;white-space:pre-line;font-size:15px;line-height:1.65;">
                  ${summaryText || 'Tu semana aún no tiene resumen disponible.'}
                </p>
              </td>
            </tr>
            <tr><td style="height:8px;background:#3FD0C9;"></td></tr>
            <tr>
              <td style="padding:14px 24px 20px;text-align:center;background:#ffffff;">
                <p style="margin:0;font-size:12px;color:#536173;font-family:Inter,Segoe UI,Arial,sans-serif;">
                  © The Inner Code — introspección con calidez y claridad
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>`.trim();

  await mailer.sendMail({
    from: process.env.MAIL_FROM || '"The Inner Code" <no-reply@theinnercode.net>',
    to,
    subject,
    html,
    attachments: [
      { filename: 'logo.png', path: path.join(__dirname, '..', 'public', 'images', 'logo.png'), cid: 'tilogo' }
    ]
  });
}

// Valida que un objeto cumpla la estructura "place"
function isValidPlace(p) {
  if (!p || typeof p !== 'object') return false;
  return (
    'city' in p &&
    'state' in p &&
    'country' in p &&
    'notes' in p    // string o null
  );
}

// --- Helpers para leer la clave ---
function getTmpKey() {
  if (process.env.TMP_SECRET) {
    // hex o utf8 (si alguien pegó 32 chars “normales”, lo tratamos como utf8)
    const v = process.env.TMP_SECRET.trim();
    if (/^[0-9a-fA-F]+$/.test(v)) return Buffer.from(v, 'hex'); // HEX
    if (v.length === 32) return Buffer.from(v, 'utf8');         // 32 chars utf8 (fallback)
    // Si no es hex ni 32 utf8, probamos como base64
    try { return Buffer.from(v, 'base64'); } catch {}
  }
  if (process.env.TMP_SECRET_BASE64) {
    return Buffer.from(process.env.TMP_SECRET_BASE64.trim(), 'base64');
  }
  throw new Error('No hay TMP_SECRET/TMP_SECRET_BASE64 configurado');
}

// --- AES-256-GCM: cifrar/descifrar la nueva contraseña temporalmente ---
function aesEncrypt(plain) {
  const key = getTmpKey();
  if (key.length !== 32) throw new Error('La clave temporal debe ser de 32 bytes (256 bits)');
  const iv = crypto.randomBytes(12); // 96-bit nonce para GCM
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const enc = Buffer.concat([cipher.update(String(plain), 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `${iv.toString('base64')}:${enc.toString('base64')}:${tag.toString('base64')}`;
}
function aesDecrypt(packed) {
  const [ivB64, ctB64, tagB64] = String(packed).split(':');
  const key = getTmpKey();
  if (key.length !== 32) throw new Error('La clave temporal debe ser de 32 bytes');
  const iv = Buffer.from(ivB64, 'base64');
  const ct = Buffer.from(ctB64, 'base64');
  const tag = Buffer.from(tagB64, 'base64');
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(tag);
  const dec = Buffer.concat([decipher.update(ct), decipher.final()]);
  return dec.toString('utf8');
}

// URL pública confirmación
function buildResetLink(rawToken) {
  return `${PUBLIC_BASE_URL}/users/forgot-password/confirm/${encodeURIComponent(rawToken)}`;
}

// Email HTML (puedes estilizar igual que tu “Activar cuenta”)
async function sendPasswordChangeEmail({ to, name, link }) {
  const html = `
  <!doctype html>
  <html lang="es"><head><meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Confirma tu cambio de contraseña</title></head>
  <body style="margin:0;padding:0;background:#ECEFF4;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#ECEFF4;padding:24px 0;">
      <tr><td align="center">
        <table role="presentation" width="560" cellspacing="0" cellpadding="0" style="background:#ffffff;box-shadow:0 4px 20px -2px rgba(30,42,56,0.1);overflow:hidden;">
          <tr><td align="center" style="background:#1E2A38;padding:28px 24px;">
            <img src="cid:tilogo" alt="The Inner Code" width="56" height="56" style="display:block;border-radius:50%;background:rgba(63,208,201,0.2);padding:6px;">
            <div style="font-family:Inter,Segoe UI,Arial,sans-serif;color:#ECEFF4;font-weight:700;font-size:22px;margin-top:10px">Confirmar cambio de contraseña</div>
          </td></tr>
          <tr><td style="padding:22px 24px;font-family:Inter,Segoe UI,Arial,sans-serif;color:#1E2A38;">
            <p style="margin:0 0 12px;font-size:16px;">Hola ${name || ''},</p>
            <p style="margin:0 0 14px;font-size:16px;line-height:1.6;">
              Recibimos una solicitud para cambiar tu contraseña. Por seguridad, confirma el cambio dando clic al botón:
            </p>
            <p style="text-align:center;margin:18px 0 12px;">
              <a href="${link}" style="background:#3FD0C9;color:#1E2A38;text-decoration:none;padding:14px 22px;border-radius:12px;display:inline-block;font-weight:700;font-size:16px;">
                Confirmar cambio
              </a>
            </p>
            <p style="margin:6px 0 12px;font-size:12px;">Si no solicitaste este cambio, ignora este correo.</p>
            <p style="margin:0 0 6px;font-size:12px;">El enlace caduca en 60 minutos.</p>
          </td></tr>
          <tr><td style="height:8px;background:#FFD75E;"></td></tr>
          <tr><td style="padding:14px 24px 20px;text-align:center;background:#ffffff;">
            <p style="margin:0;font-size:12px;color:#536173;font-family:Inter,Segoe UI,Arial,sans-serif;">
              © The Inner Code — introspección con calidez y claridad
            </p>
          </td></tr>
        </table>
      </td></tr></table>
  </body></html>`.trim();

  await mailer.sendMail({
    from: process.env.MAIL_FROM || '"The Inner Code" <no-reply@theinnercode.net>',
    to,
    subject: 'Confirma tu cambio de contraseña',
    html,
    attachments: [
      { filename: 'logo.png', path: path.join(__dirname, '..', 'public', 'images', 'logo.png'), cid: 'tilogo' }
    ]
  });
}

// GET /users/email-exists?email=...
router.get('/email-exists', async (req, res) => {
  try {
    const email = String(req.query.email || '').trim().toLowerCase();
    if (!email) return res.status(400).json({ message: 'Falta email' });

    try {
      await admin.auth().getUserByEmail(email);
      return res.status(200).json({ exists: true });
    } catch (err) {
      if (err.code === 'auth/user-not-found') {
        return res.status(200).json({ exists: false });
      }
      throw err;
    }
  } catch (error) {
    console.error('Error en /email-exists:', error);
    return res.status(500).json({ message: 'No se pudo validar el correo' });
  }
});



//REGISTRAR
router.post('/register', async (req, res) => {
  try {
    let {
      dailyActsCompleted,

      name,
      email,
      password,
      dateBirth,
      hourBirth,
      placeBirth,
      voicePreferred,
    } = req.body;

    // Validaciones minimas
    if (!name || !email || !password || !dateBirth || !hourBirth || !placeBirth ) {
      return res.status(400).json({ message: 'Faltan campos obligatorios.' });
    }

    email = String(email).trim().toLowerCase();

    // Validar SOLO placeBirth
    if (!isValidPlace(placeBirth)) {
      return res.status(400).json({
        message: 'placeBirth debe tener la forma {city,state,country,street,postalCode,notes}.'
      });
    }

    // 1) Verificar en Firebase Auth
    try {
      await admin.auth().getUserByEmail(email);
      return res.status(400).json({ message: 'El correo ya está registrado en el sistema.' });
    } catch (err) {
      if (err.code !== 'auth/user-not-found') throw err;
    }

    // 2) Verificar en Firestore
    const exists = await db.collection('Users').where('email', '==', email).limit(1).get();
    if (!exists.empty) {
      return res.status(400).json({ message: 'El correo ya existe en la base de datos.' });
    }

    // 3) Hashear contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Crear usuario en Firebase Auth
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: name
    });

    // Sanitizar placeBirth: conservar solo city, state, country, notes
    placeBirth = {
      city: String(placeBirth.city || '').trim(),
      state: String(placeBirth.state || '').trim(),
      country: String(placeBirth.country || '').trim(),
      notes: String(placeBirth.notes ?? '').trim()
    };

    // 5) Crear documento en Firestore (Users)
      // 5) Crear documento en Firestore (Users)
const userDoc = {
  dailyActsCompleted: Number.isFinite(Number(dailyActsCompleted)) ? Number(dailyActsCompleted) : 0,

  name,
  email,
  password: hashedPassword,
  dateBirth,
  hourBirth,
  placeBirth,
  voicePreferred,
  dateCreationAccount: admin.firestore.FieldValue.serverTimestamp(),
  isActive: true,

  // ✅ NUEVO: flags de tours (server-truth)
  tours: {
    home: { completed: false, startedAt: null, completedAt: null },
    onboarding: { completed: false, startedAt: null, completedAt: null },
    logbookwrite: { completed: false, startedAt: null, completedAt: null },
  },
};


      await db.collection('Users').doc(userRecord.uid).set(userDoc);

      // 6) CORREO DE BIENVENIDA (SIN ACTIVACIÓN)
      try {
        await sendWelcomeEmail({ to: email, name });
      } catch (e) {
        console.error('No se pudo enviar correo de bienvenida:', e);
      }

      const AUTO_IBP_ON_REGISTER = process.env.AUTO_IBP_ON_REGISTER === 'false';

if (AUTO_IBP_ON_REGISTER) {
  // ... bloque 7 completo

    
    // 7) GENERAR IBP INICIAL AUTOMATICAMENTE (no bloqueante)
    try {
      const userId = userRecord.uid;

      // Helpers locales
      function normalizeMapToSum(map, target = 10, precision = 3) {
        const keys = Object.keys(map || {});
        if (!keys.length) return {};
        const rawSum = keys.reduce((s, k) => s + (Number(map[k]) || 0), 0);
        const scaled = {};
        if (rawSum <= 0) {
          const uniform = target / keys.length;
          keys.forEach((k) => (scaled[k] = uniform));
        } else {
          const factor = target / rawSum;
          keys.forEach((k) => (scaled[k] = (Number(map[k]) || 0) * factor));
        }
        const pow = Math.pow(10, precision);
        const items = keys.map((k) => {
          const units = scaled[k] * pow;
          const floorUnits = Math.floor(units);
          return { k, floorUnits, rest: units - floorUnits };
        });
        const targetUnits = Math.round(target * pow);
        let used = items.reduce((s, it) => s + it.floorUnits, 0);
        let remaining = targetUnits - used;
        items.sort((a, b) => b.rest - a.rest);
        for (let i = 0; i < items.length && remaining > 0; i++) {
          items[i].floorUnits += 1;
          remaining -= 1;
        }
        const out = {};
        items.forEach((it) => (out[it.k] = it.floorUnits / pow));
        return out;
      }
      function sanitizeWeights(inMap, validIds) {
        const out = {};
        for (const id of validIds) {
          const v = Number(inMap?.[id]);
          out[id] = Number.isFinite(v) && v >= 0 ? v : 0;
        }
        return out;
      }

      // 7.1) Leer datos del usuario recien creado
      const userSnap = await db.collection('Users').doc(userId).get();
      const user = userSnap.exists ? (userSnap.data() || {}) : {};
      const baseline = user?.ibpBaseline || null;
const nsp_choice = baseline?.nsp_choice || null;
const NSI0 = Number(baseline?.NSI0);
const hasOnboarding = baseline?.onboardingDone === true;

      const missing = [];
      if (!user.dateBirth) missing.push('dateBirth');
      if (!user.hourBirth) missing.push('hourBirth');
      if (!user.placeBirth) missing.push('placeBirth');

      // 7.2) Contexto: Archetypes y Personality (colecciones raiz)
      const [archetypesSnap, personalitySnap] = await Promise.all([
        db.collection("Archetypes").get(),
        db.collection("Personality").get()
      ]);

      const archetypes = [];
      const archetypeIds = [];
      archetypesSnap.forEach((doc) => {
        const d = doc.data() || {};
        archetypes.push({ id: doc.id, name: d.name, description: d.description, keywords: d.keywords || [] });
        archetypeIds.push(doc.id);
      });

      const personalities = [];
      const personalityIds = [];
      personalitySnap.forEach((doc) => {
        const d = doc.data() || {};
        personalities.push({ id: doc.id, name: d.name, description: d.description });
        personalityIds.push(doc.id);
      });

      // 7.3) Llamada a OpenAI para construir el IBP inicial
      const systemPrompt = `
Eres TheInnerCode Core Model.Trabajas con lenguaje psicológico contemporáneo, claro y sin determinismo ni misticismo.
 Devuelve SOLO JSON válido con:
{
  "mode": "init",
  "lifeCycles": "string breve en texto plano (sin ';')",
  "emotionalTendency": "string breve",
  "currentLifeTrend": "string breve",
  "suggestedApproach": "string breve y accionable (2-10 palabras)",
  "justify": "60-120 palabras...",
  "facetas": ["2-6 strings"],
  "archetypeWeight": { "<ARQ_ID>": decimal, ... },
  "personalityWeight": { "<PERS_ID>": decimal, ... }
}

/**
Definición de InnerBlueprint (marco conceptual que debes reflejar en las salidas):
1) Patrón Dominante de Percepción y Procesamiento de la Realidad:
   - Sintetiza cómo la persona percibe y procesa su experiencia. Conecta con arquetipos (en la línea de Jung) pero en lenguaje psicológico contemporáneo.

2) Tendencias Cognitivo-Emocionales:
   - Describe cómo se relaciona con sus emociones, pensamientos y entorno.
   - Incluye orientación emocional, mental y relacional.

3) Ciclos Psico-Temporales:
   - Muestra patrones de cambio que tienden a repetirse (sin determinismo).
   - Identifica fases como expansión, introspección, creatividad o transformación.

4) Áreas de Enfoque Actual:
   - Señala temas internos más activos en el presente como oportunidades de exploración (no como problemas).
**/
      `.trim();

const userPrompt = `
Datos disponibles del usuario (no inventes):
- Nombre: ${user.name || "Desconocido"}
- Fecha de nacimiento: ${user.dateBirth || "FALTA"}
- Hora de nacimiento: ${user.hourBirth || "FALTA"}
- Lugar de nacimiento (place): ${user.placeBirth ? JSON.stringify(user.placeBirth) : "FALTA"}

Onboarding (G.1):
- onboardingDone: ${hasOnboarding ? "true" : "false"}
- nsp_choice: ${nsp_choice || "FALTA"}
- NSI0: ${Number.isFinite(NSI0) ? NSI0 : "FALTA"}

Contexto de arquetipos (usa estos **IDs**):
${JSON.stringify(archetypes, null, 2)}

Contexto de rasgos de personalidad (usa estos **IDs**):
${JSON.stringify(personalities, null, 2)}

Tarea:
1) Genera el contenido del InnerBluePrint (modo: "init") siguiendo el formato JSON solicitado.
2) Asigna "archetypeWeight" y "personalityWeight" como mapas {id: peso}, con suma cercana a 10 cada uno.
3) Si encuentras datos faltantes (p. ej., ${missing.join(", ") || "—"}), menciónalo en "justify" y evita conclusiones fuertes.
`.trim();


      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.4
      });

      const raw = completion.choices?.[0]?.message?.content?.trim() || "{}";
      function safeParse(jsonish) {
        try {
          const start = jsonish.indexOf("{");
          const end = jsonish.lastIndexOf("}");
          if (start >= 0 && end >= 0) return JSON.parse(jsonish.slice(start, end + 1));
        } catch {}
        return null;
      }
      let modelOut = safeParse(raw);

      if (!modelOut || typeof modelOut !== "object") {
        modelOut = {
          mode: "init",
          lifeCycles: "inicio; calibración",
          emotionalTendency: "reservado",
          currentLifeTrend: "equilibrio en formación",
          suggestedApproach: "observa, escribe, respira",
          justify: `Salida no totalmente estructurada. ${missing.length ? `Faltan: ${missing.join(", ")}.` : ""}`,
          facetas: ["autenticidad", "claridad", "curiosidad"],
          archetypeWeight: Object.fromEntries(archetypeIds.map(id => [id, 10 / Math.max(1, archetypeIds.length)])),
          personalityWeight: Object.fromEntries(personalityIds.map(id => [id, 10 / Math.max(1, personalityIds.length)])),
        };
      }

      // 7.4) Saneamiento y normalizacion
      modelOut.mode = "init";
      modelOut.lifeCycles = modelOut.lifeCycles || "fase inicial de ajuste";
      modelOut.emotionalTendency = modelOut.emotionalTendency || "reservado";
      modelOut.currentLifeTrend = modelOut.currentLifeTrend || "equilibrio en formación";
      modelOut.suggestedApproach = modelOut.suggestedApproach || "observa, escribe, respira";
      modelOut.justify = modelOut.justify || "Base inicial construida con datos disponibles...";
      modelOut.facetas = Array.isArray(modelOut.facetas) && modelOut.facetas.length ? modelOut.facetas : ["autenticidad", "claridad", "curiosidad"];

      let archetypeWeight = sanitizeWeights(modelOut.archetypeWeight, archetypeIds);
      let personalityWeight = sanitizeWeights(modelOut.personalityWeight, personalityIds);
      archetypeWeight = normalizeMapToSum(archetypeWeight, 10, 3);
      personalityWeight = normalizeMapToSum(personalityWeight, 10, 3);

      // 7.5) Guardar IBP
      const ibpPayload = {
        mode: modelOut.mode,
        lifeCycles: modelOut.lifeCycles,
        emotionalTendency: modelOut.emotionalTendency,
        currentLifeTrend: modelOut.currentLifeTrend,
        suggestedApproach: modelOut.suggestedApproach,
        archetypeWeight,
        justify: modelOut.justify,
        facetas: modelOut.facetas,
        personalityWeight,
        dateCreation: admin.firestore.FieldValue.serverTimestamp(),
        userId
      };

      await db.collection("InnerBluePrint").add(ibpPayload);
    } catch (e) {
      console.error("No se pudo generar IBP inicial tras registro:", e);
      // No interrumpe el registro
    }
  }





    // ✅ Generar JWT para auto-login tras registro
const payload = { uid: userRecord.uid, email, name };
const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

return res.status(201).json({
  message: 'Usuario registrado correctamente',
  token,
  uid: userRecord.uid,
  user: {
    name,
    email,
    voicePreferred,
    isActive: true
  }
});


  } catch (error) {
    console.error('Error al registrar usuario:', error);
    return res.status(500).json({
      message: 'Error al registrar usuario',
      error: error.message
    });
  }
});


// GET /users/activate/:token   (publico, retorna pagina HTML)
router.get('/activate/:token', async (req, res) => {
  try {
    const raw = String(req.params.token || '').trim();
    if (!raw) {
      return res.sendFile(path.join(__dirname, '..', 'public', 'activation-error.html'));
    }

    const hash = crypto.createHash('sha256').update(raw).digest('hex');

    const snap = await db.collection('Users')
      .where('activationTokenHash', '==', hash)
      .limit(1)
      .get();

    if (snap.empty) {
      return res.sendFile(path.join(__dirname, '..', 'public', 'activation-error.html'));
    }

    const userDoc = snap.docs[0];
    const data = userDoc.data();

    const exp = data.activationExpiresAt?.toDate ? data.activationExpiresAt.toDate() : null;
    if (!exp || new Date() > exp) {
      await userDoc.ref.set({
        activationTokenHash: admin.firestore.FieldValue.delete(),
        activationExpiresAt: admin.firestore.FieldValue.delete()
      }, { merge: true });

      return res.sendFile(path.join(__dirname, '..', 'public', 'activation-error.html'));
    }

    // Si ya estaba activa, igual mostramos "success"
    await userDoc.ref.set({
      isActive: true,
      dateActivation: admin.firestore.FieldValue.serverTimestamp(),
      activationTokenHash: admin.firestore.FieldValue.delete(),
      activationExpiresAt: admin.firestore.FieldValue.delete()
    }, { merge: true });

    return res.sendFile(path.join(__dirname, '..', 'public', 'activation-success.html'));
  } catch (error) {
    console.error('Error en /users/activate/:token:', error);
    return res.sendFile(path.join(__dirname, '..', 'public', 'activation-error.html'));
  }
});

// GET /users/time/total
router.get('/time/total', verifyToken, async (req, res) => {
  try {
    const userId = req.user.uid;
    const snap = await db.collection('Users').doc(userId).get();
    const totalTimeSeconds = Number(snap.data()?.totalTimeSeconds ?? 0);
    return res.status(200).json({ ok: true, totalTimeSeconds });
  } catch (e) {
    return res.status(500).json({ ok: false, message: 'Error al leer tiempo total' });
  }
});

// POST /users/time/add   { seconds: number }
router.post('/time/add', verifyToken, async (req, res) => {
  try {
    const userId = req.user.uid;
    const seconds = Number(req.body?.seconds);

    if (!Number.isFinite(seconds) || seconds <= 0) {
      return res.status(400).json({ ok: false, message: 'seconds inválido' });
    }

    const userRef = db.collection('Users').doc(userId);
    await userRef.set(
      {
        totalTimeSeconds: admin.firestore.FieldValue.increment(Math.floor(seconds)),
        totalTimeUpdatedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    const snap = await userRef.get();
    return res.status(200).json({
      ok: true,
      totalTimeSeconds: Number(snap.data()?.totalTimeSeconds ?? 0),
    });
  } catch (e) {
    return res.status(500).json({ ok: false, message: 'Error al sumar tiempo' });
  }
});


// POST /users/time/total
// Guarda/actualiza el tiempo total acumulado (segundos) en el doc Users/{uid}
router.post('/time/total', verifyToken, async (req, res) => {
  try {
    const userId = req.user.uid;

    const totalSeconds = Number(req.body?.totalSeconds);
    if (!Number.isFinite(totalSeconds) || totalSeconds < 0) {
      return res.status(400).json({ ok: false, message: 'totalSeconds inválido' });
    }

    const userRef = db.collection('Users').doc(userId);

    // (Opcional) evitar que un valor menor “pise” uno mayor
    const snap = await userRef.get();
    const prev = Number(snap.data()?.totalTimeSeconds ?? 0);

    const next = Math.max(prev, Math.floor(totalSeconds));

    await userRef.set(
      {
        totalTimeSeconds: next,
        totalTimeUpdatedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    return res.status(200).json({ ok: true, totalTimeSeconds: next });
  } catch (error) {
    console.error('Error POST /users/time/total:', error);
    return res.status(500).json({ ok: false, message: 'Error al guardar tiempo total', error: error.message });
  }
});



// POST /users/settings/click  -> incrementa contador "click" del usuario
router.post('/settings/click', verifyToken, async (req, res) => {
  try {
    const userId = req.user.uid;

    const userRef = db.collection('Users').doc(userId);

    // Incremento atómico
    await userRef.set(
      { click: admin.firestore.FieldValue.increment(1) },
      { merge: true }
    );

    // (Opcional) devolver el valor actualizado
    const snap = await userRef.get();
    const click = Number(snap.data()?.click ?? 0);

    return res.status(200).json({ ok: true, click });
  } catch (error) {
    console.error('Error POST /users/settings/click:', error);
    return res.status(500).json({ ok: false, message: 'Error al incrementar click', error: error.message });
  }
});




// helpers
const clamp = (x, min = 0, max = 100) => Math.max(min, Math.min(max, x));
const W_PREV = 0.85;
const W_RAW  = 0.15;

router.post('/nsi/checkin', verifyToken, async (req, res) => {
  try {
    const userId = req.user.uid;
    const { feel_choice } = req.body || {};

    const allowed = new Set(['wired', 'heavy', 'steady']);
    if (!allowed.has(String(feel_choice || ''))) {
      return res.status(400).json({ message: 'feel_choice inválido. Usa: wired | heavy | steady' });
    }

    // 1) delta micro
    const deltaMicro =
      feel_choice === 'wired' ? 10 :
      feel_choice === 'heavy' ? -10 :
      0;

    const userRef = db.collection('Users').doc(userId);
    const userSnap = await userRef.get();
    if (!userSnap.exists) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const user = userSnap.data() || {};
    const baseline = user?.ibpBaseline || {};
    const NSI0 = Number(baseline?.NSI0);

    const prev =
      Number.isFinite(Number(user?.nsiCurrent)) ? Number(user.nsiCurrent) :
      Number.isFinite(NSI0) ? NSI0 :
      50;

    // ✅ contador actual (antes de incrementar)
    
    const prevDailyActsCompleted = Number(user?.dailyActsCompleted ?? 0);
    const dailyActsCompleted = prevDailyActsCompleted + 1;

    // 2) (por ahora no hay behavior/text)
    const deltaBehavior = 0;
    const deltaText = 0;

    // 3) raw (sin suavizado)
    const raw = clamp(prev + deltaMicro + deltaBehavior + deltaText, 0, 100);

    // 4) suavizado (EMA)
    let next = (W_PREV * prev) + (W_RAW * raw);
    next = Math.round(next);
    next = clamp(next, 0, 100);

    // 5) Guardar en Users (incrementa dailyActsCompleted)
    await userRef.set({
      dailyActsCompleted: admin.firestore.FieldValue.increment(1),

      nsiCurrent: next,
      nsiUpdatedAt: admin.firestore.FieldValue.serverTimestamp(),
      nsiRawLast: raw,
    }, { merge: true });

    // 6) Histórico (recomendado)
    await db.collection('NSIHistory').add({
      userId,
      feel_choice,
      prev,
      raw,
      next,
      deltaMicro,
      deltaBehavior,
      deltaText,
      dateCreation: admin.firestore.FieldValue.serverTimestamp(),
    });
// 2) 👇 AQUÍ VA ESTO (leer el valor ya actualizado)
    const afterSnap = await userRef.get();
    
    // 7) Respuesta al frontend
    return res.status(200).json({
      message: 'NSI actualizado',
      nsi: next,
      prev,
      raw,
      feel_choice,
      dailyActsCompleted, // ✅ ya correcto (prev + 1)
    });

  } catch (error) {
    console.error('Error POST /users/nsi/checkin:', error);
    return res.status(500).json({
      message: 'Error al actualizar NSI',
      error: error.message,
    });
  }
});





// POST /users/activate/resend
router.post('/activate/resend', async (req, res) => {
  try {
    let { email } = req.body || {};
    if (!email) {
      return res.status(400).json({ message: 'Falta "email"' });
    }
    email = String(email).trim().toLowerCase();

    // Buscar usuario
    const snap = await db.collection('Users').where('email', '==', email).limit(1).get();
    if (snap.empty) {
      return res.status(404).json({ message: 'No existe usuario con ese email' });
    }

    const userDoc = snap.docs[0];
    const data = userDoc.data();

    // Ya esta activo → no reenviar
    if (data.isActive) {
      return res.status(409).json({ message: 'La cuenta ya está activa, no es necesario reenviar' });
    }

    // Generar nuevo token
    const { raw, hash } = makeActivationToken();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

    await userDoc.ref.set({
      activationTokenHash: hash,
      activationExpiresAt: admin.firestore.Timestamp.fromDate(expiresAt)
    }, { merge: true });

    const link = buildActivationLink(raw);
    await sendActivationEmail({ to: email, name: data.name, link });

    return res.status(200).json({ message: 'Correo de activación reenviado' });

  } catch (error) {
    console.error('Error en /users/activate/resend:', error);
    return res.status(500).json({ message: 'Error al reenviar activación', error: error.message });
  }
});


//LOGIN
router.post('/login', async (req, res) => {
  try {
    let { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Faltan "email" y/o "password".' });
    }

    email = String(email).trim().toLowerCase();   // 👈 MISMO TRATAMIENTO QUE EN /register

    const snapshot = await db.collection('Users')
      .where('email', '==', email)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return res.status(404).json({ message: 'Correo no registrado' });
    }

    const userDoc = snapshot.docs[0];
    const userData = userDoc.data();
    const userId = userDoc.id;

    const passwordMatch = await bcrypt.compare(password, userData.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    // Si quieres volver a exigir activación, descomentas esto y pones isActive: false en /register
    // if (!userData.isActive) {
    //   return res.status(403).json({
    //     message: 'Tu cuenta no está activada. Revisa tu correo.',
    //     activationRequired: true
    //   });
    // }

    //jwt
    const payload = { uid: userId, email: userData.email, name: userData.name };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

    return res.status(200).json({
      message: 'Inicio de sesión exitoso',
      token,
      uid: userId,
      user: {
        name: userData.name,
        email: userData.email,
        voicePreferred: userData.voicePreferred,
        isActive: userData.isActive
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    return res.status(500).json({
      message: 'Error en el proceso de login',
      error: error.message
    });
  }
});



// POST /users/forgot-password  (solicita cambio y envía correo)
router.post('/forgot-password', async (req, res) => {
  try {
    let { email, newPassword } = req.body || {};
    if (!email || !newPassword) {
      return res.status(400).json({ message: 'Faltan "email" y/o "newPassword".' });
    }

    email = String(email).trim().toLowerCase();

    // Busca usuario en Firestore
    const snap = await db.collection('Users').where('email', '==', email).limit(1).get();
    if (snap.empty) return res.status(404).json({ message: 'No existe usuario con ese email.' });

    const userDoc = snap.docs[0];
    const data = userDoc.data();
    if (!data.isActive) {
      return res.status(409).json({ message: 'La cuenta aún no está activa. Actívala antes de cambiar la contraseña.' });
    }

    // Cifra temporalmente la nueva contraseña
    const pendingNewPasswordEnc = aesEncrypt(newPassword);

    // Token y expiracion
    const { raw, hash } = makeActivationToken();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 60 minutos

    await userDoc.ref.set({
      resetTokenHash: hash,
      resetExpiresAt: admin.firestore.Timestamp.fromDate(expiresAt),
      pendingNewPasswordEnc
    }, { merge: true });

    const link = buildResetLink(raw);
    await sendPasswordChangeEmail({ to: email, name: data.name, link });

    return res.status(200).json({ message: 'Te enviamos un correo para confirmar el cambio de contraseña.' });
  } catch (error) {
    console.error('Error en /users/forgot-password:', error);
    return res.status(500).json({ message: 'Error al iniciar cambio de contraseña', error: error.message });
  }
});


// GET /users/forgot-password/confirm/:token  (confirma y aplica)
router.get('/forgot-password/confirm/:token', async (req, res) => {
  try {
    const raw = String(req.params.token || '').trim();
    if (!raw) {
      return res.sendFile(path.join(__dirname, '..', 'public', 'password-reset-error.html'));
    }

    const hash = crypto.createHash('sha256').update(raw).digest('hex');

    const snap = await db.collection('Users').where('resetTokenHash', '==', hash).limit(1).get();
    if (snap.empty) {
      return res.sendFile(path.join(__dirname, '..', 'public', 'password-reset-error.html'));
    }

    const doc = snap.docs[0];
    const data = doc.data();

    // Validaciones
    const exp = data.resetExpiresAt?.toDate ? data.resetExpiresAt.toDate() : null;
    if (!exp || new Date() > exp || !data.pendingNewPasswordEnc) {
      await doc.ref.set({
        resetTokenHash: admin.firestore.FieldValue.delete(),
        resetExpiresAt: admin.firestore.FieldValue.delete(),
        pendingNewPasswordEnc: admin.firestore.FieldValue.delete()
      }, { merge: true });

      return res.sendFile(path.join(__dirname, '..', 'public', 'password-reset-error.html'));
    }

    // Descifrar nueva contraseña
    let newPlain;
    try {
      newPlain = aesDecrypt(data.pendingNewPasswordEnc);
    } catch (e) {
      console.error('Fallo al descifrar pendingNewPasswordEnc:', e);
      return res.sendFile(path.join(__dirname, '..', 'public', 'password-reset-error.html'));
    }

    const uid = doc.id;

    // 1) Actualizar en Firebase Auth
    await admin.auth().updateUser(uid, { password: newPlain });

    // 2) Guardar hash bcrypt en Firestore y limpiar temporales
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPlain, salt);

    await doc.ref.set({
      password: hashedPassword,
      datePasswordChanged: admin.firestore.FieldValue.serverTimestamp(),
      resetTokenHash: admin.firestore.FieldValue.delete(),
      resetExpiresAt: admin.firestore.FieldValue.delete(),
      pendingNewPasswordEnc: admin.firestore.FieldValue.delete()
    }, { merge: true });

    return res.sendFile(path.join(__dirname, '..', 'public', 'password-reset-success.html'));
  } catch (error) {
    console.error('Error en /users/forgot-password/confirm/:token:', error);
    return res.sendFile(path.join(__dirname, '..', 'public', 'password-reset-error.html'));
  }
});


// POST /datauser (crea registro de login/logout)
router.post('/datauser', verifyToken, async (req, res) => {
  try {
    const userId = req.user?.uid;
    if (!userId) {
      return res.status(401).json({ message: 'Token inválido' });
    }

    const { dateLogin, dateLogout } = req.body || {};

    const toTs = (v) => {
      if (!v) return null;
      const d = new Date(v);
      if (isNaN(d.getTime())) return null;
      return admin.firestore.Timestamp.fromDate(d);
    };

    // Validaciones
    const tsLogin = toTs(dateLogin);
    if (!tsLogin) {
      return res.status(400).json({ message: 'dateLogin es obligatorio y debe ser ISO válido.' });
    }

    const tsLogout = dateLogout ? toTs(dateLogout) : admin.firestore.FieldValue.serverTimestamp();
    if (dateLogout && !tsLogout) {
      return res.status(400).json({ message: 'dateLogout debe ser ISO válido.' });
    }

    await db.collection('DataUser').add({
      userId,
      dateCreation: admin.firestore.FieldValue.serverTimestamp(),
      dateLogin: tsLogin,   // siempre tu fecha
      dateLogout: tsLogout, // tu fecha o serverTimestamp si no mandas nada
    });

    return res.status(201).json({
      message: 'Registro en DataUser creado correctamente'
    });
  } catch (error) {
    console.error('Error en /datauser:', error);
    return res.status(500).json({
      message: 'Error al crear registro en DataUser',
      error: error.message,
    });
  }
});

// POST /users/ibp/onboarding
router.post('/ibp/onboarding', verifyToken, async (req, res) => {
  try {
    const userId = req.user.uid;
    const { nsp_choice } = req.body || {};

    const allowed = new Set(['rev_up', 'shut_down', 'stay_steady']);
    if (!allowed.has(String(nsp_choice || ''))) {
      return res.status(400).json({
        message: 'nsp_choice inválido. Usa: rev_up | shut_down | stay_steady'
      });
    }

    // NSI₀ según G.1
    const NSI0 =
      nsp_choice === 'rev_up' ? 75 :
      nsp_choice === 'shut_down' ? 25 :
      50;

    // Guardar baseline en Users (merge)
    await db.collection('Users').doc(userId).set({
      ibpBaseline: {
        nsp_choice,
        NSI0,
        onboardingDone: true,
        onboardingAt: admin.firestore.FieldValue.serverTimestamp(),
      }
    }, { merge: true });

    return res.status(200).json({
      message: 'Onboarding IBP guardado',
      baseline: { nsp_choice, NSI0 }
    });

  } catch (error) {
    console.error('Error POST /ibp/onboarding:', error);
    return res.status(500).json({ message: 'Error al guardar onboarding', error: error.message });
  }
});




//POST Inner Blueprint
router.post('/inner-blueprint', verifyToken, async (req, res) => {
  try {
    const userId = req.user.uid;

    // Helpers: normalizacion por mayores restos
    function normalizeMapToSum(map, target = 10, precision = 3) {
      const keys = Object.keys(map || {});
      if (!keys.length) return {};
      const rawSum = keys.reduce((s, k) => s + (Number(map[k]) || 0), 0);

      const scaled = {};
      if (rawSum <= 0) {
        const uniform = target / keys.length;
        keys.forEach((k) => (scaled[k] = uniform));
      } else {
        const factor = target / rawSum;
        keys.forEach((k) => (scaled[k] = (Number(map[k]) || 0) * factor));
      }

      const pow = Math.pow(10, precision);
      const items = keys.map((k) => {
        const units = scaled[k] * pow;
        const floorUnits = Math.floor(units);
        return { k, floorUnits, rest: units - floorUnits };
      });

      const targetUnits = Math.round(target * pow);
      let used = items.reduce((s, it) => s + it.floorUnits, 0);
      let remaining = targetUnits - used;

      items.sort((a, b) => b.rest - a.rest);
      for (let i = 0; i < items.length && remaining > 0; i++) {
        items[i].floorUnits += 1;
        remaining -= 1;
      }

      const out = {};
      items.forEach((it) => (out[it.k] = it.floorUnits / pow));
      return out;
    }

    // 1) Datos del usuario
    const userSnap = await db.collection('Users').doc(userId).get();
    if (!userSnap.exists) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    
    const user = userSnap.data();
    const baseline = user?.ibpBaseline || null;
const nsp_choice = baseline?.nsp_choice || null;
const NSI0 = Number(baseline?.NSI0);
const hasOnboarding = baseline?.onboardingDone === true;

    const missing = [];
    if (!user.dateBirth) missing.push('dateBirth');
    if (!user.hourBirth) missing.push('hourBirth');
    if (!user.placeBirth) missing.push('placeBirth');

    // 2) Cargar contexto real de Firestore para el prompt
    // Archetypes
    const archetypesSnap = await db.collection("Archetypes").get();
    const archetypes = [];
    const archetypeIds = [];
    archetypesSnap.forEach((doc) => {
      const d = doc.data() || {};
      archetypes.push({ id: doc.id, name: d.name, description: d.description, keywords: d.keywords || [] });
      archetypeIds.push(doc.id);
    });

    // Personality
    const personalitySnap = await db.collection("Personality").get();
    const personalities = [];
    const personalityIds = [];
    personalitySnap.forEach((doc) => {
      const d = doc.data() || {};
      personalities.push({ id: doc.id, name: d.name, description: d.description });
      personalityIds.push(doc.id);
    });

    // 3) Prompt a OpenAI: pide JSON con pesos + texto
const systemPrompt = `
Eres TheInnerCode Core Model...
Debes devolver **JSON válido** con estas claves:
{
  "mode": "init",
  "lifeCycles": "string breve en texto plano (sin ';')",
  "emotionalTendency": "string breve",
  "currentLifeTrend": "string breve",
  "suggestedApproach": "string breve y accionable (2-10 palabras)",
  "justify": "60-120 palabras...",
  "facetas": ["2-6 strings"],
  "archetypeWeight": { "<ARQ_ID>": decimal, ... },    // suma ≈10
  "personalityWeight": { "<PERS_ID>": decimal, ... }  // suma ≈10
}

Reglas de Onboarding (G.1) para calibrar el IBP:
- Si onboardingDone=true, usa NSI0 como baseline del sistema nervioso.
  - NSI0 ~75 (rev_up): tendencia a hiperactivación (prisa, tensión, rumiación).
  - NSI0 ~25 (shut_down): tendencia a hipoactivación (apagamiento, desconexión).
  - NSI0 ~50 (stay_steady): ventana regulada (estabilidad).
- Refleja esa calibración en:
  - "suggestedApproach" (acción breve y útil)
  - y "justify" (explica cómo influye, sin determinismo).
- Si onboardingDone=false, no inventes NSI0; usa lenguaje prudente en "justify".
`;

    const userPrompt = `
Datos disponibles del usuario (no inventes):
- Nombre: ${user.name || "Desconocido"}
- Fecha de nacimiento: ${user.dateBirth || "FALTA"}
- Hora de nacimiento: ${user.hourBirth || "FALTA"}
- Lugar de nacimiento (place): ${user.placeBirth ? JSON.stringify(user.placeBirth) : "FALTA"}

Contexto de arquetipos (usa estos **IDs**):
${JSON.stringify(archetypes, null, 2)}

Contexto de rasgos de personalidad (usa estos **IDs**):
${JSON.stringify(personalities, null, 2)}

Tarea:
1) Genera el contenido del InnerBluePrint (modo: "init") siguiendo el formato JSON solicitado.
2) Asigna "archetypeWeight" y "personalityWeight" como mapas {id: peso}, con suma cercana a 10 cada uno.
3) Si encuentras datos faltantes (p. ej., ${missing.join(", ") || "—"}), menciónalo en "justify" y evita conclusiones fuertes.

Onboarding (G.1):
- onboardingDone: ${hasOnboarding ? "true" : "false"}
- nsp_choice: ${nsp_choice || "FALTA"}
- NSI0: ${Number.isFinite(NSI0) ? NSI0 : "FALTA"}


`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt.trim() },
        { role: "user", content: userPrompt.trim() },
      ],
      temperature: 0.4,
    });

    const raw = completion.choices?.[0]?.message?.content?.trim() || "{}";

    function safeParse(jsonish) {
      try {
        const start = jsonish.indexOf("{");
        const end = jsonish.lastIndexOf("}");
        if (start >= 0 && end >= 0) return JSON.parse(jsonish.slice(start, end + 1));
      } catch { /* noop */ }
      return null;
    }

    let modelOut = safeParse(raw);

    // 4) Fallback conservador si no llego JSON bien formado
    if (!modelOut || typeof modelOut !== "object") {
      modelOut = {
        mode: "init",
        lifeCycles: "inicio; calibración",
        emotionalTendency: "reservado",
        currentLifeTrend: "equilibrio en formación",
        suggestedApproach: "observa, escribe, respira",
        justify: `Salida no totalmente estructurada. Fallback conservador. ${missing.length ? `Faltan: ${missing.join(", ")}.` : ""}`,
        facetas: ["autenticidad", "claridad", "curiosidad"],
        archetypeWeight: Object.fromEntries(archetypeIds.map((id) => [id, 10 / Math.max(1, archetypeIds.length)])),
        personalityWeight: Object.fromEntries(personalityIds.map((id) => [id, 10 / Math.max(1, personalityIds.length)])),
      };
    }

    // 5) Saneamiento mínimo + forzar mode:init
    modelOut.mode = "init";
    modelOut.lifeCycles = modelOut.lifeCycles || "fase inicial de ajuste";
    modelOut.emotionalTendency = modelOut.emotionalTendency || "reservado";
    modelOut.currentLifeTrend = modelOut.currentLifeTrend || "equilibrio en formación";
    modelOut.suggestedApproach = modelOut.suggestedApproach || "observa, escribe, respira";
    modelOut.justify = modelOut.justify || "Base inicial construida con datos disponibles...";
    modelOut.facetas = Array.isArray(modelOut.facetas) && modelOut.facetas.length
      ? modelOut.facetas
      : ["autenticidad", "claridad", "curiosidad"];

    // 6) Validar que los pesos usen SOLO IDs válidos y sean >=0
    function sanitizeWeights(inMap, validIds) {
      const out = {};
      for (const id of validIds) {
        const v = Number(inMap?.[id]);
        out[id] = Number.isFinite(v) && v >= 0 ? v : 0;
      }
      return out;
    }

    let archetypeWeight = sanitizeWeights(modelOut.archetypeWeight, archetypeIds);
    let personalityWeight = sanitizeWeights(modelOut.personalityWeight, personalityIds);

    // 7) Renormalizar a Σ=10 exacto con tu método
    archetypeWeight = normalizeMapToSum(archetypeWeight, 10, 3);
    personalityWeight = normalizeMapToSum(personalityWeight, 10, 3);

    // 8) Construir payload final y guardar
    const payload = {
      ibpBaseline: hasOnboarding ? { nsp_choice, NSI0 } : null,
      mode: modelOut.mode,
      lifeCycles: modelOut.lifeCycles,
      emotionalTendency: modelOut.emotionalTendency,
      currentLifeTrend: modelOut.currentLifeTrend,
      suggestedApproach: modelOut.suggestedApproach,
      archetypeWeight,                                    // Σ=10 exacto
      justify: modelOut.justify,
      facetas: modelOut.facetas,
      personalityWeight,                                  // Σ=10 exacto
      dateCreation: admin.firestore.FieldValue.serverTimestamp(),
      userId,
    };

    const ref = await db.collection("InnerBluePrint").add(payload);

    res.status(201).json({
      message: "Inner BluePrint (init) generado y guardado con éxito (pesos por modelo, validados en servidor)",
      id: ref.id,
      blueprint: payload,
      missingFields: missing,
    });

  } catch (error) {
    console.error("Error en /inner-blueprint:", error);
    res.status(500).json({
      message: "Error al generar el Inner BluePrint",
      error: error.message,
    });
  }
});


// GET /inner-blueprint
router.get('/inner-blueprint', verifyToken, async (req, res) => {
  try {
    const userId = req.user.uid;

    // Traer el ultimo blueprint del usuario, ordenado por dateCreation desc
    const snap = await db.collection('InnerBluePrint')
      .where('userId', '==', userId)
      .orderBy('dateCreation', 'desc')
      .limit(1)
      .get();

    if (snap.empty) {
      return res.status(404).json({ message: 'No se encontró ningún Inner Blueprint para este usuario' });
    }

    const doc = snap.docs[0];
    const data = doc.data();

    res.status(200).json({
      id: doc.id,
      ...data,
      dateCreation: data.dateCreation?.toDate ? data.dateCreation.toDate() : null
    });

  } catch (error) {
    console.error('Error GET /inner-blueprint:', error);
    res.status(500).json({
      message: 'Error al obtener el último Inner Blueprint',
      error: error.message
    });
  }
});


// POST /logbook
router.post('/logbook', verifyToken, async (req, res) => {
  // ✅ SIEMPRE definido aunque algo truene
  let dailyActsCompleted = 0;

  try {
    const userId = req.user.uid;
    const { prompt } = req.body || {};

    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return res.status(400).json({ message: 'Falta "prompt" (string no vacío)' });
    }

    // Prompt para el modelo (enfocado y con JSON estricto) logbook bitacora
    const sys = `Eres TheInnerCode Core Model. Eres un profesional de apoyo emocional. Respondes con empatía, validando emociones y ofreciendo 1 sugerencia práctica breve.`;
    const usr = `
El usuario comparte cómo se siente. Responde en español con:
- "answer": párrafo breve (3–6 frases), tono cálido, sin diagnósticos clínicos.
- "emotionsDetected": lista de 3 a 5 emociones en minúsculas (p.ej.: "ansiedad","tristeza","culpa","miedo","calma","gratitud","esperanza","enojo","frustración","alivio","confusión","soledad"). No repitas, sin emojis.
Importante: Responde SOLO con JSON válido.

Entrada del usuario:
"""${prompt}"""
Responde SOLO con JSON:
{
  "answer": "string",
  "emotionsDetected": ["string","string","string"]
}
    `.trim();

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.5,
      messages: [
        { role: "system", content: sys },
        { role: "user", content: usr }
      ]
    });

    let payload;
    try {
      payload = JSON.parse(completion.choices?.[0]?.message?.content || "{}");
    } catch {
      return res.status(502).json({ message: "Respuesta del modelo no es JSON válido" });
    }

    // Validacion mínima de salida
    const answer = String(payload?.answer || "").trim();
    let emotions = Array.isArray(payload?.emotionsDetected) ? payload.emotionsDetected : [];
    // Normaliza emociones: string, minúsculas, sin vacíos, sin duplicados
    emotions = emotions
      .map(e => String(e || "").toLowerCase().trim())
      .filter(e => e.length > 0);
    emotions = [...new Set(emotions)];
    // Asegura 3–5
    if (emotions.length < 3 || emotions.length > 5) {
      return res.status(502).json({
        message: "El modelo no devolvió entre 3 y 5 emociones",
        emotionsDetected: emotions
      });
    }
    if (!answer) {
      return res.status(502).json({ message: "El modelo no devolvió 'answer' válido" });
    }




   const docRef = await db.collection("Logbook").add({
      dateCreation: admin.firestore.FieldValue.serverTimestamp(),
      prompt,
      answer,
      emotionsDetected: emotions,
      userId
    });

    // ✅ INCREMENTO ATÓMICO (evita +2)
    const tz = 'America/Mexico_City';
    const todayKey = toDayKey(new Date(), tz);

    const userRef = db.collection('Users').doc(userId);

    await db.runTransaction(async (tx) => {
      const snap = await tx.get(userRef);
      const user = snap.exists ? (snap.data() || {}) : {};

      const prev = Number(user.dailyActsCompleted ?? 0);
      const last = String(user.dailyActsLastCountedDayKey || '');

      if (last !== todayKey) {
        tx.set(
          userRef,
          {
            dailyActsCompleted: admin.firestore.FieldValue.increment(1),
            dailyActsLastCountedDayKey: todayKey,
            dailyActsLastCountedAt: admin.firestore.FieldValue.serverTimestamp(),
            dailyActsLastCountedSource: 'logbook',
          },
          { merge: true }
        );
        dailyActsCompleted = prev + 1;
      } else {
        dailyActsCompleted = prev;
      }
    });




    // --- DESPUES de crear la entrada de Logbook (docRef) ---

    function normalizeMapToSum(map, target = 10, precision = 3) {
      const keys = Object.keys(map || {});
      if (!keys.length) return {};
      const rawSum = keys.reduce((s, k) => s + (Number(map[k]) || 0), 0);

      const scaled = {};
      if (rawSum <= 0) {
        const uniform = target / keys.length;
        keys.forEach((k) => (scaled[k] = uniform));
      } else {
        const factor = target / rawSum;
        keys.forEach((k) => (scaled[k] = (Number(map[k]) || 0) * factor));
      }

      const pow = Math.pow(10, precision);
      const items = keys.map((k) => {
        const units = scaled[k] * pow;
        const floorUnits = Math.floor(units);
        return { k, floorUnits, rest: units - floorUnits };
      });

      const targetUnits = Math.round(target * pow);
      let used = items.reduce((s, it) => s + it.floorUnits, 0);
      let remaining = targetUnits - used;

      items.sort((a, b) => b.rest - a.rest);
      for (let i = 0; i < items.length && remaining > 0; i++) {
        items[i].floorUnits += 1;
        remaining -= 1;
      }

      const out = {};
      items.forEach((it) => (out[it.k] = it.floorUnits / pow));
      return out;
    }

    function sanitizeWeights(inMap, validIds) {
      const out = {};
      for (const id of validIds) {
        const v = Number(inMap?.[id]);
        out[id] = Number.isFinite(v) && v >= 0 ? v : 0;
      }
      return out;
    }

    let ibpUpdate = { status: 'skipped' };
    try {
      // 1) Cargar ultimo IBP (baseline)
      const lastIbpSnap = await db.collection("Users")
        .doc(userId)
        .collection("InnerBluePrint")
        .orderBy("dateCreation", "desc")
        .limit(1)
        .get();

      const lastIbp = !lastIbpSnap.empty ? lastIbpSnap.docs[0].data() : null;

      // 2) Cargar contexto real (arquetipos / personalidad)
      const [arqSnap, persSnap] = await Promise.all([
        db.collection("Archetypes").get(),
        db.collection("Personality").get(),
      ]);

      const archetypes = [];
      const archetypeIds = [];
      arqSnap.forEach((doc) => {
        const d = doc.data() || {};
        archetypes.push({ id: doc.id, name: d.name, description: d.description, keywords: d.keywords || [] });
        archetypeIds.push(doc.id);
      });

      const personalities = [];
      const personalityIds = [];
      persSnap.forEach((doc) => {
        const d = doc.data() || {};
        personalities.push({ id: doc.id, name: d.name, description: d.description });
        personalityIds.push(doc.id);
      });

      // 3) Prompt al modelo para "UPDATE" (usa la bitacora como señal reciente)
      const sysIbp = `
    Eres TheInnerCode Core Model. Mantienes el InnerBluePrint (IBP) con trazabilidad.
    Actualiza el IBP con nueva evidencia (bitácora), sin misticismo ni determinismo.
    Lenguaje claro, 2ª persona, sereno, científico y humanista.
    Devuelve JSON válido con:
    {
      "mode": "update",
      "lifeCycles": "string en texto plano",
      "emotionalTendency": "string breve",
      "currentLifeTrend": "string breve",
      "suggestedApproach": "string breve y accionable (2-10 palabras)",
      "justify": "60-140 palabras explicando QUÉ cambió y POR QUÉ, citando la nueva evidencia (bitácora) y señalando incertidumbre si aplica",
      "facetas": ["2-6 strings"],
      "archetypeWeight": { "<ARQ_ID>": decimal, ... },     // usar EXACTAMENTE los IDs provistos
      "personalityWeight": { "<PERS_ID>": decimal, ... }   // usar EXACTAMENTE los IDs provistos
    }
    Suma de cada mapa ≈ 10 (el servidor ajustará a Σ=10 exacto).
    Si no hay baseline previo, actúa como una primera actualización mínima.
    `.trim();

      const usrIbp = `
    Contexto del usuario (nueva evidencia):
    - Entrada de bitácora (prompt): ${prompt}
    - Respuesta generada: ${answer}
    - Emociones detectadas: ${JSON.stringify(emotions)}

    Baseline previo (puede ser null):
    ${JSON.stringify(lastIbp || {}, null, 2)}

    Arquetipos disponibles (IDs válidos):
    ${JSON.stringify(archetypes, null, 2)}

    Rasgos de personalidad disponibles (IDs válidos):
    ${JSON.stringify(personalities, null, 2)}

    Tarea:
    - Proponer un IBP actualizado en JSON con los campos solicitados y mapas de pesos decimales usando SOLO los IDs válidos.
    - Ajustes prudentes: pequeños cambios proporcionales guiados por la evidencia (entrada de bitácora y emociones).
    - Redacta "justify" como changelog breve y claro (qué subió/bajó y por qué).
    `.trim();

      const upd = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        temperature: 0.4,
        messages: [
          { role: "system", content: sysIbp },
          { role: "user", content: usrIbp }
        ]
      });

      let modelOut;
      try {
        const raw = upd.choices?.[0]?.message?.content?.trim() || "{}";
        const start = raw.indexOf("{");
        const end = raw.lastIndexOf("}");
        modelOut = JSON.parse(raw.slice(start, end + 1));
      } catch {
        modelOut = null;
      }

      // Fallback prudente si el modelo no devolvió JSON valido
      if (!modelOut || typeof modelOut !== "object") {
        modelOut = {
          mode: "update",
          lifeCycles: lastIbp?.lifeCycles || "fase en ajuste progresivo",
          emotionalTendency: lastIbp?.emotionalTendency || "reflexivo",
          currentLifeTrend: lastIbp?.currentLifeTrend || "integración gradual",
          suggestedApproach: "escribe y observa cada día",
          justify: "Actualización mínima por falta de estructura JSON; se preserva el estado previo y se incorporan señales de la bitácora con cambios conservadores.",
          facetas: lastIbp?.facetas || ["autenticidad", "claridad", "curiosidad"],
          archetypeWeight: lastIbp?.archetypeWeight || Object.fromEntries(archetypeIds.map(id => [id, 10 / Math.max(1, archetypeIds.length)])),
          personalityWeight: lastIbp?.personalityWeight || Object.fromEntries(personalityIds.map(id => [id, 10 / Math.max(1, personalityIds.length)])),
        };
      }

      // Saneamiento minimo + forzar mode:update
      modelOut.mode = "update";
      modelOut.lifeCycles = modelOut.lifeCycles || lastIbp?.lifeCycles || "fase en ajuste progresivo";
      modelOut.emotionalTendency = modelOut.emotionalTendency || lastIbp?.emotionalTendency || "reflexivo";
      modelOut.currentLifeTrend = modelOut.currentLifeTrend || lastIbp?.currentLifeTrend || "integración gradual";
      modelOut.suggestedApproach = modelOut.suggestedApproach || "escribe y observa cada día";
      modelOut.justify = modelOut.justify || "Se integran señales de la bitácora con cambios prudentes.";
      modelOut.facetas = Array.isArray(modelOut.facetas) && modelOut.facetas.length
        ? modelOut.facetas
        : (lastIbp?.facetas || ["autenticidad", "claridad", "curiosidad"]);

      // Validar IDs y renormalizar (decimales)
      let archetypeWeight = sanitizeWeights(modelOut.archetypeWeight, archetypeIds);
      let personalityWeight = sanitizeWeights(modelOut.personalityWeight, personalityIds);
      archetypeWeight = normalizeMapToSum(archetypeWeight, 10, 3);
      personalityWeight = normalizeMapToSum(personalityWeight, 10, 3);

      // Guardar nueva versión del IBP
      const ibpRef = await db.collection("InnerBluePrint").add({
        mode: modelOut.mode,                       // "update"
        lifeCycles: modelOut.lifeCycles,           // texto plano
        emotionalTendency: modelOut.emotionalTendency,
        currentLifeTrend: modelOut.currentLifeTrend,
        suggestedApproach: modelOut.suggestedApproach,
        archetypeWeight,                           // Σ=10 exacto, decimales
        justify: modelOut.justify,                 // changelog de la actualización
        facetas: modelOut.facetas,
        personalityWeight,                         // Σ=10 exacto, decimales
        sourceLogbookId: docRef.id,                // trazabilidad hacia la bitácora
        dateCreation: admin.firestore.FieldValue.serverTimestamp(),
        userId
      });

      ibpUpdate = { status: 'ok', id: ibpRef.id };
    } catch (e) {
      console.error("IBP update from logbook failed:", e);
      ibpUpdate = { status: 'error', error: e.message };
    }

    // --- RESPUESTA ORIGINAL + info adicional no disruptiva ---
    

 return res.status(201).json({
      message: "Entrada de Logbook creada",
      id: docRef.id,
      saved: { prompt, answer, emotionsDetected: emotions },
      ibpUpdate,
      dailyActsCompleted,
    });

  } catch (error) {
    console.error("Error POST /logbook:", error);
    return res.status(500).json({ message: "Error al crear logbook", error: error.message });
  }
});


// GET /logbook/day?date=YYYY-MM-DD&all=true
router.get('/logbook/day', verifyToken, async (req, res) => {
  try {
    const userId = req.user.uid;
    const wantAll = String(req.query.all || '').toLowerCase() === 'true';

    // 1) Determinar la fecha base en la zona HORARIA LOCAL del servidor
    const dateStr = (req.query.date || '').trim(); // opcional "YYYY-MM-DD"
    let baseDateLocal;
    if (dateStr) {
      // Construimos medianoche local del servidor para esa fecha
      const [y, m, d] = dateStr.split('-').map(Number);
      if (!y || !m || !d) {
        return res.status(400).json({ message: 'Parámetro "date" inválido. Usa YYYY-MM-DD.' });
      }
      baseDateLocal = new Date(y, m - 1, d, 0, 0, 0, 0); // local time
    } else {
      const now = new Date();
      baseDateLocal = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0); // hoy local
    }

    // 2) Rango del dia [start, end) en LOCAL del servidor
    const start = baseDateLocal;                 // 00:00:00 local
    const end   = new Date(baseDateLocal);       // siguiente día 00:00:00 local
    end.setDate(end.getDate() + 1);

    // 3) Query SOLO por rango en dateCreation (sin userId) => evita índice compuesto
    const snap = await db.collection('Logbook')
      .where('dateCreation', '>=', start)
      .where('dateCreation', '<', end)
      .orderBy('dateCreation', 'asc') 
      .get();

    // 4) Filtrar en memoria por userId (si no pides all=true)
    const rows = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const filtered = wantAll ? rows : rows.filter(r => r.userId === userId);

    // 5) Mapear salida
    const items = filtered.map(row => ({
      id: row.id,
      prompt: row.prompt || '',
      answer: row.answer || '',
      emotionsDetected: Array.isArray(row.emotionsDetected) ? row.emotionsDetected : [],
      dateCreation: row.dateCreation ? row.dateCreation.toDate() : null,
      ...(wantAll ? { userId: row.userId } : {})
    }));

    return res.status(200).json({
      date: baseDateLocal.toISOString().slice(0,10), // YYYY-MM-DD
      timezoneServer: Intl.DateTimeFormat().resolvedOptions().timeZone,
      count: items.length,
      items
    });

  } catch (error) {
    console.error('Error GET /logbook/day:', error);
    return res.status(500).json({ message: 'Error al obtener el logbook del día', error: error.message });
  }
});


// GET /logbook/summary
router.get('/logbook/summary', verifyToken, async (req, res) => {
  try {
    const userId = req.user.uid;
    const tz = req.query.tz || 'America/Mexico_City'; // 👈 Default a México
    const windowDays = Math.min(Number(req.query.windowDays) || 1200, 2000);

    // Helper para convertir timestamp a día
    const toDayKey = (timestamp) => {
      try {
        let date;
        
        if (timestamp?.toDate && typeof timestamp.toDate === 'function') {
          date = timestamp.toDate();
        } else if (timestamp) {
          date = new Date(timestamp);
        } else {
          return null;
        }
        
        const fmt = new Intl.DateTimeFormat('en-CA', {
          timeZone: tz,
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        });
        
        return fmt.format(date);
      } catch (error) {
        console.error('Error converting timestamp:', error);
        return null;
      }
    };

    // 1) Traer registros recientes
    const recentSnap = await db.collection('Logbook')
      .where('userId', '==', userId)
      .orderBy('dateCreation', 'desc')
      .limit(windowDays * 3)
      .get();

    if (recentSnap.empty) {
      return res.status(200).json({
        hasConsecutiveDays: false,
        maxStreak: 0,
        currentStreak: 0
      });
    }

    // 2) Agrupar por día y deduplicar
    const dayKeysDesc = [];
    const seenDays = new Set();
    
    for (const doc of recentSnap.docs) {
      const data = doc.data();
      const key = toDayKey(data.dateCreation);
      
      if (key && !seenDays.has(key)) {
        seenDays.add(key);
        dayKeysDesc.push(key);
        
        if (dayKeysDesc.length >= windowDays) break;
      }
    }

    if (dayKeysDesc.length === 0) {
      return res.status(200).json({
        hasConsecutiveDays: false,
        maxStreak: 0,
        currentStreak: 0
      });
    }

    // 3) Calcular streaks
    const areConsecutive = (day1, day2) => {
      const [y1, m1, d1] = day1.split('-').map(Number);
      const [y2, m2, d2] = day2.split('-').map(Number);
      
      const date1 = new Date(y1, m1 - 1, d1);
      const date2 = new Date(y2, m2 - 1, d2);
      
      const diffDays = (date1 - date2) / (1000 * 60 * 60 * 24);
      return diffDays === 1;
    };

    let currentStreak = 1;
    for (let i = 1; i < dayKeysDesc.length; i++) {
      if (areConsecutive(dayKeysDesc[i - 1], dayKeysDesc[i])) {
        currentStreak++;
      } else {
        break;
      }
    }

    let maxStreak = 1;
    let tempStreak = 1;
    
    for (let i = 1; i < dayKeysDesc.length; i++) {
      if (areConsecutive(dayKeysDesc[i - 1], dayKeysDesc[i])) {
        tempStreak++;
        maxStreak = Math.max(maxStreak, tempStreak);
      } else {
        tempStreak = 1;
      }
    }

    const hasConsecutiveDays = maxStreak >= 2;

    return res.status(200).json({
      hasConsecutiveDays,
      maxStreak,
      currentStreak
    });

  } catch (err) {
    console.error('GET /logbook/summary error:', err);
    return res.status(500).json({ 
      message: 'Error al obtener streak', 
      error: err.message 
    });
  }
});


// POST /trigger-questions
// POST /trigger-questions
router.post('/trigger-questions', verifyToken, async (req, res) => {
  try {
    const userId = req.user.uid;

    // 0) ¿Ya existen items HOY para este usuario? (evita duplicados)
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
    const tomorrowStart = new Date(todayStart);
    tomorrowStart.setDate(tomorrowStart.getDate() + 1);

    const todaySnap = await db.collection('TriggerQuestions')
      .where('dateCreation', '>=', todayStart)
      .where('dateCreation', '<', tomorrowStart)
      .orderBy('dateCreation', 'asc')
      .get();

    const todaysForUser = todaySnap.docs
      .map(d => ({ id: d.id, ...d.data() }))
      .filter(x => x.userId === userId);

    if (todaysForUser.length > 0) {
      return res.status(409).json({
        message: 'Ya existen Trigger items creados hoy para este usuario',
        items: todaysForUser.map(q => ({
          id: q.id,
          question: q.question,
          type: q.type || 'text',
          options: Array.isArray(q.options) ? q.options : [],
          answer: q.answer ?? null,
          dateCreation: q.dateCreation?.toDate ? q.dateCreation.toDate() : null
        }))
      });
    }

    // 1) Últimas 5 entradas del Logbook (contexto)
    const logSnap = await db.collection("Logbook")
      .where("userId", "==", userId)
      .orderBy("dateCreation", "desc")
      .limit(5)
      .get();

    if (logSnap.empty) {
      return res.status(404).json({ message: "No hay entradas suficientes en Logbook para generar contenido" });
    }

    const lastLogs = logSnap.docs.map(d => d.data());

    // 2) Prompt: 3 items (2 deben ser MCQ)
const sysPrompt = `
Eres TheInnerCode Core Model. Debes generar EXACTAMENTE 3 items (micro-reflexiones para hoy).
Tu tono es cálido, respetuoso y sutilmente motivador (sin ser intrusivo ni moralista).
Objetivo: ayudar al usuario a tomar perspectiva y tener un pequeño impulso de ánimo/claridad.

Cada item debe tener:
- "type": "text" o "mcq"
- "question": string

Reglas de estructura:
- Debe haber EXACTAMENTE 2 items type="mcq".
- Cada item "mcq" debe tener "options" con 3 o 4 opciones:
  options = [{ "id":"a","label":"..." }, { "id":"b","label":"..." }, ...]
- Debe haber EXACTAMENTE 1 item type="text" y NO debe incluir "options".
- Devuelve SOLO JSON válido con:
{
  "items": [
    { "type":"mcq", "question":"...", "options":[{"id":"a","label":"..."}, ...] },
    { "type":"text", "question":"..." },
    { "type":"mcq", "question":"...", "options":[{"id":"a","label":"..."}, ...] }
  ]
}

Guías de contenido (muy importante):
- Basarte SOLO en las últimas entradas del Logbook (no inventes datos).
- Estilo: 2ª persona, claro, científico-humanista, sin misticismo ni predicciones.
- Evita lenguaje clínico/diagnósticos, y evita suposiciones fuertes.
- Evita culpa, regaños, presión o frases tipo “deberías”.
- Haz preguntas que:
  1) validen suavemente lo que aparece en el Logbook (sin repetirlo textual),
  2) inviten a una acción pequeña y realista,
  3) abran una puerta a esperanza/autoeficacia (“un paso”, “un pequeño ajuste”, “algo que sí está bajo tu control”).

Longitud:
- Cada pregunta: 1–2 frases máximo.
- La de tipo "text" debe invitar a una respuesta breve (1–3 líneas).
- Las opciones MCQ deben ser concretas, realistas y no juzgadoras.
- No uses emojis.
`.trim();

   const usrPrompt = `
Últimas 5 entradas del Logbook (contexto del usuario):
${JSON.stringify(lastLogs, null, 2)}

Instrucción:
- Detecta 1–2 temas dominantes (p.ej. estrés, cansancio, conflicto, motivación, avance).
- Genera 3 preguntas de hoy con un toque de apoyo: validación ligera + paso pequeño.

Genera el JSON solicitado.
`.trim();

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.6,
      messages: [
        { role: "system", content: sysPrompt },
        { role: "user", content: usrPrompt }
      ]
    });

    // 3) Parseo y validación
    const raw = completion.choices?.[0]?.message?.content?.trim() || "{}";
    let payload;
    try {
      const start = raw.indexOf("{");
      const end = raw.lastIndexOf("}");
      payload = JSON.parse(raw.slice(start, end + 1));
    } catch {
      return res.status(502).json({ message: "El modelo no devolvió JSON válido" });
    }

    const items = Array.isArray(payload?.items) ? payload.items : [];
    if (items.length !== 3) {
      return res.status(502).json({ message: "El modelo debe devolver EXACTAMENTE 3 items" });
    }

    const mcqItems = items.filter(it => it?.type === 'mcq');
const textItems = items.filter(it => it?.type === 'text');

if (mcqItems.length !== 2) {
  return res.status(502).json({ message: "Debe existir EXACTAMENTE 2 items type='mcq'" });
}
if (textItems.length !== 1) {
  return res.status(502).json({ message: "Debe existir EXACTAMENTE 1 item type='text'" });
}

    // Validación estricta de cada item
    for (const it of items) {
      const type = String(it?.type || '').trim();
      const question = String(it?.question || '').trim();

      if (!['text', 'mcq'].includes(type)) {
        return res.status(502).json({ message: "type inválido. Debe ser 'text' o 'mcq'" });
      }
      if (!question) {
        return res.status(502).json({ message: "question inválida/vacía" });
      }

      if (type === 'mcq') {
        const opts = Array.isArray(it.options) ? it.options : [];
        if (opts.length < 3 || opts.length > 4) {
          return res.status(502).json({ message: "MCQ options deben ser 3 o 4" });
        }
        const ids = opts.map(o => String(o?.id || '').trim());
        const labels = opts.map(o => String(o?.label || '').trim());
        if (ids.some(x => !x) || labels.some(x => !x)) {
          return res.status(502).json({ message: "MCQ options requiere id y label en cada opción" });
        }
        if (new Set(ids).size !== ids.length) {
          return res.status(502).json({ message: "MCQ options tiene ids duplicados" });
        }
      } else {
        // Para text: forzamos que no existan options
        if ('options' in it) delete it.options;
      }
    }

    const todayKey = toDayKey(new Date(), 'America/Mexico_City');

    // 4) Guardar 3 documentos
    const batch = db.batch();
    const nowTs = admin.firestore.FieldValue.serverTimestamp();

    const docsToCreate = items.map(it => ({
      question: String(it.question).trim(),
      type: it.type === 'mcq' ? 'mcq' : 'text',
      options: it.type === 'mcq' ? it.options : [],
      answer: null,
      userId,
      dateCreation: nowTs,
      dayKey: todayKey,
    }));

    const created = [];
    for (const doc of docsToCreate) {
      const ref = db.collection("TriggerQuestions").doc();
      batch.set(ref, doc);
      created.push({
        id: ref.id,
        question: doc.question,
        type: doc.type,
        options: doc.options,
        answer: null
      });
    }

    await batch.commit();

    return res.status(201).json({
      message: "Trigger items (1 text + 2 opción múltiple) generados y guardados",
      items: created
    });

  } catch (error) {
    console.error("Error POST /trigger-questions:", error);
    return res.status(500).json({
      message: "Error al generar Trigger items",
      error: error.message
    });
  }
});

// POST /trigger-questions/:id/answer
router.post('/trigger-questions/:id/answer', verifyToken, async (req, res) => {
  try {
    const userId = req.user.uid;
    const questionId = req.params.id;
    const { answer } = req.body || {};

    // 0) Cargar la pregunta y validar ownership
    const qRef = db.collection('TriggerQuestions').doc(questionId);
    const qSnap = await qRef.get();
    if (!qSnap.exists) return res.status(404).json({ message: 'TriggerQuestion no encontrada' });

    const qData = qSnap.data() || {};
    if (qData.userId !== userId) return res.status(403).json({ message: 'No autorizado' });

    const type = String(qData.type || 'text');

    // ✅ Validación según type
    if (type === 'mcq') {
      const optId = String(answer || '').trim();
      const opts = Array.isArray(qData.options) ? qData.options : [];
      const valid = opts.some(o => String(o?.id || '').trim() === optId);
      if (!optId || !valid) {
        return res.status(400).json({
          message: 'Respuesta inválida. Para opción múltiple debes enviar el id de una opción válida (ej: "a").'
        });
      }
    } else {
      const txt = String(answer || '').trim();
      if (!txt) {
        return res.status(400).json({ message: 'Falta "answer" (string no vacío)' });
      }
    }

    // ✅ claves de día (para queries e idempotencia)
    const tz = 'America/Mexico_City';
    const todayKey = toDayKey(new Date(), tz);

    // 1) Guardar la respuesta en la TriggerQuestion (idempotente)
    await qRef.set(
      {
        answer: String(answer).trim(),
        dateAnswer: admin.firestore.FieldValue.serverTimestamp(),

        // ✅ Asegura que exista dayKey
        dayKey: qData.dayKey || todayKey,

        // ✅ Este es el que usamos para contar “respondidas hoy”
        answeredDayKey: todayKey,
      },
      { merge: true }
    );

    // ✅ Contar RESPONDIDAS hoy (DESPUÉS de guardar esta)
    const answeredSnap = await db.collection('TriggerQuestions')
      .where('userId', '==', userId)
      .where('answeredDayKey', '==', todayKey)
      .get();

    const answeredTodayCount = answeredSnap.size;
    const allAnsweredToday = answeredTodayCount >= 3;

    // ✅ Si aún NO terminó las 3, NO actualizar IBP
    if (!allAnsweredToday) {
      return res.status(201).json({
        message: "Respuesta registrada (IBP se actualizará al completar las 3)",
        triggerQuestionId: questionId,
        allAnsweredToday,
        answeredTodayCount,
      });
    }

    // ✅ Gate idempotente: si ya se procesó el "cierre del día" para triggerQuestions,
    // no volvemos a regenerar IBP aunque vuelvan a pegarle al endpoint.
    const userRef = db.collection('Users').doc(userId);
    const source = 'triggerQuestions';

    let shouldUpdateIbp = false;
    await db.runTransaction(async (tx) => {
      const snap = await tx.get(userRef);
      const user = snap.exists ? (snap.data() || {}) : {};
      const last = String(user.dailyActsSources?.[source]?.lastDayKey || '');
      if (last !== todayKey) shouldUpdateIbp = true;
    });

    if (!shouldUpdateIbp) {
      return res.status(201).json({
        message: "Respuesta registrada (ya se procesó el cierre de hoy; IBP no se vuelve a actualizar)",
        triggerQuestionId: questionId,
        allAnsweredToday,
        answeredTodayCount,
      });
    }

    // ✅ Evidencia: las 3 preguntas/respuestas del día (mejor update que solo 1)
    const todayAnswered = answeredSnap.docs
      .map(d => ({ id: d.id, ...d.data() }))
      .sort((a, b) => {
        const ta = a.dateAnswer?.toMillis?.() || 0;
        const tb = b.dateAnswer?.toMillis?.() || 0;
        return ta - tb;
      })
      .slice(0, 3);

    const evidence = todayAnswered.map(q => ({
      id: q.id,
      question: q.question,
      type: q.type,
      options: Array.isArray(q.options) ? q.options : [],
      answer: q.answer,
    }));

    // -------- Helpers (idénticos a tu seed para pesos Σ=10 con decimales) --------
    function normalizeMapToSum(map, target = 10, precision = 3) {
      const keys = Object.keys(map || {});
      if (!keys.length) return {};
      const rawSum = keys.reduce((s, k) => s + (Number(map[k]) || 0), 0);

      const scaled = {};
      if (rawSum <= 0) {
        const uniform = target / keys.length;
        keys.forEach((k) => (scaled[k] = uniform));
      } else {
        const factor = target / rawSum;
        keys.forEach((k) => (scaled[k] = (Number(map[k]) || 0) * factor));
      }

      const pow = Math.pow(10, precision);
      const items = keys.map((k) => {
        const units = scaled[k] * pow;
        const floorUnits = Math.floor(units);
        return { k, floorUnits, rest: units - floorUnits };
      });

      const targetUnits = Math.round(target * pow);
      let used = items.reduce((s, it) => s + it.floorUnits, 0);
      let remaining = targetUnits - used;

      items.sort((a, b) => b.rest - a.rest);
      for (let i = 0; i < items.length && remaining > 0; i++) {
        items[i].floorUnits += 1;
        remaining -= 1;
      }

      const out = {};
      items.forEach((it) => (out[it.k] = it.floorUnits / pow));
      return out;
    }

    function sanitizeWeights(inMap, validIds) {
      const out = {};
      for (const id of validIds) {
        const v = Number(inMap?.[id]);
        out[id] = Number.isFinite(v) && v >= 0 ? v : 0;
      }
      return out;
    }

    // 2) Cargar último IBP (baseline) — query óptima + fallback si falta índice
    async function getLastIBP(uid) {
      try {
        const snap = await db.collection("InnerBluePrint")
          .where("userId", "==", uid)
          .orderBy("dateCreation", "desc")
          .limit(1)
          .get();
        if (snap.empty) return null;
        return snap.docs[0].data();
      } catch (e) {
        const needsIndex = String(e?.code) === '9' || /FAILED_PRECONDITION/i.test(e?.message || '');
        if (!needsIndex) throw e;

        const snap = await db.collection("InnerBluePrint")
          .where("userId", "==", uid)
          .limit(50)
          .get();
        let latest = null;
        snap.forEach(doc => {
          const data = doc.data() || {};
          const ms = data?.dateCreation?.toMillis
            ? data.dateCreation.toMillis()
            : (data?.dateCreation?._seconds ? data.dateCreation._seconds * 1000 : 0);
          if (!latest || ms > latest.ms) latest = { ms, data };
        });
        return latest ? latest.data : null;
      }
    }

    const lastIbp = await getLastIBP(userId);

    // 3) Cargar contexto (Archetypes, Personality)
    const [arqSnap, persSnap] = await Promise.all([
      db.collection("Archetypes").get(),
      db.collection("Personality").get(),
    ]);

    const archetypes = [];
    const archetypeIds = [];
    arqSnap.forEach((doc) => {
      const d = doc.data() || {};
      archetypes.push({ id: doc.id, name: d.name, description: d.description, keywords: d.keywords || [] });
      archetypeIds.push(doc.id);
    });

    const personalities = [];
    const personalityIds = [];
    persSnap.forEach((doc) => {
      const d = doc.data() || {};
      personalities.push({ id: doc.id, name: d.name, description: d.description });
      personalityIds.push(doc.id);
    });

    // 4) Prompt a OpenAI: actualizar IBP con evidencia de LAS 3 TriggerQuestions
    const sysIbp = `
Eres TheInnerCode Core Model. Mantienes el InnerBluePrint (IBP) con trazabilidad.
Actualiza el IBP con las respuestas del día a TriggerQuestions. Estilo sereno, científico y humanista, 2ª persona.
Evita misticismo/predicciones; no inventes datos. Si hay incertidumbre, indícala.
Devuelve SOLO JSON válido con:
{
  "mode": "update",
  "lifeCycles": "string en texto plano",
  "emotionalTendency": "string breve",
  "currentLifeTrend": "string breve",
  "suggestedApproach": "string breve y accionable (2-10 palabras)",
  "justify": "60-140 palabras explicando QUÉ cambió y POR QUÉ; cita evidencia del día",
  "facetas": ["2-6 strings"],
  "archetypeWeight": { "<ARQ_ID>": decimal, ... },
  "personalityWeight": { "<PERS_ID>": decimal, ... }
}
Las sumas de los mapas deben aproximarse a 10 (el servidor ajustará a Σ=10 exacto con decimales).
`.trim();

    const usrIbp = `
Baseline previo (puede ser null):
${JSON.stringify(lastIbp || {}, null, 2)}

Arquetipos (IDs válidos):
${JSON.stringify(archetypes, null, 2)}

Personalidad (IDs válidos):
${JSON.stringify(personalities, null, 2)}

Nueva evidencia (3 TriggerQuestions del día):
${JSON.stringify(evidence, null, 2)}

Tarea:
- Proponer un IBP actualizado en JSON con cambios prudentes (proporcionales a la evidencia).
- Usa SOLO los IDs válidos en los mapas de pesos.
- Escribe "justify" como changelog claro (qué subió/bajó y por qué).
`.trim();

    const upd = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.4,
      messages: [
        { role: "system", content: sysIbp },
        { role: "user", content: usrIbp }
      ]
    });

    // 5) Parseo y saneamiento
    let modelOut;
    try {
      const raw2 = upd.choices?.[0]?.message?.content?.trim() || "{}";
      const start = raw2.indexOf("{");
      const end = raw2.lastIndexOf("}");
      modelOut = JSON.parse(raw2.slice(start, end + 1));
    } catch {
      modelOut = null;
    }

    if (!modelOut || typeof modelOut !== "object") {
      modelOut = {
        mode: "update",
        lifeCycles: lastIbp?.lifeCycles || "fase en ajuste progresivo",
        emotionalTendency: lastIbp?.emotionalTendency || "reflexivo",
        currentLifeTrend: lastIbp?.currentLifeTrend || "integración gradual",
        suggestedApproach: "observa y escribe con honestidad",
        justify: "Actualización mínima por salida no estructurada; se incorporan indicios del día con cambios conservadores.",
        facetas: lastIbp?.facetas || ["autenticidad", "claridad", "curiosidad"],
        archetypeWeight: lastIbp?.archetypeWeight || Object.fromEntries(archetypeIds.map(id => [id, 10 / Math.max(1, archetypeIds.length)])),
        personalityWeight: lastIbp?.personalityWeight || Object.fromEntries(personalityIds.map(id => [id, 10 / Math.max(1, personalityIds.length)])),
      };
    }

    modelOut.mode = "update";
    modelOut.lifeCycles = modelOut.lifeCycles || lastIbp?.lifeCycles || "fase en ajuste progresivo";
    modelOut.emotionalTendency = modelOut.emotionalTendency || lastIbp?.emotionalTendency || "reflexivo";
    modelOut.currentLifeTrend = modelOut.currentLifeTrend || lastIbp?.currentLifeTrend || "integración gradual";
    modelOut.suggestedApproach = modelOut.suggestedApproach || "observa y escribe con honestidad";
    modelOut.justify = modelOut.justify || "Se integran señales del día con cambios prudentes.";
    modelOut.facetas = Array.isArray(modelOut.facetas) && modelOut.facetas.length
      ? modelOut.facetas
      : (lastIbp?.facetas || ["autenticidad", "claridad", "curiosidad"]);

    // 6) Validar y renormalizar pesos (decimales, Σ=10 exacto)
    let archetypeWeight = sanitizeWeights(modelOut.archetypeWeight, archetypeIds);
    let personalityWeight = sanitizeWeights(modelOut.personalityWeight, personalityIds);
    archetypeWeight = normalizeMapToSum(archetypeWeight, 10, 3);
    personalityWeight = normalizeMapToSum(personalityWeight, 10, 3);

    // 7) Guardar nuevo IBP (histórico)
    const ibpRef = await db.collection("InnerBluePrint").add({
      mode: modelOut.mode,
      lifeCycles: modelOut.lifeCycles,
      emotionalTendency: modelOut.emotionalTendency,
      currentLifeTrend: modelOut.currentLifeTrend,
      suggestedApproach: modelOut.suggestedApproach,
      archetypeWeight,
      justify: modelOut.justify,
      facetas: modelOut.facetas,
      personalityWeight,
      sourceTriggerDayKey: todayKey, // 👈 trazabilidad por día (mejor que 1 sola pregunta)
      dateCreation: admin.firestore.FieldValue.serverTimestamp(),
      userId
    });

    // 8) ✅ Incrementar dailyActsCompleted SOLO 1 vez por día (idempotente)
    let dailyActsCompleted = null;

    await db.runTransaction(async (tx) => {
      const snap = await tx.get(userRef);
      const user = snap.exists ? (snap.data() || {}) : {};

      const prev = Number(user.dailyActsCompleted ?? 0);
      const last = String(user.dailyActsSources?.[source]?.lastDayKey || '');

      if (last !== todayKey) {
        tx.set(
          userRef,
          {
            dailyActsCompleted: admin.firestore.FieldValue.increment(1),
            dailyActsSources: {
              ...(user.dailyActsSources || {}),
              [source]: {
                lastDayKey: todayKey,
                lastCountedAt: admin.firestore.FieldValue.serverTimestamp(),
              },
            },
          },
          { merge: true }
        );
        dailyActsCompleted = prev + 1;
      } else {
        dailyActsCompleted = prev;
      }
    });

    return res.status(201).json({
      message: "Respuesta registrada; completaste las 3 → IBP actualizado",
      triggerQuestionId: questionId,
      ibpUpdate: { status: 'ok', id: ibpRef.id },
      allAnsweredToday,
      answeredTodayCount,
      ...(dailyActsCompleted !== null ? { dailyActsCompleted } : {}),
    });

  } catch (error) {
    console.error("Error POST /trigger-questions/:id/answer:", error);
    return res.status(500).json({
      message: "Error al responder TriggerQuestion",
      error: error.message
    });
  }
});


function toDayKey(date = new Date(), tz = 'America/Mexico_City') {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: tz,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}


// GET /trigger-questions/today
// GET /trigger-questions/today
router.get('/trigger-questions/today', verifyToken, async (req, res) => {
  try {
    const userId = req.user.uid;

    // Ventana de "hoy" en horario local del servidor
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
    const tomorrowStart = new Date(todayStart);
    tomorrowStart.setDate(tomorrowStart.getDate() + 1);

    let docs = [];
    try {
      const snap = await db.collection('TriggerQuestions')
        .where('userId', '==', userId)
        .where('dateCreation', '>=', todayStart)
        .where('dateCreation', '<', tomorrowStart)
        .orderBy('dateCreation', 'asc')
        .limit(3)
        .get();

      docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    } catch (e) {
      // Fallback si faltara indice (ordenamos en memoria)
      const needsIndex = String(e?.code) === '9' || /FAILED_PRECONDITION/i.test(e?.message || '');
      if (!needsIndex) throw e;

      const snap = await db.collection('TriggerQuestions')
        .where('dateCreation', '>=', todayStart)
        .where('dateCreation', '<', tomorrowStart)
        .orderBy('dateCreation', 'asc')
        .get();

      docs = snap.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .filter(x => x.userId === userId)
        .slice(0, 3);
    }

    const response = docs.map(x => ({
      id: x.id,
      question: x.question || '',
      type: x.type || 'text',
      options: Array.isArray(x.options) ? x.options : [],
      answer: x.answer ?? null,
    }));

    return res.status(200).json({
      count: response.length,
      items: response
    });
  } catch (error) {
    console.error('Error GET /trigger-questions/today:', error);
    return res.status(500).json({
      message: 'Error al obtener TriggerQuestions de hoy',
      error: error.message
    });
  }
});



// POST /weekly-summary?date=YYYY-MM-DD&weekStart=mon|sun
router.post('/weekly-summary', verifyToken, async (req, res) => {
  try {
    const userId = req.user.uid;

    // 1) Parametros
    const dateStr = (req.query.date || '').trim();               
    const weekStartParam = (req.query.weekStart || 'mon').toLowerCase();
    const weekStartKind = (weekStartParam === 'sun') ? 'sun' : 'mon'; // por defecto lunes

    // Base local del servidor (medianoche)
    let baseLocal;
    if (dateStr) {
      const [y, m, d] = dateStr.split('-').map(Number);
      if (!y || !m || !d) {
        return res.status(400).json({ message: 'Parámetro "date" inválido. Usa YYYY-MM-DD.' });
      }
      baseLocal = new Date(y, m - 1, d, 0, 0, 0, 0); // medianoche local
    } else {
      const now = new Date();
      baseLocal = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
    }

    // 2) Calcular semana [start, endInclusive] (LOCAL del servidor)
    // getDay(): 0 domingo .. 6 sábado (LOCAL)
    const dow = baseLocal.getDay();
    const offset = (weekStartKind === 'mon') ? ((dow + 6) % 7) : dow;
    const weekStartLocal = new Date(baseLocal); weekStartLocal.setDate(weekStartLocal.getDate() - offset);
    const weekEndLocal   = new Date(weekStartLocal); weekEndLocal.setDate(weekEndLocal.getDate() + 6);
    const endExclusive   = new Date(weekEndLocal);   endExclusive.setDate(endExclusive.getDate() + 1);

    const weekStart = weekStartLocal.toISOString().slice(0,10);
    const weekEnd   = weekEndLocal.toISOString().slice(0,10);

    // 3) Traer entradas de Logbook SOLO por rango
    const snap = await db.collection('Logbook')
      .where('dateCreation', '>=', weekStartLocal)
      .where('dateCreation', '<', endExclusive)
      .orderBy('dateCreation', 'asc')
      .get();

    // Filtrar en memoria por usuario del token
    const rows = snap.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(r => r.userId === userId)
      .map(r => ({
        id: r.id,
        prompt: r.prompt || '',
        answer: r.answer || '',
        emotionsDetected: Array.isArray(r.emotionsDetected) ? r.emotionsDetected : [],
        dateCreation: r.dateCreation ? r.dateCreation.toDate() : null
      }));

    if (!rows.length) {
      return res.status(404).json({
        message: "No hay entradas de Logbook para esta semana",
        weekStart, weekEnd
      });
    }

    // 4) Preparar contexto compacto para el modelo 
    const MAX_ITEMS = 60; // por si la semana trae muchos
    const clip = (s, n=240) => (String(s||'').replace(/\s+/g,' ').trim().slice(0,n));
    const bullets = rows.slice(-MAX_ITEMS).map(it => {
      const dt = it.dateCreation ? it.dateCreation.toISOString() : '';
      const em = (it.emotionsDetected || []).join(', ');
      return `- ${dt} | emotions: [${em}] | prompt: "${clip(it.prompt)}" | answer: "${clip(it.answer)}"`;
    }).join('\n');

    // 5) Llamada a OpenAI (forzando JSON valido)
    const sys = `Eres TheInnerCode Core Model. Eres un profesional de apoyo emocional. Resume la semana en español, cálido y sin diagnósticos clínicos.`;
    const usr = `
Tienes entradas de un diario emocional correspondientes a la semana ${weekStart}..${weekEnd}.
Devuelve SOLO JSON con este formato:
{
  "emotions": ["3 a 5 emociones clave en minúsculas"],
  "keywords": ["3 a 7 palabras clave en minúsculas"],
  "centralTheme": "tema central breve",
  "summaryText": "párrafo de 3 a 5 frases, cálido, que sintetice la semana"
}

Entradas (de más antiguo a más reciente):
${bullets}
`.trim();

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.4,
      messages: [
        { role: "system", content: sys },
        { role: "user", content: usr }
      ],
      response_format: { type: "json_object" }
    });

    // Extraer JSON
    let aiOut;
    try {
      const content = completion.choices?.[0]?.message?.content;
      aiOut = JSON.parse(content);
    } catch (err) {
      return res.status(502).json({ message: "Respuesta del modelo no es JSON válido" });
    }

    // 6) Validaciones minimas
    const normList = (arr) => (Array.isArray(arr)
      ? arr.map(s => String(s||'').toLowerCase().trim()).filter(Boolean)
      : []
    );

    const emotions = normList(aiOut.emotions);
    const keywords = normList(aiOut.keywords);
    const centralTheme = String(aiOut.centralTheme || '').trim();
    const summaryText  = String(aiOut.summaryText  || '').trim();

    if (emotions.length < 3 || emotions.length > 5) {
      return res.status(502).json({ message: "El modelo no devolvió 3–5 emociones", emotions });
    }
    if (keywords.length < 3 || keywords.length > 7) {
      return res.status(502).json({ message: "El modelo no devolvió 3–7 keywords", keywords });
    }
    if (!centralTheme || !summaryText) {
      return res.status(502).json({ message: "Faltan 'centralTheme' o 'summaryText' válidos" });
    }

    // 7) Idempotencia: si ya existe un resumen para esa semana/usuario, actualizar
    const existingSnap = await db.collection("WeeklySummary")
      .where('dateCreation', '>=', weekStartLocal)
      .where('dateCreation', '<', endExclusive)
      .orderBy('dateCreation', 'desc')
      .get();

    const existing = existingSnap.docs
      .map(d => ({ id: d.id, ...d.data() }))
      .filter(x =>
        x.userId === userId &&
        x.weekStart === weekStart &&
        x.weekEnd === weekEnd
      )[0];

    if (existing) {
      await db.collection("WeeklySummary").doc(existing.id).update({
        emotions, keywords, centralTheme, summaryText,
        dateCreation: admin.firestore.FieldValue.serverTimestamp()
      });

      try {
        const uSnap = await db.collection('Users').doc(userId).get();
        const u = uSnap.exists ? (uSnap.data() || {}) : {};
        if (u.email) {
          await sendWeeklySummaryEmail({
            to: u.email,
            name: u.name || null,
            weekStart,
            weekEnd,
            centralTheme,
            summaryText
          });
        }
      } catch (e) {
        console.error('Fallo al enviar correo WeeklySummary (update):', e.message);
      }

      return res.status(200).json({
        message: "WeeklySummary ya existía; se actualizó",
        id: existing.id,
        saved: { weekStart, weekEnd, emotions, keywords, centralTheme, summaryText }
      });
    }

    // -------- 8) Guardar en WeeklySummary EXACTAMENTE como tu esquema --------
    const ref = await db.collection("WeeklySummary").add({
      weekStart,             
      weekEnd,              
      emotions,              
      keywords,               
      centralTheme,    
      summaryText,
      dateCreation: admin.firestore.FieldValue.serverTimestamp(),
      userId
    });

    try {
      const uSnap = await db.collection('Users').doc(userId).get();
      const u = uSnap.exists ? (uSnap.data() || {}) : {};
      if (u.email) {
        await sendWeeklySummaryEmail({
          to: u.email,
          name: u.name || null,
          weekStart,
          weekEnd,
          centralTheme,
          summaryText
        });
      }
    } catch (e) {
      console.error('Fallo al enviar correo WeeklySummary (create):', e.message);
    }

    return res.status(201).json({
      message: "WeeklySummary generado y guardado",
      id: ref.id,
      saved: { weekStart, weekEnd, emotions, keywords, centralTheme, summaryText }
    });

  } catch (error) {
    console.error('Error POST /weekly-summary:', error);
    return res.status(500).json({ message: 'Error al generar WeeklySummary', error: error.message });
  }
});


// GET /weekly-summary/last
router.get('/weekly-summary/last', verifyToken, async (req, res) => {
  try {
    const userId = req.user.uid;

    // Traer ultimos 20 dias
    const now = new Date();
    const from = new Date(now); from.setDate(from.getDate() - 20);

    const snap = await db.collection("WeeklySummary")
      .where('dateCreation', '>=', from)
      .where('dateCreation', '<=', now)
      .orderBy('dateCreation', 'desc')
      .get();

    // Filtrar en memoria por usuario
    const doc = snap.docs
      .map(d => ({ id: d.id, ...d.data() }))
      .filter(x => x.userId === userId)
      .sort((a, b) => (b.dateCreation?.toMillis?.() || 0) - (a.dateCreation?.toMillis?.() || 0))[0];

    if (!doc) {
      return res.status(404).json({ message: 'No se encontró WeeklySummary reciente para este usuario' });
    }

    return res.status(200).json({
      id: doc.id,
      weekStart: doc.weekStart,
      weekEnd: doc.weekEnd,
      emotions: doc.emotions || [],
      keywords: doc.keywords || [],
      centralTheme: doc.centralTheme || '',
      summaryText: doc.summaryText || '',
      dateCreation: doc.dateCreation ? doc.dateCreation.toDate() : null
    });

  } catch (error) {
    console.error('Error GET /weekly-summary/last:', error);
    return res.status(500).json({ message: 'Error al obtener WeeklySummary', error: error.message });
  }
});



router.get('/nsi/current', verifyToken, async (req, res) => {
  try {
    const userId = req.user.uid;
    const userRef = db.collection('Users').doc(userId);
    const snap = await userRef.get();

    if (!snap.exists) return res.status(404).json({ ok: false, error: 'User not found' });

    const data = snap.data() || {};
    const dailyActsCompleted = Number(data.dailyActsCompleted ?? 0);

    const nsiCurrent = Number.isFinite(Number(data.nsiCurrent)) ? Number(data.nsiCurrent) : null;
    const nsi0 = Number.isFinite(Number(data?.ibpBaseline?.NSI0)) ? Number(data.ibpBaseline.NSI0) : null;

    // ✅ fallback: si no hay nsiCurrent aún, usa nsi0
    const nsi = (nsiCurrent ?? nsi0);
    const source =
      nsiCurrent !== null ? (data.nsiSource ?? 'nsiCurrent')
      : (nsi0 !== null ? 'nsi0' : 'none');

    // updatedAt: si viene de nsi0, usa onboardingAt si existe
    const updatedAt =
      (nsiCurrent !== null)
        ? (data.nsiUpdatedAt?.toDate ? data.nsiUpdatedAt.toDate() : null)
        : (data?.ibpBaseline?.onboardingAt?.toDate ? data.ibpBaseline.onboardingAt.toDate() : null);

    return res.status(200).json({
      ok: true,
      nsi,
      source,
      updatedAt,
      dailyActsCompleted,
    });
  } catch (err) {
    console.error('Error GET /users/nsi/current:', err);
    return res.status(500).json({ ok: false, error: 'Internal error' });
  }
});


function toDayKey(date = new Date(), tz = 'America/Mexico_City') {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: tz,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}


// GET /admin/kpis/daily
router.get('/admin/kpis/daily', verifyToken, async (req, res) => {
  try {
    const since24h = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const tz = 'America/Mexico_City';
    const todayKey = toDayKey(new Date(), tz);

    const [
      loginSnap,
      logbookSnap,
      triggerSnap,
      newUsersSnap,
      ibpSnap,
    ] = await Promise.all([
      db.collection('DataUser')
        .where('dateLogin', '>=', since24h).get(),

      db.collection('Logbook')
        .where('dateCreation', '>=', since24h).get(),

      db.collection('TriggerQuestions')
        .where('answeredDayKey', '==', todayKey).get(),

      db.collection('Users')
        .where('dateCreationAccount', '>=', since24h).get(),

      db.collection('InnerBluePrint')
        .where('dateCreation', '>=', since24h).get(),
    ]);

    // Usuarios únicos con login hoy
    const uniqueActiveUsers = new Set(
      loginSnap.docs.map(d => d.data().userId)
    ).size;

    // Usuarios únicos con logbook hoy
    const uniqueLogbookUsers = new Set(
      logbookSnap.docs.map(d => d.data().userId)
    ).size;

    return res.status(200).json({
      ok: true,
      since: since24h.toISOString(),
      kpis: {
        activeUsers24h:       uniqueActiveUsers,
        logbookEntries24h:    logbookSnap.size,
        logbookUniqueUsers:   uniqueLogbookUsers,
        triggersAnswered24h:  triggerSnap.size,
        newRegistrations24h:  newUsersSnap.size,
        ibpGenerated24h:      ibpSnap.size,
      }
    });

  } catch (error) {
    return res.status(500).json({ ok: false, error: error.message });
  }
});


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/test-firebase', async (req, res) => {
  try {
    const user = await admin.auth().getUserByEmail("diego.olmos2@example.com");
    res.json({ message: 'Conexión correcta con Firebase', user });
  } catch (error) {
    res.json({ message: 'Firebase responde, pero el usuario no existe', error: error.message });
  }
});

router.get('/check-firebase', async (req, res) => {
  try {
    const db = admin.firestore();
    const collections = await db.listCollections();

    if (collections.length === 0) {
      return res.json({
        message: 'La base de datos existe pero no tiene colecciones.'
      });
    }

    const colNames = collections.map(col => col.id);
    res.json({ message: 'Colecciones encontradas', collections: colNames });
  } catch (error) {
    res.status(500).json({ message: 'Error al acceder a Firestore', error: error.message });
  }
});



// GET /users/tours
router.get('/tours', verifyToken, async (req, res) => {
  try {
    const userId = req.user.uid;
    const snap = await db.collection('Users').doc(userId).get();
    if (!snap.exists) return res.status(404).json({ message: 'Usuario no encontrado' });

    const tours = snap.data()?.tours || {};
    return res.status(200).json({ ok: true, tours });
  } catch (e) {
    return res.status(500).json({ ok: false, message: 'Error al leer tours', error: e.message });
  }
});


// POST /users/tours/mark
// body: { key: "home" | "onboarding" | "logbookwrite", status: "started" | "completed" }
router.post('/tours/mark', verifyToken, async (req, res) => {
  try {
    const userId = req.user.uid;
    const { key, status } = req.body || {};

    const allowedKeys = new Set(['home', 'onboarding', 'logbookwrite']);
    const allowedStatus = new Set(['started', 'completed']);

    if (!allowedKeys.has(String(key || ''))) {
      return res.status(400).json({ ok: false, message: 'key inválido' });
    }
    if (!allowedStatus.has(String(status || ''))) {
      return res.status(400).json({ ok: false, message: 'status inválido' });
    }

    const userRef = db.collection('Users').doc(userId);

    // ✅ Idempotente y seguro con transaction
    await db.runTransaction(async (tx) => {
      const snap = await tx.get(userRef);
      if (!snap.exists) throw new Error('Usuario no encontrado');

      const tours = snap.data()?.tours || {};
      const curr = tours[key] || { completed: false, startedAt: null, completedAt: null };

      // Si ya está completed, no hacemos nada
      if (curr.completed === true) return;

      if (status === 'started') {
        // solo set startedAt si no existe
        tx.set(
          userRef,
          {
            tours: {
              ...tours,
              [key]: {
                ...curr,
                startedAt: curr.startedAt || admin.firestore.FieldValue.serverTimestamp(),
              },
            },
          },
          { merge: true }
        );
      }

      if (status === 'completed') {
        tx.set(
          userRef,
          {
            tours: {
              ...tours,
              [key]: {
                ...curr,
                completed: true,
                completedAt: admin.firestore.FieldValue.serverTimestamp(),
              },
            },
          },
          { merge: true }
        );
      }
    });

    const after = await db.collection('Users').doc(userId).get();
    return res.status(200).json({ ok: true, tours: after.data()?.tours || {} });
  } catch (e) {
    return res.status(500).json({ ok: false, message: 'Error al marcar tour', error: e.message });
  }
});


// GET /users/me
router.get('/me', verifyToken, async (req, res) => {
  try {
    const userId = req.user.uid;

    const snap = await db.collection('Users').doc(userId).get();
    if (!snap.exists) return res.status(404).json({ ok: false, message: 'Usuario no encontrado' });

    const data = snap.data() || {};
    return res.status(200).json({
      ok: true,
      user: {
        name: data.name || '',
        email: data.email || '',
      }
    });
  } catch (e) {
    return res.status(500).json({ ok: false, message: 'Error al leer perfil', error: e.message });
  }
});

// POST /trigger-questions/manual-ibp
// Ejecuta el update del IBP manualmente con las respuestas que existan HOY (1..3)
// Idempotente por día usando el MISMO source "triggerQuestions"
router.post('/trigger-questions/manual-ibp', verifyToken, async (req, res) => {
  try {
    const userId = req.user.uid;
    const tz = 'America/Mexico_City';
    const todayKey = toDayKey(new Date(), tz);

    const userRef = db.collection('Users').doc(userId);
    const source = 'triggerQuestions';

    // 0) Gate idempotente (si hoy ya se corrió por auto/manual, no repetir)
    let shouldUpdateIbp = false;
    await db.runTransaction(async (tx) => {
      const snap = await tx.get(userRef);
      const user = snap.exists ? (snap.data() || {}) : {};
      const last = String(user.dailyActsSources?.[source]?.lastDayKey || '');
      if (last !== todayKey) shouldUpdateIbp = true;
    });

    if (!shouldUpdateIbp) {
      return res.status(200).json({
        message: 'IBP manual: ya se procesó el cierre de hoy; no se vuelve a actualizar',
        alreadyProcessedToday: true,
        dayKey: todayKey,
      });
    }

    // 1) Traer SOLO las preguntas respondidas hoy (1..3)
    const answeredSnap = await db.collection('TriggerQuestions')
      .where('userId', '==', userId)
      .where('answeredDayKey', '==', todayKey)
      .get();

    const answered = answeredSnap.docs
      .map(d => ({ id: d.id, ...d.data() }))
      .sort((a, b) => {
        const ta = a.dateAnswer?.toMillis?.() || 0;
        const tb = b.dateAnswer?.toMillis?.() || 0;
        return ta - tb;
      });

    if (answered.length < 1) {
      return res.status(400).json({
        message: 'Aún no hay respuestas hoy. Responde al menos 1 pregunta para actualizar tu IBP.',
        answeredTodayCount: 0,
        dayKey: todayKey,
      });
    }

    const evidence = answered.map(q => ({
      id: q.id,
      question: q.question,
      type: q.type,
      options: Array.isArray(q.options) ? q.options : [],
      answer: q.answer,
    }));

    // -------- Helpers (idénticos a tu flujo) --------
    function normalizeMapToSum(map, target = 10, precision = 3) {
      const keys = Object.keys(map || {});
      if (!keys.length) return {};
      const rawSum = keys.reduce((s, k) => s + (Number(map[k]) || 0), 0);

      const scaled = {};
      if (rawSum <= 0) {
        const uniform = target / keys.length;
        keys.forEach((k) => (scaled[k] = uniform));
      } else {
        const factor = target / rawSum;
        keys.forEach((k) => (scaled[k] = (Number(map[k]) || 0) * factor));
      }

      const pow = Math.pow(10, precision);
      const items = keys.map((k) => {
        const units = scaled[k] * pow;
        const floorUnits = Math.floor(units);
        return { k, floorUnits, rest: units - floorUnits };
      });

      const targetUnits = Math.round(target * pow);
      let used = items.reduce((s, it) => s + it.floorUnits, 0);
      let remaining = targetUnits - used;

      items.sort((a, b) => b.rest - a.rest);
      for (let i = 0; i < items.length && remaining > 0; i++) {
        items[i].floorUnits += 1;
        remaining -= 1;
      }

      const out = {};
      items.forEach((it) => (out[it.k] = it.floorUnits / pow));
      return out;
    }

    function sanitizeWeights(inMap, validIds) {
      const out = {};
      for (const id of validIds) {
        const v = Number(inMap?.[id]);
        out[id] = Number.isFinite(v) && v >= 0 ? v : 0;
      }
      return out;
    }

    async function getLastIBP(uid) {
      try {
        const snap = await db.collection("InnerBluePrint")
          .where("userId", "==", uid)
          .orderBy("dateCreation", "desc")
          .limit(1)
          .get();
        if (snap.empty) return null;
        return snap.docs[0].data();
      } catch (e) {
        const needsIndex = String(e?.code) === '9' || /FAILED_PRECONDITION/i.test(e?.message || '');
        if (!needsIndex) throw e;

        const snap = await db.collection("InnerBluePrint")
          .where("userId", "==", uid)
          .limit(50)
          .get();

        let latest = null;
        snap.forEach(doc => {
          const data = doc.data() || {};
          const ms = data?.dateCreation?.toMillis
            ? data.dateCreation.toMillis()
            : (data?.dateCreation?._seconds ? data.dateCreation._seconds * 1000 : 0);
          if (!latest || ms > latest.ms) latest = { ms, data };
        });
        return latest ? latest.data : null;
      }
    }

    const lastIbp = await getLastIBP(userId);

    const [arqSnap, persSnap] = await Promise.all([
      db.collection("Archetypes").get(),
      db.collection("Personality").get(),
    ]);

    const archetypes = [];
    const archetypeIds = [];
    arqSnap.forEach((doc) => {
      const d = doc.data() || {};
      archetypes.push({ id: doc.id, name: d.name, description: d.description, keywords: d.keywords || [] });
      archetypeIds.push(doc.id);
    });

    const personalities = [];
    const personalityIds = [];
    persSnap.forEach((doc) => {
      const d = doc.data() || {};
      personalities.push({ id: doc.id, name: d.name, description: d.description });
      personalityIds.push(doc.id);
    });

    // 2) Prompt: update con evidencia parcial (1..3)
    const sysIbp = `
Eres TheInnerCode Core Model. Mantienes el InnerBluePrint (IBP) con trazabilidad.
Actualiza el IBP con las respuestas del día a TriggerQuestions.
IMPORTANTE: Hoy puede haber solo 1 o 2 respuestas (evidencia parcial). Ajusta con prudencia y menciona incertidumbre.
Estilo sereno, científico y humanista, 2ª persona. Evita misticismo/predicciones; no inventes datos.
Devuelve SOLO JSON válido con:
{
  "mode": "update",
  "lifeCycles": "string en texto plano",
  "emotionalTendency": "string breve",
  "currentLifeTrend": "string breve",
  "suggestedApproach": "string breve y accionable (2-10 palabras)",
  "justify": "60-140 palabras explicando QUÉ cambió y POR QUÉ; cita evidencia del día y que puede ser parcial",
  "facetas": ["2-6 strings"],
  "archetypeWeight": { "<ARQ_ID>": decimal, ... },
  "personalityWeight": { "<PERS_ID>": decimal, ... }
}
Las sumas de los mapas deben aproximarse a 10 (el servidor ajustará a Σ=10 exacto con decimales).
`.trim();

    const usrIbp = `
Baseline previo (puede ser null):
${JSON.stringify(lastIbp || {}, null, 2)}

Arquetipos (IDs válidos):
${JSON.stringify(archetypes, null, 2)}

Personalidad (IDs válidos):
${JSON.stringify(personalities, null, 2)}

Nueva evidencia (TriggerQuestions respondidas hoy: ${evidence.length}):
${JSON.stringify(evidence, null, 2)}

Tarea:
- Proponer un IBP actualizado en JSON con cambios prudentes (proporcionales a la evidencia).
- Usa SOLO los IDs válidos en los mapas de pesos.
- Escribe "justify" como changelog claro.
`.trim();

    const upd = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.4,
      messages: [
        { role: "system", content: sysIbp },
        { role: "user", content: usrIbp }
      ]
    });

    // 3) Parse y fallback
    let modelOut;
    try {
      const raw2 = upd.choices?.[0]?.message?.content?.trim() || "{}";
      const start = raw2.indexOf("{");
      const end = raw2.lastIndexOf("}");
      modelOut = JSON.parse(raw2.slice(start, end + 1));
    } catch {
      modelOut = null;
    }

    if (!modelOut || typeof modelOut !== "object") {
      modelOut = {
        mode: "update",
        lifeCycles: lastIbp?.lifeCycles || "fase en ajuste progresivo",
        emotionalTendency: lastIbp?.emotionalTendency || "reflexivo",
        currentLifeTrend: lastIbp?.currentLifeTrend || "integración gradual",
        suggestedApproach: "observa y escribe con honestidad",
        justify: "Actualización mínima (fallback). Evidencia parcial del día; se hacen cambios conservadores.",
        facetas: lastIbp?.facetas || ["autenticidad", "claridad", "curiosidad"],
        archetypeWeight: lastIbp?.archetypeWeight || Object.fromEntries(archetypeIds.map(id => [id, 10 / Math.max(1, archetypeIds.length)])),
        personalityWeight: lastIbp?.personalityWeight || Object.fromEntries(personalityIds.map(id => [id, 10 / Math.max(1, personalityIds.length)])),
      };
    }

    modelOut.mode = "update";
    modelOut.lifeCycles = modelOut.lifeCycles || lastIbp?.lifeCycles || "fase en ajuste progresivo";
    modelOut.emotionalTendency = modelOut.emotionalTendency || lastIbp?.emotionalTendency || "reflexivo";
    modelOut.currentLifeTrend = modelOut.currentLifeTrend || lastIbp?.currentLifeTrend || "integración gradual";
    modelOut.suggestedApproach = modelOut.suggestedApproach || "observa y escribe con honestidad";
    modelOut.justify = modelOut.justify || "Se integran señales del día con cambios prudentes (evidencia parcial).";
    modelOut.facetas = Array.isArray(modelOut.facetas) && modelOut.facetas.length
      ? modelOut.facetas
      : (lastIbp?.facetas || ["autenticidad", "claridad", "curiosidad"]);

    let archetypeWeight = sanitizeWeights(modelOut.archetypeWeight, archetypeIds);
    let personalityWeight = sanitizeWeights(modelOut.personalityWeight, personalityIds);
    archetypeWeight = normalizeMapToSum(archetypeWeight, 10, 3);
    personalityWeight = normalizeMapToSum(personalityWeight, 10, 3);

    // 4) Guardar IBP
    const ibpRef = await db.collection("InnerBluePrint").add({
      mode: modelOut.mode,
      lifeCycles: modelOut.lifeCycles,
      emotionalTendency: modelOut.emotionalTendency,
      currentLifeTrend: modelOut.currentLifeTrend,
      suggestedApproach: modelOut.suggestedApproach,
      archetypeWeight,
      justify: modelOut.justify,
      facetas: modelOut.facetas,
      personalityWeight,
      sourceTriggerDayKey: todayKey,
      sourceTriggerManual: true,
      sourceTriggerAnsweredCount: evidence.length,
      sourceTriggerIds: evidence.map(e => e.id),
      dateCreation: admin.firestore.FieldValue.serverTimestamp(),
      userId
    });

    // 5) Marcar día como procesado + dailyActsCompleted (1 vez/día)
    let dailyActsCompleted = null;

    await db.runTransaction(async (tx) => {
      const snap = await tx.get(userRef);
      const user = snap.exists ? (snap.data() || {}) : {};

      const prev = Number(user.dailyActsCompleted ?? 0);
      const last = String(user.dailyActsSources?.[source]?.lastDayKey || '');

      if (last !== todayKey) {
        tx.set(
          userRef,
          {
            dailyActsCompleted: admin.firestore.FieldValue.increment(1),
            dailyActsSources: {
              ...(user.dailyActsSources || {}),
              [source]: {
                lastDayKey: todayKey,
                lastCountedAt: admin.firestore.FieldValue.serverTimestamp(),
                lastCountedMode: 'manual',
                lastAnsweredCount: evidence.length,
              },
            },
          },
          { merge: true }
        );
        dailyActsCompleted = prev + 1;
      } else {
        dailyActsCompleted = prev;
      }
    });

    return res.status(201).json({
      message: 'IBP actualizado manualmente con respuestas disponibles hoy',
      ibpUpdate: { status: 'ok', id: ibpRef.id },
      answeredTodayCount: evidence.length,
      dayKey: todayKey,
      ...(dailyActsCompleted !== null ? { dailyActsCompleted } : {}),
    });

  } catch (error) {
    console.error('Error POST /trigger-questions/manual-ibp:', error);
    return res.status(500).json({
      message: 'Error al actualizar IBP manualmente',
      error: error.message,
    });
  }
});

//hola









//INNERA WEB LANDING
// POST /users/innera/lead  (público, sin verifyToken)
router.post('/innera/lead', async (req, res) => {
  try {
    const {
      correoElectronico,
      nivelProfundidad,
      queTeHizoDetenerElScroll,
      queSeSientePocoClaroHoy,
    } = req.body || {};

    // Validaciones mínimas
    const email = String(correoElectronico || '').trim().toLowerCase();
    if (!email) return res.status(400).json({ ok: false, message: 'Falta correoElectronico' });

    // (opcional) valida formato email simple
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ ok: false, message: 'Correo inválido' });
    }

    const payload = {
      correoElectronico: email,
      nivelProfundidad: String(nivelProfundidad || '').trim(),
      queTeHizoDetenerElScroll: String(queTeHizoDetenerElScroll || '').trim(),
      queSeSientePocoClaroHoy: String(queSeSientePocoClaroHoy || '').trim(),

      // hora del servidor
      dateCreation: admin.firestore.FieldValue.serverTimestamp(),
    };

    // ✅ Generar ID y guardarlo dentro del doc también
    const ref = db.collection('InneraLeads').doc(); // nueva colección
    await ref.set({ id: ref.id, ...payload });

    return res.status(201).json({ ok: true, id: ref.id });
  } catch (error) {
    console.error('Error POST /users/innera/lead:', error);
    return res.status(500).json({ ok: false, message: 'Error al guardar', error: error.message });
  }
});



//06
module.exports = router;