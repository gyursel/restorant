import {db,HttpError} from './cms';
/** Validate every PNG reference on the server, not just the browser's accept attribute. */
export async function validateButtonAssets(buttons:Record<string,any>){
 const ids=[...new Set(Object.values(buttons).flatMap(b=>['image','hoverImage','activeImage','disabledImage'].map(k=>b[k]).filter((url:string)=>url?.startsWith('/api/media/')).map((url:string)=>url.slice('/api/media/'.length))))];
 if(!ids.length)return;
 const sql=db();const rows=await sql`SELECT id,mime FROM cms_media WHERE id=ANY(${ids}::text[])`;
 if(ids.some(id=>!rows.some(r=>r.id===id&&r.mime==='image/png')))throw new HttpError(400,'Изображенията за бутоните трябва да са качени PNG файлове.');
}
