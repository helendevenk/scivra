/**
 * Library Version Configuration
 *
 * Centralized version management for external libraries used in UPG HTML generation.
 * This ensures consistency between System Prompt CDN links and package.json dependencies.
 *
 * Last updated: 2026-03-09 (Phase 0.2)
 */

export const LIB_VERSIONS = {
  /**
   * Three.js - 3D Graphics Library
   *
   * - UPG HTML: Uses r134 via CDN (stable, well-tested for UPG use cases)
   * - React Components: Uses 0.183.1 via npm (latest features for React Three Fiber)
   *
   * Why different versions?
   * - UPG generates standalone HTML files that must work in any browser
   * - r134 is a proven stable version with excellent CDN availability
   * - React components can use latest features without affecting UPG output
   */
  three: {
    upgCdn: 'r134',
    upgCdnUrl: 'https://cdn.jsdelivr.net/npm/three@0.134.0/build/three.min.js',
    npmVersion: '0.183.1', // Used by React Three Fiber components
  },

  /**
   * OrbitControls - Three.js Camera Controls
   *
   * - Precompiled from Three.js r134
   * - Served from /public/lib/orbit-controls.js
   * - Must match Three.js r134 API
   */
  orbitControls: {
    version: 'r134',
    localPath: '/lib/orbit-controls.js',
    cdnUrl: 'https://cdn.jsdelivr.net/npm/three@0.134.0/examples/js/controls/OrbitControls.js',
    sourceCdnUrl: 'https://cdn.jsdelivr.net/npm/three@0.134.0/examples/js/controls/OrbitControls.js',
  },

  /**
   * KaTeX - Math Typesetting Library
   *
   * - UPG HTML: Uses 0.16.9 via CDN (stable, widely cached)
   * - npm: Uses 0.16.33 (latest for build-time rendering in MDX/docs)
   *
   * Why different versions?
   * - 0.16.9 is stable and has excellent CDN cache hit rates
   * - 0.16.33 provides latest features for server-side rendering
   * - Both versions are API-compatible for basic math rendering
   */
  katex: {
    upgCdn: '0.16.9',
    upgCdnCssUrl: 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css',
    upgCdnJsUrl: 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js',
    npmVersion: '0.16.33', // Used by rehype-katex for MDX rendering
  },
} as const;

/**
 * CDN Whitelist for UPG HTML Sanitizer
 *
 * Only scripts from these domains are allowed in UPG-generated HTML.
 */
export const UPG_CDN_WHITELIST = [
  'cdn.jsdelivr.net',
  'cdnjs.cloudflare.com',
  'unpkg.com',
] as const;

/**
 * Helper function to get all CDN URLs for validation
 */
export function getAllUpgCdnUrls(): string[] {
  return [
    LIB_VERSIONS.three.upgCdnUrl,
    LIB_VERSIONS.katex.upgCdnCssUrl,
    LIB_VERSIONS.katex.upgCdnJsUrl,
  ];
}

/**
 * Version summary for documentation
 */
export const VERSION_SUMMARY = {
  lastUpdated: '2026-03-09',
  phase: 'Phase 0.2 - Version Unification',
  notes: [
    'Three.js: r134 for UPG CDN, 0.183.1 for React components',
    'KaTeX: 0.16.9 for UPG CDN, 0.16.33 for npm',
    'OrbitControls: r134 precompiled, served from /public/lib/',
  ],
} as const;
