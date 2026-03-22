import { respData, respErr } from '@/shared/lib/resp';
import { getUserInfo } from '@/shared/models/user';
import { createApQuestion } from '@/shared/models/ap_question';
import { getUuid } from '@/shared/lib/hash';

export async function POST(request: Request) {
  try {
    const user = await getUserInfo();
    if (!user) return respErr('Unauthorized');

    const { canAccessAdmin } = await import('@/core/rbac/permission');
    if (!(await canAccessAdmin(user.id))) return respErr('Forbidden');

    const body = await request.json();
    const {
      examId,
      unitId,
      questionNumber,
      type,
      difficulty,
      examFrequency,
      stemEn,
      stemZh,
      stemImage,
      choicesEn,
      choicesZh,
      correctAnswer,
      explanationEn,
      explanationZh,
      upgPrompt,
      tags,
      source,
      isPublished,
      sort,
    } = body;

    if (!examId || !unitId || !stemEn || !correctAnswer || !explanationEn) {
      return respErr(
        'Missing required fields: examId, unitId, stemEn, correctAnswer, explanationEn'
      );
    }

    const question = await createApQuestion({
      id: getUuid(),
      examId,
      unitId,
      questionNumber: questionNumber ?? 0,
      type: type || 'mcq',
      difficulty: difficulty || 'medium',
      examFrequency: examFrequency || null,
      stemEn,
      stemZh: stemZh || null,
      stemImage: stemImage || null,
      choicesEn: choicesEn || null,
      choicesZh: choicesZh || null,
      correctAnswer,
      explanationEn,
      explanationZh: explanationZh || null,
      upgPrompt: upgPrompt || null,
      tags: tags ? (typeof tags === 'string' ? tags : JSON.stringify(tags)) : null,
      source: source || 'original',
      isPublished: isPublished ?? false,
      sort: sort ?? 0,
    });

    return respData(question);
  } catch (e: unknown) {
    const message =
      e instanceof Error ? e.message : 'Failed to create question';
    console.error('Admin create AP question failed:', e);
    return respErr(message);
  }
}
