import {json,failure,HttpError} from '../../../../server/cms';
import {orderStatus} from '../../../../server/payments';

export const dynamic='force-dynamic';
export const runtime='nodejs';

export async function GET(_request:Request,{params}:{params:Promise<{id:string}>}) {
  try {
    const {id}=await params;
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id))
      throw new HttpError(400,'Невалиден номер на поръчката.');
    return json(await orderStatus(id));
  } catch(error) { return failure(error); }
}
