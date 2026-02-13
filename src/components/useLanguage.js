import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "tic_locale";

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
  if (candidates.length === 0) return "en";

  for (const tag of candidates) {
    if (tag.startsWith("es")) return "es";
  }

  for (const tag of candidates) {
    const region = extractRegion(tag);
    if (!region) continue;
    if (region === "419") return "es";
    if (SPANISH_AND_LATAM_COUNTRIES.has(region)) return "es";
  }

  return "en";
};

export default function useLanguage() {
  const [locale, setLocale] = useState("en");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const frameId = window.requestAnimationFrame(() => {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      const nextLocale = stored ? normalizeLocale(stored) : detectLocale();

      setLocale(nextLocale);

      if (!stored) {
        window.localStorage.setItem(STORAGE_KEY, nextLocale);
      }
    });

    return () => window.cancelAnimationFrame(frameId);
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = locale;
    }
  }, [locale]);

  const toggleLocale = useCallback(() => {
    setLocale((prev) => {
      const next = prev === "es" ? "en" : "es";
      if (typeof window !== "undefined") {
        window.localStorage.setItem(STORAGE_KEY, next);
      }
      return next;
    });
  }, []);

  return { locale, toggleLocale };
}
