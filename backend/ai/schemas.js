// ai/schemas.js
import { z } from "zod";

const baseIbpFields = {
  lifeCycles: z.string().describe("String breve en texto plano (sin ';')."),
  emotionalTendency: z.string().describe("String breve."),
  currentLifeTrend: z.string().describe("String breve."),
  suggestedApproach: z.string().describe("String breve y accionable (2-10 palabras)."),
  justify: z.string().describe("60-140 palabras."),
  facetas: z.array(z.string()).min(2).max(6).describe("2-6 strings."),
  archetypeWeight: z.record(z.number()).describe("Mapa {id: peso}, suma ≈10."),
  personalityWeight: z.record(z.number()).describe("Mapa {id: peso}, suma ≈10."),
};

export const ibpInitSchema = z.object({
  mode: z.literal("init"),
  ...baseIbpFields,
});

export const ibpUpdateSchema = z.object({
  mode: z.literal("update"),
  ...baseIbpFields,
});

export const logbookSchema = z.object({
  answer: z.string().describe("Párrafo breve (3–6 frases), cálido, sin diagnósticos clínicos."),
  emotionsDetected: z
    .array(z.string())
    .min(3)
    .max(5)
    .describe("3 a 5 emociones en minúsculas, sin repetir, sin emojis."),
});

export const triggerGenSchema = z.object({
  question: z.string().describe('Debe iniciar con "¿" y terminar con "?".'),
  practice: z.string().describe("Acción breve, 1 frase."),
  challenge: z.string().describe("Desafío práctico, 1 frase."),
});

export const weeklySummarySchema = z.object({
  emotions: z.array(z.string()).min(3).max(5),
  keywords: z.array(z.string()).min(3).max(7),
  centralTheme: z.string(),
  summaryText: z.string(),
});
