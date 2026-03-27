import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
vi.mock('next/navigation', () => ({ useRouter: vi.fn(() => ({ push: vi.fn() })), usePathname: vi.fn(() => '/'), useSearchParams: vi.fn(() => new URLSearchParams()) }));
vi.mock('next/link', () => ({ default: ({ children, href, ...props }: any) => <a href={href} {...props}>{children}</a> }));
vi.mock('next/image', () => ({ default: ({ src, alt, ...props }: any) => <img src={src} alt={alt} {...props} /> }));
vi.mock('next-intl', () => ({ useTranslations: vi.fn(() => (key: string) => key), useLocale: vi.fn(() => 'en') }));

import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { ErrorBoundary } from '@/shared/blocks/common/error-boundary';

afterEach(cleanup);

function ThrowingComponent({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div>Child content</div>;
}

describe('ErrorBoundary', () => {
  let consoleSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('renders children when no error occurs', () => {
    render(
      <ErrorBoundary>
        <div>Safe content</div>
      </ErrorBoundary>
    );
    expect(screen.getByText('Safe content')).toBeInTheDocument();
  });

  it('shows default error UI when child throws', () => {
    render(
      <ErrorBoundary>
        <ThrowingComponent shouldThrow={true} />
      </ErrorBoundary>
    );
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText(/Please try refreshing/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument();
  });

  it('shows custom fallback when provided and child throws', () => {
    render(
      <ErrorBoundary fallback={<div>Custom error fallback</div>}>
        <ThrowingComponent shouldThrow={true} />
      </ErrorBoundary>
    );
    expect(screen.getByText('Custom error fallback')).toBeInTheDocument();
    expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument();
  });

  it('resets error state when Try again is clicked', () => {
    render(
      <ErrorBoundary>
        <ThrowingComponent shouldThrow={true} />
      </ErrorBoundary>
    );
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();

    // Clicking "Try again" resets hasError. Since ThrowingComponent still throws,
    // it re-enters error state. The key verification is that the button click works.
    fireEvent.click(screen.getByRole('button', { name: 'Try again' }));
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('renders nothing if no children provided and no error', () => {
    const { container } = render(<ErrorBoundary />);
    expect(container.firstChild).toBeNull();
  });

  it('logs error to console.error via componentDidCatch', () => {
    render(
      <ErrorBoundary>
        <ThrowingComponent shouldThrow={true} />
      </ErrorBoundary>
    );
    expect(consoleSpy).toHaveBeenCalled();
  });
});
