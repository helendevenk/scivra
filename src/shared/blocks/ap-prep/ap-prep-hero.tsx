export function ApPrepHero() {
  return (
    <section
      aria-label="AP Prep hero"
      className="relative px-4 pb-12 pt-16 md:pb-20 md:pt-24"
    >
      <div className="mx-auto max-w-5xl text-center">
        <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          AP Prep · College Board aligned
        </p>

        <h1 className="mb-5 font-serif text-4xl font-semibold leading-[1.05] tracking-tight text-foreground md:text-6xl lg:text-7xl">
          <span className="italic">Walk in</span>{" "}
          <span className="relative inline-block">
            already confident
            <span
              aria-hidden
              className="absolute inset-x-0 -bottom-1 h-[0.18em] bg-[oklch(0.82_0.17_75)]/70"
            />
          </span>
          .
        </h1>

        <p className="mx-auto mb-10 max-w-2xl text-base text-muted-foreground md:text-lg">
          Every AP Physics, Biology, and Chemistry unit &mdash; real past-paper
          questions, instant feedback, and the exact 3D lab that makes the
          concept click.
        </p>

        {/* Sample question strip */}
        <figure
          aria-label="Example AP Physics 1 free-response question"
          className="mx-auto max-w-2xl rounded-2xl border border-primary/15 bg-card p-6 text-left shadow-sm md:p-8"
        >
          <figcaption className="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-primary">
              AP Physics 1 · 2023 FRQ · #3
            </span>
          </figcaption>
          <p className="font-mono text-sm leading-relaxed text-foreground md:text-base">
            A 2.0 kg block slides from rest down a frictionless incline of
            angle{" "}
            <span className="text-primary">θ = 30°</span>. Calculate the
            block&rsquo;s velocity after sliding{" "}
            <span className="text-primary">1.5 m</span>.
          </p>
          <p className="mt-4 font-mono text-xs text-muted-foreground">
            → Open the incline lab · watch the block · verify your answer.
          </p>
        </figure>

        <p className="mt-6 font-mono text-xs text-muted-foreground">
          Students using Scivra AP Prep average +0.8 letter grade · based on
          internal survey, AY 2025-26
        </p>
      </div>
    </section>
  );
}
