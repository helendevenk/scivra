import Link from "next/link";
import { setRequestLocale } from "next-intl/server";
import { getAllSubjectsWithCountsAsync } from "@/shared/lib/experiments/registry-subjects";
import { SUBJECTS } from "@/shared/lib/experiments/subjects";
import {
  resolveGradeLevels,
  VALID_GRADE_INPUTS,
} from "@/shared/lib/experiments/grade-filter";
import type { Subject } from "@/shared/types/experiment";
import type { Metadata } from "next";
import { getLocalizedPath, getPageAlternates } from "@/shared/lib/seo";

export const revalidate = 3600;

const GRADE_LEVELS: { value: string; label: string }[] = [
  { value: "all", label: "All Grades" },
  { value: "K-5", label: "Elementary (K-5)" },
  { value: "6-8", label: "Middle School" },
  { value: "9-12", label: "High School" },
  { value: "AP", label: "AP" },
];

const SUBJECT_SIGNATURES: Record<Subject, (props: { className?: string }) => React.ReactElement> = {
  physics: ({ className }) => (
    <svg viewBox="0 0 80 80" className={className} fill="none" aria-hidden>
      <path
        d="M8 56 Q40 8 72 56"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <circle cx="40" cy="20" r="3" fill="currentColor" />
      <path d="M8 56 L14 62 M8 56 L14 50" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  chemistry: ({ className }) => (
    <svg viewBox="0 0 80 80" className={className} fill="none" aria-hidden>
      <path
        d="M30 14 L30 32 L18 58 Q16 66 24 66 L56 66 Q64 66 62 58 L50 32 L50 14"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path d="M24 14 L56 14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="32" cy="50" r="2.5" fill="currentColor" />
      <circle cx="44" cy="56" r="2" fill="currentColor" />
      <circle cx="38" cy="44" r="1.5" fill="currentColor" />
    </svg>
  ),
  biology: ({ className }) => (
    <svg viewBox="0 0 80 80" className={className} fill="none" aria-hidden>
      <path
        d="M24 12 Q56 28 24 44 Q56 60 24 68"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M56 12 Q24 28 56 44 Q24 60 56 68"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <line x1="28" y1="20" x2="52" y2="20" stroke="currentColor" strokeWidth="1.5" />
      <line x1="28" y1="32" x2="52" y2="32" stroke="currentColor" strokeWidth="1.5" />
      <line x1="28" y1="44" x2="52" y2="44" stroke="currentColor" strokeWidth="1.5" />
      <line x1="28" y1="56" x2="52" y2="56" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  "earth-science": ({ className }) => (
    <svg viewBox="0 0 80 80" className={className} fill="none" aria-hidden>
      <circle cx="40" cy="40" r="26" stroke="currentColor" strokeWidth="2.5" />
      <path d="M14 40 Q40 26 66 40" stroke="currentColor" strokeWidth="1.5" />
      <path d="M14 40 Q40 54 66 40" stroke="currentColor" strokeWidth="1.5" />
      <path d="M40 14 Q52 40 40 66" stroke="currentColor" strokeWidth="1.5" />
      <path d="M40 14 Q28 40 40 66" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  math: ({ className }) => (
    <svg viewBox="0 0 80 80" className={className} fill="none" aria-hidden>
      <path d="M12 60 L68 20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M12 60 Q40 60 40 20" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3" />
      <circle cx="40" cy="40" r="2.5" fill="currentColor" />
      <text x="46" y="44" fontSize="12" fontFamily="ui-monospace,monospace" fill="currentColor">
        ƒ(x)
      </text>
    </svg>
  ),
};

interface Props {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ grade?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  return {
    title: "Free Interactive Science Labs | Scivra",
    description:
      "Explore 179+ free interactive virtual science labs covering Physics, Chemistry, Biology, Earth Science, and Math. Aligned with AP, NGSS, and K-12 standards.",
    keywords:
      "virtual labs, science experiments, physics simulations, chemistry labs, biology labs, interactive learning, AP Physics, NGSS",
    alternates: getPageAlternates('/labs', locale),
  };
}

export default async function LabsIndexPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { grade } = await searchParams;
  setRequestLocale(locale);

  const activeGradeInput =
    grade && VALID_GRADE_INPUTS.has(grade) ? grade : undefined;
  const gradeLevels = resolveGradeLevels(activeGradeInput);

  const subjectsWithCounts = await getAllSubjectsWithCountsAsync(gradeLevels);
  const countsMap = new Map(subjectsWithCounts.map((s) => [s.subject, s.count]));

  const subjectKeys = Object.keys(SUBJECTS) as Subject[];
  const totalCount = subjectsWithCounts.reduce((sum, s) => sum + s.count, 0);

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-20 lg:pt-24">
      <section className="mb-10 text-center">
        <h1 className="mb-4 font-serif text-4xl font-semibold leading-[1.08] tracking-tight text-foreground md:text-6xl">
          <span className="italic">Interactive</span>{" "}
          <span className="relative inline-block">
            Science Labs
            <span
              aria-hidden
              className="absolute inset-x-0 -bottom-1 h-[0.22em] bg-[oklch(0.82_0.17_75)]/70"
            />
          </span>
        </h1>
        <p className="mx-auto max-w-2xl text-base text-muted-foreground md:text-lg">
          Explore virtual experiments across 5 disciplines. Hands-on learning
          aligned with AP, NGSS, and K-12 standards &mdash; completely free to
          start.
        </p>
        <p className="mt-4 font-mono text-xs text-muted-foreground/80 md:text-sm">
          {totalCount} experiments · 5 disciplines · NGSS / AP aligned
        </p>
      </section>

      <section className="mb-12">
        <div className="flex flex-wrap items-center justify-center gap-2">
          {GRADE_LEVELS.map(({ value, label }) => {
            const isActive =
              value === "all" ? !activeGradeInput : activeGradeInput === value;
            const href =
              value === "all"
                ? getLocalizedPath("/labs", locale)
                : getLocalizedPath(`/labs?grade=${value}`, locale);

            return (
              <Link
                key={value}
                href={href}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "border-primary bg-primary text-primary-foreground shadow-[0_0_0_4px_oklch(0.82_0.17_75/0.18)]"
                    : "border-primary/20 bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mb-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {subjectKeys.map((key) => {
            const subject = SUBJECTS[key];
            const count = countsMap.get(key) ?? 0;

            if (activeGradeInput && count === 0) return null;

            const href = activeGradeInput
              ? getLocalizedPath(
                  `/labs/${key}?grade=${activeGradeInput}`,
                  locale
                )
              : getLocalizedPath(`/labs/${key}`, locale);

            const Signature = SUBJECT_SIGNATURES[key];

            return (
              <Link
                key={key}
                href={href}
                data-subject={key}
                className="group relative overflow-hidden rounded-2xl border border-primary/10 bg-card p-6 transition-all hover:border-primary/40 hover:shadow-[0_0_0_1px_oklch(0.45_0.12_192/0.25),0_12px_32px_-16px_oklch(0.45_0.12_192/0.5)]"
              >
                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-xl bg-primary/5 text-primary transition-colors group-hover:bg-primary/10">
                  <Signature className="h-10 w-10" />
                </div>
                <h2 className="mb-1 font-serif text-2xl font-semibold italic text-foreground group-hover:text-primary">
                  {subject.label}
                </h2>
                <p className="mb-4 font-mono text-xs text-muted-foreground">
                  {count} {count === 1 ? "experiment" : "experiments"} available
                </p>
                <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
                  Browse Labs
                  <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
                </span>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
