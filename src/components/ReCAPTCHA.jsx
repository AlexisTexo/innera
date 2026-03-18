const RECAPTCHA_SCRIPT_ID = "google-recaptcha-v3";
let recaptchaLoader;

function loadRecaptchaV3(siteKey) {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("reCAPTCHA requires a browser environment"));
  }

  if (window.grecaptcha?.execute) {
    return Promise.resolve(window.grecaptcha);
  }

  if (recaptchaLoader) {
    return recaptchaLoader;
  }

  recaptchaLoader = new Promise((resolve, reject) => {
    let pollAttempts = 0;

    const fail = () => {
      recaptchaLoader = null;
      reject(new Error("Failed to load the reCAPTCHA API"));
    };

    const waitForApi = () => {
      if (window.grecaptcha?.execute) {
        resolve(window.grecaptcha);
        return;
      }

      pollAttempts += 1;
      if (pollAttempts > 200) {
        fail();
        return;
      }

      window.setTimeout(waitForApi, 50);
    };

    const existingScript = document.getElementById(RECAPTCHA_SCRIPT_ID);
    if (!existingScript) {
      const script = document.createElement("script");
      script.id = RECAPTCHA_SCRIPT_ID;
      script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
      script.async = true;
      script.defer = true;
      script.addEventListener("error", fail, { once: true });
      document.head.appendChild(script);
    }

    waitForApi();
  });

  return recaptchaLoader;
}

/**
 * Executes reCAPTCHA v3 and returns a token.
 * Call this right before form submission.
 */
export async function executeRecaptcha(siteKey, action = "submit") {
  const grecaptcha = await loadRecaptchaV3(siteKey);
  return grecaptcha.execute(siteKey, { action });
}

/**
 * Preloads the reCAPTCHA v3 script (call on mount).
 */
export function preloadRecaptcha(siteKey) {
  if (siteKey) loadRecaptchaV3(siteKey).catch(() => {});
}
