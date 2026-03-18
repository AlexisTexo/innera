// src/utils/activationLanguage.ts

const HYPER = [
  'abrumad', 'ansios', 'ansiedad', 'panico', 'estres',
  'rumi', 'sobrepens', 'no paro', 'no puedo parar', 'hipervigil', 'tension',
  'culpa', 'miedo', 'amenaza', 'me urge', 'urgente', 'catastrof', 'terrible',
  'me voy a morir', 'todo mal', 'descontrol', 'insoportable', 'me supera',
  'taquicardia', 'tembl', 'sudor', 'me asfixio', 'me falta el aire'
];

const HYPO = [
  'vacio', 'sin ganas', 'apagado', 'apagad', 'numb', 'entum',
  'me da igual', 'indifer', 'no siento', 'desconect', 'bloquead', 'paraliz',
  'cansad', 'fatig', 'agotad', 'sin energia', 'lento',
  'triste', 'deprim', 'me cuesta', 'no puedo levantarme', 'aislad', 'evito',
  'sin motivacion'
];

const INTENSIFIERS = [
  'muy', 'demasiado', 'super', 'extremadamente', 'totalmente', 'por completo',
  'siempre', 'nunca', 'todo', 'nada'
];

const NEGATIONS = ['no', 'nunca', 'jamas'];

export type ActivationLabel = 'Hyperactivation' | 'Hypoactivation' | 'Neutral';

export type ActivationResult = {
  label: ActivationLabel;
  hyperScore: number;
  hypoScore: number;
  confidence: number; // 0..1
  deltaNSI: -3 | 0 | 3;
};

export function normalize(text: string) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// tokeniza en palabras
function tokenize(t: string) {
  return t.split(' ').filter(Boolean);
}

// frases (con espacios) -> includes
function countPhraseHits(t: string, stems: string[]) {
  let hits = 0;
  for (const s of stems) {
    if (s.includes(' ') && t.includes(s)) hits += 1;
  }
  return hits;
}

// stems/palabras -> match por inicio de token (abrumad -> abrumado/abrumada)
function countTokenStemHits(tokens: string[], stems: string[]) {
  let hits = 0;
  for (const s of stems) {
    if (s.includes(' ')) continue;
    if (tokens.some(tok => tok.startsWith(s))) hits += 1;
  }
  return hits;
}

// negación: si aparece en ventana previa a un término detectado
function negationPenalty(tokens: string[], stems: string[], window = 4) {
  const stemSet = stems.filter(s => !s.includes(' '));
  let penalize = 0;

  for (let i = 0; i < tokens.length; i++) {
    const tok = tokens[i];
    const isNeg = NEGATIONS.includes(tok);
    if (!isNeg) continue;

    const start = i + 1;
    const end = Math.min(tokens.length, i + 1 + window);
    const slice = tokens.slice(start, end);

    const nearHit = slice.some(w => stemSet.some(s => w.startsWith(s)));
    if (nearHit) penalize = 1; // con 1 basta
  }

  return penalize;
}

function countIntensifiers(tokens: string[]) {
  return tokens.reduce((acc, t) => acc + (INTENSIFIERS.includes(t) ? 1 : 0), 0);
}

export function classifyActivation(raw: string): ActivationResult {
  const t = normalize(raw);
  if (!t) {
    return { label: 'Neutral', hyperScore: 0, hypoScore: 0, confidence: 0, deltaNSI: 0 };
  }

  const tokens = tokenize(t);

  // hits por frases + stems
  let hyperScore = countPhraseHits(t, HYPER) + countTokenStemHits(tokens, HYPER);
  let hypoScore  = countPhraseHits(t, HYPO)  + countTokenStemHits(tokens, HYPO);

  // intensificadores
  const intens = countIntensifiers(tokens);
  if (intens > 0) {
    if (hyperScore > 0) hyperScore += Math.min(2, intens);
    if (hypoScore > 0)  hypoScore  += Math.min(2, intens);
  }

  // negación contextual
  const hyperNeg = negationPenalty(tokens, HYPER, 4);
  const hypoNeg  = negationPenalty(tokens, HYPO, 4);
  hyperScore = Math.max(0, hyperScore - hyperNeg);
  hypoScore  = Math.max(0, hypoScore  - hypoNeg);

  const diff = Math.abs(hyperScore - hypoScore);
  const total = hyperScore + hypoScore;
  const confidence = total === 0 ? 0 : Math.min(1, diff / Math.max(1, total));

  let label: ActivationLabel = 'Neutral';
  if (hyperScore >= 2 && hyperScore > hypoScore) label = 'Hyperactivation';
  if (hypoScore >= 2 && hypoScore > hyperScore) label = 'Hypoactivation';

  const deltaNSI: -3 | 0 | 3 =
    label === 'Hyperactivation' ? 3 :
    label === 'Hypoactivation' ? -3 :
    0;

  return { label, hyperScore, hypoScore, confidence, deltaNSI };
}