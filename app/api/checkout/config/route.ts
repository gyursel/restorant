import {json} from '../../../../server/cms';
import {isCheckoutEnabled, paymentsDb} from '../../../../server/payments';

export const dynamic='force-dynamic';
export const runtime='nodejs';

export async function GET() {
  const configured=isCheckoutEnabled();
  let databaseReady=false;
  if (configured) {
    try {
      // Safe read-only health check. Returns no connection string, rows or personal data.
      // The Preview must connect to the dedicated Neon stripe-test branch.
      const sql=paymentsDb();
      await sql`SELECT id,status,amount_cents,currency,customer_name,phone,note,items,checkout_session_id,updated_at
        FROM payment_orders LIMIT 0`;
      databaseReady=true;
    } catch (error) {
      console.error('Payment database preflight failed:',error instanceof Error ? error.name : 'unknown');
    }
  }
  return json({
    enabled:configured && databaseReady,
    configured,
    databaseReady,
    webhookConfigured:Boolean(process.env.STRIPE_WEBHOOK_SECRET?.startsWith('whsec_')),
    mode:process.env.VERCEL_ENV==='production'?'live':'test',
    currency:'eur',
    fulfillment:'pickup',
  });
}
