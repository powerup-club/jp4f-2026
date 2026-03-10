const GROQ_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama-3.3-70b-versatile";

export type GroqChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

function getGroqApiKey(): string {
  return process.env.GROQ_API_KEY?.trim() ?? "";
}

export function hasGroqApiKey(): boolean {
  return Boolean(getGroqApiKey());
}

export async function requestGroqCompletion(
  messages: GroqChatMessage[],
  options?: {
    temperature?: number;
    maxTokens?: number;
  }
): Promise<string> {
  const apiKey = getGroqApiKey();
  if (!apiKey) {
    throw new Error("GROQ_API_KEY is missing");
  }

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

  if (!upstream.ok) {
    const errorBody = await upstream.text().catch(() => "");
    throw new Error(`Groq request failed (${upstream.status}): ${errorBody.slice(0, 240)}`);
  }

  const completion = (await upstream.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };

  return completion.choices?.[0]?.message?.content?.trim() ?? "";
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
