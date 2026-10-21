import {getContent} from '@/components/site/public-copy';
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { Pause, Play, Video } from "lucide-react";
import { mediaSrc } from "@/lib/media";

/**
 * The cinematic hero is decorative. Respect reduced motion, data saver, tab
 * visibility and intersection; always retain the CMS poster as fallback.
 */
export const HeroBackground = ({ media, mode = "backdrop" }) => {
  const video = useRef(null);
  const host = useRef(null);
  const reducedMotion = useReducedMotion();
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  const [pausedByUser, setPausedByUser] = useState(false);
  const [inView, setInView] = useState(true);
  const poster = mediaSrc(media?.hero_image || '/images/lily-hero.webp');

  const connection = typeof navigator !== "undefined" ? navigator.connection : null;
  const dataSaver = Boolean(connection?.saveData) || /^(slow-2g|2g)$/.test(connection?.effectiveType || "");
  const mobile = typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches;
  const videoSource = mobile && media?.hero_video === '/videos/lily-atmosphere.mp4' ? '/videos/lily-atmosphere-mobile.mp4' : media?.hero_video;
  const enabled = mode === "backdrop" && Boolean(media?.video_enabled !== false && videoSource) && !reducedMotion && getContent()?.appearance?.motion!=="reduced" && !dataSaver;

  useEffect(() => {
    setReady(false);
    setFailed(false);
    setPlaying(false);
    setPausedByUser(false);
  }, [media?.hero_video, enabled]);

  useEffect(() => {
    if (!enabled || !host.current || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) => {
      setInView(Boolean(entry?.isIntersecting));
    }, { threshold: 0.08 });
    observer.observe(host.current);
    return () => observer.disconnect();
  }, [enabled]);

  useEffect(() => {
    if (!enabled || failed) return;
    const element = video.current;
    if (!element) return;
    const updatePlayback = () => {
      if (document.hidden || !inView || pausedByUser) {
        element.pause();
      } else {
        // A muted background may autoplay. When blocked, keep the poster and
        // provide a manual play button without triggering an infinite retry.
        const pending = element.play();
        if (pending?.catch) pending.catch(() => setPlaying(false));
      }
    };
    updatePlayback();
    document.addEventListener("visibilitychange", updatePlayback);
    return () => document.removeEventListener("visibilitychange", updatePlayback);
  }, [enabled, failed, inView, pausedByUser, media?.hero_video]);

  const toggle = () => {
    if (!video.current) return;
    if (video.current.paused) {
      setPausedByUser(false);
      video.current.play().catch(() => setPlaying(false));
    } else {
      setPausedByUser(true);
      video.current.pause();
    }
  };

  if (mode === "poster") {
    return <img className="absolute inset-0 h-full w-full object-cover" src={poster} alt="" fetchPriority="high" data-testid="hero-background-image" />;
  }

  return <>
    <div className="hero-video-backdrop" ref={host} data-video-state={enabled && !failed ? (playing ? "playing" : "paused") : "poster"} aria-hidden="true">
      <img src={poster} alt="" className="hero-video-poster" data-cms-media="hero_image" fetchPriority="high" />
      {enabled && !failed && (
        <video
          ref={video}
          key={videoSource}
          src={mediaSrc(videoSource)}
          poster={poster}
          autoPlay
          muted
          loop
          playsInline
          preload={mobile ? "none" : "metadata"}
          tabIndex={-1}
          data-testid="hero-background-video"
          className={"hero-video-element" + (ready && playing ? " is-visible" : "")}
          onLoadedData={() => setReady(true)}
          onPlaying={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onError={() => setFailed(true)}
        />
      )}
      <div className="hero-video-tint" />
      <div className="hero-video-noise" />
    </div>
    {enabled && !failed && (
      <button
        type="button"
        className="hero-video-toggle"
        data-testid="hero-video-toggle-play"
        aria-label={playing ? "Спри видеофона" : "Пусни видеофона"}
        aria-pressed={playing}
        onClick={toggle}
      >
        {playing ? <Pause size={14} aria-hidden="true" /> : <Play size={14} aria-hidden="true" />}
        <span>{playing ? "Пауза" : "Пусни"}</span>
        <Video size={13} className="hero-video-toggle-decoration" aria-hidden="true" />
      </button>
    )}
  </>;
};
