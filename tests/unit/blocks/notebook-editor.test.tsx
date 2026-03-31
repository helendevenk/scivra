import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

const mockPush = vi.fn();
const mockRefresh = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({ push: mockPush, replace: vi.fn(), refresh: mockRefresh })),
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
  useTranslations: vi.fn(() => (key: string) => key),
  useLocale: vi.fn(() => 'en'),
}));

import { render, fireEvent, waitFor, within } from '@testing-library/react';
import { NotebookEditor } from '@/shared/blocks/notebook/NotebookEditor';

function makeNotebook(overrides: Partial<any> = {}) {
  return {
    id: 'nb-1',
    userId: 'user-1',
    experimentId: null,
    generationId: null,
    autopilotSessionId: null,
    title: 'My Notebook',
    status: 'draft',
    language: 'en',
    version: 1,
    hypothesis: JSON.stringify([{ type: 'text', content: 'Test hypothesis', source: 'user' }]),
    method: null,
    data: null,
    analysis: null,
    conclusion: null,
    aiSuggestionsUsed: 0,
    aiModel: null,
    createdAt: new Date('2026-03-19T00:00:00Z'),
    updatedAt: new Date('2026-03-20T00:00:00Z'),
    completedAt: null,
    deletedAt: null,
    ...overrides,
  };
}

describe('NotebookEditor', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers({ shouldAdvanceTime: true });
    global.fetch = vi.fn();
    global.alert = vi.fn();
  });

  afterEach(() => {
    vi.useRealTimers();
    cleanup();
  });

  it('should render without crashing', () => {
    const { container } = render(<NotebookEditor notebook={makeNotebook()} />);
    const view = within(container);
    expect(view.getByDisplayValue('My Notebook')).toBeDefined();
  });

  it('should display title input with notebook title', () => {
    const { container } = render(
      <NotebookEditor notebook={makeNotebook({ title: 'Physics Lab' })} />
    );
    const view = within(container);
    expect(view.getByDisplayValue('Physics Lab')).toBeDefined();
  });

  it('should display status badge', () => {
    const { container } = render(<NotebookEditor notebook={makeNotebook()} />);
    const view = within(container);
    expect(view.getByText('card.draft')).toBeDefined();
  });

  it('should render section tabs', () => {
    const { container } = render(<NotebookEditor notebook={makeNotebook()} />);
    const view = within(container);
    expect(view.getByText('editor.sections.hypothesis')).toBeDefined();
    expect(view.getByText('editor.sections.method')).toBeDefined();
    expect(view.getByText('editor.sections.data')).toBeDefined();
    expect(view.getByText('editor.sections.analysis')).toBeDefined();
    expect(view.getByText('editor.sections.conclusion')).toBeDefined();
  });

  it('should parse section JSON content into text', () => {
    const notebook = makeNotebook({
      hypothesis: JSON.stringify([
        { type: 'text', content: 'Parsed content here', source: 'user' },
      ]),
    });
    const { container } = render(<NotebookEditor notebook={notebook} />);
    const view = within(container);
    expect(view.getByDisplayValue('Parsed content here')).toBeDefined();
  });

  it('should handle non-JSON section content gracefully', () => {
    const notebook = makeNotebook({ hypothesis: 'plain text content' });
    const { container } = render(<NotebookEditor notebook={notebook} />);
    const view = within(container);
    expect(view.getByDisplayValue('plain text content')).toBeDefined();
  });

  it('should handle null section content', () => {
    const notebook = makeNotebook({ hypothesis: null });
    const { container } = render(<NotebookEditor notebook={notebook} />);
    const textareas = container.querySelectorAll('textarea');
    expect(textareas.length).toBeGreaterThan(0);
  });

  it('should update title on input change', () => {
    const { container } = render(<NotebookEditor notebook={makeNotebook()} />);
    const view = within(container);
    const input = view.getByDisplayValue('My Notebook');
    fireEvent.change(input, { target: { value: 'New Title' } });
    expect(view.getByDisplayValue('New Title')).toBeDefined();
  });

  it('should show save, complete, and export buttons', () => {
    const { container } = render(<NotebookEditor notebook={makeNotebook()} />);
    const view = within(container);
    expect(view.getByText('editor.save')).toBeDefined();
    expect(view.getByText('editor.complete')).toBeDefined();
    expect(view.getByText('editor.export')).toBeDefined();
  });

  it('should show AI prefill button and description', () => {
    const { container } = render(<NotebookEditor notebook={makeNotebook()} />);
    const view = within(container);
    expect(view.getByText('ai.prefill')).toBeDefined();
    expect(view.getByText('ai.prefill_description')).toBeDefined();
  });

  it('should show AI suggestions sidebar', () => {
    const { container } = render(<NotebookEditor notebook={makeNotebook()} />);
    const view = within(container);
    expect(view.getByText('ai.suggestions_title')).toBeDefined();
    expect(view.getByText('ai.no_suggestions')).toBeDefined();
  });

  it('should save on save button click', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      json: () => Promise.resolve({ code: 0 }),
    });

    const { container } = render(<NotebookEditor notebook={makeNotebook()} />);
    const view = within(container);
    fireEvent.click(view.getByText('editor.save'));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/notebooks/nb-1',
        expect.objectContaining({ method: 'PATCH' })
      );
    });
  });

  it('should show saved status after successful save', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      json: () => Promise.resolve({ code: 0 }),
    });

    const { container } = render(<NotebookEditor notebook={makeNotebook()} />);
    const view = within(container);
    fireEvent.click(view.getByText('editor.save'));

    await waitFor(() => {
      expect(view.getByText('editor.saved')).toBeDefined();
    });
  });

  it('should handle AI prefill success', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      json: () =>
        Promise.resolve({
          code: 0,
          data: {
            prefill: {
              method: [{ content: 'AI method text' }],
              data: [{ content: 'AI data text' }],
            },
          },
        }),
    });

    const { container } = render(<NotebookEditor notebook={makeNotebook()} />);
    const view = within(container);
    fireEvent.click(view.getByText('ai.prefill'));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/notebooks/nb-1/ai/prefill',
        expect.objectContaining({ method: 'POST' })
      );
    });
  });

  it('should alert on prefill failure', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      json: () => Promise.resolve({ code: 1, message: 'AI unavailable' }),
    });

    const { container } = render(<NotebookEditor notebook={makeNotebook()} />);
    const view = within(container);
    fireEvent.click(view.getByText('ai.prefill'));

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith('AI unavailable');
    });
  });

  it('should handle AI suggest and display suggestions', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      json: () =>
        Promise.resolve({
          code: 0,
          data: { suggestions: ['Suggestion 1', 'Suggestion 2'] },
        }),
    });

    const { container } = render(<NotebookEditor notebook={makeNotebook()} />);
    const view = within(container);
    fireEvent.click(view.getByText('ai.suggest'));

    await waitFor(() => {
      expect(view.getByText('Suggestion 1')).toBeDefined();
      expect(view.getByText('Suggestion 2')).toBeDefined();
    });
  });

  it('should handle export', async () => {
    const mockCreateObjectURL = vi.fn(() => 'blob:test');
    const mockRevokeObjectURL = vi.fn();
    global.URL.createObjectURL = mockCreateObjectURL;
    global.URL.revokeObjectURL = mockRevokeObjectURL;

    (global.fetch as any).mockResolvedValueOnce({
      json: () =>
        Promise.resolve({
          code: 0,
          data: { content: 'exported content', filename: 'notebook.txt' },
        }),
    });

    const { container } = render(<NotebookEditor notebook={makeNotebook()} />);
    const view = within(container);
    fireEvent.click(view.getByText('editor.export'));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/notebooks/nb-1/export',
        expect.objectContaining({ method: 'POST' })
      );
    });
  });

  it('should alert on export network error', async () => {
    (global.fetch as any).mockRejectedValueOnce(new Error('Network'));

    const { container } = render(<NotebookEditor notebook={makeNotebook()} />);
    const view = within(container);
    fireEvent.click(view.getByText('editor.export'));

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith('errors.export_failed');
    });
  });
});
