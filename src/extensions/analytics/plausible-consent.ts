/**
 * GDPR-aware Plausible analytics helpers.
 *
 * In EEA/UK regions, Plausible is only loaded after the user accepts cookies.
 * Outside those regions, it loads unconditionally.
 */

export type ConsentDecision = 'accept' | 'reject' | null;

const EEA_AND_UK_REGION_CODES = new Set([
  'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR',
  'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL',
  'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE', 'IS', 'LI', 'NO',
  'GB', 'UK',
]);

export function shouldEnablePlausible(input: {
  regionCode: string | null;
  consentDecision: ConsentDecision;
}): boolean {
  const regionCode = input.regionCode?.toUpperCase() ?? null;
  if (!regionCode || !EEA_AND_UK_REGION_CODES.has(regionCode)) {
    return true;
  }
  return input.consentDecision === 'accept';
}

export function isEeaOrUk(regionCode: string | null): boolean {
  if (!regionCode) return false;
  return EEA_AND_UK_REGION_CODES.has(regionCode.toUpperCase());
}
