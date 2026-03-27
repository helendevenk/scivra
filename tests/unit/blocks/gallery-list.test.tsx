import { vi, describe, it, expect, beforeEach } from 'vitest';

vi.mock('next-intl', () => ({
  useTranslations: vi.fn(() => (key: string, params?: Record<string, string>) => {
    if (key === 'search.placeholder') return 'Search experiments...';
    if (key === 'filter.latest') return 'Latest';
    if (key === 'filter.popular') return 'Popular';
    if (key === 'filter.most_liked') return 'Most Liked';
    if (key === 'filter.verified') return 'Verified Only';
    if (key === 'empty.title') return 'No results found';
    if (key === 'empty.description') return 'Try a different search';
    if (key === 'errors.load_failed') return 'Load failed';
    if (key === 'tag.title' && params?.tag) return `Tag: ${params.tag}`;
    return key;
  }),
}));

vi.mock('@/shared/contexts/app', () => ({
  useAppContext: vi.fn(() => ({ user: null })),
}));

vi.mock('@/shared/components/ui/button', () => ({
  Button: ({ children, onClick, ...props }: any) => (
    <button onClick={onClick} {...props}>{children}</button>
  ),
}));

vi.mock('@/shared/components/ui/input', () => ({
  Input: ({ placeholder, value, onChange, className }: any) => (
    <input placeholder={placeholder} value={value} onChange={onChange} className={className} />
  ),
}));

vi.mock('@/shared/components/ui/skeleton', () => ({
  Skeleton: ({ className }: any) => <div data-testid="skeleton" className={className} />,
}));

vi.mock('@/shared/lib/utils', () => ({
  cn: (...args: unknown[]) => args.filter(Boolean).join(' '),
}));

vi.mock('lucide-react', () => ({
  BadgeCheck: ({ className }: any) => <svg data-testid="icon-badge-check" className={className} />,
  Eye: ({ className }: any) => <svg data-testid="icon-eye" className={className} />,
  GitFork: ({ className }: any) => <svg data-testid="icon-fork" className={className} />,
  Heart: ({ className }: any) => <svg data-testid="icon-heart" className={className} />,
  Search: ({ className }: any) => <svg data-testid="icon-search" className={className} />,
}));

vi.mock('sonner', () => ({
  toast: { error: vi.fn(), success: vi.fn() },
}));

vi.mock('@/shared/blocks/gallery/gallery-card', () => ({
  GalleryCard: ({ item, onLike, onTagClick }: any) => (
    <div data-testid={`gallery-card-${item.id}`}>
      <span>{item.prompt}</span>
      <button data-testid={`like-${item.id}`} onClick={() => onLike(item.id)}>Like</button>
      <button data-testid={`tag-${item.id}`} onClick={() => onTagClick('physics')}>Tag</button>
    </div>
  ),
}));

import { render, waitFor } from '@testing-library/react';
import { GalleryList } from '@/shared/blocks/gallery/gallery-list';

function makeApiResponse(list: any[] = [], hasMore = false, nextCursor?: string) {
  return {
    ok: true,
    json: () => Promise.resolve({
      code: 0,
      data: { list, hasMore, nextCursor },
    }),
  };
}

function makeItem(id: string, prompt: string) {
  return {
    id, prompt, language: 'en', userId: 'user-1', userName: 'Alice',
    viewCount: 10, likeCount: 5, forkCount: 2, tags: ['physics'],
    validationScore: 80, createdAt: '2026-01-01T00:00:00Z', isLiked: false,
  };
}

describe('GalleryList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal('IntersectionObserver', vi.fn(() => ({
      observe: vi.fn(), disconnect: vi.fn(), unobserve: vi.fn(),
    })));
  });

  it('should show skeletons while loading', () => {
    global.fetch = vi.fn(() => new Promise(() => {})) as any;
    const { container } = render(<GalleryList />);
    expect(container.querySelectorAll('[data-testid="skeleton"]').length).toBe(6);
  });

  it('should render gallery items after fetch', async () => {
    const items = [makeItem('1', 'Gravity sim'), makeItem('2', 'Wave sim')];
    global.fetch = vi.fn(() => Promise.resolve(makeApiResponse(items))) as any;

    const { container } = render(<GalleryList />);

    await waitFor(() => {
      expect(container.querySelector('[data-testid="gallery-card-1"]')).toBeInTheDocument();
      expect(container.querySelector('[data-testid="gallery-card-2"]')).toBeInTheDocument();
    });
  });

  it('should show empty state when no items returned', async () => {
    global.fetch = vi.fn(() => Promise.resolve(makeApiResponse([]))) as any;

    const { container } = render(<GalleryList />);

    await waitFor(() => {
      expect(container.textContent).toContain('No results found');
      expect(container.textContent).toContain('Try a different search');
    });
  });

  it('should render search input', () => {
    global.fetch = vi.fn(() => new Promise(() => {})) as any;
    const { container } = render(<GalleryList />);
    expect(container.querySelector('input[placeholder="Search experiments..."]')).toBeInTheDocument();
  });

  it('should render sort buttons', () => {
    global.fetch = vi.fn(() => new Promise(() => {})) as any;
    const { container } = render(<GalleryList />);
    const buttons = Array.from(container.querySelectorAll('button')).map((b) => b.textContent);
    expect(buttons).toContain('Latest');
    expect(buttons).toContain('Popular');
    expect(buttons).toContain('Most Liked');
  });

  it('should render verified filter button', () => {
    global.fetch = vi.fn(() => new Promise(() => {})) as any;
    const { container } = render(<GalleryList />);
    const buttons = Array.from(container.querySelectorAll('button')).map((b) => b.textContent?.trim());
    expect(buttons.some((t) => t?.includes('Verified Only'))).toBe(true);
  });

  it('should show tag indicator with initialTag', async () => {
    global.fetch = vi.fn(() => Promise.resolve(makeApiResponse([]))) as any;
    const { container } = render(<GalleryList initialTag="physics" />);

    await waitFor(() => {
      expect(container.textContent).toContain('Tag: physics');
    });
  });

  it('should handle fetch error gracefully', async () => {
    global.fetch = vi.fn(() => Promise.reject(new Error('Network error'))) as any;
    const { toast } = await import('sonner');

    render(<GalleryList />);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Load failed');
    });
  });

  it('should handle API error response', async () => {
    global.fetch = vi.fn(() => Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ code: 1, message: 'Server error' }),
    })) as any;
    const { toast } = await import('sonner');

    render(<GalleryList />);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Server error');
    });
  });
});
