import { renderToString } from "react-dom/server";
import App from "./App.jsx";
import { loadContentForLocale } from "./content";
import { getLocaleFromPath } from "./locale";

export async function render(url = "/") {
  const forcedLocale = getLocaleFromPath(url);
  const content = await loadContentForLocale(forcedLocale);
  const appHtml = renderToString(<App forcedLocale={forcedLocale} dictionary={content} />);

  return {
    appHtml,
    content,
    locale: forcedLocale,
  };
}
