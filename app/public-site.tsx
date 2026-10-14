'use client';
import {useEffect,useState} from 'react';
import {initializeContent,applyContent} from '../src/content/repository';
export default function PublicSite({initialContent}:{initialContent?:any}){const [App,setApp]=useState<any>(null);const [error,setError]=useState(false);const [version,setVersion]=useState(0);
useEffect(()=>{
  let active=true;
  // Editors always load their authenticated draft; normal pages use the CMS
  // snapshot already delivered in the initial HTML to skip a second request.
  const draft=new URLSearchParams(location.search).get('draft')==='1';
  const prepare=async()=>{
    if(initialContent && !draft) applyContent(initialContent);
    else await initializeContent();
    return import('../src/App');
  };
  prepare().then(m=>{if(active)setApp(()=>m.default)}).catch(()=>{if(active)setError(true)});
  return()=>{active=false};
},[initialContent]);
useEffect(()=>{if(!new URLSearchParams(location.search).has('editor'))return;const onMessage=(e:MessageEvent)=>{if(e.origin===location.origin&&e.source===window.parent&&e.data?.type==='apex-content'){applyContent(e.data.content);setVersion(v=>v+1)}};const onClick=(e:MouseEvent)=>{const target=e.target as HTMLElement;const field=target.closest('[data-cms-key]') as HTMLElement;const image=target.closest('img') as HTMLImageElement;const card=target.closest('[data-testid*="product-card-"]') as HTMLElement;if(field||image||card){e.preventDefault();e.stopPropagation();window.parent.postMessage({type:'apex-select',key:field?.dataset.cmsKey,image:image?.getAttribute('src'),product:card?.dataset.testid?.split('product-card-')[1]},location.origin)}};window.addEventListener('message',onMessage);document.addEventListener('click',onClick,true);return()=>{window.removeEventListener('message',onMessage);document.removeEventListener('click',onClick,true)}},[]);
useEffect(()=>{if(App&&new URLSearchParams(location.search).has('editor'))window.parent.postMessage({type:'apex-ready'},location.origin)},[App]);
if(error)return <div style={{padding:'140px 24px'}}>Сайтът не можа да се зареди. <button onClick={()=>location.reload()}>Опитайте отново</button></div>;return App?<App key={version}/>:<div style={{padding:'140px 24px',color:'#aaa'}}>Зареждане на APEX DRIVE…</div>}
