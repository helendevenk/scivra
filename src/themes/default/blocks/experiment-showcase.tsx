'use client';

import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

import { Link } from '@/core/i18n/navigation';
import { Button } from '@/shared/components/ui/button';
import { ScrollAnimation } from '@/shared/components/ui/scroll-animation';
import { cn } from '@/shared/lib/utils';
import { Section } from '@/shared/types/blocks/landing';

import { experimentAnimations } from './experiment-animations';

export function ExperimentShowcase({
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
          <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {section.items?.map((item, idx) => (
              <Link
                key={idx}
                href={item.url || '/labs'}
                className="group border-border hover:border-primary/30 overflow-hidden rounded-xl border transition-all duration-300 hover:shadow-lg motion-reduce:transition-none"
              >
                <div className="bg-muted relative aspect-[16/10] overflow-hidden">
                  {(() => {
                    const slug = (item.url || '').split('/').pop() || '';
                    const AnimComponent = experimentAnimations[slug];
                    if (AnimComponent) {
                      return <AnimComponent />;
                    }
                    if (item.image?.src) {
                      return (
                        <Image
                          src={item.image.src}
                          alt={item.image.alt || item.title || ''}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      );
                    }
                    return <div className="flex size-full items-center justify-center text-muted-foreground text-sm">Preview</div>;
                  })()}
                </div>
                <div className="p-4">
                  <div className="mb-2 flex items-center gap-2">
                    {item.subject && (
                      <span className="bg-primary/10 text-primary rounded-full px-2 py-0.5 text-xs font-medium">
                        {item.subject as string}
                      </span>
                    )}
                    {item.grade && (
                      <span className="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-xs">
                        {item.grade as string}
                      </span>
                    )}
                  </div>
                  <h3 className="text-foreground mb-1 font-semibold">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {item.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </ScrollAnimation>

        {section.cta && (
          <ScrollAnimation delay={0.3}>
            <div className="text-center">
              <Button asChild variant="outline" size="lg">
                <Link href={(section.cta as Record<string, string>).url || '/labs'}>
                  <span>{(section.cta as Record<string, string>).title}</span>
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
            </div>
          </ScrollAnimation>
        )}
      </div>
    </section>
  );
}
