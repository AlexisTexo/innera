import { getLocaleFromPath } from "./locale";

const copy = {
  en: {
    titleA: "This page",
    titleB: "does not exist.",
    subtitle:
      "The link may be broken or the page may have moved. Return to INNERA and continue your journey.",
    backHome: "Back to Home",
    footer: "INNERA by TheInnerCode",
    localeAria: "Switch language to Spanish",
  },
  es: {
    titleA: "Esta página",
    titleB: "no existe.",
    subtitle:
      "Puede que el enlace esté roto o que la página se haya movido. Vuelve a INNERA y continúa tu camino.",
    backHome: "Volver al Inicio",
    footer: "INNERA por TheInnerCode",
    localeAria: "Switch language to English",
  },
};

export default function NotFoundPage() {
  const locale = getLocaleFromPath(window.location.pathname);
  const t = copy[locale] ?? copy.en;
  const homeHref = locale === "es" ? "/es/" : "/";
  const localeToggleLabel = locale === "es" ? "EN" : "ES";
  const alternateLocaleHref = locale === "es" ? "/" : "/es/";

  return (
    <div className="landing">
      <header className="landing-header is-scrolled">
        <div className="container header-inner">
          <picture>
            <source srcSet="/logo_innera_text.webp" type="image/webp" />
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
              aria-label={t.localeAria}
              onClick={() => window.location.assign(alternateLocaleHref)}
            >
              {localeToggleLabel}
            </button>
          </div>
        </div>
      </header>

      <main className="container landing-main not-found-main">
        <section className="hero-section not-found-hero">
          <p className="not-found-code">404</p>
          <h1 className="hero-title">
            <span>{t.titleA}</span>
            <br />
            <span className="hero-title-accent animated-gradient-text">{t.titleB}</span>
          </h1>
          <p className="hero-subtitle not-found-subtitle">{t.subtitle}</p>

          <div className="not-found-actions">
            <a href={homeHref} className="apply-hover-cycle hero-cta">
              {t.backHome}
            </a>
          </div>
        </section>
      </main>

      <footer className="landing-footer">
        <p className="footer-copy">{t.footer}</p>
      </footer>
    </div>
  );
}
