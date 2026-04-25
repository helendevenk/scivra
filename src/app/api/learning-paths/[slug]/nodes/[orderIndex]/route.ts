import { respData, respErr } from '@/shared/lib/resp';
import { getUserInfo } from '@/shared/models/user';
import {
  getPublishedPathBySlug,
  getNodeByPathAndOrder,
  checkNodeAccess,
  type QuizQuestion,
} from '@/shared/models/learning_path';

function stripQuizAnswers(quizJson: string): string {
  try {
    const quiz: QuizQuestion = JSON.parse(quizJson);
    const { correct_index, explanation_en, explanation_zh, ...safe } = quiz;
    return JSON.stringify(safe);
  } catch {
    return quizJson;
  }
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string; orderIndex: string }> }
) {
  try {
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

    const node = await getNodeByPathAndOrder(path.id, orderIndex);
    if (!node) {
      return respErr('Node not found');
    }

    const user = await getUserInfo();
    const access = await checkNodeAccess(orderIndex, user);

    if (!access.allowed) {
      return respData({
        locked: true,
        lockReason: access.reason,
      });
    }

    return respData({
      node: {
        ...node,
        quizQuestion: stripQuizAnswers(node.quizQuestion),
      },
      locked: false,
    });
  } catch (e: unknown) {
    console.error('Learning path node failed:', e);
    return respErr((e instanceof Error ? e.message : String(e)) || 'Failed to get node');
  }
}
