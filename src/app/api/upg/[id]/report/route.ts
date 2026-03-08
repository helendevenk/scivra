import { respData, respErr } from '@/shared/lib/resp';
import { getUserInfo } from '@/shared/models/user';
import {
  findUpgGenerationById,
  updateUpgGeneration,
} from '@/shared/models/upg_generation';
import {
  createUpgReport,
  getReportCountByGenerationId,
} from '@/shared/models/upg_report';
import { getUuid } from '@/shared/lib/hash';

const VALID_REPORT_TYPES = ['inaccurate', 'broken', 'inappropriate', 'other'];
const AUTO_TAKEDOWN_THRESHOLD = 3;

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return respErr('Missing id parameter');
    }

    const user = await getUserInfo();
    if (!user) {
      return respErr('Please sign in to report content');
    }

    const body = await request.json();
    const reportType = typeof body.reportType === 'string' ? body.reportType.trim() : '';
    const content = typeof body.content === 'string' ? body.content.trim().slice(0, 1000) : '';

    if (!VALID_REPORT_TYPES.includes(reportType)) {
      return respErr(`Invalid report type. Must be one of: ${VALID_REPORT_TYPES.join(', ')}`);
    }

    const generation = await findUpgGenerationById(id);
    if (!generation) {
      return respErr('Generation not found');
    }

    const report = await createUpgReport({
      id: getUuid(),
      generationId: id,
      userId: user.id,
      reportType,
      content: content || null,
      status: 'pending',
    });

    // Auto-takedown: if report count >= threshold, set isPublic=false
    const reportCount = await getReportCountByGenerationId(id);
    if (reportCount >= AUTO_TAKEDOWN_THRESHOLD && generation.isPublic) {
      await updateUpgGeneration(id, { isPublic: false });
    }

    return respData({ id: report.id, reportType, status: report.status });
  } catch (e: any) {
    console.error('UPG report failed:', e);
    return respErr(e.message || 'Failed to submit report');
  }
}
