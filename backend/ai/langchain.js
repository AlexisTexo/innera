// ai/langchain.js
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";

/**
 * runPrompt({
 *   systemTemplate: string,
 *   userTemplate: string,
 *   vars: object,
 *   model?: string,
 *   temperature?: number,
 *   schema?: ZodSchema (opcional)
 * })
 *
 * Si pasas schema => devuelve JSON ya parseado y validado.
 * Si NO pasas schema => devuelve string.
 */
export async function runPrompt({
  systemTemplate,
  userTemplate,
  vars = {},
  model = "gpt-4o-mini",
  temperature = 0.4,
  schema,
}) {
  const llm = new ChatOpenAI({
    model,
    temperature,
    apiKey: process.env.OPENAI_API_KEY,
  });

  const prompt = ChatPromptTemplate.fromMessages([
    ["system", systemTemplate?.trim() || ""],
    ["human", userTemplate?.trim() || ""],
  ]);

  const chain = schema ? prompt.pipe(llm.withStructuredOutput(schema)) : prompt.pipe(llm);

  const out = await chain.invoke(vars);

  // Con schema, LangChain ya regresa el objeto.
  if (schema) return out;

  // Sin schema, ChatOpenAI retorna un AIMessage
  return typeof out === "string" ? out : (out?.content ?? "");
}
