import {CmsText} from "@/content/CmsText";
import { copy } from "@/content/repository";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowDownRight, ArrowRight, ChefHat, Leaf, Timer } from "lucide-react";
import { useMenu, usePublicSettings } from "@/hooks/useMenu";
import { HeroBackground } from "@/components/home/HeroBackground";
import { ProductCard } from "@/components/site/ProductCard";
const FeaturedMenu = ({
  products
}) => <div className="hero-favorites" data-testid="hero-menu-board">
    <div className="flex items-center justify-between gap-4 mb-2">
      <div className="flex items-center gap-3"><span className="h-px w-8 bg-[#f05255]" /><h2 className="text-base md:text-lg font-medium"><CmsText field="Hero_jsx_1"/></h2></div>
      <Link to={copy["Hero_jsx_2"]} className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-white" data-testid="hero-all-products"><CmsText field="Hero_jsx_3"/><ArrowRight className="h-4 w-4" /></Link>
    </div>
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-7">
      {products.map(p => <ProductCard key={p.slug} product={p} featured />)}
    </div>
  </div>;
export const Hero = () => {
  const reduce = useReducedMotion();
  const settings = usePublicSettings();
  const {
    products
  } = useMenu();
  const featured = products.filter(p => p.popular && p.available).slice(0, 4);
  const rise = delay => reduce ? {} : {
    initial: {
      opacity: 0,
      y: 20
    },
    animate: {
      opacity: 1,
      y: 0
    },
    transition: {
      duration: 0.7,
      delay
    }
  };
  return <section id="hero" className="hero-section" data-testid="hero-section" aria-labelledby="hero-title">
      <div className="hero-frame">
        <div className="hero-main">
          <div className="hero-copy">
            <motion.p {...rise(0.1)} className="eyebrow flex items-center gap-3"><span className="h-px w-8 bg-current" /><CmsText field="Hero_jsx_4"/></motion.p>
            <motion.h1 {...rise(0.2)} id="hero-title" data-testid="hero-title" className="font-editorial mt-6 text-4xl sm:text-5xl lg:text-6xl leading-[1.13]"><CmsText field="Hero_jsx_5"/><br /><CmsText field="Hero_jsx_6"/><br /><span className="hero-title-last"><CmsText field="Hero_jsx_7"/></span>
            </motion.h1>
            <motion.p {...rise(0.3)} className="mt-6 max-w-sm text-sm sm:text-base text-slate-400 leading-relaxed" data-testid="hero-subtitle"><CmsText field="Hero_jsx_8"/><br /><CmsText field="Hero_jsx_9"/></motion.p>
            <motion.div {...rise(0.4)} className="mt-8 flex flex-wrap gap-3">
              <Link to={copy["Hero_jsx_10"]} className="btn-primary" data-testid="hero-order-now-button"><CmsText field="Hero_jsx_11"/><ArrowRight className="h-4 w-4" /></Link>
              <Link to={copy["Hero_jsx_12"]} className="btn-cream" data-testid="hero-kiosk-widget"><CmsText field="Hero_jsx_13"/></Link>
            </motion.div>
            <motion.div {...rise(0.5)} className="hero-benefits" data-testid="hero-benefits">
              <span><ChefHat className="h-5 w-5" /><span><CmsText field="Hero_jsx_14"/><br /><strong><CmsText field="Hero_jsx_15"/></strong></span></span>
              <span><Timer className="h-5 w-5" /><span><CmsText field="Hero_jsx_16"/><br /><strong><CmsText field="Hero_jsx_17"/></strong></span></span>
            </motion.div>
          </div>
          <motion.div {...rise(0.3)} className="hero-food">
            <span className="hero-food-caption"><CmsText field="Hero_jsx_18"/></span>
            <div className="hero-food-plate"><HeroBackground media={settings?.media} /></div>
            <div className="hero-food-note" data-testid="hero-quality-note"><Leaf className="h-4 w-4" /><span><CmsText field="Hero_jsx_19"/><br /><strong><CmsText field="Hero_jsx_20"/></strong></span></div>
            <Link to={copy["Hero_jsx_21"]} className="hero-discover" aria-label={copy["Hero_jsx_22"]} data-testid="hero-view-menu-button"><ArrowDownRight className="h-7 w-7" /></Link>
          </motion.div>
        </div>
        {featured.length > 0 && <FeaturedMenu products={featured} />}
      </div>
    </section>;
};
