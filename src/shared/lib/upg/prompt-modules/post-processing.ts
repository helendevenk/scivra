/**
 * Post-Processing Effects for UPG System Prompt
 *
 * Sources:
 * - 3d-graphics (S-tier 9.5): Bloom/UnrealBloomPass parameters
 * - threejs-webgl (A-tier 8.3): Performance budgets for post-processing
 *
 * NOTE: Only Bloom is included. SSAO/DOF are too heavy for mobile.
 */

export function getPostProcessingPrompt(): string {
  return `
## POST-PROCESSING: BLOOM (Optional Enhancement)

Use Bloom ONLY for scenes with glowing objects (stars, energy, plasma, neon, lasers).
Do NOT use Bloom for everyday physics scenes (projectile, spring, pendulum).

### When to Use Bloom
- Stars, suns, or celestial objects with emissive materials
- Energy fields, plasma, electric arcs
- Neon/cyberpunk aesthetic scenes
- Laser beams, light trails

### Implementation (no extra CDN needed — use Three.js built-in)

\`\`\`javascript
// Bloom requires EffectComposer — load from Three.js examples
// Add these script tags AFTER Three.js and OrbitControls:
// <script src="https://cdn.jsdelivr.net/npm/three@0.134.0/examples/js/postprocessing/EffectComposer.js"></script>
// <script src="https://cdn.jsdelivr.net/npm/three@0.134.0/examples/js/postprocessing/RenderPass.js"></script>
// <script src="https://cdn.jsdelivr.net/npm/three@0.134.0/examples/js/postprocessing/UnrealBloomPass.js"></script>
// <script src="https://cdn.jsdelivr.net/npm/three@0.134.0/examples/js/shaders/CopyShader.js"></script>
// <script src="https://cdn.jsdelivr.net/npm/three@0.134.0/examples/js/shaders/LuminosityHighPassShader.js"></script>

const composer = new THREE.EffectComposer(renderer);
composer.addPass(new THREE.RenderPass(scene, camera));

const bloomPass = new THREE.UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  1.5,   // strength (0.5-2.0, higher = more glow)
  0.4,   // radius (0.0-1.0, spread of glow)
  0.85   // threshold (0.0-1.0, brightness cutoff)
);
composer.addPass(bloomPass);

// In animation loop: replace renderer.render(scene, camera) with:
composer.render();

// In resize handler, also update:
composer.setSize(w, h);
\`\`\`

### Bloom Performance Rules
- On LOW quality tier: skip Bloom entirely, use regular renderer.render()
- On MEDIUM: strength 0.8, radius 0.3 (subtle)
- On HIGH: strength 1.5, radius 0.4 (full effect)
- Bloom doubles GPU cost — only use when visual payoff is clear
`;
}
