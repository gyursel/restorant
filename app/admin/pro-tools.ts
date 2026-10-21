// Pure draft tools. No persistence, credentials or order data.
export type Product = {id:string;name:string;slug:string;category:string;price:number;description?:string;image?:string;available:boolean;popular:boolean;[key:string]:any};
export function filterProducts(products:Product[], query:string, category:string, status:string, sort:string) {
 const q=query.trim().toLocaleLowerCase('bg');
 return products.filter(p=>(!q||[p.name,p.slug,p.description].join(' ').toLocaleLowerCase('bg').includes(q))&&(!category||p.category===category)&&(!status||(status==='available'?p.available:status==='unavailable'?!p.available:p.popular)))
 .sort((a,b)=>sort==='price-up'?a.price-b.price:sort==='price-down'?b.price-a.price:sort==='name'?a.name.localeCompare(b.name,'bg'):0);
}
export function bulkProducts(products:Product[], ids:string[], action:string, category:string, categories:string[]) {
 const selected=new Set(ids);
 if(action==='category'&&!categories.includes(category))return products;
 return products.map(p=>!selected.has(p.id)?p:action==='available'?{...p,available:true}:action==='unavailable'?{...p,available:false}:action==='popular'?{...p,popular:true}:action==='regular'?{...p,popular:false}:action==='category'?{...p,category}:p);
}
export function menuCSV(products:Product[],categories:any[]) {
 const cell=(value:unknown)=>{let s=String(value??'');if(/^[\s]*[=+@\-]/.test(s)||/^[\t\r\n]/.test(s))s="'"+s;return '"'+s.replaceAll('"','""')+'"'};
 return '\uFEFF'+[['Име','Категория','Цена EUR','Наличен','Любим','Описание','Адрес','Снимка'],...products.map(p=>[p.name,categories.find(c=>c.slug===p.category)?.name||p.category,p.price,p.available?'Да':'Не',p.popular?'Да':'Не',p.description,p.slug,p.image])].map(row=>row.map(cell).join(';')).join('\r\n');
}
export type CheckItem={label:string;detail:string;tab:string;product?:string};
export function contentChecks(doc:any):CheckItem[] {
 const result:CheckItem[]=[];
 for(const p of doc.menu.products){
  const gaps=[!p.description?.trim()&&'описание',!p.image?.trim()&&'снимка',!(Number(p.price)>0)&&'цена над нула'].filter(Boolean);
  if(gaps.length)result.push({label:p.name||'Продукт без име',detail:'Провери: '+gaps.join(', ')+'.',tab:'menu',product:p.id});
 }
 for(const c of doc.menu.categories)if(!doc.menu.products.some((p:Product)=>p.category===c.slug))result.push({label:c.name,detail:'Категорията няма продукти.',tab:'menu'});
 if(!doc.meta.title?.trim()||!doc.meta.description?.trim())result.push({label:'Описание в търсачките',detail:'Попълни заглавие и описание.',tab:'settings'});
 if(doc.settings.hours_are_sample)result.push({label:'Работно време',detail:'Все още е отбелязано като примерно. Провери часовете.',tab:'settings'});
 for(const [key,label] of [['phone','Телефон'],['address','Адрес'],['email','Имейл']])if(!doc.settings[key]?.trim())result.push({label,detail:'Липсва информация за контакт.',tab:'settings'});
 for(const p of doc.promotions)if(p.active&&(!p.image||!p.description))result.push({label:p.title,detail:'Активната промоция няма снимка или описание.',tab:'promotions'});
 if(!doc.pages.home.sections.some((s:any)=>s.type==='menu'&&s.visible))result.push({label:'Секция с менюто',detail:'Менюто е скрито от началната страница.',tab:'visual'});
 return result;
}
export type Change={path:string;before:unknown;after:unknown};
export function contentDiff(before:any,after:any,path=''):Change[] {
 if(JSON.stringify(before)===JSON.stringify(after))return [];
 if(before&&after&&typeof before==='object'&&typeof after==='object'&&!Array.isArray(before)&&!Array.isArray(after))return [...new Set([...Object.keys(before),...Object.keys(after)])].flatMap(k=>contentDiff(before[k],after[k],path?path+'.'+k:k));
 // Compare entity arrays by stable identity so reorder doesn't look like unrelated edits.
 if(Array.isArray(before)&&Array.isArray(after)&&[...before,...after].every(v=>v&&typeof v==='object'&&typeof v.id==='string')){
  const ids=[...new Set([...before,...after].map(v=>v.id))];
  const rows=ids.flatMap(id=>{const a=before.find(v=>v.id===id),b=after.find(v=>v.id===id);return contentDiff(a,b,path+' › '+(b?.name||b?.title||a?.name||a?.title||id));});
  if(before.map(v=>v.id).join('|')!==after.map(v=>v.id).join('|')&&before.length===after.length&&before.every(v=>after.some(w=>w.id===v.id)))rows.unshift({path:path+' › подредба',before:before.map(v=>v.name||v.title||v.id),after:after.map(v=>v.name||v.title||v.id)});
  return rows;
 }
 return [{path,before,after}];
}
