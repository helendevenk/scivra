import type { EasterEgg } from "@/shared/types/experiment";

interface ParameterRange {
  min: number;
  max: number;
}

export function checkEasterEgg(
  eggs: EasterEgg[],
  parameterId: string,
  value: number,
  parameterRanges: Record<string, ParameterRange>
): EasterEgg | null {
  const range = parameterRanges[parameterId];
  if (!range) return null;

  for (const egg of eggs) {
    if (egg.parameterId !== parameterId) continue;

    switch (egg.condition) {
      case "specific":
        if (egg.triggerValue !== undefined && value === egg.triggerValue) return egg;
        break;
      case "max":
        if (value >= range.max) return egg;
        break;
      case "min":
        if (value <= range.min) return egg;
        break;
    }
  }

  return null;
}
