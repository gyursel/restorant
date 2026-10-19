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
useEffect(()=>{if(!new URLSearchParams(location.search).has('editor'))return;const onMessage=(e:MessageEvent)=>{if(e.origin===location.origin&&e.source===window.parent&&e.data?.type==='apex-content'){applyContent(e.data.content);setVersion(v=>v+1)}};const onClick=(e:MouseEvent)=>{const target=e.target instanceof Element?e.target:null;if(!target)return;
 const button=target.closest('[data-button-slot]') as HTMLElement|null;
 const field=target.closest('[data-cms-key]') as HTMLElement|null;
 const image=target.closest('img') as HTMLImageElement|null;
 const card=target.closest('[data-testid^="product-card-"]') as HTMLElement|null;
 const linked=target.closest('a,button') as HTMLElement|null;
 const nested=linked?.querySelector('[data-cms-key]') as HTMLElement|null;
 const section=target.closest('section[data-testid]') as HTMLElement|null;
 // The preview is an editor, not a second live storefront. Block navigation
 // and interactive actions, even when the click is on an icon or empty space.
 e.preventDefault();e.stopPropagation();
 const key=field?.dataset.cmsKey||nested?.dataset.cmsKey;
 const product=card?.dataset.testid?.replace('product-card-','');
 const sectionType=section?.dataset.testid?.replace('-section','').replace('hero','hero').replace('promotions','promotions').replace('menu','menu').replace('kiosk-teaser','assistant').replace('how-it-works','steps').replace('location','location');
 window.parent.postMessage({type:'apex-select',button:button?.dataset.buttonSlot,key,image:image?.getAttribute('src'),product,section:sectionType||undefined},location.origin);
};window.addEventListener('message',onMessage);document.addEventListener('click',onClick,true);return()=>{window.removeEventListener('message',onMessage);document.removeEventListener('click',onClick,true)}},[]);
useEffect(()=>{if(App&&new URLSearchParams(location.search).has('editor'))window.parent.postMessage({type:'apex-ready'},location.origin)},[App]);
if(error)return <div style={{padding:'140px 24px'}}>Сайтът не можа да се зареди. <button onClick={()=>location.reload()}>Опитайте отново</button></div>;return App?<App key={version}/>:<div style={{padding:'140px 24px',color:'#aaa'}}>Зареждане на LILY DRIVE…</div>}
