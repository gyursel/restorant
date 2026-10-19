import {ConfigurableButton} from "@/components/site/ConfigurableButton";
import {CmsText} from "@/components/site/PublicText";
import { getContent, copy } from "@/components/site/public-copy";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu as MenuIcon, ShoppingBag, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Logo } from "@/components/site/Primitives";
import {useCart} from "@/context/CartContext";

export const Header = () => {
 const NAV = getContent().navigation.header;
  const {itemCount:count}=useCart();
  const navigate = useNavigate();
  const setOpen = () => navigate("/cart");
  const {
    pathname,
    hash
  } = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobile, setMobile] = useState(false);
  const firstMobileLink = useRef(null);
  const mobileToggle = useRef(null);
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
    if (!mobile) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    firstMobileLink.current?.focus({ preventScroll: true });
    const close = e => {
      if (e.key === "Escape") {
        setMobile(false);
        mobileToggle.current?.focus({ preventScroll: true });
      }
    };
    const trap = e => {
      if(e.key !== 'Tab') return;
      const controls = [...document.querySelectorAll('#premium-mobile-navigation a, .premium-mobile-toggle')].filter(el=>el.getClientRects().length);
      const first=controls[0],last=controls[controls.length-1];
      if(e.shiftKey && document.activeElement===first){e.preventDefault();last?.focus();}
      if(!e.shiftKey && document.activeElement===last){e.preventDefault();first?.focus();}
    };
    window.addEventListener('keydown',trap);
    window.addEventListener("keydown", close);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", close);
      window.removeEventListener("keydown",trap);
    };
  }, [mobile]);
  const solid = scrolled || pathname !== "/" || mobile;
  return <header data-testid="site-header" className={`site-header fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300 border-b ${solid ? "backdrop-blur-xl border-white/10" : "border-transparent"}`}>
      <div className="site-header-inner flex items-center justify-between gap-4">
        <Link to={copy["Header_jsx_6"]} onClick={() => setMobile(false)} aria-label={copy["Header_jsx_7"]} data-testid="header-logo-link"><Logo /></Link>
        <nav className="hidden lg:flex items-center gap-1" aria-label={copy["Header_jsx_8"]}>
          {NAV.map(n => <Link key={n.to} to={n.to} data-testid={n.testid} aria-current={`${pathname}${hash}` === n.to ? "page" : undefined} className="relative px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white transition-colors after:absolute after:left-4 after:right-4 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-[#f05255] after:transition-transform hover:after:scale-x-100">
              {n.label}
            </Link>)}
        </nav>
        <div className="flex items-center gap-2">
          <ConfigurableButton slot="header-assist" to={copy["Header_jsx_9"]} data-testid="header-kiosk-link" className="btn-primary !min-h-11 !px-5 !text-xs hidden md:inline-flex"><CmsText field="Header_jsx_10"/><span className="h-1.5 w-1.5 rounded-full bg-white" />
          </ConfigurableButton>
          <ConfigurableButton slot="header-cart" onClick={() => setOpen(true)} data-testid="header-cart-button" aria-label={`Количка, ${count} продукта`} className="relative grid h-11 w-11 place-items-center rounded-full glass hover:border-[#f05255]/60 transition-colors">
            <ShoppingBag className="h-5 w-5" />
            {count > 0 && <span data-testid="header-cart-count" className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-[#e62429] px-1 text-[10px] font-bold text-white">{count}</span>}
          </ConfigurableButton>
          <button ref={mobileToggle} type="button" onClick={() => setMobile(v => !v)} data-testid="mobile-menu-toggle" aria-label={mobile ? "Затвори навигацията" : copy["Header_jsx_11"]} aria-expanded={mobile} aria-controls="premium-mobile-navigation" className="premium-mobile-toggle lg:hidden grid h-11 w-11 place-items-center rounded-full glass">
            {mobile ? <X className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
          </button>
        </div>
      </div>
      {mobile && <nav id="premium-mobile-navigation" className="premium-mobile-menu lg:hidden" aria-label="Мобилно меню" data-testid="mobile-nav">
          <p className="premium-mobile-menu-label">НАВИГАЦИЯ / LILY DRIVE</p>
          {[...NAV, {
        label: copy["Header_jsx_12"],
        to: "/kiosk",
        testid: "mobile-nav-kiosk"
      }, {
        label: copy["Header_jsx_13"],
        to: "/track",
        testid: "mobile-nav-track"
      }].map((n, index) => <Link ref={index === 0 ? firstMobileLink : undefined} key={n.to} to={n.to} data-testid={`mobile-${n.testid}`} onClick={() => setMobile(false)} className="premium-mobile-menu-link">
              {n.label}
            </Link>)}
        </nav>}
    </header>;
};
