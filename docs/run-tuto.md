# Study Hub — გაშვება ახალ კომპიუტერზე

ეს ინსტრუქცია განკუთვნილია იმისთვის, რომ პროექტი სხვა კომპიუტერზე გადმოწერის შემდეგ ლოკალურად გაუშვა.

---

## 1. რა გჭირდება წინასწარ

| პროგრამა | ვერსია | სად ჩამოვტვირთო |
|----------|--------|-----------------|
| **Node.js** | 18 ან უფრო ახალი (LTS რეკომენდებული) | https://nodejs.org |
| **npm** | Node-თან ერთად მოდის | — |
| **Git** | ბოლო ვერსია | https://git-scm.com |
| **Docker** (რეკომენდებული) | PostgreSQL-ისთვის | https://docker.com |

შეამოწმე ტერმინალში:

```bash
node -v
npm -v
git -v
docker -v
```

---

## 2. პროექტის გადმოწერა

### ვარიანტი A — Git-ით (რეკომენდებული)

```bash
git clone git@github.com:tavdo/study-HUB.git study-hub
cd study-hub
```

ან HTTPS-ით:

```bash
git clone https://github.com/tavdo/study-HUB.git study-hub
cd study-hub
```

### ვარიანტი B — ZIP არქივი

1. GitHub-ზე: **Code → Download ZIP**
2. გახსენი ZIP და გადადი პროექტის საქაღალდეში

---

## 3. დამოკიდებულებების დაყენება

პროექტის **root** საქაღალდიდან:

```bash
npm install
cd server && npm install && cd ..
```

ან ერთი ბრძანებით:

```bash
npm install && npm --prefix server install
```

---

## 4. გარემოს ფაილები (.env)

`.env` ფაილები რეპოზიტორიაში არ არის (უსაფრთხოებისთვის). ხელით უნდა შექმნა:

```bash
cp .env.example .env
cp server/.env.example server/.env
```

### Frontend — `.env`

```env
REACT_APP_USE_LOCAL_AI=true
```

სურვილისამებრ OpenAI-სთვის:

```env
REACT_APP_OPENAI_API_KEY=sk-...
```

### Backend — `server/.env`

მინიმუმ ეს ველები შეავსე:

```env
PORT=5050
JWT_SECRET=შენი-გრძელი-შემთხვევითი-სტრინგი
DATABASE_URL="postgresql://studyhub:studyhub_dev@localhost:5432/studyhub_db"
ADMIN_EMAIL=შენი@ელფოსტა.com
```

> `ADMIN_EMAIL` — ამ ელფოსტის მქონე მომხმარებელი გახდება ადმინი. თუ ცარიელია, **პირველი რეგისტრაცია** იქნება ადმინი.

---

## 5. PostgreSQL ბაზა

### ვარიანტი A — Docker (ყველაზე მარტივი)

პროექტის root-იდან:

```bash
npm run db:up
```

თუ permission error გამოვიდა:

```bash
npm run db:up:sudo
```

დაელოდე 5–10 წამს, შემდეგ ბაზის ცხრილები შექმენი:

```bash
npm run db:setup
```

### ვარიანტი B — PostgreSQL ხელით

1. დააინსტალირე PostgreSQL
2. შექმენი მომხმარებელი და ბაზა
3. `server/.env`-ში შეცვალე `DATABASE_URL`
4. გაუშვი: `npm run db:setup`

---

## 6. (სურვილისამებრ) ლოკალური AI — Ollama

AI ჩათი და ტესტების გენერაცია უფასოდ, API გასაღების გარეშე:

```bash
# Ollama დააინსტალირე: https://ollama.com
ollama pull llama3.1:8b
ollama serve
```

`server/.env`-ში უკვე არის:

```env
OLLAMA_BASE_URL=http://127.0.0.1:11434
OLLAMA_MODEL=llama3.1:8b
```

Ollama გარეშეც აპი მუშაობს — ჩაშენებული ასისტენტი გამოიყენება.

---

## 7. აპის გაშვება

**ორი ტერმინალი** გჭირდება.

### ტერმინალი 1 — სერვერი (API + ბაზა)

```bash
npm run server
```

წარმატებით გაშვებისას დაინახავ:

```
StudyHub server on port 5050
DB: PostgreSQL
```

### ტერმინალი 2 — ფრონტენდი (React)

```bash
npm start
```

ბრაუზერი ავტომატურად გაიხსნება: **http://localhost:3000**

---

## 8. პირველი შესვლა

1. გახსენი **http://localhost:3000**
2. დააჭირე **რეგისტრაცია** (`/register`)
3. შექმენი ანგარიში (ელფოსტა + პაროლი + სახელი)
4. შემდეგ შედი **შესვლით** (`/login`)

თუ `ADMIN_EMAIL` შენს ელფოსტას ემთხვევა, მენიუში გამოჩნდება **ადმინ პანელი**.

---

## 9. სასარგებლო ბრძანებები

| ბრძანება | რას აკეთებს |
|----------|-------------|
| `npm start` | React UI (პორტი 3000) |
| `npm run server` | Node API (პორტი 5050) |
| `npm run db:up` | PostgreSQL Docker-ში |
| `npm run db:down` | Docker ბაზის გაჩერება |
| `npm run db:setup` | ცხრილების შექმნა / მიგრაცია |
| `npm run build` | პროდაქშენ build |
| `cd server && npx prisma studio` | ბაზის ვიზუალური ნახვა |

---

## 10. ხშირი პრობლემები

### `Can't reach database server at localhost:5432`

- Docker გაშვებულია? → `npm run db:up`
- დაელოდე რამდენიმე წამს და თავიდან: `npm run db:setup`

### `DATABASE_URL არ არის`

- შექმენი `server/.env`: `cp server/.env.example server/.env`

### Docker permission denied

```bash
npm run db:up:sudo
```

ან Linux-ზე მომხმარებელი `docker` ჯგუფში დაამატე.

### AI არ მუშაობს

- სერვერი გაშვებულია? (`npm run server`)
- Ollama: `ollama serve` + `ollama pull llama3.1:8b`
- ან `.env`-ში დაამატე `REACT_APP_OPENAI_API_KEY`

### ფოტო არ იხსნება

- სერვერი უნდა იყოს ჩართული (ფაილები სერვერზე ინახება)
- გამოდი და თავიდან შედი ანგარიშში

### პორტი დაკავებულია

- 3000 ან 5050 დაკავებულია სხვა პროგრამით
- დახურე ძველი პროცესი ან შეცვალე `PORT` `server/.env`-ში

---

## 11. სწრაფი შეჯამება (copy-paste)

```bash
git clone https://github.com/tavdo/study-HUB.git study-hub
cd study-hub
npm install && npm --prefix server install
cp .env.example .env
cp server/.env.example server/.env
# შეცვალე server/.env — JWT_SECRET და ADMIN_EMAIL

npm run db:up
npm run db:setup

# ტერმინალი 1:
npm run server

# ტერმინალი 2:
npm start
```

ბრაუზერი: **http://localhost:3000** → რეგისტრაცია → შესვლა.

---

## 12. პროდაქშენი (ინტერნეტზე გამოქვეყნება)

Railway-ზე გაშვებისთვის იხილე: [RAILWAY.md](./RAILWAY.md)

---

**რეპოზიტორი:** https://github.com/tavdo/study-HUB
