# APEX DRIVE BULGARIA — независим Vercel хостинг

Тази версия НЕ използва ChatGPT Sites, Cloudflare D1, R2 или OpenAI auth headers.

## 1. Настрой и публикувай

1. Създай нов GitHub repository и качи файловете от тази папка (не качвай `.env.local`).
2. В [Vercel](https://vercel.com/new) импортирай repository, Framework Preset: **Next.js**, Root Directory: коренът на проекта, Build Command: `npm run build`.
3. В проекта Vercel → Storage добави **Neon Postgres** (избери региона близо до функциите) и получи **DATABASE_URL**. Този проект очаква `DATABASE_URL`, не `POSTGRES_URL` — ако интеграцията е създала друго име, добави `DATABASE_URL` с получения connection string в Environment Variables.
4. В Neon Console → SQL Editor изпълни целия `database/schema.sql` върху production базата (и отделна preview база при нужда).
5. В Vercel → Storage добави **Blob** store с **Public** access и го свържи с проекта; `BLOB_READ_WRITE_TOKEN` се добавя автоматично. Качените публични снимки имат уникален път.
6. Генерирай хеш на паролата локално: `node scripts/make-password-hash.mjs` (използвай поне 14 символа). Генерирай таен ключ: `node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"`.
7. Vercel → Project → Settings → Environment Variables: добави **ADMIN_EMAIL**, **ADMIN_PASSWORD_HASH** и **SESSION_SECRET**; провери **DATABASE_URL** и **BLOB_READ_WRITE_TOKEN**. Настрой за **Production**, а ако използваш Preview — за отделната тестова конфигурация. След промяна направи Redeploy.
8. Публикувай, отвори `https://your-project.vercel.app/admin/login`, влез с имейл/парола, редактирай цена, запази чернова, публикувай и виж резултата в публичната страница.
9. Тествай качване на снимка, грешна парола/5 неуспешни опита, изход и неоторизиран GET към `/api/admin/draft` (трябва 401).

**Не качвай паролата, hash/secret, DATABASE_URL или Blob token в публичния GitHub repository.** Не добавяй `NEXT_PUBLIC_` към секретните променливи.

## 2. Какво включва

- `/` публичен ресторантски сайт, `/menu` и `/product/...`.
- `/admin/login` личен административен вход с scrypt парола, HttpOnly подписана сесийна cookie (12h) и общ лимит за грешни опити в Postgres.
- `/admin` — управление на снимки, меню, цени, промоции, текстове, контакти, работно време, теми, история на публикациите, визуален преглед.
- Postgres таблици `cms_state`, `cms_revisions`, `cms_media`, `cms_login_guard`; автоматично начално съдържание от `server/seed.json` на първо зареждане.
- Всяка снимка до **4 MB** (лимит на Vercel Functions: 4.5 MB за цялата HTTP заявка). JPG/PNG/WebP. Ако трябва 8–20 MB, трябва отделен direct-to-Blob клиентски upload flow.
- Предварително включените снимки са в `public/images`; новите снимки са във Vercel Blob. Промяната на съдържание е на два етапа: чернова и публикуване.

## 3. Защитни условия

- Собственикът влиза само чрез `ADMIN_EMAIL` и силна парола; сървърът пази само нейния scrypt hash.
- Сесията е подписана с `SESSION_SECRET`, Secure/HttpOnly cookie в Production; API изисква сесия, POST има Same-Origin проверка.
- След 5 последователни грешни логина достъпът се заключва за 15 минути (глобално за собственика). При тежък трафик включи и Vercel Firewall/Rate Limiting; глобалният lockout може да бъде злоупотребен за отказ на достъп.
- Изображенията в Public Blob са публично достъпни по URL и не трябва да съдържат поверителна информация.
- Секретите не са нужни при build, но са задължителни при реална работа.
- Ако прехвърляш стар работещ ChatGPT Sites проект с данни отвъд seed.json, ТЕ НЕ СЕ ПРЕХВЪРЛЯТ АВТОМАТИЧНО; експортирай CMS съдържанието/снимките и мигрирай отделно.

## 4. Локално

```bash
npm install
cp .env.example .env.local
# Постави реалните стойности в .env.local и изпълни SQL миграцията
npm run dev
```

**Забележка:** редактирането и публикуването са независими от преразгръщане на Vercel. Планирай резервни копия на Neon и Blob.
