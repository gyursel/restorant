import {state,json,failure} from '../../../server/cms';
export const dynamic='force-dynamic';
export async function GET(){try{return json(JSON.parse((await state()).published))}catch(e){return failure(e)}}
