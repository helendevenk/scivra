import { vi, describe, it, expect, afterEach } from 'vitest';
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
vi.mock('next-intl', () => ({
  useTranslations: vi.fn(() => (key: string, params?: Record<string, unknown>) => {
    if (params) return `${key}:${JSON.stringify(params)}`;
    return key;
  }),
  useLocale: vi.fn(() => 'en'),
}));
vi.mock('@/core/i18n/navigation', () => ({
  Link: ({ children, href, ...props }: any) => <a href={href} {...props}>{children}</a>,
  useRouter: vi.fn(() => ({ push: vi.fn() })),
  usePathname: vi.fn(() => '/'),
}));

import { render, within } from '@testing-library/react';
import { LearningPathCard } from '@/shared/blocks/learning-path/learning-path-card';

const basePath = {
  id: 'path-1',
  slug: 'newtonian-mechanics',
  titleEn: 'Newtonian Mechanics',
  titleZh: '牛顿力学',
  descriptionEn: 'Learn about forces and motion',
  descriptionZh: '学习力与运动',
  category: 'Physics',
  level: 'Beginner',
  nodeCount: 10,
  coverImage: null,
};

describe('LearningPathCard', () => {
  afterEach(() => {
    cleanup();
  });

  it('should render without crashing', () => {
    const { container } = render(<LearningPathCard path={basePath} />);
    const view = within(container);
    expect(view.getByText('Newtonian Mechanics')).toBeDefined();
  });

  it('should display English title when locale is en', () => {
    const { container } = render(<LearningPathCard path={basePath} />);
    const view = within(container);
    expect(view.getByText('Newtonian Mechanics')).toBeDefined();
  });

  it('should display description', () => {
    const { container } = render(<LearningPathCard path={basePath} />);
    const view = within(container);
    expect(view.getByText('Learn about forces and motion')).toBeDefined();
  });

  it('should display category badge', () => {
    const { container } = render(<LearningPathCard path={basePath} />);
    const view = within(container);
    expect(view.getByText('Physics')).toBeDefined();
  });

  it('should display level', () => {
    const { container } = render(<LearningPathCard path={basePath} />);
    const view = within(container);
    expect(view.getByText('Beginner')).toBeDefined();
  });

  it('should display node count', () => {
    const { container } = render(<LearningPathCard path={basePath} />);
    const view = within(container);
    expect(view.getByText('card.nodes:{"count":10}')).toBeDefined();
  });

  it('should link to the learning path page', () => {
    const { container } = render(<LearningPathCard path={basePath} />);
    const link = container.querySelector('a[href="/learn/newtonian-mechanics"]');
    expect(link).not.toBeNull();
  });

  it('should show start button when no progress', () => {
    const { container } = render(<LearningPathCard path={basePath} />);
    const view = within(container);
    expect(view.getByText('card.start')).toBeDefined();
  });

  it('should show continue button when progress exists but not completed', () => {
    const progress = { pathId: 'path-1', currentNode: 3, completed: false };
    const { container } = render(
      <LearningPathCard path={basePath} progress={progress} />
    );
    const view = within(container);
    expect(view.getByText('card.continue')).toBeDefined();
  });

  it('should show review button when completed', () => {
    const progress = { pathId: 'path-1', currentNode: 10, completed: true };
    const { container } = render(
      <LearningPathCard path={basePath} progress={progress} />
    );
    const view = within(container);
    expect(view.getByText('card.review')).toBeDefined();
  });

  it('should show progress bar when progress exists', () => {
    const progress = { pathId: 'path-1', currentNode: 5, completed: false };
    const { container } = render(
      <LearningPathCard path={basePath} progress={progress} />
    );
    const view = within(container);
    expect(view.getByText('card.progress:{"current":5,"total":10}')).toBeDefined();
    const progressBar = container.querySelector('[role="progressbar"]');
    expect(progressBar).not.toBeNull();
  });

  it('should show completed state', () => {
    const progress = { pathId: 'path-1', currentNode: 10, completed: true };
    const { container } = render(
      <LearningPathCard path={basePath} progress={progress} />
    );
    const view = within(container);
    expect(view.getByText('card.completed')).toBeDefined();
  });

  it('should not show progress section when no progress prop', () => {
    const { container } = render(<LearningPathCard path={basePath} />);
    const view = within(container);
    expect(view.queryByText(/card\.progress/)).toBeNull();
    expect(view.queryByText('card.completed')).toBeNull();
  });

  it('should handle zero nodeCount gracefully', () => {
    const pathWithZeroNodes = { ...basePath, nodeCount: 0 };
    const { container } = render(<LearningPathCard path={pathWithZeroNodes} />);
    const view = within(container);
    expect(view.getByText('card.nodes:{"count":0}')).toBeDefined();
  });

  it('should handle null nodeCount gracefully', () => {
    const pathWithNull = { ...basePath, nodeCount: null };
    const { container } = render(<LearningPathCard path={pathWithNull} />);
    const view = within(container);
    expect(view.getByText('card.nodes:{"count":0}')).toBeDefined();
  });
});
