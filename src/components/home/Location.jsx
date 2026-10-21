import {CmsText} from "@/components/site/PublicText";
import { copy } from "@/components/site/public-copy";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { usePublicSettings } from "@/hooks/useMenu";
import { DAYS } from "@/lib/api";
import { Reveal, SampleTag, SectionHeading } from "@/components/site/Primitives";
export const HoursList = ({
  settings
}) => <ul className="divide-y divide-white/5" data-testid="opening-hours-list">
    {[...settings.hours].sort((a, b) => a.day - b.day).map(h => <li key={h.day} className="flex justify-between py-2.5 text-sm">
        <span className="text-slate-300">{DAYS[h.day]}</span>
        <span className="font-display text-xs tracking-wider">{h.closed ? copy["Location_jsx_1"] : `${h.open} – ${h.close}`}</span>
      </li>)}
  </ul>;
export const Location = () => {
  const s = usePublicSettings();
  if (!s) return <section id="location" className="min-h-[400px]" />;
  const q = encodeURIComponent(s.map_query || "Bulgaria");
  return <section id="location" className="scroll-mt-20 py-20 md:py-28" data-testid="location-section">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow={copy["Location_jsx_2"]} title={copy["Location_jsx_3"]} text={copy["Location_jsx_4"]} />
        <div className="mt-12 grid lg:grid-cols-12 gap-6">
          <Reveal className="lg:col-span-7">
            <div className="relative overflow-hidden rounded-3xl border border-white/10 metal-edge aspect-[4/3] lg:aspect-auto lg:h-full lg:min-h-[320px]">
              <iframe title={copy["Location_jsx_5"]} data-testid="google-map-iframe" src={`https://www.google.com/maps?q=${q}&output=embed`} className="absolute inset-0 h-full w-full [filter:invert(0.9)_hue-rotate(180deg)_saturate(0.6)_brightness(0.9)]" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
              <span className="absolute left-4 top-4"><SampleTag testid="sample-location-tag"><CmsText field="Location_jsx_6"/></SampleTag></span>
            </div>
          </Reveal>
          <div id="contact" className="lg:col-span-5 grid gap-6 scroll-mt-24" data-testid="contact-section">
            <Reveal delay={0.1} className="rounded-3xl glass p-6 sm:p-8">
              <div className="flex items-center justify-between">
                <h3 className="flex items-center gap-2 font-display text-sm font-bold uppercase"><Clock className="h-4 w-4 text-[#f05255]" /><CmsText field="Location_jsx_7"/></h3>
                {s.hours_are_sample && <SampleTag testid="sample-hours-tag"><CmsText field="Location_jsx_8"/></SampleTag>}
              </div>
              <div className="mt-4"><HoursList settings={s} /></div>
            </Reveal>
            <Reveal delay={0.2} className="rounded-3xl glass p-6 sm:p-8">
              <h3 className="font-display text-sm font-bold uppercase"><CmsText field="Location_jsx_9"/></h3>
              <ul className="mt-5 space-y-4 text-sm">
                <li className="flex gap-3" data-testid="contact-address"><MapPin className="h-4 w-4 text-[#f05255] mt-0.5" /> {s.address}</li>
                <li className="flex gap-3" data-testid="contact-phone"><Phone className="h-4 w-4 text-[#f05255] mt-0.5" /> {s.phone}</li>
                <li className="flex gap-3" data-testid="contact-email"><Mail className="h-4 w-4 text-[#f05255] mt-0.5" /> {s.email}</li>
              </ul>
            </Reveal>
          </div>
        </div>
      </div>
    </section>;
};
