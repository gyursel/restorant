import {json} from '../../../../server/cms';
import {isCheckoutEnabled} from '../../../../server/payments';
export const dynamic='force-dynamic';
export async function GET() {
  return json({
    enabled:isCheckoutEnabled(),
    mode:process.env.VERCEL_ENV==='production'?'live':'test',
    currency:'eur',
    fulfillment:'pickup',
  });
}
