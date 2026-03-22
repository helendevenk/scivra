/**
 * Autopilot DOM Prompt Module
 *
 * Injected into the UPG system prompt to instruct the LLM to annotate
 * all interactive elements with data-autopilot attributes, enabling the
 * AI tutor to read state and execute actions programmatically.
 */
export function getAutopilotDomPrompt(): string {
  return `
## AUTOPILOT DOM ANNOTATIONS (MANDATORY)

Every interactive element MUST include data-autopilot attributes so the AI Tutor can read state and control the visualization programmatically.

### Sliders
Each \`<input type="range">\` MUST have:
\`\`\`html
<input type="range"
  data-autopilot="slider-{camelCaseName}"
  data-slider-label="Human-readable label"
  data-slider-unit="unit string (e.g. m/s, Hz, N)"
  data-slider-min="{min value}"
  data-slider-max="{max value}"
  min="..." max="..." step="..." value="..."
/>
\`\`\`
Examples: \`data-autopilot="slider-frequency"\`, \`data-autopilot="slider-amplitude"\`, \`data-autopilot="slider-mass"\`

### Buttons
Standard control buttons MUST have:
\`\`\`html
<button data-autopilot="btn-play">Play</button>
<button data-autopilot="btn-pause">Pause</button>
<button data-autopilot="btn-reset">Reset</button>
<button data-autopilot="btn-random">Random Experiment</button>
\`\`\`

### Quiz Panel
The quiz section MUST be annotated:
\`\`\`html
<div data-autopilot="quiz-panel">
  <p data-autopilot="quiz-question">Question text here</p>
  <div data-autopilot="quiz-option-0" class="quiz-option">Option A</div>
  <div data-autopilot="quiz-option-1" class="quiz-option">Option B</div>
  <div data-autopilot="quiz-option-2" class="quiz-option">Option C</div>
  <div data-autopilot="quiz-option-3" class="quiz-option">Option D</div>
</div>
\`\`\`

### Title
The main visualization title MUST have:
\`\`\`html
<h1 data-autopilot="title">Visualization Title</h1>
\`\`\`
(or whichever heading element contains the main title)

### postMessage Communication
The AI Tutor communicates with the visualization via postMessage. You MUST allow postMessage:
- Do NOT block postMessage calls in the visualization code
- The tutor script is injected externally and communicates through \`window.addEventListener('message', ...)\`

These annotations are required for the AI Tutor feature. Missing annotations mean the tutor cannot guide students through the experiment.
`.trim();
}
