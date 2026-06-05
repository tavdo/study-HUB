import { Router } from "express";
import { prisma } from "./prisma.js";
import { requireAuth } from "./authMiddleware.js";

const router = Router();

router.get("/", requireAuth, async (_req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    });
    const mapped = users.map((u) => {
      const parts = u.name.trim().split(/\s+/);
      const initials =
        parts.length >= 2
          ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
          : (parts[0]?.[0] || "S").toUpperCase();
      return {
        id: u.id,
        name: u.name,
        initials,
        email: u.email,
        role: "სტუდენტი",
        year: "",
        status: "online",
        type: "student",
        courses: [],
        groups: [],
      };
    });
    res.json({ users: mapped });
  } catch {
    res.status(500).json({ error: "მომხმარებლები ვერ ჩაიტვირთა" });
  }
});

export default router;
