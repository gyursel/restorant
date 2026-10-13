import {CmsText} from "@/content/CmsText";
import { copy } from "@/content/repository";
import { Link, useParams } from 'react-router-dom';
import { useMenu } from '@/hooks/useMenu';
import { eur } from '@/lib/api';
export function PhaseNotice() {
  return <section className="max-w-3xl mx-auto px-6 pb-20" style={{
    paddingTop: 160,
    minHeight: '70vh'
  }}><p className="eyebrow"><CmsText field="Preview_jsx_1"/></p><h1 className="font-editorial text-4xl mt-6"><CmsText field="Preview_jsx_2"/></h1><p className="text-slate-400 mt-6"><CmsText field="Preview_jsx_3"/></p><Link to={copy["Preview_jsx_4"]} className="btn-primary mt-8"><CmsText field="Preview_jsx_5"/></Link></section>;
}
export function ProductDetail() {
  const {
    slug
  } = useParams();
  const {
    products
  } = useMenu();
  const p = products.find(x => x.slug === slug);
  if (!p) return <PhaseNotice />;
  return <section className="max-w-7xl mx-auto px-6 pb-20" style={{
    paddingTop: 150
  }}><Link to={copy["Preview_jsx_6"]} className="text-slate-400"><CmsText field="Preview_jsx_7"/></Link><div className="grid lg:grid-cols-2 gap-12 items-center mt-10"><img src={p.image} alt={p.name} width="640" height="640" className="product-photo rounded-full" /><div><p className="eyebrow"><CmsText field="Preview_jsx_8"/></p><h1 className="font-editorial text-4xl mt-6">{p.name}</h1><p className="text-slate-400 mt-6">{p.description}</p><p className="price text-2xl mt-6">{eur(p.price)}</p><p className="text-slate-400 mt-6"><CmsText field="Preview_jsx_9"/></p></div></div></section>;
}
