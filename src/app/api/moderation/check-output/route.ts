/**
 * POST /api/moderation/check-output
 *
 * 输出审核 API - 检查 AI 生成的 HTML 代码是否安全
 */

import { respData, respErr } from '@/shared/lib/resp';
import { moderateOutput } from '@/shared/lib/moderation/content-moderator';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const htmlContent = typeof body.htmlContent === 'string' ? body.htmlContent : '';

    if (!htmlContent) {
      return respErr('HTML content is required');
    }

    // 执行输出审核
    const result = moderateOutput(htmlContent);

    return respData({
      passed: result.passed,
      status: result.status,
      reason: result.reason,
      issues: result.issues,
    });
  } catch (e: any) {
    console.error('Output moderation failed:', e);
    return respErr(e.message || 'Output moderation failed');
  }
}
