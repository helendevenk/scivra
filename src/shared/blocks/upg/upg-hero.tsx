export function UpgHero() {
  return (
    <section
      aria-label="UPG hero"
      className="relative overflow-hidden px-4 pb-10 pt-16 md:pb-16 md:pt-24"
    >
      <div className="mx-auto max-w-5xl text-center">
        <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          AI Lab · Max plan
        </p>

        <h1 className="mb-6 font-serif text-4xl font-semibold leading-[1.05] tracking-tight text-foreground md:text-6xl lg:text-7xl">
          <span className="italic">Describe it.</span>{" "}
          <span className="relative inline-block">
            AI builds it.
            <span
              aria-hidden
              className="absolute inset-x-0 -bottom-1 h-[0.18em] bg-[oklch(0.82_0.17_75)]/70"
            />
          </span>
        </h1>

        <p className="mx-auto mb-8 max-w-2xl text-base text-muted-foreground md:text-lg">
          A sentence in plain English becomes a working 3D simulation you can
          poke, rewind, and hand to a student &mdash; no downloads, no code,
          zero setup.
        </p>

        {/* Animated prompt → output demo */}
        <div
          role="img"
          aria-label="Animated demo: prompt text transforms into a 3D molecule visualization"
          className="mx-auto grid max-w-3xl gap-4 md:grid-cols-[1fr_auto_1fr] md:items-center"
        >
          <div className="rounded-xl border border-primary/20 bg-card/80 p-4 text-left backdrop-blur-sm">
            <p className="mb-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              Prompt
            </p>
            <p className="font-mono text-sm text-foreground">
              Build a VSEPR model of methane
              <span className="ml-0.5 inline-block h-[1em] w-[0.6ch] translate-y-[0.15em] animate-pulse bg-primary align-middle" />
            </p>
          </div>

          <svg
            aria-hidden
            viewBox="0 0 40 24"
            className="mx-auto hidden h-6 w-10 text-primary md:block"
          >
            <path
              d="M2 12 L32 12 M24 6 L34 12 L24 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>

          <div className="rounded-xl border border-primary/30 bg-[oklch(0.45_0.12_192/0.06)] p-4 text-left shadow-[0_0_0_1px_oklch(0.45_0.12_192/0.18),0_20px_40px_-20px_oklch(0.45_0.12_192/0.35)]">
            <p className="mb-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              Output · ~30s
            </p>
            <svg viewBox="0 0 100 60" className="w-full">
              <circle cx="50" cy="30" r="6" fill="currentColor" className="text-primary" />
              <circle cx="20" cy="20" r="4" fill="currentColor" className="text-[oklch(0.82_0.17_75)]" />
              <circle cx="80" cy="20" r="4" fill="currentColor" className="text-[oklch(0.82_0.17_75)]" />
              <circle cx="30" cy="48" r="4" fill="currentColor" className="text-[oklch(0.82_0.17_75)]" />
              <circle cx="70" cy="48" r="4" fill="currentColor" className="text-[oklch(0.82_0.17_75)]" />
              <line x1="50" y1="30" x2="20" y2="20" stroke="currentColor" strokeWidth="1" className="text-muted-foreground" />
              <line x1="50" y1="30" x2="80" y2="20" stroke="currentColor" strokeWidth="1" className="text-muted-foreground" />
              <line x1="50" y1="30" x2="30" y2="48" stroke="currentColor" strokeWidth="1" className="text-muted-foreground" />
              <line x1="50" y1="30" x2="70" y2="48" stroke="currentColor" strokeWidth="1" className="text-muted-foreground" />
            </svg>
          </div>
        </div>

        <p className="mt-6 font-mono text-xs text-muted-foreground">
          Max plan · 200 UPG credits / month · HTML + Three.js output
        </p>
      </div>
    </section>
  );
}
