import {CmsText} from "@/components/site/PublicText";
import { copy } from "@/components/site/public-copy";
import { useMemo, useState } from "react";
import { useMenu } from "@/hooks/useMenu";
import { ProductCard } from "@/components/site/ProductCard";
import { Reveal, SampleTag, SectionHeading } from "@/components/site/Primitives";
export const MenuSection = ({
  standalone = false
}) => {
  const {
    categories,
    products,
    isLoading,
    error
  } = useMenu();
  const [active, setActive] = useState("all");
  const list = useMemo(() => active === "all" ? products : products.filter(p => p.category === active), [active, products]);
  const tabs = [{
    slug: "all",
    name: copy["MenuSection_jsx_1"]
  }, ...categories];
  return <section id="menu" className={`relative scroll-mt-20 ${standalone ? "pt-28 sm:pt-32" : "pt-20 md:pt-28"} pb-20 md:pb-28`} data-testid="menu-section">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <SectionHeading pageTitle={standalone} eyebrow={copy["MenuSection_jsx_2"]} title={standalone ? copy["MenuSection_jsx_3"] : copy["MenuSection_jsx_4"]} text={copy["MenuSection_jsx_5"]} />
          <SampleTag><CmsText field="MenuSection_jsx_6"/></SampleTag>
        </div>
        <div className="category-nav sticky top-[76px] lg:top-[100px] z-30 -mx-4 mt-10 px-4 py-3 backdrop-blur-xl sm:mx-0 sm:rounded-full sm:px-2">
          <div className="flex gap-2 overflow-x-auto no-scrollbar" role="tablist" aria-label={copy["MenuSection_jsx_7"]}>
            {tabs.map(c => <button key={c.slug} role="tab" aria-selected={active === c.slug} onClick={() => setActive(c.slug)} data-testid={`category-tab-${c.slug}`} className={`shrink-0 rounded-full px-5 h-11 text-sm font-semibold transition-[background-color,color,box-shadow] duration-300 ${active === c.slug ? "bg-[#e62429] text-white" : "text-slate-300 hover:bg-white/5"}`}>
                {c.name}
              </button>)}
          </div>
        </div>
        {error && <p className="mt-10 text-red-400" data-testid="menu-error"><CmsText field="MenuSection_jsx_8"/></p>}
        {isLoading ? <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {Array.from({
          length: 8
        }).map((_, i) => <div key={i} className="aspect-[3/4] rounded-2xl glass animate-pulse" />)}
          </div> : <div className="mt-10 grid grid-cols-1 min-[420px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6" data-testid="product-grid">
            {list.map((p, i) => <Reveal key={p.slug} delay={Math.min(i, 6) * 0.05}><ProductCard product={p} /></Reveal>)}
          </div>}
      </div>
    </section>;
};
