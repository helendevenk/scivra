import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({ push: mockPush })),
  usePathname: vi.fn(() => '/experiments'),
  useSearchParams: vi.fn(() => new URLSearchParams('page=1')),
}));
vi.mock('next/link', () => ({ default: ({ children, href, ...props }: any) => <a href={href} {...props}>{children}</a> }));
vi.mock('next/image', () => ({ default: ({ src, alt, ...props }: any) => <img src={src} alt={alt} {...props} /> }));
vi.mock('next-intl', () => ({ useTranslations: vi.fn(() => (key: string) => key), useLocale: vi.fn(() => 'en') }));

import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { Pagination } from '@/shared/blocks/common/pagination';

afterEach(cleanup);

describe('Pagination', () => {
  beforeEach(() => {
    mockPush.mockClear();
  });

  it('renders nothing when totalPages <= 1', () => {
    const { container } = render(<Pagination total={5} limit={10} page={1} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders pagination when totalPages > 1', () => {
    render(<Pagination total={50} limit={10} page={1} />);
    expect(screen.getByRole('navigation', { name: 'pagination' })).toBeInTheDocument();
  });

  it('displays total and current page info', () => {
    render(<Pagination total={50} limit={10} page={2} />);
    expect(screen.getByText(/Total: 50/)).toBeInTheDocument();
    expect(screen.getByText(/Page: 2 \/ 5/)).toBeInTheDocument();
  });

  it('navigates to next page when clicking a page number', () => {
    render(<Pagination total={50} limit={10} page={1} />);
    const page2Link = screen.getByText('2');
    fireEvent.click(page2Link);
    expect(mockPush).toHaveBeenCalledWith('/experiments?page=2');
  });

  it('shows previous button when not on first page', () => {
    render(<Pagination total={50} limit={10} page={2} />);
    const prevButton = screen.getByLabelText('Go to previous page');
    expect(prevButton).toBeInTheDocument();
    fireEvent.click(prevButton);
    expect(mockPush).toHaveBeenCalledWith('/experiments?page=1');
  });

  it('hides previous button on first page', () => {
    render(<Pagination total={50} limit={10} page={1} />);
    expect(screen.queryByLabelText('Go to previous page')).not.toBeInTheDocument();
  });

  it('shows next button when not on last page', () => {
    render(<Pagination total={50} limit={10} page={1} />);
    const nextButton = screen.getByLabelText('Go to next page');
    expect(nextButton).toBeInTheDocument();
    fireEvent.click(nextButton);
    expect(mockPush).toHaveBeenCalledWith('/experiments?page=2');
  });

  it('hides next button on last page', () => {
    render(<Pagination total={50} limit={10} page={5} />);
    expect(screen.queryByLabelText('Go to next page')).not.toBeInTheDocument();
  });

  it('defaults limit to 30 when limit <= 0', () => {
    render(<Pagination total={60} limit={0} page={1} />);
    expect(screen.getByRole('navigation', { name: 'pagination' })).toBeInTheDocument();
    expect(screen.getByText(/Page: 1 \/ 2/)).toBeInTheDocument();
  });

  it('defaults to page 1 when page prop is omitted', () => {
    render(<Pagination total={50} limit={10} />);
    expect(screen.getByText(/Page: 1 \/ 5/)).toBeInTheDocument();
  });
});
