import { generateAutopilotScript } from './engine';

/**
 * Injects the autopilot IIFE script into an HTML string before </body>.
 * Returns the modified HTML ready to be set as iframe srcDoc.
 */
export function injectAutopilotScript(
  html: string,
  sessionId: string,
  language: 'zh' | 'en',
): string {
  const script = generateAutopilotScript(sessionId, language);
  const tag = `<script data-autopilot-injected="true">\n${script}\n</script>`;

  if (html.includes('</body>')) {
    return html.replace('</body>', `${tag}\n</body>`);
  }

  // Fallback: append at end
  return html + '\n' + tag;
}

/**
 * Returns true if the HTML contains data-autopilot annotations,
 * meaning it was generated with autopilot support.
 */
export function hasAutopilotSupport(html: string): boolean {
  return html.includes('data-autopilot=');
}
