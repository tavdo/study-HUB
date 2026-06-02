# PostgreSQL — Study Hub (ქართულად)

## ვარიანტი A: Docker (ყველაზე მარტივი)

```bash
sudo apt install docker.io docker-compose-v2
sudo usermod -aG docker $USER
```

**მნიშვნელოვანი:** `usermod`-ის შემდეგ გადაალოგინე კომპიუტერი (ან ტერმინალში: `newgrp docker`), სანამ `npm run db:up` გაუშვებ.

თუ ჩანს `permission denied` Docker socket-ზე — ერთხელ გამოიყენე:

```bash
npm run db:up:sudo
```

შემდეგ:

```bash
npm run db:setup
npm run server
```

## ვარიანტი B: სისტემური PostgreSQL

```bash
sudo apt install postgresql postgresql-contrib
sudo -u postgres psql
```

SQL:

```sql
CREATE USER studyhub WITH PASSWORD 'studyhub_dev';
CREATE DATABASE studyhub_db OWNER studyhub;
GRANT ALL PRIVILEGES ON DATABASE studyhub_db TO studyhub;
\q
```

`server/.env`:

```
DATABASE_URL="postgresql://studyhub:studyhub_dev@localhost:5432/studyhub_db"
```

შემდეგ:

```bash
npm run db:setup
npm run server
```

## შემოწმება

```bash
curl http://localhost:5050/api/health
```

უნდა დააბრუნოს `"database":"postgresql"`.

## Prisma Studio (ცხრილების ნახვა)

```bash
cd server && npx prisma studio
```

ბრაუზერში გაიხსნება `http://localhost:5555`.

## ძველი JSON მონაცემები

თუ ადრე იყო `server/data/users.json`, `npm run db:setup` ავტომატურად გადაიტანს PostgreSQL-ში.
