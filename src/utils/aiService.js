import {
  buildStudyHubSnapshot,
  buildSystemPrompt,
  answerFromStudyHubContext,
} from "./studyHubAiContext";
import { apiFetch } from "./api";

const STUDY_RESPONSES = [
  {
    keywords: ["schedule", "plan", "final", "exam"],
    reply:
      "Here's a simple finals plan: (1) List all subjects and exam dates. (2) Block 2-hour focus sessions per subject daily. (3) Day 1–2: review weak topics. (4) Day 3: practice problems. (5) Day before exam: light review + sleep. Want me to break this down for a specific subject?",
  },
  {
    keywords: ["quiz", "test", "question"],
    reply:
      "I can help you practice! Tell me the subject (e.g. Chemistry, Algorithms) and I'll suggest 3 sample quiz questions and study tips.",
  },
  {
    keywords: ["algorithm", "code", "programming"],
    reply:
      "For algorithms: focus on time complexity, examples, and pseudocode first. Common patterns: two pointers, sliding window, BFS/DFS, dynamic programming. What problem are you on?",
  },
  {
    keywords: ["physics", "quantum", "chemistry", "math"],
    reply:
      "Break the topic into definitions, formulas, and one worked example. Teach it back in your own words, then do 5 practice problems. Which concept should we start with?",
  },
];

function matchStudyResponse(message) {
  const lower = message.toLowerCase();
  for (const item of STUDY_RESPONSES) {
    if (item.keywords.some((k) => lower.includes(k))) {
      return item.reply;
    }
  }
  return null;
}

function defaultStudyFallback(message, snapshot) {
  const tutorMode = Boolean(snapshot?.settings?.tutorMode);
  const hubHint = snapshot
    ? `\n\nTip: I also know your Study Hub data (${snapshot.stats?.totalNotes ?? 0} notes, ${snapshot.library?.length ?? 0} library items). Ask "summarize my data" or "what is StudyHubContext?".`
    : "";

  if (tutorMode) {
    return `Let's work through this step-by-step (Tutor mode — no direct answers):

1) What exactly is the question asking? (write it in your own words)
2) What do you already know / what formulas or definitions apply?
3) Try a first attempt (even rough) and paste it here — I'll give hints and corrections.

${hubHint}`;
  }

  return `Here's a study approach for your question:

1. Define what you need to learn
2. Break it into small topics
3. Use active recall (quiz yourself)
4. Review after 1 day, then 3 days

${hubHint}`;
}

/**
 * @param {string} userMessage
 * @param {Array<{role: string, content: string}>} history
 * @param {object|null} studyHubState - full value from useStudyHub()
 */
export async function getAiReply(userMessage, history = [], studyHubState = null) {
  const snapshot = buildStudyHubSnapshot(studyHubState);
  const systemPrompt = snapshot ? buildSystemPrompt(snapshot) : null;

  const contextAnswer = snapshot
    ? answerFromStudyHubContext(userMessage, snapshot)
    : null;

  const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
  const useLocalAi = String(process.env.REACT_APP_USE_LOCAL_AI || "").toLowerCase() === "true";

  if (useLocalAi && systemPrompt) {
    try {
      const messages = [
        { role: "system", content: systemPrompt },
        ...history
          .filter((m) => m.role === "user" || m.role === "assistant")
          .slice(-12)
          .map((m) => ({ role: m.role, content: m.content })),
        { role: "user", content: userMessage },
      ];

      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 12000);
      const data = await apiFetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({
          messages,
          tutorMode: Boolean(snapshot?.settings?.tutorMode),
        }),
        signal: controller.signal,
      }).finally(() => clearTimeout(timer));

      const text = data?.content?.trim();
      if (text) return text;
    } catch {
      /* fall through */
    }
  }

  if (apiKey && systemPrompt) {
    try {
      const messages = [
        { role: "system", content: systemPrompt },
        ...history
          .filter((m) => m.role === "user" || m.role === "assistant")
          .slice(-12)
          .map((m) => ({ role: m.role, content: m.content })),
        { role: "user", content: userMessage },
      ];

      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: process.env.REACT_APP_OPENAI_MODEL || "gpt-4o-mini",
          messages,
          max_tokens: 800,
          temperature: 0.7,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const text = data.choices?.[0]?.message?.content?.trim();
        if (text) return text;
      }
    } catch {
      /* fall through */
    }
  }

  await new Promise((r) => setTimeout(r, 400 + Math.random() * 300));

  if (contextAnswer) return contextAnswer;

  const studyMatch = matchStudyResponse(userMessage);
  if (studyMatch) return studyMatch;

  return defaultStudyFallback(userMessage, snapshot);
}
