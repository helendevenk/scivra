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
  useTranslations: vi.fn(() => (key: string) => key),
  useLocale: vi.fn(() => 'en'),
}));
vi.mock('@/core/i18n/navigation', () => ({
  Link: ({ children, href, ...props }: any) => <a href={href} {...props}>{children}</a>,
  useRouter: vi.fn(() => ({ push: vi.fn() })),
  usePathname: vi.fn(() => '/'),
}));

import { render, fireEvent, within } from '@testing-library/react';
import { PaywallGate } from '@/shared/blocks/experiments/PaywallGate';

describe('PaywallGate', () => {
  afterEach(() => {
    cleanup();
  });

  it('should render nothing when isVisible is false', () => {
    const { container } = render(
      <PaywallGate isVisible={false} isLoggedIn={false} />
    );
    expect(container.innerHTML).toBe('');
  });

  it('should render the paywall overlay when isVisible is true', () => {
    const { container } = render(
      <PaywallGate isVisible={true} isLoggedIn={false} />
    );
    const view = within(container);
    expect(view.getByText('title')).toBeDefined();
    expect(view.getByText('description')).toBeDefined();
    expect(view.getByText('badge')).toBeDefined();
  });

  it('should show upgrade button linking to pricing', () => {
    const { container } = render(
      <PaywallGate isVisible={true} isLoggedIn={false} />
    );
    const view = within(container);
    const upgradeLink = view.getByText('upgrade');
    expect(upgradeLink.closest('a')).toHaveAttribute('href', '/pricing');
  });

  it('should show sign-in button when not logged in', () => {
    const { container } = render(
      <PaywallGate isVisible={true} isLoggedIn={false} />
    );
    const view = within(container);
    const signInLink = view.getByText('sign_in');
    expect(signInLink.closest('a')).toHaveAttribute('href', '/sign-in');
  });

  it('should hide sign-in button when logged in', () => {
    const { container } = render(
      <PaywallGate isVisible={true} isLoggedIn={true} />
    );
    const view = within(container);
    expect(view.queryByText('sign_in')).toBeNull();
  });

  it('should show reset hint text', () => {
    const { container } = render(
      <PaywallGate isVisible={true} isLoggedIn={false} />
    );
    const view = within(container);
    expect(view.getByText('reset_hint')).toBeDefined();
  });

  it('should show close button when onClose is provided', () => {
    const onClose = vi.fn();
    const { container } = render(
      <PaywallGate isVisible={true} isLoggedIn={true} onClose={onClose} />
    );
    const view = within(container);
    const closeBtn = view.getByLabelText('Close');
    expect(closeBtn).toBeDefined();
  });

  it('should call onClose when close button is clicked', () => {
    const onClose = vi.fn();
    const { container } = render(
      <PaywallGate isVisible={true} isLoggedIn={true} onClose={onClose} />
    );
    const view = within(container);
    fireEvent.click(view.getByLabelText('Close'));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('should not show close button when onClose is not provided', () => {
    const { container } = render(
      <PaywallGate isVisible={true} isLoggedIn={true} />
    );
    const view = within(container);
    expect(view.queryByLabelText('Close')).toBeNull();
  });
});
