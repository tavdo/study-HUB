# Study Hub

An all-in-one AI-powered study companion built with React.

## Features

- **Dashboard** — Live stats from your notes, groups, and library
- **Notes** — Create, edit, search, share, and delete notes (saved in browser)
- **Library** — Upload files, add video links, search and filter
- **Users** — Browse, search, filter, and add users
- **Messages** — Group chat with multiple groups
- **AI Assistant** — Smart study replies (optional OpenAI API key)
- **Settings** — Profile and notification preferences (persisted locally)

## Quick start

```bash
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000) and click **Let's Start**.

## Optional: Real OpenAI responses

1. Copy `.env.example` to `.env`
2. Add your key: `REACT_APP_OPENAI_API_KEY=sk-...`
3. Restart `npm start`

Without a key, the app uses built-in study-assistant responses.

## Free local AI (recommended): Ollama

You can run a **free** AI locally (no API key) using Ollama + a small Node proxy server.

1. Install Ollama and pull a model (example):

```bash
ollama pull llama3.1:8b
ollama serve
```

2. Start the AI proxy server:

```bash
npm run server
```

3. Enable local AI in the frontend:

1. Copy `.env.example` to `.env`
2. Set `REACT_APP_USE_LOCAL_AI=true`
3. Restart `npm start`

Now quiz generation + AI chat will use Ollama when available, and fall back to the built-in assistant if the server is off.

## Build & deploy

```bash
npm run build
```

GitHub Pages deploys automatically on push to `main` via `.github/workflows/deploy.yml` (uses HashRouter for routing).

## Accounts & PostgreSQL database

User accounts and app data (notes, groups, quizzes, etc.) are stored in **PostgreSQL** via Prisma.

### One-time setup

```bash
# 1) PostgreSQL (Docker — easiest)
npm run db:up

# 2) Configure server (if you don't have server/.env yet)
cp server/.env.example server/.env

# 3) Create tables + optional import from old JSON files
npm run db:setup

# 4) Start API
npm run server
```

Frontend: `npm start` → register at `/register` or login at `/login`.

**Without Docker:** install PostgreSQL locally, create user/database, set `DATABASE_URL` in `server/.env`, then `npm run db:setup`.

**GUI:** `cd server && npx prisma studio` (not phpMyAdmin — that's for MySQL only).

File uploads (photos, PDFs) still use **IndexedDB** in the browser until cloud storage is added.

## Data storage (browser)

Per-user cache in **localStorage** (`studyhub_v1_<userId>`) syncs with the server. Offline edits are cached locally.
