import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import {
  DEFAULT_LOCALE,
  getAlternateLocale,
  getHrefLangEntries,
  getLocaleUrl,
  LOCALE_PATHS,
  OG_LOCALES,
  SEO_META,
  SUPPORTED_LOCALES,
} from "../src/site-config.js";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const distDir = path.join(rootDir, "dist");
const templatePath = path.join(distDir, "index.html");
const serverEntryPath = path.join(distDir, "server", "entry-server.js");

const template = await readFile(templatePath, "utf8");
const { render } = await import(pathToFileURL(serverEntryPath).href);

const replaceHtmlLang = (html, locale) => html.replace(/<html lang="[^"]*">/, `<html lang="${locale}">`);

const replaceTitle = (html, title) => html.replace(/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`);

const replaceMetaContent = (html, attr, key, content) =>
  html.replace(
    new RegExp(`(<meta[^>]+${attr}="${key}"[^>]+content=")([^"]*)(")`, "i"),
    `$1${content}$3`
  );

const replaceLinkHref = (html, rel, href) =>
  html.replace(
    new RegExp(`(<link[^>]+rel="${rel}"[^>]+href=")([^"]*)(")`, "i"),
    `$1${href}$3`
  );

const replaceAlternateHref = (html, hreflang, href) =>
  html.replace(
    new RegExp(`(<link[^>]+rel="alternate"[^>]+hreflang="${hreflang}"[^>]+href=")([^"]*)(")`, "i"),
    `$1${href}$3`
  );

const injectRenderedHtml = (html, appHtml, preloadLinks) => {
  const templateWithPreloads = preloadLinks ? html.replace("</head>", `${preloadLinks}</head>`) : html;
  return templateWithPreloads.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);
};

const createRedirectPage = (destination, canonicalUrl) => `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="refresh" content="0; url=${destination}" />
    <link rel="canonical" href="${canonicalUrl}" />
    <title>Redirecting to INNERA</title>
    <script>
      window.location.replace("${destination}" + window.location.search + window.location.hash);
    </script>
  </head>
  <body>
    <p>Redirecting to <a href="${destination}">${destination}</a>...</p>
  </body>
</html>
`;

const buildLocalizedHead = (html, locale) => {
  const activeMeta = SEO_META[locale] ?? SEO_META[DEFAULT_LOCALE];
  const canonicalUrl = getLocaleUrl("https://innera.theinnercode.net", locale);
  const alternateLocale = getAlternateLocale(locale);

  let nextHtml = html;
  nextHtml = replaceHtmlLang(nextHtml, locale);
  nextHtml = replaceTitle(nextHtml, activeMeta.title);
  nextHtml = replaceMetaContent(nextHtml, "name", "description", activeMeta.description);
  nextHtml = replaceLinkHref(nextHtml, "canonical", canonicalUrl);
  nextHtml = replaceMetaContent(nextHtml, "property", "og:locale", OG_LOCALES[locale]);
  nextHtml = replaceMetaContent(nextHtml, "property", "og:locale:alternate", OG_LOCALES[alternateLocale]);
  nextHtml = replaceMetaContent(nextHtml, "property", "og:url", canonicalUrl);
  nextHtml = replaceMetaContent(nextHtml, "property", "og:title", activeMeta.ogTitle);
  nextHtml = replaceMetaContent(nextHtml, "property", "og:description", activeMeta.ogDescription);
  nextHtml = replaceMetaContent(nextHtml, "name", "twitter:title", activeMeta.twitterTitle);
  nextHtml = replaceMetaContent(nextHtml, "name", "twitter:description", activeMeta.twitterDescription);

  getHrefLangEntries("https://innera.theinnercode.net").forEach((entry) => {
    nextHtml = replaceAlternateHref(nextHtml, entry.hrefLang, entry.href);
  });

  return nextHtml;
};

for (const locale of SUPPORTED_LOCALES) {
  const rendered = await render(locale);
  const rawHtml = typeof rendered === "string" ? rendered : rendered?.html;

  if (!rawHtml) {
    throw new Error(`Prerender failed: no HTML returned for locale "${locale}".`);
  }

  const preloadLinks = [...rawHtml.matchAll(/<link rel="preload"[^>]*\/>/g)]
    .map((match) => match[0])
    .join("");
  const appHtml = rawHtml.replace(/<link rel="preload"[^>]*\/>/g, "");
  const localizedTemplate = buildLocalizedHead(template, locale);
  const localizedPage = injectRenderedHtml(localizedTemplate, appHtml, preloadLinks);
  const targetDir = path.join(distDir, LOCALE_PATHS[locale].replace(/^\//, ""));

  await mkdir(targetDir, { recursive: true });
  await writeFile(path.join(targetDir, "index.html"), localizedPage, "utf8");
}

// /analytics — SPA shell (no SSR needed, login-gated)
const analyticsDir = path.join(distDir, "analytics");
await mkdir(analyticsDir, { recursive: true });
const analyticsHtml = template
  .replace(/<title>[\s\S]*?<\/title>/, "<title>INNERA Analytics</title>")
  .replace(/<html lang="[^"]*">/, '<html lang="en">');
await writeFile(path.join(analyticsDir, "index.html"), analyticsHtml, "utf8");

const defaultDestination = LOCALE_PATHS[DEFAULT_LOCALE];
const defaultCanonicalUrl = getLocaleUrl("https://innera.theinnercode.net", DEFAULT_LOCALE);
await writeFile(templatePath, createRedirectPage(defaultDestination, defaultCanonicalUrl), "utf8");
