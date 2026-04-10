import { describe, it, expect } from 'vitest';
import { sanitizeHtml } from '@/shared/lib/upg/html-sanitizer';

describe('HTML Sanitizer (Phase 1 Fix)', () => {
  it('should detect eval() calls', () => {
    const html = `
      <!DOCTYPE html>
      <html>
        <body>
          <script>
            const code = "alert(1)";
            eval(code);
          </script>
        </body>
      </html>
    `;

    const result = sanitizeHtml(html);
    expect(result.issues).toContain('Removed eval() calls');
    expect(result.sanitized).toContain('/* eval removed */');
  });

  it('should detect new Function() calls', () => {
    const html = `
      <!DOCTYPE html>
      <html>
        <body>
          <script>new Function('alert(1)')()</script>
        </body>
      </html>
    `;

    const result = sanitizeHtml(html);
    expect(result.issues).toContain('Removed new Function() calls');
  });

  it('should detect fetch() calls', () => {
    const html = `
      <!DOCTYPE html>
      <html>
        <body>
          <script>fetch('https://evil.com')</script>
        </body>
      </html>
    `;

    const result = sanitizeHtml(html);
    expect(result.issues).toContain('Removed fetch() calls');
  });

  it('should remove XSS vectors in attributes', () => {
    const html = `
      <!DOCTYPE html>
      <html>
        <body>
          <img src="x" onerror="alert(1)">
        </body>
      </html>
    `;

    const result = sanitizeHtml(html);
    const hasXssRemoval = result.issues.some(issue =>
      issue.includes('Removed XSS vector')
    );
    expect(hasXssRemoval).toBe(true);
    // Verify the onerror attribute was actually removed
    expect(result.sanitized).not.toMatch(/onerror\s*=/i);
  });

  it('should allow whitelisted CDN scripts', () => {
    const html = `
      <!DOCTYPE html>
      <html>
        <body>
          <script src="https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.min.js"></script>
        </body>
      </html>
    `;

    const result = sanitizeHtml(html);
    expect(result.sanitized).toContain('cdn.jsdelivr.net');
    const hasBlockedScript = result.issues.some(issue =>
      issue.includes('Removed non-whitelisted script')
    );
    expect(hasBlockedScript).toBe(false);
  });

  it('should block non-whitelisted CDN scripts', () => {
    const html = `
      <!DOCTYPE html>
      <html>
        <body>
          <script src="https://evil.com/malicious.js"></script>
        </body>
      </html>
    `;

    const result = sanitizeHtml(html);
    expect(result.issues).toContain('Removed non-whitelisted script src: https://evil.com/malicious.js');
    expect(result.sanitized).toContain('<!-- blocked script -->');
  });

  it('should validate HTML structure', () => {
    const html = `<div>No proper HTML structure</div>`;

    const result = sanitizeHtml(html);
    expect(result.issues).toContain('Missing <!DOCTYPE html> declaration');
    expect(result.issues).toContain('Missing <html> tag');
    expect(result.issues).toContain('Missing <head> tag');
    expect(result.issues).toContain('Missing <body> tag');
  });

  it('should extract HTML from markdown code fences', () => {
    const html = `
\`\`\`html
<!DOCTYPE html>
<html>
  <body>Test</body>
</html>
\`\`\`
    `;

    const result = sanitizeHtml(html);
    expect(result.sanitized).toContain('<!DOCTYPE html>');
    expect(result.sanitized).not.toContain('```');
  });

  it('should remove setTimeout with string arguments', () => {
    const html = '<!DOCTYPE html><html><body><script>setTimeout("alert(1)", 100)</script></body></html>';
    const result = sanitizeHtml(html);
    expect(result.issues).toContain('Removed setTimeout/setInterval with string arguments');
  });

  it('should remove XMLHttpRequest', () => {
    const html = '<!DOCTYPE html><html><body><script>new XMLHttpRequest()</script></body></html>';
    const result = sanitizeHtml(html);
    expect(result.issues).toContain('Removed XMLHttpRequest usage');
  });

  it('should remove WebSocket', () => {
    const html = '<!DOCTYPE html><html><body><script>new WebSocket("ws://evil.com")</script></body></html>';
    const result = sanitizeHtml(html);
    expect(result.issues).toContain('Removed WebSocket usage');
  });

  it('should remove document.cookie access', () => {
    const html = '<!DOCTYPE html><html><body><script>var x = document.cookie</script></body></html>';
    const result = sanitizeHtml(html);
    expect(result.issues).toContain('Removed document.cookie access');
  });

  it('should remove localStorage access', () => {
    const html = '<!DOCTYPE html><html><body><script>localStorage.getItem("x")</script></body></html>';
    const result = sanitizeHtml(html);
    expect(result.issues).toContain('Removed localStorage access');
  });

  it('should remove sessionStorage access', () => {
    const html = '<!DOCTYPE html><html><body><script>sessionStorage.setItem("x","y")</script></body></html>';
    const result = sanitizeHtml(html);
    expect(result.issues).toContain('Removed sessionStorage access');
  });

  it('should allow local /lib/ path scripts', () => {
    const html = '<!DOCTYPE html><html><body><script src="/lib/orbit-controls.js"></script></body></html>';
    const result = sanitizeHtml(html);
    expect(result.sanitized).toContain('/lib/orbit-controls.js');
    expect(result.issues.some(i => i.includes('blocked'))).toBe(false);
  });

  it('should strip <think> blocks from AI output', () => {
    const html = '<think>reasoning here</think><!DOCTYPE html><html><body>clean</body></html>';
    const result = sanitizeHtml(html);
    expect(result.sanitized).not.toContain('<think>');
    expect(result.sanitized).toContain('<!DOCTYPE html>');
  });
});
