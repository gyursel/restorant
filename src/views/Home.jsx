import { Hero } from "@/components/home/Hero";
import { MenuSection } from "@/components/home/MenuSection";
import { HowItWorks, KioskTeaser, Promotions } from "@/components/home/Sections";
import { Location } from "@/components/home/Location";

import {getContent} from '@/content/repository';
const registry={hero:Hero,menu:MenuSection,promotions:Promotions,assistant:KioskTeaser,steps:HowItWorks,location:Location};
export default function Home(){return <>{getContent().pages.home.sections.filter(s=>s.visible).map(s=>{const Component=registry[s.type];return Component?<Component key={s.id}/>:null;})}</>}

export function MenuPage() {
  return <MenuSection standalone />;
}
