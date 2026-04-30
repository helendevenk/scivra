import { buildFaqPageJsonLd, serializeJsonLd } from "@/shared/lib/seo/json-ld";

interface Props {
  faq: { question: string; answer: string }[] | undefined;
}

export default function ExperimentFaq({ faq }: Props) {
  if (!faq || faq.length === 0) return null;

  const jsonLd = buildFaqPageJsonLd(faq);

  return (
    <section className="mt-12 border-t border-border pt-8">
      <h2 className="mb-6 font-serif text-2xl font-semibold italic text-foreground md:text-3xl">
        Frequently asked questions
      </h2>
      <div className="max-w-3xl space-y-3">
        {faq.map((item) => (
          <details
            key={item.question}
            className="group rounded-xl border border-primary/10 bg-card p-4 transition-colors hover:border-primary/30"
          >
            <summary className="cursor-pointer list-none font-semibold text-foreground">
              <span
                aria-hidden
                className="float-right ml-2 text-primary transition-transform group-open:rotate-45"
              >
                +
              </span>
              {item.question}
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
              {item.answer}
            </p>
          </details>
        ))}
      </div>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
        />
      )}
    </section>
  );
}
