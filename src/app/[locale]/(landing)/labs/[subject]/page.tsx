import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import {
  getStandardsForSubject,
  getExperimentsByStandard,
  getExperimentsBySubject,
} from "@/shared/lib/experiments/registry";
import { SUBJECTS, SUBJECT_LIST, STANDARD_LABELS } from "@/shared/lib/experiments/subjects";
import type { Subject, GradeLevel } from "@/shared/types/experiment";
import type { Metadata } from "next";

const VALID_GRADES = new Set<string>(["K-2", "3-5", "6-8", "9-12", "AP"]);

interface Props {
  params: Promise<{ locale: string; subject: string }>;
  searchParams: Promise<{ grade?: string }>;
}

export function generateStaticParams() {
  return SUBJECT_LIST.map((subject) => ({ subject }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { subject } = await params;
  if (!(subject in SUBJECTS)) return {};
  const label = SUBJECTS[subject as Subject].label;
  return {
    title: `${label} Virtual Labs | Scivra`,
    description: `Browse interactive ${label.toLowerCase()} virtual labs and experiments. Standards-aligned simulations for AP, NGSS, and K-12 curriculum.`,
  };
}

export default async function SubjectPage({ params, searchParams }: Props) {
  const { locale, subject } = await params;
  const { grade } = await searchParams;
  setRequestLocale(locale);

  if (!(subject in SUBJECTS)) {
    notFound();
  }

  const subjectKey = subject as Subject;
  const subjectConfig = SUBJECTS[subjectKey];
  const t = await getTranslations("experiments");

  const activeGrade =
    grade && VALID_GRADES.has(grade) ? (grade as GradeLevel) : undefined;

  const standards = getStandardsForSubject(subjectKey);
  const allSubjectExperiments = getExperimentsBySubject(subjectKey);
  const totalCount = activeGrade
    ? allSubjectExperiments.filter((e) => e.gradeLevel === activeGrade).length
    : allSubjectExperiments.length;

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-20 lg:pt-24">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-muted-foreground">
        <Link href={`/${locale}/labs`} className="hover:text-primary">
          Labs
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{subjectConfig.label}</span>
      </nav>

      {/* Header */}
      <section className="mb-10">
        <h1 className="font-heading mb-2 text-3xl font-bold text-foreground md:text-4xl">
          {subjectConfig.label} Virtual Labs
        </h1>
        <p className="text-muted-foreground">
          {totalCount} interactive{" "}
          {totalCount === 1 ? "experiment" : "experiments"} aligned with
          curriculum standards.
        </p>
      </section>

      {/* Standards Sections */}
      {standards.map((standard) => {
        const experiments = getExperimentsByStandard(standard);
        // Filter by subject and optionally by grade
        const subjectExperiments = experiments.filter(
          (exp) =>
            exp.subject === subjectKey &&
            (!activeGrade || exp.gradeLevel === activeGrade)
        );
        if (subjectExperiments.length === 0) return null;

        return (
          <section key={standard} className="mb-12">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-heading text-xl font-bold text-foreground">
                {STANDARD_LABELS[standard]}
              </h2>
              <Link
                href={`/${locale}/labs/${subject}/${standard}`}
                className="text-sm font-medium text-primary hover:underline"
              >
                View all {subjectExperiments.length} labs
              </Link>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {subjectExperiments.slice(0, 6).map((exp) => (
                <Link
                  key={exp.id}
                  href={`/${locale}/labs/${subject}/${standard}/${exp.slug}`}
                  className="group overflow-hidden rounded-xl border border-primary/10 bg-card transition-all hover:border-primary/30 hover:shadow-lg"
                >
                  {exp.thumbnail && (
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
                      <Image
                        src={exp.thumbnail}
                        alt={exp.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          exp.tier === "free"
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                            : "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                        }`}
                      >
                        {exp.tier === "free" ? "Free" : "Pro 🔒"}
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          exp.difficulty === "beginner"
                            ? "bg-green-500/10 text-green-700 dark:text-green-400"
                            : exp.difficulty === "intermediate"
                              ? "bg-amber-500/10 text-amber-700 dark:text-amber-400"
                              : "bg-red-500/10 text-red-700 dark:text-red-400"
                        }`}
                      >
                        {exp.difficulty}
                      </span>
                    </div>
                    <h3 className="font-heading mb-1 text-base font-semibold text-foreground group-hover:text-primary">
                      {exp.title}
                    </h3>
                    <p className="mb-2 line-clamp-2 text-sm text-muted-foreground">
                      {exp.subtitle}
                    </p>
                    <span className="text-xs text-muted-foreground">
                      ~{exp.estimatedTime} min
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
