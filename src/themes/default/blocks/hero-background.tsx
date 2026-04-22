/**
 * Hero background — V3 static texture.
 *
 * Retired the animated atom/cube/sphere/wave/particles composition in favor of a
 * single subtle dotted texture + center glow. Rationale:
 *   - Hero now has an explicit SVG illustration (see hero.tsx HeroIllustration)
 *   - Dark-navy + neon-cyan "motion poetics" identity is carried by the illustration,
 *     not by decorative background noise
 *   - Static background keeps LCP predictable and reduces layout shift
 *
 * See docs/plans/2026-04-22-homepage-visual-overhaul.md §2.4 Task 14.
 */
export function HeroBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-20 overflow-hidden"
    >
      {/* Base gradient — very subtle teal wash, fades out quickly */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.03] via-transparent to-transparent" />

      {/* Dotted texture — 32px grid, low-opacity, references "science paper" feel */}
      <div
        className="absolute inset-0 opacity-[0.5] dark:opacity-[0.35]"
        style={{
          backgroundImage:
            'radial-gradient(circle at center, oklch(0.45 0.12 192 / 0.08) 1px, transparent 1.5px)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* Center glow — matches hero illustration cyan radial accent */}
      <div className="absolute top-1/2 left-1/2 size-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/[0.04] blur-[120px]" />
    </div>
  );
}
