import {authorize,db,json,failure} from '../../../../server/cms';
export const dynamic='force-dynamic';
export const runtime='nodejs';
export async function GET() {
  try {
    await authorize();
    const sql=db();
    const orders=await sql`SELECT id,status,customer_name,phone,note,items,
      amount_cents,currency,created_at,paid_at
      FROM payment_orders ORDER BY created_at DESC LIMIT 100`;
    return json(orders);
  } catch(error) { return failure(error); }
}
