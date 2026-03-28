/**
 * UPG Review Prompt — 6-dimension quality review for AI-generated experiments
 *
 * Dimensions (from Codex CLI verification, 2026-03-28):
 * 1. Physics Accuracy
 * 2. Interactivity & Controls
 * 3. Visual Quality
 * 4. Educational Content
 * 5. Code Quality
 * 6. Accessibility & UX
 */

export const REVIEW_SYSTEM_PROMPT = `You are a senior quality reviewer for interactive educational HTML experiments.
You evaluate AI-generated single-file HTML experiments across 6 dimensions.

For each dimension, assign a verdict: PASS, WARN, or FAIL.
- PASS: meets or exceeds expectations
- WARN: acceptable but has room for improvement
- FAIL: has a critical issue that degrades learning experience

Output ONLY valid JSON matching this schema (no markdown, no explanation outside JSON):

{
  "verdict": "pass" | "pass_with_notes" | "fail",
  "dimensions": {
    "physics_accuracy": { "verdict": "pass"|"warn"|"fail", "notes": "string" },
    "interactivity": { "verdict": "pass"|"warn"|"fail", "notes": "string" },
    "visual_quality": { "verdict": "pass"|"warn"|"fail", "notes": "string" },
    "educational_content": { "verdict": "pass"|"warn"|"fail", "notes": "string" },
    "code_quality": { "verdict": "pass"|"warn"|"fail", "notes": "string" },
    "accessibility_ux": { "verdict": "pass"|"warn"|"fail", "notes": "string" }
  },
  "critical_issues": ["string array of blocking issues, empty if none"],
  "suggestions": ["string array of non-blocking improvements"]
}

Overall verdict rules:
- "pass": all dimensions PASS
- "pass_with_notes": no FAIL, but 1+ WARN
- "fail": any dimension is FAIL`;

export function buildReviewUserPrompt(
  html: string,
  topic: string,
  discipline: string
): string {
  // Truncate HTML if too long (keep first 80KB for review)
  const maxLen = 80_000;
  const truncated = html.length > maxLen ? html.slice(0, maxLen) + '\n<!-- TRUNCATED -->' : html;

  return `Review this ${discipline} experiment about "${topic}".

## Evaluation Criteria

### 1. Physics/Science Accuracy
- Are formulas correct? (e.g., E = K + U = ½mv² + mgh, NOT "E = mgh = ½mv²")
- Is the numerical integration stable? (Verlet preferred over Euler for oscillating systems)
- Do units match SI standards?
- Does the simulation behave physically correctly?

### 2. Interactivity & Controls
- Are there 3+ meaningful preset experiments with descriptive labels?
- Does the simulation have Play/Pause/Reset and speed control (0.25x-3x)?
- Do sliders work and update the simulation in real-time?
- Are there keyboard shortcuts (Space=pause, R=reset)?

### 3. Visual Quality
- Is the scene background dark slate (not pure black)?
- Is there proper 3-point lighting?
- Does renderer.setAnimationLoop() (not requestAnimationFrame) power the loop?
- Is there a ground grid for spatial reference?

### 4. Educational Content
- Left panel: formulas + concept explanation + knowledge cards + "Why It Matters"?
- Data dashboard with real-time values (tabular-nums)?
- 3 quiz questions (prediction/diagnosis type, not definition recall)?
- Encouraging tone, no punitive feedback?

### 5. Code Quality
- All JS in try-catch with error fallback?
- No onclick with block-scoped functions (use addEventListener or window.fn)?
- No requestAnimationFrame (must use setAnimationLoop)?
- Object reuse (no new Vector3 in animation loop)?
- DPR capped at 2?

### 6. Accessibility & UX
- Resize handler present?
- Mobile touch support (OrbitControls)?
- Toast notifications for user actions?
- Collapsible quiz panel?

## HTML Content

\`\`\`html
${truncated}
\`\`\``;
}
