/**
 * POST /api/moderation/check-input
 *
 * 输入审核 API - 检查用户输入的 prompt 是否包含敏感词
 */

import { respData, respErr } from '@/shared/lib/resp';
import { moderateInput } from '@/shared/lib/moderation/content-moderator';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const prompt = typeof body.prompt === 'string' ? body.prompt.trim() : '';

    if (!prompt) {
      return respErr('Prompt is required');
    }

    if (prompt.length < 2 || prompt.length > 500) {
      return respErr('Prompt length must be between 2 and 500 characters');
    }

    // 执行输入审核
    const result = moderateInput(prompt);

    return respData({
      passed: result.passed,
      status: result.status,
      reason: result.reason,
      // 不返回 matchedKeywords，避免用户绕过审核
    });
  } catch (e: unknown) {
    console.error('Input moderation failed:', e);
    return respErr((e instanceof Error ? e.message : String(e)) || 'Input moderation failed');
  }
}
