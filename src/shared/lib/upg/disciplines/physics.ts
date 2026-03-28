import type { DisciplineConfig } from './types';
import { physicsValidationRules } from '../validation/physics-validator';

export const physicsConfig: DisciplineConfig = {
  id: 'physics',
  name: { en: 'Physics', zh: '物理' },
  icon: 'Atom',
  themeColor: 'oklch(0.50 0.20 250)',
  cssGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  enabled: true,
  stage: 'S1',

  systemPromptModule: `
## Physics-Specific Visualization Requirements

### Force & Motion Visualization
- Do NOT use ArrowHelper for velocity/force vectors — they rotate with the object angle
  and confuse students (looks like a bug). Display velocity/force as numbers in the data dashboard.
- ArrowHelper is acceptable ONLY for static force diagrams (free body diagrams) where the arrow
  direction is fixed and does not animate.
- Always show coordinate axes with SI unit labels
- Trajectories: Use trail lines (circular buffer, MAX_TRAIL=500)
- Collision: Show momentum vectors before/after, display conservation check

### Energy Dashboard (Physics-Specific)
- Top-right overlay panel with horizontal bar chart:
  - KE (blue #3B82F6) — kinetic energy
  - PE (red #EF4444) — potential energy
  - Total (green #22C55E) — should be constant in conservative systems
- Bar width = percentage of total energy
- Display numeric values (e.g., "KE: 0.42 J") next to each bar
- Total energy staying constant is a visual validation for students
- Energy formula: E = K + U = ½mv² + mgh = const (NOT "E = mgh = ½mv²" which implies KE equals PE)

### Field Visualization
- Electric/magnetic fields: Use field lines (ArrowHelper array) or color gradient
- Gravitational fields: Use gradient sphere or equipotential contours
- Wave fields: Use displaced mesh or animated sine surface

### Physical Constants
- Use SI units throughout: g=9.81 m/s², c=3×10⁸ m/s, e=1.6×10⁻¹⁹ C
- Display constants in the formula panel with labels
- If user adjusts g (e.g., for Moon/Mars), show planet label

### Numerical Methods — Code Templates

#### Velocity Verlet Integration (DEFAULT — use instead of Euler)

Second-order accuracy, conserves energy — critical for pendulums, orbits, springs.

\`\`\`javascript
function verletStep(dt) {
  const a1 = getAcceleration(pos, vel);
  const velHalf = vel + 0.5 * a1 * dt;
  pos += velHalf * dt;
  const a2 = getAcceleration(pos, velHalf);
  vel = velHalf + 0.5 * a2 * dt;
}
\`\`\`

#### Adaptive Sub-Stepping (MANDATORY)

Never run physics with raw frame deltaTime. Always sub-step:

\`\`\`javascript
function physicsUpdate(dt) {
  const maxSubStep = 0.002; // 2ms per step
  const steps = Math.ceil(dt / maxSubStep);
  const subDt = dt / steps;
  for (let i = 0; i < steps; i++) {
    verletStep(subDt);
  }
}
\`\`\`

#### Damping Parameter
Include a "Damping" slider (0 to 0.5, default 0) when the system has dissipation.
Implementation: add \`-damping * velocity\` term to acceleration function.

- Complex systems: RK4 (Runge-Kutta 4th order)
- Tab-switch protection: if dt > 0.1s after resume, cap to 0.02s

### Period Measurement (for oscillating systems)

- Detect zero-crossings (e.g., angle crosses 0 going in the same direction)
- Time the interval between two consecutive same-direction crossings = one full period
- Display "Measured T" alongside "Theoretical T" in stats panel
- This teaches: theory is approximation (small angle), simulation solves full nonlinear equation

### Physics Preset Examples (reference for AI)

| Topic | Suggested Presets |
|-------|------------------|
| Pendulum | Earth (default), Moon (g=1.6), Mars (g=3.7), Large Angle (θ=80°) |
| Projectile | Baseball, Cannonball, 45° Optimal, Moon Shot |
| Spring | Soft/Stiff/Heavy/Critical Damping |
| Wave | Low/High Freq, Constructive/Destructive |
| Circuit | LED, Motor, Heater |
`,

  visualizationHints: `
### Physics Visualization Mode Selection
- **3D mode** (default): projectile motion, orbital mechanics, EM fields, wave propagation,
  pendulum, spring-mass, collisions, rigid body rotation
- **SVG mode**: circuit diagrams, phase space plots, energy level diagrams,
  P-V diagrams, free body diagrams
- **Hybrid mode**: pendulum (3D + energy graph), spring (3D + x(t)/v(t) plots),
  wave (3D surface + intensity cross-section), circuits (SVG schematic + V/I graphs)
`,

  analyticalSolutions: `
## Analytical Solution Overlay (MANDATORY for Physics)

When the physical system has a known closed-form solution, you MUST:
1. Compute the analytical prediction alongside the numerical simulation
2. Plot BOTH on the same graph — "Numerical" (solid line) vs "Analytical" (dashed line)
3. Include a legend distinguishing them
4. Use different colors (numerical: primary blue, analytical: orange dashed)

### Reference Solutions (use when applicable):

| System | Analytical Solution | Valid Range |
|--------|-------------------|-------------|
| Simple Pendulum | θ(t) = θ₀·cos(√(g/L)·t) | Small angle (θ < 15°) |
| Free Fall | y(t) = y₀ + v₀t - ½gt² | No air resistance |
| SHM (spring) | x(t) = A·cos(ωt + φ), ω = √(k/m) | Linear spring |
| Projectile | x = v₀cos(θ)t, y = v₀sin(θ)t - ½gt² | No drag |
| RC Circuit | V(t) = V₀·(1 - e^(-t/RC)) charging | Ideal components |
| Damped Oscillation | x(t) = A·e^(-γt)·cos(ωdt + φ) | Underdamped |
| Kepler Orbit | T² = (4π²/GM)·a³ | Two-body |
`,

  commonTopics: [
    { en: 'Simple Pendulum', zh: '简单摆', complexity: 'low' },
    { en: 'Projectile Motion', zh: '抛体运动', complexity: 'low' },
    { en: 'Spring-Mass System', zh: '弹簧-质量系统', complexity: 'low' },
    { en: 'Inclined Plane with Friction', zh: '有摩擦力的斜面', complexity: 'low' },
    { en: 'Free Fall with Air Resistance', zh: '有空气阻力的自由落体', complexity: 'medium' },
    { en: 'Double Pendulum (Chaos)', zh: '双摆（混沌）', complexity: 'high' },
    { en: 'Electromagnetic Wave', zh: '电磁波', complexity: 'medium' },
    { en: 'Lorentz Force on Charged Particle', zh: '带电粒子洛伦兹力', complexity: 'medium' },
    { en: "DC Circuit (Ohm's Law)", zh: '直流电路（欧姆定律）', complexity: 'medium' },
    { en: 'Wave Interference (Double Slit)', zh: '波的干涉（双缝）', complexity: 'medium' },
    { en: 'Orbital Mechanics', zh: '轨道力学', complexity: 'high' },
    { en: 'Standing Waves on a String', zh: '弦上驻波', complexity: 'low' },
    { en: "Coulomb's Law", zh: '库仑定律', complexity: 'medium' },
    { en: "Faraday's Law of Induction", zh: '法拉第电磁感应', complexity: 'medium' },
  ],

  qualityRules: [
    {
      id: 'physics-has-units',
      description: 'Physics simulation must display units',
      severity: 'warning',
      check: (html) => {
        const unitPatterns = /\b(m\/s|kg|N|J|W|Pa|Hz|rad|°|m²|m³)\b/;
        return {
          passed: unitPatterns.test(html),
          message: 'No SI unit labels detected in HTML',
        };
      },
    },
    {
      id: 'physics-has-formula',
      description: 'Must contain at least one physics formula (KaTeX)',
      severity: 'warning',
      check: (html) => {
        const hasKatex = /katex\.render|\\frac|\\vec|\\sum|\\int|\\Delta/.test(html);
        return {
          passed: hasKatex,
          message: 'No KaTeX physics formulas detected',
        };
      },
    },
  ],

  // Phase 3.5: physics validation rules
  validationRules: physicsValidationRules,
  validationThreshold: 60,

  additionalCdnLibs: [],

  curriculumStandards: [
    {
      standard: 'AP_PHYSICS_1',
      topics: [
        'Kinematics', 'Dynamics', 'Circular Motion', 'Energy',
        'Momentum', 'Simple Harmonic Motion', 'Torque', 'Waves',
      ],
    },
    {
      standard: 'AP_PHYSICS_2',
      topics: [
        'Fluids', 'Thermodynamics', 'Electric Force/Field/Potential',
        'DC Circuits', 'Magnetism', 'EM Induction', 'Optics',
        'Quantum/Atomic/Nuclear',
      ],
    },
    {
      standard: 'NGSS',
      topics: [
        'PS2: Motion and Stability', 'PS3: Energy',
        'PS4: Waves', 'PS1: Matter',
      ],
    },
  ],
};
