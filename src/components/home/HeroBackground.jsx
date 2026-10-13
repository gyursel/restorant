import { copy } from "@/content/repository";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { Pause, Play } from "lucide-react";
import { mediaSrc } from "@/lib/media";
export const HeroBackground = ({
  media
}) => {
  const video = useRef(null);
  const reduce = useReducedMotion();
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  const saveData = navigator.connection?.saveData;
  const enabled = Boolean(media?.video_enabled && media?.hero_video && !reduce && !saveData);
  useEffect(() => {
    setFailed(false);
    setPlaying(false);
  }, [media?.hero_video, enabled]);
  const toggle = () => {
    if (!video.current) return;
    if (video.current.paused) video.current.play().catch(() => setFailed(true));else video.current.pause();
  };
  return <>
    {media?.hero_image && <img src={mediaSrc(media.hero_image)} alt="" fetchPriority="high" data-testid="hero-background-image" className="absolute inset-0 h-full w-full object-cover object-[65%_center]" />}
    {enabled && !failed && <video key={media.hero_video} ref={video} src={mediaSrc(media.hero_video)} poster={mediaSrc(media.hero_image)} autoPlay muted loop playsInline preload="metadata" aria-hidden="true" data-testid="hero-background-video" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onError={() => setFailed(true)} className="absolute inset-0 h-full w-full object-cover object-[65%_center]" />}
    {enabled && !failed && <button type="button" onClick={toggle} aria-label={playing ? copy["HeroBackground_jsx_1"] : copy["HeroBackground_jsx_2"]} aria-pressed={playing} data-testid="hero-video-toggle-play" className="absolute z-20 bottom-6 right-4 sm:right-8 inline-flex items-center gap-2 rounded-full border border-white/20 bg-[#171717]/80 px-4 py-3 text-xs text-white backdrop-blur-md transition-colors hover:border-[#f05255]/60">
      {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />} {playing ? copy["HeroBackground_jsx_3"] : copy["HeroBackground_jsx_4"]}
    </button>}
  </>;
};
