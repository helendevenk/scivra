import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({ push: vi.fn(), replace: vi.fn() })),
  usePathname: vi.fn(() => '/'),
  useSearchParams: vi.fn(() => new URLSearchParams()),
  useParams: vi.fn(() => ({ locale: 'en' })),
}));
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) => <a href={href} {...props}>{children}</a>,
}));
vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: any) => <img src={src} alt={alt} {...props} />,
}));
const stableT = (key: string, params?: Record<string, unknown>) => {
  if (params) return `${key}:${JSON.stringify(params)}`;
  return key;
};
vi.mock('next-intl', () => ({
  useTranslations: vi.fn(() => stableT),
  useLocale: vi.fn(() => 'en'),
}));
vi.mock('@/core/i18n/navigation', () => ({
  Link: ({ children, href, ...props }: any) => <a href={href} {...props}>{children}</a>,
  useRouter: vi.fn(() => ({ push: vi.fn() })),
  usePathname: vi.fn(() => '/'),
}));

import { render, fireEvent, waitFor, within, act } from '@testing-library/react';
import { LearningPathList } from '@/shared/blocks/learning-path/learning-path-list';

const mockPaths = [
  {
    id: 'path-1',
    slug: 'mechanics',
    titleEn: 'Mechanics',
    titleZh: '力学',
    descriptionEn: 'Classical mechanics',
    descriptionZh: '经典力学',
    category: 'Physics',
    level: 'beginner',
    nodeCount: 8,
    coverImage: null,
  },
  {
    id: 'path-2',
    slug: 'optics',
    titleEn: 'Optics',
    titleZh: '光学',
    descriptionEn: 'Light and waves',
    descriptionZh: '光与波',
    category: 'Physics',
    level: 'intermediate',
    nodeCount: 5,
    coverImage: null,
  },
];

const mockProgress = [
  { pathId: 'path-1', currentNode: 3, completed: false },
];

describe('LearningPathList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  afterEach(() => {
    cleanup();
  });

  function mockFetchSuccess(paths = mockPaths, progress = mockProgress) {
    (global.fetch as any).mockResolvedValueOnce({
      json: () => Promise.resolve({ data: { paths, progress } }),
    });
  }

  function mockFetchError() {
    (global.fetch as any).mockRejectedValueOnce(new Error('Network error'));
  }

  function mockFetchNoData() {
    (global.fetch as any).mockResolvedValueOnce({
      json: () => Promise.resolve({ data: null }),
    });
  }

  it('should render loading skeletons initially', () => {
    (global.fetch as any).mockReturnValueOnce(new Promise(() => {}));
    const { container } = render(<LearningPathList />);
    const skeletons = container.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBe(3);
  });

  it('should render level filter buttons', () => {
    (global.fetch as any).mockReturnValueOnce(new Promise(() => {}));
    const { container } = render(<LearningPathList />);
    const view = within(container);
    expect(view.getByText('page.filter_all')).toBeDefined();
    expect(view.getByText('page.filter_beginner')).toBeDefined();
    expect(view.getByText('page.filter_intermediate')).toBeDefined();
    expect(view.getByText('page.filter_advanced')).toBeDefined();
  });

  it('should fetch and render paths', async () => {
    mockFetchSuccess();
    const { container } = render(<LearningPathList />);
    const view = within(container);

    await waitFor(() => {
      expect(view.getByText('Mechanics')).toBeDefined();
      expect(view.getByText('Optics')).toBeDefined();
    });
  });

  it('should show empty state when no paths', async () => {
    mockFetchSuccess([], []);
    const { container } = render(<LearningPathList />);
    const view = within(container);

    await waitFor(() => {
      expect(view.getByText('empty.title')).toBeDefined();
      expect(view.getByText('empty.description')).toBeDefined();
    });
  });

  it('should show error state on fetch failure', async () => {
    mockFetchError();
    const { container } = render(<LearningPathList />);
    const view = within(container);

    await waitFor(() => {
      expect(view.getByText('errors.load_failed')).toBeDefined();
    });
  });

  it('should show error state when data is null', async () => {
    mockFetchNoData();
    const { container } = render(<LearningPathList />);
    const view = within(container);

    await waitFor(() => {
      expect(view.getByText('errors.load_failed')).toBeDefined();
    });
  });

  it('should refetch when level filter changes', async () => {
    mockFetchSuccess();
    const { container } = render(<LearningPathList />);
    const view = within(container);

    await waitFor(() => {
      expect(view.getByText('Mechanics')).toBeDefined();
    });

    mockFetchSuccess([mockPaths[0]], []);

    await act(async () => {
      fireEvent.click(view.getByText('page.filter_beginner'));
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(2);
    });
    const secondCall = (global.fetch as any).mock.calls[1][0] as string;
    expect(secondCall).toContain('level=beginner');
  });

  it('should not include level param for "all" filter', async () => {
    mockFetchSuccess();
    render(<LearningPathList />);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });
    const firstCall = (global.fetch as any).mock.calls[0][0] as string;
    expect(firstCall).not.toContain('level=');
  });

  it('should pass progress to LearningPathCard', async () => {
    mockFetchSuccess();
    const { container } = render(<LearningPathList />);
    const view = within(container);

    await waitFor(() => {
      expect(view.getByText('card.continue')).toBeDefined();
      expect(view.getByText('card.start')).toBeDefined();
    });
  });
});
