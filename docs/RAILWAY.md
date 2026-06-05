# Deploy Study Hub on Railway (GitHub)

## Is the project ready?

**Yes** — use **one Railway service** + **PostgreSQL** plugin. The server serves the React `build/` and the API on the same URL (no CORS hassle).

**Not on Railway:** local **Ollama** (use built-in AI or `REACT_APP_OPENAI_API_KEY`).

---

## Steps

### 1. Push repo

Already on: `git@github.com:tavdo/study-HUB.git`

### 2. Railway project

1. [railway.app](https://railway.app) → **New Project** → **Deploy from GitHub repo** → `tavdo/study-HUB`
2. Railway reads `railway.toml` at repo root (build + start).

### 3. Add PostgreSQL

1. Project → **+ New** → **Database** → **PostgreSQL**
2. Open Postgres service → **Variables** → copy `DATABASE_URL` (or use **Connect** → **Postgres URL**)

### 4. Link DB to the web service

1. Click your **Study Hub web service** (not Postgres)
2. **Variables** → **Add variable** (or **Reference** from Postgres):

| Variable | Value |
|----------|--------|
| `DATABASE_URL` | Reference from PostgreSQL service `${{Postgres.DATABASE_URL}}` |
| `JWT_SECRET` | Long random string (required in production) |
| `NODE_ENV` | `production` |
| `REACT_APP_USE_LOCAL_AI` | `false` (Ollama not available on Railway) |

Optional:

| Variable | Value |
|----------|--------|
| `REACT_APP_OPENAI_API_KEY` | For smarter AI |
| `CORS_ORIGINS` | Only if frontend is on another domain (comma-separated URLs) |
| `FRONTEND_URL` | Same as one frontend URL (alias for CORS) |

**Do not** commit real secrets; set them only in Railway Variables.

### 5. Deploy

Railway runs:

- Build: `npm ci` → `npm run build` → `server` deps + `prisma generate`
- Start: `prisma migrate deploy` → `node index.js`
- Serves UI + API on your `*.up.railway.app` URL

### 6. Public URL

Web service → **Settings** → **Networking** → **Generate Domain**

Open the URL → register / login.

---

## Two services (optional)

If you split frontend and API:

1. **API service** — Root: `/server`, start: `npm run start:prod`
2. **Static service** — Root: `/`, build: `npm run build`, use a static host or `npx serve -s build`
3. API variables: `CORS_ORIGINS=https://your-frontend.up.railway.app`
4. Frontend build variable: `REACT_APP_API_URL=https://your-api.up.railway.app`

Single service is simpler for demos.

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Build fails | Check Railway build logs; Node 20 |
| `DATABASE_URL` missing | Reference Postgres plugin on web service |
| Login works locally, not on Railway | Check domain uses HTTPS; JWT_SECRET set |
| AI always offline | Expected without Ollama; set `REACT_APP_USE_LOCAL_AI=false` or OpenAI key |
| Blank page | Ensure build step ran; check logs for `Serving React app` |

---

## GitHub Pages

`deploy.yml` still deploys **UI only** to GitHub Pages (no API/DB). For full app use **Railway**, not Pages alone.
