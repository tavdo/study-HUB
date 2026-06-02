import { Router } from "express";
import bcrypt from "bcryptjs";
import {
  createUser,
  findUserByEmail,
  findUserById,
  getUserState,
  publicUser,
  saveUserState,
  updateUserName,
} from "./db.js";
import { requireAuth, signToken } from "./authMiddleware.js";

const router = Router();

const defaultAppState = () => ({
  settings: {
    groupMessages: true,
    studyReminders: true,
    theme: "მუქი ზურმხელი (ნაგულისხმევი)",
    tutorMode: true,
  },
  notes: [],
  library: [],
  users: [],
  groups: [],
  activeGroupId: null,
  aiChats: [],
  activeAiChatId: null,
  studyHours: 0,
  quizzes: [],
  activeQuizId: null,
});

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || "").trim());
}

router.post("/register", async (req, res) => {
  try {
    const { email, password, name } = req.body || {};
    if (!validateEmail(email)) {
      return res.status(400).json({ error: "შეიყვანე სწორი ელფოსტა" });
    }
    if (!password || String(password).length < 6) {
      return res
        .status(400)
        .json({ error: "პაროლი უნდა იყოს მინიმუმ 6 სიმბოლო" });
    }

    const passwordHash = await bcrypt.hash(String(password), 10);
    const user = await createUser({
      email,
      passwordHash,
      name,
      initialState: defaultAppState(),
    });

    const token = signToken(user);
    res.status(201).json({
      token,
      user: publicUser(user),
    });
  } catch (e) {
    if (e.code === "EMAIL_EXISTS") {
      return res.status(409).json({ error: "ეს ელფოსტა უკვე რეგისტრირებულია" });
    }
    // eslint-disable-next-line no-console
    console.error("register", e);
    res.status(500).json({ error: "რეგისტრაცია ვერ მოხერხდა" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: "ელფოსტა ან პაროლი არასწორია" });
    }

    const ok = await bcrypt.compare(String(password || ""), user.passwordHash);
    if (!ok) {
      return res.status(401).json({ error: "ელფოსტა ან პაროლი არასწორია" });
    }

    const token = signToken(user);
    res.json({ token, user: publicUser(user) });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error("login", e);
    res.status(500).json({ error: "შესვლა ვერ მოხერხდა" });
  }
});

router.get("/me", requireAuth, async (req, res) => {
  try {
    const user = await findUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "მომხმარებელი ვერ მოიძებნა" });
    }
    res.json({ user: publicUser(user) });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error("me", e);
    res.status(500).json({ error: "შეცდომა" });
  }
});

router.get("/state", requireAuth, async (req, res) => {
  try {
    const state = (await getUserState(req.user.id)) || defaultAppState();
    res.json({ state });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error("get state", e);
    res.status(500).json({ error: "მონაცემების ჩატვირთვა ვერ მოხერხდა" });
  }
});

router.put("/state", requireAuth, async (req, res) => {
  try {
    const { state } = req.body || {};
    if (!state || typeof state !== "object") {
      return res.status(400).json({ error: "state საჭიროა" });
    }
    await saveUserState(req.user.id, state);
    res.json({ ok: true });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error("put state", e);
    res.status(500).json({ error: "მონაცემების შენახვა ვერ მოხერხდა" });
  }
});

router.patch("/profile", requireAuth, async (req, res) => {
  try {
    const { name } = req.body || {};
    if (!name?.trim()) {
      return res.status(400).json({ error: "სახელი საჭიროა" });
    }
    const updated = await updateUserName(req.user.id, name);
    if (!updated) {
      return res.status(404).json({ error: "მომხმარებელი ვერ მოიძებნა" });
    }
    res.json({ user: updated });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error("profile", e);
    res.status(500).json({ error: "პროფილის განახლება ვერ მოხერხდა" });
  }
});

export default router;
