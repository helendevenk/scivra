import type { Tier } from "@/shared/types/experiment";

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
