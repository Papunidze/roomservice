import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { z } from "zod";

import type { LangCode } from "../domain.js";
import { env } from "../env.js";

const NAME: Record<LangCode, string> = {
  ar: "Arabic",
  fa: "Persian",
  tr: "Turkish",
  ru: "Russian",
  uk: "Ukrainian",
  he: "Hebrew",
  en: "English",
  de: "German",
  fr: "French",
  it: "Italian",
  es: "Spanish",
  pl: "Polish",
  pt: "Brazilian Portuguese",
  hi: "Hindi",
  zh: "Simplified Chinese",
  ka: "Georgian",
};

const SYSTEM =
  "You translate short messages between hotel guests and the front desk. Translate faithfully and naturally, keep the tone, and leave room numbers, times, prices, names and product names unchanged. Return only the translations.";

export type Translations = Partial<Record<LangCode, string>>;

const claude = env.ANTHROPIC_API_KEY
  ? new Anthropic({ apiKey: env.ANTHROPIC_API_KEY })
  : null;

export const isTranslationEnabled = () => env.TRANSLATOR !== "off";

async function translateWithClaude(
  client: Anthropic,
  text: string,
  from: LangCode,
  wanted: LangCode[],
): Promise<Translations> {
  const schema = z.object(
    Object.fromEntries(wanted.map((code) => [code, z.string()])),
  );
  const response = await client.messages.parse({
    model: "claude-opus-5",
    max_tokens: 2000,
    system: SYSTEM,
    output_config: { effort: "low", format: zodOutputFormat(schema) },
    messages: [
      {
        role: "user",
        content: `Source language: ${NAME[from]}.\nTranslate into: ${wanted
          .map((code) => `${code} = ${NAME[code]}`)
          .join(", ")}.\n\nText:\n${text}`,
      },
    ],
  });

  if (response.stop_reason === "refusal") return {};
  return (response.parsed_output ?? {}) as Translations;
}

const MYMEMORY_CODE: Partial<Record<LangCode, string>> = {
  pt: "pt-BR",
  zh: "zh-CN",
};

const myMemorySchema = z.object({
  responseStatus: z.coerce.number(),
  responseData: z.object({ translatedText: z.string() }),
});

async function translateWithMyMemory(
  text: string,
  from: LangCode,
  wanted: LangCode[],
): Promise<Translations> {
  const out: Translations = {};
  for (const code of wanted) {
    const params = new URLSearchParams({
      q: text,
      langpair: `${MYMEMORY_CODE[from] ?? from}|${MYMEMORY_CODE[code] ?? code}`,
    });
    if (env.MYMEMORY_EMAIL) params.set("de", env.MYMEMORY_EMAIL);

    const response = await fetch(
      `https://api.mymemory.translated.net/get?${params}`,
    );
    if (!response.ok) continue;
    const body = myMemorySchema.safeParse(await response.json());
    if (!body.success || body.data.responseStatus !== 200) continue;
    out[code] = body.data.responseData.translatedText;
  }
  return out;
}

export function translate(
  text: string,
  from: LangCode,
  targets: LangCode[],
): Promise<Translations> {
  const wanted = [...new Set(targets)].filter((code) => code !== from);
  if (!isTranslationEnabled() || wanted.length === 0)
    return Promise.resolve({});
  return claude
    ? translateWithClaude(claude, text, from, wanted)
    : translateWithMyMemory(text, from, wanted);
}
