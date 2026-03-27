/**
 * UPG E2E Pipeline Test (no LLM call)
 *
 * Tests the full pipeline: sanitize → quality → validation → DB save → DB read
 * Uses a real Three.js HTML sample that matches system prompt requirements.
 *
 * Usage: npx tsx scripts/test-upg-e2e.ts
 */
import 'dotenv/config';
import { sanitizeHtml } from '../src/shared/lib/upg/html-sanitizer';
import { checkQuality } from '../src/shared/lib/upg/quality-checker';
import { runFullValidation } from '../src/shared/lib/upg/validation';
import {
  createUpgGeneration,
  findUpgGenerationById,
  softDeleteUpgGeneration,
} from '../src/shared/models/upg_generation';
import { getUuid } from '../src/shared/lib/hash';

// A real Three.js HTML that should pass all quality checks
const SAMPLE_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Simple Harmonic Motion | Scivra</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">
  <script src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js"><\/script>
  <script src="https://cdn.jsdelivr.net/npm/three@0.134.0/build/three.min.js"><\/script>
  <script src="/lib/orbit-controls.js"><\/script>
  <style>
    :root { --bg: #0f172a; --text: #e2e8f0; --accent: #38bdf8; }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: var(--bg); color: var(--text); font-family: system-ui; display: flex; height: 100vh; }
    #panel { width: 300px; padding: 16px; overflow-y: auto; border-right: 1px solid #334155; }
    #canvas-container { flex: 1; position: relative; }
    .slider-group { margin: 12px 0; }
    .slider-label { font-size: 12px; color: #94a3b8; display: flex; justify-content: space-between; }
    input[type=range] { width: 100%; }
    #formula { padding: 12px; background: #1e293b; border-radius: 8px; margin: 12px 0; }
    #fps { position: absolute; top: 8px; left: 8px; font-size: 10px; color: #64748b; font-family: monospace; }
    #quiz-btn { position: fixed; bottom: 16px; right: 16px; background: var(--accent); color: #0f172a; border: none; padding: 8px 16px; border-radius: 20px; cursor: pointer; }
    #quiz-panel { display: none; position: fixed; bottom: 60px; right: 16px; width: 360px; height: 380px; background: #1e293b; border-radius: 12px; padding: 16px; }
  </style>
</head>
<body>
<div id="panel">
  <h2 style="color: var(--accent); font-size: 16px;">Simple Harmonic Motion</h2>
  <p style="font-size: 12px; color: #94a3b8;">Spring-mass oscillation</p>

  <div id="formula"></div>

  <div class="slider-group">
    <div class="slider-label">Spring constant k <span id="k-val">5.0 N/m</span></div>
    <input type="range" id="sl-k" min="1" max="20" value="5" step="0.5">
  </div>
  <div class="slider-group">
    <div class="slider-label">Mass m <span id="m-val">1.0 kg</span></div>
    <input type="range" id="sl-m" min="0.1" max="5" value="1" step="0.1">
  </div>
  <div class="slider-group">
    <div class="slider-label">Amplitude A <span id="a-val">2.0 m</span></div>
    <input type="range" id="sl-a" min="0.5" max="5" value="2" step="0.1">
  </div>

  <div style="background:#1e293b;border-radius:8px;padding:12px;margin-top:12px;">
    <h3 style="font-size:12px;color:#94a3b8;">Knowledge Card</h3>
    <p style="font-size:11px;margin-top:8px;">Hooke's Law: F = -kx. The restoring force is proportional to displacement.</p>
  </div>
</div>

<div id="canvas-container">
  <div id="fps">FPS: --</div>
</div>

<button id="quiz-btn" onclick="document.getElementById('quiz-panel').style.display='block'">Quiz</button>
<div id="quiz-panel">
  <h3>Question</h3>
  <p>If you double the spring constant, what happens to the period?</p>
  <button onclick="this.style.background='#22c55e'">Decreases by √2</button>
  <button onclick="this.style.background='#ef4444'">Doubles</button>
</div>

<script>
'use strict';
document.addEventListener('DOMContentLoaded', () => {
  try {
    const container = document.getElementById('canvas-container');
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f172a);

    const camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(0, 5, 15);

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // Lights
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.0);
    keyLight.position.set(5, 10, 7);
    scene.add(keyLight);
    const fillLight = new THREE.DirectionalLight(0xffffff, 0.4);
    fillLight.position.set(-5, 5, -5);
    scene.add(fillLight);
    const ambient = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambient);

    // Grid
    const grid = new THREE.GridHelper(20, 20, 0x334155, 0x1e293b);
    scene.add(grid);

    // Mass (sphere)
    const massMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.5, metalness: 0 });
    const massMesh = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), massMat);
    scene.add(massMesh);

    // Spring line
    const springMat = new THREE.LineBasicMaterial({ color: 0x94a3b8 });
    const springGeo = new THREE.BufferGeometry();
    const springLine = new THREE.Line(springGeo, springMat);
    scene.add(springLine);

    let k = 5, m = 1, amp = 2;
    const clock = new THREE.Clock();
    let frameCount = 0, lastFps = performance.now();

    // KaTeX formula
    const formulaEl = document.getElementById('formula');
    function updateFormula() {
      const omega = Math.sqrt(k / m);
      const period = 2 * Math.PI / omega;
      katex.render('x(t) = A\\\\cos(\\\\omega t)', formulaEl, { displayMode: true });
    }
    updateFormula();

    // Sliders
    document.getElementById('sl-k').addEventListener('input', function() {
      k = +this.value;
      document.getElementById('k-val').textContent = k.toFixed(1) + ' N/m';
      updateFormula();
    });
    document.getElementById('sl-m').addEventListener('input', function() {
      m = +this.value;
      document.getElementById('m-val').textContent = m.toFixed(1) + ' kg';
      updateFormula();
    });
    document.getElementById('sl-a').addEventListener('input', function() {
      amp = +this.value;
      document.getElementById('a-val').textContent = amp.toFixed(1) + ' m';
    });

    // Resize
    window.addEventListener('resize', () => {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    });

    // Animation
    renderer.setAnimationLoop(() => {
      const t = clock.getElapsedTime();
      const delta = Math.min(clock.getDelta(), 0.05);
      const omega = Math.sqrt(k / m);
      const x = amp * Math.cos(omega * t);
      massMesh.position.set(x, 1, 0);

      controls.update();
      renderer.render(scene, camera);

      frameCount++;
      if (performance.now() - lastFps >= 1000) {
        document.getElementById('fps').textContent = 'FPS: ' + frameCount;
        frameCount = 0;
        lastFps = performance.now();
      }
    });
  } catch (e) {
    const c = document.getElementById('canvas-container');
    if (c) c.innerHTML = '<p style="color:#EF4444;padding:2rem;">Error: ' + e.message + '</p>';
    console.error(e);
  }
});
<\/script>
</body>
</html>`;

async function main() {
  console.log('=== UPG E2E Pipeline Test ===\n');

  // Step 1: Sanitize
  console.log('1. Sanitizing HTML...');
  const { sanitized, issues: sanitizeIssues } = sanitizeHtml(SAMPLE_HTML);
  console.log(`   Size: ${sanitized.length} chars`);
  console.log(`   Issues: ${sanitizeIssues.length === 0 ? 'none ✅' : sanitizeIssues.join(', ')}`);

  // Step 2: Quality check
  console.log('\n2. Quality check...');
  const quality = checkQuality(sanitized);
  console.log(`   Passed: ${quality.passed ? '✅' : '❌'}`);
  if (quality.issues.length) console.log(`   Issues: ${quality.issues.join('; ')}`);
  if (quality.warnings.length) console.log(`   Warnings: ${quality.warnings.join('; ')}`);

  // Step 3: Validation
  console.log('\n3. Full validation...');
  const validation = runFullValidation(sanitized);
  console.log(`   Overall score: ${validation.overallScore}/100`);
  for (const [key, val] of Object.entries(validation.details || {})) {
    if (typeof val === 'object' && val && 'score' in val) {
      console.log(`   ${key}: ${(val as any).score}/100`);
    }
  }

  // Step 4: Save to DB
  console.log('\n4. Saving to database...');
  const genId = getUuid();
  try {
    const saved = await createUpgGeneration({
      id: genId,
      userId: null, // anonymous
      prompt: 'Simple harmonic motion of a spring-mass system',
      promptHash: 'test-e2e-' + Date.now(),
      language: 'en',
      model: 'claude-sonnet-4-6',
      provider: 'anthropic',
      status: 'completed',
      htmlContent: sanitized,
      htmlSize: new TextEncoder().encode(sanitized).length,
      inputTokens: 1500,
      outputTokens: 3000,
      validationScore: validation.overallScore,
      validationDetails: JSON.stringify(validation.details),
      validatedAt: new Date(),
    });
    console.log(`   Saved: id=${saved.id} ✅`);

    // Step 5: Read back
    console.log('\n5. Reading back from database...');
    const fetched = await findUpgGenerationById(genId);
    if (fetched) {
      console.log(`   Found: id=${fetched.id}, status=${fetched.status}, htmlSize=${fetched.htmlContent?.length} ✅`);
      console.log(`   Prompt: "${fetched.prompt}"`);
      console.log(`   Validation score: ${fetched.validationScore}`);
    } else {
      console.log('   ❌ NOT FOUND');
    }

    // Step 6: Cleanup
    console.log('\n6. Cleaning up (soft delete)...');
    await softDeleteUpgGeneration(genId);
    const afterDelete = await findUpgGenerationById(genId);
    console.log(`   After delete: ${afterDelete ? '❌ still visible' : 'correctly hidden ✅'}`);

  } catch (err: any) {
    console.log(`   ❌ DB error: ${err.message}`);
    if (err.message.includes('connect')) {
      console.log('   (Is PostgreSQL running? Check DATABASE_URL in .env)');
    }
  }

  console.log('\n=== E2E Test Complete ===');
  process.exit(0);
}

main().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});
