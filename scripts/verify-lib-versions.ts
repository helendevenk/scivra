/**
 * Version Configuration Verification Script
 *
 * Validates that lib-versions.ts is correctly configured and accessible.
 */

import { LIB_VERSIONS, UPG_CDN_WHITELIST, getAllUpgCdnUrls } from '../src/config/lib-versions';

console.log('=== Library Version Configuration ===\n');

console.log('Three.js:');
console.log(`  UPG CDN: ${LIB_VERSIONS.three.upgCdn}`);
console.log(`  UPG URL: ${LIB_VERSIONS.three.upgCdnUrl}`);
console.log(`  npm: ${LIB_VERSIONS.three.npmVersion}\n`);

console.log('OrbitControls:');
console.log(`  Version: ${LIB_VERSIONS.orbitControls.version}`);
console.log(`  Local Path: ${LIB_VERSIONS.orbitControls.localPath}`);
console.log(`  Source CDN: ${LIB_VERSIONS.orbitControls.sourceCdnUrl}\n`);

console.log('KaTeX:');
console.log(`  UPG CDN: ${LIB_VERSIONS.katex.upgCdn}`);
console.log(`  CSS URL: ${LIB_VERSIONS.katex.upgCdnCssUrl}`);
console.log(`  JS URL: ${LIB_VERSIONS.katex.upgCdnJsUrl}`);
console.log(`  npm: ${LIB_VERSIONS.katex.npmVersion}\n`);

console.log('CDN Whitelist:');
UPG_CDN_WHITELIST.forEach((domain) => console.log(`  - ${domain}`));

console.log('\nAll UPG CDN URLs:');
getAllUpgCdnUrls().forEach((url) => console.log(`  - ${url}`));

console.log('\n✅ Version configuration loaded successfully!');
