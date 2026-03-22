import { respData, respErr } from '@/shared/lib/resp';
import { getPublishedExams } from '@/shared/models/ap_exam';

export async function GET() {
  try {
    const exams = await getPublishedExams();
    return respData(exams);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Failed to get exams';
    console.error('AP Prep get exams failed:', e);
    return respErr(message);
  }
}
