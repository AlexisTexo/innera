import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import NotFoundPage from "./NotFoundPage.jsx";
import AnalyticsPage from "./AnalyticsPage.jsx";
import { isValidAppPath, isAnalyticsPath, normalizePath } from "./site-config";

const currentPath = normalizePath(window.location.pathname);

let RootComponent;
if (isAnalyticsPath(currentPath)) {
  RootComponent = AnalyticsPage;
} else if (isValidAppPath(currentPath, { includeRoot: import.meta.env.DEV })) {
  RootComponent = App;
} else {
  RootComponent = NotFoundPage;
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RootComponent />
  </StrictMode>,
)
