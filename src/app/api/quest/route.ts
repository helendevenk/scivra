import { respData, respErr } from '@/shared/lib/resp';
import { getPublishedQuests } from '@/shared/models/quest';
import { getUserInfo } from '@/shared/models/user';
import { getUserAttempts } from '@/shared/models/quest_attempt';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const category = url.searchParams.get('category') || undefined;
    const difficulty = url.searchParams.get('difficulty') || undefined;
    const tier = url.searchParams.get('tier') || undefined;

    const quests = await getPublishedQuests({ category, difficulty, tier });

    const user = await getUserInfo();
    if (user && quests.length > 0) {
      const attempts = await getUserAttempts(user.id);
      return respData({ quests, attempts });
    }

    return respData({ quests });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Failed to get quests';
    console.error('Quest list failed:', e);
    return respErr(message);
  }
}
