import { vi, describe, it, expect, beforeEach } from 'vitest';

const mockPush = vi.fn();

vi.mock('next-intl', () => ({
  useTranslations: vi.fn(() => (key: string, params?: Record<string, string>) => {
    if (key === 'card.by' && params?.author) return `by ${params.author}`;
    if (key === 'card.anonymous') return 'Anonymous';
    if (key === 'badge.verified') return 'Verified';
    return key;
  }),
}));

vi.mock('@/core/i18n/navigation', () => ({
  useRouter: vi.fn(() => ({ push: mockPush })),
}));

vi.mock('@/shared/components/ui/badge', () => ({
  Badge: ({ children, onClick, className, ...props }: any) => (
    <span data-testid="badge" className={className} onClick={onClick} {...props}>
      {children}
    </span>
  ),
}));

vi.mock('@/shared/components/ui/button', () => ({
  Button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
}));

vi.mock('@/shared/components/ui/card', () => ({
  Card: ({ children, onClick, className }: any) => (
    <div data-testid="card" onClick={onClick} className={className}>
      {children}
    </div>
  ),
  CardContent: ({ children, className }: any) => (
    <div className={className}>{children}</div>
  ),
}));

vi.mock('@/shared/lib/utils', () => ({
  cn: (...args: unknown[]) => args.filter(Boolean).join(' '),
}));

vi.mock('lucide-react', () => ({
  BadgeCheck: ({ className }: any) => <svg data-testid="icon-badge-check" className={className} />,
  Eye: ({ className }: any) => <svg data-testid="icon-eye" className={className} />,
  GitFork: ({ className }: any) => <svg data-testid="icon-fork" className={className} />,
  Heart: ({ className }: any) => <svg data-testid="icon-heart" className={className} />,
}));

import { render, fireEvent } from '@testing-library/react';
import { GalleryCard } from '@/shared/blocks/gallery/gallery-card';

function makeItem(overrides: Partial<Parameters<typeof GalleryCard>[0]['item']> = {}) {
  return {
    id: 'item-1',
    prompt: 'Show me gravity simulation',
    language: 'en',
    userId: 'user-1',
    userName: 'Alice',
    viewCount: 100,
    likeCount: 42,
    forkCount: 7,
    tags: ['physics', 'gravity'],
    validationScore: 85,
    createdAt: '2026-01-01T00:00:00Z',
    isLiked: false,
    ...overrides,
  };
}

describe('GalleryCard', () => {
  const onLike = vi.fn();
  const onTagClick = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  function renderCard(itemOverrides: Partial<Parameters<typeof GalleryCard>[0]['item']> = {}) {
    return render(
      <GalleryCard item={makeItem(itemOverrides)} onLike={onLike} onTagClick={onTagClick} />
    );
  }

  it('should render prompt as title', () => {
    const { container } = renderCard();
    expect(container.textContent).toContain('Show me gravity simulation');
  });

  it('should render author name', () => {
    const { container } = renderCard();
    expect(container.textContent).toContain('by Alice');
  });

  it('should render anonymous when no userName', () => {
    const { container } = renderCard({ userName: null });
    expect(container.textContent).toContain('Anonymous');
  });

  it('should render like, view, and fork counts', () => {
    const { container } = renderCard();
    expect(container.textContent).toContain('42');
    expect(container.textContent).toContain('100');
    expect(container.textContent).toContain('7');
  });

  it('should render verified badge when validationScore >= 70', () => {
    const { container } = renderCard({ validationScore: 85 });
    expect(container.textContent).toContain('Verified');
  });

  it('should not render verified badge when validationScore < 70', () => {
    const { container } = renderCard({ validationScore: 50 });
    expect(container.textContent).not.toContain('Verified');
  });

  it('should render tags (max 3)', () => {
    const { container } = renderCard({ tags: ['physics', 'gravity', 'motion', 'extra'] });
    expect(container.textContent).toContain('physics');
    expect(container.textContent).toContain('gravity');
    expect(container.textContent).toContain('motion');
    expect(container.textContent).not.toContain('extra');
  });

  it('should navigate to detail page when card is clicked', () => {
    const { container } = renderCard();
    const card = container.querySelector('[data-testid="card"]')!;
    fireEvent.click(card);
    expect(mockPush).toHaveBeenCalledWith('/gallery/item-1');
  });

  it('should call onLike when like button is clicked', () => {
    const { container } = renderCard();
    const likeButton = container.querySelector('button')!;
    fireEvent.click(likeButton);
    expect(onLike).toHaveBeenCalledWith('item-1');
    // stopPropagation prevents card navigation
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('should call onTagClick when tag is clicked', () => {
    const { container } = renderCard();
    const badges = Array.from(container.querySelectorAll('[data-testid="badge"]'));
    // Find the badge with 'physics' text (not the Verified badge)
    const physicsBadge = badges.find((b) => b.textContent === 'physics');
    expect(physicsBadge).toBeDefined();
    fireEvent.click(physicsBadge!);
    expect(onTagClick).toHaveBeenCalledWith('physics');
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('should handle empty tags array', () => {
    const { container } = renderCard({ tags: [], validationScore: null });
    expect(container.textContent).toContain('Show me gravity simulation');
  });

  it('should handle null tags', () => {
    const { container } = renderCard({ tags: null, validationScore: null });
    expect(container.textContent).toContain('Show me gravity simulation');
  });
});
