import { respData, respErr } from '@/shared/lib/resp';
import { findQuestBySlug } from '@/shared/models/quest';
import { getStepsByQuestId } from '@/shared/models/quest_step';
import { getUserInfo } from '@/shared/models/user';
import {
  findQuestAttemptById,
  updateQuestAttempt,
} from '@/shared/models/quest_attempt';
import {
  createStepResponse,
  findResponseByStep,
} from '@/shared/models/quest_step_response';
import { scoreStep } from '@/shared/lib/quest/scoring';

export async function POST(
  request: Request,
  {
    params,
  }: { params: Promise<{ slug: string; orderIndex: string }> }
) {
  try {
    const user = await getUserInfo();
    if (!user) {
      return respErr('Login required');
    }

    const { slug, orderIndex: orderStr } = await params;
    const orderIndex = parseInt(orderStr, 10);
    if (isNaN(orderIndex)) {
      return respErr('Invalid step index');
    }

    const body = await request.json();
    const { attemptId, responseType, responseValue } = body;
    if (!attemptId || !responseType) {
      return respErr('Missing required fields');
    }

    // Validate quest
    const quest = await findQuestBySlug(slug);
    if (!quest) {
      return respErr('Quest not found');
    }

    // Validate attempt
    const attempt = await findQuestAttemptById(attemptId);
    if (!attempt || attempt.userId !== user.id) {
      return respErr('Invalid attempt');
    }
    if (attempt.status !== 'in_progress') {
      return respErr('Attempt already completed');
    }

    // Find the step
    const steps = await getStepsByQuestId(quest.id);
    const step = steps.find((s) => s.orderIndex === orderIndex);
    if (!step) {
      return respErr('Step not found');
    }

    // Check if already answered
    const existingResponse = await findResponseByStep(attemptId, step.id);
    if (existingResponse) {
      return respData({
        response: existingResponse,
        alreadySubmitted: true,
      });
    }

    // Score the step
    const result = scoreStep(
      step.stepType,
      step.config,
      responseType,
      responseValue ?? null,
      step.maxPoints
    );

    // Save response
    const response = await createStepResponse({
      attemptId,
      stepId: step.id,
      responseType,
      responseValue: responseValue ?? null,
      score: result.score,
      maxScore: result.maxScore,
      comparisonData:
        step.stepType === 'compare' ? responseValue : null,
    });

    // Advance step
    const nextStep = Math.max(attempt.currentStep ?? 0, orderIndex + 1);
    await updateQuestAttempt(attemptId, {
      currentStep: nextStep,
      totalScore: (attempt.totalScore ?? 0) + result.score,
    });

    return respData({
      response,
      scoring: result,
      alreadySubmitted: false,
    });
  } catch (e: unknown) {
    const message =
      e instanceof Error ? e.message : 'Failed to submit step';
    console.error('Step submit failed:', e);
    return respErr(message);
  }
}
