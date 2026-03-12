import { useEffect, useMemo } from "react";
import { getLocaleFromPath, getPathForLocale, normalizeLocale } from "../locale";

const buildLocalizedUrl = (locale) =>
  `${getPathForLocale(locale)}${window.location.search}${window.location.hash}`;

export default function useLanguage(forcedLocale) {
  const locale = useMemo(() => {
    if (forcedLocale) {
      return normalizeLocale(forcedLocale);
    }

    if (typeof window === "undefined") {
      return "en";
    }

    return getLocaleFromPath(window.location.pathname);
  }, [forcedLocale]);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = locale;
    }
  }, [locale]);

  const toggleLocale = () => {
    if (typeof window === "undefined") return;

    const nextLocale = locale === "es" ? "en" : "es";
    const url = buildLocalizedUrl(nextLocale);
    window.location.assign(url);
  };

  return { locale, toggleLocale };
}
