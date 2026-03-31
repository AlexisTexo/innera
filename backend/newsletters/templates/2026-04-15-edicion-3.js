module.exports = {
  subject: {
    en: 'The Inner Signal — Why the IBP is not another personality test',
    es: 'The Inner Signal — Por qué el IBP no es otro test de personalidad',
  },

  html: (user) => {
    const isEn = String(user.locale || 'en').startsWith('en');

    const i18n = isEn ? {
      preheader: '50% of people get different MBTI results within 5 weeks.',
      headerLabel: 'WEEKLY INTELLIGENCE · BY THE INNERCODE CO.',
      editionLabel: 'EDITION #3',
      title: 'Why the IBP is not<br/>another personality test',
      section1Title: 'THE OBSERVATORY',
      section1Body: `
        <p style="margin:0 0 14px; text-align:justify;">MBTI. Enneagram. DISC. Big Five. The self-knowledge tools industry has produced dozens of frameworks — most of them measuring the same thing: who you are in a static moment. A snapshot taken under calm conditions, presented as a permanent truth.</p>
        <p style="margin:0 0 14px; text-align:justify;">The IBP doesn't measure traits. It measures patterns. It doesn't ask who you are — it observes how your system functions under different conditions: pressure, recovery, decision-making, relational friction.</p>
        <p style="margin:0 0 14px; text-align:justify;">The difference is not philosophical. It's operational. A trait tells you what you tend to be. A pattern tells you what you actually do — and under what conditions it changes.</p>
        <p style="margin:0; text-align:justify;">A map of tendencies is interesting. A map of dynamics is useful.</p>
      `,
      section2Title: 'THE SIGNAL',
      section2Body: `
        <p style="margin:0 0 10px; text-align:justify;"><strong>50% of people receive different MBTI results if they retake the test with just 5 weeks between sessions.</strong> <span style="color:#666; font-size:14px;">(Journal of Personality Assessment)</span></p>
        <p style="margin:0; text-align:justify;">If your profile changes every 5 weeks, you're not measuring who you are. You're measuring how you feel that day. The IBP measures the pattern — the one that doesn't change with your mood, but reveals itself through it.</p>
      `,
      section3Title: 'FROM THE IBP',
      section3Body: `
        <p style="margin:0 0 14px; text-align:justify;">The 12 Archetypes of the IBP are not fixed descriptors. They are vectors of dominant energy. Your primary archetype is not what you are — it's the operating mode most activated in you right now.</p>
        <p style="margin:0 0 14px; text-align:justify;">An archetype can shift over months as your context changes. What doesn't shift is the underlying pattern that determines which archetype gets activated under pressure, under joy, under loss.</p>
        <p style="margin:0; text-align:justify;">That's what we map. Not the label. The mechanism.</p>
      `,
      section4Title: 'QUESTION OF THE WEEK',
      section4Quote: '"Is there a version of you that only appears when no one is watching — one that has no name in any personality profile you\'ve ever taken?"',
      section5Title: 'THE RESOURCE',
      section5Label: 'RECOMMENDED READ',
      section5Body: `<strong>Psychological Types</strong> — C.G. Jung (editorial summary)`,
      section5Sub: 'The foundational text behind modern typology — and why Jung himself warned against using it as a fixed classification system.',
      section5Url: 'https://www.gutenberg.org/ebooks/48710',
      section5Cta: 'Read →',
      footerLine: 'You are receiving this because you are part of the INNERA controlled calibration phase.',
      unsubscribe: 'If you no longer wish to receive The Inner Signal, reply to this email.',
    } : {
      preheader: 'El 50% de las personas obtienen resultados diferentes en el MBTI con 5 semanas de diferencia.',
      headerLabel: 'INTELIGENCIA SEMANAL · BY THE INNERCODE CO.',
      editionLabel: 'EDICIÓN #3',
      title: 'Por qué el IBP no es<br/>otro test de personalidad',
      section1Title: 'EL OBSERVATORIO',
      section1Body: `
        <p style="margin:0 0 14px; text-align:justify;">MBTI. Eneagrama. DISC. Big Five. La industria de herramientas de autoconocimiento ha producido decenas de frameworks — la mayoría midiendo lo mismo: quién eres en un momento estático. Una fotografía tomada en condiciones tranquilas, presentada como verdad permanente.</p>
        <p style="margin:0 0 14px; text-align:justify;">El IBP no mide rasgos. Mide patrones. No pregunta quién eres — observa cómo funciona tu sistema bajo diferentes condiciones: presión, recuperación, toma de decisiones, fricción relacional.</p>
        <p style="margin:0 0 14px; text-align:justify;">La diferencia no es filosófica. Es operacional. Un rasgo te dice lo que tiendes a ser. Un patrón te dice lo que realmente haces — y bajo qué condiciones cambia.</p>
        <p style="margin:0; text-align:justify;">Un mapa de tendencias es interesante. Un mapa de dinámicas es útil.</p>
      `,
      section2Title: 'LA SEÑAL',
      section2Body: `
        <p style="margin:0 0 10px; text-align:justify;"><strong>El 50% de las personas reciben resultados diferentes en el MBTI si lo hacen con 5 semanas de diferencia.</strong> <span style="color:#666; font-size:14px;">(Journal of Personality Assessment)</span></p>
        <p style="margin:0; text-align:justify;">Si tu perfil cambia cada 5 semanas, no estás midiendo quién eres. Estás midiendo cómo te sientes ese día. El IBP mide el patrón — el que no cambia con tu estado de ánimo, sino que se revela a través de él.</p>
      `,
      section3Title: 'DESDE EL IBP',
      section3Body: `
        <p style="margin:0 0 14px; text-align:justify;">Los 12 Arquetipos del IBP no son descriptores fijos. Son vectores de energía dominante. Tu arquetipo principal no es lo que eres — es el modo de funcionamiento más activado en ti en este momento de tu vida.</p>
        <p style="margin:0 0 14px; text-align:justify;">Un arquetipo puede cambiar con los meses a medida que cambia tu contexto. Lo que no cambia es el patrón subyacente que determina qué arquetipo se activa bajo presión, bajo alegría, bajo pérdida.</p>
        <p style="margin:0; text-align:justify;">Eso es lo que mapeamos. No la etiqueta. El mecanismo.</p>
      `,
      section4Title: 'LA PREGUNTA DE LA SEMANA',
      section4Quote: '"¿Hay una versión de ti que aparece solo cuando nadie mira — que no tiene nombre en ningún perfil de personalidad que hayas hecho?"',
      section5Title: 'EL RECURSO',
      section5Label: 'LECTURA RECOMENDADA',
      section5Body: `<strong>Tipos Psicológicos</strong> — C.G. Jung (resumen editorial)`,
      section5Sub: 'El texto fundacional detrás de la tipología moderna — y por qué el propio Jung advirtió contra usarlo como sistema de clasificación fija.',
      section5Url: 'https://www.gutenberg.org/ebooks/48710',
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
          <tr><td style="padding:0;" align="center"><img src="https://i.imgur.com/xLv8O0q.png" alt="INNERA" width="560" style="display:block; width:100%; max-width:560px; height:auto; border:0;" /></td></tr>
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
            <td style="padding:0 8px;"><a href="https://www.facebook.com/people/Innera/61588072216975/" target="_blank" style="text-decoration:none;"><img src="https://img.icons8.com/ios-filled/50/FFFFFF/facebook-new.png" alt="Facebook" width="20" style="display:block; width:20px; height:20px; border:0;" /></a></td>
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
