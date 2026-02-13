import { useEffect, useMemo, useState } from "react";
import "./App.css";
import useLanguage from "./components/useLanguage";

const FALLBACK_SITE_URL = "https://innera.theinnercode.net";
const SITE_URL = (() => {
  const raw = import.meta.env.VITE_SITE_URL ?? FALLBACK_SITE_URL;
  try {
    return new URL(raw).origin;
  } catch {
    return FALLBACK_SITE_URL;
  }
})();

const WAITLIST_ENDPOINT = import.meta.env.VITE_WAITLIST_ENDPOINT ?? "/api/waitlist";
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const copy = {
  es: {
    nav: "Aplicar",
    hero: {
      titleA: "Tu consciencia tiene",
      titleB: "una estructura.",
      subtitle:
        "Innera revela la arquitectura interna detras de como piensas, reaccionas y decides.",
      cta: "Aplicar como un Early Adopter",
    },
    whatIs: {
      kicker: "Que es Innera",
      titleA: "Autoconciencia aplicada",
      titleB: "No entretenimiento espiritual",
      rows: [
        {
          label: "El problema",
          body: "La mayoria opera en piloto automatico: repite patrones que no ve y decide desde puntos ciegos que nunca examina. El autoconocimiento sigue siendo vago, intuitivo y desestructurado.",
        },
        {
          label: "La diferencia",
          body: "Innera no te motiva ni te dice lo que quieres oir. Revela con precision la arquitectura interna de como piensas, reaccionas y eliges, sin frases vacias.",
        },
        {
          label: "Lo que no es",
          body: "No es horoscopo. No es test de personalidad. No es ruido motivacional. Innera es un sistema riguroso, impulsado por IA, para entender tus patrones operativos internos, disenado para quienes valoran profundidad por encima de comodidad.",
        },
      ],
    },
    ibp: {
      kicker: "El sistema IBP",
      title: "Perfil de Blueprint Interno",
      intro:
        "Piensalo como la arquitectura de tu mundo interno: un mapa dinamico que traduce patrones, tendencias y ciclos en claridad accionable.",
      cards: [
        {
          title: "Dinamico, no estatico",
          body: "Tu IBP evoluciona contigo. No es una evaluacion unica, sino un mapa vivo que se profundiza con cada interaccion.",
        },
        {
          title: "Reconocimiento de patrones",
          body: "Integra datos internos: tendencias de comportamiento, ciclos de energia y dinamicas arquetipicas en una estructura coherente que puedes leer.",
        },
        {
          title: "Espejo y brujula",
          body: "Funciona como herramienta para entender donde estas y como guia para navegar hacia donde vas.",
        },
        {
          title: "Profundidad progresiva",
          body: "Comienza con capas fundacionales y revela dimensiones mas profundas con el tiempo. Esta construido para maestria interna de largo plazo, no para atajos.",
        },
      ],
    },
    early: {
      kicker: "Por que entrar temprano",
      title: "Esto no es una beta abierta",
      intro:
        "Estamos formando un grupo fundador curado: personas que no solo usan herramientas, tambien ayudan a forjarlas. Tu insight pasa a formar parte del ADN de Innera.",
      rows: [
        {
          title: "Primer acceso",
          body: "Se de las primeras personas en vivir Innera antes de su lanzamiento publico. Moldea el producto desde su base.",
        },
        {
          title: "Influencia directa",
          body: "Tu feedback no cae en un vacio: da forma activa al diseno del MVP, funcionalidades y direccion.",
        },
        {
          title: "Circulo fundador",
          body: "Unete a una comunidad curada de usuarios fundadores que comparten compromiso con profundidad y autoentendimiento.",
        },
        {
          title: "Beneficios permanentes",
          body: "Quienes entren temprano reciben reconocimiento y beneficios permanentes mientras Innera evoluciona mas alla de la etapa fundacional.",
        },
      ],
    },
    how: {
      kicker: "Como funciona",
      title: "El camino, simplificado",
      rows: [
        {
          marker: "diamond",
          title: "Onboarding introspectivo",
          body: "Una experiencia guiada y reflexiva que comienza a mapear tu mundo interno.",
        },
        {
          marker: "diamond-small",
          title: "Construccion inicial del IBP",
          body: "Tu primer Perfil de Blueprint Interno: la base de tu viaje de autoconocimiento.",
        },
        {
          marker: "triangle",
          title: "Insights accionables",
          body: "Observaciones claras y precisas sobre tus patrones, energia y dinamicas internas.",
        },
        {
          marker: "circle",
          title: "Micro-reflexiones guiadas",
          body: "Prompts cortos y enfocados que profundizan tu autoconciencia con el tiempo.",
        },
        {
          marker: "square",
          title: "Evolucion progresiva",
          body: "Tu perfil crece y se refina, revelando capas mas profundas a medida que te involucras.",
        },
      ],
    },
    form: {
      kicker: "Aplicar",
      title: "Aplicar a Innera",
      intro: "Completa el formulario para solicitar acceso al Circulo Fundador.",
      fields: {
        email: "Correo electrónico",
        stop: "¿Qué te hizo detener el scroll?",
        unclear: "¿Qué se siente poco claro en tu mundo interno hoy?",
        depth: "¿Qué nivel de profundidad buscas?",
        depthOptions: {
          curiosity: "Curiosidad",
          commitment: "Compromiso",
          transformation: "Transformacion",
        },
      },
      submit: "Aplicar como un founding tester",
      submitting: "Enviando",
      success: "Solicitud recibida. Te contactaremos pronto.",
      error: "No pudimos guardar tu solicitud. Intenta de nuevo.",
    },
    emailInvalid: "Por favor escribe un correo valido.",
    footer: "INNERA por TheInnerCode",
  },
  en: {
    nav: "Apply",
    hero: {
      titleA: "Your consciousness has",
      titleB: "a structure.",
      subtitle:
        "Innera reveals the internal architecture behind how you think, react, and choose.",
      cta: "Apply as an Early Adopter",
    },
    whatIs: {
      kicker: "What Is Innera",
      titleA: "Applied self-awareness",
      titleB: "Not spiritual entertainment",
      rows: [
        {
          label: "The Problem",
          body: "Most people operate on autopilot -- repeating patterns they don't see, making decisions from blind spots they never examine. Self-knowledge remains vague, intuitive, and unstructured.",
        },
        {
          label: "The Difference",
          body: "Innera doesn't motivate you. It doesn't tell you what you want to hear. It reveals the internal architecture behind how you think, react, and choose -- with precision, not platitudes.",
        },
        {
          label: "What It Is Not",
          body: "Not a horoscope. Not a personality quiz. Not motivational noise. Innera is a rigorous, AI-driven system for understanding your internal operating patterns -- designed for those who value depth over comfort.",
        },
      ],
    },
    ibp: {
      kicker: "The IBP System",
      title: "Inner Blueprint Profile",
      intro:
        "Think of it as the architecture of your inner world -- a dynamic map that translates your patterns, tendencies, and cycles into clear, actionable insight.",
      cards: [
        {
          title: "Dynamic, Not Static",
          body: "Your IBP evolves as you do. It's not a one-time assessment but a living map that deepens with every interaction.",
        },
        {
          title: "Pattern Recognition",
          body: "Integrates internal data -- behavioral tendencies, energy cycles, archetypal dynamics -- into a coherent structure you can read.",
        },
        {
          title: "Mirror & Compass",
          body: "Functions both as a tool for understanding where you are and a guide for navigating where you're going.",
        },
        {
          title: "Progressive Depth",
          body: "Starts with foundational layers and reveals deeper dimensions over time -- built for long-term self-mastery, not quick fixes.",
        },
      ],
    },
    early: {
      kicker: "Why Early Adopters",
      title: "This is not an open beta",
      intro:
        "We're assembling a curated founding group -- individuals who don't just use tools, but help forge them. Your insight becomes part of Innera's DNA.",
      rows: [
        {
          title: "First Access",
          body: "Be among the first to experience Innera before its public release. Shape the product from its foundation.",
        },
        {
          title: "Direct Influence",
          body: "Your feedback doesn't go into a void -- it actively shapes the MVP design, features, and direction.",
        },
        {
          title: "Founding Circle",
          body: "Join a curated community of founding users who share a commitment to depth and self-understanding.",
        },
        {
          title: "Permanent Benefits",
          body: "Early adopters receive lasting recognition and benefits as Innera grows beyond its founding stage.",
        },
      ],
    },
    how: {
      kicker: "How It Works",
      title: "The journey, simplified",
      rows: [
        {
          marker: "diamond",
          title: "Introspective Onboarding",
          body: "A guided, reflective experience that begins mapping your inner world.",
        },
        {
          marker: "diamond-small",
          title: "Initial IBP Construction",
          body: "Your first Inner Blueprint Profile -- the foundation of your self-knowledge journey.",
        },
        {
          marker: "triangle",
          title: "Actionable Insights",
          body: "Clear, precise observations about your patterns, energy, and internal dynamics.",
        },
        {
          marker: "circle",
          title: "Guided Micro-Reflections",
          body: "Short, focused reflection prompts that deepen your self-awareness over time.",
        },
        {
          marker: "square",
          title: "Progressive Evolution",
          body: "Your profile grows and refines itself -- revealing deeper layers as you engage.",
        },
      ],
    },
    form: {
      kicker: "Apply",
      title: "Apply to Innera",
      intro: "Complete the form to request access to the Founding Circle.",
      fields: {
        email: "Email",
        stop: "What made you stop scrolling?",
        unclear: "What feels unclear in your inner world right now?",
        depth: "How deep are you willing to go?",
        depthOptions: {
          curiosity: "Curiosity",
          commitment: "Commitment",
          transformation: "Transformation",
        },
      },
      submit: "Apply as a Founding Tester",
      submitting: "Submitting",
      success: "Request received. We will contact you soon.",
      error: "We could not save your request. Please try again.",
    },
    emailInvalid: "Please enter a valid email address.",
    footer: "INNERA by TheInnerCode",
  },
};

const whatIsColors = ["var(--sandy)", "var(--coral)", "var(--teal)"];
const earlyColors = ["var(--sandy)", "var(--coral)", "var(--emerald)", "var(--blue)"];
const timelineColors = [
  "var(--sandy)",
  "var(--coral)",
  "var(--teal)",
  "var(--lavender)",
  "var(--emerald)",
];

const PAGE_META = {
  title: "Innera | Perfil de Blueprint Interno",
  description:
    "Innera te ayuda a entender tus patrones internos con un sistema guiado, progresivo y accionable para profundizar tu autoconciencia.",
  keywords: [
    "Innera",
    "The Inner Code",
    "autoconciencia",
    "perfil interno",
    "blueprint interno",
    "bienestar digital",
  ].join(", "),
  ogTitle: "Innera | Perfil de Blueprint Interno",
  ogDescription:
    "Solicita acceso a Innera y explora una experiencia de autoconocimiento guiada con tecnología y claridad práctica.",
  twitterTitle: "Innera | Perfil de Blueprint Interno",
  twitterDescription:
    "Solicita acceso a Innera y explora una experiencia de autoconocimiento guiada con tecnología y claridad práctica.",
};

const upsertMeta = (attr, key, content) => {
  if (!content) return;
  const selector = `meta[${attr}="${key}"]`;
  let element = document.head.querySelector(selector);

  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attr, key);
    document.head.appendChild(element);
  }

  element.setAttribute("content", content);
};

const upsertLink = (rel, href) => {
  if (!href) return;
  const selector = `link[rel="${rel}"]`;
  let element = document.head.querySelector(selector);

  if (!element) {
    element = document.createElement("link");
    element.setAttribute("rel", rel);
    document.head.appendChild(element);
  }

  element.setAttribute("href", href);
};

function useInneraSeo(siteUrl) {
  const softwareJsonLd = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "Innera",
      applicationCategory: "HealthApplication",
      operatingSystem: "Web",
      inLanguage: ["es", "en"],
      description:
        "Innera revela patrones internos de pensamiento, energía y decisiones para desarrollar autoconciencia aplicada.",
      url: `${siteUrl}/innera`,
      publisher: {
        "@type": "Organization",
        name: "The Inner Code",
        url: siteUrl,
      },
    }),
    [siteUrl]
  );

  useEffect(() => {
    document.title = PAGE_META.title;

    upsertMeta("name", "description", PAGE_META.description);
    upsertMeta("name", "keywords", PAGE_META.keywords);
    upsertMeta("name", "robots", "index, follow");

    upsertMeta("property", "og:type", "website");
    upsertMeta("property", "og:url", `${siteUrl}/innera`);
    upsertMeta("property", "og:title", PAGE_META.ogTitle);
    upsertMeta("property", "og:description", PAGE_META.ogDescription);
    upsertMeta("property", "og:site_name", "The Inner Code");
    upsertMeta("property", "og:image", `${siteUrl}/logo_innera_head.webp`);
    upsertMeta("property", "og:image:alt", "Innera by The Inner Code");

    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", PAGE_META.twitterTitle);
    upsertMeta("name", "twitter:description", PAGE_META.twitterDescription);
    upsertMeta("name", "twitter:image", `${siteUrl}/logo_innera_head.webp`);

    upsertLink("canonical", `${siteUrl}/innera`);
    upsertLink("icon", "/icono2.ico?v=2");
    upsertLink("shortcut icon", "/icono2.ico?v=2");
    upsertLink("apple-touch-icon", "/icono2.png?v=2");

    const scriptId = "innera-software-jsonld";
    let script = document.getElementById(scriptId);

    if (!script) {
      script = document.createElement("script");
      script.setAttribute("type", "application/ld+json");
      script.setAttribute("id", scriptId);
      document.head.appendChild(script);
    }

    script.textContent = JSON.stringify(softwareJsonLd);
  }, [siteUrl, softwareJsonLd]);
}

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

export default function App() {
  useInneraSeo(SITE_URL);

  const { locale } = useLanguage();
  const t = copy[locale] ?? copy.en;

  const [status, setStatus] = useState("idle");
  const [form, setForm] = useState({
    email: "",
    stop: "",
    unclear: "",
    depth: "curiosity",
  });
  const [isScrolled, setIsScrolled] = useState(false);

  const emailInvalid = form.email.trim().length > 0 && !EMAIL_REGEX.test(form.email.trim());
  const canSubmit =
    form.email.trim().length > 0 && EMAIL_REGEX.test(form.email.trim()) && form.depth.length > 0;

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
      const response = await fetch(WAITLIST_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email.trim(),
          stopReason: form.stop.trim(),
          unclear: form.unclear.trim(),
          depth: form.depth,
          locale,
        }),
      });

      if (!response.ok) {
        setStatus("error");
        return;
      }

      setStatus("success");
      setForm({
        email: "",
        stop: "",
        unclear: "",
        depth: "curiosity",
      });
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="landing">
      <header className={`landing-header ${isScrolled ? "is-scrolled" : ""}`}>
        <div className="container header-inner">
          <img src="/logo_innera_text.webp" alt="Innera" className="innera-logo" />
          <a href="#apply-form" className="hover-palette nav-apply">
            {t.nav}
          </a>
        </div>
      </header>

      <main className="container landing-main">
        <section className="section-reveal section-reveal-1 hero-section">
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
                <h3 className="what-label" style={{ color: whatIsColors[index % whatIsColors.length] }}>
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
