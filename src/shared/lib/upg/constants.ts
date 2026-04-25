// UPG hardcoded constants (V0.2: migrate to config table)

export const UPG_DEFAULT_MODEL = process.env.OPUS_MODEL || 'glm-5-turbo';
export const UPG_FALLBACK_MODEL = process.env.UPG_FALLBACK_MODEL || 'glm-5-turbo';
export const UPG_MAX_GENERATION_TIME_MS = 300000; // 5 min for Sonnet
export const UPG_CREDITS_PER_GENERATION = 10;
export const UPG_CREDITS_PER_REGENERATION = 5;
export const UPG_FREE_DAILY_LIMIT = 3;
export const UPG_PRO_DAILY_LIMIT = 20;
export const UPG_MAX_HTML_SIZE = 200 * 1024; // 200KB hard limit
export const UPG_DEFAULT_MAX_TOKENS = 16000;
export const UPG_DEFAULT_TEMPERATURE = 0.7;
export const UPG_CREDITS_PER_REFINEMENT = 3;
export const UPG_REFINEMENT_MAX_TOKENS = 16000;
export const UPG_OPENROUTER_DEFAULT_BASE_URL = 'https://openrouter.ai/api/v1';

// CDN whitelist moved to @/config/lib-versions.ts for centralized version management
export { UPG_CDN_WHITELIST } from '@/config/lib-versions';
