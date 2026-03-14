/**
 * Cloud Functions de Innera — Firebase
 *
 * Reemplaza los 3 triggers de Supabase:
 *  - enforce_application_limit  → manejado en el cliente (transacción atómica)
 *  - on_application_insert      → incrementStats() en esta función
 *  - on_application_insert_send_email → sendWelcomeEmail() en esta función
 */

const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const { defineSecret } = require("firebase-functions/params");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");
const sgMail = require("@sendgrid/mail");

initializeApp();

const SENDGRID_API_KEY = defineSecret("SENDGRID_API_KEY");

// ─── Plantillas de email por locale ───────────────────────────────────────────

const EMAIL_TEMPLATES = {
  es: {
    subject: "¡Bienvenido a Innera! 🎉",
    html: (email) => `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1a1a2e;">
        <h1 style="color: #6c63ff;">¡Ya eres parte de Innera!</h1>
        <p>Hola,</p>
        <p>Gracias por registrarte en la lista de espera de <strong>Innera</strong>. Tu lugar está reservado.</p>
        <p>Te avisaremos en cuanto tengamos noticias del lanzamiento. Mientras tanto, sigue desarrollando tu inteligencia emocional.</p>
        <p style="margin-top: 2rem; color: #888; font-size: 0.85rem;">
          Este correo fue enviado a ${email} porque te registraste en innera.app.
        </p>
      </div>
    `,
    text: (email) =>
      `¡Ya eres parte de Innera!\n\nGracias por registrarte en la lista de espera. Te avisaremos pronto.\n\nEste correo fue enviado a ${email}.`,
  },
  en: {
    subject: "Welcome to Innera! 🎉",
    html: (email) => `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1a1a2e;">
        <h1 style="color: #6c63ff;">You're on the Innera waitlist!</h1>
        <p>Hi there,</p>
        <p>Thank you for signing up for <strong>Innera</strong>'s waitlist. Your spot is reserved.</p>
        <p>We'll let you know as soon as we have launch news. In the meantime, keep building your emotional intelligence.</p>
        <p style="margin-top: 2rem; color: #888; font-size: 0.85rem;">
          This email was sent to ${email} because you signed up at innera.app.
        </p>
      </div>
    `,
    text: (email) =>
      `You're on the Innera waitlist!\n\nThank you for signing up. We'll be in touch soon.\n\nThis email was sent to ${email}.`,
  },
};

// ─── Función principal ─────────────────────────────────────────────────────────

exports.onApplicationCreated = onDocumentCreated(
  {
    document: "applications/{docId}",
    secrets: [SENDGRID_API_KEY],
    // Región más cercana a México / LATAM
    region: "us-central1",
  },
  async (event) => {
    const db = getFirestore();
    const data = event.data?.data();

    if (!data) {
      console.error("No data found in the event.");
      return;
    }

    const { email, locale = "es" } = data;

    // 1. Incrementar contador atómico en stats/global
    //    (Trigger: on_application_insert → increment_stats_count)
    try {
      const statsRef = db.doc("stats/global");
      await statsRef.set(
        { applications_count: FieldValue.increment(1) },
        { merge: true }
      );
      console.log(`✅ Stats incremented for application: ${email}`);
    } catch (err) {
      console.error("❌ Failed to increment stats:", err);
    }

    // 2. Enviar email de bienvenida con SendGrid
    //    (Trigger: on_application_insert_send_email → handle_new_application_email)
    try {
      sgMail.setApiKey(SENDGRID_API_KEY.value());

      const template = EMAIL_TEMPLATES[locale] ?? EMAIL_TEMPLATES.es;

      const msg = {
        to: email,
        from: {
          email: "hola@innera.app", // ← Cambia por tu remitente verificado en SendGrid
          name: "Innera",
        },
        subject: template.subject,
        html: template.html(email),
        text: template.text(email),
      };

      await sgMail.send(msg);
      console.log(`✅ Welcome email sent to: ${email} (locale: ${locale})`);
    } catch (err) {
      // No lanzamos el error para no reintentar — el email es best-effort
      console.error("❌ Failed to send welcome email:", err?.response?.body ?? err);
    }
  }
);
