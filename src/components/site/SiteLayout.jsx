import {lilyAppearance} from "./lily-appearance";
import {CmsText} from "@/components/site/PublicText";
import { copy, getContent } from "@/components/site/public-copy";
import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import MobileDock from "@/components/site/MobileDock";
import {CartProvider} from "@/context/CartContext";
export default function SiteLayout() {
  const {
    pathname,
    hash
  } = useLocation();
  useEffect(() => {
    // BrowserRouter navigation is client-side; keep the tab title and page
    // description in sync with server-rendered product metadata.
    const content=getContent();
    if (!content) return;
    const product=pathname.startsWith('/product/')
      ? content.menu?.products?.find(p=>p.slug===pathname.slice('/product/'.length))
      : null;
    const homeTitle=content.meta?.title||'LILY DRIVE BULGARIA';
    document.title=product
      ? product.name+' | '+homeTitle
      : pathname==='/menu' ? 'Меню и цени | '+homeTitle : homeTitle;
    const description=product?.description||
      (pathname==='/menu'?'Разгледай актуалното меню, цени и предложения в LILY DRIVE BULGARIA.':content.meta?.description);
    const meta=document.querySelector('meta[name="description"]');
    if(meta&&description)meta.setAttribute('content',description);
  },[pathname]);
  useEffect(() => {
    if (new URLSearchParams(window.location.search).has("editor")) return;
    if (hash) {
      const go = () => document.getElementById(hash.slice(1))?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth"
      });
      const timers = [setTimeout(go, 80), setTimeout(go, 900)];
      return () => timers.forEach(clearTimeout);
    }
    window.scrollTo(0, 0);
    return undefined;
  }, [pathname, hash]);
  return <CartProvider><div style={lilyAppearance(getContent()?.appearance)} data-desktop-background={getContent()?.appearance?.backgroundMode==='image'&&getContent()?.appearance?.backgroundImage?'image':'default'} data-motion={getContent()?.appearance?.motion} data-card-style={getContent()?.appearance?.cardStyle} data-button-style={getContent()?.appearance?.buttonStyle} className="site-experience lily-experience min-h-screen bg-[#171717] text-[#f6f3ee]">
      <a href={copy["SiteLayout_jsx_1"]} data-testid="skip-to-content-link" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded focus:bg-white focus:px-3 focus:py-2 focus:text-black"><CmsText field="SiteLayout_jsx_2"/></a>
      <Header />
      <main id="main">
        <div key={pathname} className="lily-route-scene"><Outlet /></div>
      </main>
      <Footer />
      <MobileDock />
    </div></CartProvider>;
}
