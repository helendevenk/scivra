import { vi, describe, it, expect, afterEach } from 'vitest';
vi.mock('next/navigation', () => ({ useRouter: vi.fn(() => ({ push: vi.fn() })), usePathname: vi.fn(() => '/'), useSearchParams: vi.fn(() => new URLSearchParams()) }));
vi.mock('next/link', () => ({ default: ({ children, href, ...props }: any) => <a href={href} {...props}>{children}</a> }));
vi.mock('next/image', () => ({ default: ({ src, alt, ...props }: any) => <img src={src} alt={alt} {...props} /> }));
vi.mock('next-intl', () => ({ useTranslations: vi.fn(() => (key: string) => key), useLocale: vi.fn(() => 'en') }));
vi.mock('@/core/i18n/navigation', () => ({
  Link: ({ children, href, ...props }: any) => <a href={href} {...props}>{children}</a>,
}));

import { render, screen, cleanup } from '@testing-library/react';
import { BrandLogo } from '@/shared/blocks/common/brand-logo';
import type { Brand } from '@/shared/types/blocks/common';

afterEach(cleanup);

describe('BrandLogo', () => {
  const baseBrand: Brand = {
    title: 'Scivra',
    url: '/',
    target: '_self',
    className: '',
    logo: {
      src: '/logo.png',
      alt: 'Scivra Logo',
      width: 40,
      height: 40,
    },
  };

  it('renders without crashing', () => {
    render(<BrandLogo brand={baseBrand} />);
    expect(screen.getByRole('link')).toBeInTheDocument();
  });

  it('renders logo image when logo is provided', () => {
    const { container } = render(<BrandLogo brand={baseBrand} />);
    const img = container.querySelector('img');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', '/logo.png');
  });

  it('renders title text when title is provided', () => {
    render(<BrandLogo brand={baseBrand} />);
    expect(screen.getByText('Scivra')).toBeInTheDocument();
  });

  it('does not render image when logo is undefined', () => {
    const brandNoLogo: Brand = { title: 'Scivra', url: '/', className: '' };
    const { container } = render(<BrandLogo brand={brandNoLogo} />);
    expect(container.querySelector('img')).not.toBeInTheDocument();
    expect(screen.getByText('Scivra')).toBeInTheDocument();
  });

  it('does not render title when title is undefined', () => {
    const brandNoTitle: Brand = {
      url: '/',
      className: '',
      logo: { src: '/logo.png', alt: 'Logo' },
    };
    const { container } = render(<BrandLogo brand={brandNoTitle} />);
    expect(container.querySelector('img')).toBeInTheDocument();
    expect(container.querySelector('span')).not.toBeInTheDocument();
  });

  it('uses logo alt text when no title is present', () => {
    const brandNoTitle: Brand = {
      url: '/',
      className: '',
      logo: { src: '/logo.png', alt: 'Brand Alt' },
    };
    const { container } = render(<BrandLogo brand={brandNoTitle} />);
    expect(container.querySelector('img')).toHaveAttribute('alt', 'Brand Alt');
  });

  it('uses empty alt when title is present (title serves as label)', () => {
    const { container } = render(<BrandLogo brand={baseBrand} />);
    expect(container.querySelector('img')).toHaveAttribute('alt', '');
  });

  it('links to the provided url', () => {
    render(<BrandLogo brand={baseBrand} />);
    expect(screen.getByRole('link')).toHaveAttribute('href', '/');
  });

  it('applies target attribute', () => {
    const brandNewTab: Brand = { ...baseBrand, target: '_blank' };
    render(<BrandLogo brand={brandNewTab} />);
    expect(screen.getByRole('link')).toHaveAttribute('target', '_blank');
  });

  it('defaults url to empty string when not provided', () => {
    const brandNoUrl: Brand = { title: 'Test', className: '' };
    const { container } = render(<BrandLogo brand={brandNoUrl} />);
    const anchor = container.querySelector('a');
    expect(anchor).toBeInTheDocument();
    expect(anchor).toHaveAttribute('href', '');
  });

  it('defaults target to _self when not provided', () => {
    const brandNoTarget: Brand = { title: 'Test', url: '/', className: '' };
    render(<BrandLogo brand={brandNoTarget} />);
    expect(screen.getByRole('link')).toHaveAttribute('target', '_self');
  });
});
