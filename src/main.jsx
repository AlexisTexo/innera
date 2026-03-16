import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import NotFoundPage from "./NotFoundPage.jsx";
import { isValidAppPath, normalizePath } from "./site-config";

const currentPath = normalizePath(window.location.pathname);
const RootComponent = isValidAppPath(currentPath, { includeRoot: import.meta.env.DEV })
  ? App
  : NotFoundPage;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RootComponent />
  </StrictMode>,
)
