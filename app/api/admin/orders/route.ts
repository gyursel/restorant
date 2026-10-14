import {authorize,sameOrigin,json,failure,HttpError} from '../../../../server/cms';
import {paymentsDb} from '../../../../server/payments';

export const dynamic='force-dynamic';
export const runtime='nodejs';

const statuses=['new','accepted','preparing','ready','handed_over','cancel_requested'] as const;
type Fulfillment=typeof statuses[number];
const transitions:Record<Fulfillment,Fulfillment[]>={
  new:['accepted','cancel_requested'],
  accepted:['preparing','cancel_requested'],
  preparing:['ready','cancel_requested'],
  ready:['handed_over','cancel_requested'],
  handed_over:[],
  cancel_requested:[],
};
const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function GET() {
  try {
    await authorize();
    // The production storefront may publish its cart before live payments
    // are activated. It must not require preview/test orders to be shared.
    if (!process.env.PAYMENT_DATABASE_URL)
      return json({configured:false,orders:[],reason:'payment_database_not_configured'});
    const sql=paymentsDb();
    let orders;
    try {
      orders=await sql`SELECT id,status,fulfillment_status,
        customer_name,phone,note,handler_note,items,
        amount_cents,currency,created_at,paid_at,fulfillment_updated_at
        FROM payment_orders ORDER BY created_at DESC LIMIT 150`;
    } catch(error) {
      const code=String((error as {code?:string})?.code||'');
      if(code==='42P01'||code==='42703')
        throw new HttpError(503,'Изпълни payments.sql и payments-order-management.sql в базата за поръчки.');
      throw error;
    }
    return json({configured:true,orders});
  } catch(error) { return failure(error); }
}

export async function POST(request:Request) {
  try {
    sameOrigin(request);
    const admin=await authorize();
    if (!process.env.PAYMENT_DATABASE_URL)
      throw new HttpError(503,'Базата за поръчки още не е настроена.');
    if (Number(request.headers.get('content-length')||0)>2000)
      throw new HttpError(413,'Твърде голяма заявка.');
    const raw=await request.text();
    if (raw.length>2000) throw new HttpError(413,'Твърде голяма заявка.');
    let input:Record<string,unknown>;
    try{ input=JSON.parse(raw); }catch{ throw new HttpError(400,'Невалидна заявка.'); }
    if (!input || typeof input!=='object' || !uuid.test(String(input.orderId||'')))
      throw new HttpError(400,'Невалиден номер на поръчка.');
    const from=String(input.expectedStatus||'') as Fulfillment;
    const to=String(input.fulfillmentStatus||'') as Fulfillment;
    if (!statuses.includes(from) || !statuses.includes(to) || !transitions[from].includes(to))
      throw new HttpError(400,'Тази промяна на статуса не е разрешена.');
    const note=typeof input.note==='string'?input.note.trim():'';
    if (note.length>500) throw new HttpError(400,'Бележката може да е до 500 символа.');
    if (to==='cancel_requested' && note.length<5)
      throw new HttpError(400,'Посочи причина за отказа (поне 5 символа).');
    const id=String(input.orderId);
    const sql=paymentsDb();
    // An order can only enter restaurant fulfillment after bank confirmation.
    // Cancelling a paid order is a REFUND REQUEST, not a completed refund.
    const rows=await sql`WITH moved AS (
        UPDATE payment_orders
        SET fulfillment_status=${to},handler_note=${note},
          fulfillment_updated_at=NOW(),updated_at=NOW()
        WHERE id=${id}::uuid AND fulfillment_status=${from} AND status='paid'
        RETURNING id,fulfillment_status
      ), audit AS (
        INSERT INTO payment_order_events(order_id,previous_status,next_status,staff_email,note)
        SELECT id,${from},${to},${admin},${note} FROM moved
        RETURNING order_id
      ) SELECT moved.id,moved.fulfillment_status FROM moved
      INNER JOIN audit ON audit.order_id=moved.id`;
    if (!rows.length)
      throw new HttpError(409,'Поръчката е променена, не е платена или е в друг статус. Обнови списъка.');
    return json({ok:true,id:rows[0].id,fulfillmentStatus:rows[0].fulfillment_status});
  } catch(error) { return failure(error); }
}
