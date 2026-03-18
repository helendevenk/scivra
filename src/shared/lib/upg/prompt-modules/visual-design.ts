/**
 * Visual Design System for UPG System Prompt
 *
 * Sources:
 * - AetherViz SKILL.md (392 lines): Complete CSS variable system, layout blueprint, glassmorphism
 * - NeonPhysics edu-academic theme: Subject color palette
 */

export function getVisualDesignPrompt(): string {
  return `
## VISUAL DESIGN SYSTEM

### Color Variables (use CSS custom properties)

\`\`\`css
:root {
  /* Background — NOT pure black. Use dark slate so 3D objects have contrast */
  --bg-primary: #0f172a;
  --bg-card: rgba(255, 255, 255, 0.10);
  --bg-panel: rgba(22, 78, 99, 0.75);

  /* Text */
  --text-primary: #F8FAFC;
  --text-secondary: #CBD5E1;
  --text-muted: #94A3B8;

  /* Glassmorphism */
  --glass-bg: rgba(255, 255, 255, 0.10);
  --glass-border: 1px solid rgba(255, 255, 255, 0.18);
  --glass-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  --glass-blur: blur(10px);
  --glass-radius: 12px;

  /* Subject theme (auto-select based on topic) */
  --theme-physics: linear-gradient(135deg, #3B82F6 0%, #0EA5E9 100%);
  --theme-chemistry: linear-gradient(135deg, #F59E0B 0%, #EF4444 100%);
  --theme-biology: linear-gradient(135deg, #10B981 0%, #22D3EE 100%);
  --theme-math: linear-gradient(135deg, #F59E0B 0%, #EAB308 100%);
  --theme-astronomy: linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%);
  --theme-engineering: linear-gradient(135deg, #06B6D4 0%, #14B8A6 100%);

  /* Accent for neon highlights */
  --accent-cyan: #22D3EE;
  --accent-emerald: #34D399;
  --accent-amber: #FBBF24;
  --accent-rose: #FB7185;

  /* Functional */
  --success: #22C55E;
  --warning: #F59E0B;
  --error: #EF4444;
  --info: #3B82F6;

  /* Slider */
  --slider-track: rgba(255, 255, 255, 0.2);
  --slider-thumb: var(--accent-cyan);
}
\`\`\`

### Glassmorphism Card Pattern (apply to ALL cards and panels)

\`\`\`css
.glass-card {
  background: var(--glass-bg);
  border: var(--glass-border);
  box-shadow: var(--glass-shadow);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  border-radius: var(--glass-radius);
  padding: 1.25rem;
}
\`\`\`

### PAGE LAYOUT BLUEPRINT (five-zone structure)

\`\`\`
┌─────────────────────────────────────────────────┐
│  TITLE BAR (subject gradient background)         │
│  Icon + Title (zh/en) + One-line description     │
├────────────┬────────────────────────────────────┤
│ LEFT PANEL │  MAIN CANVAS                        │
│ (30%)      │  (70%)                              │
│ collapsible│  Three.js / SVG                     │
│            │  OrbitControls                       │
│ - Formulas │  FPS counter (top-left)             │
│ - Concepts │                                     │
│ - Cards    │                                     │
├────────────┴────────────────────────────────────┤
│  CONTROL PANEL (glassmorphism)                   │
│  3+ sliders | Play/Pause | Reset | Random        │
│  Each slider: label + value + unit               │
├──────────────────────────────────────────────────┤
│  QUIZ PANEL (collapsible, bottom-right float)    │
│  Hidden → floating button with quiz icon         │
│  Expanded → 360px wide, max 380px tall           │
│  Transition: all 0.3s ease                       │
└──────────────────────────────────────────────────┘
\`\`\`

Desktop: side-by-side (30% + 70%)
Mobile (@media max-width: 768px): stack vertically, canvas 50vh, full-width panels

### Subject Color Auto-Selection

Detect subject from topic keywords and apply the matching gradient to the title bar background. Map:
- Physics keywords (force, motion, energy, wave, electric, magnetic, gravity, quantum, relativity) → --theme-physics
- Chemistry keywords (molecule, reaction, atom, bond, element, acid, base, solution) → --theme-chemistry
- Biology keywords (cell, DNA, protein, evolution, ecology, photosynthesis, organ) → --theme-biology
- Math keywords (function, equation, geometry, calculus, algebra, probability, proof) → --theme-math
- Astronomy keywords (planet, star, galaxy, orbit, universe, black hole, telescope) → --theme-astronomy
- Engineering keywords (circuit, signal, bridge, engine, robot, code, algorithm) → --theme-engineering

### Styled Scrollbar

\`\`\`css
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: rgba(255,255,255,0.05); }
::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.3); }
\`\`\`

### Slider Styling

\`\`\`css
input[type="range"] {
  -webkit-appearance: none;
  width: 100%;
  height: 4px;
  background: var(--slider-track);
  border-radius: 2px;
  outline: none;
}
input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 16px;
  height: 16px;
  background: var(--slider-thumb);
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 0 8px rgba(34, 211, 238, 0.5);
}
\`\`\`
`;
}
