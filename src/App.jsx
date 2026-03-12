import { Suspense, lazy, useEffect, useRef, useState } from "react";
import useLanguage from "./components/useLanguage";

const ReCAPTCHA = lazy(() => import("react-google-recaptcha"));

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const whatIsColors = ["var(--sandy)", "var(--coral)", "var(--teal)"];
const earlyColors = ["var(--sandy)", "var(--coral)", "var(--emerald)", "var(--blue)"];
const timelineColors = [
  "var(--sandy)",
  "var(--coral)",
  "var(--teal)",
  "var(--lavender)",
  "var(--emerald)",
];

function SectionKicker({ label, lineColor }) {
  return (
    <div className="section-kicker">
      <span className="section-kicker-line" style={{ backgroundColor: lineColor }} />
      <p className="section-kicker-label">{label}</p>
    </div>
  );
}

function TimelineGlyph({ marker, color }) {
  if (marker === "diamond") {
    return <span className="glyph-shape glyph-diamond" style={{ borderColor: color }} />;
  }

  if (marker === "diamond-small") {
    return <span className="glyph-shape glyph-diamond-small" style={{ borderColor: color }} />;
  }

  if (marker === "triangle") {
    return <span className="glyph-shape glyph-triangle" style={{ borderBottomColor: color }} />;
  }

  if (marker === "circle") {
    return <span className="glyph-shape glyph-circle" style={{ borderColor: color }} />;
  }

  return <span className="glyph-shape glyph-square" style={{ borderColor: color }} />;
}

function Divider() {
  return (
    <div className="divider-wrap" aria-hidden="true">
      <div className="divider-line" />
    </div>
  );
}

function Modal({ title, body, cta, onClose }) {
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" onMouseDown={onClose}>
      <div className="modal" onMouseDown={(e) => e.stopPropagation()}>
        <h3 className="modal-title">{title}</h3>
        <p className="modal-body">{body}</p>
        <div className="modal-actions">
          <button type="button" className="modal-btn" onClick={onClose}>
            {cta}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function App({ forcedLocale, dictionary }) {
  const { locale, toggleLocale } = useLanguage(forcedLocale);

  const t = dictionary;
  const localeToggleLabel = locale === "es" ? "EN" : "ES";
  const localeToggleAria =
    locale === "es" ? "Switch language to English" : "Cambiar idioma a español";

  const [modal, setModal] = useState(null);
  const closeModal = () => setModal(null);

  const [status, setStatus] = useState("idle");
  const [form, setForm] = useState({
    email: "",
    stop: "",
    unclear: "",
    depth: "curiosity",
  });
  const [isScrolled, setIsScrolled] = useState(false);

  // ✅ reCAPTCHA
  const recaptchaRef = useRef(null);
  const [captchaToken, setCaptchaToken] = useState("");
  const [isClient, setIsClient] = useState(false);
  const [shouldLoadRecaptcha, setShouldLoadRecaptcha] = useState(false);
  const RECAPTCHA_SITE_KEY = (import.meta.env.VITE_RECAPTCHA_SITE_KEY ?? "").trim();
  const hasRecaptchaSiteKey = RECAPTCHA_SITE_KEY.length > 0;
  const canRenderRecaptcha = isClient && hasRecaptchaSiteKey && shouldLoadRecaptcha;

  const emailInvalid = form.email.trim().length > 0 && !EMAIL_REGEX.test(form.email.trim());

  const canSubmit =
    form.email.trim().length > 0 &&
    EMAIL_REGEX.test(form.email.trim()) &&
    form.depth.length > 0 &&
    (!hasRecaptchaSiteKey || !!captchaToken);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !hasRecaptchaSiteKey) return;

    const target = document.getElementById("apply-form");
    if (!target) {
      setShouldLoadRecaptcha(true);
      return;
    }

    if (!("IntersectionObserver" in window)) {
      setShouldLoadRecaptcha(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries, currentObserver) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          setShouldLoadRecaptcha(true);
          currentObserver.unobserve(entry.target);
        });
      },
      { rootMargin: "240px 0px", threshold: 0.01 }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [isClient, hasRecaptchaSiteKey]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    if (params.get("confirmed") === "1") {
      setModal({
        title: t.modal.successTitle,
        body: t.modal.emailConfirmedBody,
        cta: t.modal.cta,
      });
      return;
    }

    if (params.get("closed") === "1") {
      setModal({
        title: t.modal.closedTitle,
        body: t.modal.closedBody,
        cta: t.modal.cta,
      });
    }
  }, [t.modal.closedBody, t.modal.closedTitle, t.modal.cta, t.modal.emailConfirmedBody, t.modal.successTitle]);

  useEffect(() => {
    let frameId = 0;

    const handleScroll = () => {
      if (frameId) return;

      frameId = window.requestAnimationFrame(() => {
        frameId = 0;
        const nextIsScrolled = window.scrollY > 32;
        setIsScrolled((prev) => (prev === nextIsScrolled ? prev : nextIsScrolled));
      });
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (frameId) window.cancelAnimationFrame(frameId);
    };
  }, []);
  useEffect(() => {
    const sections = Array.from(document.querySelectorAll(".section-reveal"));
    if (sections.length === 0) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      sections.forEach((section) => section.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries, currentObserver) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          currentObserver.unobserve(entry.target);
        });
      },
      {
        threshold: 0.2,
        rootMargin: "0px 0px -8% 0px",
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  const updateForm = (field) => (event) => {
    const value = event.target.value;
    setStatus("idle");
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!canSubmit || status === "submitting") return;

    setStatus("submitting");

    try {
      const response = await fetch(`${API_URL}/testusers/test-users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email.trim(),
          stopReason: form.stop.trim(),
          unclear: form.unclear.trim(),
          depth: form.depth,
          locale,
          captchaToken, // ✅ manda token al backend
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (response.status === 403) {
        setStatus("idle");
        setModal({
          title: t.modal.closedTitle,
          body: t.modal.closedBody,
          cta: t.modal.cta,
        });
        return;
      }

      if (!response.ok) {
        setStatus("error");
        setModal({
          title: t.modal.errorTitle,
          body: t.modal.errorBody,
          cta: t.modal.cta,
        });
        return;
      }

      if (data?.alreadyRegistered) {
        setStatus("idle");
        setModal({
          title: t.modal.alreadyTitle,
          body: t.modal.alreadyBody,
          cta: t.modal.cta,
        });
        return;
      }

      setStatus("success");
      setModal({
        title: t.modal.successTitle,
        body: t.modal.successBody,
        cta: t.modal.cta,
      });

      setForm({
        email: "",
        stop: "",
        unclear: "",
        depth: "curiosity",
      });
    } catch {
      setStatus("error");
      setModal({
        title: t.modal.errorTitle,
        body: t.modal.errorBody,
        cta: t.modal.cta,
      });
    } finally {
      // ✅ reset captcha siempre
      recaptchaRef.current?.reset?.();
      setCaptchaToken("");
    }
  };

  return (
    <div className="landing">
      {modal ? (
        <Modal title={modal.title} body={modal.body} cta={modal.cta} onClose={closeModal} />
      ) : null}

      <header className={`landing-header ${isScrolled ? "is-scrolled" : ""}`}>
        <div className="container header-inner">
          <picture>
            <source
              srcSet="/logo_innera_text.webp"
              type="image/webp"
            />
            <img
              src="/logo_innera_text.png"
              alt="Innera"
              className="innera-logo"
              width="676"
              height="296"
              decoding="async"
              fetchPriority="high"
            />
          </picture>
          <div className="header-actions">
            <button
              type="button"
              className="hover-palette locale-toggle"
              onClick={toggleLocale}
              aria-label={localeToggleAria}
            >
              {localeToggleLabel}
            </button>
            <a href="#apply-form" className="nav-apply">
              {t.nav}
            </a>
          </div>
        </div>
      </header>

      <main className="container landing-main">
        <section className="section-reveal-1 hero-section">
          <span className="hero-brand">by TheInnerCode</span>
          <h1 className="hero-title">
            <span>{t.hero.titleA}</span>
            <br />
            <span className="hero-title-accent animated-gradient-text">{t.hero.titleB}</span>
          </h1>
          <p className="hero-subtitle">{t.hero.subtitle}</p>
          <a href="#apply-form" className="apply-hover-cycle hero-cta">
            {t.hero.cta}
          </a>
          <span className="hero-line" aria-hidden="true" />
        </section>

        <section id="what-is-innera" className="section-reveal section-reveal-2 section-block">
          <SectionKicker label={t.whatIs.kicker} lineColor="var(--blue)" />
          <h2 className="section-title">
            {t.whatIs.titleA}
            <br />
            <span className="section-title-soft">{t.whatIs.titleB}</span>
          </h2>

          <div className="what-grid">
            {t.whatIs.rows.map((row, index) => (
              <article key={row.label} className="motion-card what-row">
                <h3
                  className="what-label"
                  style={{ color: whatIsColors[index % whatIsColors.length] }}
                >
                  {row.label}
                </h3>
                <p className="what-body">{row.body}</p>
              </article>
            ))}
          </div>
        </section>

        <Divider />

        <section className="section-reveal section-reveal-3 section-block">
          <SectionKicker label={t.ibp.kicker} lineColor="var(--emerald)" />
          <h2 className="section-title">{t.ibp.title}</h2>
          <p className="section-intro">{t.ibp.intro}</p>

          <div className="ibp-grid">
            {t.ibp.cards.map((card) => (
              <article key={card.title} className="ibp-card">
                <h3 className="ibp-title">{card.title}</h3>
                <p className="ibp-body">{card.body}</p>
              </article>
            ))}
          </div>
        </section>

        <Divider />

        <section className="section-reveal section-reveal-4 section-block">
          <SectionKicker label={t.early.kicker} lineColor="var(--coral)" />
          <h2 className="section-title">{t.early.title}</h2>
          <p className="section-intro">{t.early.intro}</p>

          <div className="early-list">
            {t.early.rows.map((row, index) => (
              <article key={row.title} className="motion-card early-row">
                <p className="early-index" style={{ color: earlyColors[index % earlyColors.length] }}>
                  {String(index + 1).padStart(2, "0")}
                </p>
                <div>
                  <h3 className="early-title">{row.title}</h3>
                  <p className="early-body">{row.body}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <Divider />

        <section className="section-reveal section-reveal-5 section-block">
          <SectionKicker label={t.how.kicker} lineColor="var(--lavender)" />
          <h2 className="section-title">{t.how.title}</h2>

          <div className="timeline-wrap">
            <div className="timeline-line" aria-hidden="true" />
            <div className="timeline-list">
              {t.how.rows.map((row, index) => (
                <article key={row.title} className="motion-card timeline-row">
                  <div className="timeline-glyph-slot">
                    <span
                      className="timeline-glyph-ring"
                      style={{ borderColor: timelineColors[index % timelineColors.length] }}
                    >
                      <TimelineGlyph
                        marker={row.marker}
                        color={timelineColors[index % timelineColors.length]}
                      />
                    </span>
                  </div>
                  <div>
                    <h3 className="timeline-title">{row.title}</h3>
                    <p className="timeline-body">{row.body}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <Divider />

        <section id="apply-form" className="section-reveal section-reveal-6 section-block">
          <SectionKicker label={t.form.kicker} lineColor="var(--teal)" />
          <h2 className="section-title">{t.form.title}</h2>
          <p className="form-intro">{t.form.intro}</p>

          <form onSubmit={handleSubmit} className="apply-form">
            <ol className="form-list">
              <li className="motion-card form-item">
                <label className="field-label">
                  {t.form.fields.email}
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={updateForm("email")}
                    className="field-input"
                    placeholder="you@email.com"
                  />
                </label>
              </li>

              <li className="motion-card form-item">
                <label className="field-label">
                  {t.form.fields.depth}
                  <select value={form.depth} onChange={updateForm("depth")} className="field-input">
                    {Object.entries(t.form.fields.depthOptions).map(([value, label]) => (
                      <option key={value} value={value} className="field-option">
                        {label}
                      </option>
                    ))}
                  </select>
                </label>
              </li>

              <li className="motion-card form-item">
                <label className="field-label">
                  {t.form.fields.stop}
                  <textarea
                    value={form.stop}
                    onChange={updateForm("stop")}
                    rows={3}
                    className="field-textarea"
                  />
                </label>
              </li>

              <li className="motion-card form-item">
                <label className="field-label">
                  {t.form.fields.unclear}
                  <textarea
                    value={form.unclear}
                    onChange={updateForm("unclear")}
                    rows={4}
                    className="field-textarea"
                  />
                </label>
              </li>
            </ol>

            {emailInvalid ? <p className="form-message error">{t.emailInvalid}</p> : null}
            {status === "success" ? <p className="form-message success">{t.form.success}</p> : null}
            {status === "error" ? <p className="form-message danger">{t.form.error}</p> : null}

            {canRenderRecaptcha ? (
              <div style={{ marginTop: 14, display: "flex", justifyContent: "center" }}>
                <Suspense fallback={<div style={{ minHeight: 78 }} />}>
                  <ReCAPTCHA
                    ref={recaptchaRef}
                    sitekey={RECAPTCHA_SITE_KEY}
                    onChange={(token) => setCaptchaToken(token || "")}
                    onExpired={() => setCaptchaToken("")}
                  />
                </Suspense>
              </div>
            ) : hasRecaptchaSiteKey ? (
              <div style={{ marginTop: 14, minHeight: 78 }} />
            ) : (
              <p className="form-message error">
                CAPTCHA no configurado: define <code>VITE_RECAPTCHA_SITE_KEY</code> en tu .env
              </p>
            )}

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
        </section>
      </main>

      <footer className="section-reveal section-reveal-6 landing-footer">
        <p className="footer-copy">{t.footer}</p>
      </footer>
    </div>
  );
}
