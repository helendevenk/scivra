import { NextRequest } from 'next/server';

import {
  trackUsage,
  getQuota,
  getProgress,
  updateProgress,
} from '@/shared/lib/usage/progress-service';
import { getExperimentBySlug } from '@/shared/lib/experiments/registry';
import {
  canAccessExperiment,
  subscriptionToTier,
} from '@/shared/lib/experiments/access';
import { getSignUser } from '@/shared/models/user';
import { getCurrentSubscription } from '@/shared/models/subscription';
import { respData, respErr } from '@/shared/lib/resp';
import { captureServerError } from '@/extensions/monitoring/sentry';

function getSessionId(request: NextRequest): string {
  return (
    request.cookies.get('session_id')?.value ??
    request.headers.get('x-session-id') ??
    'anonymous'
  );
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: slug } = await params;
    const experiment = getExperimentBySlug(slug);
    if (!experiment) {
      return respErr('experiment_not_found');
    }

    const user = await getSignUser();
    const keyType = user ? 'user' : 'session';
    const keyValue = user ? user.id : getSessionId(request);

    let planName: string | null = null;
    if (user?.id) {
      const sub = await getCurrentSubscription(user.id);
      planName = sub?.planName ?? null;
    }

    const userTier = subscriptionToTier(planName);
    if (!canAccessExperiment(experiment.id, userTier)) {
      return respErr('experiment_locked');
    }

    const quota = await getQuota({
      keyType,
      keyValue,
      planName,
    });

    const progress = user ? await getProgress(user.id, slug) : null;

    return respData({ experimentId: slug, quota, progress });
  } catch (error) {
    captureServerError(error, { route: '/api/experiments/[id]/progress' });
    return respErr('quota_query_failed');
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: slug } = await params;
    const experiment = getExperimentBySlug(slug);
    if (!experiment) {
      return respErr('experiment_not_found');
    }

    const body = await request.json();
    const { action } = body;

    const user = await getSignUser();
    const keyType = user ? 'user' : 'session';
    const keyValue = user ? user.id : getSessionId(request);

    let planName: string | null = null;
    if (user?.id) {
      const sub = await getCurrentSubscription(user.id);
      planName = sub?.planName ?? null;
    }

    const userTier = subscriptionToTier(planName);
    if (!canAccessExperiment(experiment.id, userTier)) {
      return respErr('experiment_locked');
    }

    // action: 'track_time' | 'complete_challenge' | 'save_parameters'
    switch (action) {
      case 'track_time': {
        const { seconds } = body;
        if (typeof seconds !== 'number' || seconds <= 0) {
          return respErr('invalid_seconds');
        }

        const quota = await trackUsage({
          keyType,
          keyValue,
          experimentId: slug,
          seconds,
          planName,
        });

        const progress = user ? await getProgress(user.id, slug) : null;
        return respData({ experimentId: slug, quota, progress });
      }

      case 'complete_challenge': {
        if (!user) {
          return respErr('login_required');
        }
        const { challengeIds } = body;
        if (!Array.isArray(challengeIds) || challengeIds.length === 0) {
          return respErr('invalid_challenge_ids');
        }

        // Validate challenge IDs against experiment definition
        const validIds = new Set(experiment.challenges.map((c) => c.id));
        const invalid = challengeIds.filter((id: string) => !validIds.has(id));
        if (invalid.length > 0) {
          return respErr('unknown_challenge_ids');
        }

        const progress = await updateProgress({
          userId: user.id,
          experimentId: slug,
          completedChallenges: challengeIds,
        });

        return respData({ experimentId: slug, progress });
      }

      case 'save_parameters': {
        if (!user) {
          return respErr('login_required');
        }
        const { parameters } = body;
        if (!parameters || typeof parameters !== 'object') {
          return respErr('invalid_parameters');
        }

        const progress = await updateProgress({
          userId: user.id,
          experimentId: slug,
          lastParameters: JSON.stringify(parameters),
        });

        return respData({ experimentId: slug, progress });
      }

      default:
        return respErr('invalid_action');
    }
  } catch (error) {
    captureServerError(error, { route: '/api/experiments/[id]/progress' });
    return respErr('track_usage_failed');
  }
}
