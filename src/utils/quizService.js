import { apiFetch } from "./api";

function safeJsonParse(text) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function stripCodeFences(s) {
  if (!s) return "";
  return String(s)
    .trim()
    .replace(/^```(?:json)?/i, "")
    .replace(/```$/i, "")
    .trim();
}

function normalizeQuiz(raw, fallbackTitle = "Pop Quiz") {
  if (!raw || typeof raw !== "object") return null;
  const questions = Array.isArray(raw.questions) ? raw.questions : [];
  const normalizedQuestions = questions
    .map((q) => {
      if (!q || typeof q !== "object") return null;
      const prompt = String(q.prompt || q.question || "").trim();
      const choices = Array.isArray(q.choices) ? q.choices.map(String) : [];
      const answerIndex =
        typeof q.answerIndex === "number"
          ? q.answerIndex
          : typeof q.correctIndex === "number"
            ? q.correctIndex
            : -1;
      if (!prompt || choices.length < 2 || answerIndex < 0) return null;
      return {
        id: q.id || `q-${Date.now()}-${Math.random().toString(16).slice(2)}`,
        prompt,
        choices,
        answerIndex: Math.min(answerIndex, choices.length - 1),
        hint: q.hint ? String(q.hint) : "",
        explanation: q.explanation ? String(q.explanation) : "",
      };
    })
    .filter(Boolean);

  if (!normalizedQuestions.length) return null;
  return {
    title: String(raw.title || fallbackTitle),
    questions: normalizedQuestions.slice(0, 10),
  };
}

function extractKeywords(text, limit = 6) {
  const words = String(text || "")
    .toLowerCase()
    .replace(/[^a-z0-9\u10A0-\u10FF\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length >= 5);
  const stop = new Set([
    "about",
    "which",
    "therefore",
    "because",
    "should",
    "could",
    "would",
    "their",
    "these",
    "those",
    "where",
    "when",
    "after",
    "before",
    "between",
    "during",
  ]);
  const counts = new Map();
  for (const w of words) {
    if (stop.has(w)) continue;
    counts.set(w, (counts.get(w) || 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([w]) => w);
}

function fallbackQuizFromText({ title, text }) {
  const keywords = extractKeywords(text, 6);
  const baseChoices = ["Definition", "Example", "Formula", "Purpose"];
  const questions = [];

  for (const kw of keywords.slice(0, 4)) {
    questions.push({
      id: `q-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      prompt: `What best describes "${kw}" in this material?`,
      choices: [...baseChoices],
      answerIndex: 0,
      hint: "Try to recall how it was used in the text.",
      explanation:
        "This is a practice question. Use it to actively recall your notes and refine your own definition.",
    });
  }

  questions.push({
    id: `q-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    prompt: "Which study strategy best improves long-term memory?",
    choices: ["Active recall", "Re-reading only", "Highlighting only", "Cramming"],
    answerIndex: 0,
    hint: "Think: testing yourself.",
    explanation:
      "Active recall (self-quizzing) is one of the most effective techniques for long-term retention.",
  });

  return {
    title: title || "Pop Quiz",
    questions: questions.slice(0, 6),
  };
}

/**
 * Generates a multiple-choice quiz from plain text.
 * Tries local free AI proxy (Ollama) if enabled, then OpenAI, otherwise falls back locally.
 */
export async function generateQuizFromText({
  title = "Pop Quiz",
  text = "",
  difficulty = "medium",
  questionCount = 6,
  tutorMode = true,
}) {
  const useLocalAi = String(process.env.REACT_APP_USE_LOCAL_AI || "").toLowerCase() === "true";
  const apiKey = process.env.REACT_APP_OPENAI_API_KEY;

  const cleanText = String(text || "").trim();
  if (cleanText.length < 20) {
    return fallbackQuizFromText({ title, text: cleanText || title });
  }

  if (useLocalAi) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 15000);
      const data = await apiFetch("/api/quiz", {
        method: "POST",
        body: JSON.stringify({
          title,
          text: cleanText,
          questionCount,
          difficulty,
          tutorMode,
        }),
        signal: controller.signal,
      }).finally(() => clearTimeout(timer));

      const parsed = safeJsonParse(stripCodeFences(data?.content));
      const normalized = normalizeQuiz(parsed, title);
      if (normalized) return normalized;
    } catch {
      /* fall through */
    }
  }

  if (!apiKey) {
    await new Promise((r) => setTimeout(r, 250 + Math.random() * 250));
    return fallbackQuizFromText({ title, text: cleanText });
  }

  const system = `You generate pop quizzes from study material.
Return ONLY valid JSON. No markdown. No code fences.

Constraints:
- ${questionCount} questions
- multiple choice, 4 options each
- answerIndex is 0-3
- include a short hint and explanation for each question
- difficulty: ${difficulty}
${tutorMode ? "- do not give long solutions; keep explanations brief and encourage the student to try first" : ""}`;

  const user = `Title: ${title}

Material:
${cleanText.slice(0, 6000)}

JSON shape:
{
  "title": "string",
  "questions": [
    {
      "prompt": "string",
      "choices": ["a","b","c","d"],
      "answerIndex": 0,
      "hint": "string",
      "explanation": "string"
    }
  ]
}`;

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: process.env.REACT_APP_OPENAI_MODEL || "gpt-4o-mini",
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      temperature: 0.4,
      max_tokens: 1200,
    }),
  });

  if (!res.ok) {
    return fallbackQuizFromText({ title, text: cleanText });
  }

  const data = await res.json();
  const content = data.choices?.[0]?.message?.content;
  const parsed = safeJsonParse(stripCodeFences(content));
  const normalized = normalizeQuiz(parsed, title);
  if (normalized) return normalized;
  return fallbackQuizFromText({ title, text: cleanText });
}

