'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

import { Link } from '@/core/i18n/navigation';
import { Button } from '@/shared/components/ui/button';
import { ScrollAnimation } from '@/shared/components/ui/scroll-animation';
import { cn } from '@/shared/lib/utils';
import { Section } from '@/shared/types/blocks/landing';

const TYPE_SPEED_MS = 45;
const PAUSE_AT_END_MS = 1800;
const PAUSE_BETWEEN_MS = 300;

function subscribeReducedMotion(onChange: () => void) {
  if (typeof window === 'undefined') return () => {};
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  mq.addEventListener?.('change', onChange);
  return () => mq.removeEventListener?.('change', onChange);
}

function getMotionOkSnapshot() {
  if (typeof window === 'undefined') return false;
  return !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function getMotionOkServerSnapshot() {
  return false;
}

interface UpgExample {
  subject: string;
  title: string;
  author: string;
  url: string;
}

function useTypewriter(prompts: string[], enabled: boolean) {
  const [idx, setIdx] = useState(0);
  const [text, setText] = useState(prompts[0] ?? '');
  const [mode, setMode] = useState<'type' | 'hold' | 'erase' | 'gap'>('hold');

  useEffect(() => {
    if (!enabled || prompts.length <= 1) return;

    const current = prompts[idx];
    if (!current) return;

    let timer: ReturnType<typeof setTimeout>;

    if (mode === 'hold') {
      timer = setTimeout(() => setMode('erase'), PAUSE_AT_END_MS);
    } else if (mode === 'erase') {
      if (text.length === 0) {
        timer = setTimeout(() => {
          setIdx((idx + 1) % prompts.length);
          setMode('gap');
        }, PAUSE_BETWEEN_MS);
      } else {
        timer = setTimeout(
          () => setText(text.slice(0, -1)),
          TYPE_SPEED_MS / 2,
        );
      }
    } else if (mode === 'gap') {
      timer = setTimeout(() => setMode('type'), PAUSE_BETWEEN_MS);
    } else if (mode === 'type') {
      const target = prompts[idx] ?? '';
      if (text.length === target.length) {
        timer = setTimeout(() => setMode('hold'), 0);
      } else {
        timer = setTimeout(
          () => setText(target.slice(0, text.length + 1)),
          TYPE_SPEED_MS,
        );
      }
    }

    return () => clearTimeout(timer);
  }, [enabled, prompts, idx, mode, text]);

  if (!enabled) return prompts[0] ?? '';
  return text;
}

function ExampleThumb({
  example,
  index,
}: {
  example: UpgExample;
  index: number;
}) {
  // Three distinct CSS/SVG-only illustrations: physics / chemistry / biology
  const subjectStyles: Record<string, { pill: string; glow: string }> = {
    Physics: {
      pill: 'bg-primary/15 text-primary',
      glow: 'from-primary/25 via-primary/5 to-transparent',
    },
    Chemistry: {
      pill: 'bg-emerald-500/15 text-emerald-400',
      glow: 'from-emerald-400/25 via-emerald-400/5 to-transparent',
    },
    Biology: {
      pill: 'bg-lime-500/15 text-lime-400',
      glow: 'from-lime-400/25 via-lime-400/5 to-transparent',
    },
  };

  const style = subjectStyles[example.subject] ?? subjectStyles.Physics;

  return (
    <Link
      href={example.url}
      className="group relative block overflow-hidden rounded-lg border border-white/5 bg-slate-900/60 transition-all duration-300 hover:border-primary/40 hover:-translate-y-0.5 hover:shadow-lg motion-reduce:transition-none motion-reduce:hover:translate-y-0"
    >
      <div
        className={cn(
          'relative aspect-[4/3] overflow-hidden bg-gradient-to-br',
          style.glow,
        )}
      >
        {/* Subject-specific SVG decoration */}
        {example.subject === 'Physics' && <PhysicsOrbitals />}
        {example.subject === 'Chemistry' && <ChemMolecule />}
        {example.subject === 'Biology' && <BioCell />}
      </div>
      <div className="space-y-1 p-3">
        <span
          className={cn(
            'inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase',
            style.pill,
          )}
        >
          {example.subject}
        </span>
        <p className="text-sm font-medium text-slate-100">{example.title}</p>
        <p className="font-mono text-[10px] text-slate-400">{example.author}</p>
      </div>
    </Link>
  );
}

function PhysicsOrbitals() {
  return (
    <svg viewBox="0 0 160 120" className="absolute inset-0 h-full w-full" aria-hidden>
      <g className="animate-[spin_24s_linear_infinite]" style={{ transformOrigin: '80px 60px' }}>
        <ellipse cx="80" cy="60" rx="55" ry="18" fill="none" stroke="currentColor" strokeWidth="1" className="text-primary" opacity="0.6" />
        <ellipse cx="80" cy="60" rx="55" ry="18" fill="none" stroke="currentColor" strokeWidth="1" className="text-primary" opacity="0.5" transform="rotate(60 80 60)" />
        <ellipse cx="80" cy="60" rx="55" ry="18" fill="none" stroke="currentColor" strokeWidth="1" className="text-primary" opacity="0.4" transform="rotate(120 80 60)" />
      </g>
      <circle cx="80" cy="60" r="6" fill="currentColor" className="text-primary" opacity="0.8" />
      <circle r="2.5" fill="currentColor" className="text-primary motion-reduce:hidden">
        <animateMotion dur="2.5s" repeatCount="indefinite">
          <mpath href="#upg-orb-a" />
        </animateMotion>
      </circle>
      <ellipse id="upg-orb-a" cx="80" cy="60" rx="55" ry="18" fill="none" />
    </svg>
  );
}

function ChemMolecule() {
  // Methane-ish central + 4 arms
  return (
    <svg viewBox="0 0 160 120" className="absolute inset-0 h-full w-full" aria-hidden>
      <g className="animate-[spin_30s_linear_infinite]" style={{ transformOrigin: '80px 60px' }}>
        <line x1="80" y1="60" x2="40" y2="30" stroke="currentColor" strokeWidth="2" className="text-emerald-400" opacity="0.6" />
        <line x1="80" y1="60" x2="120" y2="30" stroke="currentColor" strokeWidth="2" className="text-emerald-400" opacity="0.6" />
        <line x1="80" y1="60" x2="40" y2="90" stroke="currentColor" strokeWidth="2" className="text-emerald-400" opacity="0.6" />
        <line x1="80" y1="60" x2="120" y2="90" stroke="currentColor" strokeWidth="2" className="text-emerald-400" opacity="0.6" />
        <circle cx="80" cy="60" r="10" fill="currentColor" className="text-emerald-400" opacity="0.8" />
        <circle cx="40" cy="30" r="6" fill="currentColor" className="text-emerald-300" opacity="0.9" />
        <circle cx="120" cy="30" r="6" fill="currentColor" className="text-emerald-300" opacity="0.9" />
        <circle cx="40" cy="90" r="6" fill="currentColor" className="text-emerald-300" opacity="0.9" />
        <circle cx="120" cy="90" r="6" fill="currentColor" className="text-emerald-300" opacity="0.9" />
      </g>
    </svg>
  );
}

function BioCell() {
  // Dividing cell
  return (
    <svg viewBox="0 0 160 120" className="absolute inset-0 h-full w-full" aria-hidden>
      <ellipse cx="60" cy="60" rx="28" ry="30" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-lime-400" opacity="0.7" />
      <ellipse cx="100" cy="60" rx="28" ry="30" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-lime-400" opacity="0.7" />
      <circle cx="60" cy="60" r="10" fill="currentColor" className="text-lime-400" opacity="0.5" />
      <circle cx="100" cy="60" r="10" fill="currentColor" className="text-lime-400" opacity="0.5" />
      {[35, 55, 75, 95].map((x, i) => (
        <circle
          key={i}
          cx={x}
          cy={60 + Math.sin(i) * 4}
          r="2"
          fill="currentColor"
          className="text-lime-300 motion-reduce:hidden"
        >
          <animate
            attributeName="cy"
            values={`${60 + Math.sin(i) * 4};${60 - Math.sin(i) * 4};${60 + Math.sin(i) * 4}`}
            dur={`${2 + i * 0.3}s`}
            repeatCount="indefinite"
          />
        </circle>
      ))}
    </svg>
  );
}

export function UPGSection({
  section,
  className,
}: {
  section: Section;
  className?: string;
}) {
  const prompts = (section.prompts as string[] | undefined) ?? [];
  const examples = (section.examples as UpgExample[] | undefined) ?? [];
  const cta = section.cta as
    | { title?: string; url?: string; icon?: string }
    | undefined;
  const finePrint = section.fine_print as string | undefined;
  const highlight = section.highlight_text as string | undefined;

  const motionOk = useSyncExternalStore(
    subscribeReducedMotion,
    getMotionOkSnapshot,
    getMotionOkServerSnapshot,
  );

  const typed = useTypewriter(prompts, motionOk);

  let titleNode: React.ReactNode = section.title;
  if (highlight && section.title?.includes(highlight)) {
    const parts = section.title.split(highlight);
    titleNode = (
      <>
        {parts[0]}
        <span
          className="text-[oklch(0.70_0.20_300)]"
          style={{
            textShadow:
              '0 0 24px oklch(0.70 0.20 300 / 0.5), 0 0 48px oklch(0.70 0.20 300 / 0.25)',
          }}
        >
          {highlight}
        </span>
        {parts[1]}
      </>
    );
  }

  return (
    <section
      id={section.id}
      className={cn('relative overflow-hidden py-16 md:py-24', className)}
    >
      {/* Background — teal + purple radial glows */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 motion-reduce:opacity-50"
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 25% 20%, oklch(0.70 0.20 300 / 0.08), transparent 55%), radial-gradient(circle at 75% 80%, oklch(0.78 0.15 192 / 0.06), transparent 50%)',
          }}
        />
      </div>

      <div className="container">
        <ScrollAnimation>
          <div className="mx-auto max-w-3xl text-center text-balance">
            {section.label && (
              <span className="mb-4 inline-block rounded-full border border-[oklch(0.70_0.20_300_/_0.3)] bg-[oklch(0.70_0.20_300_/_0.08)] px-3 py-1 font-mono text-[10px] font-semibold tracking-[0.15em] text-[oklch(0.75_0.18_300)] uppercase">
                {section.label}
              </span>
            )}
            <h2 className="font-serif text-3xl leading-tight font-bold tracking-tight text-balance text-foreground md:text-4xl">
              {titleNode}
            </h2>
            {section.description && (
              <p className="mt-4 text-muted-foreground">{section.description}</p>
            )}
          </div>
        </ScrollAnimation>

        <ScrollAnimation delay={0.15}>
          <div className="mx-auto mt-10 max-w-3xl">
            {/* Prompt box */}
            <div
              className="group relative rounded-xl border border-[oklch(0.78_0.15_192_/_0.25)] bg-slate-950/60 p-4 backdrop-blur-sm md:p-5"
              style={{
                boxShadow:
                  '0 0 0 1px oklch(0.78 0.15 192 / 0.1), 0 0 48px oklch(0.78 0.15 192 / 0.08)',
              }}
              aria-live="polite"
              aria-label={`AI prompt example: ${typed}`}
            >
              <div className="mb-2 flex items-center gap-2">
                <Sparkles className="size-4 text-[oklch(0.75_0.18_300)]" />
                <span className="font-mono text-[10px] tracking-wider text-slate-400 uppercase">
                  Prompt
                </span>
              </div>
              <div className="font-mono text-sm leading-relaxed text-slate-100 md:text-base">
                {typed}
                <span
                  className="ml-[1px] inline-block h-[1em] w-[2px] translate-y-[3px] bg-primary motion-reduce:opacity-0"
                  style={{
                    animation: 'upg-caret-blink 1s steps(1) infinite',
                  }}
                />
              </div>
              <style>{`@keyframes upg-caret-blink { 0%,50% { opacity: 1; } 50.01%,100% { opacity: 0; } }`}</style>
            </div>

            {/* Primary CTA */}
            {cta && (
              <div className="mt-6 flex flex-col items-center gap-2">
                <Button
                  asChild
                  size="lg"
                  className="border-0 text-white shadow-[0_0_0_1px_oklch(0.78_0.15_192_/_0.4),0_8px_24px_oklch(0.78_0.15_192_/_0.2),0_0_48px_oklch(0.70_0.20_300_/_0.2)] transition-all hover:-translate-y-0.5 hover:shadow-[0_0_0_1px_oklch(0.78_0.15_192_/_0.6),0_12px_32px_oklch(0.78_0.15_192_/_0.3),0_0_64px_oklch(0.70_0.20_300_/_0.3)] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                  style={{
                    background:
                      'linear-gradient(135deg, oklch(0.70 0.20 300) 0%, oklch(0.78 0.15 192) 100%)',
                  }}
                >
                  <Link href={cta.url ?? '/upg'}>
                    <Sparkles className="mr-1 size-4" />
                    <span>{cta.title}</span>
                    <ArrowRight className="ml-1 size-4" />
                  </Link>
                </Button>
                {finePrint && (
                  <p className="font-mono text-[11px] text-muted-foreground">
                    {finePrint}
                  </p>
                )}
              </div>
            )}
          </div>
        </ScrollAnimation>

        {examples.length > 0 && (
          <ScrollAnimation delay={0.25}>
            <div className="mx-auto mt-12 grid max-w-4xl gap-4 sm:grid-cols-3">
              {examples.map((ex, i) => (
                <ExampleThumb key={i} example={ex} index={i} />
              ))}
            </div>
          </ScrollAnimation>
        )}
      </div>
    </section>
  );
}
