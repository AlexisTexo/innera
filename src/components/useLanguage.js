import { useCallback, useEffect, useMemo, useState } from "react";
import {
  buildLocalePath,
  DEFAULT_LOCALE,
  getAlternateLocale,
  getLocaleFromPath,
} from "../site-config";

const getCurrentLocationParts = () => {
  if (typeof window === "undefined") {
    return { search: "", hash: "" };
  }

  return {
    search: window.location.search,
    hash: window.location.hash,
  };
};

export default function useLanguage(forcedLocale) {
  const [locale, setLocale] = useState(() => {
    if (forcedLocale) return forcedLocale;
    if (typeof window === "undefined") return DEFAULT_LOCALE;
    return getLocaleFromPath(window.location.pathname);
  });

  useEffect(() => {
    if (!forcedLocale || locale === forcedLocale) return;
    setLocale(forcedLocale);
  }, [forcedLocale, locale]);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = locale;
    }
  }, [locale]);

  useEffect(() => {
    if (typeof window === "undefined" || forcedLocale) return undefined;

    const syncLocaleFromPath = () => {
      setLocale(getLocaleFromPath(window.location.pathname));
    };

    window.addEventListener("popstate", syncLocaleFromPath);
    return () => window.removeEventListener("popstate", syncLocaleFromPath);
  }, [forcedLocale]);

  const alternateLocale = getAlternateLocale(locale);
  const alternateHref = useMemo(() => {
    const targetPath = buildLocalePath(alternateLocale);
    const { search, hash } = getCurrentLocationParts();
    return `${targetPath}${search}${hash}`;
  }, [alternateLocale]);

  const toggleLocale = useCallback(() => {
    if (typeof window === "undefined") return;
    window.location.assign(alternateHref);
  }, [alternateHref]);

  return { locale, alternateLocale, alternateHref, toggleLocale };
}
