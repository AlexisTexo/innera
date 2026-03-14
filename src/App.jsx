import { useEffect, useState } from "react";
import useLanguage from "./components/useLanguage";
import Modal from "./components/Modal";
import ApplyForm from "./components/ApplyForm";
import { db, firebaseConfigError } from "./firebase";
import { doc, onSnapshot } from "firebase/firestore";

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

function getInitialPageModal(search, t) {
  const params = new URLSearchParams(search);

  if (params.get("confirmed") === "1") {
    return {
      title: t.modal.successTitle,
      body: t.modal.emailConfirmedBody,
      cta: t.modal.cta,
    };
  }

  if (params.get("closed") === "1") {
    return {
      title: t.modal.closedTitle,
      body: t.modal.closedBody,
      cta: t.modal.cta,
    };
  }

  return null;
}


export default function App({ forcedLocale, dictionary }) {
  const { locale, toggleLocale } = useLanguage(forcedLocale);

  const t = dictionary;
  const localeToggleLabel = locale === "es" ? "EN" : "ES";
  const localeToggleAria =
    locale === "es" ? "Switch language to English" : "Cambiar idioma a español";

  const [modal, setModal] = useState(() =>
    typeof window === "undefined" ? null : getInitialPageModal(window.location.search, dictionary)
  );
  const closeModal = () => setModal(null);

  const [registrationsCount, setRegistrationsCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (firebaseConfigError || !db) {
      console.error(firebaseConfigError ?? "Firebase client is unavailable.");
      return undefined;
    }

    // onSnapshot reemplaza el fetch inicial + la suscripción realtime de Supabase.
    // Se dispara inmediatamente con el valor actual y luego en cada cambio
    // (equivalente al trigger on_application_insert que actualizaba public_stats).
    const statsRef = doc(db, "stats", "global");

    const unsubscribe = onSnapshot(
      statsRef,
      (snapshot) => {
        if (!snapshot.exists()) return;
        const newCount = snapshot.data()?.applications_count ?? 0;
        setRegistrationsCount((prev) => {
          if (prev !== 0 && newCount !== prev) {
            setIsAnimating(true);
            setTimeout(() => setIsAnimating(false), 800);
          }
          return newCount;
        });
      },
      (error) => {
        console.error("Failed to listen to public stats.", error);
      }
    );

    return () => unsubscribe();
  }, []);

  const [isScrolled, setIsScrolled] = useState(false);

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
          <span className="hero-brand">{t.trust.foundedBy}</span>
          <h1 className="hero-title">
            <span>{t.hero.titleA}</span>
            <br />
            <span className="hero-title-accent animated-gradient-text">{t.hero.titleB}</span>
          </h1>
          <p className="hero-subtitle">{t.hero.subtitle}</p>
          <a href="#apply-form" className="apply-hover-cycle hero-cta">
            {t.hero.cta}
          </a>
          <p className="hero-social-proof">
            {t.hero.socialProof} · <span className={`hero-spots-count ${isAnimating ? "count-pop" : ""}`}>{registrationsCount}</span>/300 {t.hero.spotsLeft}
          </p>
          <p className="hero-trust">{t.trust.frameworks}</p>
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

          <ApplyForm t={t} locale={locale} />
        </section>
      </main>

      <footer className="section-reveal section-reveal-6 landing-footer">
        <p className="footer-copy">{t.footer}</p>
      </footer>

      <div className="mobile-sticky-cta" aria-hidden="true">
        <a href="#apply-form" className="apply-hover-cycle hero-cta">
          {t.hero.cta}
        </a>
      </div>
    </div>
  );
}
