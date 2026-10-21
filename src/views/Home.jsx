import {SectionConfig} from '@/content/SectionConfig';
import { Hero } from "@/components/home/Hero";
import { MenuSection } from "@/components/home/MenuSection";
import { HowItWorks, KioskTeaser, Promotions } from "@/components/home/Sections";
import { Location } from "@/components/home/Location";

import {getContent} from '@/content/repository';
const registry={hero:Hero,menu:MenuSection,promotions:Promotions,assistant:KioskTeaser,steps:HowItWorks,location:Location};
export default function Home(){return <>{getContent().pages.home.sections.filter(s=>s.visible).map(s=>{const Component=registry[s.type];return Component?<SectionConfig.Provider key={s.id} value={s}><div className={`home-section-wrap section-align-${s.alignment||'left'}`} data-section-image={!!s.backgroundImage} style={{backgroundColor:s.background,...(s.background?{'--section-background':s.background}:{}),...(s.backgroundImage?{backgroundImage:`linear-gradient(#0d0d0ddd,#0d0d0ddd),url(${JSON.stringify(s.backgroundImage)})`,backgroundSize:'cover',backgroundPosition:'center'}:{})}}><Component/></div></SectionConfig.Provider>:null;})}</>}

export function MenuPage() {
  return <MenuSection standalone />;
}
