import './lily-cinematic.css';
import {lazy,Suspense} from 'react';
import {BrowserRouter,Routes,Route} from 'react-router-dom';
import SiteLayout from '@/components/site/SiteLayout';
import Home,{MenuPage} from '@/views/Home';

// Checkout, payment-confirmation and product-detail code is only needed when
// navigating to those routes; it should not delay the homepage on mobile.
const ProductDetail=lazy(()=>import('@/views/Preview').then(m=>({default:m.ProductDetail})));
const PhaseNotice=lazy(()=>import('@/views/Preview').then(m=>({default:m.PhaseNotice})));
const CartPage=lazy(()=>import('@/views/Cart').then(m=>({default:m.CartPage})));
const OrderSuccessPage=lazy(()=>import('@/views/OrderSuccess').then(m=>({default:m.OrderSuccessPage})));
const page=element=><Suspense fallback={<div role="status" style={{padding:'160px 24px 90px',minHeight:'55vh',textAlign:'center',color:'#c9bbb2'}}>Зареждане…</div>}>{element}</Suspense>;

export default function App(){
  return <BrowserRouter><Routes><Route element={<SiteLayout/>}>
    <Route path="/" element={<Home/>}/>
    <Route path="/menu" element={<MenuPage/>}/>
    <Route path="/product/:slug" element={page(<ProductDetail/>)}/>
    <Route path="/cart" element={page(<CartPage/>)}/>
    <Route path="/order/success" element={page(<OrderSuccessPage/>)}/>
    <Route path="*" element={page(<PhaseNotice/>)}/>
  </Route></Routes></BrowserRouter>;
}
