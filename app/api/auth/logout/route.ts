import {cookies} from 'next/headers';
import {COOKIE_NAME} from '../../../../server/auth';
import {sameOrigin,json,failure} from '../../../../server/cms';
export const runtime='nodejs';
export async function POST(request:Request){try{sameOrigin(request);(await cookies()).delete(COOKIE_NAME);return json({ok:true});}catch(e){return failure(e)}}
