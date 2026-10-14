# APEX DRIVE — Официален сайт и админ панел за поръчки

## Статус на този release
- Публикуваме Premium дизайн **с количка, избор на продукти, поръчка и проследяване** на официалния сайт.
- В админ панела се появява раздел **„Поръчки“** с кухненски статуси и звукови известия след разрешение от браузъра.
- **Никакви реални плащания не се включват автоматично.** Официалният checkout остава заключен, докато Production Stripe и Production база не са изрично настроени.
- Preview Stripe Sandbox с тестова Neon база `stripe-test` остава отделен; тестовите поръчки не се появяват в Production и обратното.

## Подготовка за админ поръчки във Preview

1. В Neon → branch `stripe-test` → SQL Editor изпълни [payments-order-management.sql](../database/payments-order-management.sql). Тя добавя `fulfillment_status`, `handler_note`, `fulfillment_updated_at` и журнал `payment_order_events`, без да променя CMS.
2. Отвори новия Preview deployment → `/admin`. За Preview може да са необходими отделно зададени `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH`, `SESSION_SECRET`, `DATABASE_URL` (съществуващият Preview CMS достъп) — НЕ копирай тайни в чат. Не насочвай Preview към production база за поръчки.
3. Прегледай тестовата поръчка с `paid`, промени статусите **Нова → Приета → Приготвя се → Готова → Предадена**. В Neon провери логовете: `SELECT * FROM payment_order_events ORDER BY created_at DESC LIMIT 15;`.
4. Звуковите сигнали се активират с бутон `Включи звук` и работят, когато табът е отворен и браузърът позволява звук.

## Production: какво трябва да се направи преди приемане на поръчки

1. Създай **нова production Neon база или изолиран production branch за онлайн поръчките**. Не използвай `stripe-test` и не презаписвай CMS `DATABASE_URL`.
2. В Neon SQL Editor на тази отделна база изпълни [payments.sql](../database/payments.sql), **след това** [payments-order-management.sql](../database/payments-order-management.sql).
3. Във Vercel Settings → Environment Variables за **Production** настрой:
   - `PAYMENT_DATABASE_URL` — връзка към Production *orders* Neon база.
   - `STRIPE_SECRET_KEY` — live ключ `sk_live_...`, само след Stripe бизнес верификация.
   - `STRIPE_WEBHOOK_SECRET` — **отделен live** Stripe webhook signing secret `whsec_...`.
   - `ONLINE_ORDERING_ENABLED=true` — **ПОСЛЕДНО**, след всички проверки, като изрично включване.
4. Live Webhook endpoint: `https://apex-drive-bulgaria.vercel.app/api/webhooks/stripe` с четирите Stripe Checkout събития от [STRIPE-CHECKOUT.md](STRIPE-CHECKOUT.md). **Не** използвай Preview automation bypass в публичния Production URL.
5. Изпълни Production Redeploy след настройките. Потвърди `/api/checkout/config` показва `mode:"live", enabled:true, databaseReady:true, webhookConfigured:true`. Преди включване `enabled` трябва да е `false`.
6. Направи ограничена реална транзакция само след изрично съгласие на собственика, провери webhook, `paid` в **Production** база, поръчката в **официалния** `/admin`, кухнята и предаването.

## Отказ и възстановяване на пари

За платена поръчка **„Откажи“ означава `cancel_requested` — възстановяването НЕ става автоматично.**
Администраторът трябва да възстанови парите през съответната Stripe Dashboard среда, да провери статуса там, да комуникира с клиента и да документира сумата. Панелът не маркира банковото плащане като автоматично `refunded`, защото това би било подвеждащо.

## Оперативни проверки преди реални поръчки
- Верифициран Stripe business, банкова сметка, продуктови цени в EUR, условия за продажба, български фискални и счетоводни изисквания, GDPR и срок на съхранение на данните.
- Преди „Готова“ персоналът действително приготвя поръчката. Звуковите сигнали в браузър не са гарантирана push услуга.
- Системата е **вземане от място**, без интеграция за доставки или касов принтер. Няма автоматично възстановяване на плащания.
- Проверявай несъответствията и грешките във Vercel Runtime Logs, Stripe Event Deliveries и Neon.
