// Session-only history: documents never leave the authenticated editor.
export type EditHistory<T> = {past:T[]; present:T; future:T[]; key:string; at:number};
export function startHistory<T>(value:T):EditHistory<T>{return {past:[],present:value,future:[],key:'',at:0}}
export function recordEdit<T>(state:EditHistory<T>,next:T,key:string,at=Date.now()):EditHistory<T>{
 if(JSON.stringify(state.present)===JSON.stringify(next))return state;
 const grouped=state.key===key&&at-state.at<800&&state.future.length===0;
 return {past:grouped?state.past:[...state.past,state.present].slice(-60),present:next,future:[],key,at};
}
export function moveHistory<T>(state:EditHistory<T>,direction:'undo'|'redo'):EditHistory<T>{
 if(direction==='undo'){if(!state.past.length)return state;return {past:state.past.slice(0,-1),present:state.past[state.past.length-1],future:[state.present,...state.future],key:'',at:0}}
 if(!state.future.length)return state;
 return {past:[...state.past,state.present],present:state.future[0],future:state.future.slice(1),key:'',at:0};
}
export function changedAreas(before:any,after:any){
 const areas:[string,string,unknown,unknown][]=[['elementStyles','Стилове на елементите',before?.elementStyles,after?.elementStyles],['copy','Текстове',before?.copy,after?.copy],['menu','Меню и цени',before?.menu,after?.menu],['pages','Секции',before?.pages,after?.pages],['buttons','PNG бутони',before?.buttons,after?.buttons],['appearance','Външен вид',before?.appearance,after?.appearance],['settings','Настройки и снимки',before?.settings,after?.settings],['promotions','Промоции',before?.promotions,after?.promotions],['navigation','Навигация',before?.navigation,after?.navigation],['meta','SEO',before?.meta,after?.meta],['mediaMetadata','Медийна библиотека',before?.mediaMetadata,after?.mediaMetadata],['theme','Цветове',before?.theme,after?.theme]];
 return areas.filter(([, ,a,b])=>JSON.stringify(a)!==JSON.stringify(b)).map(([id,label])=>({id,label}));
}
