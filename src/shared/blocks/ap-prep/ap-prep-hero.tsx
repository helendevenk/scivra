export function ApPrepHero() {
  return (
    <section
      aria-label="AP Prep hero"
      className="relative px-4 pt-16 pb-12 md:pt-24 md:pb-20"
    >
      <div className="mx-auto max-w-5xl text-center">
        <p className="text-muted-foreground mb-4 font-mono text-[11px] tracking-[0.18em] uppercase">
          AP Prep Preview · Physics-first practice
        </p>

        <h1 className="text-foreground mb-5 font-serif text-4xl leading-[1.05] font-semibold tracking-tight md:text-6xl lg:text-7xl">
          <span className="italic">Practice</span>{' '}
          <span className="relative inline-block">
            the concepts
            <span
              aria-hidden
              className="absolute inset-x-0 -bottom-1 h-[0.18em] bg-[oklch(0.82_0.17_75)]/70"
            />
          </span>{' '}
          behind AP science.
        </h1>

        <p className="text-muted-foreground mx-auto mb-10 max-w-2xl text-base md:text-lg">
          Scivra is building AP-style practice that connects questions to
          interactive 3D labs. The first release focuses on physics concepts;
          full AP exam sets are not available yet.
        </p>

        {/* Sample question strip */}
        <figure
          aria-label="Example AP Physics 1 free-response question"
          className="border-primary/15 bg-card mx-auto max-w-2xl rounded-2xl border p-6 text-left shadow-sm md:p-8"
        >
          <figcaption className="text-muted-foreground mb-3 flex items-center gap-2 font-mono text-[10px] tracking-wider uppercase">
            <span className="bg-primary/10 text-primary rounded-full px-2 py-0.5">
              Concept practice preview · Mechanics
            </span>
          </figcaption>
          <p className="text-foreground font-mono text-sm leading-relaxed md:text-base">
            A 2.0 kg block slides from rest down a frictionless incline of angle{' '}
            <span className="text-primary">θ = 30°</span>. Calculate the
            block&rsquo;s velocity after sliding{' '}
            <span className="text-primary">1.5 m</span>.
          </p>
          <p className="text-muted-foreground mt-4 font-mono text-xs">
            Open the incline lab · watch the block · compare your reasoning.
          </p>
        </figure>

        <p className="text-muted-foreground mt-6 font-mono text-xs">
          AP Prep is in preview. Coverage, question sets, and scoring feedback
          are expanding over time.
        </p>
      </div>
    </section>
  );
}
