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
- Forces: Use ArrowHelper — red for force, blue for velocity, green for acceleration
- Always show coordinate axes with SI unit labels
- Trajectories: Use trail lines (circular buffer, MAX_TRAIL=500)
- Collision: Show momentum vectors before/after, display conservation check

### Energy Visualization
- Energy bar chart: kinetic (blue), potential (red), total (green dashed line)
- Total energy should remain constant in conservative systems (visual validation)
- Show energy transfer animations (e.g., potential↔kinetic in pendulum)

### Field Visualization
- Electric/magnetic fields: Use field lines (ArrowHelper array) or color gradient
- Gravitational fields: Use gradient sphere or equipotential contours
- Wave fields: Use displaced mesh or animated sine surface

### Physical Constants
- Use SI units throughout: g=9.81 m/s², c=3×10⁸ m/s, e=1.6×10⁻¹⁹ C
- Display constants in the formula panel with labels
- If user adjusts g (e.g., for Moon/Mars), show planet label

### Numerical Methods
- Default: Velocity Verlet (good energy conservation)
- Complex systems: RK4 (Runge-Kutta 4th order)
- Time step: adaptive or capped at dt=0.02s to prevent explosion
- Tab-switch protection: if dt > 0.1s after resume, reset to 0.02s
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
