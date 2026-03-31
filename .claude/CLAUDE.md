# INNERA – Newsletter System Design
**Fecha:** 2026-03-31  
**Estado:** Aprobado, pendiente de implementación

---

## Objetivo

Enviar 2 correos semanales tipo newsletter a todos los usuarios confirmados en la colección `TestUsers` de Firestore, personalizados por idioma (`locale: "en"` o `"es"`), con el mismo formato visual HTML que los emails existentes en `backend/routes/testaplication.js`.

---

## Identidad de la Publicación — The Inner Signal

| Elemento | Definición |
|---|---|
| **Nombre** | The Inner Signal |
| **Subtítulo** | Inteligencia para el sistema interior · By The InnerCode Co. |
| **Frecuencia** | Semanal — martes por la mañana |
| **Extensión** | 650–900 palabras + 1 dato + 1 recurso + 1 pregunta |
| **Tono** | Calibrado, preciso, sin hype. Como The Economist, pero para el mundo interior |
| **Idiomas** | Español (LATAM + US Hispanic) + Inglés (US) |
| **Objetivo** | Que el lector espere este correo cada martes. Que lo guarde. Que lo reenvíe. |

---

## Estructura Fija de Cada Edición

Cada edición tiene 5 secciones fijas. La consistencia es el respeto.

### SECCIÓN 1 — EL OBSERVATORIO (300–400 palabras)
Editorial de INNERA sobre un tema de inteligencia interior. Puede ser noticia reciente, estudio científico, observación de campo, o concepto del IBP. Tono: voz directa, primera persona, sin listas. Prosa.

### SECCIÓN 2 — LA SEÑAL (1 dato / 1 hallazgo)
Un dato, estadística, o hallazgo científico en 3-4 líneas. Siempre con fuente. Siempre con una implicación concreta para el lector.

### SECCIÓN 3 — DESDE EL IBP (100–150 palabras)
Explicación breve de un concepto del Inner Blueprint Profile. Rotando entre: 12 arquetipos, 5 índices diarios, 3 índices semanales, metodología general. Sin jerga. Con aplicación práctica.

### SECCIÓN 4 — LA PREGUNTA DE LA SEMANA (1 pregunta)
Una pregunta de introspección. Sin respuesta sugerida. Sin instrucciones de journaling. Solo la pregunta.

### SECCIÓN 5 — EL RECURSO (1 enlace externo)
Artículo, paper, video o podcast externo que complemente el tema. Fuente de alta calidad: Nature, HBR, The Atlantic, TED, etc.

---

## Ediciones Planificadas

### Edición #1 — 'Bienvenido al sistema que siempre tuviste'
**Semana 1 · Tono: íntimo, fundacional**

| Sección | ES | EN |
|---|---|---|
| **El Observatorio** | Por qué empezamos INNERA con 300 personas en lugar de 300,000. La filosofía de la beta cerrada como acto de cuidado, no de marketing. La diferencia entre una app que escala y una metodología que profundiza. | Why we started INNERA with 300 people instead of 300,000. The philosophy of the closed beta as an act of care, not marketing. The difference between an app that scales and a methodology that deepens. |
| **La Señal** | '73% de la Gen Z reporta agotamiento digital — y aun así pasa 7.2 horas diarias frente a una pantalla.' (Human8, 2025). Implicación: La primera respuesta al agotamiento no es desconectarse. Es entender qué dentro de ti se está agotando. | '73% of Gen Z reports digital exhaustion — yet still spends 7.2 hours a day in front of a screen.' (Human8, 2025). Implication: The first response to exhaustion isn't to disconnect. It's to understand what inside you is burning out. |
| **Desde el IBP** | ¿Qué es el Inner Blueprint Profile? No es un test. Es un sistema de cartografía dinámica. Mide 5 dimensiones en tiempo real y 3 dimensiones de coherencia semanal. La semana que viene: el primer índice. | What is the Inner Blueprint Profile? It's not a test. It's a dynamic mapping system. It measures 5 real-time dimensions and 3 weekly coherence dimensions. Next week: the first index. |
| **La Pregunta** | ¿Cuándo fue la última vez que actuaste desde claridad real — y no desde urgencia, hábito o expectativa externa? | When was the last time you acted from real clarity — not from urgency, habit, or external expectation? |
| **El Recurso** | 'Why the brain is not an input-output machine' — Anil Seth, The Atlantic. | 'Why the brain is not an input-output machine' — Anil Seth, The Atlantic. |

---

## Arquitectura

### Archivos nuevos

```
backend/
  scripts/
    send-newsletter.js          ← script principal de envío
  newsletters/
    templates/
      YYYY-MM-DD-<nombre>.js    ← una template por campaña
    sent-log.json               ← tracking de envíos (se crea automáticamente)
```

### Archivos existentes que se reutilizan

- `backend/firebase.js` — conexión a Firestore (admin SDK)
- `backend/.env` — credenciales SMTP y Firebase (sin cambios)
- Estilo HTML de `backend/routes/testaplication.js` → `sendThanksEmail()` como referencia visual

---

## Cómo usar

### 1. Crear una template de campaña

Archivo en `backend/newsletters/templates/YYYY-MM-DD-<nombre>.js`:

```js
module.exports = {
  subject: {
    en: 'The Inner Signal #1 — ...',
    es: 'The Inner Signal #1 — ...',
  },
  html: (user) => {
    const isEn = String(user.locale || 'en').startsWith('en');
    const i18n = isEn ? { /* textos en */ } : { /* textos es */ };
    return `...HTML...`;
  }
};
```

### 2. Correr el envío

```bash
cd backend
node scripts/send-newsletter.js 2026-04-07-edicion-1
```

### 3. Output esperado

```
[newsletter] Campaña: 2026-04-07-edicion-1
[newsletter] Usuarios encontrados: 23
[newsletter] Saltando 3 ya enviados
[newsletter] Enviando a 20 usuarios...
[newsletter] ✓ user@email.com (es)
[newsletter] ✓ other@email.com (en)
[newsletter] ✗ bad@email.com — Error: connection timeout
[newsletter] Completado: 19 enviados, 1 fallido
[newsletter] sent-log.json actualizado
```

---

## Script principal — Lógica

```
1. Leer nombre de campaña desde argv[2]
2. Cargar template desde newsletters/templates/<campaña>.js
3. Leer newsletters/sent-log.json (crear vacío si no existe)
4. Conectar a Firestore con firebase-admin
5. Obtener todos los docs de TestUsers
6. Filtrar usuarios ya enviados en esta campaña (del sent-log)
7. Para cada usuario pendiente:
   a. Generar HTML con template.html(user)
   b. Enviar con nodemailer (mismas credenciales SMTP del .env)
   c. Si éxito → agregar email al sent-log de esta campaña
   d. Si error → loguear, NO agregar al sent-log (reintentable)
8. Guardar sent-log.json actualizado
9. Imprimir resumen
```

---

## sent-log.json

```json
{
  "2026-04-07-edicion-1": ["email1@x.com", "email2@x.com"],
  "2026-04-14-edicion-2": ["email1@x.com"]
}
```

- Si se corre el script dos veces, los emails ya presentes se saltan
- Emails que fallaron **no** quedan en el log → re-correr el script los reintenta

---

## Variables de entorno requeridas (ya en `.env`)

```
MAIL_HOST=...
MAIL_PORT=...
MAIL_USER=...
MAIL_PASS=...
MAIL_FROM=...
```

---

## Convenciones de nombre de campaña

```
YYYY-MM-DD-edicion-<N>
```

Ejemplos:
- `2026-04-07-edicion-1`
- `2026-04-14-edicion-2`

---

## Dependencias

Sin dependencias nuevas. El script usa:
- `firebase-admin` — ya en package.json
- `nodemailer` — ya en package.json
- `dotenv` — ya en package.json
- `fs`, `path` — Node.js built-in

---

## Pasos de implementación

1. Crear `backend/newsletters/sent-log.json` vacío (`{}`)
2. Crear `backend/scripts/send-newsletter.js`
3. Crear `backend/newsletters/templates/2026-04-07-edicion-1.js` con contenido de Edición #1
4. Probar con un email de prueba antes del envío masivo
