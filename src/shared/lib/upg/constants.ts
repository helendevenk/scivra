// UPG hardcoded constants (V0.2: migrate to config table)

export const UPG_DEFAULT_MODEL = 'MiniMax-M2.1';
export const UPG_FALLBACK_MODEL = 'MiniMax-M2.1';
export const UPG_MAX_GENERATION_TIME_MS = 180000; // MiniMax may need more time for large HTML
export const UPG_CREDITS_PER_GENERATION = 10;
export const UPG_CREDITS_PER_REGENERATION = 5;
export const UPG_FREE_DAILY_LIMIT = 3;
export const UPG_PRO_DAILY_LIMIT = 20;
export const UPG_MAX_HTML_SIZE = 200 * 1024; // 200KB hard limit
export const UPG_DEFAULT_MAX_TOKENS = 16000;
export const UPG_DEFAULT_TEMPERATURE = 0.7;
export const UPG_OPENROUTER_DEFAULT_BASE_URL = 'https://api.minimaxi.com/v1';

export const UPG_CDN_WHITELIST = [
  'cdn.jsdelivr.net',
  'cdnjs.cloudflare.com',
  'unpkg.com',
];
