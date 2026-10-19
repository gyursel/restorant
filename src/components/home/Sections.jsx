import {CmsImage} from '@/components/site/CmsImage';
import {ConfigurableButton} from "@/components/site/ConfigurableButton";
import {CmsText} from "@/components/site/PublicText";
import { copy } from "@/components/site/public-copy";
import { Link } from "react-router-dom";
import { ArrowRight, Car, ClipboardCheck, MousePointerClick, Utensils } from "lucide-react";
import { usePromotions, usePublicSettings } from "@/hooks/useMenu";
import { mediaSrc } from "@/lib/media";
import { KioskOrb } from "@/components/site/KioskOrb";
import { Reveal, SampleTag, SectionHeading } from "@/components/site/Primitives";
export const Promotions = () => {
  const promos = usePromotions();
  if (!promos.length) return null;
  const [first, ...rest] = promos;
  return <section id="offers" className="py-20 md:py-28" data-testid="promotions-section">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <SectionHeading eyebrow={copy["Sections_jsx_1"]} title={copy["Sections_jsx_2"]} text={copy["Sections_jsx_3"]} />
          <SampleTag testid="sample-promos-tag"><CmsText field="Sections_jsx_4"/></SampleTag>
        </div>
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-6">
          <Reveal className="lg:col-span-7">
            <PromoCard promo={first} large />
          </Reveal>
          <div className="lg:col-span-5 grid gap-6">
            {rest.map((p, i) => <Reveal key={p.id} delay={0.1 * (i + 1)}><PromoCard promo={p} /></Reveal>)}
          </div>
        </div>
      </div>
    </section>;
};
const PromoCard = ({
  promo,
  large
}) => <article data-testid={`promo-card-${promo.id}`} className={`group relative overflow-hidden rounded-3xl border border-white/10 metal-edge ${large ? "min-h-[420px]" : "min-h-[198px]"}`}>
    <CmsImage src={mediaSrc(promo.image)} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105" />
    <div className="absolute inset-0 bg-gradient-to-t from-[#171717] via-[#171717]/70 to-[#171717]/10" />
    <div className="relative flex h-full flex-col justify-end p-6 sm:p-8" style={{
    minHeight: "inherit"
  }}>
      {promo.badge && <span className="self-start rounded-full bg-[#e62429] px-3 py-1 font-display text-xs font-bold text-white">{promo.badge}</span>}
      <h3 className={`mt-4 font-display font-bold uppercase ${large ? "text-2xl sm:text-3xl" : "text-lg"}`}>{promo.title}</h3>
      <p className="mt-2 max-w-md text-sm text-slate-300">{promo.description}</p>
      {promo.code && <p className="mt-4 text-xs text-slate-400"><CmsText field="Sections_jsx_5"/><span className="font-display text-sm font-bold tracking-widest text-[#f05255]" data-testid={`promo-code-${promo.code}`}>{promo.code}</span></p>}
    </div>
  </article>;
const getSteps = () => [{
  icon: MousePointerClick,
  title: copy["Sections_jsx_6"],
  text: copy["Sections_jsx_7"]
}, {
  icon: Utensils,
  title: copy["Sections_jsx_8"],
  text: copy["Sections_jsx_9"]
}, {
  icon: ClipboardCheck,
  title: copy["Sections_jsx_10"],
  text: copy["Sections_jsx_11"]
}, {
  icon: Car,
  title: copy["Sections_jsx_12"],
  text: copy["Sections_jsx_13"]
}];
export const HowItWorks = () => <section id="how-it-works" className="relative scroll-mt-20 py-20 md:py-28 border-y border-white/5 bg-[#202020]" data-testid="how-it-works-section">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <SectionHeading eyebrow={copy["Sections_jsx_14"]} title={copy["Sections_jsx_15"]} />
      <ol className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {getSteps().map(({
        icon: Icon,
        title,
        text
      }, i) => <Reveal key={title} delay={i * 0.08}>
            <li className="relative h-full rounded-2xl glass p-6 transition-[border-color,transform] duration-500 hover:-translate-y-1 hover:border-[#f05255]/30" data-testid={`how-step-${i + 1}`}>
              <span className="font-display text-5xl font-black text-white/[0.06] absolute right-5 top-4">0{i + 1}</span>
              <span className="grid h-12 w-12 place-items-center rounded-xl border border-[#f05255]/30 bg-[#f05255]/5"><Icon className="h-5 w-5 text-[#f05255]" /></span>
              <h3 className="mt-6 font-display text-base font-bold uppercase">{title}</h3>
              <p className="mt-2 text-sm text-slate-400 leading-relaxed">{text}</p>
            </li>
          </Reveal>)}
      </ol>
    </div>
  </section>;
export const KioskTeaser = () => {
  const settings = usePublicSettings();
  return <section className="relative py-20 md:py-28 overflow-hidden" data-testid="kiosk-teaser-section">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
      <Reveal className="relative order-2 lg:order-1">
        <div className="relative mx-auto max-w-md aspect-[3/4] overflow-hidden rounded-3xl border border-white/10 metal-edge">
          {settings?.media?.kiosk_image && <CmsImage src={mediaSrc(settings.media.kiosk_image)} alt={copy["Sections_jsx_16"]} loading="lazy" className="h-full w-full object-cover grayscale" data-testid="kiosk-teaser-image" />}
          <div className="absolute inset-0 bg-gradient-to-t from-[#171717]/80 to-transparent" />
        </div>
      </Reveal>
      <div className="order-1 lg:order-2">
        <SectionHeading eyebrow={copy["Sections_jsx_17"]} title={copy["Sections_jsx_18"]} text={copy["Sections_jsx_19"]} />
        <Reveal delay={0.15} className="mt-8 flex items-center gap-6">
          <KioskOrb state="listening" size={110} />
          <ConfigurableButton slot="assistant-cta" to={copy["Sections_jsx_20"]} className="btn-primary" data-testid="kiosk-teaser-cta"><CmsText field="Sections_jsx_21"/><ArrowRight className="h-4 w-4" /></ConfigurableButton>
        </Reveal>
        <p className="mt-6 text-xs text-slate-500"><CmsText field="Sections_jsx_22"/></p>
      </div>
    </div>
  </section>;
};
