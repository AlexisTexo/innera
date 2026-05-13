module.exports = {
  subject: {
    en: 'The Inner Signal — The cost of invisible defaults',
    es: 'The Inner Signal — El costo de los defaults invisibles',
  },

  html: (user) => {
    const isEn = String(user.locale || 'en').startsWith('en');

    const i18n = isEn ? {
      preheader: 'Your default is not neutral. It is the oldest decision still running.',
      headerLabel: 'WEEKLY INTELLIGENCE · BY THE INNERCODE CO.',
      editionLabel: 'EDITION #9',
      title: 'The cost of<br/>invisible defaults',
      section1Title: 'THE OBSERVATORY',
      section1Body: `
        <p style="margin:0 0 14px; text-align:justify;">A default is a decision that became so familiar it stopped feeling like a decision. The way you answer pressure. The way you end a conversation. The way you decide what matters first.</p>
        <p style="margin:0 0 14px; text-align:justify;">Most people do not lose coherence because they make one dramatic bad choice. They lose coherence through small, repeated defaults that were never reviewed.</p>
        <p style="margin:0 0 14px; text-align:justify;">The danger is that defaults feel efficient. They save energy in the moment, but they also preserve old operating systems. What once protected you may now be the thing narrowing your range.</p>
        <p style="margin:0; text-align:justify;">The next phase of INNERA is built around that review: not forcing change, but making the automated visible enough that choice becomes available again.</p>
      `,
      section2Title: 'THE SIGNAL',
      section2Body: `
        <p style="margin:0 0 10px; text-align:justify;"><strong>Signal to watch: the decision that feels most natural is often the one your system rehearsed longest, not necessarily the one your present situation needs.</strong> <span style="color:#666; font-size:14px;">(INNERA calibration note)</span></p>
        <p style="margin:0; text-align:justify;">Ease is useful data. But ease is not proof of alignment. Sometimes ease means coherence. Sometimes it means autopilot.</p>
      `,
      section3Title: 'FROM THE IBP',
      section3Body: `
        <p style="margin:0 0 14px; text-align:justify;">The DMI: Decision Mode Index. A map of how you choose when the conditions around you change: clarity, pressure, ambiguity, fatigue, and social expectation.</p>
        <p style="margin:0 0 14px; text-align:justify;">The DMI does not ask whether your decisions were good or bad. It asks which internal mode was driving them: strategy, defense, compliance, urgency, avoidance, or coherence.</p>
        <p style="margin:0; text-align:justify;">Once the mode is visible, the question changes from "What should I do?" to "From where am I deciding?"</p>
      `,
      section4Title: 'QUESTION OF THE WEEK',
      section4Quote: '"Which repeated decision in your life have you mistaken for your personality?"',
      section5Title: 'THE RESOURCE',
      section5Label: 'RECOMMENDED READ',
      section5Body: `<strong>Thinking in Bets</strong> — Annie Duke`,
      section5Sub: 'A practical book on decision quality, uncertainty, and separating the process of choosing from the outcome that follows.',
      section5Url: 'https://www.annieduke.com/books/thinking-in-bets/',
      section5Cta: 'Read →',
      footerLine: 'You are receiving this because you are part of the INNERA controlled calibration phase.',
      unsubscribe: 'If you no longer wish to receive The Inner Signal, reply to this email.',
    } : {
      preheader: 'Tu default no es neutral. Es la decisión más antigua que sigue corriendo.',
      headerLabel: 'INTELIGENCIA SEMANAL · BY THE INNERCODE CO.',
      editionLabel: 'EDICIÓN #9',
      title: 'El costo de los<br/>defaults invisibles',
      section1Title: 'EL OBSERVATORIO',
      section1Body: `
        <p style="margin:0 0 14px; text-align:justify;">Un default es una decisión que se volvió tan familiar que dejó de sentirse como decisión. La forma en que respondes bajo presión. La forma en que cierras una conversación. La forma en que decides qué importa primero.</p>
        <p style="margin:0 0 14px; text-align:justify;">La mayoría de las personas no pierde coherencia por una sola mala decisión dramática. La pierde por pequeños defaults repetidos que nunca fueron revisados.</p>
        <p style="margin:0 0 14px; text-align:justify;">El riesgo es que los defaults se sienten eficientes. Ahorran energía en el momento, pero también preservan sistemas operativos antiguos. Lo que antes te protegió puede ser hoy lo que estrecha tu rango.</p>
        <p style="margin:0; text-align:justify;">La siguiente fase de INNERA está construida alrededor de esa revisión: no forzar el cambio, sino hacer visible lo automático para que la elección vuelva a estar disponible.</p>
      `,
      section2Title: 'LA SEÑAL',
      section2Body: `
        <p style="margin:0 0 10px; text-align:justify;"><strong>Señal a observar: la decisión que se siente más natural suele ser la que tu sistema ensayó por más tiempo, no necesariamente la que tu situación presente necesita.</strong> <span style="color:#666; font-size:14px;">(Nota de calibración INNERA)</span></p>
        <p style="margin:0; text-align:justify;">La facilidad es un dato útil. Pero la facilidad no prueba alineación. A veces significa coherencia. A veces significa piloto automático.</p>
      `,
      section3Title: 'DESDE EL IBP',
      section3Body: `
        <p style="margin:0 0 14px; text-align:justify;">El DMI: Índice de Modo Decisional. Un mapa de cómo eliges cuando cambian las condiciones alrededor de ti: claridad, presión, ambigüedad, fatiga y expectativa social.</p>
        <p style="margin:0 0 14px; text-align:justify;">El DMI no pregunta si tus decisiones fueron buenas o malas. Pregunta qué modo interno las estaba conduciendo: estrategia, defensa, complacencia, urgencia, evasión o coherencia.</p>
        <p style="margin:0; text-align:justify;">Cuando el modo se vuelve visible, la pregunta cambia de "¿Qué debo hacer?" a "¿Desde dónde estoy decidiendo?"</p>
      `,
      section4Title: 'LA PREGUNTA DE LA SEMANA',
      section4Quote: '"¿Qué decisión repetida en tu vida has confundido con tu personalidad?"',
      section5Title: 'EL RECURSO',
      section5Label: 'LECTURA RECOMENDADA',
      section5Body: `<strong>Thinking in Bets</strong> — Annie Duke`,
      section5Sub: 'Un libro práctico sobre calidad de decisión, incertidumbre y la diferencia entre el proceso de elegir y el resultado que llega después.',
      section5Url: 'https://www.annieduke.com/books/thinking-in-bets/',
      section5Cta: 'Leer →',
      footerLine: 'Recibes esto porque eres parte de la fase de calibración controlada de INNERA.',
      unsubscribe: 'Si ya no deseas recibir The Inner Signal, responde a este correo.',
    };

    const icon = (symbol, color, title) => `
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:14px;">
        <tr>
          <td style="width:34px; height:34px; border:2px solid ${color}; border-radius:50%; text-align:center; vertical-align:middle; color:${color}; font-size:15px; line-height:34px; font-family:Arial, Helvetica, sans-serif;">${symbol}</td>
          <td style="padding-left:12px; font-family:Arial, Helvetica, sans-serif; font-size:11px; letter-spacing:2px; color:#888888; text-transform:uppercase; font-weight:700; vertical-align:middle;">${title}</td>
        </tr>
      </table>`;

    return `<!doctype html>
<html lang="${isEn ? 'en' : 'es'}">
  <head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /><title>${isEn ? module.exports.subject.en : module.exports.subject.es}</title></head>
  <body style="margin:0; padding:0; background-color:#f4f4f4;">
    <div style="display:none; max-height:0; overflow:hidden; mso-hide:all;">${i18n.preheader}</div>
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#f4f4f4; padding:24px 12px;">
      <tr><td align="center">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:560px; background-color:#ffffff;">
          <tr><td style="background-color:#000000; padding:20px 24px;" align="center"><img src="https://i.imgur.com/QJIoscZ.png" alt="The Inner Code" width="140" style="display:block; width:140px; max-width:100%; height:auto; border:0;" /></td></tr>
          <tr><td style="background-color:#000000; padding:0 24px 16px;" align="center"><p style="margin:0; font-family:Arial, Helvetica, sans-serif; font-size:11px; letter-spacing:2px; color:#888888; text-transform:uppercase;">${i18n.headerLabel}</p></td></tr>
          <tr><td style="padding:0;" align="center"><img src="https://i.imgur.com/DoKj3fX.png" alt="INNERA" width="560" style="display:block; width:100%; max-width:560px; height:auto; border:0;" /></td></tr>
          <tr><td style="padding:28px 24px 0; font-family:Arial, Helvetica, sans-serif;">
            <p style="margin:0 0 4px; font-size:11px; letter-spacing:2px; color:#888888; text-transform:uppercase;">THE INNER SIGNAL · ${i18n.editionLabel}</p>
            <h1 style="margin:6px 0 0; font-size:26px; font-weight:700; line-height:1.2; color:#121212;">${i18n.title}</h1>
          </td></tr>
          <tr><td style="padding:24px 24px 0;"><hr style="border:none; border-top:1px solid #e0e0e0; margin:0;" /></td></tr>
          <tr><td style="padding:24px 24px 0; font-family:Arial, Helvetica, sans-serif;">${icon('&#9671;', '#E8973A', i18n.section1Title)}<div style="font-size:16px; line-height:1.7; color:#121212;">${i18n.section1Body}</div></td></tr>
          <tr><td style="padding:24px 24px 0;"><hr style="border:none; border-top:1px solid #e0e0e0; margin:0;" /></td></tr>
          <tr><td style="padding:24px 24px 0; font-family:Arial, Helvetica, sans-serif;">${icon('&#9671;', '#D4472B', i18n.section2Title)}<div style="font-size:15px; line-height:1.6; color:#121212; background-color:#f9f9f9; border-left:3px solid #D4472B; padding:16px 20px;">${i18n.section2Body}</div></td></tr>
          <tr><td style="padding:24px 24px 0;"><hr style="border:none; border-top:1px solid #e0e0e0; margin:0;" /></td></tr>
          <tr><td style="padding:24px 24px 0; font-family:Arial, Helvetica, sans-serif;">${icon('&#9650;', '#2AADA8', i18n.section3Title)}<div style="font-size:15px; line-height:1.7; color:#121212;">${i18n.section3Body}</div></td></tr>
          <tr><td style="padding:24px 24px 0;"><hr style="border:none; border-top:1px solid #e0e0e0; margin:0;" /></td></tr>
          <tr><td style="padding:24px 24px 0; font-family:Arial, Helvetica, sans-serif;">${icon('&#9675;', '#7B52D4', i18n.section4Title)}<div style="padding:20px 24px; background-color:#121212; border-radius:4px;"><p style="margin:0; font-size:17px; font-weight:700; line-height:1.5; color:#ffffff; font-style:italic; text-align:justify;">${i18n.section4Quote}</p></div></td></tr>
          <tr><td style="padding:24px 24px 0;"><hr style="border:none; border-top:1px solid #e0e0e0; margin:0;" /></td></tr>
          <tr><td style="padding:24px 24px 32px; font-family:Arial, Helvetica, sans-serif;">${icon('&#9633;', '#3DB86A', i18n.section5Title)}<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border:1px solid #e0e0e0; border-radius:4px;"><tr><td style="padding:16px 20px;"><p style="margin:0 0 4px; font-size:11px; letter-spacing:1.5px; color:#888888; text-transform:uppercase;">${i18n.section5Label}</p><p style="margin:6px 0 4px; font-size:15px; line-height:1.5; color:#121212; text-align:justify;">${i18n.section5Body}</p><p style="margin:0 0 12px; font-size:13px; color:#666666; text-align:justify;">${i18n.section5Sub}</p><a href="${i18n.section5Url}" target="_blank" style="display:inline-block; padding:8px 16px; background:#000; color:#fff; text-decoration:none; border-radius:4px; font-size:13px; font-weight:700;">${i18n.section5Cta}</a></td></tr></table></td></tr>
          <tr><td style="background-color:#000000; padding:20px 24px 10px;" align="center"><table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
            <td style="padding:0 8px;"><a href="https://www.instagram.com/inneranet/" target="_blank" style="text-decoration:none;"><img src="https://img.icons8.com/ios-filled/50/FFFFFF/instagram-new.png" alt="Instagram" width="20" style="display:block; width:20px; height:20px; border:0;" /></a></td>
            <td style="padding:0 8px;"><a href="${isEn ? 'https://www.facebook.com/profile.php?id=61573271853654&locale=es_LA' : 'https://www.facebook.com/profile.php?id=61573357957063'}" target="_blank" style="text-decoration:none;"><img src="https://img.icons8.com/ios-filled/50/FFFFFF/facebook-new.png" alt="Facebook" width="20" style="display:block; width:20px; height:20px; border:0;" /></a></td>
            <td style="padding:0 8px;"><a href="https://x.com/InneraManager" target="_blank" style="text-decoration:none;"><img src="https://img.icons8.com/ios-filled/50/FFFFFF/twitterx--v1.png" alt="X" width="20" style="display:block; width:20px; height:20px; border:0;" /></a></td>
            <td style="padding:0 8px;"><a href="https://www.tiktok.com/@innera.net" target="_blank" style="text-decoration:none;"><img src="https://img.icons8.com/ios-filled/50/FFFFFF/tiktok--v1.png" alt="TikTok" width="20" style="display:block; width:20px; height:20px; border:0;" /></a></td>
            <td style="padding:0 8px;"><a href="https://www.linkedin.com/in/innera-net-0549253b2/" target="_blank" style="text-decoration:none;"><img src="https://img.icons8.com/ios-filled/50/FFFFFF/linkedin.png" alt="LinkedIn" width="20" style="display:block; width:20px; height:20px; border:0;" /></a></td>
          </tr></table></td></tr>
          <tr><td style="background-color:#000000; padding:8px 24px 20px;" align="center">
            <p style="margin:0 0 6px; font-family:Arial, Helvetica, sans-serif; font-size:11px; color:#666666;">${i18n.footerLine}</p>
            <p style="margin:0; font-family:Arial, Helvetica, sans-serif; font-size:11px; color:#555555;">${i18n.unsubscribe}</p>
            <p style="margin:8px 0 0; font-family:Arial, Helvetica, sans-serif; font-size:11px; color:#444444;">INNERA by TheInnerCode Co.</p>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`;
  },
};
