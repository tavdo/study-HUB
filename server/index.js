import "dotenv/config";
import express from "express";
import authRoutes from "./authRoutes.js";
import { requireAuth } from "./authMiddleware.js";
import { connectDatabase, disconnectDatabase, prisma } from "./prisma.js";

const app = express();
app.use(express.json({ limit: "2mb" }));

app.use("/api/auth", authRoutes);

const PORT = Number(process.env.PORT || 5050);
const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || "http://127.0.0.1:11434";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "llama3.1:8b";

async function ollamaChat({ messages, temperature = 0.4 }) {
  const res = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: OLLAMA_MODEL,
      messages,
      stream: false,
      options: {
        temperature,
      },
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Ollama error: ${res.status} ${text}`.slice(0, 500));
  }

  const data = await res.json();
  return data?.message?.content?.trim() || "";
}

function buildTutorSystem({ tutorMode }) {
  if (!tutorMode) return null;
  return `Tutor mode (no direct answers):
- Do NOT provide final answers or complete solutions to assignments.
- Ask 1–3 clarifying questions first when needed.
- Give hints, steps, and checks. Encourage the student to attempt a solution.
- If the user insists, reveal the final answer briefly only after asking them to try first.`;
}

app.get("/api/health", async (_req, res) => {
  let database = "disconnected";
  try {
    await prisma.$queryRaw`SELECT 1`;
    database = "postgresql";
  } catch {
    return res.status(503).json({
      ok: false,
      database,
      error: "PostgreSQL კავშირი ვერ დამყარდა. გაუშვი: npm run db:setup",
    });
  }
  res.json({ ok: true, provider: "ollama", model: OLLAMA_MODEL, database });
});

app.post("/api/chat", requireAuth, async (req, res) => {
  try {
    const { messages, tutorMode = true } = req.body || {};
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "messages[] required" });
    }

    const tutorSystem = buildTutorSystem({ tutorMode });
    const finalMessages = tutorSystem
      ? [{ role: "system", content: tutorSystem }, ...messages]
      : messages;

    const content = await ollamaChat({
      messages: finalMessages.slice(-20),
      temperature: 0.5,
    });

    res.json({ content });
  } catch (e) {
    res.status(500).json({ error: String(e?.message || e) });
  }
});

app.post("/api/quiz", requireAuth, async (req, res) => {
  try {
    const {
      title = "Pop Quiz",
      text = "",
      questionCount = 6,
      difficulty = "medium",
      tutorMode = true,
    } = req.body || {};

    const cleanText = String(text || "").trim();
    if (cleanText.length < 20) {
      return res.status(400).json({ error: "text too short" });
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
${cleanText.slice(0, 8000)}

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

    const content = await ollamaChat({
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      temperature: 0.3,
    });

    res.json({ content });
  } catch (e) {
    res.status(500).json({ error: String(e?.message || e) });
  }
});

async function start() {
  if (!process.env.DATABASE_URL) {
    // eslint-disable-next-line no-console
    console.error(
      "DATABASE_URL არ არის. დააკოპირე server/.env.example → server/.env და გაუშვი npm run db:setup"
    );
    process.exit(1);
  }

  await connectDatabase();

  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`StudyHub server listening on http://localhost:${PORT}`);
    // eslint-disable-next-line no-console
    console.log(`Database: PostgreSQL | Ollama: ${OLLAMA_BASE_URL} model=${OLLAMA_MODEL}`);
  });
}

start().catch((e) => {
  // eslint-disable-next-line no-console
  console.error("Server failed to start:", e.message || e);
  process.exit(1);
});

async function shutdown() {
  await disconnectDatabase();
  process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
