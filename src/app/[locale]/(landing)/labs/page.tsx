import Link from "next/link";
import { setRequestLocale } from "next-intl/server";
import { getAllSubjectsWithCountsAsync } from "@/shared/lib/experiments/registry-subjects";
import { SUBJECTS } from "@/shared/lib/experiments/subjects";
import type { Subject, GradeLevel } from "@/shared/types/experiment";
import type { Metadata } from "next";
import { getLocalizedPath, getPageAlternates } from "@/shared/lib/seo";

export const revalidate = 3600;

const SUBJECT_ICONS: Record<Subject, string> = {
  physics: "⚛️",
  chemistry: "🧪",
  biology: "🧬",
  "earth-science": "🌍",
  math: "🔢",
};

const GRADE_LEVELS: { value: GradeLevel | "all"; label: string }[] = [
  { value: "all", label: "All Grades" },
  { value: "K-2", label: "K-2" },
  { value: "3-5", label: "3-5" },
  { value: "6-8", label: "Middle School" },
  { value: "9-12", label: "High School" },
  { value: "AP", label: "AP" },
];

const VALID_GRADES = new Set<string>(["K-2", "3-5", "6-8", "9-12", "AP"]);

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

  const activeGrade =
    grade && VALID_GRADES.has(grade) ? (grade as GradeLevel) : undefined;

  const subjectsWithCounts = await getAllSubjectsWithCountsAsync(activeGrade);
  const countsMap = new Map(subjectsWithCounts.map((s) => [s.subject, s.count]));

  const subjectKeys = Object.keys(SUBJECTS) as Subject[];
  const totalCount = subjectsWithCounts.reduce((sum, s) => sum + s.count, 0);

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-20 lg:pt-24">
      <section className="mb-8 text-center">
        <h1 className="font-heading mb-3 text-4xl font-bold tracking-tight text-foreground md:text-5xl">
          Interactive Science Labs
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          Explore virtual experiments across 5 disciplines. Hands-on learning
          aligned with AP, NGSS, and K-12 standards — completely free to start.
        </p>
      </section>

      <section className="mb-10">
        <div className="flex flex-wrap items-center justify-center gap-2">
          {GRADE_LEVELS.map(({ value, label }) => {
            const isActive = value === "all" ? !activeGrade : activeGrade === value;
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
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-primary/20 bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
                }`}
              >
                {label}
              </Link>
            );
          })}
          <span className="ml-2 text-sm text-muted-foreground">{totalCount} experiments</span>
        </div>
      </section>

      <section className="mb-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {subjectKeys.map((key) => {
            const subject = SUBJECTS[key];
            const count = countsMap.get(key) ?? 0;

            if (activeGrade && count === 0) return null;

            const href = activeGrade
              ? getLocalizedPath(`/labs/${key}?grade=${activeGrade}`, locale)
              : getLocalizedPath(`/labs/${key}`, locale);

            return (
              <Link
                key={key}
                href={href}
                className="group relative overflow-hidden rounded-2xl border border-primary/10 bg-card p-6 transition-all hover:border-primary/30 hover:shadow-lg"
              >
                <div className="mb-4 text-4xl">{SUBJECT_ICONS[key]}</div>
                <h2 className="font-heading mb-1 text-xl font-bold text-foreground group-hover:text-primary">
                  {subject.label}
                </h2>
                <p className="mb-4 text-sm text-muted-foreground">
                  {count} {count === 1 ? "experiment" : "experiments"} available
                </p>
                <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
                  Browse Labs
                </span>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
