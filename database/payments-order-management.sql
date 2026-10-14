-- APEX DRIVE — управленски статуси за онлайн поръчки
-- Пусни в Neon SQL Editor върху stripe-test за тестовете.
-- За Production изпълни миграцията само върху избраната отделна база за поръчки.
ALTER TABLE payment_orders
  ADD COLUMN IF NOT EXISTS fulfillment_status TEXT NOT NULL DEFAULT 'new';
ALTER TABLE payment_orders
  ADD COLUMN IF NOT EXISTS fulfillment_updated_at TIMESTAMPTZ;
ALTER TABLE payment_orders
  ADD COLUMN IF NOT EXISTS handler_note TEXT NOT NULL DEFAULT '';

-- Отделяме логистичния статус от банковия (pending/paid/failed/expired).
ALTER TABLE payment_orders
  DROP CONSTRAINT IF EXISTS payment_orders_fulfillment_status_check;
ALTER TABLE payment_orders
  ADD CONSTRAINT payment_orders_fulfillment_status_check
  CHECK (fulfillment_status IN ('new','accepted','preparing','ready','handed_over','cancel_requested'));

CREATE TABLE IF NOT EXISTS payment_order_events (
  id BIGSERIAL PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES payment_orders(id),
  previous_status TEXT NOT NULL,
  next_status TEXT NOT NULL,
  staff_email TEXT NOT NULL,
  note TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS payment_order_events_order_created
  ON payment_order_events (order_id, created_at DESC);
CREATE INDEX IF NOT EXISTS payment_orders_fulfillment_created
  ON payment_orders (fulfillment_status, created_at DESC);
