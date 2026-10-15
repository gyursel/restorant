import type Stripe from 'stripe';
import {json,failure,HttpError} from '../../../../server/cms';
import {stripeClient,paymentsDb} from '../../../../server/payments';

export const dynamic='force-dynamic';
export const runtime='nodejs';

export async function POST(request:Request) {
  try {
    const secret=process.env.STRIPE_WEBHOOK_SECRET;
    if (!secret?.startsWith('whsec_')) throw new HttpError(503,'Webhook не е настроен.');
    const signature=request.headers.get('stripe-signature');
    if (!signature) throw new HttpError(400,'Липсва подпис на Stripe.');
    if (Number(request.headers.get('content-length')||0)>1000000)
      throw new HttpError(413,'Webhook заявката е твърде голяма.');

    const stripe=stripeClient();
    const raw=await request.text();
    let event:Stripe.Event;
    try { event=stripe.webhooks.constructEvent(raw,signature,secret); }
    catch { throw new HttpError(400,'Невалиден Stripe подпис.'); }

    const events=['checkout.session.completed','checkout.session.async_payment_succeeded',
      'checkout.session.async_payment_failed','checkout.session.expired'];
    if (!events.includes(event.type)) return json({received:true});
    const session=event.data.object as Stripe.Checkout.Session;
    const id=session.metadata?.order_id || session.client_reference_id || '';
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id))
      throw new HttpError(400,'Невалиден идентификатор.');

    const sql=paymentsDb();
    const paymentIntent=typeof session.payment_intent==='string' ? session.payment_intent : session.payment_intent?.id || null;
    if ((event.type==='checkout.session.completed'||event.type==='checkout.session.async_payment_succeeded')
        && session.payment_status==='paid' && session.currency==='eur' && typeof session.amount_total==='number' && Number.isSafeInteger(session.amount_total) && session.amount_total>0) {
      // Idempotent: successful payment must match both the order and the
      // Stripe session, as well as the original server-calculated EUR total.
      await sql`UPDATE payment_orders SET status='paid',stripe_payment_intent=${paymentIntent},
          paid_at=COALESCE(paid_at,NOW()),updated_at=NOW()
        WHERE id=${id}::uuid AND checkout_session_id=${session.id}
        AND amount_cents=${session.amount_total} AND currency='eur'
        AND status='pending'`;
    } else if (event.type==='checkout.session.expired') {
      await sql`UPDATE payment_orders SET status='expired',updated_at=NOW()
        WHERE id=${id}::uuid AND checkout_session_id=${session.id} AND status='pending'`;
    } else if (event.type==='checkout.session.async_payment_failed') {
      await sql`UPDATE payment_orders SET status='failed',updated_at=NOW()
        WHERE id=${id}::uuid AND checkout_session_id=${session.id} AND status='pending'`;
    }
    return json({received:true});
  } catch(error) { return failure(error); }
}
