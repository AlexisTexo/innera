import { normalizeLocale } from "../locale.js";

const CONTENT_LOADERS = {
  en: () => import("./en.js"),
  es: () => import("./es.js"),
};

export const loadContentForLocale = async (locale) => {
  const normalized = normalizeLocale(locale);
  const module = await CONTENT_LOADERS[normalized]();
  return module.default;
};

export const readBootstrappedContent = () => {
  if (typeof document === "undefined") return null;

  const script = document.getElementById("innera-i18n");
  if (!script || !script.textContent) return null;

  try {
    return JSON.parse(script.textContent);
  } catch {
    return null;
  }
};

export const serializeContentForHtml = (content) =>
  JSON.stringify(content).replaceAll("<", "\\u003c");
