'use client';

import { useEffect } from 'react';

import { ArrowRight } from 'lucide-react';

import { Link } from '@/core/i18n/navigation';
import { SmartIcon } from '@/shared/blocks/common';
import { Button } from '@/shared/components/ui/button';
import { track } from '@/shared/lib/analytics/track';
import { cn } from '@/shared/lib/utils';
import { Section } from '@/shared/types/blocks/landing';

import { HeroBackground } from './hero-background';
import { SocialAvatars } from './social-avatars';

interface SubjectButton {
  title: string;
  icon: string;
  count: number;
  url: string;
}

/**
 * Static SVG projectile motion illustration — V3 hero visual.
 * Uses CSS keyframes (not SVG SMIL) for Safari 15 compat + prefers-reduced-motion support.
 * See docs/plans/2026-04-22-homepage-visual-overhaul.md §2.4.
 */
function HeroIllustration() {
  const particles: Array<[number, number]> = [
    [90, 170],
    [150, 130],
    [210, 100],
    [270, 80],
    [330, 68],
    [390, 68],
    [450, 80],
    [510, 100],
    [570, 130],
    [630, 170],
    [180, 60],
    [540, 60],
  ];

  return (
    <svg
      data-hero-illustration
      viewBox="0 0 720 240"
      role="img"
      aria-label="Projectile motion illustration — parabolic arc with velocity vector"
      className="h-auto w-full max-w-3xl"
      style={{ overflow: 'visible' }}
    >
      <defs>
        <style>{`
          @keyframes scivra-hero-draw {
            to { stroke-dashoffset: 0; }
          }
          [data-hero-path] {
            stroke-dasharray: 1200;
            stroke-dashoffset: 1200;
            animation: scivra-hero-draw 800ms cubic-bezier(0.4, 0, 0.2, 1) 150ms forwards;
          }
          @media (prefers-reduced-motion: reduce) {
            [data-hero-path] {
              stroke-dashoffset: 0;
              animation: none;
            }
          }
        `}</style>
      </defs>

      {/* parabola */}
      <path
        data-hero-path
        d="M 40 200 Q 360 -40 680 200"
        stroke="oklch(0.45 0.12 192 / 0.85)"
        strokeWidth="3.5"
        fill="none"
        strokeLinecap="round"
      />

      {/* static particles */}
      {particles.map(([cx, cy], i) => (
        <circle
          key={i}
          cx={cx}
          cy={cy}
          r={2}
          fill="oklch(0.82 0.18 192)"
          opacity={0.6}
        />
      ))}

      {/* 45° angle marker at launch point */}
      <path
        d="M 40 200 L 80 200 A 40 40 0 0 0 65.86 165.86 Z"
        fill="oklch(0.45 0.12 192 / 0.12)"
        stroke="oklch(0.45 0.12 192)"
        strokeWidth="1"
      />
      <text
        x="84"
        y="192"
        fontSize="11"
        fill="oklch(0.45 0.12 192)"
        fontFamily="ui-monospace, monospace"
      >
        45°
      </text>

      {/* velocity vector at apex */}
      <line x1="360" y1="20" x2="360" y2="60" stroke="oklch(0.75 0.15 75)" strokeWidth="2" />
      <polygon points="356,58 360,66 364,58" fill="oklch(0.75 0.15 75)" />
      <text
        x="368"
        y="32"
        fontSize="11"
        fill="oklch(0.75 0.15 75)"
        fontFamily="ui-monospace, monospace"
      >
        v(t)
      </text>

      {/* caption — explicit Example to avoid educational trust risk */}
      <text
        x="710"
        y="230"
        fontSize="10"
        fill="oklch(0.55 0.023 264)"
        fontFamily="ui-monospace, monospace"
        textAnchor="end"
      >
        Example · v₀ = 42 m/s · θ = 45° · g = 9.81 m/s²
      </text>
    </svg>
  );
}

export function Hero({
  section,
  className,
}: {
  section: Section;
  className?: string;
}) {
  const highlightText = section.highlight_text ?? '';
  let texts: string[] | null = null;
  if (highlightText && section.title) {
    texts = section.title.split(highlightText, 2);
  }

  // Scroll depth tracking for Phase 2 observation
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const fired = new Set<number>();
    const getLocale = () =>
      typeof document !== 'undefined' ? document.documentElement.lang || 'en' : 'en';

    const onScroll = () => {
      const scrolled = window.scrollY;
      const h = document.documentElement.scrollHeight - window.innerHeight;
      if (h <= 0) return;
      const pct = (scrolled / h) * 100;
      for (const depth of [25, 50, 75] as const) {
        if (pct >= depth && !fired.has(depth)) {
          fired.add(depth);
          track(`scroll_depth_${depth}` as const, { locale: getLocale() });
        }
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const locale =
    typeof document !== 'undefined' ? document.documentElement.lang || 'en' : 'en';

  return (
    <section
      id={section.id}
      className={cn(
        'relative overflow-hidden pt-24 pb-16 md:pt-36 md:pb-24',
        section.className,
        className
      )}
    >
      <HeroBackground />

      {/* V3 signature — subtle cyan glow radial */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 30%, oklch(0.78 0.15 192 / 0.10), transparent 70%)',
        }}
      />

      {section.announcement && (
        <Link
          href={section.announcement.url || ''}
          target={section.announcement.target || '_self'}
          className="hover:bg-background dark:hover:border-t-border bg-muted group mx-auto mb-8 flex w-fit items-center gap-4 rounded-full border p-1 pl-4 shadow-md shadow-zinc-950/5 transition-colors duration-300 dark:border-t-white/5 dark:shadow-zinc-950"
        >
          <span className="text-foreground text-sm">{section.announcement.title}</span>
          <span className="dark:border-background block h-4 w-0.5 border-l bg-white dark:bg-zinc-700" />
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
            <em
              className="text-primary not-italic"
              style={{
                fontStyle: 'italic',
                borderBottom: '4px solid oklch(0.75 0.15 75)',
                paddingBottom: '0.08em',
                textShadow:
                  '0 0 24px oklch(0.78 0.15 192 / 0.5), 0 0 56px oklch(0.78 0.15 192 / 0.25)',
              }}
            >
              {highlightText}
            </em>
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

        {/* V3 inline SVG hero illustration (replaces FreePik PNG) */}
        <div className="my-10 flex justify-center md:my-12">
          <HeroIllustration />
        </div>

        {section.buttons && (
          <div className="flex flex-wrap items-center justify-center gap-4">
            {section.buttons.map((button, idx) => (
              <Button
                asChild
                size={button.size || 'default'}
                variant={button.variant || 'default'}
                className="px-4 text-sm"
                key={idx}
              >
                <Link
                  href={button.url ?? ''}
                  target={button.target ?? '_self'}
                  onClick={() =>
                    track('hero_cta_click', {
                      variant: idx === 0 ? 'primary' : 'secondary',
                      locale,
                    })
                  }
                >
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
                onClick={() =>
                  track('grade_tile_click', {
                    grade: subject.title,
                    locale,
                  })
                }
                className="border-border hover:border-primary group flex flex-col items-center gap-1 rounded-lg border px-4 py-3 transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary/5 hover:shadow-md motion-reduce:transition-none motion-reduce:hover:translate-y-0"
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

        {section.show_avatars && <SocialAvatars tip={section.avatars_tip || ''} />}
      </div>

      {/* Note: section.image is ignored in V3 — inline SVG illustration replaces it.
          The landing.json `image` field is set to null; code path retained for backward-compat
          but never renders to avoid FreePik-style cartoon regression. */}
    </section>
  );
}
