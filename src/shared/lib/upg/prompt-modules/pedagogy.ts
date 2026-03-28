/**
 * Pedagogy & Educational Design Module for UPG System Prompt
 *
 * Universal teaching framework — discipline-agnostic.
 * All physics/chemistry/biology-specific content belongs in disciplines/*.ts
 *
 * CTO Decision D1: Only write cross-discipline teaching principles here.
 * CTO Decision D3: Keep ~150 lines / ~1000 tokens.
 */

export function getPedagogyPrompt(): string {
  return `
## PEDAGOGY & EDUCATIONAL DESIGN (MANDATORY)

### Teaching Tone
- Encouraging, rigorous but approachable — like a smart lab partner, not a professor
- Every interaction gives instant feedback (toast notification on preset/reset/speed change)
- Left panel text should answer three questions in order:
  1. "What is this?" (1-2 sentences, plain language definition)
  2. "Why should I care?" (real-world application or exam relevance)
  3. "How does the math describe it?" (formula + variable explanation)
- Include a motivational closing line at the end of the HTML (e.g., "Keep exploring!")

### Left Panel Content Structure (ALL sections in this order)

1. **Core Formulas** (2-4 KaTeX rendered formulas)
   - Each formula MUST have a one-line plain-English description below it
   - Show the governing equation first, derived quantities second

2. **Concept Explanation** (2-3 paragraphs, ~150 words total)
   - Paragraph 1: What this phenomenon IS, in everyday language
   - Paragraph 2: Key insight — what's surprising or counterintuitive about it
   - Paragraph 3: Where this matters in real life (engineering, nature, technology)
   - Use <strong> tags to highlight key terms

3. **Knowledge Cards** (2-3 glass-card elements with colored left border)
   - Card topics: a historical fact, a common misconception, or an advanced connection
   - Keep each card to 2-3 sentences max

4. **Why It Matters** section
   - 2-3 bullet points connecting to real-world applications
   - At least one AP/exam connection if the topic aligns with a curriculum standard

### Data Dashboard (MANDATORY for dynamic simulations)

Display a real-time statistics overlay on the 3D canvas:

- **Top-left overlay panel** (semi-transparent glass style):
  - 4-6 key quantities relevant to the simulation, each as: Label | Value + Unit
  - Values MUST use \`font-variant-numeric: tabular-nums\` for stable layout
  - Update every animation frame
  - Format: 2-3 decimal places, scientific notation for very large/small

- The specific quantities, energy panels, and measurement tools are defined
  by the discipline configuration. Follow discipline-specific instructions.

### Experiment Presets (MANDATORY, minimum 3, recommended 5)

Besides the "Random" button, include 3+ meaningful preset experiments:

- Each preset MUST have a descriptive label (e.g., "Moon (g=1.6)", NOT "Preset 1")
- Presets should cover: default scenario + 2 contrasting variations with educational value
- The student should wonder "why does it behave differently here?"
- Use styled buttons (\`.btn-preset\`) or a dropdown, grouped near Play/Pause/Reset
- Apply preset by updating all slider values + triggering a simulation reset
- Specific preset suggestions are provided by the discipline configuration

### Speed Control (for dynamic simulations)

Provide simulation speed multiplier:
- Display 4-5 speed options: 0.25x, 0.5x, 1x, 2x, 3x
- Use styled button group, highlight the active speed
- Implementation: multiply deltaTime by speed factor before passing to physics step
- 0.25x is critical for observing fast phenomena in slow motion
- Default: 1x

Skip for static/non-animated visualizations (e.g., Punnett Square, crystal structure viewer).

### Quiz Design Standards

**Quantity:** 3 questions per experiment.

**Question types (in order of educational value):**
1. **Prediction/Application** (BEST): "If you change X, what happens to Y? Why?"
   - Present a scenario the student hasn't directly seen in the simulation
2. **Debugging/Diagnosis**: "A student observes X. What's the most likely cause?"
3. **Conceptual/Tradeoff**: "Why does the formula use sin(θ) instead of θ?"

**What NOT to quiz:**
- Definition recall ("What does T stand for?")
- Formula memorization ("What is the formula for period?")

**Answer feedback:**
- Correct: brief reinforcement of the underlying principle (1 sentence)
- Wrong: encouraging + educational explanation of WHY it's wrong (2-3 sentences)
- Never punitive tone. Never numeric scores ("2/3 correct")

**Implementation:** Radio buttons with "Check" button per question.
Instant color feedback: green background for correct, red for wrong.

### Keyboard Shortcuts (for dynamic simulations)

- **Space**: Toggle Play/Pause
- **R**: Reset simulation
- **1-5**: Speed presets (0.25x, 0.5x, 1x, 2x, 3x)
Display shortcut hints in the About dialog or as a small overlay.

### Toast Notifications

Show brief toast messages for user actions:
- "Simulation reset" / "Speed: 0.25x" / "Preset: Moon (g=1.6 m/s²)"
- Fixed position top-right, auto-dismiss after 2s, slide-in animation

### Avoid (DO NOT generate these patterns)

- **No ArrowHelper for velocity/force vectors** unless the discipline config explicitly requests it.
  Velocity arrows that rotate with the pendulum angle confuse students — they look like bugs.
  Use the data dashboard to display velocity/force as numbers instead.
- **No \`Math.sign()\` in direction calculations** — Math.sign(0) = 0 produces NaN after normalize().
- **No decorative elements** that don't serve a teaching purpose (floating particles, background stars
  for non-astronomy topics, lens flares, etc.)
- **No placeholder text** like "Lorem ipsum" or "Description goes here"
- **No duplicate formulas** — don't show the same formula in both the left panel and control panel
- **No HTML onclick with try-catch scoped functions** — if all JS is inside a try{} block,
  functions defined with const/let are block-scoped and invisible to onclick="fn()".
  EITHER: use addEventListener in JS (preferred), OR add \`window.fn = fn;\` before the catch block
  to expose needed functions to global scope. This is the #1 cause of "buttons don't work" bugs.
`;
}
