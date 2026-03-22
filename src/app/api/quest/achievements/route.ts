import { respData, respErr } from '@/shared/lib/resp';
import {
  getActiveAchievements,
  getUserAchievements,
} from '@/shared/models/achievement';
import { getUserInfo } from '@/shared/models/user';

export async function GET() {
  try {
    const achievements = await getActiveAchievements();

    const user = await getUserInfo();
    let userUnlocked: string[] = [];
    if (user) {
      const unlocked = await getUserAchievements(user.id);
      userUnlocked = unlocked.map((u) => u.achievementId);
    }

    return respData({ achievements, userUnlocked });
  } catch (e: unknown) {
    const message =
      e instanceof Error ? e.message : 'Failed to get achievements';
    console.error('Achievements failed:', e);
    return respErr(message);
  }
}
