'use client';
import {useEffect,useRef,useState,useId} from 'react';
import {Search,X,ArrowUpRight,Send} from 'lucide-react';
import {changedAreas} from './edit-history';
export function Dialog({title,close,children}:any){
 const ref=useRef<HTMLDialogElement>(null);const titleId=useId();
 useEffect(()=>{const d=ref.current;d?.showModal();return()=>d?.close()},[]);
 return <dialog aria-labelledby={titleId} ref={ref} className="cms-editor-dialog" onCancel={e=>{e.preventDefault();close()}} onClick={e=>{if(e.target===e.currentTarget)close()}}><div className="cms-dialog-inner"><div className="cms-card-title"><h2 id={titleId}>{title}</h2><button className="cms-icon" onClick={close} aria-label="Затвори"><X size={20}/></button></div>{children}</div></dialog>;
}
export function CommandMenu({tabs,doc,navigate,close}:any){
 const [query,setQuery]=useState('');
 const items=[...tabs.map(([id,label]:any)=>({id,label,kind:'Раздел',tab:id})),...doc.menu.products.map((p:any)=>({id:p.id,label:p.name,kind:'Продукт',tab:'menu',product:p.id})),...Object.entries(doc.copy).map(([id,label])=>({id,label:String(label),kind:'Текст',tab:'visual',selected:id}))].filter(x=>x.label&&x.label.toLocaleLowerCase('bg').includes(query.toLocaleLowerCase('bg'))).slice(0,30);
 return <Dialog title="Какво искаш да редактираш?" close={close}><div className="cms-search"><Search size={18}/><input autoFocus aria-label="Търси раздел, продукт или текст" placeholder="Раздел, продукт или текст…" value={query} onChange={e=>setQuery(e.target.value)}/></div><div className="cms-command-results">{items.map(item=><button key={item.kind+item.id} onClick={()=>{navigate(item);close()}}><span><small>{item.kind}</small>{item.label}</span><ArrowUpRight size={17}/></button>)}{!items.length&&<p className="cms-subtle">Няма резултати. Опитай с друга дума.</p>}</div><p className="cms-subtle">Tab за избор · Enter за отваряне · Esc за затваряне</p></Dialog>;
}
export function PublishReview({doc,publishedDoc,busy,publish,close,error}:any){
 const changes=changedAreas(publishedDoc,doc);
 return <Dialog title="Преглед преди публикуване" close={close}>{error&&<p className="cms-alert error" role="alert">{error}</p>}<p className="cms-review-intro">Тези промени ще станат видими за посетителите на сайта.</p><div className="cms-change-list">{changes.map(c=><div key={c.id}><span/>{c.label}</div>)}{!changes.length&&<p>Няма разлика спрямо публикуваното съдържание.</p>}</div><p className="cms-subtle">Предишната публикация остава в „История“. Можеш да я възстановиш като чернова.</p><div className="cms-dialog-actions"><button className="cms-btn" disabled={busy} onClick={close}>Продължи редактирането</button><button className="cms-btn primary" disabled={busy||!changes.length} onClick={publish}><Send size={16}/>{busy?'Публикуване…':'Публикувай промените'}</button></div></Dialog>;
}

export function ConfirmAction({message,action,close,confirm}:any){return <Dialog title="Потвърди действието" close={close}><p className="cms-review-intro">{message}</p><div className="cms-dialog-actions"><button autoFocus className="cms-btn" onClick={close}>Отказ</button><button className="cms-btn primary" onClick={()=>{close();confirm()}}>{action}</button></div></Dialog>}
