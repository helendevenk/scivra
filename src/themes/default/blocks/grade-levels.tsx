'use client';

import { Link } from '@/core/i18n/navigation';
import { ScrollAnimation } from '@/shared/components/ui/scroll-animation';
import { cn } from '@/shared/lib/utils';
import { Section } from '@/shared/types/blocks/landing';

export function GradeLevels({
  section,
  className,
}: {
  section: Section;
  className?: string;
}) {
  return (
    <section
      id={section.id}
      className={cn('py-16 md:py-24', section.className, className)}
    >
      <div className="container space-y-8 md:space-y-12">
        <ScrollAnimation>
          <div className="mx-auto max-w-4xl text-center text-balance">
            <h2 className="text-foreground mb-4 text-3xl font-semibold tracking-tight md:text-4xl">
              {section.title}
            </h2>
            <p className="text-muted-foreground">
              {section.description}
            </p>
          </div>
        </ScrollAnimation>

        <ScrollAnimation delay={0.2}>
          <div className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {section.items?.map((item, idx) => (
              <Link
                key={idx}
                href={item.url || '/labs'}
                className="border-border hover:border-primary group rounded-xl border bg-background/50 p-5 text-center transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary/5 hover:shadow-[0_0_0_1px_oklch(0.78_0.15_192_/_0.2),0_8px_24px_oklch(0.78_0.15_192_/_0.12)] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
              >
                {typeof item.count === 'number' && (
                  <div
                    className="text-primary font-mono text-3xl font-bold"
                    style={{
                      textShadow:
                        '0 0 20px oklch(0.78 0.15 192 / 0.4)',
                    }}
                  >
                    {item.count}
                  </div>
                )}
                <div className="text-foreground mt-1 text-lg font-semibold">
                  {item.title}
                </div>
                <div className="text-muted-foreground text-xs">
                  {item.age as string}
                </div>
                <div className="text-muted-foreground mt-2 text-xs">
                  {item.description}
                </div>
              </Link>
            ))}
          </div>
        </ScrollAnimation>

        {section.trust_badges && (
          <ScrollAnimation delay={0.3}>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {(section.trust_badges as string[]).map((badge, idx) => (
                <span
                  key={idx}
                  className="bg-muted text-muted-foreground rounded-full px-3 py-1 text-xs font-medium"
                >
                  {badge}
                </span>
              ))}
            </div>
          </ScrollAnimation>
        )}
      </div>
    </section>
  );
}
