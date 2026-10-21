'use client';
import {useEffect,useRef,useState} from 'react';
import './inline-editor.css';

// Prefer semantic anchors; descendant paths let the owner select nested elements too.
function selectorFor(el:Element):string {
 for(const attr of ['data-cms-key','data-button-slot','data-cms-media','data-testid','id']){
  const value=el.getAttribute(attr);
  if(value){const selector=`[${attr}="${CSS.escape(value)}"]`;if(document.querySelectorAll(selector).length===1)return selector;}
 }
 if(!el.parentElement||el===document.body)return 'body';
 return `${selectorFor(el.parentElement)} > ${el.tagName.toLowerCase()}:nth-child(${Array.from(el.parentElement.children).indexOf(el)+1})`;
}
export default function InlineVisualEditor({content,revision}:{content:any;revision:number}){
 const [selection,setSelection]=useState('');const [copyKey,setCopyKey]=useState<string|null>(null);const [rect,setRect]=useState<DOMRect|null>(null);
 const [base,setBase]=useState<Record<string,any>>({});const panel=useRef<HTMLDivElement>(null);
 const [position,setPosition]=useState({left:12,top:12});
 const select=(el:HTMLElement)=>{
  const text=el.closest('[data-cms-key]');const fields=el.querySelectorAll('[data-cms-key]');setCopyKey(text?.getAttribute('data-cms-key')||(fields.length===1?fields[0].getAttribute('data-cms-key'):null));
  if(getComputedStyle(el).display==='contents'&&el.parentElement)el=el.parentElement;
  setSelection(selectorFor(el));const s=getComputedStyle(el);
  setBase({opacity:Number(s.opacity),borderRadius:parseFloat(s.borderRadius)||0,borderWidth:parseFloat(s.borderWidth)||0,padding:parseFloat(s.padding)||0,fontSize:parseFloat(s.fontSize)||16});
 };
 useEffect(()=>{
  const click=(e:MouseEvent)=>{const el=e.target instanceof Element?e.target:null;if(!el||el===document.body||el===document.documentElement||el.closest('[data-inline-editor]'))return;e.preventDefault();e.stopPropagation();select((el.closest('svg')?.parentElement||el) as HTMLElement)};
  const key=(e:KeyboardEvent)=>{if(e.key==='Escape'){setSelection('');return}if((e.ctrlKey||e.metaKey)&&['z','s'].includes(e.key.toLowerCase())&&!(e.target as Element)?.closest('input,textarea')){e.preventDefault();window.parent.postMessage({type:'apex-editor-command',command:e.key.toLowerCase()==='s'?'save':e.shiftKey?'redo':'undo'},location.origin)}};
  document.addEventListener('click',click,true);window.addEventListener('keydown',key);
  return()=>{document.removeEventListener('click',click,true);window.removeEventListener('keydown',key)};
 },[]);
 useEffect(()=>{
  if(!selection)return;
  const place=()=>{const el=document.querySelector(selection);if(!el){setRect(null);return}const r=el.getBoundingClientRect();setRect(r);const height=panel.current?.offsetHeight||420;const width=Math.min(290,innerWidth-24);setPosition({left:Math.max(12,Math.min(r.right+10+width<innerWidth?r.right+10:r.left,innerWidth-width-12)),top:Math.max(12,Math.min(r.bottom+10,innerHeight-height-12))})};
  const selected=document.querySelector(selection);if(selected){const s=getComputedStyle(selected);setBase({opacity:Number(s.opacity),borderRadius:parseFloat(s.borderRadius)||0,borderWidth:parseFloat(s.borderWidth)||0,padding:parseFloat(s.padding)||0,fontSize:parseFloat(s.fontSize)||16})}place();const observer=new ResizeObserver(place);observer.observe(document.body);if(panel.current)observer.observe(panel.current);
  window.addEventListener('scroll',place,true);window.addEventListener('resize',place);
  return()=>{observer.disconnect();window.removeEventListener('scroll',place,true);window.removeEventListener('resize',place)};
 },[selection,revision]);
 if(!selection)return <div data-inline-editor className="inline-editor-hint">Щракни върху елемент, за да го редактираш на място.</div>;
 const style={...base,...content?.elementStyles?.[selection]};
 const el=typeof document!=='undefined'?document.querySelector(selection):null;
 const card=el?.closest('[data-testid^="product-card-"]');
 const send=(property:string,value:any)=>window.parent.postMessage({type:'apex-inline-style',selector:selection,property,value},location.origin);
 return <>
 {rect&&<div data-inline-editor className="inline-editor-outline" style={{left:rect.left,top:rect.top,width:rect.width,height:rect.height}}/>}
 <div ref={panel} data-inline-editor className="inline-editor-panel" role="dialog" aria-label="Редактиране на избрания елемент" style={position}>
 <header><strong>Редактиране на място</strong><button aria-label="Затвори настройките" onClick={()=>setSelection('')}>×</button></header>
 <div className="inline-editor-body">
 <div className="inline-editor-target"><span>{el?.tagName.toLowerCase()||'Елемент'}</span><button onClick={()=>{if(el?.parentElement&&el.parentElement!==document.body)select(el.parentElement)}}>↑ Родител</button>{card&&card!==el&&<button onClick={()=>select(card as HTMLElement)}>Цялата карта</button>}</div>
 {copyKey&&<label>Текст<textarea value={content.copy?.[copyKey]||''} onChange={e=>window.parent.postMessage({type:'apex-inline-copy',key:copyKey,value:e.target.value},location.origin)}/></label>}
 {([['opacity','Плътност',0,1,.01],['borderRadius','Заобляне',0,200,1],['borderWidth','Дебелина на рамката',0,20,1],['padding','Вътрешно отстояние',0,120,1],['fontSize','Размер на текста',8,160,1]] as const).map(([key,label,min,max,step])=><label key={key}>{label}<span className="inline-editor-value">{key==='opacity'?Math.round(style[key]*100)+'%':style[key]+' px'}</span><input aria-label={label} type="range" min={min} max={max} step={step} value={style[key]} onChange={e=>send(key,Number(e.target.value))}/></label>)}
 <label>Вид на рамката<select value={style.borderStyle||'solid'} onChange={e=>send('borderStyle',e.target.value)}><option value="solid">Плътна</option><option value="dashed">Прекъсната</option><option value="dotted">Точки</option><option value="none">Без рамка</option></select></label>
 <div className="inline-editor-colors">{[['borderColor','Рамка'],['backgroundColor','Фон'],['color','Текст']].map(([key,label])=><label key={key}>{label}<input type="color" value={style[key]||'#ffffff'} onChange={e=>send(key,e.target.value)}/></label>)}</div>
 <button className="inline-editor-reset" onClick={()=>send('reset',null)}>Възстанови стила на елемента</button>
 <small>Промените са в черновата. Запази и публикувай от горната лента.</small>
 </div></div></>;
}
