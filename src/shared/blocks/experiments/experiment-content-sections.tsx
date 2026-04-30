import type { Experiment, ExperimentContentSection } from "@/shared/types/experiment";

interface Props {
  sections: ExperimentContentSection | undefined;
  experimentTitle: string;
  parameters: Experiment["parameters"];
}

export default function ExperimentContentSections({
  sections,
  experimentTitle,
  parameters,
}: Props) {
  if (!sections) return null;

  const { whatIsIt, parameterExplanations, misconceptions, teacherUseCases } =
    sections;

  const hasAny =
    Boolean(whatIsIt) ||
    Boolean(parameterExplanations && Object.keys(parameterExplanations).length) ||
    Boolean(misconceptions && misconceptions.length) ||
    Boolean(teacherUseCases && teacherUseCases.length);

  if (!hasAny) return null;

  return (
    <div className="mt-12 space-y-12 border-t border-border pt-8">
      {whatIsIt && (
        <section>
          <h2 className="mb-4 font-serif text-2xl font-semibold italic text-foreground md:text-3xl">
            What is {experimentTitle}?
          </h2>
          <p className="max-w-3xl text-base leading-relaxed text-muted-foreground md:text-lg">
            {whatIsIt}
          </p>
        </section>
      )}

      {parameterExplanations && Object.keys(parameterExplanations).length > 0 && (
        <section>
          <h2 className="mb-4 font-serif text-2xl font-semibold italic text-foreground md:text-3xl">
            Parameters explained
          </h2>
          <dl className="max-w-3xl space-y-4">
            {parameters
              .filter((p) => parameterExplanations[p.id])
              .map((p) => (
                <div
                  key={p.id}
                  className="rounded-lg border border-primary/10 bg-card/40 p-4"
                >
                  <dt className="mb-1 flex items-baseline gap-2">
                    <span className="font-mono text-sm font-semibold text-foreground">
                      {p.label}
                    </span>
                    {p.unit && (
                      <span className="font-mono text-xs text-muted-foreground">
                        ({p.unit})
                      </span>
                    )}
                  </dt>
                  <dd className="text-sm leading-relaxed text-muted-foreground md:text-base">
                    {parameterExplanations[p.id]}
                  </dd>
                </div>
              ))}
          </dl>
        </section>
      )}

      {misconceptions && misconceptions.length > 0 && (
        <section>
          <h2 className="mb-4 font-serif text-2xl font-semibold italic text-foreground md:text-3xl">
            Common misconceptions
          </h2>
          <ul className="max-w-3xl space-y-4">
            {misconceptions.map((m, i) => (
              <li
                key={i}
                className="rounded-lg border border-primary/10 bg-card/40 p-4"
              >
                <p className="mb-2">
                  <span className="mr-2 inline-block rounded bg-[oklch(0.55_0.18_25)]/12 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-[oklch(0.55_0.18_25)]">
                    Misconception
                  </span>
                  <span className="text-sm text-muted-foreground md:text-base">
                    {m.wrong}
                  </span>
                </p>
                <p>
                  <span className="mr-2 inline-block rounded bg-primary/12 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-primary">
                    Correct
                  </span>
                  <span className="text-sm text-foreground md:text-base">
                    {m.correct}
                  </span>
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {teacherUseCases && teacherUseCases.length > 0 && (
        <section>
          <h2 className="mb-4 font-serif text-2xl font-semibold italic text-foreground md:text-3xl">
            How teachers use this lab
          </h2>
          <ol className="max-w-3xl list-decimal space-y-2 pl-5 text-base leading-relaxed text-muted-foreground md:text-lg">
            {teacherUseCases.map((useCase, i) => (
              <li key={i}>{useCase}</li>
            ))}
          </ol>
        </section>
      )}
    </div>
  );
}
