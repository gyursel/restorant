# APEX DRIVE — тестови плащания с карта

## Какво е разработено

В този експериментален клон (`feature/stripe-checkout-test`) има работен UI за количка, продукти, вземане от място (Drive-Thru) и интеграция с **Stripe Checkout**. Плащането се приема в EUR, а Checkout има български интерфейс.

**НЕ Е активирано приемане на реални плащания.** По подразбиране бутонът за плащане е заключен, докато не се настроят Stripe тестовите ключове и таблицата за поръчки. Публичният сайт в `main` не е променен.

## Настройка на Preview / тестови плащания

1. В Stripe Dashboard създай/отвори бизнес акаунт и избери **Test mode** (тестов режим). Никога не използвай реални номера на карти за тест.
2. В Neon SQL Editor изпълни [database/payments.sql](../database/payments.sql) **в базата, използвана от Preview**. Тя трябва да има таблица `payment_orders`; задължителна е `DATABASE_URL` за Preview. Не смесвай тестовите поръчки с реалните.
3. Във Vercel → Project → Environment Variables добави само за **Preview**:
   - `STRIPE_SECRET_KEY` = Stripe **test** секретен API ключ, започващ с `sk_test_`
   - `CHECKOUT_TEST_MODE_ENABLED` = `true`
   - `DATABASE_URL` = твоят **тестов Neon** URL (ако вече е конфигуриран за Preview, не го презаписвай)
4. В Stripe → Developers → Webhooks / Event Destinations добави HTTPS endpoint с точния адрес на branch Preview: `https://<preview-host>/api/webhooks/stripe`. Той трябва да е достъпен без Vercel Authentication. Избери събития:
   - `checkout.session.completed`
   - `checkout.session.async_payment_succeeded`
   - `checkout.session.async_payment_failed`
   - `checkout.session.expired`
5. Копирай **webhook signing secret**, започващ с `whsec_`, във Vercel Preview `STRIPE_WEBHOOK_SECRET`. **Не го изпращай в чат или GitHub.**
6. Redeploy на branch Preview. Провери публично `/api/checkout/config`: трябва да върне `"enabled":true, "mode":"test"` (при правилна конфигурация).
7. Избери продукти от менюто → количка → въведи име/телефон → Stripe тестово плащане. Използвай Stripe тестовата карта **4242 4242 4242 4242** с произволна бъдеща дата и CVC, или друг официален тестов метод.
8. В Stripe → Webhooks потвърди успешна доставка на `checkout.session.completed`. В SQL проверка: `SELECT id,status,amount_cents,created_at FROM payment_orders ORDER BY created_at DESC LIMIT 10;`. `status` трябва да е `paid`. Потвърждението на сайта се обновява след webhook.

## Сигурност

- Клиентът изпраща само slug и количество — **цените се пресмятат от публикуваното меню на сървъра**.
- Без събиране, съхранение или обработка на номер на карта в сайта — картовите полета са на Stripe.
- Оторизираното админ меню „Поръчки“ показва платени/чакащи поръчки.
- Webhook подписът се проверява с официалния Stripe SDK; URL-ът на успешното плащане **не** маркира поръчката като платена.
- Обработката е идемпотентна и проверява `amount_cents`, EUR, номер на Checkout сесия и UUID на поръчката.
- Запазва се само необходимото за вземане от място: име, телефон, бележка, артикули, сума, статус и технически идентификатори.
- Кодът в Preview отказва **live** Stripe ключове.

## Преди да приемаш реални пари

Трябват: потвърден Stripe бизнес акаунт, фирмени/данъчни данни и банкова сметка, валидирани касови/фискални документи за България, ясни условия за продажба и политика за личните данни, правила за анулиране/възстановяване, персонал за потвърждение на поръчките, мониторинг на webhook и тест на грешни/дублирани плащания. За храни: информация за алергени и начин на приемане/предаване на поръчките.

След успешен тест трябва да подготвим **отделен Production release**. За него се използват `sk_live_`, live webhook signing secret и `ONLINE_ORDERING_ENABLED=true` във Vercel Production. **Не активирай тази настройка преди завършените проверки и изрично одобрение.**

За повече информация: https://docs.stripe.com/checkout/quickstart и https://docs.stripe.com/webhooks
