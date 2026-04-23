'use client';

import { ScrollAnimation } from '@/shared/components/ui/scroll-animation';
import { cn } from '@/shared/lib/utils';
import { Section } from '@/shared/types/blocks/landing';

export function Stats({
  section,
  className,
}: {
  section: Section;
  className?: string;
}) {
  const trustLine = section.trust_line as string | undefined;

  return (
    <section
      id={section.id}
      className={cn('py-12 md:py-24', section.className, className)}
    >
      <div className="container space-y-8 md:space-y-12">
        <ScrollAnimation>
          <div className="relative z-10 mx-auto max-w-xl space-y-4 text-center">
            <h2 className="font-serif text-foreground text-3xl font-bold tracking-tight md:text-4xl">
              {section.title}
            </h2>
            <p className="text-muted-foreground">{section.description}</p>
          </div>
        </ScrollAnimation>

        <ScrollAnimation delay={0.2}>
          <div className="grid gap-10 divide-y *:text-center md:grid-cols-3 md:gap-4 md:divide-x md:divide-y-0">
            {section.items?.map((item, idx) => (
              <div className="space-y-2" key={idx}>
                <h3 className="sr-only">
                  {item.title} {item.description}
                </h3>
                <div
                  className="font-serif text-primary text-5xl font-bold md:text-6xl"
                  style={{
                    textShadow:
                      '0 0 32px oklch(0.78 0.15 192 / 0.45), 0 0 64px oklch(0.78 0.15 192 / 0.2)',
                  }}
                >
                  {item.title}
                </div>
                <p className="text-muted-foreground text-sm">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </ScrollAnimation>

        {trustLine && (
          <ScrollAnimation delay={0.3}>
            <p className="text-muted-foreground text-center font-mono text-xs tracking-wider uppercase">
              {trustLine}
            </p>
          </ScrollAnimation>
        )}
      </div>
    </section>
  );
}
