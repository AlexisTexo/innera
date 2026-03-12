import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { serializeContentForHtml } from "../src/content/index.js";
import { buildSeoHeadTags, resolveSiteUrl } from "../src/seo.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const distDir = path.resolve(projectRoot, "dist");
const ssrOutDir = path.resolve(projectRoot, "dist-ssr");
const templatePath = path.resolve(distDir, "index.html");

const routes = ["/", "/es/"];
const SEO_BLOCK_PATTERN = /<!--innera-prerender-seo:start-->[\s\S]*?<!--innera-prerender-seo:end-->/i;
const ROOT_BLOCK_PATTERN = /<div id="root">[\s\S]*?<\/div>\s*<\/body>/i;
const I18N_SCRIPT_PATTERN = /<script id="innera-i18n" type="application\/json">[\s\S]*?<\/script>\s*/i;

const toOutputPath = (route) =>
  route === "/" ? path.resolve(distDir, "index.html") : path.resolve(distDir, route.slice(1), "index.html");

const getPrerenderHtml = (template, appHtml, headTags, locale, content) => {
  let html = template.replace(/<html lang="[^"]*">/i, `<html lang="${locale}">`);

  html = html.replace(SEO_BLOCK_PATTERN, "");
  html = html.replace(I18N_SCRIPT_PATTERN, "");
  html = html.replace(/<title>[\s\S]*?<\/title>/i, "");
  html = html.replace(
    "</head>",
    `    <!--innera-prerender-seo:start-->\n    ${headTags}\n    <!--innera-prerender-seo:end-->\n  </head>`
  );

  if (!ROOT_BLOCK_PATTERN.test(html)) {
    throw new Error("No se pudo ubicar el contenedor #root en el template de prerender.");
  }
  html = html.replace(
    ROOT_BLOCK_PATTERN,
    `<div id="root">${appHtml}</div>\n  <script id="innera-i18n" type="application/json">${serializeContentForHtml(content)}</script>\n  </body>`
  );

  return html;
};

const template = await fs.readFile(templatePath, "utf-8");
const ssrEntryPath = path.resolve(ssrOutDir, "entry-server.js");
const ssrModule = await import(pathToFileURL(ssrEntryPath).href);
const siteUrl = resolveSiteUrl(process.env.VITE_SITE_URL);

for (const route of routes) {
  const { appHtml, content, locale } = await ssrModule.render(route);
  const headTags = buildSeoHeadTags(siteUrl, locale);
  const prerendered = getPrerenderHtml(template, appHtml, headTags, locale, content);
  const outputPath = toOutputPath(route);

  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, prerendered, "utf-8");
}

await fs.rm(ssrOutDir, { recursive: true, force: true });
