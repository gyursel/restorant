import {CmsImage} from '@/components/site/CmsImage';
import {ConfigurableButton} from "@/components/site/ConfigurableButton";
import {CmsText} from "@/components/site/PublicText";
import { copy } from "@/components/site/public-copy";
import { Link, useParams } from 'react-router-dom';
import { useMenu } from '@/hooks/useMenu';
import { eur } from '@/lib/api';
import {useCart} from '@/context/CartContext';
import {ShoppingBag} from 'lucide-react';
import {mediaSrc} from '@/lib/media';
export function PhaseNotice() {
  return <section className="max-w-3xl mx-auto px-6 pb-20" style={{
    paddingTop: 160,
    minHeight: '70vh'
  }}><p className="eyebrow"><CmsText field="Preview_jsx_1"/></p><h1 className="font-editorial text-4xl mt-6"><CmsText field="Preview_jsx_2"/></h1><p className="text-slate-400 mt-6"><CmsText field="Preview_jsx_3"/></p><Link to={copy["Preview_jsx_4"]} className="btn-primary mt-8"><CmsText field="Preview_jsx_5"/></Link></section>;
}
export function ProductDetail() {
  const {add}=useCart();
  const {
    slug
  } = useParams();
  const {
    products
  } = useMenu();
  const p = products.find(x => x.slug === slug);
  if (!p) return <PhaseNotice />;
  return <section data-testid="product-detail-page" className="lily-product-detail max-w-7xl mx-auto px-6 pb-20" style={{
    paddingTop: 150
  }}><Link to={copy["Preview_jsx_6"]} className="text-slate-400"><CmsText field="Preview_jsx_7"/></Link><div className="grid lg:grid-cols-2 gap-12 items-center mt-10"><CmsImage src={mediaSrc(p.image)} alt={p.name} width="640" height="640" decoding="async" className="product-photo rounded-full" /><div><p className="eyebrow"><CmsText field="Preview_jsx_8"/></p><h1 className="font-editorial text-4xl mt-6">{p.name}</h1><p className="text-slate-400 mt-6">{p.description}</p><p className="price text-2xl mt-6">{eur(p.price)}</p><ConfigurableButton slot="detail-add" type="button" disabled={!p.available} onClick={()=>add(p.slug)} className="btn-primary mt-7" data-testid="product-detail-add-to-cart"><ShoppingBag size={18}/> {p.available?"Добави в количката":"Временно изчерпан"}</ConfigurableButton><Link to="/cart" className="premium-back-link mt-5">Виж количката</Link><p className="text-slate-400 mt-6"><CmsText field="Preview_jsx_9"/></p></div></div></section>;
}
