import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const rootDir = dirname(fileURLToPath(import.meta.url));

// https://vite.dev/config/
export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react()],
  build: {
    target: "es2020",
    rollupOptions: {
      input: !isSsrBuild
        ? {
            main: resolve(rootDir, "index.html"),
            notFound: resolve(rootDir, "404.html"),
          }
        : undefined,
      output: !isSsrBuild
        ? {
            manualChunks: {
              "react-vendor": ["react", "react-dom", "react-dom/client"],
            },
          }
        : undefined,
    },
  },
}));
