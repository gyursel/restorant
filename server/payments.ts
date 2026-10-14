import Stripe from 'stripe';
import {db, HttpError, state} from './cms';

export type CheckoutItem = {slug:string;quantity:number};
export type CustomerDetails = {name:string;phone:string;note:string};

export const isCheckoutEnabled = () => {
  const key = process.env.STRIPE_SECRET_KEY || '';
  if (!process.env.DATABASE_URL) return false;
  if (process.env.VERCEL_ENV === 'production')
    return process.env.ONLINE_ORDERING_ENABLED === 'true' && key.startsWith('sk_live_');
  // The experimental branch must only accept test payments.
  return process.env.CHECKOUT_TEST_MODE_ENABLED === 'true' && key.startsWith('sk_test_');
};

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

export async function orderStatus(id:string) {
  const sql=db();
  const result=await sql`SELECT id,status,amount_cents,currency,items,created_at
    FROM payment_orders WHERE id=${id}::uuid`;
  if (!result.length) throw new HttpError(404,'Поръчката не е намерена.');
  const row=result[0];
  return {
    id:row.id,
    status:row.status,
    amountCents:row.amount_cents,
    currency:row.currency,
    items:row.items,
    createdAt:row.created_at,
  };
}
