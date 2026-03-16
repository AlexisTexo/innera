import { renderToString } from "react-dom/server";
import App from "./App.jsx";

export function render(locale = "en") {
  return {
    html: renderToString(<App forcedLocale={locale} />),
  };
}
