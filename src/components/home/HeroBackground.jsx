import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { Pause, Play } from "lucide-react";
import { mediaSrc } from "@/lib/media";

/**
 * mode=backdrop: cinematic full-frame video behind the hero content.
 * mode=poster: CMS-managed food photo in the foreground plate.
 * Video is controlled by settings.media.video_enabled and settings.media.hero_video.
 */
export const HeroBackground = ({ media, mode = "backdrop" }) => {
  const video = useRef(null);
  const reduceMotion = useReducedMotion();
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  const saveData = typeof navigator !== "undefined" && Boolean(navigator.connection?.saveData);
  const poster = mediaSrc(media?.hero_image || "/images/fd_burger_classic.webp");
  const enabled = Boolean(mode === "backdrop" && media?.video_enabled && media?.hero_video && !reduceMotion && !saveData);

  useEffect(() => {
    setPlaying(false);
    setFailed(false);
  }, [media?.hero_video, enabled]);

  if (mode === "poster") {
    return <img className="absolute inset-0 h-full w-full object-cover" src={poster} alt="" fetchPriority="high" data-testid="hero-background-image" />;
  }

  const toggle = () => {
    const element = video.current;
    if (!element) return;
    if (element.paused) {
      element.play().catch(() => setFailed(true));
    } else {
      element.pause();
    }
  };

  return <>
    <div className="hero-video-backdrop" aria-hidden="true">
      <img src={poster} alt="" className="hero-video-poster" />
      {enabled && !failed && (
        <video
          key={media.hero_video}
          ref={video}
          src={mediaSrc(media.hero_video)}
          poster={poster}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          tabIndex={-1}
          data-testid="hero-background-video"
          className="hero-video-element"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onError={() => setFailed(true)}
        />
      )}
      <div className="hero-video-tint" />
    </div>
    {enabled && !failed && (
      <button
        type="button"
        className="hero-video-toggle"
        data-testid="hero-video-toggle-play"
        aria-label={playing ? "Пауза на видеофона" : "Пусни видеофона"}
        aria-pressed={playing}
        onClick={toggle}
      >
        {playing ? <Pause size={14} aria-hidden="true" /> : <Play size={14} aria-hidden="true" />}
        <span>{playing ? "Пауза" : "Пусни"}</span>
      </button>
    )}
  </>;
};
