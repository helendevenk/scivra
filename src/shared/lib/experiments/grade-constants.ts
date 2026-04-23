import type { GradeLevel } from "@/shared/types/experiment";

/**
 * Canonical grade-level configuration for the /labs filtering UI.
 *
 * Each entry describes a filterable bucket exposed to users:
 *  - value: internal discriminator (includes the "K-5" alias that maps to
 *    two underlying gradeLevels)
 *  - label: user-facing display name
 *  - urlParam: what we pass via ?grade=... (must round-trip via
 *    VALID_GRADE_INPUTS in grade-filter.ts)
 *  - gradeLevels: the real Experiment.gradeLevel values this bucket covers
 */
export interface GradeConfig {
  value: GradeLevel | "K-5";
  label: string;
  urlParam: string;
  gradeLevels: GradeLevel[];
}

export const GRADE_CONFIGS: readonly GradeConfig[] = [
  {
    value: "K-5",
    label: "Elementary (K-5)",
    urlParam: "K-5",
    gradeLevels: ["K-2", "3-5"],
  },
  {
    value: "6-8",
    label: "Middle School",
    urlParam: "6-8",
    gradeLevels: ["6-8"],
  },
  {
    value: "9-12",
    label: "High School",
    urlParam: "9-12",
    gradeLevels: ["9-12"],
  },
  {
    value: "AP",
    label: "AP",
    urlParam: "AP",
    gradeLevels: ["AP"],
  },
] as const;
