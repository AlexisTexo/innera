module.exports = {
  subject: {
    en: 'The Inner Signal — Welcome to the system you always had',
    es: 'The Inner Signal — Bienvenido al sistema que siempre tuviste',
  },

  html: (user) => {
    const isEn = String(user.locale || 'en').startsWith('en');

    const i18n = isEn ? {
      preheader: 'Why we started with 300 people instead of 300,000.',
      headerLabel: 'WEEKLY INTELLIGENCE · BY THE INNERCODE CO.',
      editionLabel: 'EDITION #1',
      section1Title: 'THE OBSERVATORY',
      section1Body: `
        <p style="margin:0 0 14px; text-align:justify;">We could have opened INNERA to everyone. The technology was ready. The demand was there. We chose not to.</p>
        <p style="margin:0 0 14px; text-align:justify;">Three hundred people. That was the decision. Not because of a server limit or a budget constraint — but because a methodology that deepens cannot be treated like an app that scales.</p>
        <p style="margin:0 0 14px; text-align:justify;">The closed beta is not a marketing strategy. It is an act of care. It is the difference between building something that measures you and something that knows you.</p>
        <p style="margin:0 0 14px; text-align:justify;">Most tools in the self-knowledge space are built on the assumption that more data means more clarity. We disagree. Clarity comes from precision, not volume. From the right signal, not from noise.</p>
        <p style="margin:0; text-align:justify;">You are here because you understand that distinction. That is not a small thing.</p>
      `,
      section2Title: 'THE SIGNAL',
      section2Body: `
        <p style="margin:0 0 10px; text-align:justify;"><strong>73% of Gen Z reports digital exhaustion — yet still spends 7.2 hours a day in front of a screen.</strong> <span style="color:#666; font-size:14px;">(Human8, 2025)</span></p>
        <p style="margin:0; text-align:justify;">The first response to exhaustion is not to disconnect. It is to understand what inside you is burning out. The screen is not the problem. The disconnection from your own system is.</p>
      `,
      section3Title: 'FROM THE IBP',
      section3Body: `
        <p style="margin:0 0 14px; text-align:justify;">The Inner Blueprint Profile is not a personality test. It does not assign you a type and leave you there.</p>
        <p style="margin:0 0 14px; text-align:justify;">It is a dynamic mapping system. It measures 5 real-time dimensions — how you think, react, decide, relate, and restore — and 3 weekly coherence dimensions that show whether your inner system is aligned or in friction.</p>
        <p style="margin:0; text-align:justify;">Next week: the first dimension. What it measures, and what it reveals when you pay attention to it.</p>
      `,
      section4Title: 'QUESTION OF THE WEEK',
      section4Quote: '"When was the last time you acted from real clarity — not from urgency, habit, or external expectation?"',
      section5Title: 'THE RESOURCE',
      section5Label: 'RECOMMENDED READ',
      section5Body: `<strong>Your brain hallucinates your conscious reality</strong> — Anil Seth, TED`,
      section5Sub: 'Why your brain is a prediction machine — and what that means for how you see yourself and the world.',
      section5Url: 'https://www.ted.com/talks/anil_seth_your_brain_hallucinates_your_conscious_reality',
      section5Cta: 'Watch talk →',
      footerLine: 'You are receiving this because you are part of the INNERA controlled calibration phase.',
      unsubscribe: 'If you no longer wish to receive The Inner Signal, reply to this email.',
    } : {
      preheader: 'Por qué empezamos con 300 personas en lugar de 300,000.',
      headerLabel: 'INTELIGENCIA SEMANAL · BY THE INNERCODE CO.',
      editionLabel: 'EDICIÓN #1',
      section1Title: 'EL OBSERVATORIO',
      section1Body: `
        <p style="margin:0 0 14px; text-align:justify;">Podríamos haber abierto INNERA a todo el mundo. La tecnología estaba lista. La demanda existía. Decidimos no hacerlo.</p>
        <p style="margin:0 0 14px; text-align:justify;">Trescientas personas. Esa fue la decisión. No por un límite técnico ni una restricción de presupuesto — sino porque una metodología que profundiza no puede tratarse como una app que escala.</p>
        <p style="margin:0 0 14px; text-align:justify;">La beta cerrada no es una estrategia de marketing. Es un acto de cuidado. Es la diferencia entre construir algo que te mide y algo que te conoce.</p>
        <p style="margin:0 0 14px; text-align:justify;">La mayoría de las herramientas en el espacio del autoconocimiento se construyen sobre la suposición de que más datos significa más claridad. No estamos de acuerdo. La claridad viene de la precisión, no del volumen. De la señal correcta, no del ruido.</p>
        <p style="margin:0; text-align:justify;">Estás aquí porque entiendes esa distinción. Eso no es una cosa menor.</p>
      `,
      section2Title: 'LA SEÑAL',
      section2Body: `
        <p style="margin:0 0 10px; text-align:justify;"><strong>El 73% de la Gen Z reporta agotamiento digital — y aun así pasa 7.2 horas diarias frente a una pantalla.</strong> <span style="color:#666; font-size:14px;">(Human8, 2025)</span></p>
        <p style="margin:0; text-align:justify;">La primera respuesta al agotamiento no es desconectarse. Es entender qué dentro de ti se está agotando. La pantalla no es el problema. La desconexión de tu propio sistema, sí.</p>
      `,
      section3Title: 'DESDE EL IBP',
      section3Body: `
        <p style="margin:0 0 14px; text-align:justify;">El Inner Blueprint Profile no es un test de personalidad. No te asigna un tipo y te deja ahí.</p>
        <p style="margin:0 0 14px; text-align:justify;">Es un sistema de cartografía dinámica. Mide 5 dimensiones en tiempo real — cómo piensas, reaccionas, decides, te relacionas y te restauras — y 3 dimensiones de coherencia semanal que muestran si tu sistema interior está alineado o en fricción.</p>
        <p style="margin:0; text-align:justify;">La semana que viene: la primera dimensión. Qué mide, y qué revela cuando le prestas atención.</p>
      `,
      section4Title: 'LA PREGUNTA DE LA SEMANA',
      section4Quote: '"¿Cuándo fue la última vez que actuaste desde claridad real — y no desde urgencia, hábito o expectativa externa?"',
      section5Title: 'EL RECURSO',
      section5Label: 'LECTURA RECOMENDADA',
      section5Body: `<strong>Tu cerebro alucina tu realidad consciente</strong> — Anil Seth, TED`,
      section5Sub: 'Por qué tu cerebro es una máquina de predicción — y qué significa eso para cómo te percibes a ti mismo y al mundo.',
      section5Url: 'https://www.ted.com/talks/anil_seth_your_brain_hallucinates_your_conscious_reality',
      section5Cta: 'Ver charla →',
      footerLine: 'Recibes esto porque eres parte de la fase de calibración controlada de INNERA.',
      unsubscribe: 'Si ya no deseas recibir The Inner Signal, responde a este correo.',
    };

    const icon = (symbol, color, title) => `
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:14px;">
        <tr>
          <td style="width:34px; height:34px; border:2px solid ${color}; border-radius:50%; text-align:center; vertical-align:middle; color:${color}; font-size:15px; line-height:34px; font-family:Arial, Helvetica, sans-serif;">
            ${symbol}
          </td>
          <td style="padding-left:12px; font-family:Arial, Helvetica, sans-serif; font-size:11px; letter-spacing:2px; color:#888888; text-transform:uppercase; font-weight:700; vertical-align:middle;">
            ${title}
          </td>
        </tr>
      </table>`;

    return `<!doctype html>
<html lang="${isEn ? 'en' : 'es'}">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${isEn ? module.exports.subject.en : module.exports.subject.es}</title>
  </head>
  <body style="margin:0; padding:0; background-color:#f4f4f4;">

    <!-- Preheader oculto -->
    <div style="display:none; max-height:0; overflow:hidden; mso-hide:all;">${i18n.preheader}</div>

    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#f4f4f4; padding:24px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:560px; background-color:#ffffff;">

            <!-- Header negro con logo -->
            <tr>
              <td style="background-color:#000000; padding:20px 24px;" align="center">
                <img src="https://i.imgur.com/QJIoscZ.png" alt="The Inner Code" width="140" style="display:block; width:140px; max-width:100%; height:auto; border:0;" />
              </td>
            </tr>

            <!-- Etiqueta de publicación -->
            <tr>
              <td style="background-color:#000000; padding:0 24px 16px;" align="center">
                <p style="margin:0; font-family:Arial, Helvetica, sans-serif; font-size:11px; letter-spacing:2px; color:#888888; text-transform:uppercase;">${i18n.headerLabel}</p>
              </td>
            </tr>

            <!-- Banner INNERA -->
            <tr>
              <td style="padding:0;" align="center">
                <img src="https://i.imgur.com/1BvpaxR.png" alt="INNERA" width="560" style="display:block; width:100%; max-width:560px; height:auto; border:0;" />
              </td>
            </tr>

            <!-- Título de edición -->
            <tr>
              <td style="padding:28px 24px 0; font-family:Arial, Helvetica, sans-serif;">
                <p style="margin:0 0 4px; font-size:11px; letter-spacing:2px; color:#888888; text-transform:uppercase;">THE INNER SIGNAL · ${i18n.editionLabel}</p>
                <h1 style="margin:6px 0 0; font-size:26px; font-weight:700; line-height:1.2; color:#121212;">
                  ${isEn ? 'Welcome to the system<br/>you always had' : 'Bienvenido al sistema<br/>que siempre tuviste'}
                </h1>
              </td>
            </tr>

            <!-- Divisor -->
            <tr><td style="padding:24px 24px 0;"><hr style="border:none; border-top:1px solid #e0e0e0; margin:0;" /></td></tr>

            <!-- SECCIÓN 1: El Observatorio — ◇ Naranja #E8973A -->
            <tr>
              <td style="padding:24px 24px 0; font-family:Arial, Helvetica, sans-serif;">
                ${icon('&#9671;', '#E8973A', i18n.section1Title)}
                <div style="font-size:16px; line-height:1.7; color:#121212;">
                  ${i18n.section1Body}
                </div>
              </td>
            </tr>

            <!-- Divisor -->
            <tr><td style="padding:24px 24px 0;"><hr style="border:none; border-top:1px solid #e0e0e0; margin:0;" /></td></tr>

            <!-- SECCIÓN 2: La Señal — ◇ Rojo-naranja #D4472B -->
            <tr>
              <td style="padding:24px 24px 0; font-family:Arial, Helvetica, sans-serif;">
                ${icon('&#9671;', '#D4472B', i18n.section2Title)}
                <div style="font-size:15px; line-height:1.6; color:#121212; background-color:#f9f9f9; border-left:3px solid #D4472B; padding:16px 20px;">
                  ${i18n.section2Body}
                </div>
              </td>
            </tr>

            <!-- Divisor -->
            <tr><td style="padding:24px 24px 0;"><hr style="border:none; border-top:1px solid #e0e0e0; margin:0;" /></td></tr>

            <!-- SECCIÓN 3: Desde el IBP — ▲ Teal #2AADA8 -->
            <tr>
              <td style="padding:24px 24px 0; font-family:Arial, Helvetica, sans-serif;">
                ${icon('&#9650;', '#2AADA8', i18n.section3Title)}
                <div style="font-size:15px; line-height:1.7; color:#121212;">
                  ${i18n.section3Body}
                </div>
              </td>
            </tr>

            <!-- Divisor -->
            <tr><td style="padding:24px 24px 0;"><hr style="border:none; border-top:1px solid #e0e0e0; margin:0;" /></td></tr>

            <!-- SECCIÓN 4: La Pregunta — ○ Púrpura #7B52D4 -->
            <tr>
              <td style="padding:24px 24px 0; font-family:Arial, Helvetica, sans-serif;">
                ${icon('&#9675;', '#7B52D4', i18n.section4Title)}
                <div style="padding:20px 24px; background-color:#121212; border-radius:4px;">
                  <p style="margin:0; font-size:17px; font-weight:700; line-height:1.5; color:#ffffff; font-style:italic; text-align:justify;">
                    ${i18n.section4Quote}
                  </p>
                </div>
              </td>
            </tr>

            <!-- Divisor -->
            <tr><td style="padding:24px 24px 0;"><hr style="border:none; border-top:1px solid #e0e0e0; margin:0;" /></td></tr>

            <!-- SECCIÓN 5: El Recurso — □ Verde #3DB86A -->
            <tr>
              <td style="padding:24px 24px 32px; font-family:Arial, Helvetica, sans-serif;">
                ${icon('&#9633;', '#3DB86A', i18n.section5Title)}
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border:1px solid #e0e0e0; border-radius:4px;">
                  <tr>
                    <td style="padding:16px 20px;">
                      <p style="margin:0 0 4px; font-size:11px; letter-spacing:1.5px; color:#888888; text-transform:uppercase;">${i18n.section5Label}</p>
                      <p style="margin:6px 0 4px; font-size:15px; line-height:1.5; color:#121212; text-align:justify;">${i18n.section5Body}</p>
                      <p style="margin:0 0 12px; font-size:13px; color:#666666; text-align:justify;">${i18n.section5Sub}</p>
                      <a href="${i18n.section5Url}" target="_blank" style="display:inline-block; padding:8px 16px; background:#000; color:#fff; text-decoration:none; border-radius:4px; font-size:13px; font-weight:700;">${i18n.section5Cta}</a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Footer negro con redes -->
            <tr>
              <td style="background-color:#000000; padding:20px 24px 10px;" align="center">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td style="padding:0 8px;"><a href="https://www.instagram.com/inneranet/" target="_blank" style="text-decoration:none;"><img src="https://img.icons8.com/ios-filled/50/FFFFFF/instagram-new.png" alt="Instagram" width="20" style="display:block; width:20px; height:20px; border:0;" /></a></td>
                    <td style="padding:0 8px;"><a href="https://www.facebook.com/people/Innera/61588072216975/" target="_blank" style="text-decoration:none;"><img src="https://img.icons8.com/ios-filled/50/FFFFFF/facebook-new.png" alt="Facebook" width="20" style="display:block; width:20px; height:20px; border:0;" /></a></td>
                    <td style="padding:0 8px;"><a href="https://x.com/InneraManager" target="_blank" style="text-decoration:none;"><img src="https://img.icons8.com/ios-filled/50/FFFFFF/twitterx--v1.png" alt="X" width="20" style="display:block; width:20px; height:20px; border:0;" /></a></td>
                    <td style="padding:0 8px;"><a href="https://www.tiktok.com/@innera.net" target="_blank" style="text-decoration:none;"><img src="https://img.icons8.com/ios-filled/50/FFFFFF/tiktok--v1.png" alt="TikTok" width="20" style="display:block; width:20px; height:20px; border:0;" /></a></td>
                    <td style="padding:0 8px;"><a href="https://www.linkedin.com/in/innera-net-0549253b2/" target="_blank" style="text-decoration:none;"><img src="https://img.icons8.com/ios-filled/50/FFFFFF/linkedin.png" alt="LinkedIn" width="20" style="display:block; width:20px; height:20px; border:0;" /></a></td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="background-color:#000000; padding:8px 24px 20px;" align="center">
                <p style="margin:0 0 6px; font-family:Arial, Helvetica, sans-serif; font-size:11px; color:#666666;">${i18n.footerLine}</p>
                <p style="margin:0; font-family:Arial, Helvetica, sans-serif; font-size:11px; color:#555555;">${i18n.unsubscribe}</p>
                <p style="margin:8px 0 0; font-family:Arial, Helvetica, sans-serif; font-size:11px; color:#444444;">INNERA by TheInnerCode Co.</p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
  },
};
