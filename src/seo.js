import { getPathForLocale, normalizeLocale } from "./locale.js";

export const FALLBACK_SITE_URL = "https://innera.theinnercode.net";

export const PAGE_META_BY_LOCALE = {
  en: {
    title: "INNERA — Sistema de Autoconocimiento de Precisión | Inner Blueprint Profile",
    description:
      "INNERA is the first inner-world mapping system. The Inner Blueprint Profile (IBP) combines Jungian psychology, neuroscience, and AI to generate your real-time internal operating profile. iOS. For founders and executives. Open waitlist.",
    keywords: [
      "INNERA",
      "Inner Blueprint Profile",
      "self-awareness system",
      "behavior patterns",
      "The Inner Code",
      "AI self-discovery",
    ].join(", "),
    ogTitle: "INNERA — Sistema de Autoconocimiento de Precisión | Inner Blueprint Profile",
    ogDescription:
      "INNERA is the first inner-world mapping system. IBP combines Jungian psychology, neuroscience, and AI to generate your real-time internal operating profile.",
    twitterTitle: "INNERA — Sistema de Autoconocimiento de Precisión | Inner Blueprint Profile",
    twitterDescription:
      "INNERA is the first inner-world mapping system. IBP combines Jungian psychology, neuroscience, and AI.",
  },
  es: {
    title: "INNERA | Sistema de Autoconocimiento de Precisión para tu Mundo Interno",
    description:
      "INNERA es el primer sistema de mapeo del mundo interior. El Inner Blueprint Profile (IBP) integra psicología junguiana, neurociencia e IA para generar tu perfil de funcionamiento interior en tiempo real. iOS. Para fundadores y ejecutivos. Lista de espera abierta.",
    keywords: [
      "INNERA",
      "autoconocimiento de precisión",
      "patrones internos",
      "perfil interno",
      "The Inner Code",
      "conciencia aplicada",
    ].join(", "),
    ogTitle: "INNERA | Sistema de Autoconocimiento de Precisión",
    ogDescription:
      "INNERA es el primer sistema de mapeo del mundo interior. El IBP integra psicología junguiana, neurociencia e IA en tiempo real.",
    twitterTitle: "INNERA | Sistema de Autoconocimiento de Precisión",
    twitterDescription:
      "INNERA integra psicología junguiana, neurociencia e IA para mapear tu funcionamiento interior.",
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
