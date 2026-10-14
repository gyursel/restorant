-- APEX DRIVE payment orders (Stripe Checkout), run in Neon SQL Editor.
-- Safe to repeat, does not modify existing CMS records.
CREATE TABLE IF NOT EXISTS payment_orders (
  id UUID PRIMARY KEY,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'paid', 'expired', 'failed')),
  currency TEXT NOT NULL DEFAULT 'eur'
    CHECK (currency = 'eur'),
  amount_cents INTEGER NOT NULL CHECK (amount_cents > 0),
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  note TEXT NOT NULL DEFAULT '',
  items JSONB NOT NULL,
  checkout_session_id TEXT UNIQUE,
  stripe_payment_intent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  paid_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS payment_orders_status_created
  ON payment_orders (status, created_at DESC);
-- Administrators can inspect paid orders with:
-- SELECT id,customer_name,phone,items,amount_cents,created_at
-- FROM payment_orders WHERE status = 'paid' ORDER BY created_at DESC;
