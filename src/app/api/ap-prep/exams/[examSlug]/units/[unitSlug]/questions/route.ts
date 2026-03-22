import { respData, respErr } from '@/shared/lib/resp';
import { findApExamBySlug } from '@/shared/models/ap_exam';
import { findApUnitBySlug } from '@/shared/models/ap_unit';
import { getQuestionsByUnit } from '@/shared/models/ap_question';

export async function GET(
  request: Request,
  {
    params,
  }: { params: Promise<{ examSlug: string; unitSlug: string }> }
) {
  try {
    const { examSlug, unitSlug } = await params;
    const url = new URL(request.url);
    const page = Math.max(1, parseInt(url.searchParams.get('page') || '1', 10));
    const limit = Math.min(
      50,
      Math.max(1, parseInt(url.searchParams.get('limit') || '20', 10))
    );
    const difficulty = url.searchParams.get('difficulty') || undefined;
    const type = url.searchParams.get('type') || undefined;

    const exam = await findApExamBySlug(examSlug);
    if (!exam) return respErr('Exam not found');

    const unit = await findApUnitBySlug(exam.id, unitSlug);
    if (!unit) return respErr('Unit not found');

    const result = await getQuestionsByUnit(exam.id, unit.id, {
      page,
      limit,
      difficulty,
      type,
    });

    // Strip correctAnswer and explanation before submit
    const safeQuestions = result.questions.map((q) => ({
      id: q.id,
      examId: q.examId,
      unitId: q.unitId,
      questionNumber: q.questionNumber,
      type: q.type,
      difficulty: q.difficulty,
      examFrequency: q.examFrequency,
      stemEn: q.stemEn,
      stemZh: q.stemZh,
      stemImage: q.stemImage,
      choicesEn: q.choicesEn,
      choicesZh: q.choicesZh,
      upgPrompt: q.upgPrompt,
      tags: q.tags,
      sort: q.sort,
    }));

    return respData({
      questions: safeQuestions,
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
      unit,
      exam: { id: exam.id, slug: exam.slug, titleEn: exam.titleEn, titleZh: exam.titleZh },
    });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Failed to get questions';
    console.error('AP Prep get questions failed:', e);
    return respErr(message);
  }
}
