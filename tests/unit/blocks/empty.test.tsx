import { vi, describe, it, expect, afterEach } from 'vitest';
vi.mock('next/navigation', () => ({ useRouter: vi.fn(() => ({ push: vi.fn() })), usePathname: vi.fn(() => '/'), useSearchParams: vi.fn(() => new URLSearchParams()) }));
vi.mock('next/link', () => ({ default: ({ children, href, ...props }: any) => <a href={href} {...props}>{children}</a> }));
vi.mock('next/image', () => ({ default: ({ src, alt, ...props }: any) => <img src={src} alt={alt} {...props} /> }));
vi.mock('next-intl', () => ({ useTranslations: vi.fn(() => (key: string) => key), useLocale: vi.fn(() => 'en') }));

import { render, screen, cleanup } from '@testing-library/react';
import { Empty } from '@/shared/blocks/common/empty';

afterEach(cleanup);

describe('Empty', () => {
  it('renders without crashing', () => {
    render(<Empty message="No data" />);
    expect(screen.getByText('No data')).toBeInTheDocument();
  });

  it('displays the provided message', () => {
    render(<Empty message="Nothing to show here" />);
    expect(screen.getByText('Nothing to show here')).toBeInTheDocument();
  });

  it('renders different messages correctly', () => {
    const { rerender } = render(<Empty message="First message" />);
    expect(screen.getByText('First message')).toBeInTheDocument();

    rerender(<Empty message="Second message" />);
    expect(screen.getByText('Second message')).toBeInTheDocument();
    expect(screen.queryByText('First message')).not.toBeInTheDocument();
  });

  it('renders empty string message', () => {
    const { container } = render(<Empty message="" />);
    const p = container.querySelector('p');
    expect(p).toBeInTheDocument();
    expect(p?.textContent).toBe('');
  });
});
