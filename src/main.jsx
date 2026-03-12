import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import "./index.css";
import "./App.css";
import "./not-found.css";
import App from "./App.jsx";
import NotFoundPage from "./NotFoundPage";
import enContent from "./content/en.js";
import { loadContentForLocale, readBootstrappedContent } from "./content";
import { getLocaleFromPath, isLandingRoutePath } from "./locale";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element #root was not found.");
}

const forcedLocale = getLocaleFromPath(window.location.pathname);
const isLandingRoute = isLandingRoutePath(window.location.pathname);

const renderAppTree = (tree, shouldHydrate = true) => {
  if (shouldHydrate && rootElement.hasChildNodes()) {
    hydrateRoot(rootElement, tree);
  } else {
    createRoot(rootElement).render(tree);
  }
};

const mountApp = async () => {
  if (!isLandingRoute) {
    // Avoid hydration mismatch when server rewrites unknown paths to index.html.
    rootElement.innerHTML = "";
    renderAppTree(
      <StrictMode>
        <NotFoundPage />
      </StrictMode>,
      false
    );
    return;
  }

  let content = readBootstrappedContent();

  if (!content) {
    try {
      content = await loadContentForLocale(forcedLocale);
    } catch (error) {
      // Keep the page functional even if locale module loading fails.
      console.error("Failed to load locale content. Falling back to English.", error);
      content = enContent;
    }
  }

  const appTree = (
    <StrictMode>
      <App forcedLocale={forcedLocale} dictionary={content} />
    </StrictMode>
  );

  renderAppTree(appTree, true);
};

const scheduleAnalyticsImport = () => {
  import("./analytics")
    .then(({ loadAnalytics }) => {
      loadAnalytics();
    })
    .catch(() => {
      // Ignore analytics loading errors to avoid impacting core UX.
    });
};

void mountApp();

if (typeof window.requestIdleCallback === "function") {
  window.requestIdleCallback(scheduleAnalyticsImport, { timeout: 3500 });
} else {
  window.setTimeout(scheduleAnalyticsImport, 1200);
}
