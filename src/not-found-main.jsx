import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./App.css";
import "./not-found.css";
import NotFoundPage from "./NotFoundPage";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element #root was not found.");
}

createRoot(rootElement).render(
  <StrictMode>
    <NotFoundPage />
  </StrictMode>
);

const scheduleAnalyticsImport = () => {
  import("./analytics")
    .then(({ loadAnalytics }) => {
      loadAnalytics();
    })
    .catch(() => {
      // Ignore analytics loading errors to avoid impacting core UX.
    });
};

if (typeof window.requestIdleCallback === "function") {
  window.requestIdleCallback(scheduleAnalyticsImport, { timeout: 3500 });
} else {
  window.setTimeout(scheduleAnalyticsImport, 1200);
}
