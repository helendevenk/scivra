import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock all dependencies before importing routes
vi.mock('@/shared/models/user', () => ({
  getSignUser: vi.fn(),
}));

vi.mock('@/core/compliance/repository', () => ({
  createDrizzleComplianceRepository: vi.fn(() => ({})),
}));

const mockCreatePrivacyRequest = vi.fn();
const mockGetPrivacyRequestStatus = vi.fn();

vi.mock('@/core/compliance', () => ({
  createComplianceService: vi.fn(() => ({
    createPrivacyRequest: mockCreatePrivacyRequest,
    getPrivacyRequestStatus: mockGetPrivacyRequestStatus,
  })),
}));

vi.mock('@/extensions/monitoring/sentry', () => ({
  captureServerError: vi.fn(),
}));

import { POST as exportPost } from '@/app/api/privacy/export/route';
import { POST as deletePost } from '@/app/api/privacy/delete/route';
import { GET as statusGet } from '@/app/api/privacy/status/[id]/route';
import { getSignUser } from '@/shared/models/user';

const mockGetSignUser = vi.mocked(getSignUser);

function makeNextRequest(url: string = 'http://localhost/api/privacy/status/req-1') {
  return new Request(url) as any;
}

describe('Privacy API Routes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // --- Export ---

  describe('POST /api/privacy/export', () => {
    it('should return unauthorized when not signed in', async () => {
      mockGetSignUser.mockResolvedValue(undefined);

      const res = await exportPost();
      const json = await res.json();

      expect(json.code).toBe(-1);
      expect(json.message).toBe('unauthorized');
    });

    it('should create export request for authenticated user', async () => {
      mockGetSignUser.mockResolvedValue({ id: 'user-1', email: 'a@b.com' } as any);
      mockCreatePrivacyRequest.mockResolvedValue({ id: 'req-1', status: 'pending' });

      const res = await exportPost();
      const json = await res.json();

      expect(json.code).toBe(0);
      expect(json.data).toEqual({ id: 'req-1', status: 'pending' });
      expect(mockCreatePrivacyRequest).toHaveBeenCalledWith({
        userId: 'user-1',
        requestType: 'export',
      });
    });

    it('should return pending status in export response', async () => {
      mockGetSignUser.mockResolvedValue({ id: 'user-2' } as any);
      mockCreatePrivacyRequest.mockResolvedValue({
        id: 'req-2',
        status: 'pending',
        requestType: 'export',
      });

      const res = await exportPost();
      const json = await res.json();

      expect(json.data.status).toBe('pending');
    });
  });

  // --- Delete ---

  describe('POST /api/privacy/delete', () => {
    it('should return unauthorized when not signed in', async () => {
      mockGetSignUser.mockResolvedValue(undefined);

      const res = await deletePost();
      const json = await res.json();

      expect(json.code).toBe(-1);
      expect(json.message).toBe('unauthorized');
    });

    it('should create delete request for authenticated user', async () => {
      mockGetSignUser.mockResolvedValue({ id: 'user-1' } as any);
      mockCreatePrivacyRequest.mockResolvedValue({ id: 'req-3', status: 'pending' });

      const res = await deletePost();
      const json = await res.json();

      expect(json.code).toBe(0);
      expect(mockCreatePrivacyRequest).toHaveBeenCalledWith({
        userId: 'user-1',
        requestType: 'delete',
      });
    });

    it('should handle service error on delete (cascade failure)', async () => {
      mockGetSignUser.mockResolvedValue({ id: 'user-1' } as any);
      mockCreatePrivacyRequest.mockRejectedValue(new Error('cascade failed'));

      const res = await deletePost();
      const json = await res.json();

      expect(json.code).toBe(-1);
      expect(json.message).toBe('delete_request_failed');
    });
  });

  // --- Status ---

  describe('GET /api/privacy/status/[id]', () => {
    it('should return request state for valid request', async () => {
      mockGetSignUser.mockResolvedValue({ id: 'user-1' } as any);
      mockGetPrivacyRequestStatus.mockResolvedValue({
        ok: true,
        status: 'processing',
        requestType: 'export',
      });

      const res = await statusGet(makeNextRequest(), {
        params: Promise.resolve({ id: 'req-1' }),
      });
      const json = await res.json();

      expect(json.code).toBe(0);
      expect(json.data.status).toBe('processing');
    });

    it('should handle duplicate request by returning existing status', async () => {
      mockGetSignUser.mockResolvedValue({ id: 'user-1' } as any);
      // Simulate duplicate — service returns ok with existing request
      mockCreatePrivacyRequest.mockResolvedValue({
        id: 'req-existing',
        status: 'pending',
        requestType: 'export',
      });

      const res1 = await exportPost();
      const json1 = await res1.json();
      expect(json1.code).toBe(0);
      expect(json1.data.id).toBe('req-existing');

      // Second call returns same
      const res2 = await exportPost();
      const json2 = await res2.json();
      expect(json2.data.id).toBe('req-existing');
    });

    it('should return error for invalid user (not found)', async () => {
      mockGetSignUser.mockResolvedValue(undefined);

      const res = await statusGet(makeNextRequest(), {
        params: Promise.resolve({ id: 'req-1' }),
      });
      const json = await res.json();

      expect(json.code).toBe(-1);
      expect(json.message).toBe('unauthorized');
    });

    it('should return not_found when request does not exist', async () => {
      mockGetSignUser.mockResolvedValue({ id: 'user-1' } as any);
      mockGetPrivacyRequestStatus.mockResolvedValue({ ok: false });

      const res = await statusGet(makeNextRequest(), {
        params: Promise.resolve({ id: 'nonexistent' }),
      });
      const json = await res.json();

      expect(json.code).toBe(-1);
      expect(json.message).toBe('not_found');
    });
  });
});
