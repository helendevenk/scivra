import { respData, respErr } from '@/shared/lib/resp';
import { getUserInfo } from '@/shared/models/user';
import {
  getPublishedPathBySlug,
  getNodesByPathId,
  getOrCreateProgress,
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
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    if (!slug) {
      return respErr('Missing slug parameter');
    }

    const path = await getPublishedPathBySlug(slug);
    if (!path) {
      return respErr('Learning path not found');
    }

    const nodes = await getNodesByPathId(path.id);
    const user = await getUserInfo();

    // Check access and strip sensitive data per node
    const safeNodes = await Promise.all(
      nodes.map(async (node) => {
        // Always strip quiz answers from list view
        const strippedQuiz = stripQuizAnswers(node.quizQuestion);

        const access = await checkNodeAccess(node.orderIndex, user);
        if (!access.allowed) {
          // Locked node: strip description, mark as locked
          return {
            id: node.id,
            pathId: node.pathId,
            orderIndex: node.orderIndex,
            titleEn: node.titleEn,
            titleZh: node.titleZh,
            generationId: node.generationId,
            experimentSlug: node.experimentSlug,
            createdAt: node.createdAt,
            quizQuestion: strippedQuiz,
            locked: true,
            lockReason: access.reason,
          };
        }

        return {
          ...node,
          quizQuestion: strippedQuiz,
          locked: false,
        };
      })
    );

    // If user is logged in, get or create progress
    let progress;
    if (user) {
      progress = await getOrCreateProgress(user.id, path.id);
    }

    return respData({ path, nodes: safeNodes, progress });
  } catch (e: unknown) {
    console.error('Learning path detail failed:', e);
    return respErr((e instanceof Error ? e.message : String(e)) || 'Failed to get learning path');
  }
}
