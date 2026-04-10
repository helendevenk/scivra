/**
 * POST /api/admin/moderation/review
 *
 * 人工审核 API（管理员专用）
 */

import { respData, respErr } from '@/shared/lib/resp';
import { getUserInfo } from '@/shared/models/user';
import { hasPermission } from '@/shared/services/rbac';
import {
  updateModerationRecord,
  getModerationRecordById,
} from '@/shared/models/content_moderation';
import { updateUpgGeneration } from '@/shared/models/upg_generation';

export async function POST(request: Request) {
  try {
    // 1. 认证和权限检查
    const user = await getUserInfo();
    if (!user) {
      return new Response(JSON.stringify({ code: -1, message: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const hasPermissionResult = await hasPermission(user.id, 'admin.moderation.write');
    if (!hasPermissionResult) {
      return new Response(JSON.stringify({ code: -1, message: 'Forbidden: Admin permission required' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 2. 解析请求参数
    const body = await request.json();
    const { moderationId, status, reviewNotes } = body;

    if (!moderationId || !status) {
      return respErr('moderationId and status are required');
    }

    if (!['pass', 'reject'].includes(status)) {
      return respErr('status must be "pass" or "reject"');
    }

    // 3. 获取审核记录
    const record = await getModerationRecordById(moderationId);
    if (!record) {
      return new Response(JSON.stringify({ code: -1, message: 'Moderation record not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 4. 更新审核记录
    const updated = await updateModerationRecord(moderationId, {
      status,
      reviewedBy: user.id,
      reviewNotes: reviewNotes || null,
      reviewedAt: new Date(),
    });

    if (!updated) {
      return respErr('Failed to update moderation record');
    }

    // 5. 如果审核不通过，将对应的 generation 设置为不公开
    if (status === 'reject') {
      await updateUpgGeneration(record.generationId, {
        isPublic: false,
      });
    }

    return respData({
      success: true,
      record: updated,
    });
  } catch (e: unknown) {
    console.error('Manual review failed:', e);
    return respErr((e instanceof Error ? e.message : String(e)) || 'Manual review failed');
  }
}
