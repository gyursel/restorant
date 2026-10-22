# APEX DRIVE BULGARIA — Vercel Independent Edition

Сайт + `/admin` с **Neon Postgres**, **Vercel Blob** и собствен вход с имейл и парола. **Не изисква ChatGPT Sites или Cloudflare.**

**ПЪЛНИ ИНСТРУКЦИИ:** [`docs/DEPLOY-VERCEL.md`](docs/DEPLOY-VERCEL.md)

```bash
npm install
npm run build
```

След настройка на `DATABASE_URL`, `BLOB_READ_WRITE_TOKEN`, `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH` и `SESSION_SECRET` и изпълнение на `database/schema.sql`, отваряш `/admin/login`.

Това е подготвен за Vercel *изходен код*, не автоматично публикуван сайт. Не са включени онлайн плащания и приемане на поръчки
