import { respData, respErr } from '@/shared/lib/resp';
import { getUserInfo } from '@/shared/models/user';
import { getRemainingCredits } from '@/shared/models/credit';
import {
  getUpgGenerationsCount,
  getTotalLikesReceived,
  getMonthlyGenerationCount,
  getRecentGenerationsByUserId,
} from '@/shared/models/upg_generation';
import { getRecentLikesByUserId } from '@/shared/models/upg_like';

export async function GET() {
  try {
    const user = await getUserInfo();
    if (!user) {
      return respErr('Please sign in to view dashboard');
    }

    const [
      remainingCredits,
      totalGenerations,
      totalLikesReceived,
      monthlyGenerations,
      recentWorks,
      recentActivity,
    ] = await Promise.all([
      getRemainingCredits(user.id),
      getUpgGenerationsCount(user.id),
      getTotalLikesReceived(user.id),
      getMonthlyGenerationCount(user.id),
      getRecentGenerationsByUserId(user.id, 6),
      getRecentLikesByUserId(user.id, 5),
    ]);

    // Build action hints based on user state
    const actionHints: string[] = [];
    const hasPublicWorks = recentWorks.some((w) => w.isPublic);
    if (!hasPublicWorks) {
      actionHints.push('publish_first_work');
    }
    if (remainingCredits <= 5) {
      actionHints.push('upgrade_plan');
    }
    if (totalGenerations === 0) {
      actionHints.push('create_first_generation');
    }

    return respData({
      stats: {
        remainingCredits,
        totalGenerations,
        totalLikesReceived,
        monthlyGenerations,
      },
      recentWorks,
      recentActivity,
      actionHints,
    });
  } catch (e: unknown) {
    console.error('Dashboard failed:', e);
    return respErr((e instanceof Error ? e.message : String(e)) || 'Failed to get dashboard data');
  }
}
