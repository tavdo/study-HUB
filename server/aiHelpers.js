const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || "http://127.0.0.1:11434";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "llama3.1:8b";

const GEORGIAN_RULE =
  "პასუხი მხოლოდ ქართულ ენაზე. თუ მასალა სხვა ენაზეა, მაინც ქართულად უპასუხე.";

export async function ollamaChat({ messages, temperature = 0.4 }) {
  const res = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: OLLAMA_MODEL,
      messages,
      stream: false,
      options: { temperature },
    }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Ollama: ${res.status} ${text}`.slice(0, 300));
  }
  const data = await res.json();
  return data?.message?.content?.trim() || "";
}

export async function openaiChat({ messages, temperature = 0.5, maxTokens = 1200 }) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages,
      temperature,
      max_tokens: maxTokens,
    }),
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.choices?.[0]?.message?.content?.trim() || null;
}

export async function aiComplete({ system, user, temperature = 0.4 }) {
  const messages = [
    { role: "system", content: `${GEORGIAN_RULE}\n\n${system}` },
    { role: "user", content: user },
  ];
  const openai = await openaiChat({ messages, temperature });
  if (openai) return openai;
  try {
    return await ollamaChat({ messages, temperature });
  } catch {
    return null;
  }
}

export function stripJson(text) {
  return String(text || "")
    .trim()
    .replace(/^```(?:json)?/i, "")
    .replace(/```$/i, "")
    .trim();
}

export { GEORGIAN_RULE };
