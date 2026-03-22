/**
 * Content Moderation Service
 *
 * 内容审核服务 - 三层审核机制
 *
 * 1. 输入审核 (Input Moderation): 检查用户输入的 prompt 是否包含敏感词
 * 2. 输出审核 (Output Moderation): 检查 AI 生成的 HTML 代码是否安全
 * 3. 人工复审 (Manual Review): 标记可疑内容供管理员审核
 */

import {
  SENSITIVE_WORD_CATEGORIES,
  getHighSeverityKeywords,
  getKeywordSeverity,
} from '@/config/moderation/sensitive-words';
import { UPG_CDN_WHITELIST } from '@/shared/lib/upg/constants';

export interface ModerationResult {
  passed: boolean;
  status: 'pass' | 'reject' | 'pending'; // pass: 通过, reject: 拒绝, pending: 待人工审核
  reason?: string;
  matchedKeywords?: string[];
  issues?: string[];
}

/**
 * 输入审核：检查 prompt 是否包含敏感词
 *
 * 策略：
 * - high severity: 直接拒绝
 * - medium severity: 标记为 pending，允许生成但进入人工复审队列
 * - low severity: 记录但通过
 *
 * 性能要求: < 50ms
 */
export function moderateInput(prompt: string): ModerationResult {
  const startTime = Date.now();
  const lowerPrompt = prompt.toLowerCase();
  const matchedKeywords: string[] = [];
  let highestSeverity: 'high' | 'medium' | 'low' | null = null;

  // 遍历所有敏感词类别
  for (const category of SENSITIVE_WORD_CATEGORIES) {
    for (const keyword of category.keywords) {
      const lowerKeyword = keyword.toLowerCase();

      // 简单字符串匹配（未来可以扩展为正则表达式）
      if (lowerPrompt.includes(lowerKeyword)) {
        matchedKeywords.push(keyword);

        // 更新最高严重性级别
        if (!highestSeverity || category.severity === 'high') {
          highestSeverity = category.severity;
        } else if (highestSeverity === 'low' && category.severity === 'medium') {
          highestSeverity = 'medium';
        }
      }
    }
  }

  const elapsed = Date.now() - startTime;
  console.log(`[Moderation] Input check completed in ${elapsed}ms`);

  // 没有匹配到敏感词
  if (matchedKeywords.length === 0) {
    return {
      passed: true,
      status: 'pass',
    };
  }

  // 根据严重性级别决定审核结果
  if (highestSeverity === 'high') {
    return {
      passed: false,
      status: 'reject',
      reason: '您的输入包含不符合社区规范的内容，请修改后重试',
      matchedKeywords,
    };
  }

  if (highestSeverity === 'medium') {
    return {
      passed: true, // 允许生成，但标记为待审核
      status: 'pending',
      reason: '内容已标记为待审核',
      matchedKeywords,
    };
  }

  // low severity: 记录但通过
  return {
    passed: true,
    status: 'pass',
    matchedKeywords,
  };
}

/**
 * 输出审核：检查 AI 生成的 HTML 代码是否安全
 *
 * 检查项：
 * 1. 禁止 <script> 标签（除了 CDN 白名单）
 * 2. 禁止 on* 事件属性（onclick, onerror 等）
 * 3. 禁止 javascript: 协议
 * 4. 禁止 <iframe> 外部嵌入
 * 5. 允许 <style> 标签（UPG 需要内联样式）
 * 6. 白名单机制：只允许 Three.js/KaTeX 相关的安全标签和属性
 *
 * 性能要求: < 200ms
 */
export function moderateOutput(htmlContent: string): ModerationResult {
  const startTime = Date.now();
  const issues: string[] = [];
  let status: 'pass' | 'reject' | 'pending' = 'pass';

  // 1. 检查 <script> 标签（排除 CDN 白名单）
  const scriptTagPattern = /<script[^>]*src\s*=\s*["']([^"']+)["'][^>]*>/gi;
  let scriptMatch;
  while ((scriptMatch = scriptTagPattern.exec(htmlContent)) !== null) {
    const src = scriptMatch[1];
    if (!isWhitelistedCDN(src)) {
      issues.push(`Non-whitelisted script src: ${src}`);
      status = 'reject';
    }
  }

  // 2. 检查内联 <script> 标签（不带 src 属性）
  const inlineScriptPattern = /<script(?![^>]*src\s*=)[^>]*>/gi;
  if (inlineScriptPattern.test(htmlContent)) {
    // 内联脚本是允许的（用于 Three.js 场景代码）
    // 但需要检查是否包含危险函数
    const dangerousFunctions = ['eval', 'Function', 'fetch', 'XMLHttpRequest', 'WebSocket'];
    for (const func of dangerousFunctions) {
      const pattern = new RegExp(`\\b${func}\\s*\\(`, 'gi');
      if (pattern.test(htmlContent)) {
        issues.push(`Dangerous function detected: ${func}`);
        status = 'reject';
      }
    }
  }

  // 3. 检查 on* 事件属性
  const eventHandlerPattern = /\son\w+\s*=\s*["'][^"']*["']/gi;
  if (eventHandlerPattern.test(htmlContent)) {
    issues.push('Event handler attributes detected (onclick, onerror, etc.)');
    status = 'reject';
  }

  // 4. 检查 javascript: 协议
  const javascriptProtocolPattern = /javascript:/gi;
  if (javascriptProtocolPattern.test(htmlContent)) {
    issues.push('javascript: protocol detected');
    status = 'reject';
  }

  // 5. 检查 <iframe> 标签
  const iframePattern = /<iframe[^>]*>/gi;
  if (iframePattern.test(htmlContent)) {
    issues.push('iframe tag detected');
    status = 'reject';
  }

  // 6. 检查 <object> 和 <embed> 标签
  const objectPattern = /<(object|embed)[^>]*>/gi;
  if (objectPattern.test(htmlContent)) {
    issues.push('object/embed tag detected');
    status = 'reject';
  }

  // 7. 检查外部资源链接（除了 CDN 白名单）
  const externalLinkPattern = /https?:\/\/[^\s"'<>]+/gi;
  let linkMatch;
  const nonWhitelistedLinks: string[] = [];
  while ((linkMatch = externalLinkPattern.exec(htmlContent)) !== null) {
    const url = linkMatch[0];
    if (!isWhitelistedCDN(url)) {
      nonWhitelistedLinks.push(url);
    }
  }

  if (nonWhitelistedLinks.length > 0) {
    issues.push(`Non-whitelisted external links: ${nonWhitelistedLinks.slice(0, 3).join(', ')}`);
    // 外部链接不直接拒绝，标记为待审核
    if (status === 'pass') {
      status = 'pending';
    }
  }

  // 8. 检查 localStorage/sessionStorage/cookie 访问
  const storagePatterns = [
    /\blocalStorage\b/gi,
    /\bsessionStorage\b/gi,
    /\bdocument\.cookie\b/gi,
  ];

  for (const pattern of storagePatterns) {
    if (pattern.test(htmlContent)) {
      issues.push(`Storage access detected: ${pattern.source}`);
      status = 'reject';
    }
  }

  const elapsed = Date.now() - startTime;
  console.log(`[Moderation] Output check completed in ${elapsed}ms`);

  if (status === 'reject') {
    return {
      passed: false,
      status: 'reject',
      reason: '生成的内容包含不安全的代码，已被拒绝',
      issues,
    };
  }

  if (status === 'pending') {
    return {
      passed: true, // 允许生成，但标记为待审核
      status: 'pending',
      reason: '内容已标记为待审核',
      issues,
    };
  }

  return {
    passed: true,
    status: 'pass',
  };
}

/**
 * 检查 URL 是否在 CDN 白名单中
 */
function isWhitelistedCDN(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return UPG_CDN_WHITELIST.some(
      domain => urlObj.hostname === domain || urlObj.hostname.endsWith(`.${domain}`)
    );
  } catch {
    // 相对路径或格式错误的 URL
    return false;
  }
}

/**
 * 综合审核：同时执行输入和输出审核
 *
 * 用于生成流程中的一次性审核
 */
export function moderateContent(
  prompt: string,
  htmlContent: string
): {
  inputResult: ModerationResult;
  outputResult: ModerationResult;
  overallPassed: boolean;
} {
  const inputResult = moderateInput(prompt);
  const outputResult = moderateOutput(htmlContent);

  // 只要有一个拒绝，整体就拒绝
  const overallPassed = inputResult.passed && outputResult.passed;

  return {
    inputResult,
    outputResult,
    overallPassed,
  };
}
