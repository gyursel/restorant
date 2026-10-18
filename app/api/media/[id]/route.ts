import {db,failure,HttpError} from '../../../../server/cms';
export const runtime='nodejs';
export async function GET(_request:Request,{params}:{params:Promise<{id:string}>}){
 try{
  const {id}=await params;
  if(!/^[0-9a-f-]{36}$/.test(id))throw new HttpError(404,'Няма такъв файл.');
  // Preview displays public CMS media from Production, including newly uploaded images.
  if(process.env.VERCEL_ENV==='preview'&&process.env.CMS_ISOLATED_PREVIEW!=='true'){
   return new Response(null,{status:307,headers:{Location:`https://apex-drive-bulgaria.vercel.app/api/media/${id}`,'Cache-Control':'no-store'}});
  }
  const sql=db();const rows=await sql`SELECT url FROM cms_media WHERE id=${id}`;
  if(!rows.length)throw new HttpError(404,'Няма такъв файл.');
  return new Response(null,{status:307,headers:{Location:rows[0].url as string,'Cache-Control':'public,max-age=300','X-Content-Type-Options':'nosniff'}});
 }catch(e){return failure(e)}
}
