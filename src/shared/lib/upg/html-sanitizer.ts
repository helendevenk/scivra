import { UPG_CDN_WHITELIST } from './constants';

interface SanitizeResult {
  sanitized: string;
  issues: string[];
}

/**
 * Security Strategy for UPG HTML:
 *
 * 1. **Regex-based filtering** (first line of defense):
 *    - Remove dangerous JavaScript patterns (eval, Function, etc.)
 *    - Block network requests (fetch, XHR, WebSocket)
 *    - Block storage access (localStorage, sessionStorage, cookies)
 *    - Whitelist CDN sources
 *
 * 2. **iframe sandbox** (primary defense):
 *    - sandbox="allow-scripts allow-same-origin"
 *    - Prevents: form submission, popups, top navigation, downloads
 *    - Allows: scripts (for visualizations), same-origin (for canvas/WebGL)
 *
 * 3. **Content Security Policy** (future enhancement):
 *    - script-src 'unsafe-inline' cdn.jsdelivr.net cdnjs.cloudflare.com unpkg.com
 *    - connect-src 'none' (block all network requests)
 *
 * Note: We don't use DOMPurify because:
 * - UPG generates complete HTML documents, not fragments
 * - DOMPurify would strip <script> tags needed for visualizations
 * - iframe sandbox provides better isolation than DOM cleaning
 */

/**
 * Extract HTML from AI response — it may be wrapped in ```html ``` fences
 */
function extractHtml(raw: string): string {
  // Strip reasoning model <think>...</think> blocks
  let cleaned = raw.replace(/<think>[\s\S]*?<\/think>/g, '').trim();

  // Strip markdown code fences if present
  const fenceMatch = cleaned.match(/```(?:html)?\s*\n?([\s\S]*?)```/);
  if (fenceMatch) {
    return fenceMatch[1].trim();
  }
  // If it already starts with <!DOCTYPE or <html, use as-is
  if (cleaned.startsWith('<!') || cleaned.startsWith('<html')) {
    return cleaned;
  }
  // Last resort: return cleaned content
  return cleaned;
}

/** Allowed local asset paths served from public/ */
const ALLOWED_LOCAL_PREFIXES = ['/lib/'] as const;

/**
 * Check if a script src is on the CDN whitelist or is an allowed local asset
 */
function isWhitelistedSrc(src: string): boolean {
  // Allow known local asset paths (e.g. /lib/orbit-controls.js)
  if (ALLOWED_LOCAL_PREFIXES.some((prefix) => src.startsWith(prefix))) {
    return true;
  }
  try {
    const url = new URL(src);
    return UPG_CDN_WHITELIST.some((domain) => url.hostname === domain || url.hostname.endsWith(`.${domain}`));
  } catch {
    // relative or malformed URL — not whitelisted
    return false;
  }
}

export function sanitizeHtml(html: string): SanitizeResult {
  const issues: string[] = [];
  let sanitized = extractHtml(html);

  // 1. Remove eval() calls (handle nested parens)
  const evalPattern = /\beval\s*\(/g;
  if (evalPattern.test(sanitized)) {
    issues.push('Removed eval() calls');
    sanitized = sanitized.replace(/\beval\s*\([\s\S]*?\)(?=\s*[;,\n\r)}])/g, '/* eval removed */');
  }

  // 2. Remove new Function() calls (handle nested parens)
  const newFuncPattern = /\bnew\s+Function\s*\(/g;
  if (newFuncPattern.test(sanitized)) {
    issues.push('Removed new Function() calls');
    sanitized = sanitized.replace(/\bnew\s+Function\s*\([\s\S]*?\)(?=\s*[;,\n\r)}])/g, '/* new Function removed */');
  }

  // 3. Remove setTimeout/setInterval with string arguments
  const timerStringPattern = /\b(setTimeout|setInterval)\s*\(\s*(['"`])/g;
  if (timerStringPattern.test(sanitized)) {
    issues.push('Removed setTimeout/setInterval with string arguments');
    sanitized = sanitized.replace(
      /\b(setTimeout|setInterval)\s*\(\s*(['"`])[\s\S]*?\2\s*,/g,
      '$1(function(){},',
    );
  }

  // 4. Remove non-whitelisted script src tags
  const scriptSrcPattern = /<script[^>]+src\s*=\s*["']([^"']+)["'][^>]*>/gi;
  sanitized = sanitized.replace(scriptSrcPattern, (match, src) => {
    if (isWhitelistedSrc(src)) {
      return match;
    }
    issues.push(`Removed non-whitelisted script src: ${src}`);
    return '<!-- blocked script -->';
  });

  // 5. Remove fetch() calls
  const fetchPattern = /\bfetch\s*\(/g;
  if (fetchPattern.test(sanitized)) {
    issues.push('Removed fetch() calls');
    sanitized = sanitized.replace(/\bfetch\s*\(/g, '/* fetch blocked */(');
  }

  // 6. Remove XMLHttpRequest
  const xhrPattern = /\bnew\s+XMLHttpRequest\s*\(/g;
  if (xhrPattern.test(sanitized)) {
    issues.push('Removed XMLHttpRequest usage');
    sanitized = sanitized.replace(/\bnew\s+XMLHttpRequest\s*\(/g, '/* XHR blocked */ (');
  }

  // 7. Remove WebSocket
  const wsPattern = /\bnew\s+WebSocket\s*\(/g;
  if (wsPattern.test(sanitized)) {
    issues.push('Removed WebSocket usage');
    sanitized = sanitized.replace(/\bnew\s+WebSocket\s*\(/g, '/* WebSocket blocked */ (');
  }

  // 8. Remove document.cookie access
  const cookiePattern = /\bdocument\s*\.\s*cookie\b/g;
  if (cookiePattern.test(sanitized)) {
    issues.push('Removed document.cookie access');
    sanitized = sanitized.replace(cookiePattern, '/* cookie blocked */');
  }

  // 9. Remove localStorage access
  const localStoragePattern = /\blocalStorage\s*\.\s*\w+/g;
  if (localStoragePattern.test(sanitized)) {
    issues.push('Removed localStorage access');
    sanitized = sanitized.replace(/\blocalStorage\b/g, '/* localStorage blocked */');
  }

  // 10. Remove sessionStorage access
  const sessionStoragePattern = /\bsessionStorage\s*\.\s*\w+/g;
  if (sessionStoragePattern.test(sanitized)) {
    issues.push('Removed sessionStorage access');
    sanitized = sanitized.replace(/\bsessionStorage\b/g, '/* sessionStorage blocked */');
  }

  // 11. Check for common XSS vectors in attributes
  const xssPatterns = [
    /on\w+\s*=\s*["'][^"']*["']/gi, // onerror, onclick, onload, etc.
    /javascript:/gi, // javascript: protocol
    /data:text\/html/gi, // data: URLs with HTML
    /<iframe[^>]*>/gi, // nested iframes
    /<object[^>]*>/gi, // object tags
    /<embed[^>]*>/gi, // embed tags
  ];

  for (const pattern of xssPatterns) {
    if (pattern.test(sanitized)) {
      issues.push(`Potential XSS vector detected: ${pattern.source}`);
      // Don't auto-remove, just warn - let iframe sandbox handle it
    }
  }

  // 12. Validate HTML structure
  if (!sanitized.includes('<!DOCTYPE html>') && !sanitized.includes('<!doctype html>')) {
    issues.push('Missing <!DOCTYPE html> declaration');
  }
  if (!/<html[\s>]/i.test(sanitized)) {
    issues.push('Missing <html> tag');
  }
  if (!/<head[\s>]/i.test(sanitized)) {
    issues.push('Missing <head> tag');
  }
  if (!/<body[\s>]/i.test(sanitized)) {
    issues.push('Missing <body> tag');
  }

  return { sanitized, issues };
}
