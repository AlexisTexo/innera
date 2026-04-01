export const DEFAULT_LOCALE = "en";
export const SUPPORTED_LOCALES = ["en", "es"];

export const LOCALE_PATHS = {
  en: "/innera",
  es: "/innera/es",
};

export const OG_LOCALES = {
  en: "en_US",
  es: "es_MX",
};

export const SEO_META = {
  en: {
    title: "INNERA | Inner Blueprint Profile — Precision Self-Awareness System",
    description:
      "Understand how you think, react, and decide with INNERA, a precision self-awareness system powered by your Inner Blueprint Profile. Apply for early access.",
    keywords: [
      "INNERA",
      "Inner Blueprint Profile",
      "self-awareness system",
      "precision self-awareness",
      "AI self-discovery",
      "behavior patterns",
    ].join(", "),
    ogTitle: "INNERA | Inner Blueprint Profile — Precision Self-Awareness System",
    ogDescription:
      "Understand how you think, react, and decide with INNERA, a precision self-awareness system built around your Inner Blueprint Profile.",
    twitterTitle: "INNERA | Inner Blueprint Profile — Precision Self-Awareness System",
    twitterDescription:
      "Understand how you think, react, and decide with INNERA, a precision self-awareness system built around your Inner Blueprint Profile.",
  },
  es: {
    title: "INNERA — Sistema de Autoconocimiento de Precisión | Inner Blueprint Profile",
    description:
      "Entiende como piensas, reaccionas y decides con INNERA, un sistema de autoconocimiento de precision impulsado por tu Inner Blueprint Profile.",
    keywords: [
      "INNERA",
      "Inner Blueprint Profile",
      "autoconocimiento",
      "sistema de autoconocimiento",
      "patrones internos",
      "autoconciencia",
    ].join(", "),
    ogTitle: "INNERA — Sistema de Autoconocimiento de Precisión | Inner Blueprint Profile",
    ogDescription:
      "Descubre como piensas, reaccionas y decides con INNERA, un sistema de autoconocimiento de precision impulsado por IA.",
    twitterTitle: "INNERA — Sistema de Autoconocimiento de Precisión | Inner Blueprint Profile",
    twitterDescription:
      "Descubre como piensas, reaccionas y decides con INNERA, un sistema de autoconocimiento de precision impulsado por IA.",
  },
};

export const SOCIAL_IMAGE = {
  path: "/og-innera-1200x630.png",
  width: "1200",
  height: "630",
  type: "image/png",
  alt: "INNERA, precision self-awareness through your Inner Blueprint Profile",
};

export const normalizePath = (value) => {
  if (!value || value === "/") return "/";
  if (value.endsWith("/index.html")) {
    const trimmed = value.slice(0, -"/index.html".length);
    return trimmed || "/";
  }
  return value.replace(/\/+$/, "") || "/";
};

export const buildLocalePath = (locale) => LOCALE_PATHS[locale] ?? LOCALE_PATHS[DEFAULT_LOCALE];

export const getAlternateLocale = (locale) => (locale === "es" ? "en" : "es");

export const getLocaleFromPath = (pathname) => {
  const path = normalizePath(pathname);

  if (path === LOCALE_PATHS.es || path.startsWith(`${LOCALE_PATHS.es}/`)) {
    return "es";
  }

  if (path === "/" || path === LOCALE_PATHS.en || path.startsWith(`${LOCALE_PATHS.en}/`)) {
    return "en";
  }

  return DEFAULT_LOCALE;
};

export const ANALYTICS_PATH = "/analytics";

export const isAnalyticsPath = (pathname) => normalizePath(pathname) === ANALYTICS_PATH;

export const isValidAppPath = (pathname, options = {}) => {
  const path = normalizePath(pathname);
  if (options.includeRoot && path === "/") return true;
  if (path === ANALYTICS_PATH) return true;
  return path === LOCALE_PATHS.en || path === LOCALE_PATHS.es;
};

export const getLocaleUrl = (siteUrl, locale) => new URL(buildLocalePath(locale), siteUrl).toString();

export const getHrefLangEntries = (siteUrl) => [
  { hrefLang: "en", href: getLocaleUrl(siteUrl, "en") },
  { hrefLang: "es", href: getLocaleUrl(siteUrl, "es") },
  { hrefLang: "x-default", href: getLocaleUrl(siteUrl, DEFAULT_LOCALE) },
];
