module.exports = {
  subject: {
    en: 'The Inner Signal #7 — Coherence as competitive advantage',
    es: 'The Inner Signal #7 — La coherencia como ventaja competitiva',
  },

  html: (user) => {
    const isEn = String(user.locale || 'en').startsWith('en');

    const i18n = isEn ? {
      preheader: 'McKinsey: CEOs with higher self-awareness show 23% more profitability over 5 years.',
      headerLabel: 'WEEKLY INTELLIGENCE · BY THE INNERCODE CO.',
      editionLabel: 'EDITION #7',
      title: 'Coherence as<br/>competitive advantage',
      section1Title: 'THE OBSERVATORY',
      section1Body: `
        <p style="margin:0 0 14px; text-align:justify;">In 2026, the most real and least replicable competitive advantage is internal coherence. Not skills. Not network. Not capital.</p>
        <p style="margin:0 0 14px; text-align:justify;">The ability to operate from the same inner system — regardless of external conditions — is what separates leaders who endure from those who consume. Leaders who endure don't have less pressure. They have a more stable internal platform from which to process it.</p>
        <p style="margin:0 0 14px; text-align:justify;">Coherence is not consistency of mood. It's not the absence of doubt. It's the alignment between what you say matters, how you allocate your attention, and the decisions you make under uncertainty.</p>
        <p style="margin:0; text-align:justify;">That alignment can be mapped. It can be measured. And once measured, it can be recalibrated. That's what INNERA is built to do.</p>
      `,
      section2Title: 'THE SIGNAL',
      section2Body: `
        <p style="margin:0 0 10px; text-align:justify;"><strong>CEOs with objectively measured higher self-awareness make significantly better decisions under pressure and show 23% more profitability in their companies over 5 years.</strong> <span style="color:#666; font-size:14px;">(McKinsey, 2024)</span></p>
        <p style="margin:0; text-align:justify;">Self-knowledge is not philosophy. It's a quantifiable advantage. The IBP is the measurement layer that makes that advantage accessible.</p>
      `,
      section3Title: 'FROM THE IBP',
      section3Body: `
        <p style="margin:0 0 14px; text-align:justify;">The ICo: Weekly Coherence Index. How to measure whether your actions this week were aligned with your value system — and how to use that information to adjust the following week.</p>
        <p style="margin:0 0 14px; text-align:justify;">The ICo doesn't measure whether you were productive. It measures whether what you did was coherent with what you decided mattered. Those are frequently different things.</p>
        <p style="margin:0; text-align:justify;">High ICo week: you feel integration, even if the week was hard. Low ICo week: you feel friction, even if the results looked good on paper.</p>
      `,
      section4Title: 'QUESTION OF THE WEEK',
      section4Quote: '"How much of what you did this week was truly a choice — and how much was a reaction?"',
      section5Title: 'THE RESOURCE',
      section5Label: 'RECOMMENDED READ',
      section5Body: `<strong>The Making of a Corporate Athlete</strong> — Jim Loehr & Tony Schwartz, Harvard Business Review`,
      section5Sub: 'One of the most cited texts on sustainable high performance and internal energy management. The case for treating inner resources like professional ones.',
      section5Url: 'https://hbr.org/2001/10/the-making-of-a-corporate-athlete',
      section5Cta: 'Read →',
      footerLine: 'You are receiving this because you are part of the INNERA controlled calibration phase.',
      unsubscribe: 'If you no longer wish to receive The Inner Signal, reply to this email.',
    } : {
      preheader: 'McKinsey: Los CEOs con mayor autoconocimiento muestran 23% más rentabilidad a 5 años.',
      headerLabel: 'INTELIGENCIA SEMANAL · BY THE INNERCODE CO.',
      editionLabel: 'EDICIÓN #7',
      title: 'La coherencia como<br/>ventaja competitiva',
      section1Title: 'EL OBSERVATORIO',
      section1Body: `
        <p style="margin:0 0 14px; text-align:justify;">En 2026, la ventaja competitiva más real y menos replicable es la coherencia interna. No habilidades. No red de contactos. No capital.</p>
        <p style="margin:0 0 14px; text-align:justify;">La capacidad de operar desde el mismo sistema interior — independientemente de las condiciones externas — es lo que separa a los líderes que perduran de los que se consumen. Los que perduran no tienen menos presión. Tienen una plataforma interna más estable desde la que procesarla.</p>
        <p style="margin:0 0 14px; text-align:justify;">La coherencia no es consistencia de estado de ánimo. No es ausencia de duda. Es la alineación entre lo que dices que te importa, cómo asignas tu atención, y las decisiones que tomas bajo incertidumbre.</p>
        <p style="margin:0; text-align:justify;">Esa alineación puede mapearse. Puede medirse. Y una vez medida, puede recalibrarse. Para eso fue construido INNERA.</p>
      `,
      section2Title: 'LA SEÑAL',
      section2Body: `
        <p style="margin:0 0 10px; text-align:justify;"><strong>Los CEOs con mayor 'self-awareness' medida objetivamente toman decisiones significativamente mejores bajo presión y muestran 23% más de rentabilidad en sus empresas a 5 años vista.</strong> <span style="color:#666; font-size:14px;">(McKinsey, 2024)</span></p>
        <p style="margin:0; text-align:justify;">El autoconocimiento no es filosofía. Es una ventaja cuantificable. El IBP es la capa de medición que hace esa ventaja accesible.</p>
      `,
      section3Title: 'DESDE EL IBP',
      section3Body: `
        <p style="margin:0 0 14px; text-align:justify;">El ICo: Índice de Coherencia Semanal. Cómo medir si tus acciones de la semana estuvieron alineadas con tu sistema de valores — y cómo usar esa información para ajustar la siguiente semana.</p>
        <p style="margin:0 0 14px; text-align:justify;">El ICo no mide si fuiste productivo. Mide si lo que hiciste fue coherente con lo que decidiste que importaba. Esas son frecuentemente cosas diferentes.</p>
        <p style="margin:0; text-align:justify;">Semana con ICo alto: sientes integración, aunque la semana haya sido difícil. Semana con ICo bajo: sientes fricción, aunque los resultados se vean bien en el papel.</p>
      `,
      section4Title: 'LA PREGUNTA DE LA SEMANA',
      section4Quote: '"¿Cuánto de lo que hiciste esta semana fue realmente una elección — y cuánto fue una reacción?"',
      section5Title: 'EL RECURSO',
      section5Label: 'LECTURA RECOMENDADA',
      section5Body: `<strong>The Making of a Corporate Athlete</strong> — Jim Loehr & Tony Schwartz, Harvard Business Review`,
      section5Sub: 'Uno de los textos más citados sobre rendimiento sostenible y gestión de la energía interna. El argumento para tratar los recursos interiores como recursos profesionales.',
      section5Url: 'https://hbr.org/2001/10/the-making-of-a-corporate-athlete',
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
