import {CmsText} from "@/content/CmsText";
import { copy } from "@/content/repository";
import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
export default function SiteLayout() {
  const {
    pathname,
    hash
  } = useLocation();
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
  return <div className="min-h-screen bg-[#171717] text-[#f6f3ee]">
      <a href={copy["SiteLayout_jsx_1"]} data-testid="skip-to-content-link" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded focus:bg-white focus:px-3 focus:py-2 focus:text-black"><CmsText field="SiteLayout_jsx_2"/></a>
      <Header />
      <main id="main">
        <Outlet />
      </main>
      <Footer />
    </div>;
}
