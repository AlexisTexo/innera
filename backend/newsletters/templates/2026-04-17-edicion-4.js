module.exports = {
  subject: {
    en: 'The Inner Signal — Calibration: what coaches don\'t teach you',
    es: 'The Inner Signal — Calibración: lo que los coaches no te enseñan',
  },

  html: (user) => {
    const isEn = String(user.locale || 'en').startsWith('en');

    const i18n = isEn ? {
      preheader: 'A $20.7B industry — with sustainable results in less than 30% of cases.',
      headerLabel: 'WEEKLY INTELLIGENCE · BY THE INNERCODE CO.',
      editionLabel: 'EDITION #4',
      title: 'Calibration: what coaches<br/>don\'t teach you',
      section1Title: 'THE OBSERVATORY',
      section1Body: `
        <p style="margin:0 0 14px; text-align:justify;">The coaching industry has a structural problem: it teaches behaviors without mapping the system that generates them.</p>
        <p style="margin:0 0 14px; text-align:justify;">A CEO who learns to "communicate better" without understanding their nervous regulation pattern is like installing a new interface on a defective operating system. The interface looks good. The system still crashes.</p>
        <p style="margin:0 0 14px; text-align:justify;">Behavior change without system mapping produces surface-level results. You perform the new behavior under optimal conditions. Under pressure, under fatigue, under uncertainty — the old pattern takes over. Because the system was never recalibrated. Only the output was changed.</p>
        <p style="margin:0; text-align:justify;">Calibration is not about learning new behaviors. It's about understanding what drives the current ones.</p>
      `,
      section2Title: 'THE SIGNAL',
      section2Body: `
        <p style="margin:0 0 10px; text-align:justify;"><strong>The global coaching market reached $20.7 billion in 2024, with an annual growth rate of 8.7%.</strong> <span style="color:#666; font-size:14px;">(ICF Global)</span></p>
        <p style="margin:0; text-align:justify;">Yet long-term effectiveness research (&gt;6 months) shows sustainable results in fewer than 30% of cases. A growing market doesn't mean a solved problem. It means an urgent one.</p>
      `,
      section3Title: 'FROM THE IBP',
      section3Body: `
        <p style="margin:0 0 14px; text-align:justify;">The ICE: Path Clarity Index. The difference between knowing what you want and knowing where you want it from.</p>
        <p style="margin:0 0 14px; text-align:justify;">The same goal, pursued from two different internal states, produces completely different results. Not because the goal changed — but because the system executing it was operating under different conditions.</p>
        <p style="margin:0; text-align:justify;">The ICE measures that distance. Between the declared goal and the internal state from which it's being pursued. That gap is where most coaching fails to look.</p>
      `,
      section4Title: 'QUESTION OF THE WEEK',
      section4Quote: '"Are you pursuing what you want — or what you think you should want?"',
      section5Title: 'THE RESOURCE',
      section5Label: 'RECOMMENDED READ',
      section5Body: `<strong>Self-Determination Theory</strong> — Deci & Ryan`,
      section5Sub: 'The science behind intrinsic vs. extrinsic motivation and its relationship to the sustainability of change. Foundation of the ICE index.',
      section5Url: 'https://selfdeterminationtheory.org',
      section5Cta: 'Explore →',
      footerLine: 'You are receiving this because you are part of the INNERA controlled calibration phase.',
      unsubscribe: 'If you no longer wish to receive The Inner Signal, reply to this email.',
    } : {
      preheader: 'Un mercado de $20.7 mil millones — con resultados sostenibles en menos del 30% de los casos.',
      headerLabel: 'INTELIGENCIA SEMANAL · BY THE INNERCODE CO.',
      editionLabel: 'EDICIÓN #4',
      title: 'Calibración: lo que los<br/>coaches no te enseñan',
      section1Title: 'EL OBSERVATORIO',
      section1Body: `
        <p style="margin:0 0 14px; text-align:justify;">La industria del coaching tiene un problema estructural: enseña conductas sin mapear el sistema que las genera.</p>
        <p style="margin:0 0 14px; text-align:justify;">Un CEO que aprende a "comunicar mejor" sin entender su patrón de regulación nerviosa es como instalar una interfaz nueva sobre un sistema operativo defectuoso. La interfaz se ve bien. El sistema sigue fallando.</p>
        <p style="margin:0 0 14px; text-align:justify;">El cambio de conducta sin mapeo del sistema produce resultados superficiales. Ejecutas la conducta nueva en condiciones óptimas. Bajo presión, bajo fatiga, bajo incertidumbre — el patrón antiguo toma el control. Porque el sistema nunca fue recalibrado. Solo se cambió el output.</p>
        <p style="margin:0; text-align:justify;">Calibrar no es aprender conductas nuevas. Es entender qué genera las actuales.</p>
      `,
      section2Title: 'LA SEÑAL',
      section2Body: `
        <p style="margin:0 0 10px; text-align:justify;"><strong>El mercado global de coaching alcanzó $20.7 mil millones en 2024, con una tasa de crecimiento anual del 8.7%.</strong> <span style="color:#666; font-size:14px;">(ICF Global)</span></p>
        <p style="margin:0; text-align:justify;">Y sin embargo, la investigación de efectividad a largo plazo (&gt;6 meses) muestra resultados sostenibles en menos del 30% de los casos. Un mercado en crecimiento no significa un problema resuelto. Significa uno urgente.</p>
      `,
      section3Title: 'DESDE EL IBP',
      section3Body: `
        <p style="margin:0 0 14px; text-align:justify;">El ICE: Índice de Claridad de Camino. La diferencia entre saber qué quieres y saber desde dónde lo quieres.</p>
        <p style="margin:0 0 14px; text-align:justify;">El mismo objetivo, perseguido desde dos estados internos diferentes, produce resultados completamente distintos. No porque el objetivo cambió — sino porque el sistema que lo ejecuta estaba operando bajo condiciones diferentes.</p>
        <p style="margin:0; text-align:justify;">El ICE mide esa distancia. Entre el objetivo declarado y el estado interno desde el que se persigue. Ahí es donde la mayoría del coaching no mira.</p>
      `,
      section4Title: 'LA PREGUNTA DE LA SEMANA',
      section4Quote: '"¿Estás persiguiendo lo que quieres, o lo que crees que deberías querer?"',
      section5Title: 'EL RECURSO',
      section5Label: 'LECTURA RECOMENDADA',
      section5Body: `<strong>Self-Determination Theory</strong> — Deci & Ryan`,
      section5Sub: 'La ciencia detrás de la motivación intrínseca vs. extrínseca y su relación con la sostenibilidad de los cambios. Base del índice ICE.',
      section5Url: 'https://selfdeterminationtheory.org',
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
