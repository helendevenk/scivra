"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Pause, Play, RotateCcw } from "lucide-react";
import { useSimulation } from "@/shared/hooks/useSimulation";

const HeroProjectileScene = dynamic(
  () =>
    import(
      "@/shared/components/experiments/three/HeroProjectileScene"
    ).then((m) => m.HeroProjectileScene),
  { ssr: false, loading: () => <HeroPlaceholder /> }
);

function HeroPlaceholder() {
  return (
    <div
      aria-hidden
      className="absolute inset-0 animate-pulse rounded-2xl bg-gradient-to-br from-primary/15 via-primary/5 to-[oklch(0.82_0.17_75/0.08)]"
    />
  );
}

const DEFAULTS = {
  velocity: 14,
  angle: 52,
  gravity: 9.81,
};

/**
 * Interactive 3D projectile-motion preview for the landing hero.
 *
 * Auto-plays on mount. Respects prefers-reduced-motion: when reduced,
 * skips the canvas entirely and renders nothing — the parent hero.tsx
 * shows the static SVG fallback via motion-safe:hidden.
 */
export function Hero3DPreview() {
  const sim = useSimulation(DEFAULTS);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduced) {
      setMounted(true);
      sim.play();
    }
  }, [sim]);

  if (!mounted) {
    return null;
  }

  return (
    <div
      data-hero-3d-preview
      className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-[oklch(0.78_0.15_192/0.08)] via-[oklch(0.96_0.02_192/0.4)] to-[oklch(0.82_0.17_75/0.06)] shadow-[0_0_0_1px_oklch(0.45_0.12_192/0.18),0_30px_60px_-25px_oklch(0.45_0.12_192/0.45)] md:aspect-[5/4]"
    >
      <HeroProjectileScene
        velocity={sim.parameters.velocity}
        angle={sim.parameters.angle}
        gravity={sim.parameters.gravity}
        isPlaying={sim.isPlaying}
        time={sim.time}
        speed={sim.speed}
        onTick={sim.tick}
      />

      <div className="pointer-events-none absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-background/70 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground backdrop-blur-sm">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[oklch(0.65_0.18_145)]" />
        Live physics · drag to rotate
      </div>

      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-gradient-to-t from-background/85 to-transparent px-4 py-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={sim.toggle}
            aria-label={sim.isPlaying ? "Pause simulation" : "Play simulation"}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md transition-transform hover:scale-105 active:scale-95"
          >
            {sim.isPlaying ? (
              <Pause className="h-3.5 w-3.5" aria-hidden />
            ) : (
              <Play className="ml-0.5 h-3.5 w-3.5" aria-hidden />
            )}
          </button>
          <button
            type="button"
            onClick={sim.reset}
            aria-label="Reset simulation"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-colors hover:text-foreground"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden />
          </button>
        </div>
        <p className="font-mono text-[11px] text-muted-foreground">
          v₀ = {sim.parameters.velocity} m/s · θ = {sim.parameters.angle}° · g ={" "}
          {sim.parameters.gravity} m/s²
        </p>
      </div>
    </div>
  );
}
