export const DEFAULT_LOCALE = "en";

export const normalizeLocale = (value) => (value === "es" ? "es" : DEFAULT_LOCALE);

const normalizePathname = (pathname = "/") => {
  const collapsed = String(pathname || "/").replace(/\/{2,}/g, "/");
  if (collapsed === "/") return "/";
  return collapsed.endsWith("/") ? collapsed.slice(0, -1) : collapsed;
};

export const getLocaleFromPath = (pathname = "/") =>
  /^\/es(?:\/|$)/i.test(pathname) ? "es" : DEFAULT_LOCALE;

export const getPathForLocale = (locale) => (normalizeLocale(locale) === "es" ? "/es/" : "/");

export const isLandingRoutePath = (pathname = "/") => {
  const normalized = normalizePathname(pathname).toLowerCase();

  return (
    normalized === "/" ||
    normalized === "/es" ||
    normalized === "/index.html" ||
    normalized === "/es/index.html"
  );
};
