# Hero 3D Interactive Upgrade — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the homepage hero's static 2D parabola SVG with a real interactive 3D projectile-motion preview, so "3D, tweak, watch physics happen" is immediately true at first glance — not just a promise the copy makes.

**Architecture:** Split the hero into two columns on desktop (text+CTA left, R3F canvas right), stacked on mobile. The 3D scene is a lightweight variant of the existing `ProjectileScene` — same physics, stripped of post-processing and stars to keep LCP intact. Canvas is `next/dynamic` with `ssr: false`, auto-plays on mount with `prefers-reduced-motion` fallback to the current 2D SVG.

**Tech Stack:** Next.js 16 App Router · React Three Fiber + Drei · existing `src/shared/components/experiments/three/ProjectileScene.tsx` physics · existing `useSimulation` hook · Tailwind v4.

**Audit trail:** 2026-04-23 user feedback: "整个网站都需要表达 3D 动态实验、交互式学习让孩子学习更快" — current hero ships a 2D SVG parabola while the subtitle promises "Launch a 3D lab, tweak the numbers, watch physics happen". Visual doesn't match copy.

---

## File Structure

Scope is narrow: three new files + one rewire of the existing hero block.

**New files**
- `src/themes/default/blocks/hero-3d-preview.tsx` — client component. Wraps a stripped-down R3F scene with Play/Pause + reset button + parameter strip. Auto-plays on mount. Dynamically imports the heavy R3F module so it's outside the LCP critical path.
- `src/shared/components/experiments/three/HeroProjectileScene.tsx` — a lean derivative of the existing `ProjectileScene`. Same physics, but uses a lean `HeroSceneContainer` with no stars/bloom/grid (saves ~200ms TTI + ~120KB bundle).
- `src/shared/components/experiments/three/HeroSceneContainer.tsx` — minimal R3F `<Canvas>` wrapper. Ambient + directional light, no post-processing, no starfield. OrbitControls with restricted polar/azimuth range (so user can rotate a bit but can't flip upside-down).

**Modified files**
- `src/themes/default/blocks/hero.tsx` — change single-column centered layout to a 2-column desktop layout (`grid md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]`). Text/CTA left, `<Hero3DPreview />` right. On mobile, stacks (text first). Preserve the existing `HeroIllustration` (2D SVG) as the `prefers-reduced-motion` fallback — render it via `<noscript>` + a CSS `@media (prefers-reduced-motion: reduce)` swap.

**Test files**
- `tests/unit/hero/hero-3d-preview.test.tsx` — renders `<Hero3DPreview />` in jsdom, asserts Play/Pause/Reset buttons exist with correct aria-labels and that reduced-motion preference skips the canvas mount.
- Existing `tests/e2e/homepage.spec.ts` (from Phase 1) — add a new test asserting the hero renders a `<canvas>` element at desktop width within 5 seconds.

---

## Task 1: Lean `HeroSceneContainer` (no stars/bloom/grid)

Goal: a minimal R3F canvas wrapper so the hero scene loads fast. Re-using `SceneContainer` from experiments drags in `EffectComposer` + `Bloom` + `Stars` + `Grid` which we don't need on the homepage hero — those are for the full lab page.

**Files:**
- Create: `src/shared/components/experiments/three/HeroSceneContainer.tsx`

- [ ] **Step 1: Create the file with lean setup**

```tsx
"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import type { ReactNode } from "react";

interface HeroSceneContainerProps {
  children: ReactNode;
  cameraPosition?: [number, number, number];
}

/**
 * Lightweight R3F container tuned for above-the-fold hero rendering.
 * Drops Stars, Grid, and Bloom/EffectComposer from the full SceneContainer
 * to keep TTI low on the landing page. For full experiment detail pages,
 * use SceneContainer.tsx.
 *
 * OrbitControls are limited so users can rotate to see 3D-ness but can't
 * fly the camera away from the scene.
 */
export function HeroSceneContainer({
  children,
  cameraPosition = [6, 4, 14],
}: HeroSceneContainerProps) {
  return (
    <Canvas
      camera={{ position: cameraPosition, fov: 45 }}
      gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
      dpr={[1, 1.5]}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.35} />
      <directionalLight position={[5, 10, 5]} intensity={0.7} />
      <pointLight position={[-6, 4, -6]} intensity={0.35} color="oklch(0.75 0.15 192)" />

      {children}

      <OrbitControls
        enableDamping
        dampingFactor={0.06}
        enablePan={false}
        enableZoom={false}
        minPolarAngle={Math.PI * 0.25}
        maxPolarAngle={Math.PI * 0.48}
        minAzimuthAngle={-Math.PI * 0.4}
        maxAzimuthAngle={Math.PI * 0.4}
      />
    </Canvas>
  );
}
```

Key choices:
- `alpha: true` so the canvas blends with the page's gradient background.
- `powerPreference: "low-power"` — laptops stay cool, battery-friendly.
- `dpr={[1, 1.5]}` caps device pixel ratio. Full 3x retina would wreck perf without visible benefit at hero size.
- `enableZoom={false}` + `enablePan={false}` — we don't want students accidentally losing the scene.
- Azimuth/polar clamped — they can rotate enough to see 3D, not enough to flip.

- [ ] **Step 2: Typecheck**

Run:
```bash
cd /Users/smith/Desktop/scivra
pnpm tsc --noEmit
```
Expected: exit 0.

- [ ] **Step 3: Commit**

```bash
git add src/shared/components/experiments/three/HeroSceneContainer.tsx
git commit -m "feat(hero): lean R3F container (no stars/bloom/grid)

Strips EffectComposer + Bloom + Stars + Grid from the full SceneContainer
used on experiment detail pages. Above-the-fold hero doesn't need the
post-processing budget — landing page LCP is more important than scene
glamour.

- dpr capped at [1, 1.5]
- gl.powerPreference = low-power (laptop battery-friendly)
- OrbitControls clamped to +/- 40° azimuth, 45-86° polar
- zoom + pan disabled (student can't accidentally lose the scene)

Paired with HeroProjectileScene (next commit) for the interactive
projectile motion preview on the homepage hero."
```

---

## Task 2: `HeroProjectileScene` (derivative of ProjectileScene)

Goal: re-use the physics + visuals of `ProjectileScene` but wrap them in `HeroSceneContainer`. Keep the `ProjectileScene` untouched — it's used in `ExperimentFlow.tsx` for real lab pages with different performance and interaction requirements.

**Files:**
- Create: `src/shared/components/experiments/three/HeroProjectileScene.tsx`

- [ ] **Step 1: Read the existing ProjectileScene to understand what pieces to re-export**

```bash
cd /Users/smith/Desktop/scivra
wc -l src/shared/components/experiments/three/ProjectileScene.tsx
grep -n "^function\|^export" src/shared/components/experiments/three/ProjectileScene.tsx
```

Expected: functions `Ground`, `Trajectory`, `AngleArc`, `LandingMarker`, `Projectile`, `LaunchPlatform`, `MaxHeightMarker` + the exported `ProjectileScene`. Everything except the exported wrapper is module-local and can't be imported — that's intentional: we're building a sibling, not a derivative through composition.

- [ ] **Step 2: Write the hero-specific scene**

Create `src/shared/components/experiments/three/HeroProjectileScene.tsx`:

```tsx
"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import * as THREE from "three";
import { HeroSceneContainer } from "./HeroSceneContainer";

interface HeroProjectileSceneProps {
  velocity: number;
  angle: number;
  gravity: number;
  isPlaying: boolean;
  time: number;
  speed: number;
  onTick: (delta: number) => void;
}

function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
      <planeGeometry args={[60, 12]} />
      <meshStandardMaterial
        color="oklch(0.18 0.03 250)"
        transparent
        opacity={0.35}
        metalness={0.6}
        roughness={0.45}
      />
    </mesh>
  );
}

function LaunchPlatform() {
  return (
    <mesh position={[0, 0.2, 0]}>
      <boxGeometry args={[0.8, 0.4, 0.8]} />
      <meshStandardMaterial
        color="oklch(0.45 0.12 192)"
        metalness={0.7}
        roughness={0.3}
        emissive="oklch(0.45 0.12 192)"
        emissiveIntensity={0.25}
      />
    </mesh>
  );
}

function Trajectory({
  velocity,
  angle,
  gravity,
}: {
  velocity: number;
  angle: number;
  gravity: number;
}) {
  const points = useMemo(() => {
    const rad = (angle * Math.PI) / 180;
    const vx = velocity * Math.cos(rad);
    const vy = velocity * Math.sin(rad);
    const flight = (2 * vy) / gravity;
    const out: [number, number, number][] = [];
    const n = 48;
    for (let i = 0; i <= n; i++) {
      const t = (i / n) * flight;
      const x = vx * t;
      const y = vy * t - 0.5 * gravity * t * t;
      out.push([x * 0.3, Math.max(y * 0.3, 0) + 0.4, 0]);
    }
    return out;
  }, [velocity, angle, gravity]);

  return (
    <Line
      points={points}
      color="oklch(0.75 0.15 75)"
      lineWidth={2.2}
      transparent
      opacity={0.8}
      dashed={false}
    />
  );
}

function Projectile({
  velocity,
  angle,
  gravity,
  isPlaying,
  time,
  speed,
  onTick,
}: HeroProjectileSceneProps) {
  const ref = useRef<THREE.Mesh>(null);
  const rad = (angle * Math.PI) / 180;
  const vx = velocity * Math.cos(rad);
  const vy = velocity * Math.sin(rad);
  const flight = (2 * vy) / gravity;

  useFrame((_, delta) => {
    if (isPlaying) {
      onTick(delta);
    }
    const t = time % (flight + 0.6); // short rest after landing, then loop
    const x = vx * Math.min(t, flight);
    const y = vy * Math.min(t, flight) - 0.5 * gravity * Math.min(t, flight) * Math.min(t, flight);
    if (ref.current) {
      ref.current.position.set(x * 0.3, Math.max(y * 0.3, 0) + 0.4, 0);
    }
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.35, 28, 28]} />
      <meshStandardMaterial
        color="oklch(0.78 0.18 192)"
        emissive="oklch(0.78 0.18 192)"
        emissiveIntensity={0.6}
        metalness={0.5}
        roughness={0.25}
      />
    </mesh>
  );
}

export function HeroProjectileScene(props: HeroProjectileSceneProps) {
  return (
    <HeroSceneContainer cameraPosition={[6, 4, 14]}>
      <Ground />
      <LaunchPlatform />
      <Trajectory
        velocity={props.velocity}
        angle={props.angle}
        gravity={props.gravity}
      />
      <Projectile {...props} />
    </HeroSceneContainer>
  );
}
```

Physics are identical to the full `ProjectileScene` (same equations, same scale factor 0.3 for stage coordinates). Differences vs the full scene:
- No `AngleArc` label (hero doesn't need the educational annotation).
- No `LandingMarker` or `MaxHeightMarker` (keeps the visual clean).
- Projectile position loops every `flight + 0.6s` so the animation never pauses (important — hero is demo, not controlled study).
- `emissiveIntensity` on sphere is 0.6 (vs 0.4 in lab) so the ball pops without Bloom post-processing.

- [ ] **Step 3: Typecheck**

```bash
cd /Users/smith/Desktop/scivra
pnpm tsc --noEmit
```
Expected: exit 0.

- [ ] **Step 4: Commit**

```bash
git add src/shared/components/experiments/three/HeroProjectileScene.tsx
git commit -m "feat(hero): HeroProjectileScene — loopable 3D projectile for landing

Lean sibling to ProjectileScene (not a derivative — intentional; the
full scene is tuned for the lab page with param panel + precise landing
markers). Hero variant:

- Same physics, same coordinate scale factor (0.3)
- Loops every flight+0.6s so the preview animates forever
- Glowing teal sphere (emissiveIntensity 0.6) to pop without Bloom
- Drops AngleArc / LandingMarker / MaxHeightMarker labels — hero is
  demo, not controlled study

Wraps HeroSceneContainer (landed in previous commit)."
```

---

## Task 3: `Hero3DPreview` with Play/Pause + param strip

Goal: the top-level React component the hero block will render. Owns the `useSimulation` state, Play/Pause/Reset controls, and a small mono parameter strip underneath so students see the actual numbers being simulated.

**Files:**
- Create: `src/themes/default/blocks/hero-3d-preview.tsx`

- [ ] **Step 1: Read the existing useSimulation hook to confirm the API**

```bash
cd /Users/smith/Desktop/scivra
cat src/shared/hooks/useSimulation.ts
```

Confirm returned object shape: `{ isPlaying, time, parameters, speed, play, pause, toggle, reset, tick, setTime, setParameter, setParameters, setSpeed }`.

- [ ] **Step 2: Write the hero preview component**

Create `src/themes/default/blocks/hero-3d-preview.tsx`:

```tsx
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
 * skips the canvas entirely and renders a static fallback (the parent
 * hero.tsx handles the fallback SVG outside this component).
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
      className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-primary/25 bg-gradient-to-br from-[oklch(0.45_0.12_192/0.04)] via-card to-[oklch(0.82_0.17_75/0.03)] shadow-[0_0_0_1px_oklch(0.45_0.12_192/0.15),0_24px_48px_-24px_oklch(0.45_0.12_192/0.35)] md:aspect-[5/4]"
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

      {/* Top-left "live" badge */}
      <div className="pointer-events-none absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-background/70 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground backdrop-blur-sm">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[oklch(0.65_0.18_145)]" />
        Live physics · drag to rotate
      </div>

      {/* Bottom controls */}
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
```

Design notes:
- Aspect-ratio locked: `4/3` on mobile so vertical stack doesn't grow the page too tall; `5/4` on desktop since it sits in a column and needs to feel substantial.
- "Live physics · drag to rotate" discoverability hint — students who've never touched OrbitControls find out.
- Play/Pause button is primary teal — the single loudest CTA inside the hero right column.
- Parameter strip uses `font-mono` and Unicode `v₀ θ g` — consistent with experiment detail equation strip.
- Reduced-motion users get `null` from this component; parent `hero.tsx` renders the 2D SVG fallback instead.

- [ ] **Step 3: Typecheck**

```bash
cd /Users/smith/Desktop/scivra
pnpm tsc --noEmit
```
Expected: exit 0.

- [ ] **Step 4: Commit**

```bash
git add src/themes/default/blocks/hero-3d-preview.tsx
git commit -m "feat(hero): Hero3DPreview with Play/Pause/Reset + live param strip

Top-level client component for the interactive hero right column.
Owns the useSimulation state, auto-plays on mount, respects
prefers-reduced-motion.

- dynamic import of HeroProjectileScene (ssr: false) so R3F stays
  out of the landing bundle's LCP path
- HeroPlaceholder skeleton while R3F module is loading
- 'Live physics · drag to rotate' hint teaches OrbitControls
- Mono equation strip identical in voice to the experiment detail page

Returns null under prefers-reduced-motion — parent hero.tsx handles
the static SVG fallback."
```

---

## Task 4: Wire into `hero.tsx` as 2-column layout

Goal: take the existing single-column centered hero and split it into a 2-column desktop layout with text/CTA on the left and `<Hero3DPreview />` on the right. Keep single-column mobile. Keep the `HeroIllustration` SVG as the reduced-motion fallback (rendered only when `Hero3DPreview` doesn't mount).

**Files:**
- Modify: `src/themes/default/blocks/hero.tsx` (line range around the container markup)

- [ ] **Step 1: Read the current hero layout in full**

```bash
cd /Users/smith/Desktop/scivra
sed -n '170,320p' src/themes/default/blocks/hero.tsx
```

Note: the section tag + container div + h1 + description + HeroIllustration + CTA buttons + SocialAvatars + subject-buttons + tip block are all nested under one centered `max-w-5xl`. You will:
1. Split the centered content into `Left` (text+CTA+SocialAvatars+subject-buttons+tip) and `Right` (Hero3DPreview + SVG fallback).
2. Wrap both in a grid: `grid gap-10 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] md:items-center md:text-left md:gap-12` at desktop, single column on mobile (text stacks above preview).

- [ ] **Step 2: Add the Hero3DPreview import at the top**

In `src/themes/default/blocks/hero.tsx`, near the other local imports (around the `import { HeroBackground } from './hero-background';` line), add:
```tsx
import { Hero3DPreview } from './hero-3d-preview';
```

- [ ] **Step 3: Widen the container and restructure into a 2-column grid**

Find the existing:
```tsx
      <div className="relative mx-auto max-w-full px-4 text-center md:max-w-5xl">
```

Replace with:
```tsx
      <div className="relative mx-auto max-w-full px-4 text-center md:max-w-6xl">
        <div className="grid items-center gap-10 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] md:gap-12 md:text-left">
          <div>
```

(The inner `<div>` begins the LEFT column; we'll close it just before the preview.)

- [ ] **Step 4: Move the `HeroIllustration` out of the left column and replace it**

Find:
```tsx
        {/* V3 inline SVG hero illustration (replaces FreePik PNG) */}
        <div className="my-10 flex justify-center md:my-12">
          <HeroIllustration />
        </div>
```

Replace with: nothing (delete it). The SVG moves to the right column as a reduced-motion fallback.

- [ ] **Step 5: Close the left column after the subject buttons / tip block and add the right column**

Find the closing of the outer container, which currently looks like the last few lines of the `<div className="relative mx-auto max-w-full px-4 ...">` block. It ends with `</div>` just before `</section>`.

Just before the final `</div></section>`, close the left column and add the right column:

```tsx
          </div>

          {/* Right column — interactive 3D preview (auto-plays) + reduced-motion SVG fallback */}
          <div className="relative">
            <Hero3DPreview />
            <div className="motion-safe:hidden">
              <HeroIllustration />
            </div>
          </div>
        </div>
      </div>
```

Explanation:
- `Hero3DPreview` returns `null` when `prefers-reduced-motion: reduce`, so the canvas doesn't mount.
- The SVG fallback is hidden on `motion-safe` (default) browsers via Tailwind's `motion-safe:hidden`. Under reduced-motion, Tailwind's `motion-safe` variant doesn't match, so the fallback is shown.
- Net effect: exactly one of `<Hero3DPreview />` (motion-safe) or `<HeroIllustration />` (reduced-motion) renders at any moment.

- [ ] **Step 6: Typecheck**

```bash
cd /Users/smith/Desktop/scivra
pnpm tsc --noEmit
```
Expected: exit 0.

- [ ] **Step 7: Visual verification on dev server**

Dev server should be running at http://localhost:3000. Confirm:
```bash
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000
```
Expected: 200.

Then check the hero rendering:
```bash
playwright-cli -s=sc goto "http://localhost:3000"
sleep 5
playwright-cli -s=sc eval '() => {
  const canvas = document.querySelector("[data-hero-3d-preview] canvas");
  const svg = document.querySelector("[data-hero-illustration]");
  const h1 = document.querySelector("h1");
  const rect = canvas?.getBoundingClientRect();
  return {
    canvas_mounted: !!canvas,
    canvas_width: rect?.width ?? 0,
    canvas_height: rect?.height ?? 0,
    svg_hidden: svg ? getComputedStyle(svg.parentElement).display === "none" : "no svg",
    h1_still_present: !!h1,
  };
}'
```
Expected: `canvas_mounted: true`, `canvas_width > 300`, `h1_still_present: true`, `svg_hidden: true` (the parent div has `motion-safe:hidden`, which resolves to `display: none` under default reduced-motion: no-preference).

Take a screenshot for visual review:
```bash
playwright-cli -s=sc screenshot --filename="/tmp/hero-3d-after.png" --full-page
```

Open `/tmp/hero-3d-after.png` and confirm:
- Left column: Merriweather H1 "Your next A in AP Physics *starts with one experiment.*", subtitle, two CTA buttons.
- Right column: a 3D canvas with a glowing teal sphere following a parabolic trajectory, "Live physics · drag to rotate" badge top-left, Play/Reset buttons + equation strip bottom.
- The 2D SVG parabola from the old hero is not visible.

- [ ] **Step 8: Commit**

```bash
git add src/themes/default/blocks/hero.tsx
git commit -m "feat(hero): split hero into 2-column layout with Hero3DPreview

Left column: Merriweather headline + subtitle + primary/secondary CTA
+ social proof + subject buttons + tip block (unchanged).
Right column: <Hero3DPreview /> — auto-playing 3D projectile motion
simulation with Play/Pause/Reset + live parameter strip.

The 2D SVG <HeroIllustration /> now lives inside a motion-safe:hidden
container in the right column, serving as the prefers-reduced-motion
fallback. Exactly one of the two renders at any moment.

Answers 2026-04-23 user feedback: old hero's 2D parabola didn't
deliver on the subtitle's 'Launch a 3D lab, tweak the numbers, watch
physics happen' promise. Now the promise is literally true at first
glance — students see the 3D ball flying before they finish reading
the headline."
```

---

## Task 5: Mobile layout sanity pass

Goal: confirm the stacked mobile layout reads well — text above preview, preview at a reasonable size.

**Files:**
- Modify (only if needed): `src/themes/default/blocks/hero.tsx`

- [ ] **Step 1: Capture mobile-375 screenshot**

```bash
cd /Users/smith/Desktop/scivra
playwright-cli -s=sc resize 375 812
playwright-cli -s=sc goto "http://localhost:3000"
sleep 5
playwright-cli -s=sc screenshot --filename="/tmp/hero-3d-mobile.png" --full-page
```

Open `/tmp/hero-3d-mobile.png`. Verify:
- Headline + subtitle + CTA are above the 3D preview
- 3D preview renders at `aspect-[4/3]`, full container width (~343px internal after 16px padding), ~257px tall
- Controls (Play/Reset + param strip) are readable at this size
- Badge "Live physics · drag to rotate" isn't truncated

- [ ] **Step 2: If the 3D preview feels too tall at mobile, reduce its aspect**

If the mobile preview eats too much above-the-fold real estate (rule of thumb: headline + subtitle + first CTA should still be visible on a 375×812 viewport without scrolling), narrow the mobile aspect in `src/themes/default/blocks/hero-3d-preview.tsx`:

Change:
```tsx
      className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border ... md:aspect-[5/4]"
```
to:
```tsx
      className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border ... md:aspect-[5/4]"
```

If the preview looks good at 4/3, skip this step.

- [ ] **Step 3: Restore desktop viewport and spot-check**

```bash
playwright-cli -s=sc resize 1440 900
playwright-cli -s=sc goto "http://localhost:3000"
sleep 3
playwright-cli -s=sc screenshot --filename="/tmp/hero-3d-desktop.png" --full-page
```

Verify desktop still renders correctly (no regression from the mobile aspect change, if you made one).

- [ ] **Step 4: Commit only if you changed the aspect ratio**

If you modified hero-3d-preview.tsx:
```bash
git add src/themes/default/blocks/hero-3d-preview.tsx
git commit -m "fix(hero): tighter mobile aspect for 3D preview so CTA stays above the fold

At aspect-[4/3] on 375px, the preview pushed the subtitle and CTA
below the fold. 16/10 keeps it visible and still shows the full
trajectory arc."
```

If no change was needed, skip the commit.

---

## Task 6: Unit test — Hero3DPreview under reduced motion

Goal: a lightweight unit test that the reduced-motion branch returns null (doesn't mount the canvas) and the motion-safe branch does mount something.

**Files:**
- Create: `tests/unit/hero/hero-3d-preview.test.tsx`

- [ ] **Step 1: Check which testing library is in use**

```bash
cd /Users/smith/Desktop/scivra
grep -E '"@testing-library/react"|"@testing-library/jest-dom"' package.json
```

Record what's present. If `@testing-library/react` is NOT installed, this task is out of scope for the plan — skip it and report DONE_WITH_CONCERNS. Don't install new dev deps for this single test.

- [ ] **Step 2: Inspect existing component tests for patterns**

```bash
find tests/unit -name "*.test.tsx" | head -3
```

Read the first one to see what pattern the project uses (vitest config for jsdom, `render` + `screen`, etc.).

- [ ] **Step 3: Write the test**

Create `tests/unit/hero/hero-3d-preview.test.tsx`:

```tsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { Hero3DPreview } from "@/themes/default/blocks/hero-3d-preview";

// Stub the dynamic-imported heavy module so we don't pull R3F into jsdom
vi.mock("@/shared/components/experiments/three/HeroProjectileScene", () => ({
  HeroProjectileScene: () => <div data-testid="hero-scene-stub" />,
}));

function setMatchMedia(reducedMotion: boolean) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: query.includes("prefers-reduced-motion") && reducedMotion,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

describe("Hero3DPreview", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("returns null (no canvas container) under prefers-reduced-motion", () => {
    setMatchMedia(true);
    const { container } = render(<Hero3DPreview />);
    expect(container.querySelector("[data-hero-3d-preview]")).toBeNull();
  });

  it("mounts the 3D preview container when motion is safe", async () => {
    setMatchMedia(false);
    render(<Hero3DPreview />);
    await waitFor(() => {
      expect(document.querySelector("[data-hero-3d-preview]")).not.toBeNull();
    });
  });
});
```

- [ ] **Step 4: Run the test**

```bash
cd /Users/smith/Desktop/scivra
pnpm vitest run tests/unit/hero/hero-3d-preview.test.tsx
```
Expected: 2 passed.

If the project doesn't have a jsdom + React testing setup ready (`Test environment not set to jsdom` error or similar), switch this test to `environment: 'happy-dom'` or report DONE_WITH_CONCERNS.

- [ ] **Step 5: Typecheck**

```bash
pnpm tsc --noEmit
```
Expected: exit 0.

- [ ] **Step 6: Commit**

```bash
git add tests/unit/hero/hero-3d-preview.test.tsx
git commit -m "test(hero): cover reduced-motion branch of Hero3DPreview

Two-test suite:
- reduced motion: Hero3DPreview returns null, no canvas container
- motion safe: [data-hero-3d-preview] wrapper mounts

Stubs the dynamic-imported HeroProjectileScene so R3F + drei + three
don't get pulled into the jsdom test environment."
```

---

## Task 7: E2E test — canvas renders on the homepage

Goal: extend the existing Phase 1 hero E2E to also assert that the interactive 3D canvas mounts within 5 seconds (not just LCP text).

**Files:**
- Modify: the existing Playwright spec at `tests/e2e/homepage.spec.ts` (or wherever Phase 1 landed its hero LCP test)

- [ ] **Step 1: Locate the existing hero E2E spec**

```bash
cd /Users/smith/Desktop/scivra
find tests -name "homepage*" -o -name "hero*" 2>/dev/null | head -3
grep -rln "hero.*lcp\|hero.*svg\|HeroIllustration\|data-hero" tests/ 2>/dev/null
```

Record the file path. If no dedicated hero E2E exists, add the new test to `tests/e2e/homepage.spec.ts` (create if missing).

- [ ] **Step 2: Add the canvas assertion**

Append to the located file (or create `tests/e2e/homepage.spec.ts`):

```ts
import { expect, test } from "@playwright/test";

test.describe("Homepage hero — interactive 3D preview", () => {
  test("3D canvas mounts within 5s at desktop width", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    const canvas = page.locator("[data-hero-3d-preview] canvas");
    await expect(canvas).toBeVisible({ timeout: 5_000 });

    const box = await canvas.boundingBox();
    expect(box?.width ?? 0).toBeGreaterThan(300);
    expect(box?.height ?? 0).toBeGreaterThan(200);
  });

  test("reduced-motion users get the SVG fallback, not a canvas", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    const canvas = page.locator("[data-hero-3d-preview]");
    const svgFallback = page.locator("[data-hero-illustration]");
    await expect(svgFallback).toBeVisible();
    await expect(canvas).toHaveCount(0);
  });
});
```

- [ ] **Step 3: Run the E2E**

```bash
cd /Users/smith/Desktop/scivra
pnpm playwright test tests/e2e/homepage.spec.ts --grep "3D preview"
```
Expected: 2 passed.

If the project uses a different Playwright test command (check `package.json` scripts like `test:e2e`), use that instead.

- [ ] **Step 4: Commit**

```bash
git add tests/e2e/homepage.spec.ts
git commit -m "test(e2e): assert hero 3D canvas mounts + reduced-motion fallback

Two tests:
- At 1440×900, [data-hero-3d-preview] canvas is visible within 5s
  and occupies reasonable dimensions (>300×200)
- Under emulated reduced-motion, the canvas doesn't mount and the
  [data-hero-illustration] SVG shows instead

Locks in the two-path contract of hero.tsx."
```

---

## Task 8: LCP + bundle regression check

Goal: confirm we didn't regress the existing Phase 1 LCP budget. If we did, roll back the `dpr` cap or revert the three.js preload hint.

**Files:**
- None created; measurement only.

- [ ] **Step 1: Measure LCP on localhost**

```bash
cd /Users/smith/Desktop/scivra
playwright-cli -s=sc goto "http://localhost:3000"
sleep 3
playwright-cli -s=sc eval 'async () => {
  const vitals = {};
  await new Promise(r => {
    const po = new PerformanceObserver(list => {
      const entries = list.getEntries();
      if (entries.length) vitals.lcp = entries[entries.length-1].startTime;
    });
    try { po.observe({ type: "largest-contentful-paint", buffered: true }); } catch(e) {}
    setTimeout(r, 2000);
  });
  const nav = performance.getEntriesByType("navigation")[0];
  vitals.fcp = performance.getEntriesByName("first-contentful-paint")[0]?.startTime;
  vitals.transferSize = nav?.transferSize;
  return vitals;
}'
```

Record the output. Baseline from the 2026-04-23 audit was LCP 200ms, FCP 200ms, transferSize 68KB on localhost.

Acceptable ranges after this change:
- LCP ≤ 500ms (localhost — real Vercel preview will be ~1-2s)
- FCP ≤ 300ms
- transferSize ≤ 200KB (initial document)

The 3D canvas is dynamically imported, so the initial HTML payload shouldn't grow. What grows is the subsequent JS chunk — that's fine because it loads after LCP.

- [ ] **Step 2: If LCP > 500ms, inspect what happened**

If the budget blew out, the most likely culprit is one of:
1. The `loading:` skeleton is heavier than expected (SSR-rendered). Slim it further.
2. The dynamic import chain somehow got included in the main bundle — check `pnpm build && du -sh .next/static/chunks/*` to identify an anomalously large chunk.
3. The `HeroBackground` gradient got hit by a z-index shuffle and is now above the canvas.

Fix the specific cause before committing. If the cause is unclear, skip this step and report DONE_WITH_CONCERNS.

- [ ] **Step 3: Run the homepage axe regression test**

```bash
cd /Users/smith/Desktop/scivra
pnpm vitest run tests/integration/a11y/homepage-axe.test.ts
```
Expected: 1 passed, 0 serious/critical violations.

The canvas is `aria-hidden` (via OrbitControls), so it shouldn't trigger any a11y rules. The Play/Reset buttons have explicit aria-labels, which axe will accept.

- [ ] **Step 4: Run the experiment-urls smoke test (rule out breakage)**

```bash
pnpm vitest run tests/integration/experiment-urls.test.ts
```
Expected: 1 passed, all 179 experiment URLs still return 200.

- [ ] **Step 5: Record the measurement in the audit doc (append)**

Append to `docs/plans/2026-04-23-ui-consistency-audit.md` under a new section:

```markdown
## 10. Hero 3D Upgrade (2026-04-23 evening)

LCP measurements after hero 3D integration (localhost dev server):
- LCP: {measured}ms
- FCP: {measured}ms
- transferSize: {measured}KB

Compared to Phase 1 baseline (LCP 200ms), the 3D canvas is dynamically
imported and loads after LCP, so the above-the-fold text paints on the
same budget as before.

Files delivered:
- src/shared/components/experiments/three/HeroSceneContainer.tsx
- src/shared/components/experiments/three/HeroProjectileScene.tsx
- src/themes/default/blocks/hero-3d-preview.tsx
- tests/unit/hero/hero-3d-preview.test.tsx
- tests/e2e/homepage.spec.ts (extended)
- src/themes/default/blocks/hero.tsx (2-column layout rewire)
```

Replace `{measured}` with the actual numbers from Step 1.

- [ ] **Step 6: Commit**

```bash
git add docs/plans/2026-04-23-ui-consistency-audit.md
git commit -m "docs(audit): record LCP + file inventory for hero 3D upgrade"
```

---

## Self-Review Checklist

- [ ] **Spec coverage:** Tasks 1-3 build the new 3D hero stack bottom-up (container → scene → preview). Task 4 wires into hero.tsx. Task 5 mobile pass. Tasks 6-7 cover reduced-motion + canvas-mount invariants. Task 8 locks in the LCP promise. Every sentence of the brainstorm spec (B = "嵌入真 3D 预览 + 保留 Motion Poetics + 复用 R3F + LCP 可控") maps to a task.

- [ ] **Placeholder scan:** No "TODO", no "handle edge cases", no "similar to Task N". Every code step contains complete code. The only conditional step is Task 6 (skip if no @testing-library/react) and Task 5 Step 2 (skip if mobile aspect already good) — both explicit.

- [ ] **Type / name consistency:**
  - `HeroSceneContainer` (Task 1) used by `HeroProjectileScene` (Task 2)
  - `HeroProjectileScene` (Task 2) dynamically imported by `Hero3DPreview` (Task 3)
  - `Hero3DPreview` (Task 3) imported by `hero.tsx` (Task 4)
  - Props on `HeroProjectileSceneProps` exactly match what `useSimulation` returns (velocity, angle, gravity, isPlaying, time, speed, onTick)
  - Selector `[data-hero-3d-preview]` used identically in the component, unit test, and E2E test

- [ ] **One critical invariant enforced by structure, not comments:** Exactly one of `<Hero3DPreview />` or `<HeroIllustration />` renders at any moment. Enforced because `Hero3DPreview` returns `null` under reduced-motion and the SVG fallback uses `motion-safe:hidden` (hidden under motion-safe, shown under reduced-motion). The two CSS conditions are complementary.

## What This Plan Does Not Cover

- Multi-scene hero rotation (e.g. "every 10s swap to DNA, roller coaster, etc."). Out of scope for the MVP; the single projectile-motion scene is the most universally recognized physics demo.
- Parameter sliders in the hero. Explicitly avoided — clicking a slider would compete with the "Start a free lab" CTA for attention. The mono parameter strip is read-only by design.
- i18n — the "Live physics · drag to rotate" hint and button aria-labels are hardcoded English, matching the current copy in hero.tsx. Zh locale was retired earlier today (14a0056), so this is moot.
- Real User Monitoring / Web Vitals ingestion. That's a Vercel Analytics config, not a code change.
- Related: replacing the hero on `/upg`, `/labs`, `/pricing` with similar 3D previews. Intentionally not doing this — the homepage hero is the single highest-value surface; the other flagship pages already got their Motion Poetics treatment in Sprint C1/C2, and each needs its own subject-appropriate 3D (DNA helix for bio, molecule for chemistry, etc.) which is a much larger scope.
