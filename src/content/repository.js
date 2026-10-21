import {lilyContent} from '../cms/lily-content';
let content;
export const copy={};
export function applyContent(next){next=lilyContent(next);content=next;Object.assign(copy,next.copy);for(const [key,value] of Object.entries(next.theme))document.documentElement.style.setProperty(key,value);document.title=next.meta.title;const meta=document.querySelector('meta[name="description"]');if(meta)meta.content=next.meta.description;}
export async function initializeContent(){const draft=new URLSearchParams(window.location.search).get('draft')==='1';const response=await fetch(draft?'/api/admin/draft':'/api/content',{cache:'no-store'});if(!response.ok)throw new Error('Content unavailable');const data=await response.json();applyContent(draft?data.content:data);}
export const getContent=()=>content;
