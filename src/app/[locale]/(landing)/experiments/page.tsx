import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { getAllExperiments } from "@/shared/lib/experiments/registry";
import { getMetadata } from "@/shared/lib/seo";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/shared/components/ui/card";
import { ExperimentFilters } from "@/shared/blocks/experiments/experiment-filters";
import type { Subject, GradeLevel, Difficulty } from "@/shared/types/experiment";

export const generateMetadata = getMetadata({
  metadataKey: "experiments.metadata",
  canonicalUrl: "/experiments",
});

export default async function ExperimentsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ subject?: string; grade?: string; difficulty?: string }>;
}) {
  const { locale } = await params;
  const filters = await searchParams;
  setRequestLocale(locale);
  const t = await getTranslations("experiments");

  let experiments = getAllExperiments();

  // Apply filters
  if (filters.subject && filters.subject !== "all") {
    experiments = experiments.filter(
      (exp) => exp.subject === (filters.subject as Subject)
    );
  }
  if (filters.grade && filters.grade !== "all") {
    experiments = experiments.filter(
      (exp) => exp.gradeLevel === (filters.grade as GradeLevel)
    );
  }
  if (filters.difficulty && filters.difficulty !== "all") {
    experiments = experiments.filter(
      (exp) => exp.difficulty === (filters.difficulty as Difficulty)
    );
  }

  // Build translations object for client component
  const filterTranslations = {
    filter_subject: t("page.filter_subject"),
    filter_grade: t("page.filter_grade"),
    filter_difficulty: t("page.filter_difficulty"),
    showing_count: t.raw("page.showing_count") as string,
    subject_all: t("page.filter_all"),
    subject_physics: t("page.subject_physics"),
    subject_chemistry: t("page.subject_chemistry"),
    subject_biology: t("page.subject_biology"),
    "subject_earth-science": t("page.subject_earth-science"),
    subject_math: t("page.subject_math"),
    grade_all: t("page.grade_all"),
    "grade_K-2": t("page.grade_K-2"),
    "grade_3-5": t("page.grade_3-5"),
    "grade_6-8": t("page.grade_6-8"),
    "grade_9-12": t("page.grade_9-12"),
    grade_AP: t("page.grade_AP"),
    beginner: t("card.beginner"),
    intermediate: t("card.intermediate"),
    advanced: t("card.advanced"),
  };

  return (
    <div className="mx-auto max-w-7xl px-4 pb-12 pt-20 lg:pt-24">
      <h1 className="mb-2 font-serif text-3xl font-bold text-foreground">
        {t("page.title")}
      </h1>
      <p className="mb-6 text-muted-foreground">{t("page.subtitle")}</p>

      <Suspense fallback={null}>
        <ExperimentFilters
          translations={filterTranslations}
          resultCount={experiments.length}
        />
      </Suspense>

      {experiments.length === 0 ? (
        <div className="py-20 text-center text-muted-foreground">
          {t("page.no_results")}
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {experiments.map((exp) => (
            <Link
              key={exp.id}
              href={`/${locale}/experiments/${exp.slug}`}
              className="group"
            >
              <Card className="h-full overflow-hidden border-primary/10 bg-card transition-all hover:border-primary/30 hover:shadow-lg">
                {/* Thumbnail */}
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
                <CardHeader className="pb-2">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                      {exp.subject}
                    </span>
                    <div className="flex items-center gap-2">
                      {exp.gradeLevel && (
                        <span className="rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
                          {exp.gradeLevel}
                        </span>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {t("card.estimated_time", {
                          minutes: exp.estimatedTime,
                        })}
                      </span>
                    </div>
                  </div>
                  <CardTitle className="text-base text-foreground group-hover:text-primary">
                    {exp.title}
                  </CardTitle>
                  <CardDescription className="text-sm">
                    {exp.subtitle}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex flex-wrap gap-1">
                    {exp.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="flex items-center justify-between">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      exp.tier === "free"
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                    }`}
                  >
                    {t(`card.tier_${exp.tier}`)}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {t(`card.${exp.difficulty}`)}
                  </span>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
