/**
 * ძველი server/data/users.json + states/*.json → PostgreSQL
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { prisma } from "../prisma.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const serverRoot = path.join(__dirname, "..");
dotenv.config({ path: path.join(serverRoot, ".env") });

const USERS_FILE = path.join(serverRoot, "data", "users.json");
const STATE_DIR = path.join(serverRoot, "data", "states");

async function main() {
  if (!fs.existsSync(USERS_FILE)) {
    // eslint-disable-next-line no-console
    console.log("   (ძველი users.json არ არის — გამოტოვება)");
    return;
  }

  const raw = JSON.parse(fs.readFileSync(USERS_FILE, "utf8"));
  const users = Array.isArray(raw.users) ? raw.users : [];
  let imported = 0;

  for (const u of users) {
    if (!u?.email || !u?.passwordHash) continue;

    const existing = await prisma.user.findUnique({
      where: { email: u.email.toLowerCase() },
    });
    if (existing) {
      // eslint-disable-next-line no-console
      console.log(`   უკვე არსებობს: ${u.email}`);
      continue;
    }

    let payload = {};
    const stateFile = path.join(STATE_DIR, `${u.id}.json`);
    if (fs.existsSync(stateFile)) {
      try {
        payload = JSON.parse(fs.readFileSync(stateFile, "utf8"));
      } catch {
        payload = {};
      }
    }

    await prisma.user.create({
      data: {
        id: u.id,
        email: u.email.toLowerCase(),
        passwordHash: u.passwordHash,
        name: u.name || "სტუდენტი",
        createdAt: u.createdAt ? new Date(u.createdAt) : new Date(),
        appState: {
          create: { payload },
        },
      },
    });
    imported += 1;
    // eslint-disable-next-line no-console
    console.log(`   ✓ ${u.email}`);
  }

  // eslint-disable-next-line no-console
  console.log(`   იმპორტირებული: ${imported} მომხმარებელი`);
}

main()
  .catch((e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
