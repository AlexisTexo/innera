import { useEffect, useMemo } from "react";
import "./App.css";
import "./not-found.css";
import { buildLocalePath, getLocaleFromPath } from "./site-config";

const FALLBACK_HOME_PATH = buildLocalePath("en");

const ensureMeta = (name, content) => {
  let element = document.head.querySelector(`meta[name="${name}"]`);

  if (!element) {
    element = document.createElement("meta");
    element.setAttribute("name", name);
    document.head.appendChild(element);
  }

  element.setAttribute("content", content);
};

export default function NotFoundPage() {
  const homePath = useMemo(() => {
    if (typeof window === "undefined") return FALLBACK_HOME_PATH;
    const locale = getLocaleFromPath(window.location.pathname);
    return buildLocalePath(locale);
  }, []);

  useEffect(() => {
    document.title = "Oops | Pagina no encontrada";
    ensureMeta("robots", "noindex, nofollow");
  }, []);

  return (
    <div className="landing not-found-shell">
      <header className="landing-header is-scrolled">
        <div className="container header-inner">
          <img
            src={`${import.meta.env.BASE_URL}logo_innera_text.png`}
            alt="Innera"
            className="innera-logo"
          />
          <a href={homePath} className="hover-palette nav-apply">
            Inicio
          </a>
        </div>
      </header>

      <main className="container landing-main not-found-main">
        <section className="hero-section not-found-hero">
          <h1 className="hero-title not-found-title">
            <span className="hero-title-accent animated-gradient-text">Oops.</span>
            <br />
            <span>Pagina no encontrada.</span>
          </h1>
          <p className="hero-subtitle not-found-subtitle">
            La pagina que buscas no existe o fue movida. Regresa al inicio y vuelve a entrar
            desde ahi.
          </p>
          <a href={homePath} className="apply-hover-cycle hero-cta">
            Regresar al inicio
          </a>
          <div className="not-found-palette" aria-hidden="true">
            <span className="not-found-palette-bar sandy" />
            <span className="not-found-palette-bar coral" />
            <span className="not-found-palette-bar tomato" />
            <span className="not-found-palette-bar lavender" />
            <span className="not-found-palette-bar blue" />
            <span className="not-found-palette-bar teal" />
          </div>
          <span className="hero-line" aria-hidden="true" />
        </section>
      </main>
    </div>
  );
}
