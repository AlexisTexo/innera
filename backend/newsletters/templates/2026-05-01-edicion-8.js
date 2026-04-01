module.exports = {
  subject: {
    en: 'The Inner Signal — The co-founders of INNERA',
    es: 'The Inner Signal — Los co-fundadores de INNERA',
  },

  html: (user) => {
    const isEn = String(user.locale || 'en').startsWith('en');

    const i18n = isEn ? {
      preheader: 'You didn\'t just build a profile. You built the first collective map.',
      headerLabel: 'WEEKLY INTELLIGENCE · BY THE INNERCODE CO.',
      editionLabel: 'EDITION #8',
      title: 'The co-founders<br/>of INNERA',
      section1Title: 'THE OBSERVATORY',
      section1Body: `
        <p style="margin:0 0 14px; text-align:justify;">To the 300 users of the beta: what you built was not just an IBP profile. You built the first collective map of human patterns that will make INNERA more precise for the millions who come after you.</p>
        <p style="margin:0 0 14px; text-align:justify;">The word co-founder is not a marketing metaphor here. It's a functional description. Without your participation — your honest responses, your real patterns, your willingness to be observed with precision — the calibration phase would have been theoretical.</p>
        <p style="margin:0 0 14px; text-align:justify;">What you contributed is not a dataset. It's a foundation. The IBP is now more accurate because 300 people agreed to be seen clearly. That's rare. Most tools are calibrated on sanitized, self-reported, socially desirable data. Yours was not.</p>
        <p style="margin:0; text-align:justify;">Phase 2 begins soon. What it looks like — and what role you play in it — is part of what this letter is about.</p>
      `,
      section2Title: 'THE SIGNAL',
      section2Body: `
        <p style="margin:0 0 10px; text-align:justify;"><strong>94% of beta users completed their IBP profile within the first 48 hours. Average session time: 18 minutes. Preliminary Net Promoter Score: 71.</strong> <span style="color:#666; font-size:14px;">(Internal data, INNERA beta — only published because the real numbers are good.)</span></p>
        <p style="margin:0; text-align:justify;">An NPS of 71 places INNERA in the same category as tools people recommend without being asked. That's the only metric that matters to us.</p>
      `,
      section3Title: 'FROM THE IBP',
      section3Body: `
        <p style="margin:0 0 14px; text-align:justify;">The IAC: Conscious Agency Index. The most important index in the IBP. The measure of how much of your life you are actively choosing versus responding to automatically.</p>
        <p style="margin:0 0 14px; text-align:justify;">This is what the entire IBP builds toward: not a personality label, not a trait profile, but a living measure of your capacity to act from choice rather than from pattern.</p>
        <p style="margin:0; text-align:justify;">That capacity can be trained. The IBP maps the starting point. What comes next — Phase 2 — maps the trajectory.</p>
      `,
      section4Title: 'QUESTION OF THE WEEK',
      section4Quote: '"If you could change one internal pattern you\'ve been repeating for too long — which one would it be?"',
      section5Title: 'THE RESOURCE',
      section5Label: 'FROM INNERA',
      section5Body: `<strong>Open letter to the 300 co-founders</strong> — The InnerCode Co.`,
      section5Sub: 'Published also as an article on LinkedIn. What Phase 2 looks like, what it means for you, and why the first 300 matter more than the next 300,000.',
      section5Url: 'https://www.linkedin.com/in/innera-net-0549253b2/',
      section5Cta: 'Read on LinkedIn →',
      footerLine: 'You are receiving this because you are part of the INNERA controlled calibration phase.',
      unsubscribe: 'If you no longer wish to receive The Inner Signal, reply to this email.',
    } : {
      preheader: 'No solo construiste un perfil. Construiste el primer mapa colectivo.',
      headerLabel: 'INTELIGENCIA SEMANAL · BY THE INNERCODE CO.',
      editionLabel: 'EDICIÓN #8',
      title: 'Los co-fundadores<br/>de INNERA',
      section1Title: 'EL OBSERVATORIO',
      section1Body: `
        <p style="margin:0 0 14px; text-align:justify;">A los 300 usuarios de la beta: lo que construyeron no fue solo un perfil IBP. Construyeron el primer mapa colectivo de patrones humanos que hará que INNERA sea más preciso para los millones que vengan después.</p>
        <p style="margin:0 0 14px; text-align:justify;">La palabra co-fundador no es una metáfora de marketing aquí. Es una descripción funcional. Sin su participación — sus respuestas honestas, sus patrones reales, su disposición a ser observados con precisión — la fase de calibración hubiera sido teórica.</p>
        <p style="margin:0 0 14px; text-align:justify;">Lo que aportaron no es un dataset. Es una base. El IBP ahora es más preciso porque 300 personas aceptaron ser vistas con claridad. Eso es raro. La mayoría de herramientas se calibran con datos sanitizados, autorreportados, socialmente deseables. Los suyos no.</p>
        <p style="margin:0; text-align:justify;">La Fase 2 comienza pronto. Cómo se ve — y qué papel juegan en ella — es parte de lo que trata esta carta.</p>
      `,
      section2Title: 'LA SEÑAL',
      section2Body: `
        <p style="margin:0 0 10px; text-align:justify;"><strong>El 94% de los usuarios beta completaron su perfil IBP en las primeras 48 horas. Tiempo promedio de sesión: 18 minutos. Net Promoter Score preliminar: 71.</strong> <span style="color:#666; font-size:14px;">(Datos internos, beta INNERA — solo publicados porque los números reales son buenos.)</span></p>
        <p style="margin:0; text-align:justify;">Un NPS de 71 coloca a INNERA en la misma categoría que las herramientas que las personas recomiendan sin que se lo pidan. Esa es la única métrica que nos importa.</p>
      `,
      section3Title: 'DESDE EL IBP',
      section3Body: `
        <p style="margin:0 0 14px; text-align:justify;">El IAC: Índice de Agencia Consciente. El índice más importante del IBP. La medida de cuánto de tu vida estás eligiendo activamente versus respondiendo de forma automática.</p>
        <p style="margin:0 0 14px; text-align:justify;">Hacia esto construye todo el IBP: no una etiqueta de personalidad, no un perfil de rasgos, sino una medida viva de tu capacidad de actuar desde la elección en lugar de desde el patrón.</p>
        <p style="margin:0; text-align:justify;">Esa capacidad puede entrenarse. El IBP mapea el punto de partida. Lo que viene después — Fase 2 — mapea la trayectoria.</p>
      `,
      section4Title: 'LA PREGUNTA DE LA SEMANA',
      section4Quote: '"Si pudieras cambiar un patrón interno que llevas repitiendo demasiado tiempo, ¿cuál sería?"',
      section5Title: 'EL RECURSO',
      section5Label: 'DE INNERA',
      section5Body: `<strong>Carta abierta a los 300 co-fundadores</strong> — The InnerCode Co.`,
      section5Sub: 'Publicada también como artículo en LinkedIn. Cómo se ve la Fase 2, qué significa para ti, y por qué los primeros 300 importan más que los siguientes 300,000.',
      section5Url: 'https://www.linkedin.com/in/innera-net-0549253b2/',
      section5Cta: 'Leer en LinkedIn →',
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
          <tr><td style="padding:0;" align="center"><img src="https://i.imgur.com/0jAMS0W.png" alt="INNERA" width="560" style="display:block; width:100%; max-width:560px; height:auto; border:0;" /></td></tr>
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
