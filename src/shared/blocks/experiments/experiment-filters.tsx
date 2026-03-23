"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { cn } from "@/shared/lib/utils";

const SUBJECTS = [
  { value: "all", label: "All" },
  { value: "physics", label: "Physics" },
  { value: "chemistry", label: "Chemistry" },
  { value: "biology", label: "Biology" },
  { value: "earth-science", label: "Earth Science" },
  { value: "math", label: "Math" },
] as const;

const GRADES = [
  { value: "all", label: "All Grades" },
  { value: "K-2", label: "K-2" },
  { value: "3-5", label: "3-5" },
  { value: "6-8", label: "6-8" },
  { value: "9-12", label: "9-12" },
  { value: "AP", label: "AP" },
] as const;

const DIFFICULTIES = [
  { value: "all", label: "All" },
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
] as const;

interface ExperimentFiltersProps {
  translations: {
    filter_subject: string;
    filter_grade: string;
    filter_difficulty: string;
    showing_count: string;
    [key: string]: string;
  };
  resultCount: number;
}

export function ExperimentFilters({
  translations: t,
  resultCount,
}: ExperimentFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const subject = searchParams.get("subject") || "all";
  const grade = searchParams.get("grade") || "all";
  const difficulty = searchParams.get("difficulty") || "all";

  const setFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === "all") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
      router.push(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  const getLabel = (key: string, fallback: string) => {
    return t[key] || fallback;
  };

  return (
    <div className="mb-8 space-y-4">
      {/* Subject tabs */}
      <div className="flex flex-wrap gap-2">
        {SUBJECTS.map((s) => (
          <button
            key={s.value}
            onClick={() => setFilter("subject", s.value)}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
              subject === s.value
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
            )}
          >
            {getLabel(`subject_${s.value}`, s.label)}
          </button>
        ))}
      </div>

      {/* Grade + Difficulty row */}
      <div className="flex flex-wrap items-center gap-6">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">
            {t.filter_grade}:
          </span>
          <div className="flex gap-1">
            {GRADES.map((g) => (
              <button
                key={g.value}
                onClick={() => setFilter("grade", g.value)}
                className={cn(
                  "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                  grade === g.value
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {getLabel(`grade_${g.value}`, g.label)}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">
            {t.filter_difficulty}:
          </span>
          <div className="flex gap-1">
            {DIFFICULTIES.map((d) => (
              <button
                key={d.value}
                onClick={() => setFilter("difficulty", d.value)}
                className={cn(
                  "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                  difficulty === d.value
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {getLabel(d.value, d.label)}
              </button>
            ))}
          </div>
        </div>

        <span className="ml-auto text-sm text-muted-foreground">
          {t.showing_count.replace("{count}", String(resultCount))}
        </span>
      </div>
    </div>
  );
}
