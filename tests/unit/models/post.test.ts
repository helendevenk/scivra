import { vi, describe, it, expect, beforeEach } from 'vitest';

vi.mock('@/core/db', () => ({
  db: vi.fn(),
}));

// Mock heavy deps that post.tsx imports but DB functions don't use
vi.mock('react', () => ({
  cache: (fn: any) => fn,
  createElement: vi.fn(),
}));
vi.mock('@/mdx-components', () => ({
  getMDXComponents: vi.fn(() => ({})),
}));
vi.mock('fumadocs-ui/mdx', () => ({
  createRelativeLink: vi.fn(),
}));
vi.mock('fumadocs-core/source', () => ({
  loader: vi.fn(() => ({ getPage: vi.fn(), getPages: vi.fn(() => []) })),
}));
vi.mock('@/core/docs/source', () => ({
  postsSource: { getPage: vi.fn(), getPages: vi.fn(() => []) },
  pagesSource: { getPage: vi.fn(), getPages: vi.fn(() => []) },
  logsSource: { getPage: vi.fn(), getPages: vi.fn(() => []) },
}));
vi.mock('@/core/docs/toc', () => ({
  generateTOC: vi.fn(() => []),
}));
vi.mock('@/shared/blocks/common/markdown-content', () => ({
  MarkdownContent: vi.fn(),
}));
vi.mock('@/shared/models/taxonomy', () => ({
  getTaxonomies: vi.fn(() => []),
  TaxonomyType: { CATEGORY: 'category', TAG: 'tag' },
  TaxonomyStatus: {
    PUBLISHED: 'published',
    DRAFT: 'draft',
    ARCHIVED: 'archived',
  },
}));

import { db } from '@/core/db';
import { createMockDb } from '../../helpers/mock-db';
import {
  addPost,
  updatePost,
  deletePost,
  findPost,
  getPosts,
  getPostsCount,
  getPostSlug,
  getPostDate,
  removePostFrontmatter,
  PostType,
  PostStatus,
} from '@/shared/models/post';

let mockDb: ReturnType<typeof createMockDb>;

beforeEach(() => {
  vi.clearAllMocks();
  mockDb = createMockDb();
  vi.mocked(db).mockReturnValue(mockDb as any);
});

const MOCK_POST = {
  id: 'post-1',
  slug: 'hello-world',
  title: 'Hello World',
  description: 'A test post',
  content: '# Hello',
  type: PostType.ARTICLE,
  status: PostStatus.PUBLISHED,
  categories: 'physics',
  tags: 'intro',
  authorName: 'Test Author',
  authorImage: '/avatar.png',
  image: '/cover.png',
  createdAt: new Date('2026-01-15'),
  updatedAt: new Date('2026-03-20'),
};

// ─── addPost ───

describe('addPost', () => {
  it('inserts a new post and returns it', async () => {
    mockDb._resolveInsert([MOCK_POST]);

    const result = await addPost({
      id: 'post-1',
      slug: 'hello-world',
      title: 'Hello World',
      type: PostType.ARTICLE,
    });

    expect(result).toEqual(MOCK_POST);
    expect(mockDb.insert).toHaveBeenCalled();
    expect(mockDb.values).toHaveBeenCalled();
    expect(mockDb.returning).toHaveBeenCalled();
  });
});

// ─── updatePost ───

describe('updatePost', () => {
  it('updates post fields and returns updated record', async () => {
    const updated = { ...MOCK_POST, title: 'Updated Title' };
    mockDb._resolveInsert([updated]);

    const result = await updatePost('post-1', { title: 'Updated Title' });

    expect(result.title).toBe('Updated Title');
    expect(mockDb.update).toHaveBeenCalled();
    expect(mockDb.set).toHaveBeenCalled();
    expect(mockDb.where).toHaveBeenCalled();
    expect(mockDb.returning).toHaveBeenCalled();
  });

  it('returns undefined when post does not exist', async () => {
    mockDb._resolveInsert([]);

    const result = await updatePost('nonexistent', { title: 'X' });

    expect(result).toBeUndefined();
  });
});

// ─── deletePost ───

describe('deletePost', () => {
  it('soft-deletes by setting status to ARCHIVED', async () => {
    const archived = { ...MOCK_POST, status: PostStatus.ARCHIVED };
    mockDb._resolveInsert([archived]);

    const result = await deletePost('post-1');

    expect(result.status).toBe(PostStatus.ARCHIVED);
    expect(mockDb.update).toHaveBeenCalled();
    expect(mockDb.set).toHaveBeenCalled();
  });
});

// ─── findPost ───

describe('findPost', () => {
  it('returns post when found by id', async () => {
    mockDb._resolveSelect([MOCK_POST]);

    const result = await findPost({ id: 'post-1' });

    expect(result).toEqual(MOCK_POST);
    expect(mockDb.select).toHaveBeenCalled();
    expect(mockDb.from).toHaveBeenCalled();
    expect(mockDb.where).toHaveBeenCalled();
    expect(mockDb.limit).toHaveBeenCalled();
  });

  it('returns post when found by slug', async () => {
    mockDb._resolveSelect([MOCK_POST]);

    const result = await findPost({ slug: 'hello-world' });

    expect(result).toEqual(MOCK_POST);
  });

  it('returns post when found by status', async () => {
    mockDb._resolveSelect([MOCK_POST]);

    const result = await findPost({ status: PostStatus.PUBLISHED });

    expect(result).toEqual(MOCK_POST);
  });

  it('supports combined filters', async () => {
    mockDb._resolveSelect([MOCK_POST]);

    const result = await findPost({
      slug: 'hello-world',
      status: PostStatus.PUBLISHED,
    });

    expect(result).toEqual(MOCK_POST);
    expect(mockDb.where).toHaveBeenCalled();
  });

  it('returns undefined when not found', async () => {
    mockDb._resolveSelect([]);

    const result = await findPost({ id: 'nonexistent' });

    expect(result).toBeUndefined();
  });
});

// ─── getPosts ───

describe('getPosts', () => {
  it('returns paginated list with defaults', async () => {
    mockDb._resolveSelect([MOCK_POST]);

    const result = await getPosts();

    expect(result).toHaveLength(1);
    expect(mockDb.select).toHaveBeenCalled();
    expect(mockDb.from).toHaveBeenCalled();
    expect(mockDb.orderBy).toHaveBeenCalled();
    expect(mockDb.limit).toHaveBeenCalled();
    expect(mockDb.offset).toHaveBeenCalled();
  });

  it('filters by type', async () => {
    mockDb._resolveSelect([MOCK_POST]);

    const result = await getPosts({ type: PostType.ARTICLE });

    expect(result).toHaveLength(1);
    expect(mockDb.where).toHaveBeenCalled();
  });

  it('filters by status', async () => {
    mockDb._resolveSelect([]);

    const result = await getPosts({ status: PostStatus.DRAFT });

    expect(result).toHaveLength(0);
  });

  it('filters by category', async () => {
    mockDb._resolveSelect([MOCK_POST]);

    const result = await getPosts({ category: 'physics' });

    expect(result).toHaveLength(1);
    expect(mockDb.where).toHaveBeenCalled();
  });

  it('filters by tag', async () => {
    mockDb._resolveSelect([MOCK_POST]);

    const result = await getPosts({ tag: ['intro'] });

    expect(result).toHaveLength(1);
    expect(mockDb.where).toHaveBeenCalled();
  });

  it('applies custom page and limit', async () => {
    mockDb._resolveSelect([]);

    await getPosts({ page: 3, limit: 10 });

    expect(mockDb.limit).toHaveBeenCalled();
    expect(mockDb.offset).toHaveBeenCalled();
  });

  it('returns empty array when no results', async () => {
    mockDb._resolveSelect([]);

    const result = await getPosts();

    expect(result).toEqual([]);
  });
});

// ─── getPostsCount ───

describe('getPostsCount', () => {
  it('returns count', async () => {
    mockDb._resolveSelect([{ count: 42 }]);

    const result = await getPostsCount();

    expect(result).toBe(42);
  });

  it('returns count filtered by type', async () => {
    mockDb._resolveSelect([{ count: 10 }]);

    const result = await getPostsCount({ type: PostType.ARTICLE });

    expect(result).toBe(10);
    expect(mockDb.where).toHaveBeenCalled();
  });

  it('returns count filtered by category', async () => {
    mockDb._resolveSelect([{ count: 5 }]);

    const result = await getPostsCount({ category: 'physics' });

    expect(result).toBe(5);
  });

  it('returns count filtered by tag', async () => {
    mockDb._resolveSelect([{ count: 3 }]);

    const result = await getPostsCount({ tag: 'intro' });

    expect(result).toBe(3);
  });

  it('returns 0 when no results', async () => {
    mockDb._resolveSelect([undefined]);

    const result = await getPostsCount();

    expect(result).toBe(0);
  });

  it('returns 0 when count is 0', async () => {
    mockDb._resolveSelect([{ count: 0 }]);

    const result = await getPostsCount();

    expect(result).toBe(0);
  });
});

// ─── getPostSlug (pure function) ───

describe('getPostSlug', () => {
  it('strips prefix from url', () => {
    const slug = getPostSlug({
      url: '/blog/hello-world',
      locale: 'en',
      prefix: '/blog/',
    });

    expect(slug).toBe('hello-world');
  });

  it('strips locale + prefix from url', () => {
    const slug = getPostSlug({
      url: '/zh/blog/hello-world',
      locale: 'zh',
      prefix: '/blog/',
    });

    expect(slug).toBe('hello-world');
  });

  it('returns url unchanged when no prefix match', () => {
    const slug = getPostSlug({
      url: '/other/path',
      locale: 'en',
      prefix: '/blog/',
    });

    expect(slug).toBe('/other/path');
  });

  it('uses default prefix /blog/', () => {
    const slug = getPostSlug({
      url: '/blog/my-post',
      locale: 'en',
    });

    expect(slug).toBe('my-post');
  });
});

// ─── getPostDate (pure function) ───

describe('getPostDate', () => {
  it('formats date in English locale', () => {
    const date = getPostDate({
      created_at: '2026-03-15',
      locale: 'en',
    });

    expect(date).toBe('Mar 15, 2026');
  });

  it('formats date in Chinese locale', () => {
    const date = getPostDate({
      created_at: '2026-03-15',
      locale: 'zh',
    });

    expect(date).toBe('2026/03/15');
  });

  it('defaults to English format when no locale', () => {
    const date = getPostDate({
      created_at: '2026-01-01',
    });

    expect(date).toBe('Jan 1, 2026');
  });
});

// ─── removePostFrontmatter (pure function) ───

describe('removePostFrontmatter', () => {
  it('removes frontmatter from markdown content', () => {
    const content = `---
title: Hello
date: 2026-01-01
---
# Hello World

Content here.`;

    const result = removePostFrontmatter(content);

    expect(result).toBe('# Hello World\n\nContent here.');
  });

  it('returns content unchanged when no frontmatter', () => {
    const content = '# No Frontmatter\n\nJust content.';

    const result = removePostFrontmatter(content);

    expect(result).toBe(content);
  });

  it('returns empty string for frontmatter-only content', () => {
    const content = `---
title: Only Frontmatter
---
`;

    const result = removePostFrontmatter(content);

    expect(result).toBe('');
  });

  it('handles Windows-style line endings', () => {
    const content = '---\r\ntitle: Hello\r\n---\r\n# Content';

    const result = removePostFrontmatter(content);

    expect(result).toBe('# Content');
  });
});

// ─── Enum values ───

describe('PostType enum', () => {
  it('has correct values', () => {
    expect(PostType.ARTICLE).toBe('article');
    expect(PostType.PAGE).toBe('page');
    expect(PostType.LOG).toBe('log');
  });
});

describe('PostStatus enum', () => {
  it('has correct values', () => {
    expect(PostStatus.PUBLISHED).toBe('published');
    expect(PostStatus.PENDING).toBe('pending');
    expect(PostStatus.DRAFT).toBe('draft');
    expect(PostStatus.ARCHIVED).toBe('archived');
  });
});
