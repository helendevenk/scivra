import { respData, respErr } from '@/shared/lib/resp';
import { getUserInfo } from '@/shared/models/user';
import {
  getPublishedPathBySlug,
  getNodeByPathAndOrder,
  checkNodeAccess,
  advanceProgress,
  type QuizQuestion,
} from '@/shared/models/learning_path';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string; orderIndex: string }> }
) {
  try {
    // Must be logged in
    const user = await getUserInfo();
    if (!user) {
      return respErr('Please sign in to submit answers');
    }

    const { slug, orderIndex: orderIndexStr } = await params;
    if (!slug || !orderIndexStr) {
      return respErr('Missing parameters');
    }

    const orderIndex = parseInt(orderIndexStr, 10);
    if (isNaN(orderIndex) || orderIndex < 0) {
      return respErr('Invalid order index');
    }

    const path = await getPublishedPathBySlug(slug);
    if (!path) {
      return respErr('Learning path not found');
    }

    // Secondary access check to prevent paywall bypass
    const access = await checkNodeAccess(orderIndex, user);
    if (!access.allowed) {
      return respErr('Access denied: ' + (access.reason || 'locked'));
    }

    const node = await getNodeByPathAndOrder(path.id, orderIndex);
    if (!node) {
      return respErr('Node not found');
    }

    // Parse and validate answer
    const body = await request.json();
    const answer = body.answer;
    if (typeof answer !== 'number' || !Number.isInteger(answer) || answer < 0 || answer > 3) {
      return respErr('Invalid answer: must be an integer 0-3');
    }

    // Check correctness
    const quiz: QuizQuestion = JSON.parse(node.quizQuestion);
    const correct = answer === quiz.correct_index;

    // Advance progress regardless of correctness
    const progress = await advanceProgress(
      user.id,
      path.id,
      orderIndex,
      path.nodeCount ?? 0
    );

    // Pick explanation language from Accept-Language header
    const acceptLang = request.headers.get('accept-language') || '';
    const explanation = acceptLang.includes('zh')
      ? quiz.explanation_zh
      : quiz.explanation_en;

    return respData({
      correct,
      correctIndex: quiz.correct_index,
      explanation,
      progress,
    });
  } catch (e: any) {
    console.error('Learning path submit failed:', e);
    return respErr(e.message || 'Failed to submit answer');
  }
}
