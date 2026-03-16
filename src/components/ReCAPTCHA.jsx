import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

const RECAPTCHA_SCRIPT_ID = "google-recaptcha-api";
let recaptchaLoader;

function loadRecaptchaApi() {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("reCAPTCHA requires a browser environment"));
  }

  if (window.grecaptcha?.render) {
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
      if (window.grecaptcha?.render) {
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
      script.src = "https://www.google.com/recaptcha/api.js?render=explicit";
      script.async = true;
      script.defer = true;
      script.addEventListener("error", fail, { once: true });
      document.head.appendChild(script);
    }

    waitForApi();
  });

  return recaptchaLoader;
}

const ReCAPTCHA = forwardRef(function ReCAPTCHA({ sitekey, onChange, onExpired }, ref) {
  const containerRef = useRef(null);
  const widgetIdRef = useRef(null);
  const onChangeRef = useRef(onChange);
  const onExpiredRef = useRef(onExpired);

  onChangeRef.current = onChange;
  onExpiredRef.current = onExpired;

  useImperativeHandle(
    ref,
    () => ({
      reset() {
        if (widgetIdRef.current === null || !window.grecaptcha?.reset) return;
        window.grecaptcha.reset(widgetIdRef.current);
      },
    }),
    []
  );

  useEffect(() => {
    if (!sitekey || !containerRef.current) return undefined;

    let cancelled = false;

    loadRecaptchaApi()
      .then((grecaptcha) => {
        if (cancelled || !containerRef.current || widgetIdRef.current !== null) return;

        widgetIdRef.current = grecaptcha.render(containerRef.current, {
          sitekey,
          callback: (token) => onChangeRef.current?.(token),
          "expired-callback": () => onExpiredRef.current?.(),
          "error-callback": () => onExpiredRef.current?.(),
        });
      })
      .catch(() => {
        if (cancelled) return;
        onExpiredRef.current?.();
      });

    return () => {
      cancelled = true;

      if (widgetIdRef.current !== null && window.grecaptcha?.reset) {
        window.grecaptcha.reset(widgetIdRef.current);
      }

      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }

      widgetIdRef.current = null;
    };
  }, [sitekey]);

  return <div ref={containerRef} />;
});

export default ReCAPTCHA;
