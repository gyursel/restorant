import {CmsText} from "@/content/CmsText";
import { copy } from "@/content/repository";
import { motion, useReducedMotion } from "framer-motion";
export const Reveal = ({
  children,
  delay = 0,
  className = "",
  y = 24
}) => {
  const reduce = useReducedMotion();
  return <motion.div className={className} initial={reduce ? false : {
    opacity: 0,
    y
  }} whileInView={{
    opacity: 1,
    y: 0
  }} viewport={{
    once: true,
    margin: "-60px"
  }} transition={{
    duration: 0.7,
    delay,
    ease: [0.22, 1, 0.36, 1]
  }}>
      {children}
    </motion.div>;
};
export const SectionHeading = ({
  eyebrow,
  title,
  text,
  id,
  pageTitle = false
}) => <Reveal className="max-w-2xl">
    <p className="eyebrow mb-4">{eyebrow}</p>
    {pageTitle ? <h1 id={id} className="font-editorial text-4xl sm:text-5xl lg:text-6xl leading-tight" data-testid="menu-page-title">{title}</h1> : <h2 id={id} className="text-base md:text-lg font-medium text-[#f6f3ee] leading-tight">{title}</h2>}
    {text && <p className="mt-4 text-sm sm:text-base text-slate-400 leading-relaxed">{text}</p>}
  </Reveal>;
export const Logo = ({
  small = false
}) => <span className={`brand-wordmark ${small ? "brand-wordmark-small" : ""}`}>
    <span><CmsText field="Primitives_jsx_1"/><span className="text-[#f05255]"><CmsText field="Primitives_jsx_2"/></span><span className="brand-period"><CmsText field="Primitives_jsx_3"/></span></span>
    <span className="brand-tagline"><CmsText field="Primitives_jsx_4"/></span>
  </span>;
export const SampleTag = ({
  children = copy["Primitives_jsx_5"],
  testid = "sample-prices-tag"
}) => <span data-testid={testid} className="inline-flex items-center gap-1.5 rounded-full border border-[#d5b782]/40 bg-[#d5b782]/10 px-3 py-1 text-[11px] font-semibold text-[#d5b782]">
    <span className="h-1.5 w-1.5 rounded-full bg-[#d5b782]" />
    {children}
  </span>;
