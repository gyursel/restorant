import Stripe from 'stripe';
import {neon} from '@neondatabase/serverless';
import {HttpError, state} from './cms';

export type CheckoutItem = {slug:string;quantity:number};
export type CustomerDetails = {name:string;phone:string;note:string};

export const isCheckoutEnabled = () => {
  const key = process.env.STRIPE_SECRET_KEY || '';
  // Payments always use an isolated database, never the CMS database.
  // Missing or invalid configuration keeps the checkout button disabled.
  if (!process.env.PAYMENT_DATABASE_URL) return false;
  if (process.env.VERCEL_ENV === 'production')
    return process.env.ONLINE_ORDERING_ENABLED === 'true' && key.startsWith('sk_live_');
  // The experimental branch must only accept test payments.
  return process.env.CHECKOUT_TEST_MODE_ENABLED === 'true' && key.startsWith('sk_test_');
};

export function paymentsDb() {
  if (!process.env.PAYMENT_DATABASE_URL) throw new HttpError(503,'Базата за онлайн поръчки не е настроена.');
  return neon(process.env.PAYMENT_DATABASE_URL);
}

export function stripeClient() {
  if (!isCheckoutEnabled()) throw new HttpError(503, 'Онлайн плащанията още се настройват. Опитай отново по-късно.');
  return new Stripe(process.env.STRIPE_SECRET_KEY!);
}

// Production CMS is the authoritative pricing source for the staging branch.
// Never accept product names, amounts or currency from the browser.
export async function publishedStorefront(): Promise<any> {
  if (process.env.VERCEL_ENV === 'preview') {
    const response = await fetch('https://apex-drive-bulgaria.vercel.app/api/content', {
      cache: 'no-store',
      headers: {Accept:'application/json'},
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) throw new HttpError(503,'Менюто не е достъпно. Опитайте пак.');
    return response.json();
  }
  return JSON.parse((await state()).published);
}

export function validateCart(input:unknown): CheckoutItem[] {
  if (!Array.isArray(input) || input.length < 1 || input.length > 20)
    throw new HttpError(400,'Количката трябва да съдържа между 1 и 20 продукта.');
  const unique = new Set<string>();
  return input.map(raw => {
    if (!raw || typeof raw !== 'object') throw new HttpError(400,'Невалиден продукт.');
    const item = raw as Record<string,unknown>;
    if (typeof item.slug !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item.slug) || item.slug.length > 100)
      throw new HttpError(400,'Невалиден продукт.');
    if (!Number.isInteger(item.quantity) || Number(item.quantity) < 1 || Number(item.quantity) > 10 || unique.has(item.slug))
      throw new HttpError(400,'Невалидно количество или повторен продукт.');
    unique.add(item.slug);
    return {slug:item.slug,quantity:Number(item.quantity)};
  });
}

export function validateCustomer(value:unknown): CustomerDetails {
  if (!value || typeof value !== 'object') throw new HttpError(400,'Въведи име и телефон.');
  const input = value as Record<string,unknown>;
  const name = String(input.name || '').trim();
  const phone = String(input.phone || '').trim();
  const note = String(input.note || '').trim();
  if (name.length < 2 || name.length > 90) throw new HttpError(400,'Въведи име (2–90 символа).');
  if (phone.length < 7 || phone.length > 22 || !/^[+\d\s()\-]+$/.test(phone))
    throw new HttpError(400,'Въведи валиден телефон.');
  if (note.length > 300) throw new HttpError(400,'Бележката може да е до 300 символа.');
  return {name,phone,note};
}

export async function pricedItems(cart: CheckoutItem[]) {
  const data = await publishedStorefront();
  const products = data?.menu?.products || [];
  const lineItems: {slug:string;name:string;quantity:number;unitCents:number}[]=[];
  let totalCents = 0;
  for (const item of cart) {
    const product = products.find((p:any) => p.slug === item.slug);
    if (!product || !product.available) throw new HttpError(400,'Продуктът не е наличен: '+item.slug);
    if (typeof product.name !== 'string' || !Number.isFinite(product.price) || product.price <= 0 || product.price > 10000)
      throw new HttpError(400,'Невалидна цена на продукт.');
    const unitCents = Math.round(product.price*100);
    if (!Number.isSafeInteger(unitCents) || unitCents <= 0) throw new HttpError(400,'Невалидна цена.');
    totalCents+=unitCents*item.quantity;
    lineItems.push({slug:item.slug,name:product.name.slice(0,200),unitCents,quantity:item.quantity});
  }
  if (totalCents < 50 || totalCents > 1000000)
    throw new HttpError(400,'Поръчката трябва да е между 0,50 € и 10 000 €.');
  return {lineItems,totalCents};
}

/**
 * Reconcile a pending order from Stripe's authoritative Checkout session.
 *
 * The signed webhook is still the primary payment notification. However,
 * network failures or delayed event delivery must not leave paid customers
 * on a perpetual spinner. The browser-supplied order UUID NEVER determines
 * paid status: Stripe's API must confirm the exact saved Checkout session,
 * server-calculated amount, currency and order reference.
 */
export async function orderStatus(id:string) {
  const sql=paymentsDb();
  const result=await sql`SELECT id,status,COALESCE(to_jsonb(payment_orders)->>'fulfillment_status','new') AS fulfillment_status,checkout_session_id,amount_cents,currency,items,created_at
    FROM payment_orders WHERE id=${id}::uuid`;
  if (!result.length) throw new HttpError(404,'Поръчката не е намерена.');
  let row=result[0];

  if (row.status==='pending' && typeof row.checkout_session_id==='string' &&
      row.checkout_session_id.startsWith('cs_')) {
    try {
      const session=await stripeClient().checkout.sessions.retrieve(row.checkout_session_id);
      const expectedMode=process.env.VERCEL_ENV==='production';
      const paid=session.status==='complete' && session.payment_status==='paid' &&
        session.mode==='payment' && session.livemode===expectedMode &&
        session.id===row.checkout_session_id &&
        session.currency===row.currency &&
        session.amount_total===row.amount_cents &&
        session.metadata?.order_id===id &&
        session.client_reference_id===id;
      if (paid) {
        const paymentIntent=typeof session.payment_intent==='string'
          ? session.payment_intent : session.payment_intent?.id || null;
        const updated=await sql`UPDATE payment_orders SET status='paid',
          stripe_payment_intent=${paymentIntent},
          paid_at=COALESCE(paid_at,NOW()),updated_at=NOW()
          WHERE id=${id}::uuid AND status='pending'
          AND checkout_session_id=${session.id}
          AND amount_cents=${session.amount_total} AND currency=${session.currency}
          RETURNING id,status,COALESCE(to_jsonb(payment_orders)->>'fulfillment_status','new') AS fulfillment_status,checkout_session_id,amount_cents,currency,items,created_at`;
        if (updated.length) row=updated[0];
        else {
          // A webhook may have updated the same order while we verified Stripe.
          const current=await sql`SELECT id,status,COALESCE(to_jsonb(payment_orders)->>'fulfillment_status','new') AS fulfillment_status,checkout_session_id,amount_cents,currency,items,created_at
            FROM payment_orders WHERE id=${id}::uuid`;
          if (current.length) row=current[0];
        }
      }
    } catch(error) {
      // Keep the order pending if Stripe cannot be reached; do not infer success.
      console.error('Stripe order reconciliation failed:',error instanceof Error ? error.name : 'unknown');
    }
  }
  return {
    id:row.id,
    status:row.status,
    fulfillmentStatus:row.fulfillment_status,
    amountCents:row.amount_cents,
    currency:row.currency,
    items:row.items,
    createdAt:row.created_at,
  };
}
