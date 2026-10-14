import {json} from '../../../../server/cms';
import {isCheckoutEnabled, paymentsDb} from '../../../../server/payments';

export const dynamic='force-dynamic';
export const runtime='nodejs';

type DatabaseIssue = 'none' | 'invalid-url' | 'authentication' | 'database-not-found' |
  'missing-table' | 'schema-mismatch' | 'permission-denied' | 'connection-failed' | 'unknown';

function classifyDatabaseError(error:unknown):DatabaseIssue {
  const e=error as {code?:string;message?:string} | null;
  const code=String(e?.code||'');
  const message=String(e?.message||'').toLowerCase();
  // Deliberately return only whitelisted error classes. Never expose
  // error.message, stack traces, usernames, hosts, or credentials publicly.
  if (code==='42P01' || /relation .* does not exist/.test(message)) return 'missing-table';
  if (code==='42703' || /column .* does not exist/.test(message)) return 'schema-mismatch';
  if (code==='28P01' || code==='28000' || /password authentication failed|authentication failed|invalid authorization/.test(message)) return 'authentication';
  if (code==='3D000' || /database .* does not exist/.test(message)) return 'database-not-found';
  if (code==='42501' || /permission denied/.test(message)) return 'permission-denied';
  if (/invalid (database )?url|invalid connection string|invalid url|protocol|no database host|must be a valid/.test(message))
    return 'invalid-url';
  if (/fetch failed|timeout|timed out|network|enotfound|econnrefused|unable to connect|could not connect/.test(message))
    return 'connection-failed';
  return 'unknown';
}

export async function GET() {
  const configured=isCheckoutEnabled();
  let databaseReady=false;
  let databaseIssue:DatabaseIssue='none';
  if (configured) {
    try {
      const sql=paymentsDb();
      // No rows, personally identifying data, or credentials are returned.
      await sql`SELECT id,status,amount_cents,currency,customer_name,phone,note,items,checkout_session_id,updated_at
        FROM payment_orders LIMIT 0`;
      databaseReady=true;
    } catch (error) {
      databaseIssue=classifyDatabaseError(error);
      console.error('Payment DB health check failed. Safe classification:',databaseIssue);
    }
  }
  return json({
    enabled:configured && databaseReady,
    configured,
    databaseReady,
    databaseIssue,
    webhookConfigured:Boolean(process.env.STRIPE_WEBHOOK_SECRET?.startsWith('whsec_')),
    mode:process.env.VERCEL_ENV==='production'?'live':'test',
    currency:'eur',
    fulfillment:'pickup',
  });
}
