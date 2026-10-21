'use client';
import {useEffect,useState} from 'react';
import InlineVisualEditor from './InlineVisualEditor';
import {elementCSS} from '../src/cms/element-design';
import {getContent,initializeContent,applyContent} from '../src/content/repository';
export default function PublicSite({initialContent}:{initialContent?:any}){const [App,setApp]=useState<any>(null);const [error,setError]=useState(false);const [version,setVersion]=useState(0);const [editor,setEditor]=useState(false);const [appVersion,setAppVersion]=useState(0);
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
useEffect(()=>{if(!new URLSearchParams(location.search).has('editor')||window.parent===window)return;setEditor(true);document.documentElement.dataset.cmsEditor='true';const onMessage=(e:MessageEvent)=>{if(e.origin===location.origin&&e.source===window.parent&&e.data?.type==='apex-content'){const {elementStyles:oldStyles,...oldContent}=getContent()||{};const {elementStyles:newStyles,...newContent}=e.data.content;applyContent(e.data.content);if(JSON.stringify(oldContent)!==JSON.stringify(newContent))setAppVersion(v=>v+1);setVersion(v=>v+1)}};window.addEventListener('message',onMessage);return()=>{delete document.documentElement.dataset.cmsEditor;window.removeEventListener('message',onMessage)}},[]);
useEffect(()=>{if(App&&new URLSearchParams(location.search).has('editor'))window.parent.postMessage({type:'apex-ready'},location.origin)},[App]);
if(error)return <div style={{padding:'140px 24px'}}>Сайтът не можа да се зареди. <button onClick={()=>location.reload()}>Опитайте отново</button></div>;return App?<><App key={appVersion}/><style>{elementCSS(getContent()?.elementStyles)}</style>{editor&&<InlineVisualEditor content={getContent()} revision={version}/>}</>:<div style={{padding:'140px 24px',color:'#aaa'}}>Зареждане на LILY DRIVE…</div>}
