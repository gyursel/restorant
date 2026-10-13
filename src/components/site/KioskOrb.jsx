export const KioskOrb = ({ state = "idle", size = 220 }) => {
  const active = state !== "idle";
  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }} data-testid="kiosk-orb" data-state={state}>
      <span className={`absolute inset-0 rounded-full border border-[#f05255]/40 ${active ? "fd-ring-pulse" : ""}`} />
      <span className="absolute inset-[6%] rounded-full border border-[#f05255]/25 border-dashed fd-spin-slow" />
      <span className="absolute inset-[14%] rounded-full" style={{ background: "radial-gradient(circle, rgba(230,36,41,0.22), rgba(230,36,41,0.02) 65%, transparent 70%)" }} />
      <span className="absolute inset-[22%] rounded-full border-2 border-[#f05255] shadow-[0_0_40px_rgba(230,36,41,0.45),inset_0_0_30px_rgba(230,36,41,0.35)]" />
      <div className="relative flex items-center gap-1 h-10">
        {[0.5, 0.9, 0.6, 1, 0.7, 0.45, 0.8].map((h, i) => (
          <span
            key={i}
            className={`w-1 rounded-full bg-[#f05255] ${active ? "fd-wave-bar" : ""}`}
            style={{ height: `${h * 100}%`, animationDelay: `${i * 0.09}s`, opacity: active ? 1 : 0.55 }}
          />
        ))}
      </div>
    </div>
  );
};
