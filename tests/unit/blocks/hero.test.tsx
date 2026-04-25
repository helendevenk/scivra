import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({ push: vi.fn() })),
  usePathname: vi.fn(() => '/'),
  useSearchParams: vi.fn(() => new URLSearchParams()),
}));

vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock('next/image', () => ({
  default: (props: any) => <img {...props} />,
}));

vi.mock('next-intl', () => ({
  useTranslations: vi.fn(() => (key: string) => key),
  useLocale: vi.fn(() => 'en'),
}));

vi.mock('@/core/i18n/navigation', () => ({
  Link: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock('@/shared/lib/analytics/track', () => ({
  track: vi.fn(),
}));

vi.mock('@/shared/blocks/common', () => ({
  SmartIcon: ({ name }: { name: string }) => <span data-icon={name} />,
}));

vi.mock('@/shared/components/ui/button', () => ({
  Button: ({ children, asChild: _asChild, ...rest }: any) => (
    <button {...rest}>{children}</button>
  ),
}));

import { cleanup, render, screen } from '@testing-library/react';

import { Hero } from '@/themes/default/blocks/hero';

afterEach(cleanup);

const baseSection = {
  id: 'hero',
  title: "The Experiments Your Textbook Can't Show You",
  highlight_text: "Can't Show",
  description: 'Stop memorizing formulas. Start seeing how science works.',
  buttons: [
    {
      title: 'Try Your First Experiment',
      icon: 'Zap',
      url: '/labs',
      target: '_self',
      variant: 'glow',
    },
    {
      title: 'See How It Works',
      url: '/ap-prep',
      target: '_self',
      variant: 'outline',
    },
  ],
};

describe('Hero block · V3 static SVG hero', () => {
  it('renders H1 containing the headline', () => {
    render(<Hero section={baseSection as any} />);
    const h1 = screen.getByRole('heading', { level: 1 });
    expect(h1.textContent).toContain('Experiments');
    expect(h1.textContent).toContain('Textbook');
  });

  it('renders highlight text inside an italic element', () => {
    const { container } = render(<Hero section={baseSection as any} />);
    const h1 = container.querySelector('h1');
    expect(h1).toBeTruthy();
    // highlight should be wrapped in an element styled italic
    const italic = h1?.querySelector('em, [style*="italic"]');
    expect(italic).toBeTruthy();
    expect(italic?.textContent).toContain("Can't Show");
  });

  it('renders inline SVG hero illustration (not img)', () => {
    const { container } = render(<Hero section={baseSection as any} />);
    const svg = container.querySelector('svg[data-hero-illustration]');
    expect(svg).toBeTruthy();
  });

  it('does NOT render FreePik hero image regardless of section.image', () => {
    render(
      <Hero
        section={
          {
            ...baseSection,
            image: { src: '/imgs/hero/student-discovery.png', alt: 'x', width: 1, height: 1 },
          } as any
        }
      />
    );
    expect(screen.queryByAltText(/student.*discovery/i)).toBeNull();
  });

  it('renders Example parameters caption (not fake live HUD)', () => {
    const { container } = render(<Hero section={baseSection as any} />);
    expect(container.textContent).toMatch(/Example/i);
    // physics params indicator — v₀ or θ or m/s must appear
    expect(container.textContent).toMatch(/v₀|θ|m\/s/);
  });

  it('renders SVG path with stroke-dasharray for draw animation', () => {
    const { container } = render(<Hero section={baseSection as any} />);
    const path = container.querySelector('path[data-hero-path]');
    expect(path).toBeTruthy();
  });

  it('renders both CTA buttons when provided', () => {
    render(<Hero section={baseSection as any} />);
    expect(screen.getByText('Try Your First Experiment')).toBeInTheDocument();
    expect(screen.getByText('See How It Works')).toBeInTheDocument();
  });
});
