module.exports = {
  subject: {
    en: 'The Inner Signal — What we learned from the first 50 users',
    es: 'The Inner Signal — Lo que aprendimos de los primeros 50 usuarios',
  },

  html: (user) => {
    const isEn = String(user.locale || 'en').startsWith('en');

    const i18n = isEn ? {
      preheader: '78% of IBP profiles: the functional archetype under pressure differed from the declared one.',
      headerLabel: 'WEEKLY INTELLIGENCE · BY THE INNERCODE CO.',
      editionLabel: 'EDITION #5',
      title: 'What we learned from<br/>the first 50 users',
      section1Title: 'THE OBSERVATORY',
      section1Body: `
        <p style="margin:0 0 14px; text-align:justify;">No names. No direct testimonials. What follows is a pattern analysis — five recurring observations from the first 50 IBP profiles completed in INNERA's calibration phase.</p>
        <p style="margin:0 0 14px; text-align:justify;"><strong>Pattern 1:</strong> The gap between declared dominant archetype and functional archetype. Most users self-report operating from one archetype. The IBP consistently maps a different one — especially under pressure conditions.</p>
        <p style="margin:0 0 14px; text-align:justify;"><strong>Pattern 2:</strong> The NSI (Nervous System Index) as a predictor of decision quality. Users with lower NSI scores showed measurably narrower decision ranges — fewer options considered, shorter time horizons, higher reactivity.</p>
        <p style="margin:0 0 14px; text-align:justify;"><strong>Pattern 3:</strong> The ICI (Interior Climate Index) proved more predictive of weekly coherence than any self-reported mood metric.</p>
        <p style="margin:0 0 14px; text-align:justify;"><strong>Pattern 4:</strong> Restoration patterns diverged significantly from user expectations. What people thought restored them and what actually did were different in 6 out of 10 profiles.</p>
        <p style="margin:0; text-align:justify;"><strong>Pattern 5:</strong> The most consistent predictor of high weekly coherence was not productivity — it was nervous system regulation during the first 90 minutes of the day.</p>
      `,
      section2Title: 'THE SIGNAL',
      section2Body: `
        <p style="margin:0 0 10px; text-align:justify;"><strong>In 78% of beta IBP profiles, the functional archetype under pressure differed significantly from the declared archetype in self-report.</strong> <span style="color:#666; font-size:14px;">(Internal data, anonymized, INNERA beta)</span></p>
        <p style="margin:0; text-align:justify;">What you think you do under pressure and what you actually do are frequently two different things. The IBP doesn't ask — it observes.</p>
      `,
      section3Title: 'FROM THE IBP',
      section3Body: `
        <p style="margin:0 0 14px; text-align:justify;">The NSI: Nervous System Index. The state of your autonomic nervous system is the filter through which you process all information, all relationships, all decisions.</p>
        <p style="margin:0 0 14px; text-align:justify;">When the NSI is low — meaning your nervous system is in a threat or shutdown state — your cognitive range narrows. You see fewer options. You act faster and with less information. You mistake urgency for clarity.</p>
        <p style="margin:0; text-align:justify;">This is not a weakness. It's biology. The IBP maps it so you can work with it instead of against it.</p>
      `,
      section4Title: 'QUESTION OF THE WEEK',
      section4Quote: '"Can you distinguish, right now, whether you are responding from safety or from perceived threat?"',
      section5Title: 'THE RESOURCE',
      section5Label: 'RECOMMENDED WATCH',
      section5Body: `<strong>Somatic Marker Hypothesis</strong> — António Damásio`,
      section5Sub: 'Why emotions are information, not interference. The neuroscientific case for why your body\'s signals are a critical input in rational decision-making.',
      section5Url: 'https://www.ted.com/talks/antonio_damasio_the_quest_to_understand_consciousness',
      section5Cta: 'Watch →',
      footerLine: 'You are receiving this because you are part of the INNERA controlled calibration phase.',
      unsubscribe: 'If you no longer wish to receive The Inner Signal, reply to this email.',
    } : {
      preheader: 'En el 78% de los perfiles IBP, el arquetipo funcional bajo presión difirió del declarado.',
      headerLabel: 'INTELIGENCIA SEMANAL · BY THE INNERCODE CO.',
      editionLabel: 'EDICIÓN #5',
      title: 'Lo que aprendimos de<br/>los primeros 50 usuarios',
      section1Title: 'EL OBSERVATORIO',
      section1Body: `
        <p style="margin:0 0 14px; text-align:justify;">Sin nombres. Sin testimonios directos. Lo que sigue es un análisis de patrones — cinco observaciones recurrentes en los primeros 50 perfiles IBP completados en la fase de calibración de INNERA.</p>
        <p style="margin:0 0 14px; text-align:justify;"><strong>Patrón 1:</strong> La brecha entre el arquetipo dominante declarado y el arquetipo funcional real. La mayoría de usuarios reporta operar desde un arquetipo. El IBP mapea consistentemente uno diferente — especialmente bajo condiciones de presión.</p>
        <p style="margin:0 0 14px; text-align:justify;"><strong>Patrón 2:</strong> El NSI (Índice del Sistema Nervioso) como predictor de calidad de decisión. Los usuarios con NSI bajo mostraron rangos de decisión mediblemente más estrechos — menos opciones consideradas, horizontes temporales más cortos, mayor reactividad.</p>
        <p style="margin:0 0 14px; text-align:justify;"><strong>Patrón 3:</strong> El ICI (Índice de Clima Interior) resultó más predictivo de la coherencia semanal que cualquier métrica de estado de ánimo autorreportado.</p>
        <p style="margin:0 0 14px; text-align:justify;"><strong>Patrón 4:</strong> Los patrones de restauración divergieron significativamente de las expectativas del usuario. Lo que las personas creían que las restauraba y lo que realmente lo hacía eran diferentes en 6 de cada 10 perfiles.</p>
        <p style="margin:0; text-align:justify;"><strong>Patrón 5:</strong> El predictor más consistente de alta coherencia semanal no fue la productividad — fue la regulación del sistema nervioso durante los primeros 90 minutos del día.</p>
      `,
      section2Title: 'LA SEÑAL',
      section2Body: `
        <p style="margin:0 0 10px; text-align:justify;"><strong>En el 78% de los perfiles IBP de la beta, el arquetipo funcional real bajo presión difería significativamente del arquetipo declarado en autoinforme.</strong> <span style="color:#666; font-size:14px;">(Datos internos, anonimizados, beta INNERA)</span></p>
        <p style="margin:0; text-align:justify;">Lo que crees que haces bajo presión y lo que realmente haces son frecuentemente dos cosas diferentes. El IBP no pregunta — observa.</p>
      `,
      section3Title: 'DESDE EL IBP',
      section3Body: `
        <p style="margin:0 0 14px; text-align:justify;">El NSI: Índice del Sistema Nervioso. El estado de tu sistema nervioso autónomo es el filtro a través del cual procesas toda la información, toda la relación, toda la decisión.</p>
        <p style="margin:0 0 14px; text-align:justify;">Cuando el NSI es bajo — es decir, cuando tu sistema nervioso está en estado de amenaza o cierre — tu rango cognitivo se estrecha. Ves menos opciones. Actúas más rápido y con menos información. Confundes urgencia con claridad.</p>
        <p style="margin:0; text-align:justify;">No es una debilidad. Es biología. El IBP lo mapea para que puedas trabajar con ello en lugar de contra ello.</p>
      `,
      section4Title: 'LA PREGUNTA DE LA SEMANA',
      section4Quote: '"¿Puedes distinguir, en este momento, si estás respondiendo desde seguridad o desde amenaza percibida?"',
      section5Title: 'EL RECURSO',
      section5Label: 'RECURSO RECOMENDADO',
      section5Body: `<strong>The quest to understand consciousness</strong> — António Damásio`,
      section5Sub: 'Por qué las emociones son información, no interferencia. El argumento neurocientífico de por qué las señales de tu cuerpo son un input crítico en la toma de decisiones racional.',
      section5Url: 'https://www.ted.com/talks/antonio_damasio_the_quest_to_understand_consciousness',
      section5Cta: 'Ver →',
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
          <tr><td style="padding:0;" align="center"><img src="https://i.imgur.com/s2hOTs3.png" alt="INNERA" width="560" style="display:block; width:100%; max-width:560px; height:auto; border:0;" /></td></tr>
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
