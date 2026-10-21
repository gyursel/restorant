import {CmsText} from "@/components/site/PublicText";
import { copy } from "@/components/site/public-copy";
import { Link } from "react-router-dom";
import { Logo } from "@/components/site/Primitives";
const getLinks = () => [{
  to: "/menu",
  label: copy["Footer_jsx_1"]
}, {
  to: "/kiosk",
  label: copy["Footer_jsx_2"]
}, {
  to: "/track",
  label: copy["Footer_jsx_3"]
}, {
  to: "/allergens",
  label: copy["Footer_jsx_4"]
}, {
  to: "/privacy",
  label: copy["Footer_jsx_5"]
}, {
  to: "/terms",
  label: copy["Footer_jsx_6"]
}, {
  to: "/admin",
  label: copy["Footer_jsx_7"]
}];
export const Footer = () => <footer className="relative border-t border-white/5 bg-[#101010] pb-28 lg:pb-12 pt-16" data-testid="site-footer">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid gap-10 md:grid-cols-[1.4fr_1fr]">
      <div>
        <Logo />
        <p className="mt-5 max-w-md text-sm text-slate-400 leading-relaxed"><CmsText field="Footer_jsx_8"/></p>
        <p className="mt-4 max-w-md text-xs text-slate-500"><CmsText field="Footer_jsx_9"/></p>
      </div>
      <ul className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
        {getLinks().map(l => <li key={l.to}>
            <Link to={l.to} className="text-slate-400 hover:text-[#f05255] transition-colors" data-testid={`footer-link-${l.to.replace(/\//g, "")}`}>{l.label}</Link>
          </li>)}
      </ul>
    </div>
    <div className="mx-auto mt-12 max-w-7xl px-4 sm:px-6 lg:px-8 text-xs text-slate-600"><CmsText field="Footer_jsx_10"/>{new Date().getFullYear()}{copy["Footer_jsx_11"]}</div>
  </footer>;
