const GROQ_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama-3.3-70b-versatile";

export type GroqChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

function getGroqApiKeys(): { primary: string; fallback: string } {
  return {
    primary: process.env.GROQ_API_KEY?.trim() ?? "",
    fallback: process.env.GROQ_API_KEY_FALLBACK?.trim() ?? ""
  };
}

export function hasGroqApiKey(): boolean {
  const keys = getGroqApiKeys();
  return Boolean(keys.primary || keys.fallback);
}

export async function requestGroqCompletion(
  messages: GroqChatMessage[],
  options?: {
    temperature?: number;
    maxTokens?: number;
  }
): Promise<string> {
  const keys = getGroqApiKeys();
  if (!keys.primary && !keys.fallback) {
    throw new Error("No Groq API keys configured (GROQ_API_KEY and GROQ_API_KEY_FALLBACK missing)");
  }

  const keysToTry = [keys.primary, keys.fallback].filter(Boolean);
  let lastError: Error | null = null;

  for (const apiKey of keysToTry) {
    try {
      const upstream = await fetch(GROQ_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: GROQ_MODEL,
          temperature: options?.temperature ?? 0.7,
          max_tokens: options?.maxTokens ?? 900,
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

      // Check if it's a rate limit or quota error
      const errorBody = await upstream.text().catch(() => "");
      const isRateLimitError =
        upstream.status === 429 || // Rate limited
        upstream.status === 429 || // Too many requests
        errorBody.toLowerCase().includes("quota") ||
        errorBody.toLowerCase().includes("limit");

      lastError = new Error(
        `Groq request failed (${upstream.status}): ${errorBody.slice(0, 240)}`
      );

      // Only try fallback on rate limit/quota errors or server errors (5xx)
      if (!isRateLimitError && upstream.status < 500) {
        throw lastError;
      }
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      // Continue to next key if available
      if (keysToTry.indexOf(apiKey) < keysToTry.length - 1) {
        continue;
      }
      throw lastError;
    }
  }

  if (lastError) {
    throw lastError;
  }

  throw new Error("Groq request failed with all available API keys");
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
