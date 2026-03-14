import { useState } from "react";
import Modal from "./Modal";
import { db, firebaseConfigError } from "../firebase";
import {
  doc,
  collection,
  runTransaction,
  serverTimestamp,
} from "firebase/firestore";

// Regex más robusto: evita espacios, asegura que haya un dominio, punto y al menos 2 letras al final
const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

const withDevErrorDetails = (body, error) => {
  if (!import.meta.env.DEV || !error) return body;

  const detail = [error.code, error.message].filter(Boolean).join(" | ");
  return detail ? `${body} (${detail})` : body;
};

const getSubmissionErrorModal = (error, t, locale) => {
  // Cupo agotado (límite de 300)
  if (error?.message?.includes("LIMIT_REACHED")) {
    return {
      title: locale === "en" ? "Registration Full" : "Cupos Agotados",
      body:
        locale === "en"
          ? "We're extremely sorry, but all 300 spots have been filled. Thank you for your interest."
          : "Lo sentimos muchísimo, pero ya se han llenado los 300 lugares disponibles. Gracias por tu interés.",
      cta: t.modal.cta,
    };
  }

  // Email ya registrado (equivalente al UNIQUE constraint de Supabase)
  if (error?.message?.includes("ALREADY_REGISTERED")) {
    return {
      title: t.modal.alreadyTitle,
      body: t.modal.alreadyBody,
      cta: t.modal.cta,
    };
  }

  const isNetworkError = /fetch failed|failed to fetch|network/i.test(
    error?.message ?? ""
  );

  if (isNetworkError) {
    return {
      title: t.modal.errorTitle,
      body: withDevErrorDetails(
        locale === "en"
          ? "The form couldn't reach Firebase. Check your network connection."
          : "El formulario no pudo llegar a Firebase. Revisa tu conexión de red.",
        error
      ),
      cta: t.modal.cta,
    };
  }

  return {
    title: t.modal.errorTitle,
    body: withDevErrorDetails(t.modal.errorBody, error),
    cta: t.modal.cta,
  };
};

export default function ApplyForm({ t, locale }) {
  const [modal, setModal] = useState(null);
  const closeModal = () => setModal(null);

  const [status, setStatus] = useState("idle");
  const [form, setForm] = useState({
    email: "",
    stop: "",
    unclear: "",
    depth: "curiosity",
  });

  // Honeypot field - Debe mantenerse vacío por humanos
  const [honeypot, setHoneypot] = useState("");
  // Limitar el envío del formulario a uno cada 10 segundos
  const [lastSubmitTime, setLastSubmitTime] = useState(0);

  const emailInvalid =
    form.email.trim().length > 0 && !EMAIL_REGEX.test(form.email.trim());

  const canSubmit =
    form.email.trim().length > 0 &&
    form.email.trim().length <= 100 &&
    EMAIL_REGEX.test(form.email.trim()) &&
    form.depth.length > 0 &&
    form.stop.trim().length <= 500 &&
    form.unclear.trim().length <= 500 &&
    honeypot === ""; // Honeypot validation

  const updateForm = (field) => (event) => {
    let value = event.target.value;

    // Evitar que pongan más de 500 caracteres (o 100 en el email) forzando el slice aquí si llegara a pegar
    if (field === "email" && value.length > 100) value = value.slice(0, 100);
    if ((field === "stop" || field === "unclear") && value.length > 500)
      value = value.slice(0, 500);

    setStatus("idle");
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!canSubmit || status === "submitting") return;

    if (firebaseConfigError || !db) {
      const configError = { message: firebaseConfigError };
      console.error("Firebase is not configured for form submissions.", configError);
      setStatus("error");
      setModal(getSubmissionErrorModal(configError, t, locale));
      return;
    }

    // Prevención por honeypot
    if (honeypot !== "") return;

    const now = Date.now();
    // Prevenir spam de botones: deben pasar al menos 10s entre envíos
    if (now - lastSubmitTime < 10000) {
      setStatus("idle");
      return;
    }

    setStatus("submitting");

    try {
      const email = form.email.trim();

      // Transacción atómica que reemplaza los 2 triggers BEFORE INSERT de Supabase:
      // 1. Verifica email único (equivalente al UNIQUE constraint)
      // 2. Verifica límite de 300 registros (equivalente al trigger enforce_application_limit)
      // El documento usa el email como ID para garantizar unicidad a nivel Firestore
      await runTransaction(db, async (transaction) => {
        const statsRef = doc(db, "stats", "global");
        const appRef = doc(collection(db, "applications"), email);

        const [statsDoc, appDoc] = await Promise.all([
          transaction.get(statsRef),
          transaction.get(appRef),
        ]);

        // Email ya registrado
        if (appDoc.exists()) {
          throw new Error("ALREADY_REGISTERED");
        }

        // Límite alcanzado
        const count = statsDoc.exists()
          ? (statsDoc.data()?.applications_count ?? 0)
          : 0;
        if (count >= 300) {
          throw new Error("LIMIT_REACHED");
        }

        // Insertar aplicación — el Cloud Function se encarga del resto:
        // - Incrementar stats/global.applications_count (trigger on_application_insert)
        // - Enviar email de bienvenida (trigger on_application_insert_send_email)
        transaction.set(appRef, {
          email,
          depth: form.depth,
          stop: form.stop.trim(),
          unclear: form.unclear.trim(),
          locale,
          created_at: serverTimestamp(),
        });
      });

      setLastSubmitTime(Date.now());
      setStatus("success");
      setModal({
        title: locale === "en" ? "Thank you!" : "¡Muchas gracias!",
        body:
          locale === "en"
            ? "Thank you so much for being a part of Innera!"
            : "¡Muchas gracias por ser parte de Innera!",
        cta: t.modal.cta,
        isSuccess: true,
      });
      setForm({
        email: "",
        stop: "",
        unclear: "",
        depth: "curiosity",
      });
    } catch (error) {
      console.error("Failed to submit application", error);
      setStatus("error");
      setModal(getSubmissionErrorModal(error, t, locale));
    } finally {
      // Reset honeypot siempre
      setHoneypot("");
    }
  };

  return (
    <>
      {modal ? (
        <Modal
          title={modal.title}
          body={modal.body}
          cta={modal.cta}
          onClose={closeModal}
          isSuccess={modal.isSuccess}
        />
      ) : null}

      <form onSubmit={handleSubmit} className="apply-form">
        {/* HONEYPOT: Oculto visualmente pero accesible a bots */}
        <div style={{ display: "none" }} aria-hidden="true">
          <label htmlFor="website">Website</label>
          <input
            type="text"
            id="website"
            name="website"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            tabIndex="-1"
            autoComplete="off"
          />
        </div>

        <ol className="form-list">
          <li className="motion-card form-item">
            <label className="field-label">
              {t.form.fields.email}
              <input
                type="email"
                required
                maxLength={100}
                value={form.email}
                onChange={updateForm("email")}
                className="field-input"
              />
            </label>
          </li>

          <li className="motion-card form-item">
            <label className="field-label">
              {t.form.fields.depth}
              <select
                value={form.depth}
                onChange={updateForm("depth")}
                className="field-input"
              >
                {Object.entries(t.form.fields.depthOptions).map(
                  ([value, label]) => (
                    <option key={value} value={value} className="field-option">
                      {label}
                    </option>
                  )
                )}
              </select>
            </label>
          </li>

          <li className="motion-card form-item">
            <label
              className="field-label"
              style={{ display: "flex", flexDirection: "column", gap: "4px" }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span>{t.form.fields.stop}</span>
                <span
                  style={{
                    fontSize: "0.8rem",
                    color:
                      form.stop.length >= 500 ? "var(--coral)" : "inherit",
                    opacity: 0.7,
                  }}
                >
                  {form.stop.length} / 500
                </span>
              </div>
              <textarea
                value={form.stop}
                maxLength={500}
                onChange={updateForm("stop")}
                rows={3}
                className="field-textarea"
              />
            </label>
          </li>

          <li className="motion-card form-item">
            <label
              className="field-label"
              style={{ display: "flex", flexDirection: "column", gap: "4px" }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span>{t.form.fields.unclear}</span>
                <span
                  style={{
                    fontSize: "0.8rem",
                    color:
                      form.unclear.length >= 500 ? "var(--coral)" : "inherit",
                    opacity: 0.7,
                  }}
                >
                  {form.unclear.length} / 500
                </span>
              </div>
              <textarea
                value={form.unclear}
                maxLength={500}
                onChange={updateForm("unclear")}
                rows={4}
                className="field-textarea"
              />
            </label>
          </li>
        </ol>

        {emailInvalid ? (
          <p className="form-message error">{t.emailInvalid}</p>
        ) : null}
        <div className="form-submit-wrap">
          <button
            type="submit"
            disabled={!canSubmit || status === "submitting"}
            className="apply-hover-cycle submit-button"
          >
            {status === "submitting" ? t.form.submitting : t.form.submit}
          </button>
        </div>
      </form>
    </>
  );
}
