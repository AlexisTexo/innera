module.exports = {
  subject: {
    en: 'The Inner Signal — Your relationships have a nervous system',
    es: 'The Inner Signal — Tus relaciones tienen sistema nervioso',
  },

  html: (user) => {
    const isEn = String(user.locale || 'en').startsWith('en');

    const i18n = isEn ? {
      preheader: 'You do not bring the same self into every room. The field changes the system.',
      headerLabel: 'WEEKLY INTELLIGENCE · BY THE INNERCODE CO.',
      editionLabel: 'EDITION #11',
      title: 'Your relationships have<br/>a nervous system',
      section1Title: 'THE OBSERVATORY',
      section1Body: `
        <p style="margin:0 0 14px; text-align:justify;">You are not the same person in every relationship. That is not hypocrisy. It is system response.</p>
        <p style="margin:0 0 14px; text-align:justify;">Some rooms widen you. You think more clearly, speak more truthfully, and recover faster after friction. Other rooms narrow you. You over-explain, perform, defend, or disappear before you notice the shift.</p>
        <p style="margin:0 0 14px; text-align:justify;">A relationship is not only a story between two people. It is a field that either increases or decreases access to your own coherence.</p>
        <p style="margin:0; text-align:justify;">This matters because inner work done in isolation can look mature until it touches another nervous system. The real calibration appears in contact.</p>
      `,
      section2Title: 'THE SIGNAL',
      section2Body: `
        <p style="margin:0 0 10px; text-align:justify;"><strong>Signal to watch: if your clarity only exists when nobody disagrees with you, it is not yet relational clarity. It is private certainty.</strong> <span style="color:#666; font-size:14px;">(INNERA calibration note)</span></p>
        <p style="margin:0; text-align:justify;">The goal is not to stay perfectly calm. The goal is to notice which fields make truth harder to access and which ones make it safer to practice.</p>
      `,
      section3Title: 'FROM THE IBP',
      section3Body: `
        <p style="margin:0 0 14px; text-align:justify;">The RFI: Relational Field Index. A map of how your internal system changes across the relationships, teams, and environments that matter most.</p>
        <p style="margin:0 0 14px; text-align:justify;">The RFI looks at four movements: expansion, contraction, performance, and withdrawal. None of them is morally good or bad. Each one is information about what your system believes is required to stay connected.</p>
        <p style="margin:0; text-align:justify;">When that pattern is visible, you can stop blaming the room and start choosing your participation in it with more precision.</p>
      `,
      section4Title: 'QUESTION OF THE WEEK',
      section4Quote: '"Who gets the most coherent version of you — and who gets the most defended one?"',
      section5Title: 'THE RESOURCE',
      section5Label: 'RECOMMENDED READ',
      section5Body: `<strong>What is Nonviolent Communication?</strong> — Center for Nonviolent Communication`,
      section5Sub: 'A clear introduction to observation, feeling, need, and request as a practical architecture for cleaner relational signal.',
      section5Url: 'https://www.cnvc.org/learn/what-is-nvc',
      section5Cta: 'Read →',
      footerLine: 'You are receiving this because you are part of the INNERA controlled calibration phase.',
      unsubscribe: 'If you no longer wish to receive The Inner Signal, reply to this email.',
    } : {
      preheader: 'No llevas el mismo yo a todos los espacios. El campo cambia el sistema.',
      headerLabel: 'INTELIGENCIA SEMANAL · BY THE INNERCODE CO.',
      editionLabel: 'EDICIÓN #11',
      title: 'Tus relaciones tienen<br/>sistema nervioso',
      section1Title: 'EL OBSERVATORIO',
      section1Body: `
        <p style="margin:0 0 14px; text-align:justify;">No eres la misma persona en todas tus relaciones. Eso no es hipocresía. Es respuesta del sistema.</p>
        <p style="margin:0 0 14px; text-align:justify;">Hay espacios que te expanden. Piensas con más claridad, hablas con más verdad y te recuperas más rápido después de la fricción. Otros espacios te estrechan. Sobreexplicas, actúas, te defiendes o desapareces antes de notar el cambio.</p>
        <p style="margin:0 0 14px; text-align:justify;">Una relación no es solo una historia entre dos personas. Es un campo que aumenta o disminuye el acceso a tu propia coherencia.</p>
        <p style="margin:0; text-align:justify;">Esto importa porque el trabajo interior hecho en aislamiento puede parecer maduro hasta que toca otro sistema nervioso. La calibración real aparece en contacto.</p>
      `,
      section2Title: 'LA SEÑAL',
      section2Body: `
        <p style="margin:0 0 10px; text-align:justify;"><strong>Señal a observar: si tu claridad solo existe cuando nadie está en desacuerdo contigo, todavía no es claridad relacional. Es certeza privada.</strong> <span style="color:#666; font-size:14px;">(Nota de calibración INNERA)</span></p>
        <p style="margin:0; text-align:justify;">El objetivo no es mantener calma perfecta. El objetivo es notar qué campos hacen más difícil acceder a la verdad y cuáles la vuelven más segura de practicar.</p>
      `,
      section3Title: 'DESDE EL IBP',
      section3Body: `
        <p style="margin:0 0 14px; text-align:justify;">El RFI: Índice de Campo Relacional. Un mapa de cómo cambia tu sistema interior en las relaciones, equipos y entornos que más importan.</p>
        <p style="margin:0 0 14px; text-align:justify;">El RFI observa cuatro movimientos: expansión, contracción, performance y retirada. Ninguno es moralmente bueno o malo. Cada uno es información sobre lo que tu sistema cree necesario para mantenerse conectado.</p>
        <p style="margin:0; text-align:justify;">Cuando ese patrón se vuelve visible, puedes dejar de culpar al espacio y empezar a elegir tu participación en él con más precisión.</p>
      `,
      section4Title: 'LA PREGUNTA DE LA SEMANA',
      section4Quote: '"¿Quién recibe la versión más coherente de ti — y quién recibe la más defendida?"',
      section5Title: 'EL RECURSO',
      section5Label: 'LECTURA RECOMENDADA',
      section5Body: `<strong>What is Nonviolent Communication?</strong> — Center for Nonviolent Communication`,
      section5Sub: 'Una introducción clara a observación, sentimiento, necesidad y petición como arquitectura práctica para una señal relacional más limpia.',
      section5Url: 'https://www.cnvc.org/learn/what-is-nvc',
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
          <tr><td style="padding:0;" align="center"><img src="https://i.imgur.com/8Sb6UQz.png" alt="INNERA" width="560" style="display:block; width:100%; max-width:560px; height:auto; border:0;" /></td></tr>
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
