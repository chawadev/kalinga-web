import React from "react";

export type OrbState = "idle" | "listening" | "thinking" | "speaking";

const STATUS_LABELS: Record<OrbState, string> = {
  idle: "Ready",
  listening: "Listening…",
  thinking: "Working on it…",
  speaking: "Responding",
};

interface VoiceOrbProps {
  state?: OrbState;
  compact?: boolean;
  onClick?: () => void;
}

export function VoiceOrb({ state = "idle", compact = false, onClick }: VoiceOrbProps) {
  const active = state !== "idle";
  const size = compact ? "h-28 w-28" : "h-44 w-44";
  const coreSize = compact ? "h-20 w-20" : "h-32 w-32";

  return (
    <div className="flex flex-col items-center gap-4 select-none">
      <div 
        onClick={onClick}
        className={`relative grid place-items-center cursor-pointer transition-transform duration-500 ${size}`}
      >
        {/* 1. Deep Ambient Aura / Glow underneath */}
        <div className="absolute inset-4 rounded-full bg-primary/25 blur-2xl" />

        {/* 2. Concentric Acoustic Waves (expand outward when active) */}
        {active && [0, 1, 2].map((ring) => (
          <span
            key={ring}
            className="absolute inset-1 rounded-full border border-primary/35 animate-soundwave pointer-events-none"
            style={{ animationDelay: `${ring * 420}ms` }}
          />
        ))}

        {/* 3. Floating Glass Sphere Core */}
        <div
          className={`
            relative grid place-items-center rounded-full 
            border border-primary/30 bg-primary/10 
            backdrop-blur-xl 
            shadow-[inset_0_1px_18px_rgba(10,149,154,0.22),0_12px_36px_-16px_rgba(10,149,154,0.65)]
            transition-all duration-500
            ${coreSize}
            ${state === "listening" ? "scale-105" : "hover:scale-105"}
          `}
          style={{ animation: "breathe 4s ease-in-out infinite" }}
        >
          {/* Subtle upper glass rim reflection */}
          <div className="absolute top-1.5 inset-x-4 h-3 rounded-full bg-white/10 blur-[2px] pointer-events-none dark:bg-white/5" />

          {/* 4. Internal Frequency Bars */}
          <div className="flex items-end gap-1.5 z-10">
            {[0, 1, 2, 3, 4].map((i) => (
              <span
                key={i}
                className="w-1 rounded-full bg-primary transition-all duration-300"
                style={{
                  height: active ? `${10 + ((i * 7 + 9) % 22)}px` : "10px",
                  opacity: 0.55 + i * 0.09,
                  animation: active
                    ? `breathe ${1 + i * 0.22}s ease-in-out infinite`
                    : undefined,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* State Text Pill */}
      <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-muted-foreground/80">
        {STATUS_LABELS[state]}
      </span>
    </div>
  );
}
