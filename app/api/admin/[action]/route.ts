import {del,put} from '@vercel/blob';
import {authorize,sameOrigin,state,save,publish,db,json,failure,HttpError} from '../../../../server/cms';
export const dynamic='force-dynamic';
export const runtime='nodejs';
export async function GET(_request:Request,{params}:{params:Promise<{action:string}>}){
 try{await authorize();const {action}=await params;
  if(action==='draft'){const s=await state();return json({content:JSON.parse(s.draft),version:s.version,publishedVersion:s.published_version,publishedContent:JSON.parse(s.published),updatedAt:s.updated_at});}
  const sql=db();
  if(action==='history')return json(await sql`SELECT version,created_at FROM cms_revisions ORDER BY version DESC LIMIT 50`);
  if(action==='media')return json(await sql`SELECT id,name,mime,size,created_at FROM cms_media ORDER BY created_at DESC LIMIT 200`);
  throw new HttpError(404,'Няма такава страница.');
 }catch(e){return failure(e)}
}
export async function POST(request:Request,{params}:{params:Promise<{action:string}>}){
 try{sameOrigin(request);const user=await authorize();const {action}=await params;
  if(process.env.VERCEL_ENV==='preview'&&process.env.CMS_ISOLATED_PREVIEW!=='true')throw new HttpError(403,'Записът в preview е изключен. Нужни са отделна preview база и CMS_ISOLATED_PREVIEW=true.');
  if(action==='media'){
   // Vercel Functions enforce a 4.5 MB request limit; use 4 MB maximum here.
   if(Number(request.headers.get('content-length')||0)>4.4*1024*1024)throw new HttpError(413,'Файлът трябва да е до 4 MB.');
   const form=await request.formData();const file=form.get('file');
   if(!(file instanceof File)||file.size>4*1024*1024||file.size<12)throw new HttpError(400,'Избери файл до 4 MB.');
   const bytes=Buffer.from(await file.arrayBuffer());
   const isWebm=bytes[0]===0x1a&&bytes[1]===0x45&&bytes[2]===0xdf&&bytes[3]===0xa3;
   const isMp4=bytes.toString('ascii',4,8)==='ftyp';
   const magic=bytes[0]===0x89&&bytes[1]===0x50&&bytes[2]===0x4e&&bytes[3]===0x47?'image/png':bytes[0]===0xff&&bytes[1]===0xd8&&bytes[2]===0xff?'image/jpeg':bytes.toString('ascii',0,4)==='RIFF'&&bytes.toString('ascii',8,12)==='WEBP'?'image/webp':isWebm?'video/webm':isMp4?'video/mp4':null;
   if(!magic||magic!==file.type)throw new HttpError(400,'Поддържаме JPG, PNG, WebP снимки и MP4, WebM видео.');
   if(magic==='image/png'&&(bytes.length<45||!bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]))||bytes.toString('ascii',12,16)!=='IHDR'||bytes.readUInt32BE(16)<1||bytes.readUInt32BE(20)<1||bytes.readUInt32BE(16)>8192||bytes.readUInt32BE(20)>8192))throw new HttpError(400,'Невалиден PNG или размер над 8192 px.');
   const id=crypto.randomUUID(),ext=({'image/png':'png','image/jpeg':'jpg','image/webp':'webp','video/mp4':'mp4','video/webm':'webm'} as Record<string,string>)[magic];
   const blob=await put(`apex/${id}.${ext}`,bytes,{access:'public',contentType:magic,addRandomSuffix:false});
   try{const sql=db();await sql`INSERT INTO cms_media(id,name,mime,size,url,created_at) VALUES(${id},${file.name.slice(0,200)},${magic},${file.size},${blob.url},${new Date().toISOString()})`;}
   catch(e){await del(blob.url).catch(()=>{});throw e;}
   return json({id,url:'/api/media/'+id,name:file.name});
  }
  if(Number(request.headers.get('content-length')||0)>1500000)throw new HttpError(413,'Съдържанието е твърде голямо.');
  const raw=await request.text();if(raw.length>1500000)throw new HttpError(413,'Съдържанието е твърде голямо.');
  let body:any;try{body=JSON.parse(raw)}catch{throw new HttpError(400,'Невалидна заявка.');}
  if(!Number.isInteger(body.version)||body.version<0)throw new HttpError(400,'Невалидна версия.');
  if(action==='draft')return json(await save(body.content,body.version,user));
  if(action==='publish')return json(await publish(body.version,user));
  if(action==='restore'){
   if(!Number.isInteger(body.restoreVersion)||body.restoreVersion<0)throw new HttpError(400,'Невалидна версия за възстановяване.');
   const sql=db();const revision=await sql`SELECT content FROM cms_revisions WHERE version=${body.restoreVersion}`;
   if(!revision.length)throw new HttpError(404,'Версията не е намерена.');
   return json(await save(JSON.parse(revision[0].content as string),body.version,user));
  }
  throw new HttpError(404,'Няма такава операция.');
 }catch(e){return failure(e)}
}
