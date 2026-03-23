import type { Experiment, GradeLevel, Subject, Tier } from "@/shared/types/experiment";
import { getAllExperiments } from "./registry";

const TIER_LEVELS: Record<Tier, number> = {
  free: 0,
  pro: 1,
  max: 2,
};

/** Permanently free experiments — always accessible regardless of subscription */
export const FREE_EXPERIMENT_IDS = new Set([
  "newtons-laws",
  "projectile-motion",
  "simple-harmonic-motion",
]);

/** Check if user can access a specific experiment */
export function canAccessExperiment(
  experimentId: string,
  userTier: Tier
): boolean {
  if (FREE_EXPERIMENT_IDS.has(experimentId)) return true;
  return TIER_LEVELS[userTier] >= TIER_LEVELS["pro"];
}

export function canAccessTier(userTier: Tier, requiredTier: Tier): boolean {
  return TIER_LEVELS[userTier] >= TIER_LEVELS[requiredTier];
}

export function subscriptionToTier(planName: string | null): Tier {
  if (!planName) return "free";
  const lower = planName.toLowerCase();
  if (lower.includes("max") || lower.includes("enterprise")) return "max";
  if (lower.includes("pro") || lower.includes("premium")) return "pro";
  return "free";
}

interface AccessFilters {
  subject?: Subject;
  gradeLevel?: GradeLevel;
}

export function getAccessibleExperiments(
  userTier: Tier,
  filters?: AccessFilters
): Experiment[] {
  return getAllExperiments().filter((exp) => {
    if (!canAccessExperiment(exp.id, userTier)) return false;
    if (filters?.subject && exp.subject !== filters.subject) return false;
    if (filters?.gradeLevel && exp.gradeLevel !== filters.gradeLevel)
      return false;
    return true;
  });
}
