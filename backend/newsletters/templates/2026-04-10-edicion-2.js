module.exports = {
  subject: {
    en: 'The Inner Signal — The system you never documented',
    es: 'The Inner Signal — El sistema que no documentaste',
  },

  html: (user) => {
    const isEn = String(user.locale || 'en').startsWith('en');

    const i18n = isEn ? {
      preheader: '35,000 decisions a day. Less than 1% conscious.',
      headerLabel: 'WEEKLY INTELLIGENCE · BY THE INNERCODE CO.',
      editionLabel: 'EDITION #2',
      title: 'The system you<br/>never documented',
      section1Title: 'THE OBSERVATORY',
      section1Body: `
        <p style="margin:0 0 14px; text-align:justify;">Every company running at scale uses an ERP — an enterprise resource planning system. It maps processes, flags inefficiencies, documents what actually happens versus what's supposed to happen. Without it, decisions are made on assumption.</p>
        <p style="margin:0 0 14px; text-align:justify;">Your mind works the same way. It runs on patterns — predictable, repeatable, mostly invisible. The problem isn't that the system is broken. The problem is that it was never documented.</p>
        <p style="margin:0 0 14px; text-align:justify;">Most people operate on an undocumented internal system. They react, decide, relate, and restore according to patterns they can't name, from rules they never consciously chose, shaped by experiences they don't fully remember.</p>
        <p style="margin:0; text-align:justify;">The difference between a broken system and an undocumented one matters: you can't fix what was never mapped. INNERA is the documentation layer for your inner operating system.</p>
      `,
      section2Title: 'THE SIGNAL',
      section2Body: `
        <p style="margin:0 0 10px; text-align:justify;"><strong>People make an average of 35,000 decisions per day — but are conscious of fewer than 1% of them.</strong> <span style="color:#666; font-size:14px;">(Cornell University, cognitive research)</span></p>
        <p style="margin:0; text-align:justify;">99% of your decisions are made by your internal system — without your conscious review. The question is not whether you have a system. The question is whether you know what it's running on.</p>
      `,
      section3Title: 'FROM THE IBP',
      section3Body: `
        <p style="margin:0 0 14px; text-align:justify;">The ICI: Interior Climate Index. How INNERA measures your real emotional-cognitive state in real time — not the one you'd report on a survey.</p>
        <p style="margin:0 0 14px; text-align:justify;">Most self-reporting tools measure perception. The ICI measures pattern. There's a fundamental difference: how you feel right now is a data point. How you consistently feel across time, context, and pressure — that's signal.</p>
        <p style="margin:0; text-align:justify;">Next week: why the IBP doesn't work like a personality test — and why that distinction matters.</p>
      `,
      section4Title: 'QUESTION OF THE WEEK',
      section4Quote: '"What behavioral pattern do you recognize in yourself that your rational mind doesn\'t understand — but your body already knows?"',
      section5Title: 'THE RESOURCE',
      section5Label: 'RECOMMENDED READ',
      section5Body: `<strong>The Polyvagal Theory</strong> — Stephen Porges, Polyvagal Institute`,
      section5Sub: 'The scientific foundation of the NSI (Nervous System Index) in the IBP. How the autonomic nervous system shapes every decision under stress.',
      section5Url: 'https://www.polyvagalinstitute.org',
      section5Cta: 'Explore →',
      footerLine: 'You are receiving this because you are part of the INNERA controlled calibration phase.',
      unsubscribe: 'If you no longer wish to receive The Inner Signal, reply to this email.',
    } : {
      preheader: '35,000 decisiones al día. Menos del 1% conscientes.',
      headerLabel: 'INTELIGENCIA SEMANAL · BY THE INNERCODE CO.',
      editionLabel: 'EDICIÓN #2',
      title: 'El sistema que<br/>no documentaste',
      section1Title: 'EL OBSERVATORIO',
      section1Body: `
        <p style="margin:0 0 14px; text-align:justify;">Toda empresa que opera a escala usa un ERP — un sistema de planificación de recursos empresariales. Mapea procesos, detecta ineficiencias, documenta lo que realmente pasa versus lo que debería pasar. Sin él, las decisiones se toman sobre suposiciones.</p>
        <p style="margin:0 0 14px; text-align:justify;">Tu mente funciona igual. Opera en patrones — predecibles, repetibles, casi siempre invisibles. El problema no es que el sistema esté roto. El problema es que nunca fue documentado.</p>
        <p style="margin:0 0 14px; text-align:justify;">La mayoría de las personas operan con un sistema interno no documentado. Reaccionan, deciden, se relacionan y se restauran según patrones que no pueden nombrar, desde reglas que nunca eligieron conscientemente, moldeados por experiencias que no recuerdan del todo.</p>
        <p style="margin:0; text-align:justify;">La diferencia entre un sistema roto y uno no documentado importa: no puedes arreglar lo que nunca fue mapeado. INNERA es la capa de documentación para tu sistema operativo interior.</p>
      `,
      section2Title: 'LA SEÑAL',
      section2Body: `
        <p style="margin:0 0 10px; text-align:justify;"><strong>Las personas toman un promedio de 35,000 decisiones al día, pero son conscientes de menos del 1% de ellas.</strong> <span style="color:#666; font-size:14px;">(Cornell University, investigación cognitiva)</span></p>
        <p style="margin:0; text-align:justify;">El 99% de tus decisiones las toma tu sistema interno — sin tu revisión consciente. La pregunta no es si tienes un sistema. La pregunta es si sabes sobre qué está corriendo.</p>
      `,
      section3Title: 'DESDE EL IBP',
      section3Body: `
        <p style="margin:0 0 14px; text-align:justify;">El ICI: Índice de Clima Interior. Cómo INNERA mide el estado emocional-cognitivo real en tiempo real — no el que reportarías en una encuesta.</p>
        <p style="margin:0 0 14px; text-align:justify;">La mayoría de herramientas de autorreporte miden percepción. El ICI mide patrón. Hay una diferencia fundamental: cómo te sientes ahora mismo es un dato. Cómo te sientes consistentemente a través del tiempo, el contexto y la presión — eso es señal.</p>
        <p style="margin:0; text-align:justify;">La semana que viene: por qué el IBP no funciona como un test de personalidad — y por qué esa distinción importa.</p>
      `,
      section4Title: 'LA PREGUNTA DE LA SEMANA',
      section4Quote: '"¿Qué patrón de comportamiento reconoces en ti que no entiende tu yo racional — pero que tu cuerpo sí reconoce?"',
      section5Title: 'EL RECURSO',
      section5Label: 'LECTURA RECOMENDADA',
      section5Body: `<strong>The Polyvagal Theory</strong> — Stephen Porges, Polyvagal Institute`,
      section5Sub: 'La base científica del NSI (Índice del Sistema Nervioso) en el IBP. Cómo el sistema nervioso autónomo moldea cada decisión bajo presión.',
      section5Url: 'https://share.google/WpOOZY6sk1kpEpqUM',
      section5Cta: 'Explorar →',
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
          <tr><td style="padding:0;" align="center"><img src="https://i.imgur.com/rnWJXss.png" alt="INNERA" width="560" style="display:block; width:100%; max-width:560px; height:auto; border:0;" /></td></tr>
          <tr><td style="padding:28px 24px 0; font-family:Arial, Helvetica, sans-serif;">
            <p style="margin:0 0 4px; font-size:11px; letter-spacing:2px; color:#888888; text-transform:uppercase;">THE INNER SIGNAL · ${i18n.editionLabel}</p>
            <h1 style="margin:6px 0 0; font-size:26px; font-weight:700; line-height:1.2; color:#121212;">${i18n.title}</h1>
          </td></tr>
          <tr><td style="padding:24px 24px 0;"><hr style="border:none; border-top:1px solid #e0e0e0; margin:0;" /></td></tr>
          <tr><td style="padding:24px 24px 0; font-family:Arial, Helvetica, sans-serif;">
            ${icon('&#9671;', '#E8973A', i18n.section1Title)}
            <div style="font-size:16px; line-height:1.7; color:#121212;">${i18n.section1Body}</div>
          </td></tr>
          <tr><td style="padding:24px 24px 0;"><hr style="border:none; border-top:1px solid #e0e0e0; margin:0;" /></td></tr>
          <tr><td style="padding:24px 24px 0; font-family:Arial, Helvetica, sans-serif;">
            ${icon('&#9671;', '#D4472B', i18n.section2Title)}
            <div style="font-size:15px; line-height:1.6; color:#121212; background-color:#f9f9f9; border-left:3px solid #D4472B; padding:16px 20px;">${i18n.section2Body}</div>
          </td></tr>
          <tr><td style="padding:24px 24px 0;"><hr style="border:none; border-top:1px solid #e0e0e0; margin:0;" /></td></tr>
          <tr><td style="padding:24px 24px 0; font-family:Arial, Helvetica, sans-serif;">
            ${icon('&#9650;', '#2AADA8', i18n.section3Title)}
            <div style="font-size:15px; line-height:1.7; color:#121212;">${i18n.section3Body}</div>
          </td></tr>
          <tr><td style="padding:24px 24px 0;"><hr style="border:none; border-top:1px solid #e0e0e0; margin:0;" /></td></tr>
          <tr><td style="padding:24px 24px 0; font-family:Arial, Helvetica, sans-serif;">
            ${icon('&#9675;', '#7B52D4', i18n.section4Title)}
            <div style="padding:20px 24px; background-color:#121212; border-radius:4px;">
              <p style="margin:0; font-size:17px; font-weight:700; line-height:1.5; color:#ffffff; font-style:italic; text-align:justify;">${i18n.section4Quote}</p>
            </div>
          </td></tr>
          <tr><td style="padding:24px 24px 0;"><hr style="border:none; border-top:1px solid #e0e0e0; margin:0;" /></td></tr>
          <tr><td style="padding:24px 24px 32px; font-family:Arial, Helvetica, sans-serif;">
            ${icon('&#9633;', '#3DB86A', i18n.section5Title)}
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border:1px solid #e0e0e0; border-radius:4px;">
              <tr><td style="padding:16px 20px;">
                <p style="margin:0 0 4px; font-size:11px; letter-spacing:1.5px; color:#888888; text-transform:uppercase;">${i18n.section5Label}</p>
                <p style="margin:6px 0 4px; font-size:15px; line-height:1.5; color:#121212; text-align:justify;">${i18n.section5Body}</p>
                <p style="margin:0 0 12px; font-size:13px; color:#666666; text-align:justify;">${i18n.section5Sub}</p>
                <a href="${i18n.section5Url}" target="_blank" style="display:inline-block; padding:8px 16px; background:#000; color:#fff; text-decoration:none; border-radius:4px; font-size:13px; font-weight:700;">${i18n.section5Cta}</a>
              </td></tr>
            </table>
          </td></tr>
          <tr><td style="background-color:#000000; padding:20px 24px 10px;" align="center">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
              <td style="padding:0 8px;"><a href="https://www.instagram.com/inneranet/" target="_blank" style="text-decoration:none;"><img src="https://img.icons8.com/ios-filled/50/FFFFFF/instagram-new.png" alt="Instagram" width="20" style="display:block; width:20px; height:20px; border:0;" /></a></td>
              <td style="padding:0 8px;"><a href="https://www.facebook.com/people/Innera/61588072216975/" target="_blank" style="text-decoration:none;"><img src="https://img.icons8.com/ios-filled/50/FFFFFF/facebook-new.png" alt="Facebook" width="20" style="display:block; width:20px; height:20px; border:0;" /></a></td>
              <td style="padding:0 8px;"><a href="https://x.com/InneraManager" target="_blank" style="text-decoration:none;"><img src="https://img.icons8.com/ios-filled/50/FFFFFF/twitterx--v1.png" alt="X" width="20" style="display:block; width:20px; height:20px; border:0;" /></a></td>
              <td style="padding:0 8px;"><a href="https://www.tiktok.com/@innera.net" target="_blank" style="text-decoration:none;"><img src="https://img.icons8.com/ios-filled/50/FFFFFF/tiktok--v1.png" alt="TikTok" width="20" style="display:block; width:20px; height:20px; border:0;" /></a></td>
              <td style="padding:0 8px;"><a href="https://www.linkedin.com/in/innera-net-0549253b2/" target="_blank" style="text-decoration:none;"><img src="https://img.icons8.com/ios-filled/50/FFFFFF/linkedin.png" alt="LinkedIn" width="20" style="display:block; width:20px; height:20px; border:0;" /></a></td>
            </tr></table>
          </td></tr>
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
