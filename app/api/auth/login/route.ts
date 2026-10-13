import {cookies} from 'next/headers';
import {createSession,cookieOptions,COOKIE_NAME,verifyPassword} from '../../../../server/auth';
import {db, failure,HttpError,json,sameOrigin} from '../../../../server/cms';
export const runtime='nodejs';
export async function POST(request:Request){try{
 sameOrigin(request);
 if(Number(request.headers.get('content-length')||'0')>5000)throw new HttpError(413,'Заявката е твърде голяма.');
 const body=await request.json();
 const email=typeof body.email==='string'?body.email:'';
 const password=typeof body.password==='string'?body.password:'';
 if(email.length>250||password.length>1024)throw new HttpError(400,'Невалидни данни.');
 const sql=db();const time=Date.now();
 // Persistent global lock protects the single-owner login against password guessing.
 await sql`INSERT INTO cms_login_guard(id,failures,locked_until) VALUES('owner',0,0) ON CONFLICT DO NOTHING`;
 const guard=await sql`SELECT failures,locked_until FROM cms_login_guard WHERE id='owner'`;
 if(Number(guard[0]?.locked_until||0)>time)throw new HttpError(429,'Твърде много опити. Опитай отново след няколко минути.');
 if(!await verifyPassword(email,password)){
  await sql`UPDATE cms_login_guard SET failures=failures+1,locked_until=CASE WHEN failures+1>=5 THEN ${time+15*60*1000} ELSE 0 END WHERE id='owner'`;
  throw new HttpError(401,'Грешен имейл или парола.');
 }
 await sql`UPDATE cms_login_guard SET failures=0,locked_until=0 WHERE id='owner'`;
 (await cookies()).set(COOKIE_NAME,createSession(email.trim().toLowerCase()),cookieOptions());
 return json({ok:true});
}catch(e){return failure(e)}}
