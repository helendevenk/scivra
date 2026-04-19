import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

import { Link } from '@/core/i18n/navigation';
import { SmartIcon } from '@/shared/blocks/common';
import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/lib/utils';
import { Section } from '@/shared/types/blocks/landing';

import { HeroBackground } from './hero-background';

interface SubjectButton {
  title: string;
  icon: string;
  count: number;
  url: string;
}

import { SocialAvatars } from './social-avatars';

export function Hero({
  section,
  className,
}: {
  section: Section;
  className?: string;
}) {
  const highlightText = section.highlight_text ?? '';
  let texts = null;
  if (highlightText) {
    texts = section.title?.split(highlightText, 2);
  }

  return (
    <section
      id={section.id}
      className={cn(
        `relative overflow-hidden pt-24 pb-8 md:pt-36 md:pb-8`,
        section.className,
        className
      )}
    >
      <HeroBackground />
      {/* V2 signature: gold accent radial in top-right + teal radial from top-left */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(circle at 85% 10%, oklch(0.82 0.17 75 / 0.10), transparent 55%), radial-gradient(circle at 15% 30%, oklch(0.78 0.15 192 / 0.08), transparent 50%)',
        }}
      />
      {section.announcement && (
        <Link
          href={section.announcement.url || ''}
          target={section.announcement.target || '_self'}
          className="hover:bg-background dark:hover:border-t-border bg-muted group mx-auto mb-8 flex w-fit items-center gap-4 rounded-full border p-1 pl-4 shadow-md shadow-zinc-950/5 transition-colors duration-300 dark:border-t-white/5 dark:shadow-zinc-950"
        >
          <span className="text-foreground text-sm">
            {section.announcement.title}
          </span>
          <span className="dark:border-background block h-4 w-0.5 border-l bg-white dark:bg-zinc-700"></span>

          <div className="bg-background group-hover:bg-muted size-6 overflow-hidden rounded-full duration-500">
            <div className="flex w-12 -translate-x-1/2 duration-500 ease-in-out group-hover:translate-x-0">
              <span className="flex size-6">
                <ArrowRight className="m-auto size-3" />
              </span>
              <span className="flex size-6">
                <ArrowRight className="m-auto size-3" />
              </span>
            </div>
          </div>
        </Link>
      )}

      <div className="relative mx-auto max-w-full px-4 text-center md:max-w-5xl">
        {texts && texts.length > 0 ? (
          <h1 className="font-serif text-foreground text-4xl font-bold tracking-tight text-balance sm:mt-12 sm:text-6xl">
            {texts[0]}
            <span
              className="italic text-primary"
              style={{
                textShadow:
                  '0 0 24px oklch(0.78 0.15 192 / 0.5), 0 0 56px oklch(0.78 0.15 192 / 0.25)',
              }}
            >
              {highlightText}
            </span>
            {texts[1]}
          </h1>
        ) : (
          <h1 className="font-serif text-foreground text-4xl font-bold tracking-tight text-balance sm:mt-12 sm:text-6xl">
            {section.title}
          </h1>
        )}

        <p
          className="text-muted-foreground mt-8 mb-8 text-lg text-balance"
          dangerouslySetInnerHTML={{ __html: section.description ?? '' }}
        />

        {section.buttons && (
          <div className="flex items-center justify-center gap-4">
            {section.buttons.map((button, idx) => (
              <Button
                asChild
                size={button.size || 'default'}
                variant={button.variant || 'default'}
                className="px-4 text-sm"
                key={idx}
              >
                <Link href={button.url ?? ''} target={button.target ?? '_self'}>
                  {button.icon && <SmartIcon name={button.icon as string} />}
                  <span>{button.title}</span>
                </Link>
              </Button>
            ))}
          </div>
        )}

        {section.subjects && (section.subjects as SubjectButton[]).length > 0 && (
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {(section.subjects as SubjectButton[]).map((subject, idx) => (
              <Link
                key={idx}
                href={subject.url}
                className="border-border hover:border-primary group flex flex-col items-center gap-1 rounded-lg border px-4 py-3 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:bg-primary/5 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
              >
                <SmartIcon name={subject.icon} size={20} className="text-primary" />
                <span className="text-foreground text-sm font-medium">{subject.title}</span>
              </Link>
            ))}
          </div>
        )}

        {section.tip && (
          <p
            className="text-muted-foreground mt-6 block text-center text-sm"
            dangerouslySetInnerHTML={{ __html: section.tip ?? '' }}
          />
        )}

        {section.show_avatars && (
          <SocialAvatars tip={section.avatars_tip || ''} />
        )}
      </div>

      {section.image && (
        <div className="border-foreground/10 relative mt-8 border-y sm:mt-16">
          <div className="relative z-10 mx-auto max-w-6xl border-x px-3">
            <div className="border-x">
              <div
                aria-hidden
                className="h-3 w-full bg-[repeating-linear-gradient(-45deg,var(--color-foreground),var(--color-foreground)_1px,transparent_1px,transparent_4px)] opacity-5"
              />
              {(section.image_invert?.src || section.image?.src) && (
                <Image
                  className="border-border/25 relative z-2 hidden w-full border dark:block"
                  src={section.image_invert?.src || section.image?.src || ''}
                  alt={section.image_invert?.alt || section.image?.alt || ''}
                  width={
                    section.image_invert?.width || section.image?.width || 1200
                  }
                  height={
                    section.image_invert?.height || section.image?.height || 630
                  }
                  sizes="(max-width: 768px) 100vw, 1200px"
                  loading="lazy"
                  fetchPriority="high"
                  quality={75}
                />
              )}
              {(section.image?.src || section.image_invert?.src) && (
                <Image
                  className="border-border/25 relative z-2 block w-full border dark:hidden"
                  src={section.image?.src || section.image_invert?.src || ''}
                  alt={section.image?.alt || section.image_invert?.alt || ''}
                  width={
                    section.image?.width || section.image_invert?.width || 1200
                  }
                  height={
                    section.image?.height || section.image_invert?.height || 630
                  }
                  sizes="(max-width: 768px) 100vw, 1200px"
                  loading="lazy"
                  fetchPriority="high"
                  quality={75}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {section.background_image && (
        <div className="absolute inset-0 -z-10 hidden h-full w-full overflow-hidden md:block">
          <div className="from-background/80 via-background/80 to-background absolute inset-0 z-10 bg-gradient-to-b" />
          <Image
            src={section.background_image?.src || ''}
            alt={section.background_image?.alt || ''}
            className="object-cover opacity-60 blur-[0px]"
            fill
            loading="lazy"
            sizes="(max-width: 768px) 0vw, 100vw"
            quality={70}
          />
        </div>
      )}
    </section>
  );
}
