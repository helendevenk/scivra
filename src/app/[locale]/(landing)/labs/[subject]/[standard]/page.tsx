import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import {
  getExperimentsByStandardForSubjectAsync,
  getStandardsForSubjectAsync,
} from "@/shared/lib/experiments/registry-subjects";
import { SUBJECTS, STANDARD_LABELS, ALL_STANDARDS } from "@/shared/lib/experiments/subjects";
import type { Subject, PrimaryStandard } from "@/shared/types/experiment";
import type { Metadata } from "next";
import { envConfigs } from "@/config";
import { getLocalizedPath, getPageAlternates } from "@/shared/lib/seo";

// Use ISR to avoid loading all experiments at build time
export const revalidate = 3600; // 1 hour cache
export const dynamicParams = true;

interface Props {
  params: Promise<{ locale: string; subject: string; standard: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, subject, standard } = await params;
  if (!(subject in SUBJECTS)) return {};
  if (!ALL_STANDARDS.includes(standard as PrimaryStandard)) return {};

  const standardLabel =
    STANDARD_LABELS[standard as PrimaryStandard] ?? standard;
  return {
    title: `${standardLabel} Virtual Labs | ${envConfigs.app_name}`,
    description: `Interactive ${standardLabel} virtual labs and experiments. Explore standards-aligned simulations with real-time parameter controls.`,
    alternates: getPageAlternates(`/labs/${subject}/${standard}`, locale),
  };
}

export default async function StandardPage({ params }: Props) {
  const { locale, subject, standard } = await params;
  setRequestLocale(locale);

  if (!(subject in SUBJECTS)) {
    notFound();
  }
  if (!ALL_STANDARDS.includes(standard as PrimaryStandard)) {
    notFound();
  }

  const subjectKey = subject as Subject;
  const standardKey = standard as PrimaryStandard;
  const subjectConfig = SUBJECTS[subjectKey];

  // Validate this standard actually belongs to this subject
  const subjectStandards = await getStandardsForSubjectAsync(subjectKey);
  if (!subjectStandards.includes(standardKey)) {
    notFound();
  }

  const experiments = await getExperimentsByStandardForSubjectAsync(
    subjectKey,
    standardKey
  );

  const standardLabel = STANDARD_LABELS[standardKey];

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-20 lg:pt-24">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-muted-foreground">
        <Link href={getLocalizedPath("/labs", locale)} className="hover:text-primary">
          Labs
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={getLocalizedPath(`/labs/${subject}`, locale)}
          className="hover:text-primary"
        >
          {subjectConfig.label}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{standardLabel}</span>
      </nav>

      {/* Header */}
      <section className="mb-10">
        <h1 className="font-heading mb-2 text-3xl font-bold text-foreground md:text-4xl">
          {standardLabel} Virtual Labs
        </h1>
        <p className="text-muted-foreground">
          {experiments.length} interactive{" "}
          {experiments.length === 1 ? "experiment" : "experiments"} in{" "}
          {subjectConfig.label}.
        </p>
      </section>

      {/* Experiment Cards Grid */}
      {experiments.length === 0 ? (
        <div className="py-20 text-center text-muted-foreground">
          No experiments found for this standard yet.
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {experiments.map((exp) => (
            <Link
              key={exp.id}
              href={getLocalizedPath(
                `/labs/${subject}/${standard}/${exp.slug}`,
                locale
              )}
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
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>~{exp.estimatedTime} min</span>
                  <div className="flex flex-wrap gap-1">
                    {exp.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="rounded bg-muted px-1.5 py-0.5"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
