import "dotenv/config";
import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./authRoutes.js";
import adminRoutes from "./adminRoutes.js";
import fileRoutes from "./fileRoutes.js";
import groupRoutes from "./groupRoutes.js";
import userRoutes from "./userRoutes.js";
import studyPackRoutes from "./studyPackRoutes.js";
import {
  ensureAtLeastOneAdmin,
  promoteAdminEmailIfConfigured,
} from "./db.js";
import { requireAuth } from "./authMiddleware.js";
import { connectDatabase, disconnectDatabase, prisma } from "./prisma.js";
import { GEORGIAN_RULE, aiComplete, ollamaChat, openaiChat } from "./aiHelpers.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "llama3.1:8b";

const app = express();

const corsOrigins = (process.env.CORS_ORIGINS || process.env.FRONTEND_URL || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

if (corsOrigins.length) {
  app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (origin && corsOrigins.includes(origin)) {
      res.setHeader("Access-Control-Allow-Origin", origin);
      res.setHeader("Access-Control-Allow-Credentials", "true");
    }
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET,POST,PUT,PATCH,DELETE,OPTIONS"
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );
    if (req.method === "OPTIONS") return res.sendStatus(204);
    next();
  });
}

app.use(express.json({ limit: "2mb" }));

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/users", userRoutes);
app.use("/api/study-pack", studyPackRoutes);

const PORT = Number(process.env.PORT || 5050);

function buildTutorSystem({ tutorMode }) {
  if (!tutorMode) return GEORGIAN_RULE;
  return `${GEORGIAN_RULE}

Tutor mode (no direct answers):
- Do NOT provide final answers or complete solutions to assignments.
- Ask 1–3 clarifying questions first when needed.
- Give hints, steps, and checks.`;
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
      error: "PostgreSQL კავშირი ვერ დამყარდა",
    });
  }
  res.json({
    ok: true,
    database,
    ai: process.env.OPENAI_API_KEY ? "openai" : "ollama",
    model: OLLAMA_MODEL,
  });
});

app.post("/api/chat", requireAuth, async (req, res) => {
  try {
    const { messages, tutorMode = true } = req.body || {};
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "messages[] required" });
    }

    const tutorSystem = buildTutorSystem({ tutorMode });
    const finalMessages = [
      { role: "system", content: tutorSystem },
      ...messages.filter((m) => m.role === "user" || m.role === "assistant"),
    ].slice(-20);

    let content = await openaiChat({ messages: finalMessages, temperature: 0.5 });
    if (!content) {
      content = await ollamaChat({ messages: finalMessages, temperature: 0.5 });
    }
    if (!content) {
      return res.status(503).json({ error: "AI მიუწვდომელია" });
    }

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

    const system = `${GEORGIAN_RULE}
Generate pop quizzes. Return ONLY valid JSON.

Constraints:
- ${questionCount} questions, 4 choices, answerIndex 0-3
- hints and brief explanations in Georgian
- difficulty: ${difficulty}
${tutorMode ? "- brief explanations only" : ""}`;

    const user = `Title: ${title}\nMaterial:\n${cleanText.slice(0, 8000)}`;

    const content = await aiComplete({ system, user, temperature: 0.3 });
    if (!content) {
      return res.status(503).json({ error: "AI მიუწვდომელია" });
    }
    res.json({ content });
  } catch (e) {
    res.status(500).json({ error: String(e?.message || e) });
  }
});

function attachFrontend() {
  const buildPath =
    process.env.BUILD_PATH || path.join(__dirname, "..", "build");
  if (!fs.existsSync(path.join(buildPath, "index.html"))) return false;

  app.use(express.static(buildPath));
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api")) return next();
    res.sendFile(path.join(buildPath, "index.html"));
  });
  // eslint-disable-next-line no-console
  console.log(`Serving React app from ${buildPath}`);
  return true;
}

async function start() {
  if (!process.env.DATABASE_URL) {
    // eslint-disable-next-line no-console
    console.error("DATABASE_URL არ არის");
    process.exit(1);
  }

  await connectDatabase();
  await promoteAdminEmailIfConfigured();
  await ensureAtLeastOneAdmin();
  const hasFrontend = attachFrontend();

  app.listen(PORT, "0.0.0.0", () => {
    // eslint-disable-next-line no-console
    console.log(`StudyHub server on port ${PORT}`);
    // eslint-disable-next-line no-console
    console.log(`DB: PostgreSQL | UI: ${hasFrontend ? "yes" : "api-only"}`);
  });
}

start().catch((e) => {
  // eslint-disable-next-line no-console
  console.error("Server failed:", e.message || e);
  process.exit(1);
});

async function shutdown() {
  await disconnectDatabase();
  process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
