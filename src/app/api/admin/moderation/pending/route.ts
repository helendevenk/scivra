/**
 * GET /api/admin/moderation/pending
 *
 * 获取待审核内容列表（管理员专用）
 */

import { respData, respErr } from '@/shared/lib/resp';
import { getUserInfo } from '@/shared/models/user';
import { hasPermission } from '@/shared/services/rbac';
import { getPendingModerationRecords } from '@/shared/models/content_moderation';
import { getUpgGenerationById } from '@/shared/models/upg_generation';

export async function GET(request: Request) {
  try {
    // 1. 认证和权限检查
    const user = await getUserInfo();
    if (!user) {
      return respErr('Unauthorized');
    }

    const hasPermissionResult = await hasPermission(user.id, 'admin.moderation.read');
    if (!hasPermissionResult) {
      return respErr('Forbidden: Admin permission required');
    }

    // 2. 解析查询参数
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') ?? '1', 10);
    const pageSize = parseInt(url.searchParams.get('pageSize') ?? '20', 10);

    const limit = Math.min(pageSize, 100); // 最大 100 条
    const offset = (page - 1) * limit;

    // 3. 获取待审核记录
    const records = await getPendingModerationRecords(limit, offset);

    // 4. 关联 generation 数据
    const recordsWithGeneration = await Promise.all(
      records.map(async (record) => {
        const generation = await getUpgGenerationById(record.generationId);
        return {
          ...record,
          generation: generation ? {
            id: generation.id,
            prompt: generation.prompt,
            language: generation.language,
            createdAt: generation.createdAt,
            userId: generation.userId,
          } : null,
        };
      })
    );

    return respData({
      records: recordsWithGeneration,
      pagination: {
        page,
        pageSize: limit,
        total: records.length,
      },
    });
  } catch (e: unknown) {
    console.error('Get pending moderation records failed:', e);
    return respErr((e instanceof Error ? e.message : String(e)) || 'Failed to get pending moderation records');
  }
}
