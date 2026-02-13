import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "tic_locale";
const AUTO_CACHE_TTL_MS = 1000 * 60 * 60 * 24 * 30;
const MANUAL_CACHE_TTL_MS = 1000 * 60 * 60 * 24 * 365;

const SPANISH_AND_LATAM_COUNTRIES = new Set([
  "AR",
  "BO",
  "BR",
  "CL",
  "CO",
  "CR",
  "CU",
  "DO",
  "EC",
  "ES",
  "GT",
  "HN",
  "MX",
  "NI",
  "PA",
  "PE",
  "PR",
  "PY",
  "SV",
  "UY",
  "VE",
  "GQ",
]);

const normalizeLocale = (value) => (value === "en" ? "en" : "es");

const extractRegion = (languageTag) => {
  const parts = languageTag.replaceAll("_", "-").split("-");
  for (const part of parts.slice(1)) {
    const candidate = part.toUpperCase();
    if (/^[A-Z]{2}$/.test(candidate) || /^\d{3}$/.test(candidate)) {
      return candidate;
    }
  }
  return null;
};

const getLanguageCandidates = () => {
  if (typeof navigator === "undefined") return [];

  const candidates = new Set();
  const languages = navigator.languages?.length ? navigator.languages : [navigator.language];

  for (const lang of languages) {
    if (lang) candidates.add(lang.toLowerCase());
  }

  if (navigator.language) {
    candidates.add(navigator.language.toLowerCase());
  }

  const intlLocale = Intl.DateTimeFormat().resolvedOptions().locale;
  if (intlLocale) {
    candidates.add(intlLocale.toLowerCase());
  }

  return [...candidates];
};

const detectLocale = () => {
  const candidates = getLanguageCandidates();
  if (candidates.length === 0) {
    return { locale: "en", region: null };
  }

  for (const tag of candidates) {
    if (tag.startsWith("es")) {
      return { locale: "es", region: extractRegion(tag) };
    }
  }

  for (const tag of candidates) {
    const region = extractRegion(tag);
    if (!region) continue;
    if (region === "419") {
      return { locale: "es", region };
    }
    if (SPANISH_AND_LATAM_COUNTRIES.has(region)) {
      return { locale: "es", region };
    }
  }

  return { locale: "en", region: extractRegion(candidates[0]) };
};

const parseLocaleCache = (rawValue) => {
  if (!rawValue) return null;

  try {
    const parsed = JSON.parse(rawValue);

    if (!parsed || typeof parsed !== "object") return null;
    if (parsed.locale !== "en" && parsed.locale !== "es") return null;

    const expiresAt = Number(parsed.expiresAt);
    if (Number.isFinite(expiresAt) && Date.now() > expiresAt) {
      return { expired: true };
    }

    return {
      locale: normalizeLocale(parsed.locale),
      region: typeof parsed.region === "string" ? parsed.region : null,
    };
  } catch {
    if (rawValue === "en" || rawValue === "es") {
      return { locale: normalizeLocale(rawValue), region: null };
    }
    return null;
  }
};

const readLocaleCache = () => {
  if (typeof window === "undefined") return null;

  const cached = parseLocaleCache(window.localStorage.getItem(STORAGE_KEY));
  if (!cached) return null;

  if (cached.expired) {
    window.localStorage.removeItem(STORAGE_KEY);
    return null;
  }

  return cached;
};

const writeLocaleCache = (locale, region, source = "auto") => {
  if (typeof window === "undefined") return;

  const now = Date.now();
  const ttl = source === "manual" ? MANUAL_CACHE_TTL_MS : AUTO_CACHE_TTL_MS;

  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      locale: normalizeLocale(locale),
      region: typeof region === "string" ? region : null,
      source,
      updatedAt: now,
      expiresAt: now + ttl,
    })
  );
};

const resolveInitialLocale = () => {
  const cached = readLocaleCache();
  if (cached?.locale) {
    if (typeof document !== "undefined") {
      document.documentElement.lang = cached.locale;
    }
    return cached.locale;
  }

  const detected = detectLocale();
  writeLocaleCache(detected.locale, detected.region, "auto");

  if (typeof document !== "undefined") {
    document.documentElement.lang = detected.locale;
  }

  return detected.locale;
};

export default function useLanguage() {
  const [locale, setLocale] = useState(() => resolveInitialLocale());

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = locale;
    }
  }, [locale]);

  const toggleLocale = useCallback(() => {
    setLocale((prev) => {
      const next = prev === "es" ? "en" : "es";
      writeLocaleCache(next, null, "manual");
      return next;
    });
  }, []);

  return { locale, toggleLocale };
}
