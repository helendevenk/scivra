import type { GradeLevel } from "@/shared/types/experiment";

export const GRADE_ALIASES = {
  "K-5": ["K-2", "3-5"] as GradeLevel[],
} as const;

export const VALID_GRADE_INPUTS = new Set<string>([
  "K-2",
  "3-5",
  "6-8",
  "9-12",
  "AP",
  "K-5",
]);

export function resolveGradeLevels(
  input?: string
): GradeLevel[] | undefined {
  if (!input || !VALID_GRADE_INPUTS.has(input)) return undefined;
  if (input in GRADE_ALIASES) {
    return GRADE_ALIASES[input as keyof typeof GRADE_ALIASES].slice();
  }
  return [input as GradeLevel];
}

export function matchesGrade(
  gradeLevel: GradeLevel,
  filter: GradeLevel[] | undefined
): boolean {
  if (!filter) return true;
  return filter.includes(gradeLevel);
}
