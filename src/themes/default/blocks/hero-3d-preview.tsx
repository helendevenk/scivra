"use client";

import dynamic from "next/dynamic";
import { useEffect, useSyncExternalStore } from "react";
import { ArrowUpRight, Pause, Play, RotateCcw } from "lucide-react";
import { Link } from "@/core/i18n/navigation";
import { useSimulation } from "@/shared/hooks/useSimulation";
import { track } from "@/shared/lib/analytics/track";

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

// The hero scene visualizes projectile motion — clicking the preview should
// land students directly on the corresponding lab. URL exported so hero.tsx
// can wrap the SVG fallback in the same Link.
export const HERO_PREVIEW_LAB_HREF = "/labs/physics/ngss-hs/projectile-motion";

// SSR-safe client-mounted flag — useSyncExternalStore avoids the
// react-hooks/set-state-in-effect rule that fires on the older
// `useState(false) + useEffect(setMounted(true))` pattern.
const subscribeNoop = () => () => {};
function useHasMounted(): boolean {
  return useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false
  );
}

// Guard window.matchMedia access for jsdom (where window exists but matchMedia
// is not implemented) and for any consumer that mounts <Hero /> in a test
// without manually polyfilling matchMedia.
function hasMatchMedia(): boolean {
  return typeof window !== "undefined" && typeof window.matchMedia === "function";
}
function subscribeReducedMotion(callback: () => void): () => void {
  if (!hasMatchMedia()) return () => {};
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}
function getReducedMotionSnapshot(): boolean {
  // In environments without matchMedia (jsdom, ancient browsers), behave as
  // if the user opted out of motion. This keeps the canvas from mounting
  // inside unit tests that render the parent <Hero /> without polyfilling
  // matchMedia — the dynamic R3F import would otherwise pull three.js,
  // which touches `window` and produces unhandled errors at teardown.
  if (!hasMatchMedia()) return true;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
function useReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    () => false
  );
}

/**
 * Interactive 3D projectile-motion preview for the landing hero.
 *
 * Auto-plays once the canvas mounts. Respects prefers-reduced-motion: when
 * reduced, this component renders nothing — the parent hero.tsx then shows
 * the static SVG fallback via motion-safe:hidden.
 *
 * Layout uses the "background link" pattern: the outer wrapper is a div
 * (so we don't nest <button> inside <a>, which is invalid HTML), and a
 * full-bleed absolutely-positioned <Link> sits behind the controls. The
 * Play/Reset buttons are siblings of (not children of) the Link, so
 * clicking a button never navigates.
 */
export function Hero3DPreview() {
  const sim = useSimulation(DEFAULTS);
  const { play } = sim;
  const hasMounted = useHasMounted();
  const reducedMotion = useReducedMotion();
  const shouldRender = hasMounted && !reducedMotion;

  useEffect(() => {
    if (shouldRender) {
      play();
    }
    // play is stable (useCallback with [] inside useSimulation), so this
    // effect re-runs only when shouldRender flips true post-hydration.
  }, [shouldRender, play]);

  if (!shouldRender) {
    return null;
  }

  return (
    <div
      data-hero-3d-preview
      data-href={HERO_PREVIEW_LAB_HREF}
      className="group relative block aspect-[4/3] w-full overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-[oklch(0.78_0.15_192/0.08)] via-[oklch(0.96_0.02_192/0.4)] to-[oklch(0.82_0.17_75/0.06)] shadow-[0_0_0_1px_oklch(0.45_0.12_192/0.18),0_30px_60px_-25px_oklch(0.45_0.12_192/0.45)] transition-shadow duration-300 hover:shadow-[0_0_0_1px_oklch(0.45_0.12_192/0.3),0_36px_72px_-22px_oklch(0.45_0.12_192/0.55)] md:aspect-[5/4]"
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

      {/* Background link — covers the whole card so any click on the canvas
          navigates, while interactive controls (siblings, higher z-index)
          retain their own click semantics. Drag-to-rotate inside the canvas
          doesn't navigate because the browser only fires `click` when
          mousedown+mouseup land within ~5px. */}
      <Link
        href={HERO_PREVIEW_LAB_HREF}
        onClick={() => track("hero_3d_preview_click", { target: "projectile-motion" })}
        aria-label="Open the Projectile Motion lab"
        className="absolute inset-0 z-10 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 motion-safe:focus-visible:ring-offset-background"
      />

      {/* Top-left live badge */}
      <div className="pointer-events-none absolute left-4 top-4 z-20 flex items-center gap-1.5 rounded-full bg-background/70 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground backdrop-blur-sm">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[oklch(0.65_0.18_145)]" />
        Live physics · drag to rotate
      </div>

      {/* Top-right click affordance — always faintly visible, brightens on hover */}
      <div className="pointer-events-none absolute right-4 top-4 z-20 flex items-center gap-1 rounded-full bg-primary/85 px-2.5 py-1 text-[11px] font-medium text-primary-foreground shadow-md transition-all duration-200 group-hover:bg-primary group-hover:shadow-lg group-hover:translate-x-[-2px]">
        <span>Open this lab</span>
        <ArrowUpRight className="h-3 w-3" aria-hidden />
      </div>

      <div className="absolute inset-x-0 bottom-0 z-20 flex items-center justify-between gap-2 bg-gradient-to-t from-background/85 to-transparent px-4 py-3">
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
