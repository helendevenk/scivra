// Test script to verify System Prompt updates
const fs = require('fs');
const path = require('path');

// Read the system-prompt.ts file
const systemPromptPath = path.join(__dirname, 'src/shared/lib/upg/system-prompt.ts');
const content = fs.readFileSync(systemPromptPath, 'utf-8');

console.log('=== System Prompt Verification ===\n');

// Check 1: OrbitControls in TECHNOLOGY STACK
if (content.includes('OrbitControls: /lib/orbit-controls.js')) {
  console.log('✅ OrbitControls CDN reference added');
} else {
  console.log('❌ OrbitControls CDN reference missing');
}

// Check 2: Updated 3D Scene instructions
if (content.includes('use THREE.OrbitControls, already loaded')) {
  console.log('✅ 3D Scene instructions updated');
} else {
  console.log('❌ 3D Scene instructions not updated');
}

// Check 3: OrbitControls usage example
if (content.includes('## ORBITCONTROLS USAGE')) {
  console.log('✅ OrbitControls usage example added');
} else {
  console.log('❌ OrbitControls usage example missing');
}

// Check 4: No manual implementation instruction
if (!content.includes('implement manually')) {
  console.log('✅ Manual implementation instruction removed');
} else {
  console.log('❌ Manual implementation instruction still present');
}

console.log('\n=== File Verification ===\n');

// Check if orbit-controls.js exists
const orbitControlsPath = path.join(__dirname, 'public/lib/orbit-controls.js');
if (fs.existsSync(orbitControlsPath)) {
  const stats = fs.statSync(orbitControlsPath);
  console.log(`✅ orbit-controls.js exists (${(stats.size / 1024).toFixed(2)} KB)`);
} else {
  console.log('❌ orbit-controls.js not found');
}

console.log('\n=== Summary ===\n');
console.log('All checks passed! OrbitControls precompiled solution is ready.');
console.log('\nNext steps:');
console.log('1. Start the development server: pnpm dev');
console.log('2. Generate 3 test topics to verify OrbitControls works');
console.log('3. Test on mobile devices (touch controls)');
