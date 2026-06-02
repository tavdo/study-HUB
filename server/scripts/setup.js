/**
 * ბაზის მigration + ძველი JSON მონაცემების იმპორტი (თუ არსებობს).
 * გაშვება: npm run db:setup (server საქაღალდიდან ან root-იდან)
 */
import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const serverRoot = path.join(__dirname, "..");
const envPath = path.join(serverRoot, ".env");

dotenv.config({ path: envPath });

if (!process.env.DATABASE_URL) {
  // eslint-disable-next-line no-console
  console.error(`
❌ server/.env ფაილი ან DATABASE_URL არ მოიძებნა.

1) cp server/.env.example server/.env
2) Docker-ით PostgreSQL:  npm run db:up   (პროექტის root-იდან)
   ან ხელით შექმენი ბაზა studyhub_db
3) თავიდან: npm run db:setup
`);
  process.exit(1);
}

// eslint-disable-next-line no-console
console.log("📦 Prisma migrate deploy…");
execSync("npx prisma migrate deploy", {
  cwd: serverRoot,
  stdio: "inherit",
  env: process.env,
});

const migrateJson = path.join(__dirname, "migrate-from-json.js");
if (fs.existsSync(migrateJson)) {
  // eslint-disable-next-line no-console
  console.log("\n📂 JSON → PostgreSQL მიგრაცია (თუ არის ძველი ფაილები)…");
  execSync("node scripts/migrate-from-json.js", {
    cwd: serverRoot,
    stdio: "inherit",
    env: process.env,
  });
}

// eslint-disable-next-line no-console
console.log("\n✅ ბაზა მზადაა. გაუშვი: npm run server");
