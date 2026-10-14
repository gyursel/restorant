import {randomUUID} from 'node:crypto';
import {sameOrigin, db, json, failure, HttpError} from '../../../../server/cms';
import {stripeClient, validateCart, validateCustomer, pricedItems} from '../../../../server/payments';

export const dynamic='force-dynamic';
export const runtime='nodejs';

export async function POST(request:Request) {
  try {
    sameOrigin(request);
    if (Number(request.headers.get('content-length')||0)>10000)
      throw new HttpError(413,'Твърде голяма заявка.');
    const raw=await request.text();
    if (raw.length>10000) throw new HttpError(413,'Твърде голяма заявка.');
    let input:any;
    try { input=JSON.parse(raw); } catch { throw new HttpError(400,'Невалидна заявка.'); }

    const cart=validateCart(input?.items);
    const customer=validateCustomer(input?.customer);
    const {lineItems,totalCents}=await pricedItems(cart);
    const stripe=stripeClient();
    const sql=db();
    const id=randomUUID();

    // The database record starts pending. A signed Stripe webhook, not the
    // browser redirect, is the only way to mark an order paid.
    await sql`INSERT INTO payment_orders(id,status,amount_cents,currency,
      customer_name,phone,note,items)
      VALUES(${id}::uuid,'pending',${totalCents},'eur',
      ${customer.name},${customer.phone},${customer.note},${JSON.stringify(lineItems)}::jsonb)`;

    try {
      const origin=new URL(request.url).origin;
      const session=await stripe.checkout.sessions.create({
        mode:'payment',
        locale:'bg',
        // Stripe v23 selects supported payment methods from the Dashboard configuration.
        line_items:lineItems.map(item=>({
          quantity:item.quantity,
          price_data:{
            currency:'eur',
            unit_amount:item.unitCents,
            product_data:{name:item.name},
          },
        })),
        client_reference_id:id,
        metadata:{order_id:id},
        success_url:origin+'/order/success?order_id='+encodeURIComponent(id),
        cancel_url:origin+'/cart?canceled=1',
      },{idempotencyKey:id});

      if (!session.url) throw new Error('Stripe Checkout URL missing');
      await sql`UPDATE payment_orders SET checkout_session_id=${session.id},updated_at=NOW()
        WHERE id=${id}::uuid`;
      return json({url:session.url});
    } catch(error) {
      await sql`UPDATE payment_orders SET status='failed',updated_at=NOW()
        WHERE id=${id}::uuid AND status='pending'`.catch(()=>{});
      console.error('Checkout session creation failed:',error instanceof Error ? error.message : 'unknown');
      throw new HttpError(502,'Не успяхме да отворим плащането. Опитай отново.');
    }
  } catch(error) { return failure(error); }
}
