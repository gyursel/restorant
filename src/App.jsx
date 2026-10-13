import {BrowserRouter,Routes,Route} from 'react-router-dom';
import SiteLayout from '@/components/site/SiteLayout';
import Home,{MenuPage} from '@/views/Home';
import {ProductDetail,PhaseNotice} from '@/views/Preview';
export default function App(){return <BrowserRouter><Routes><Route element={<SiteLayout/>}><Route path="/" element={<Home/>}/><Route path="/menu" element={<MenuPage/>}/><Route path="/product/:slug" element={<ProductDetail/>}/><Route path="*" element={<PhaseNotice/>}/></Route></Routes></BrowserRouter>}
