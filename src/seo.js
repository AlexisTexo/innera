import { getPathForLocale, normalizeLocale } from "./locale.js";

export const FALLBACK_SITE_URL = "https://innera.theinnercode.net";

export const PAGE_META_BY_LOCALE = {
  en: {
    title: "INNERA — The First Inner-World Mapping System | The InnerCode Co.",
    description:
      "You're not lost. You're miscalibrated. INNERA is the first mapping system for your inner world. Grounded in Jung, Porges & Deci-Ryan. Closed beta — 300 spots available.",
    keywords: [
      "INNERA",
      "Inner Blueprint Profile",
      "inner world mapping",
      "self-awareness system",
      "behavior patterns",
      "The Inner Code",
      "AI self-discovery",
      "Jung",
      "Porges",
      "Deci-Ryan",
    ].join(", "),
    ogTitle: "INNERA — You're Not Lost. You're Miscalibrated.",
    ogDescription:
      "The first mapping system for your inner world. Grounded in Jung, Porges & Deci-Ryan. Closed beta — 300 spots available.",
    twitterTitle: "INNERA — You're Not Lost. You're Miscalibrated.",
    twitterDescription:
      "The first mapping system for your inner world. Grounded in Jung, Porges & Deci-Ryan. Request beta access.",
  },
  es: {
    title: "INNERA — El Primer Sistema de Mapeo del Mundo Interior | The InnerCode Co.",
    description:
      "No estás perdido. Estás descalibrado. INNERA es el primer sistema de mapeo del mundo interior. Basado en Jung, Porges y Deci-Ryan. Beta cerrada — 300 lugares disponibles.",
    keywords: [
      "INNERA",
      "mapeo del mundo interior",
      "autoconocimiento de precisión",
      "patrones internos",
      "The Inner Code",
      "conciencia aplicada",
      "Jung",
      "Porges",
      "Deci-Ryan",
    ].join(", "),
    ogTitle: "INNERA — No Estás Perdido. Estás Descalibrado.",
    ogDescription:
      "El primer sistema de mapeo del mundo interior. Basado en Jung, Porges y Deci-Ryan. Beta cerrada — 300 lugares disponibles.",
    twitterTitle: "INNERA — No Estás Perdido. Estás Descalibrado.",
    twitterDescription:
      "El primer sistema de mapeo del mundo interior. Basado en Jung, Porges y Deci-Ryan. Solicita acceso beta.",
  },
};

const toAbsoluteUrl = (siteUrl, path) => {
  const origin = siteUrl.endsWith("/") ? siteUrl.slice(0, -1) : siteUrl;
  return `${origin}${path}`;
};

const escapeAttribute = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");

const escapeJsonLd = (value) =>
  String(value).replaceAll("<", "\\u003c").replaceAll("-->", "--\\>");

export const resolveSiteUrl = (value = FALLBACK_SITE_URL) => {
  const raw = value ?? FALLBACK_SITE_URL;
  try {
    return new URL(raw).origin;
  } catch {
    return FALLBACK_SITE_URL;
  }
};

export const getSeoPayload = (siteUrl, locale) => {
  const normalizedLocale = normalizeLocale(locale);
  const path = getPathForLocale(normalizedLocale);
  const localized = PAGE_META_BY_LOCALE[normalizedLocale];

  const canonicalUrl = toAbsoluteUrl(siteUrl, path);
  const englishUrl = toAbsoluteUrl(siteUrl, "/");
  const spanishUrl = toAbsoluteUrl(siteUrl, "/es/");
  const imageUrl = toAbsoluteUrl(siteUrl, "/og-innera-1200x630.png");

  return {
    ...localized,
    locale: normalizedLocale,
    htmlLang: normalizedLocale,
    canonicalUrl,
    ogUrl: canonicalUrl,
    ogLocale: normalizedLocale === "es" ? "es_MX" : "en_US",
    imageUrl,
    alternates: [
      { hreflang: "en-US", href: englishUrl },
      { hreflang: "es", href: spanishUrl },
      { hreflang: "x-default", href: englishUrl },
    ],
    softwareJsonLd: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "INNERA",
      applicationCategory: "HealthApplication",
      operatingSystem: "Web",
      inLanguage: normalizedLocale === "es" ? "es" : "en",
      description: localized.description,
      url: canonicalUrl,
      publisher: {
        "@type": "Organization",
        name: "The Inner Code",
        url: siteUrl,
      },
    },
  };
};

export const buildSeoHeadTags = (siteUrl, locale) => {
  const seo = getSeoPayload(siteUrl, locale);
  const tags = [
    `<title>${escapeAttribute(seo.title)}</title>`,
    `<meta name="description" content="${escapeAttribute(seo.description)}" />`,
    `<meta name="keywords" content="${escapeAttribute(seo.keywords)}" />`,
    '<meta name="robots" content="index, follow" />',
    '<meta property="og:type" content="website" />',
    `<meta property="og:url" content="${escapeAttribute(seo.ogUrl)}" />`,
    `<meta property="og:title" content="${escapeAttribute(seo.ogTitle)}" />`,
    `<meta property="og:description" content="${escapeAttribute(seo.ogDescription)}" />`,
    '<meta property="og:site_name" content="The Inner Code" />',
    `<meta property="og:locale" content="${escapeAttribute(seo.ogLocale)}" />`,
    `<meta property="og:image" content="${escapeAttribute(seo.imageUrl)}" />`,
    '<meta property="og:image:type" content="image/png" />',
    '<meta property="og:image:width" content="1200" />',
    '<meta property="og:image:height" content="630" />',
    '<meta property="og:image:alt" content="Innera by The Inner Code" />',
    '<meta name="twitter:card" content="summary_large_image" />',
    `<meta name="twitter:title" content="${escapeAttribute(seo.twitterTitle)}" />`,
    `<meta name="twitter:description" content="${escapeAttribute(seo.twitterDescription)}" />`,
    `<meta name="twitter:image" content="${escapeAttribute(seo.imageUrl)}" />`,
    `<link rel="canonical" href="${escapeAttribute(seo.canonicalUrl)}" />`,
    ...seo.alternates.map(
      (alternate) =>
        `<link rel="alternate" hreflang="${escapeAttribute(alternate.hreflang)}" href="${escapeAttribute(alternate.href)}" />`
    ),
    `<script type="application/ld+json">${escapeJsonLd(JSON.stringify(seo.softwareJsonLd))}</script>`,
  ];

  return tags.join("\n    ");
};
