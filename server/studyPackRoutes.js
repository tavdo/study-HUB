import { Router } from "express";
import { requireAuth } from "./authMiddleware.js";
import { aiComplete, stripJson } from "./aiHelpers.js";

const router = Router();

router.post("/", requireAuth, async (req, res) => {
  try {
    const { title = "Study Pack", text = "" } = req.body || {};
    const clean = String(text || "").trim();
    if (clean.length < 30) {
      return res.status(400).json({ error: "ტექსტი ძალიან მოკლეა" });
    }

    const system = `Create a study pack from student material.
Return ONLY valid JSON (no markdown):
{
  "summary": "3-5 sentence summary in Georgian",
  "flashcards": [
    { "front": "question", "back": "answer" }
  ],
  "quizOutline": ["topic1", "topic2"]
}
Generate 8-12 flashcards. Keep concise.`;

    const content = await aiComplete({
      system,
      user: `Title: ${title}\n\nMaterial:\n${clean.slice(0, 8000)}`,
      temperature: 0.35,
    });

    if (!content) {
      return res.status(503).json({
        error: "AI მიუწვდომელია. დააყენე OPENAI_API_KEY ან Ollama.",
      });
    }

    const parsed = JSON.parse(stripJson(content));
    const flashcards = (parsed.flashcards || []).map((c, i) => ({
      id: `fc-${Date.now()}-${i}`,
      front: String(c.front || c.question || ""),
      back: String(c.back || c.answer || ""),
      ease: 2.5,
      interval: 0,
      repetitions: 0,
      nextReview: Date.now(),
    }));

    res.json({
      pack: {
        id: `pack-${Date.now()}`,
        title,
        summary: String(parsed.summary || ""),
        flashcards,
        quizOutline: parsed.quizOutline || [],
        createdAt: new Date().toISOString(),
      },
    });
  } catch (e) {
    res.status(500).json({ error: "Study Pack ვერ შეიქმნა" });
  }
});

export default router;
