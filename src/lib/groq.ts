const GROQ_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama-3.3-70b-versatile";
const GEMINI_OPENAI_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions";
const DEFAULT_GEMINI_MODEL = "gemini-2.5-flash";

export type GroqChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

type AiProvider = { type: "groq" | "gemini"; key: string };

function isLikelyGoogleApiKey(value: string): boolean {
  return value.startsWith("AIza");
}

function getGeminiModel(): string {
  return (
    process.env.GEMINI_MODEL?.trim() ||
    process.env.GOOGLE_AI_MODEL?.trim() ||
    DEFAULT_GEMINI_MODEL
  );
}

function getAiProviders(): AiProvider[] {
  const groqKey = process.env.GROQ_API_KEY?.trim() ?? "";
  const fallbackKey = process.env.GROQ_API_KEY_FALLBACK?.trim() ?? "";
  const geminiKey =
    process.env.GEMINI_API_KEY?.trim() ||
    process.env.GOOGLE_API_KEY?.trim() ||
    "";

  const providers: AiProvider[] = [];

  if (groqKey) {
    providers.push({ type: "groq", key: groqKey });
  }

  const inferredGeminiKey =
    geminiKey || (fallbackKey && isLikelyGoogleApiKey(fallbackKey) ? fallbackKey : "");

  if (inferredGeminiKey) {
    providers.push({ type: "gemini", key: inferredGeminiKey });
  }

  if (fallbackKey && !inferredGeminiKey && fallbackKey !== groqKey) {
    providers.push({ type: "groq", key: fallbackKey });
  }

  return providers;
}

export function hasGroqApiKey(): boolean {
  return getAiProviders().length > 0;
}

export async function requestGroqCompletion(
  messages: GroqChatMessage[],
  options?: {
    temperature?: number;
    maxTokens?: number;
  }
): Promise<string> {
  const providers = getAiProviders();
  if (!providers.length) {
    throw new Error("No AI API keys configured (GROQ_API_KEY/GROQ_API_KEY_FALLBACK or GEMINI_API_KEY missing)");
  }

  const temperature = options?.temperature ?? 0.7;
  const maxTokens = options?.maxTokens ?? 900;
  let lastError: Error | null = null;

  for (const provider of providers) {
    try {
      if (provider.type === "groq") {
        return await requestGroq(messages, temperature, maxTokens, provider.key);
      }

      return await requestGemini(messages, temperature, maxTokens, provider.key);
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      continue;
    }
  }

  if (lastError) {
    throw lastError;
  }

  throw new Error("AI request failed with all available API keys");
}

async function requestGroq(
  messages: GroqChatMessage[],
  temperature: number,
  maxTokens: number,
  apiKey: string
): Promise<string> {
  const upstream = await fetch(GROQ_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      temperature,
      max_tokens: maxTokens,
      messages
    })
  });

  if (upstream.ok) {
    const completion = (await upstream.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };

    if (completion.choices?.[0]?.message?.content) {
      return completion.choices[0].message.content;
    }

    throw new Error("No content in Groq response");
  }

  const errorBody = await upstream.text().catch(() => "");
  throw new Error(`Groq request failed (${upstream.status}): ${errorBody.slice(0, 240)}`);
}

async function requestGemini(
  messages: GroqChatMessage[],
  temperature: number,
  maxTokens: number,
  apiKey: string
): Promise<string> {
  const upstream = await fetch(GEMINI_OPENAI_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: getGeminiModel(),
      temperature,
      max_tokens: maxTokens,
      messages
    })
  });

  if (upstream.ok) {
    const completion = (await upstream.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };

    if (completion.choices?.[0]?.message?.content) {
      return completion.choices[0].message.content;
    }

    throw new Error("No content in Gemini response");
  }

  const errorBody = await upstream.text().catch(() => "");
  throw new Error(`Gemini request failed (${upstream.status}): ${errorBody.slice(0, 240)}`);
}

export function extractGroqJson(raw: string): unknown {
  const cleaned = raw.replace(/```json|```/gi, "").trim();
  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");

  if (firstBrace < 0 || lastBrace <= firstBrace) {
    throw new Error("No JSON object found in Groq response");
  }

  return JSON.parse(cleaned.slice(firstBrace, lastBrace + 1));
}
