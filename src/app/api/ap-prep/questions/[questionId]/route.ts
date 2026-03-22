import { respData, respErr } from '@/shared/lib/resp';
import { findApQuestionById } from '@/shared/models/ap_question';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ questionId: string }> }
) {
  try {
    const { questionId } = await params;
    const question = await findApQuestionById(questionId);
    if (!question) return respErr('Question not found');

    // Strip correctAnswer and explanation
    const safe = {
      id: question.id,
      examId: question.examId,
      unitId: question.unitId,
      questionNumber: question.questionNumber,
      type: question.type,
      difficulty: question.difficulty,
      examFrequency: question.examFrequency,
      stemEn: question.stemEn,
      stemZh: question.stemZh,
      stemImage: question.stemImage,
      choicesEn: question.choicesEn,
      choicesZh: question.choicesZh,
      upgPrompt: question.upgPrompt,
      tags: question.tags,
      sort: question.sort,
    };

    return respData(safe);
  } catch (e: unknown) {
    const message =
      e instanceof Error ? e.message : 'Failed to get question';
    console.error('AP Prep get question failed:', e);
    return respErr(message);
  }
}
