module.exports = {
  subject: {
    en: 'The Inner Signal — The bridge between insight and action',
    es: 'The Inner Signal — El puente entre insight y acción',
  },

  html: (user) => {
    const isEn = String(user.locale || 'en').startsWith('en');

    const i18n = isEn ? {
      preheader: 'A behavior with no when and where is still only a preference.',
      headerLabel: 'WEEKLY INTELLIGENCE · BY THE INNERCODE CO.',
      editionLabel: 'EDITION #14',
      title: 'The bridge between<br/>insight and action',
      section1Title: 'THE OBSERVATORY',
      section1Body: `
        <p style="margin:0 0 14px; text-align:justify;">Most insights fail in the space between clarity and execution. Not because they were false, but because they never received coordinates.</p>
        <p style="margin:0 0 14px; text-align:justify;">"I want to be more patient" is not yet a behavior. "Before I answer the first difficult message of the day, I will take one full breath and write the cleanest version of the reply" is closer to something the system can run.</p>
        <p style="margin:0 0 14px; text-align:justify;">A new self does not appear because the sentence is beautiful. It appears when the sentence becomes an action with a place, a time, and a trigger.</p>
        <p style="margin:0; text-align:justify;">Precision is not rigidity. It is kindness toward the future version of you who will need the instruction under pressure.</p>
      `,
      section2Title: 'THE SIGNAL',
      section2Body: `
        <p style="margin:0 0 10px; text-align:justify;"><strong>Signal to watch: the nervous system trusts what is specific enough to rehearse.</strong> <span style="color:#666; font-size:14px;">(INNERA calibration note)</span></p>
        <p style="margin:0; text-align:justify;">If the behavior is vague, the old pattern gets to decide the moment. If the behavior is anchored, choice has a doorway.</p>
      `,
      section3Title: 'FROM THE IBP',
      section3Body: `
        <p style="margin:0 0 14px; text-align:justify;">The BAS: Behavior Anchor System. The IBP layer that converts a profile insight into a concrete if-then or when-where action.</p>
        <p style="margin:0 0 14px; text-align:justify;">The BAS does not ask for a larger ambition. It asks for a smaller instruction: when this context appears, I will run this specific behavior.</p>
        <p style="margin:0; text-align:justify;">This is how calibration leaves the journal and enters the week.</p>
      `,
      section4Title: 'QUESTION OF THE WEEK',
      section4Quote: '"Where exactly will the new behavior live in your week?"',
      section5Title: 'THE RESOURCE',
      section5Label: 'PRACTICAL TOOL',
      section5Body: `<strong>Achieve Your Goals</strong> — James Clear`,
      section5Sub: 'A practical explanation of why when-and-where plans make behavior more likely than motivation alone.',
      section5Url: 'https://jamesclear.com/implementation-intentions',
      section5Cta: 'Build an intention →',
      footerLine: 'You are receiving this because you are part of the INNERA controlled calibration phase.',
      unsubscribe: 'If you no longer wish to receive The Inner Signal, reply to this email.',
    } : {
      preheader: 'Un comportamiento sin cuándo y dónde sigue siendo solo una preferencia.',
      headerLabel: 'INTELIGENCIA SEMANAL · BY THE INNERCODE CO.',
      editionLabel: 'EDICIÓN #14',
      title: 'El puente entre<br/>insight y acción',
      section1Title: 'EL OBSERVATORIO',
      section1Body: `
        <p style="margin:0 0 14px; text-align:justify;">La mayoría de los insights fallan en el espacio entre claridad y ejecución. No porque fueran falsos, sino porque nunca recibieron coordenadas.</p>
        <p style="margin:0 0 14px; text-align:justify;">"Quiero tener más paciencia" todavía no es un comportamiento. "Antes de responder el primer mensaje difícil del día, voy a tomar una respiración completa y escribir la versión más limpia de la respuesta" se acerca más a algo que el sistema puede ejecutar.</p>
        <p style="margin:0 0 14px; text-align:justify;">Un nuevo yo no aparece porque la frase sea bonita. Aparece cuando la frase se vuelve una acción con lugar, tiempo y detonador.</p>
        <p style="margin:0; text-align:justify;">La precisión no es rigidez. Es cuidado hacia la versión futura de ti que necesitará la instrucción bajo presión.</p>
      `,
      section2Title: 'LA SEÑAL',
      section2Body: `
        <p style="margin:0 0 10px; text-align:justify;"><strong>Señal a observar: el sistema nervioso confía en lo que es suficientemente específico para ensayar.</strong> <span style="color:#666; font-size:14px;">(Nota de calibración INNERA)</span></p>
        <p style="margin:0; text-align:justify;">Si el comportamiento es vago, el patrón antiguo decide el momento. Si el comportamiento está anclado, la elección tiene una puerta.</p>
      `,
      section3Title: 'DESDE EL IBP',
      section3Body: `
        <p style="margin:0 0 14px; text-align:justify;">El BAS: Sistema de Anclaje Conductual. La capa del IBP que convierte un insight del perfil en una acción concreta de si-entonces o cuándo-dónde.</p>
        <p style="margin:0 0 14px; text-align:justify;">El BAS no pide una ambición más grande. Pide una instrucción más pequeña: cuando aparezca este contexto, voy a ejecutar este comportamiento específico.</p>
        <p style="margin:0; text-align:justify;">Así es como la calibración sale del diario y entra en la semana.</p>
      `,
      section4Title: 'LA PREGUNTA DE LA SEMANA',
      section4Quote: '"¿Dónde exactamente va a vivir el nuevo comportamiento en tu semana?"',
      section5Title: 'EL RECURSO',
      section5Label: 'HERRAMIENTA PRÁCTICA',
      section5Body: `<strong>Implementation Intentions</strong> — James Clear`,
      section5Sub: 'Una explicación práctica de por qué los planes con cuándo y dónde vuelven más probable el comportamiento que la motivación sola.',
      section5Url: 'https://jamesclear.com/implementation-intentions',
      section5Cta: 'Crear intención →',
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
