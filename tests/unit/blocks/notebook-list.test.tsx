import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({ push: mockPush, replace: vi.fn(), refresh: vi.fn() })),
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
vi.mock('next-intl', () => ({
  useTranslations: vi.fn(() => (key: string, params?: Record<string, unknown>) => {
    if (params) return `${key}:${JSON.stringify(params)}`;
    return key;
  }),
  useLocale: vi.fn(() => 'en'),
}));

import { render, fireEvent, waitFor, within } from '@testing-library/react';
import { NotebookList } from '@/shared/blocks/notebook/NotebookList';

function makeNotebook(overrides: Partial<any> = {}) {
  return {
    id: 'nb-1',
    title: 'Test Notebook',
    status: 'draft',
    version: 1,
    updatedAt: '2026-03-20T00:00:00Z',
    ...overrides,
  };
}

describe('NotebookList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
    global.alert = vi.fn();
  });

  afterEach(() => {
    cleanup();
  });

  const defaultProps = {
    notebooks: [makeNotebook()],
    total: 1,
    page: 1,
    pageSize: 10,
    currentStatus: 'all',
  };

  it('should render without crashing', () => {
    const { container } = render(<NotebookList {...defaultProps} />);
    const view = within(container);
    expect(view.getByText('Test Notebook')).toBeDefined();
  });

  it('should show empty state when notebooks is empty', () => {
    const { container } = render(<NotebookList {...defaultProps} notebooks={[]} />);
    const view = within(container);
    expect(view.getByText('list.empty')).toBeDefined();
  });

  it('should render status badge for each notebook', () => {
    const { container } = render(<NotebookList {...defaultProps} />);
    const view = within(container);
    expect(view.getByText('card.draft')).toBeDefined();
  });

  it('should render multiple notebooks', () => {
    const notebooks = [
      makeNotebook({ id: 'nb-1', title: 'First' }),
      makeNotebook({ id: 'nb-2', title: 'Second', status: 'completed' }),
    ];
    const { container } = render(
      <NotebookList {...defaultProps} notebooks={notebooks} total={2} />
    );
    const view = within(container);
    expect(view.getByText('First')).toBeDefined();
    expect(view.getByText('Second')).toBeDefined();
  });

  it('should navigate to notebook on card click', () => {
    const { container } = render(<NotebookList {...defaultProps} />);
    const view = within(container);
    const title = view.getByText('Test Notebook');
    const card = title.closest('[class*="cursor-pointer"]');
    if (card) fireEvent.click(card);
    expect(mockPush).toHaveBeenCalledWith('/notebooks/nb-1');
  });

  it('should show pagination when total > pageSize', () => {
    const { container } = render(
      <NotebookList {...defaultProps} total={25} pageSize={10} page={2} />
    );
    const view = within(container);
    expect(view.getByText('Previous')).toBeDefined();
    expect(view.getByText('Next')).toBeDefined();
    expect(view.getByText('2 / 3')).toBeDefined();
  });

  it('should not show pagination when total <= pageSize', () => {
    const { container } = render(
      <NotebookList {...defaultProps} total={5} pageSize={10} />
    );
    const view = within(container);
    expect(view.queryByText('Previous')).toBeNull();
    expect(view.queryByText('Next')).toBeNull();
  });

  it('should disable Previous on first page', () => {
    const { container } = render(
      <NotebookList {...defaultProps} total={25} pageSize={10} page={1} />
    );
    const view = within(container);
    const prevBtn = view.getByText('Previous').closest('button');
    expect(prevBtn?.disabled).toBe(true);
  });

  it('should disable Next on last page', () => {
    const { container } = render(
      <NotebookList {...defaultProps} total={25} pageSize={10} page={3} />
    );
    const view = within(container);
    const nextBtn = view.getByText('Next').closest('button');
    expect(nextBtn?.disabled).toBe(true);
  });

  it('should create notebook on button click and navigate on success', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      json: () => Promise.resolve({ code: 0, data: { id: 'new-nb' } }),
    });

    const { container } = render(<NotebookList {...defaultProps} />);
    const view = within(container);
    fireEvent.click(view.getByText('list.create'));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/notebooks/new-nb');
    });
  });

  it('should alert on create failure', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      json: () => Promise.resolve({ code: 1, message: 'Server error' }),
    });

    const { container } = render(<NotebookList {...defaultProps} />);
    const view = within(container);
    fireEvent.click(view.getByText('list.create'));

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith('Server error');
    });
  });

  it('should alert on create network error', async () => {
    (global.fetch as any).mockRejectedValueOnce(new Error('Network'));

    const { container } = render(<NotebookList {...defaultProps} />);
    const view = within(container);
    fireEvent.click(view.getByText('list.create'));

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith('errors.create_failed');
    });
  });

  it('should render all status tabs', () => {
    const { container } = render(<NotebookList {...defaultProps} />);
    const view = within(container);
    expect(view.getByText('list.tabs.all')).toBeDefined();
    expect(view.getByText('list.tabs.draft')).toBeDefined();
    expect(view.getByText('list.tabs.completed')).toBeDefined();
    expect(view.getByText('list.tabs.archived')).toBeDefined();
  });

  it('should highlight current status tab', () => {
    const { container } = render(
      <NotebookList {...defaultProps} currentStatus="draft" />
    );
    const draftTab = container.querySelector('[data-state="active"]');
    expect(draftTab?.textContent).toBe('list.tabs.draft');
  });
});
