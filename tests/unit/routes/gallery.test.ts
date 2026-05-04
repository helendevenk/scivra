import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock all dependencies before importing routes
vi.mock('@/shared/models/user', () => ({
  getUserInfo: vi.fn(),
}));

vi.mock('@/shared/models/upg_generation', () => ({
  getGalleryList: vi.fn(),
  findUpgGenerationById: vi.fn(),
  togglePublish: vi.fn(),
}));

vi.mock('@/shared/models/upg_like', () => ({
  batchCheckLiked: vi.fn(),
  toggleLike: vi.fn(),
}));

import { GET as galleryGet } from '@/app/api/gallery/route';
import { POST as likePost } from '@/app/api/gallery/[id]/like/route';
import { POST as publishPost } from '@/app/api/gallery/publish/route';
import { getUserInfo } from '@/shared/models/user';
import {
  getGalleryList,
  findUpgGenerationById,
  togglePublish,
} from '@/shared/models/upg_generation';
import { batchCheckLiked, toggleLike } from '@/shared/models/upg_like';

const mockGetUserInfo = vi.mocked(getUserInfo);
const mockGetGalleryList = vi.mocked(getGalleryList);
const mockFindUpgGenerationById = vi.mocked(findUpgGenerationById);
const mockTogglePublish = vi.mocked(togglePublish);
const mockBatchCheckLiked = vi.mocked(batchCheckLiked);
const mockToggleLike = vi.mocked(toggleLike);

function makeRequest(url: string, init?: RequestInit): Request {
  return new Request(new URL(url, 'http://localhost'), init);
}

function makeLikeParams(id: string = 'gen-1') {
  return { params: Promise.resolve({ id }) };
}

describe('Gallery API Routes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // --- Gallery List ---

  describe('GET /api/gallery', () => {
    it('should return paginated list', async () => {
      mockGetUserInfo.mockResolvedValue(undefined);
      mockGetGalleryList.mockResolvedValue({
        list: [
          { id: 'gen-1', title: 'Test', isPublic: true },
          { id: 'gen-2', title: 'Test 2', isPublic: true },
        ],
        nextCursor: 'cur-2',
        hasMore: true,
      } as any);

      const req = makeRequest('http://localhost/api/gallery?limit=2');
      const res = await galleryGet(req);
      const json = await res.json();

      expect(json.code).toBe(0);
      expect(json.data.list).toHaveLength(2);
      expect(json.data.nextCursor).toBe('cur-2');
      expect(json.data.hasMore).toBe(true);
    });

    it('should filter by tag', async () => {
      mockGetUserInfo.mockResolvedValue(undefined);
      mockGetGalleryList.mockResolvedValue({
        list: [{ id: 'gen-1', title: 'Gravity' }],
        nextCursor: null,
        hasMore: false,
      } as any);

      const req = makeRequest('http://localhost/api/gallery?tag=physics');
      await galleryGet(req);

      expect(mockGetGalleryList).toHaveBeenCalledWith(
        expect.objectContaining({ tag: 'physics' })
      );
    });

    it('should search with keyword', async () => {
      mockGetUserInfo.mockResolvedValue(undefined);
      mockGetGalleryList.mockResolvedValue({
        list: [],
        nextCursor: null,
        hasMore: false,
      } as any);

      const req = makeRequest('http://localhost/api/gallery?q=pendulum');
      await galleryGet(req);

      expect(mockGetGalleryList).toHaveBeenCalledWith(
        expect.objectContaining({ q: 'pendulum' })
      );
    });

    it('should pass verified-only filter', async () => {
      mockGetUserInfo.mockResolvedValue(undefined);
      mockGetGalleryList.mockResolvedValue({
        list: [],
        nextCursor: null,
        hasMore: false,
      } as any);

      const req = makeRequest('http://localhost/api/gallery?verified=true');
      await galleryGet(req);

      expect(mockGetGalleryList).toHaveBeenCalledWith(
        expect.objectContaining({ verified: true })
      );
    });
  });

  // --- Like ---

  describe('POST /api/gallery/[id]/like', () => {
    it('should require auth to like', async () => {
      mockGetUserInfo.mockResolvedValue(undefined);

      const req = makeRequest('http://localhost/api/gallery/gen-1/like', {
        method: 'POST',
      });
      const res = await likePost(req, makeLikeParams());
      const json = await res.json();

      expect(json.code).toBe(-1);
      expect(json.message).toBe('Please sign in to like');
    });

    it('should toggle like successfully', async () => {
      mockGetUserInfo.mockResolvedValue({ id: 'user-1' } as any);
      mockFindUpgGenerationById.mockResolvedValue({ id: 'gen-1', isPublic: true } as any);
      mockToggleLike.mockResolvedValue({ liked: true, likeCount: 5 } as any);

      const req = makeRequest('http://localhost/api/gallery/gen-1/like', {
        method: 'POST',
      });
      const res = await likePost(req, makeLikeParams());
      const json = await res.json();

      expect(json.code).toBe(0);
      expect(json.data.liked).toBe(true);
      expect(mockToggleLike).toHaveBeenCalledWith('user-1', 'gen-1');
    });

    it('should return not found for non-public generation', async () => {
      mockGetUserInfo.mockResolvedValue({ id: 'user-1' } as any);
      mockFindUpgGenerationById.mockResolvedValue({ id: 'gen-1', isPublic: false } as any);

      const req = makeRequest('http://localhost/api/gallery/gen-1/like', {
        method: 'POST',
      });
      const res = await likePost(req, makeLikeParams());
      const json = await res.json();

      expect(json.code).toBe(-1);
      expect(json.message).toBe('Not found');
    });
  });

  // --- Publish ---

  describe('POST /api/gallery/publish', () => {
    it('should require auth to publish', async () => {
      mockGetUserInfo.mockResolvedValue(undefined);

      const req = makeRequest('http://localhost/api/gallery/publish', {
        method: 'POST',
        body: JSON.stringify({ id: 'gen-1' }),
        headers: { 'Content-Type': 'application/json' },
      });
      const res = await publishPost(req);
      const json = await res.json();

      expect(json.code).toBe(-1);
      expect(json.message).toBe('Please sign in to publish');
    });

    it('should check ownership before publish', async () => {
      mockGetUserInfo.mockResolvedValue({ id: 'user-1' } as any);
      mockTogglePublish.mockResolvedValue(null);

      const req = makeRequest('http://localhost/api/gallery/publish', {
        method: 'POST',
        body: JSON.stringify({ id: 'gen-other' }),
        headers: { 'Content-Type': 'application/json' },
      });
      const res = await publishPost(req);
      const json = await res.json();

      expect(json.code).toBe(-1);
      expect(json.message).toBe('Generation not found or not owned by you');
    });

    it('should toggle isPublic on success', async () => {
      mockGetUserInfo.mockResolvedValue({ id: 'user-1' } as any);
      mockTogglePublish.mockResolvedValue({ id: 'gen-1', isPublic: true } as any);

      const req = makeRequest('http://localhost/api/gallery/publish', {
        method: 'POST',
        body: JSON.stringify({ id: 'gen-1' }),
        headers: { 'Content-Type': 'application/json' },
      });
      const res = await publishPost(req);
      const json = await res.json();

      expect(json.code).toBe(0);
      expect(json.data.isPublic).toBe(true);
      expect(mockTogglePublish).toHaveBeenCalledWith('gen-1', 'user-1');
    });
  });
});
