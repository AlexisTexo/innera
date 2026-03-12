const GTM_ID = (import.meta.env.VITE_GTM_ID ?? "GTM-MST6G6XK").trim();
const GOOGLE_ADS_ID = (import.meta.env.VITE_GOOGLE_ADS_ID ?? "AW-17975497028").trim();
const FB_PIXEL_ID = (import.meta.env.VITE_FB_PIXEL_ID ?? "2016699422226172").trim();

const appendScript = (src, options = {}) => {
  const script = document.createElement("script");
  script.src = src;
  script.async = true;

  if (options.nonce) {
    script.nonce = options.nonce;
  }

  document.head.appendChild(script);
  return script;
};

const initGtm = () => {
  if (!GTM_ID) return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
  appendScript(`https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(GTM_ID)}`);
};

const initGoogleAds = () => {
  if (!GOOGLE_ADS_ID) return;
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function gtag() {
    window.dataLayer.push(arguments);
  };

  appendScript(
    `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GOOGLE_ADS_ID)}`
  );
  window.gtag("js", new Date());
  window.gtag("config", GOOGLE_ADS_ID);
};

const initMetaPixel = () => {
  if (!FB_PIXEL_ID) return;
  if (window.fbq) return;

  const fbq = function pixelProxy(...args) {
    if (fbq.callMethod) {
      fbq.callMethod.apply(fbq, args);
    } else {
      fbq.queue.push(args);
    }
  };

  fbq.push = fbq;
  fbq.loaded = true;
  fbq.version = "2.0";
  fbq.queue = [];

  window.fbq = fbq;
  window._fbq = fbq;

  appendScript("https://connect.facebook.net/en_US/fbevents.js");
  fbq("init", FB_PIXEL_ID);
  fbq("track", "PageView");
};

export const loadAnalytics = () => {
  if (typeof window === "undefined" || window.__inneraAnalyticsLoaded) return;
  window.__inneraAnalyticsLoaded = true;

  initGtm();
  initGoogleAds();
  initMetaPixel();
};

export const scheduleAnalyticsLoad = () => {
  if (typeof window === "undefined" || window.__inneraAnalyticsScheduled) return;
  window.__inneraAnalyticsScheduled = true;

  const run = () => {
    if (document.visibilityState === "hidden") {
      window.addEventListener(
        "visibilitychange",
        () => {
          if (document.visibilityState === "visible") loadAnalytics();
        },
        { once: true }
      );
      return;
    }

    loadAnalytics();
  };

  if (typeof window.requestIdleCallback === "function") {
    window.requestIdleCallback(run, { timeout: 3500 });
    return;
  }

  window.setTimeout(run, 1200);
};
