import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

// Mock all dependencies before importing route
vi.mock('@/shared/models/user', () => ({
  getSignUser: vi.fn(),
}));

vi.mock('@/shared/models/subscription', () => ({
  getCurrentSubscription: vi.fn(),
}));

vi.mock('@/shared/lib/experiments/registry', () => ({
  getExperimentBySlug: vi.fn(),
}));

vi.mock('@/shared/lib/experiments/access', () => ({
  canAccessExperiment: vi.fn(),
  subscriptionToTier: vi.fn(),
}));

vi.mock('@/shared/lib/usage/progress-service', () => ({
  trackUsage: vi.fn(),
  getQuota: vi.fn(),
  getProgress: vi.fn(),
  updateProgress: vi.fn(),
}));

vi.mock('@/extensions/monitoring/sentry', () => ({
  captureServerError: vi.fn(),
}));

import { GET, POST } from '@/app/api/experiments/[id]/progress/route';
import { getSignUser } from '@/shared/models/user';
import { getCurrentSubscription } from '@/shared/models/subscription';
import { getExperimentBySlug } from '@/shared/lib/experiments/registry';
import { canAccessExperiment, subscriptionToTier } from '@/shared/lib/experiments/access';
import {
  trackUsage,
  getQuota,
  getProgress,
  updateProgress,
} from '@/shared/lib/usage/progress-service';

const mockGetSignUser = vi.mocked(getSignUser);
const mockGetCurrentSubscription = vi.mocked(getCurrentSubscription);
const mockGetExperimentBySlug = vi.mocked(getExperimentBySlug);
const mockCanAccessExperiment = vi.mocked(canAccessExperiment);
const mockSubscriptionToTier = vi.mocked(subscriptionToTier);
const mockTrackUsage = vi.mocked(trackUsage);
const mockGetQuota = vi.mocked(getQuota);
const mockGetProgress = vi.mocked(getProgress);
const mockUpdateProgress = vi.mocked(updateProgress);

const SLUG = 'projectile-motion';
const EXPERIMENT = {
  id: 'exp-1',
  slug: SLUG,
  challenges: [
    { id: 'ch-1', title: 'Challenge 1' },
    { id: 'ch-2', title: 'Challenge 2' },
  ],
} as any;

function makeRequest(url: string, init?: RequestInit): NextRequest {
  return new NextRequest(new URL(url, 'http://localhost'), init as any);
}

function makeParams(id: string = SLUG) {
  return { params: Promise.resolve({ id }) };
}

describe('Experiment Progress API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSubscriptionToTier.mockReturnValue('free' as any);
    mockCanAccessExperiment.mockReturnValue(true);
    mockGetCurrentSubscription.mockResolvedValue(undefined as any);
  });

  // --- GET ---

  describe('GET /api/experiments/[id]/progress', () => {
    it('should return quota and progress for authenticated user', async () => {
      mockGetExperimentBySlug.mockReturnValue(EXPERIMENT);
      mockGetSignUser.mockResolvedValue({ id: 'user-1' } as any);
      mockGetQuota.mockResolvedValue({ remaining: 300, limit: 300, used: 0 } as any);
      mockGetProgress.mockResolvedValue({ completedChallenges: ['ch-1'] } as any);

      const req = makeRequest(`http://localhost/api/experiments/${SLUG}/progress`);
      const res = await GET(req, makeParams());
      const json = await res.json();

      expect(json.code).toBe(0);
      expect(json.data.experimentId).toBe(SLUG);
      expect(json.data.quota).toEqual({ remaining: 300, limit: 300, used: 0 });
      expect(json.data.progress).toEqual({ completedChallenges: ['ch-1'] });
    });

    it('should return experiment_not_found for unknown slug', async () => {
      mockGetExperimentBySlug.mockReturnValue(undefined);

      const req = makeRequest('http://localhost/api/experiments/unknown/progress');
      const res = await GET(req, makeParams('unknown'));
      const json = await res.json();

      expect(json.code).toBe(-1);
      expect(json.message).toBe('experiment_not_found');
    });

    it('should return experiment_locked when free tier cannot access', async () => {
      mockGetExperimentBySlug.mockReturnValue(EXPERIMENT);
      mockGetSignUser.mockResolvedValue({ id: 'user-1' } as any);
      mockCanAccessExperiment.mockReturnValue(false);

      const req = makeRequest(`http://localhost/api/experiments/${SLUG}/progress`);
      const res = await GET(req, makeParams());
      const json = await res.json();

      expect(json.code).toBe(-1);
      expect(json.message).toBe('experiment_locked');
    });
  });

  // --- POST ---

  describe('POST /api/experiments/[id]/progress', () => {
    it('should track_time with valid seconds', async () => {
      mockGetExperimentBySlug.mockReturnValue(EXPERIMENT);
      mockGetSignUser.mockResolvedValue({ id: 'user-1' } as any);
      mockTrackUsage.mockResolvedValue({ remaining: 240, limit: 300, used: 60 } as any);
      mockGetProgress.mockResolvedValue(undefined as any);

      const req = makeRequest(`http://localhost/api/experiments/${SLUG}/progress`, {
        method: 'POST',
        body: JSON.stringify({ action: 'track_time', seconds: 60 }),
        headers: { 'Content-Type': 'application/json' },
      });

      const res = await POST(req, makeParams());
      const json = await res.json();

      expect(json.code).toBe(0);
      expect(json.data.quota.remaining).toBe(240);
      expect(mockTrackUsage).toHaveBeenCalledWith(
        expect.objectContaining({ seconds: 60, experimentId: SLUG })
      );
    });

    it('should reject track_time with invalid seconds', async () => {
      mockGetExperimentBySlug.mockReturnValue(EXPERIMENT);
      mockGetSignUser.mockResolvedValue({ id: 'user-1' } as any);

      const req = makeRequest(`http://localhost/api/experiments/${SLUG}/progress`, {
        method: 'POST',
        body: JSON.stringify({ action: 'track_time', seconds: -5 }),
        headers: { 'Content-Type': 'application/json' },
      });

      const res = await POST(req, makeParams());
      const json = await res.json();

      expect(json.code).toBe(-1);
      expect(json.message).toBe('invalid_seconds');
    });

    it('should complete_challenge for authenticated user', async () => {
      mockGetExperimentBySlug.mockReturnValue(EXPERIMENT);
      mockGetSignUser.mockResolvedValue({ id: 'user-1' } as any);
      mockUpdateProgress.mockResolvedValue({
        completedChallenges: ['ch-1'],
      } as any);

      const req = makeRequest(`http://localhost/api/experiments/${SLUG}/progress`, {
        method: 'POST',
        body: JSON.stringify({ action: 'complete_challenge', challengeIds: ['ch-1'] }),
        headers: { 'Content-Type': 'application/json' },
      });

      const res = await POST(req, makeParams());
      const json = await res.json();

      expect(json.code).toBe(0);
      expect(json.data.progress.completedChallenges).toContain('ch-1');
    });

    it('should require auth for complete_challenge', async () => {
      mockGetExperimentBySlug.mockReturnValue(EXPERIMENT);
      mockGetSignUser.mockResolvedValue(undefined);

      const req = makeRequest(`http://localhost/api/experiments/${SLUG}/progress`, {
        method: 'POST',
        body: JSON.stringify({ action: 'complete_challenge', challengeIds: ['ch-1'] }),
        headers: { 'Content-Type': 'application/json' },
      });

      const res = await POST(req, makeParams());
      const json = await res.json();

      expect(json.code).toBe(-1);
      expect(json.message).toBe('login_required');
    });

    it('should reject invalid action', async () => {
      mockGetExperimentBySlug.mockReturnValue(EXPERIMENT);
      mockGetSignUser.mockResolvedValue({ id: 'user-1' } as any);

      const req = makeRequest(`http://localhost/api/experiments/${SLUG}/progress`, {
        method: 'POST',
        body: JSON.stringify({ action: 'fly_to_moon' }),
        headers: { 'Content-Type': 'application/json' },
      });

      const res = await POST(req, makeParams());
      const json = await res.json();

      expect(json.code).toBe(-1);
      expect(json.message).toBe('invalid_action');
    });
  });
});
