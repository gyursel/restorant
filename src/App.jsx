import {BrowserRouter,Routes,Route} from 'react-router-dom';
import SiteLayout from '@/components/site/SiteLayout';
import Home,{MenuPage} from '@/views/Home';
import {ProductDetail,PhaseNotice} from '@/views/Preview';
import {CartPage} from '@/views/Cart';
import {OrderSuccessPage} from '@/views/OrderSuccess';
export default function App(){return <BrowserRouter><Routes><Route element={<SiteLayout/>}><Route path="/" element={<Home/>}/><Route path="/menu" element={<MenuPage/>}/><Route path="/product/:slug" element={<ProductDetail/>}/><Route path="/cart" element={<CartPage/>}/><Route path="/order/success" element={<OrderSuccessPage/>}/><Route path="*" element={<PhaseNotice/>}/></Route></Routes></BrowserRouter>}
