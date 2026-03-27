import { vi, describe, it, expect, afterEach } from 'vitest';
vi.mock('next/navigation', () => ({ useRouter: vi.fn(() => ({ push: vi.fn() })), usePathname: vi.fn(() => '/'), useSearchParams: vi.fn(() => new URLSearchParams()) }));
vi.mock('next/link', () => ({ default: ({ children, href, ...props }: any) => <a href={href} {...props}>{children}</a> }));
vi.mock('next/image', () => ({ default: ({ src, alt, ...props }: any) => <img src={src} alt={alt} {...props} /> }));
vi.mock('next-intl', () => ({ useTranslations: vi.fn(() => (key: string) => key), useLocale: vi.fn(() => 'en') }));
vi.mock('react-lazy-load-image-component', () => ({
  LazyLoadImage: ({ src, alt, width, height, className, placeholderSrc, effect, ...props }: any) => (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      data-placeholder={placeholderSrc}
      data-effect={effect}
      {...props}
    />
  ),
}));
vi.mock('react-lazy-load-image-component/src/effects/blur.css', () => ({}));

import { render, screen, cleanup } from '@testing-library/react';
import { LazyImage } from '@/shared/blocks/common/lazy-image';

afterEach(cleanup);

describe('LazyImage', () => {
  it('renders without crashing', () => {
    render(<LazyImage src="/test.jpg" alt="Test image" />);
    expect(screen.getByRole('img', { name: 'Test image' })).toBeInTheDocument();
  });

  it('passes src and alt to the underlying image', () => {
    render(<LazyImage src="/photo.jpg" alt="A photo" />);
    const img = screen.getByRole('img', { name: 'A photo' });
    expect(img).toHaveAttribute('src', '/photo.jpg');
    expect(img).toHaveAttribute('alt', 'A photo');
  });

  it('passes width and height when provided', () => {
    render(<LazyImage src="/img.jpg" alt="Sized" width={300} height={200} />);
    const img = screen.getByRole('img', { name: 'Sized' });
    expect(img).toHaveAttribute('width', '300');
    expect(img).toHaveAttribute('height', '200');
  });

  it('applies className when provided', () => {
    render(<LazyImage src="/img.jpg" alt="Styled" className="rounded-lg" />);
    expect(screen.getByRole('img', { name: 'Styled' })).toHaveClass('rounded-lg');
  });

  it('passes placeholderSrc to LazyLoadImage', () => {
    render(<LazyImage src="/img.jpg" alt="With placeholder" placeholderSrc="/placeholder.jpg" />);
    expect(screen.getByRole('img', { name: 'With placeholder' })).toHaveAttribute('data-placeholder', '/placeholder.jpg');
  });

  it('uses blur effect', () => {
    render(<LazyImage src="/img.jpg" alt="Blurred" />);
    expect(screen.getByRole('img', { name: 'Blurred' })).toHaveAttribute('data-effect', 'blur');
  });

  it('renders without optional props', () => {
    const { container } = render(<LazyImage src="/minimal.jpg" alt="Minimal" />);
    const img = container.querySelector('img');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', '/minimal.jpg');
    expect(img).toHaveAttribute('alt', 'Minimal');
  });
});
