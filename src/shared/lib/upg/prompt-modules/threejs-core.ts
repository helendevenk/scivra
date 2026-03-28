/**
 * Three.js Core Patterns for UPG System Prompt
 *
 * Sources:
 * - threejs-3d-graphics (S-tier 9.3): ThreeScene class, context loss, memory leak prevention
 * - 3d-graphics (S-tier 9.5): Lighting, post-processing, performance
 * - threejs-materials (A-tier 8.5): Material decision tree, environment maps
 * - threejs-fundamentals (A-tier 8.0): Responsive canvas, coordinate system
 */

export function getThreejsCorePrompt(): string {
  return `
## MANDATORY HTML SKELETON (COPY THIS EXACTLY — DO NOT SKIP OR MODIFY THE STRUCTURE)

Every generated HTML file MUST start with this exact skeleton. Fill in the [PLACEHOLDERS] with your content.
Omitting any part of this skeleton is a CRITICAL ERROR that causes black screens.

\`\`\`html
<!DOCTYPE html>
<html lang="[LANGUAGE]">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>[TOPIC TITLE]</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">
  <script src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js"><\/script>
  <script src="https://cdn.jsdelivr.net/npm/three@0.134.0/build/three.min.js"><\/script>
  <script src="/lib/orbit-controls.js"><\/script>
  <style>
    /* [YOUR CSS HERE — must include :root variables from Visual Design System] */
  </style>
</head>
<body>
  <!-- [YOUR HTML STRUCTURE HERE — must follow five-zone layout] -->
  <script>
  'use strict';
  document.addEventListener('DOMContentLoaded', () => {
    try {
      // [YOUR THREE.JS + INTERACTION CODE HERE]
    } catch (e) {
      const c = document.getElementById('canvas-container');
      if (c) c.innerHTML = '<p style="color:#EF4444;padding:2rem;font-size:1.2rem;">3D initialization failed: ' + e.message + '</p>';
      console.error(e);
    }
  });
  <\/script>
</body>
</html>
\`\`\`

## ORBITCONTROLS — IRON RULE

**NEVER write your own camera rotation/zoom/pan code.** OrbitControls is already loaded via the mandatory \`<script>\` tag above.

- Access it as: \`new THREE.OrbitControls(camera, renderer.domElement)\`
- It is ALREADY available as a global — do NOT import it, do NOT copy-paste its source code, do NOT implement trackball/arcball yourself.
- If you write ANY custom mouse/touch camera control code instead of using OrbitControls, the output is REJECTED.

## THREE.JS SCENE INITIALIZATION (MANDATORY TEMPLATE)

Inside the try-catch block, follow this exact initialization pattern:

\`\`\`javascript
// === MANDATORY SCENE SETUP ===
const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();
// IMPORTANT: Use dark slate blue (#0f172a), NOT pure black (#000000 or #0a0a0f).
// Pure black kills contrast — grid lines, axes, and dim objects become invisible.
scene.background = new THREE.Color(0x0f172a);

const camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 1000);
camera.position.set(0, 5, 15);

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  powerPreference: 'high-performance'
});
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
container.appendChild(renderer.domElement);

// OrbitControls — MUST use the library loaded via script tag
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.minDistance = 2;
controls.maxDistance = 50;

// MANDATORY: Ground grid for spatial reference (skip only for astronomy/space scenes)
const gridHelper = new THREE.GridHelper(20, 20, 0x334155, 0x1e293b);
gridHelper.position.y = 0;
scene.add(gridHelper);

// MANDATORY: Resize handler
window.addEventListener('resize', () => {
  const w = container.clientWidth, h = container.clientHeight;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
});

// MANDATORY: Animation loop (auto-pauses in background tabs)
const clock = new THREE.Clock();
renderer.setAnimationLoop(() => {
  const delta = Math.min(clock.getDelta(), 0.05);
  controls.update(); // REQUIRED when enableDamping = true
  updateScene(delta); // your physics/animation update function
  renderer.render(scene, camera);
});
\`\`\`

## FIVE LINES OF DEFENSE AGAINST BLACK SCREEN

1. **try-catch wrapper**: Wrap ALL Three.js initialization in try-catch. In catch block, show a text fallback message.
2. **Resize listener**: Always listen to window resize and update camera.aspect + renderer.setSize.
3. **setAnimationLoop ONLY**: Use \`renderer.setAnimationLoop(fn)\` — NEVER use manual \`requestAnimationFrame\`. setAnimationLoop auto-pauses when the tab is hidden (saves battery/CPU) and is the Three.js-recommended pattern. If you write \`requestAnimationFrame\`, the output is REJECTED.
4. **DPR cap**: Always \`Math.min(window.devicePixelRatio, 2)\` — high-DPR screens can crash GPU.
5. **Object reuse**: Create Vector3/Matrix4/Object3D OUTSIDE the animation loop. Reuse them inside.

\`\`\`javascript
// WRONG — manual requestAnimationFrame (REJECTED):
function animate() {
  requestAnimationFrame(animate);  // DO NOT USE THIS
  renderer.render(scene, camera);
}
animate();

// RIGHT — renderer.setAnimationLoop (MANDATORY):
renderer.setAnimationLoop(() => {
  const delta = Math.min(clock.getDelta(), 0.05);
  controls.update();
  updateScene(delta);
  renderer.render(scene, camera);
});
\`\`\`

\`\`\`javascript
// WRONG — creates garbage every frame:
function animate() {
  const pos = new THREE.Vector3(x, y, z); // GC pressure!
}

// RIGHT — reuse pre-allocated objects:
const _pos = new THREE.Vector3();
function animate() {
  _pos.set(x, y, z); // zero allocation
}
\`\`\`

## THREE-POINT LIGHTING SYSTEM (DEFAULT)

\`\`\`javascript
// Key light (main illumination)
const keyLight = new THREE.DirectionalLight(0xffffff, 1.0);
keyLight.position.set(5, 10, 7);
keyLight.castShadow = true;
keyLight.shadow.mapSize.set(2048, 2048);
scene.add(keyLight);

// Fill light (soften shadows)
const fillLight = new THREE.DirectionalLight(0xffffff, 0.4);
fillLight.position.set(-5, 5, -5);
scene.add(fillLight);

// Back light (rim/outline)
const backLight = new THREE.DirectionalLight(0xffffff, 0.3);
backLight.position.set(0, 5, -10);
scene.add(backLight);

// Ambient (base illumination — 0.5 ensures objects are visible even in shadows)
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
\`\`\`

For astronomy/outdoor scenes, add HemisphereLight:
\`\`\`javascript
const hemiLight = new THREE.HemisphereLight(0x4488ff, 0x002244, 0.6);
scene.add(hemiLight);
\`\`\`

## MATERIAL SELECTION DECISION TREE

Choose material based on what you're rendering:

| Object Type | Material | Key Parameters |
|------------|----------|----------------|
| Metal (conductor, circuit) | MeshStandardMaterial | metalness: 0.8, roughness: 0.2 |
| Glass/transparent (optics) | MeshPhysicalMaterial | transmission: 1, ior: 1.5, thickness: 0.5 |
| Glowing body (star, energy, plasma) | MeshStandardMaterial | emissive: color, emissiveIntensity: 2.0+ |
| Particles/gas | PointsMaterial | blending: THREE.AdditiveBlending, depthWrite: false |
| Generic solid object | MeshStandardMaterial | roughness: 0.5, metalness: 0 |
| Fabric/soft surface | MeshPhongMaterial | shininess: 10, side: THREE.DoubleSide |

For ALL MeshStandardMaterial/MeshPhysicalMaterial, objects look flat without proper lighting. Ensure the three-point lighting above is present.

## PERFORMANCE TARGETS

- Draw calls: < 100 for mobile 60fps
- Particles: high-end 5000, medium 2000, low 500
- Geometry segments: Sphere 32×32 (quality), 16×16 (mobile)
- Shadows: Only on key objects, mapSize 1024 on mobile
- Use InstancedMesh when rendering > 50 identical objects
`;
}
