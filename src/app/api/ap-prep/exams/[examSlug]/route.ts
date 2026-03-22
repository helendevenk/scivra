import { respData, respErr } from '@/shared/lib/resp';
import { findApExamBySlug } from '@/shared/models/ap_exam';
import { getUnitsByExamId } from '@/shared/models/ap_unit';
import { getUserInfo } from '@/shared/models/user';
import { getOrCreateProgress } from '@/shared/models/ap_user_progress';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ examSlug: string }> }
) {
  try {
    const { examSlug } = await params;
    const exam = await findApExamBySlug(examSlug);
    if (!exam) return respErr('Exam not found');

    const units = await getUnitsByExamId(exam.id);

    let progress = null;
    const user = await getUserInfo();
    if (user) {
      progress = await getOrCreateProgress(user.id, exam.id);
    }

    return respData({ exam, units, progress });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Failed to get exam';
    console.error('AP Prep get exam detail failed:', e);
    return respErr(message);
  }
}
