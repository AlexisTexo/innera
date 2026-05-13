module.exports = {
  subject: {
    en: 'The Inner Signal — Friction is also data',
    es: 'The Inner Signal — La fricción también es información',
  },

  html: (user) => {
    const isEn = String(user.locale || 'en').startsWith('en');

    const i18n = isEn ? {
      preheader: 'The environment is not background. It is part of the system.',
      headerLabel: 'WEEKLY INTELLIGENCE · BY THE INNERCODE CO.',
      editionLabel: 'EDITION #15',
      title: 'Friction is<br/>also data',
      section1Title: 'THE OBSERVATORY',
      section1Body: `
        <p style="margin:0 0 14px; text-align:justify;">When a desired behavior does not happen, the old interpretation is usually moral: I lacked discipline, I did not care enough, I failed again.</p>
        <p style="margin:0 0 14px; text-align:justify;">INNERA treats that moment differently. It asks what friction the system encountered. Was the step too large? Was the cue invisible? Was the timing unrealistic? Was the social cost higher than expected?</p>
        <p style="margin:0 0 14px; text-align:justify;">The environment is not background. It is part of the behavior. A profile that ignores context will keep blaming character for design problems.</p>
        <p style="margin:0; text-align:justify;">Friction is not an excuse. It is the next design brief.</p>
      `,
      section2Title: 'THE SIGNAL',
      section2Body: `
        <p style="margin:0 0 10px; text-align:justify;"><strong>Signal to watch: if a useful behavior requires heroic effort every time, it is not designed yet.</strong> <span style="color:#666; font-size:14px;">(INNERA calibration note)</span></p>
        <p style="margin:0; text-align:justify;">Good design lowers the activation cost of the behavior you already know matters.</p>
      `,
      section3Title: 'FROM THE IBP',
      section3Body: `
        <p style="margin:0 0 14px; text-align:justify;">The FMI: Friction Map Index. A context scan that maps what makes the coherent choice easier or harder to access.</p>
        <p style="margin:0 0 14px; text-align:justify;">The FMI tracks distance, timing, energy, ambiguity, and social pressure. Each one can either protect the new pattern or feed the default one.</p>
        <p style="margin:0; text-align:justify;">When friction becomes visible, you can stop demanding more force and start changing the shape of the path.</p>
      `,
      section4Title: 'QUESTION OF THE WEEK',
      section4Quote: '"What useful behavior could you make 20 percent easier this week?"',
      section5Title: 'THE RESOURCE',
      section5Label: 'BEHAVIOR FRAMEWORK',
      section5Body: `<strong>Fogg Behavior Model</strong> — BJ Fogg`,
      section5Sub: 'A simple model for diagnosing behavior through motivation, ability, and prompts instead of relying on willpower as the whole explanation.',
      section5Url: 'https://www.behaviormodel.org/',
      section5Cta: 'Explore model →',
      footerLine: 'You are receiving this because you are part of the INNERA controlled calibration phase.',
      unsubscribe: 'If you no longer wish to receive The Inner Signal, reply to this email.',
    } : {
      preheader: 'El entorno no es fondo. Es parte del sistema.',
      headerLabel: 'INTELIGENCIA SEMANAL · BY THE INNERCODE CO.',
      editionLabel: 'EDICIÓN #15',
      title: 'La fricción también<br/>es información',
      section1Title: 'EL OBSERVATORIO',
      section1Body: `
        <p style="margin:0 0 14px; text-align:justify;">Cuando un comportamiento deseado no ocurre, la interpretación antigua suele ser moral: me faltó disciplina, no me importó lo suficiente, volví a fallar.</p>
        <p style="margin:0 0 14px; text-align:justify;">INNERA trata ese momento de otra forma. Pregunta qué fricción encontró el sistema. ¿El paso era demasiado grande? ¿La señal era invisible? ¿El horario era poco realista? ¿El costo social era más alto de lo esperado?</p>
        <p style="margin:0 0 14px; text-align:justify;">El entorno no es fondo. Es parte del comportamiento. Un perfil que ignora el contexto seguirá culpando al carácter por problemas de diseño.</p>
        <p style="margin:0; text-align:justify;">La fricción no es una excusa. Es el siguiente brief de diseño.</p>
      `,
      section2Title: 'LA SEÑAL',
      section2Body: `
        <p style="margin:0 0 10px; text-align:justify;"><strong>Señal a observar: si un comportamiento útil requiere esfuerzo heroico cada vez, todavía no está diseñado.</strong> <span style="color:#666; font-size:14px;">(Nota de calibración INNERA)</span></p>
        <p style="margin:0; text-align:justify;">Un buen diseño baja el costo de activación del comportamiento que ya sabes que importa.</p>
      `,
      section3Title: 'DESDE EL IBP',
      section3Body: `
        <p style="margin:0 0 14px; text-align:justify;">El FMI: Índice de Mapa de Fricción. Un escaneo de contexto que mapea qué vuelve más fácil o más difícil acceder a la elección coherente.</p>
        <p style="margin:0 0 14px; text-align:justify;">El FMI rastrea distancia, timing, energía, ambigüedad y presión social. Cada factor puede proteger el nuevo patrón o alimentar el default.</p>
        <p style="margin:0; text-align:justify;">Cuando la fricción se vuelve visible, puedes dejar de exigir más fuerza y empezar a cambiar la forma del camino.</p>
      `,
      section4Title: 'LA PREGUNTA DE LA SEMANA',
      section4Quote: '"¿Qué comportamiento útil podrías hacer 20 por ciento más fácil esta semana?"',
      section5Title: 'EL RECURSO',
      section5Label: 'FRAMEWORK CONDUCTUAL',
      section5Body: `<strong>Fogg Behavior Model</strong> — BJ Fogg`,
      section5Sub: 'Un modelo simple para diagnosticar el comportamiento desde motivación, habilidad y detonadores, sin usar fuerza de voluntad como única explicación.',
      section5Url: 'https://www.behaviormodel.org/',
      section5Cta: 'Explorar modelo →',
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
          <tr><td style="padding:0;" align="center"><img src="https://i.imgur.com/WMxMlxI.png" alt="INNERA" width="560" style="display:block; width:100%; max-width:560px; height:auto; border:0;" /></td></tr>
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
