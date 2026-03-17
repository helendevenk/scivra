/**
 * Three.js Visual Effects for UPG System Prompt
 *
 * Sources:
 * - threejs-shaders (S-tier 9.0): Fresnel, noise, dissolve, edge glow GLSL
 * - threejs-geometry (A-tier 8.5): BufferGeometry particles, InstancedMesh
 * - threejs-animation (A-tier 8.5): Spring physics, damping, oscillation
 * - 3d-graphics/09-postprocessing: Bloom parameters
 */

export function getThreejsEffectsPrompt(): string {
  return `
## PARTICLE SYSTEM (Points + BufferGeometry)

For any scene involving particles, gas, dust, energy fields, or many small objects:

\`\`\`javascript
function createParticles(count, spread, color) {
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const velocities = new Float32Array(count * 3); // store in JS, not as attribute

  for (let i = 0; i < count * 3; i += 3) {
    positions[i]     = (Math.random() - 0.5) * spread;
    positions[i + 1] = (Math.random() - 0.5) * spread;
    positions[i + 2] = (Math.random() - 0.5) * spread;
    velocities[i]     = (Math.random() - 0.5) * 0.02;
    velocities[i + 1] = (Math.random() - 0.5) * 0.02;
    velocities[i + 2] = (Math.random() - 0.5) * 0.02;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({
    size: 0.1,
    color: color,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true
  });

  const points = new THREE.Points(geometry, material);
  return { mesh: points, positions, velocities };
}

// Update in animation loop:
function updateParticles(particleData) {
  const pos = particleData.positions;
  const vel = particleData.velocities;
  for (let i = 0; i < pos.length; i++) {
    pos[i] += vel[i];
  }
  particleData.mesh.geometry.attributes.position.needsUpdate = true;
}
\`\`\`

## TRAIL LINE (Fixed-Length Buffer)

For trajectory visualization (projectile, orbit, electron path):

\`\`\`javascript
const MAX_TRAIL = 500;
const trailGeo = new THREE.BufferGeometry();
const trailPos = new Float32Array(MAX_TRAIL * 3);
trailGeo.setAttribute('position', new THREE.BufferAttribute(trailPos, 3));
trailGeo.setDrawRange(0, 0);

const trail = new THREE.Line(trailGeo, new THREE.LineBasicMaterial({
  color: 0x3B82F6, transparent: true, opacity: 0.6
}));
scene.add(trail);

let trailCount = 0;
function addTrailPoint(x, y, z) {
  const p = trail.geometry.attributes.position.array;
  if (trailCount >= MAX_TRAIL) {
    for (let i = 0; i < (MAX_TRAIL - 1) * 3; i++) p[i] = p[i + 3];
    trailCount = MAX_TRAIL - 1;
  }
  p[trailCount * 3] = x;
  p[trailCount * 3 + 1] = y;
  p[trailCount * 3 + 2] = z;
  trailCount++;
  trail.geometry.setDrawRange(0, trailCount);
  trail.geometry.attributes.position.needsUpdate = true;
}
\`\`\`

## VECTOR VISUALIZATION (ArrowHelper)

For force, velocity, acceleration vectors in physics simulations:

\`\`\`javascript
// Color convention:
// Force → red #EF4444
// Velocity → blue #3B82F6
// Acceleration → green #22C55E

function createVector(origin, direction, length, color) {
  const dir = direction.clone().normalize();
  const arrow = new THREE.ArrowHelper(dir, origin, length, color, length * 0.2, length * 0.1);
  scene.add(arrow);
  return arrow;
}

// Update dynamically:
function updateVector(arrow, origin, direction, length) {
  arrow.position.copy(origin);
  arrow.setDirection(direction.clone().normalize());
  arrow.setLength(length, length * 0.2, length * 0.1);
}
\`\`\`

## INSTANCED MESH (50+ identical objects)

When rendering many copies of the same geometry (molecules, crystals, crowd):

\`\`\`javascript
const dummy = new THREE.Object3D();
const instancedMesh = new THREE.InstancedMesh(geometry, material, count);

for (let i = 0; i < count; i++) {
  dummy.position.set(/* per-instance position */);
  dummy.rotation.set(/* per-instance rotation */);
  dummy.updateMatrix();
  instancedMesh.setMatrixAt(i, dummy.matrix);
  instancedMesh.setColorAt(i, new THREE.Color(/* per-instance color */));
}
instancedMesh.instanceMatrix.needsUpdate = true;
if (instancedMesh.instanceColor) instancedMesh.instanceColor.needsUpdate = true;
scene.add(instancedMesh);
\`\`\`

## SHADER EFFECTS (for advanced visualizations)

### Fresnel Edge Glow (energy balls, force fields, plasma, electric fields)

\`\`\`javascript
const fresnelMaterial = new THREE.ShaderMaterial({
  uniforms: {
    baseColor: { value: new THREE.Color(0x0a0a3a) },
    glowColor: { value: new THREE.Color(0x3B82F6) },
    power: { value: 3.0 }
  },
  vertexShader: \\\`
    varying vec3 vNormal;
    varying vec3 vWorldPos;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  \\\`,
  fragmentShader: \\\`
    uniform vec3 baseColor;
    uniform vec3 glowColor;
    uniform float power;
    varying vec3 vNormal;
    varying vec3 vWorldPos;
    void main() {
      vec3 viewDir = normalize(cameraPosition - vWorldPos);
      float fresnel = pow(1.0 - max(0.0, dot(viewDir, vNormal)), power);
      gl_FragColor = vec4(mix(baseColor, glowColor, fresnel), 0.8 + fresnel * 0.2);
    }
  \\\`,
  transparent: true
});
\`\`\`

### Wave Displacement (wave functions, water surface, sound waves, EM waves)

\`\`\`javascript
const waveMaterial = new THREE.ShaderMaterial({
  uniforms: {
    time: { value: 0 },
    amplitude: { value: 0.5 },
    frequency: { value: 3.0 },
    colorA: { value: new THREE.Color(0x1E40AF) },
    colorB: { value: new THREE.Color(0x93C5FD) }
  },
  vertexShader: \\\`
    uniform float time, amplitude, frequency;
    varying vec2 vUv;
    varying float vDisp;
    void main() {
      vUv = uv;
      vec3 pos = position;
      vDisp = sin(pos.x * frequency + time) * amplitude
            + cos(pos.y * frequency * 0.7 + time * 0.8) * amplitude * 0.5;
      pos.z += vDisp;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  \\\`,
  fragmentShader: \\\`
    uniform vec3 colorA, colorB;
    varying vec2 vUv;
    varying float vDisp;
    void main() {
      float t = (vDisp + 1.0) * 0.5;
      gl_FragColor = vec4(mix(colorA, colorB, t), 0.85);
    }
  \\\`,
  transparent: true,
  side: THREE.DoubleSide
});
// Update: waveMaterial.uniforms.time.value = clock.getElapsedTime();
\`\`\`

### Noise Dissolve (chemical reactions, phase transitions, decay)

\`\`\`javascript
// In fragment shader:
// float n = fract(sin(dot(vUv, vec2(12.9898, 78.233))) * 43758.5453);
// if (n < progress) discard;
// float edge = smoothstep(progress, progress + 0.1, n);
// gl_FragColor = vec4(mix(edgeGlowColor, baseColor, edge), 1.0);
\`\`\`

### Shader Performance Rules
- Use step()/mix()/smoothstep() instead of if/else (avoid GPU branch divergence)
- Mobile precision fallback: \`#ifdef GL_FRAGMENT_PRECISION_HIGH\\nprecision highp float;\\n#else\\nprecision mediump float;\\n#endif\`
- Move complex math to JavaScript when possible, pass results via uniforms

## PHYSICS SIMULATION PATTERNS

### Spring Physics (oscillation, elastic collision, molecular bonds)

\`\`\`javascript
class Spring {
  constructor(stiffness = 100, damping = 10) {
    this.k = stiffness;
    this.d = damping;
    this.pos = 0;
    this.vel = 0;
    this.target = 0;
  }
  update(dt) {
    const force = -this.k * (this.pos - this.target) - this.d * this.vel;
    this.vel += force * dt;
    this.pos += this.vel * dt;
    return this.pos;
  }
}
\`\`\`

### Frame-Rate Independent Animation
- Always use \`clock.getDelta()\` for dt, never assume 16.67ms
- Cap delta: \`const dt = Math.min(delta, 0.05)\` to prevent physics explosion after tab switch
- Verlet integration for accurate orbits, Euler for simple approximation
`;
}
