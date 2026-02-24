import type { Tier } from "@/shared/types/experiment";

const TIER_LEVELS: Record<Tier, number> = {
  free: 0,
  pro: 1,
  max: 2,
};

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
