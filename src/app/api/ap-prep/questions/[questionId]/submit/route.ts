import { respData, respErr } from '@/shared/lib/resp';
import { getUserInfo } from '@/shared/models/user';
import { findApQuestionById } from '@/shared/models/ap_question';
import { createApAttempt } from '@/shared/models/ap_attempt';
import { updateProgress } from '@/shared/models/ap_user_progress';
import { getUuid } from '@/shared/lib/hash';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ questionId: string }> }
) {
  try {
    const user = await getUserInfo();
    if (!user) return respErr('Unauthorized');

    const { questionId } = await params;
    const body = await request.json();
    const { selectedAnswer, timeSpentSeconds } = body;

    if (!selectedAnswer || typeof selectedAnswer !== 'string') {
      return respErr('selectedAnswer is required');
    }

    const question = await findApQuestionById(questionId);
    if (!question) return respErr('Question not found');

    const isCorrect = selectedAnswer === question.correctAnswer;

    // Create attempt record
    const attempt = await createApAttempt({
      id: getUuid(),
      userId: user.id,
      questionId: question.id,
      examId: question.examId,
      unitId: question.unitId,
      selectedAnswer,
      isCorrect,
      timeSpentSeconds:
        typeof timeSpentSeconds === 'number' ? timeSpentSeconds : null,
    });

    // Update user progress
    await updateProgress(user.id, question.examId, isCorrect, question.unitId);

    return respData({
      isCorrect,
      correctAnswer: question.correctAnswer,
      explanationEn: question.explanationEn,
      explanationZh: question.explanationZh,
      upgPrompt: question.upgPrompt,
      attemptId: attempt.id,
    });
  } catch (e: unknown) {
    const message =
      e instanceof Error ? e.message : 'Failed to submit answer';
    console.error('AP Prep submit answer failed:', e);
    return respErr(message);
  }
}
