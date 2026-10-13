import {CmsText} from "@/content/CmsText";
import { getContent, copy } from "@/content/repository";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu as MenuIcon, ShoppingBag, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Logo } from "@/components/site/Primitives";

export const Header = () => {
 const NAV = getContent().navigation.header;
  const count = 0;
  const navigate = useNavigate();
  const setOpen = () => navigate("/phase-one");
  const {
    pathname,
    hash
  } = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, {
      passive: true
    });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    setMobile(false);
  }, [pathname, hash]);
  useEffect(() => {
    const close = e => {
      if (e.key === "Escape") setMobile(false);
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);
  const solid = scrolled || pathname !== "/" || mobile;
  return <header data-testid="site-header" className={`site-header fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300 border-b ${solid ? "backdrop-blur-xl border-white/10" : "border-transparent"}`}>
      <div className="site-header-inner flex items-center justify-between gap-4">
        <Link to={copy["Header_jsx_6"]} aria-label={copy["Header_jsx_7"]} data-testid="header-logo-link"><Logo /></Link>
        <nav className="hidden lg:flex items-center gap-1" aria-label={copy["Header_jsx_8"]}>
          {NAV.map(n => <Link key={n.to} to={n.to} data-testid={n.testid} aria-current={`${pathname}${hash}` === n.to ? "page" : undefined} className="relative px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white transition-colors after:absolute after:left-4 after:right-4 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-[#f05255] after:transition-transform hover:after:scale-x-100">
              {n.label}
            </Link>)}
        </nav>
        <div className="flex items-center gap-2">
          <Link to={copy["Header_jsx_9"]} data-testid="header-kiosk-link" className="btn-primary !min-h-11 !px-5 !text-xs hidden md:inline-flex"><CmsText field="Header_jsx_10"/><span className="h-1.5 w-1.5 rounded-full bg-white" />
          </Link>
          <button onClick={() => setOpen(true)} data-testid="header-cart-button" aria-label={copy.cartLabel} className="relative grid h-11 w-11 place-items-center rounded-full glass hover:border-[#f05255]/60 transition-colors">
            <ShoppingBag className="h-5 w-5" />
            {count > 0 && <span data-testid="header-cart-count" className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-[#e62429] px-1 text-[10px] font-bold text-white">{count}</span>}
          </button>
          <button onClick={() => setMobile(v => !v)} data-testid="mobile-menu-toggle" aria-label={copy["Header_jsx_11"]} aria-expanded={mobile} className="lg:hidden grid h-11 w-11 place-items-center rounded-full glass">
            {mobile ? <X className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
          </button>
        </div>
      </div>
      {mobile && <nav className="lg:hidden border-t border-white/5 px-4 pb-6 pt-2" data-testid="mobile-nav">
          {[...NAV, {
        label: copy["Header_jsx_12"],
        to: "/kiosk",
        testid: "mobile-nav-kiosk"
      }, {
        label: copy["Header_jsx_13"],
        to: "/track",
        testid: "mobile-nav-track"
      }].map(n => <Link key={n.to} to={n.to} data-testid={`mobile-${n.testid}`} onClick={() => setMobile(false)} className="flex h-14 items-center border-b border-white/5 text-base font-semibold text-slate-200">
              {n.label}
            </Link>)}
        </nav>}
    </header>;
};
