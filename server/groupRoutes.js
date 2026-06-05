import { Router } from "express";
import { randomBytes } from "crypto";
import { prisma } from "./prisma.js";
import { requireAuth } from "./authMiddleware.js";

const router = Router();

function inviteCode() {
  return randomBytes(4).toString("hex").toUpperCase();
}

function mapMessage(m, userId) {
  return {
    id: m.id,
    author: m.authorName,
    isMe: m.userId === userId,
    text: m.text,
    time: m.createdAt.toLocaleTimeString("ka-GE", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    attachment: m.attachment || null,
    createdAt: m.createdAt.toISOString(),
  };
}

router.get("/", requireAuth, async (req, res) => {
  try {
    const memberships = await prisma.groupMember.findMany({
      where: { userId: req.user.id },
      include: {
        group: {
          include: {
            members: { include: { user: { select: { id: true, name: true } } } },
            messages: { orderBy: { createdAt: "asc" }, take: 200 },
          },
        },
      },
      orderBy: { joinedAt: "desc" },
    });

    const groups = memberships.map(({ group }) => ({
      id: group.id,
      name: group.name,
      inviteCode: group.inviteCode,
      letter: group.name.charAt(0).toUpperCase() || "G",
      members: group.members.length,
      memberList: group.members.map((m) => ({
        id: m.user.id,
        name: m.user.name,
      })),
      unread: 0,
      messages: group.messages.map((m) => mapMessage(m, req.user.id)),
    }));

    res.json({ groups });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error("groups list", e);
    res.status(500).json({ error: "ჯგუფების ჩატვირთვა ვერ მოხერხდა" });
  }
});

router.post("/", requireAuth, async (req, res) => {
  try {
    const { name } = req.body || {};
    if (!name?.trim()) {
      return res.status(400).json({ error: "სახელი საჭიროა" });
    }
    const group = await prisma.studyGroup.create({
      data: {
        name: name.trim(),
        inviteCode: inviteCode(),
        createdBy: req.user.id,
        members: { create: { userId: req.user.id } },
      },
      include: {
        members: { include: { user: { select: { id: true, name: true } } } },
        messages: true,
      },
    });
    res.status(201).json({
      group: {
        id: group.id,
        name: group.name,
        inviteCode: group.inviteCode,
        letter: group.name.charAt(0).toUpperCase(),
        members: 1,
        memberList: [{ id: req.user.id, name: req.user.name }],
        unread: 0,
        messages: [],
      },
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error("create group", e);
    res.status(500).json({ error: "ჯგუფის შექმნა ვერ მოხერხდა" });
  }
});

router.post("/join", requireAuth, async (req, res) => {
  try {
    const code = String(req.body?.inviteCode || "").trim().toUpperCase();
    const group = await prisma.studyGroup.findUnique({
      where: { inviteCode: code },
    });
    if (!group) {
      return res.status(404).json({ error: "მოწვევის კოდი არასწორია" });
    }
    await prisma.groupMember.upsert({
      where: { groupId_userId: { groupId: group.id, userId: req.user.id } },
      create: { groupId: group.id, userId: req.user.id },
      update: {},
    });
    res.json({ ok: true, groupId: group.id });
  } catch {
    res.status(500).json({ error: "შეერთება ვერ მოხერხდა" });
  }
});

router.post("/:id/messages", requireAuth, async (req, res) => {
  try {
    const { text, attachment } = req.body || {};
    const member = await prisma.groupMember.findUnique({
      where: {
        groupId_userId: { groupId: req.params.id, userId: req.user.id },
      },
    });
    if (!member) {
      return res.status(403).json({ error: "ჯგუფის წევრი არ ხარ" });
    }
    const msg = await prisma.groupMessage.create({
      data: {
        groupId: req.params.id,
        userId: req.user.id,
        authorName: req.user.name,
        text: String(text || "").trim(),
        attachment: attachment || null,
      },
    });
    res.status(201).json({ message: mapMessage(msg, req.user.id) });
  } catch {
    res.status(500).json({ error: "შეტყობინება ვერ გაიგზავნა" });
  }
});

router.get("/:id/messages", requireAuth, async (req, res) => {
  try {
    const member = await prisma.groupMember.findUnique({
      where: {
        groupId_userId: { groupId: req.params.id, userId: req.user.id },
      },
    });
    if (!member) {
      return res.status(403).json({ error: "წვდომა აკრძალულია" });
    }
    const messages = await prisma.groupMessage.findMany({
      where: { groupId: req.params.id },
      orderBy: { createdAt: "asc" },
      take: 300,
    });
    res.json({
      messages: messages.map((m) => mapMessage(m, req.user.id)),
    });
  } catch {
    res.status(500).json({ error: "შეტყობინებები ვერ ჩაიტვირთა" });
  }
});

export default router;
