# Innera

![Logo de Innera](https://i.imgur.com/91yCzZ3.png)

Proyecto web de Innera.

Este proyecto forma parte de **theinnercode.net** y se publica en el subdominio:
`https://innera.theinnercode.net`

## Desarrollo local

```bash
npm install
npm run dev
```

## Scripts disponibles

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

## Integración de pixeles y analítica

### Integraciones activas

- Google Tag Manager (GTM) con `VITE_GTM_ID` (actual: `GTM-MST6G6XK`).
- Google Ads / gtag con `VITE_GOOGLE_ADS_ID` (actual: `AW-17975497028`).
- Meta Pixel (Facebook) con `VITE_FB_PIXEL_ID` (actual: `2016699422226172`).
- Fallback `noscript` en `index.html` para GTM y Meta Pixel.

### Cómo funciona la integración

1. La app monta React en `src/main.jsx`.
2. Después del montaje, se hace `import("./analytics")` de forma diferida:
   - si existe `requestIdleCallback`, carga en idle (`timeout: 3500`).
   - si no existe, carga con `setTimeout` a los `1200ms`.
3. Al cargar `src/analytics.js`, se ejecuta `loadAnalytics()` una sola vez (guardado en `window.__inneraAnalyticsLoaded`).
4. `loadAnalytics()` inicializa:
   - `initGtm()`: crea `dataLayer`, empuja evento `gtm.start` y carga `gtm.js`.
   - `initGoogleAds()`: carga `gtag.js`, ejecuta `gtag("js", new Date())` y `gtag("config", ID)`.
   - `initMetaPixel()`: inicializa `fbq`, carga `fbevents.js` y dispara `fbq("track", "PageView")`.

### Eventos actualmente implementados

- GTM: evento base de arranque (`gtm.start`).
- Google Ads: configuración base (`gtag config`).
- Meta Pixel: `PageView`.

No hay eventos de conversión/custom adicionales implementados todavía (por ejemplo `Lead`, `CompleteRegistration`, etc.).

### Variables de entorno

Definidas en `.env.example`:

```bash
VITE_GTM_ID=GTM-MST6G6XK
VITE_GOOGLE_ADS_ID=AW-17975497028
VITE_FB_PIXEL_ID=2016699422226172
```

Nota importante:
- Si una variable no existe, el código usa los IDs por defecto embebidos en `src/analytics.js`.
- Para desactivar una integración en un entorno, define la variable como string vacío (por ejemplo `VITE_FB_PIXEL_ID=`).

## Flujo de ramas

Todos los cambios se deben aplicar primero en la rama `dev` y, una vez validados, hacer merge a `main`.

```bash
git checkout dev
git pull origin dev

# realizar cambios
git add .
git commit -m "mensaje"
git push origin dev

# luego integrar en main
git checkout main
git pull origin main
git merge dev
git push origin main
```
