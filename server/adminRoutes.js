import { Router } from "express";
import { requireAuth, requireAdmin } from "./authMiddleware.js";
import { publicUser } from "./db.js";
import { prisma } from "./prisma.js";

const router = Router();
const VALID_ROLES = new Set(["student", "tutor", "admin"]);

router.use(requireAuth, requireAdmin);

router.get("/stats", async (_req, res) => {
  try {
    const [users, groups, files, messages, admins] = await Promise.all([
      prisma.user.count(),
      prisma.studyGroup.count(),
      prisma.uploadedFile.count(),
      prisma.groupMessage.count(),
      prisma.user.count({ where: { role: "admin" } }),
    ]);

    const storage = await prisma.uploadedFile.aggregate({
      _sum: { size: true },
    });

    res.json({
      users,
      admins,
      groups,
      files,
      messages,
      storageBytes: storage._sum.size || 0,
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error("admin stats", e);
    res.status(500).json({ error: "სტატისტიკის ჩატვირთვა ვერ მოხერხდა" });
  }
});

router.get("/users", async (_req, res) => {
  try {
    const rows = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: {
            files: true,
            groupMembers: true,
            messages: true,
          },
        },
      },
    });

    res.json({
      users: rows.map((u) => ({
        ...publicUser(u),
        counts: {
          files: u._count.files,
          groups: u._count.groupMembers,
          messages: u._count.messages,
        },
      })),
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error("admin users", e);
    res.status(500).json({ error: "მომხმარებლების ჩატვირთვა ვერ მოხერხდა" });
  }
});

router.patch("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { role, name } = req.body || {};

    if (role !== undefined && !VALID_ROLES.has(role)) {
      return res.status(400).json({ error: "არასწორი როლი" });
    }

    const target = await prisma.user.findUnique({ where: { id } });
    if (!target) {
      return res.status(404).json({ error: "მომხმარებელი ვერ მოიძებნა" });
    }

    if (role !== undefined && target.role === "admin" && role !== "admin") {
      const adminCount = await prisma.user.count({ where: { role: "admin" } });
      if (adminCount <= 1) {
        return res
          .status(400)
          .json({ error: "ბოლო ადმინისტრატორის როლის შეცვლა შეუძლებელია" });
      }
    }

    const data = {};
    if (role !== undefined) data.role = role;
    if (name !== undefined) {
      const trimmed = String(name).trim();
      if (!trimmed) {
        return res.status(400).json({ error: "სახელი საჭიროა" });
      }
      data.name = trimmed;
    }

    if (!Object.keys(data).length) {
      return res.status(400).json({ error: "ცვლილება არ მოწოდებულა" });
    }

    const updated = await prisma.user.update({
      where: { id },
      data,
    });

    res.json({ user: publicUser(updated) });
  } catch (e) {
    if (e.code === "P2025") {
      return res.status(404).json({ error: "მომხმარებელი ვერ მოიძებნა" });
    }
    // eslint-disable-next-line no-console
    console.error("admin patch user", e);
    res.status(500).json({ error: "მომხმარებლის განახლება ვერ მოხერხდა" });
  }
});

router.delete("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (id === req.user.id) {
      return res
        .status(400)
        .json({ error: "საკუთარი ანგარიშის წაშლა შეუძლებელია" });
    }

    const target = await prisma.user.findUnique({ where: { id } });
    if (!target) {
      return res.status(404).json({ error: "მომხმარებელი ვერ მოიძებნა" });
    }

    if (target.role === "admin") {
      const adminCount = await prisma.user.count({ where: { role: "admin" } });
      if (adminCount <= 1) {
        return res
          .status(400)
          .json({ error: "ბოლო ადმინისტრატორის წაშლა შეუძლებელია" });
      }
    }

    await prisma.user.delete({ where: { id } });
    res.json({ ok: true });
  } catch (e) {
    if (e.code === "P2025") {
      return res.status(404).json({ error: "მომხმარებელი ვერ მოიძებნა" });
    }
    // eslint-disable-next-line no-console
    console.error("admin delete user", e);
    res.status(500).json({ error: "მომხმარებლის წაშლა ვერ მოხერხდა" });
  }
});

export default router;
