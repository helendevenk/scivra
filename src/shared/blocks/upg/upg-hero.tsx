export function UpgHero() {
  return (
    <section
      aria-label="UPG hero"
      className="relative overflow-hidden px-4 pt-16 pb-10 md:pt-24 md:pb-16"
    >
      <div className="mx-auto max-w-5xl text-center">
        <p className="text-muted-foreground mb-4 font-mono text-[11px] tracking-[0.18em] uppercase">
          AI Lab · Max plan
        </p>

        <h1 className="text-foreground mb-6 font-serif text-4xl leading-[1.05] font-semibold tracking-tight md:text-6xl lg:text-7xl">
          <span className="italic">Describe it.</span>{' '}
          <span className="relative inline-block">
            AI builds it.
            <span
              aria-hidden
              className="absolute inset-x-0 -bottom-1 h-[0.18em] bg-[oklch(0.82_0.17_75)]/70"
            />
          </span>
        </h1>

        <p className="text-muted-foreground mx-auto mb-8 max-w-2xl text-base md:text-lg">
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
          <div className="border-primary/20 bg-card/80 rounded-xl border p-4 text-left backdrop-blur-sm">
            <p className="text-muted-foreground mb-1 font-mono text-[10px] tracking-wider uppercase">
              Prompt
            </p>
            <p className="text-foreground font-mono text-sm">
              Build a VSEPR model of methane
              <span className="bg-primary ml-0.5 inline-block h-[1em] w-[0.6ch] translate-y-[0.15em] animate-pulse align-middle" />
            </p>
          </div>

          <svg
            aria-hidden
            viewBox="0 0 40 24"
            className="text-primary mx-auto hidden h-6 w-10 md:block"
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

          <div className="border-primary/30 rounded-xl border bg-[oklch(0.45_0.12_192/0.06)] p-4 text-left shadow-[0_0_0_1px_oklch(0.45_0.12_192/0.18),0_20px_40px_-20px_oklch(0.45_0.12_192/0.35)]">
            <p className="text-muted-foreground mb-1 font-mono text-[10px] tracking-wider uppercase">
              Output · ~30s
            </p>
            <svg viewBox="0 0 100 60" className="w-full">
              <circle
                cx="50"
                cy="30"
                r="6"
                fill="currentColor"
                className="text-primary"
              />
              <circle
                cx="20"
                cy="20"
                r="4"
                fill="currentColor"
                className="text-[oklch(0.82_0.17_75)]"
              />
              <circle
                cx="80"
                cy="20"
                r="4"
                fill="currentColor"
                className="text-[oklch(0.82_0.17_75)]"
              />
              <circle
                cx="30"
                cy="48"
                r="4"
                fill="currentColor"
                className="text-[oklch(0.82_0.17_75)]"
              />
              <circle
                cx="70"
                cy="48"
                r="4"
                fill="currentColor"
                className="text-[oklch(0.82_0.17_75)]"
              />
              <line
                x1="50"
                y1="30"
                x2="20"
                y2="20"
                stroke="currentColor"
                strokeWidth="1"
                className="text-muted-foreground"
              />
              <line
                x1="50"
                y1="30"
                x2="80"
                y2="20"
                stroke="currentColor"
                strokeWidth="1"
                className="text-muted-foreground"
              />
              <line
                x1="50"
                y1="30"
                x2="30"
                y2="48"
                stroke="currentColor"
                strokeWidth="1"
                className="text-muted-foreground"
              />
              <line
                x1="50"
                y1="30"
                x2="70"
                y2="48"
                stroke="currentColor"
                strokeWidth="1"
                className="text-muted-foreground"
              />
            </svg>
          </div>
        </div>

        <p className="text-muted-foreground mt-6 font-mono text-xs">
          Max plan includes 200 AI credits/month · 10 credits per generated lab
        </p>
      </div>
    </section>
  );
}
