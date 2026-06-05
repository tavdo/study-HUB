import { Router } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";
import { randomUUID } from "crypto";
import { prisma } from "./prisma.js";
import { requireAuth } from "./authMiddleware.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(__dirname, "uploads");

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname) || "";
    cb(null, `${randomUUID()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 },
});

const router = Router();

router.post("/upload", requireAuth, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "ფაილი საჭიროა" });
    }
    const record = await prisma.uploadedFile.create({
      data: {
        userId: req.user.id,
        filename: req.file.originalname,
        storedName: req.file.filename,
        mimeType: req.file.mimetype || "application/octet-stream",
        size: req.file.size,
      },
    });
    res.status(201).json({
      file: {
        id: record.id,
        filename: record.filename,
        mimeType: record.mimeType,
        size: record.size,
        url: `/api/files/${record.id}/download`,
      },
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error("upload", e);
    res.status(500).json({ error: "ატვირთვა ვერ მოხერხდა" });
  }
});

router.get("/:id/download", requireAuth, async (req, res) => {
  try {
    const record = await prisma.uploadedFile.findUnique({
      where: { id: req.params.id },
    });
    if (!record || record.userId !== req.user.id) {
      return res.status(404).json({ error: "ფაილი ვერ მოიძებნა" });
    }
    const filePath = path.join(UPLOAD_DIR, record.storedName);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "ფაილი წაშლილია" });
    }
    res.setHeader("Content-Type", record.mimeType);
    res.setHeader(
      "Content-Disposition",
      `inline; filename="${encodeURIComponent(record.filename)}"`
    );
    fs.createReadStream(filePath).pipe(res);
  } catch {
    res.status(500).json({ error: "ჩამოტვირთვა ვერ მოხერხდა" });
  }
});

router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const record = await prisma.uploadedFile.findUnique({
      where: { id: req.params.id },
    });
    if (!record || record.userId !== req.user.id) {
      return res.status(404).json({ error: "ფაილი ვერ მოიძებნა" });
    }
    const filePath = path.join(UPLOAD_DIR, record.storedName);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    await prisma.uploadedFile.delete({ where: { id: record.id } });
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: "წაშლა ვერ მოხერხდა" });
  }
});

router.post("/extract-text", requireAuth, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "ფაილი საჭიროა" });
    }
    const ext = path.extname(req.file.originalname).toLowerCase();
    let text = "";

    if (ext === ".pdf") {
      const pdfParse = (await import("pdf-parse")).default;
      const data = await pdfParse(fs.readFileSync(req.file.path));
      text = data?.text || "";
    } else if ([".txt", ".md", ".csv", ".json"].includes(ext)) {
      text = fs.readFileSync(req.file.path, "utf8");
    } else {
      text = "";
    }

    fs.unlinkSync(req.file.path);
    res.json({ text: String(text).trim().slice(0, 12000) });
  } catch (e) {
    if (req.file?.path && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    res.status(500).json({ error: "ტექსტის ამოღება ვერ მოხერხდა" });
  }
});

export default router;
