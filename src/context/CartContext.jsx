import {createContext,useCallback,useContext,useEffect,useMemo,useState} from 'react';
import {getContent} from '@/content/repository';

const CartContext=createContext(null);
const STORAGE_KEY='apex-drive-cart-v1';

const clampItems=value=>{
  if (!Array.isArray(value)) return [];
  const seen=new Set();
  return value.filter(item=>{
    if (!item||typeof item.slug!=='string'||!Number.isInteger(item.quantity)||
        item.quantity<1||item.quantity>10||seen.has(item.slug)||seen.size>=20) return false;
    seen.add(item.slug);
    return true;
  }).map(({slug,quantity})=>({slug,quantity}));
};

export function CartProvider({children}) {
  const [cart,setCart]=useState(()=>{
    if (typeof window==='undefined')return [];
    try{return clampItems(JSON.parse(window.localStorage.getItem(STORAGE_KEY)||'[]'));}
    catch{return [];}
  });

  useEffect(()=>{
    try{window.localStorage.setItem(STORAGE_KEY,JSON.stringify(cart));}catch{}
  },[cart]);

  const add=useCallback((slug,quantity=1)=>{
    setCart(before=>{
      const existing=before.find(x=>x.slug===slug);
      if (existing) return before.map(x=>x.slug===slug?{slug,quantity:Math.min(10,x.quantity+quantity)}:x);
      return before.length>=20?before:[...before,{slug,quantity:Math.max(1,Math.min(10,quantity))}];
    });
  },[]);
  const setQuantity=useCallback((slug,quantity)=>{
    setCart(before=>quantity<=0?before.filter(x=>x.slug!==slug):
      before.map(x=>x.slug===slug?{slug,quantity:Math.min(10,Math.max(1,quantity))}:x));
  },[]);
  const remove=useCallback(slug=>setCart(before=>before.filter(x=>x.slug!==slug)),[]);
  const clear=useCallback(()=>setCart([]),[]);
  const products=getContent()?.menu?.products||[];
  const items=cart.map(item=>({product:products.find(x=>x.slug===item.slug),...item}))
    .filter(item=>item.product&&item.product.available);
  const itemCount=cart.reduce((acc,item)=>acc+item.quantity,0);
  const total=items.reduce((acc,item)=>acc+item.product.price*item.quantity,0);
  const value=useMemo(()=>({cart,items,itemCount,total,add,setQuantity,remove,clear}),
    [cart,items,itemCount,total,add,setQuantity,remove,clear]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const value=useContext(CartContext);
  if (!value) throw new Error('useCart requires CartProvider');
  return value;
}
