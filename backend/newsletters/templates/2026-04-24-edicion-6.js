module.exports = {
  subject: {
    en: 'The Inner Signal #6 — The inner era has begun',
    es: 'The Inner Signal #6 — La era interior ha comenzado',
  },

  html: (user) => {
    const isEn = String(user.locale || 'en').startsWith('en');

    const i18n = isEn ? {
      preheader: 'The analog market surpassed $23.56B. The world is asking for what INNERA offers.',
      headerLabel: 'WEEKLY INTELLIGENCE · BY THE INNERCODE CO.',
      editionLabel: 'EDITION #6',
      title: 'The inner era<br/>has begun',
      section1Title: 'THE OBSERVATORY',
      section1Body: `
        <p style="margin:0 0 14px; text-align:justify;">The offline trend. The rejection of hyperconnectivity. The growing desire for analog, slow, tangible. These are not cultural accidents — they are symptoms of a deeper recalibration happening at scale.</p>
        <p style="margin:0 0 14px; text-align:justify;">INNERA was not designed to respond to this trend. It was built from the same conviction that generates it: that the most important territory to explore is interior. Not as a lifestyle choice. As a structural necessity.</p>
        <p style="margin:0 0 14px; text-align:justify;">The conversation about the self — real self-knowledge, not the kind sold in 3-minute videos — is becoming the defining conversation of the next decade. Not because it's fashionable. Because the cost of ignoring it is becoming too high.</p>
        <p style="margin:0; text-align:justify;">You joined INNERA before the trend became consensus. That's not a small thing.</p>
      `,
      section2Title: 'THE SIGNAL',
      section2Body: `
        <p style="margin:0 0 10px; text-align:justify;"><strong>"Going analog" went viral. Analog product sales grew 350% year-over-year. The craft & analog products industry surpassed $23.56 billion.</strong> <span style="color:#666; font-size:14px;">(CNBC / Forbes, March 2026)</span></p>
        <p style="margin:0; text-align:justify;">The market is already asking for what INNERA offers. The difference is that INNERA offers it with precision, not aesthetics.</p>
      `,
      section3Title: 'FROM THE IBP',
      section3Body: `
        <p style="margin:0 0 14px; text-align:justify;">The IAM: Movement and Agency Index. How the IBP measures the distance between your declared values and your actual actions — and why that gap is the source of most interior noise.</p>
        <p style="margin:0 0 14px; text-align:justify;">When the IAM is high, your actions are coherent with what you say matters to you. When it's low, you feel the friction — even if you can't name it. You feel it as restlessness, dissatisfaction, or a vague sense that something is off.</p>
        <p style="margin:0; text-align:justify;">The IAM doesn't judge. It maps. What you do with the map is the work.</p>
      `,
      section4Title: 'QUESTION OF THE WEEK',
      section4Quote: '"Which part of your current life is most aligned with who you really are — and which part are you living for the audience?"',
      section5Title: 'THE RESOURCE',
      section5Label: 'RECOMMENDED READ',
      section5Body: `<strong>Gen Z's desire to get offline is a boon for businesses</strong> — Forbes, March 2026`,
      section5Sub: 'The cultural and economic case for the analog movement — and the strategic window it creates for precision inner tools like INNERA.',
      section5Url: 'https://www.forbes.com',
      section5Cta: 'Read →',
      footerLine: 'You are receiving this because you are part of the INNERA controlled calibration phase.',
      unsubscribe: 'If you no longer wish to receive The Inner Signal, reply to this email.',
    } : {
      preheader: 'El mercado analógico superó los $23.56 mil millones. El mundo está pidiendo lo que INNERA ofrece.',
      headerLabel: 'INTELIGENCIA SEMANAL · BY THE INNERCODE CO.',
      editionLabel: 'EDICIÓN #6',
      title: 'La era interior<br/>ha comenzado',
      section1Title: 'EL OBSERVATORIO',
      section1Body: `
        <p style="margin:0 0 14px; text-align:justify;">La tendencia offline. El rechazo a la hiperconectividad. El deseo creciente de lo analógico, lo lento, lo tangible. Estos no son accidentes culturales — son síntomas de una recalibración más profunda que ocurre a escala.</p>
        <p style="margin:0 0 14px; text-align:justify;">INNERA no fue diseñado para responder a esta tendencia. Fue construido desde la misma convicción que la genera: que el territorio más importante por explorar es el interior. No como elección de estilo de vida. Como necesidad estructural.</p>
        <p style="margin:0 0 14px; text-align:justify;">La conversación sobre el self — el autoconocimiento real, no el que se vende en videos de 3 minutos — se está convirtiendo en la conversación definitoria de la próxima década. No porque esté de moda. Porque el costo de ignorarla se está volviendo demasiado alto.</p>
        <p style="margin:0; text-align:justify;">Llegaste a INNERA antes de que la tendencia se convirtiera en consenso. Eso no es una cosa menor.</p>
      `,
      section2Title: 'LA SEÑAL',
      section2Body: `
        <p style="margin:0 0 10px; text-align:justify;"><strong>"Going analog" logró viralidad. Las ventas de productos analógicos crecieron 350% año sobre año. La industria de craft & analog products superó los $23.56 mil millones.</strong> <span style="color:#666; font-size:14px;">(CNBC / Forbes, marzo 2026)</span></p>
        <p style="margin:0; text-align:justify;">El mercado ya está pidiendo lo que INNERA ofrece. La diferencia es que INNERA lo ofrece con precisión, no con estética.</p>
      `,
      section3Title: 'DESDE EL IBP',
      section3Body: `
        <p style="margin:0 0 14px; text-align:justify;">El IAM: Índice de Movimiento y Agencia. Cómo el IBP mide la distancia entre tus valores declarados y tus acciones reales — y por qué esa brecha es la fuente de la mayoría del ruido interior.</p>
        <p style="margin:0 0 14px; text-align:justify;">Cuando el IAM es alto, tus acciones son coherentes con lo que dices que te importa. Cuando es bajo, sientes la fricción — incluso si no puedes nombrarla. La sientes como inquietud, insatisfacción, o una vaga sensación de que algo está mal.</p>
        <p style="margin:0; text-align:justify;">El IAM no juzga. Mapea. Lo que haces con el mapa es el trabajo.</p>
      `,
      section4Title: 'LA PREGUNTA DE LA SEMANA',
      section4Quote: '"¿Qué parte de tu vida actual está más alineada con quien realmente eres — y qué parte la estás viviendo para la audiencia?"',
      section5Title: 'EL RECURSO',
      section5Label: 'LECTURA RECOMENDADA',
      section5Body: `<strong>Gen Z's desire to get offline is a boon for businesses</strong> — Forbes, marzo 2026`,
      section5Sub: 'El argumento cultural y económico del movimiento analógico — y la ventana estratégica que crea para herramientas de precisión interior como INNERA.',
      section5Url: 'https://www.forbes.com',
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
