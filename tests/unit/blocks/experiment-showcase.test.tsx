import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({ push: vi.fn() })),
  usePathname: vi.fn(() => '/'),
  useSearchParams: vi.fn(() => new URLSearchParams()),
}));

vi.mock('next/image', () => ({
  default: (props: any) => <img {...props} />,
}));

vi.mock('@/core/i18n/navigation', () => ({
  Link: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock('@/shared/components/ui/scroll-animation', () => ({
  ScrollAnimation: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock('@/shared/components/ui/button', () => ({
  Button: ({ children, asChild: _asChild, ...rest }: any) => (
    <button {...rest}>{children}</button>
  ),
}));

import { cleanup, render } from '@testing-library/react';

import { ExperimentShowcase } from '@/themes/default/blocks/experiment-showcase';

afterEach(cleanup);

const section = {
  id: 'experiment_showcase',
  title: 'Real labs. Running in your browser.',
  description: 'No downloads.',
  items: [
    {
      title: 'Projectile Motion',
      description: 'Launch objects.',
      subject: 'Physics',
      grade: '9-12',
      url: '/labs/physics/ngss-hs/projectile-motion',
    },
    {
      title: 'DNA Double Helix',
      description: 'Rotate, zoom.',
      subject: 'Biology',
      grade: 'AP',
      url: '/labs/biology/ap-biology/dna-double-helix',
    },
    {
      title: 'Chemical Equilibrium',
      description: 'Adjust temperature.',
      subject: 'Chemistry',
      grade: 'AP',
      url: '/labs/chemistry/ap-chemistry/chemical-equilibrium',
    },
  ],
};

describe('ExperimentShowcase · V3 inline SVG thumbnails', () => {
  it('renders 3 cards with inline SVG thumbnails (not <img>)', () => {
    const { container } = render(<ExperimentShowcase section={section as any} />);
    const svgs = container.querySelectorAll('svg');
    // expect at least 3 svgs — one per featured experiment
    expect(svgs.length).toBeGreaterThanOrEqual(3);
  });

  it('renders all three titles', () => {
    const { container } = render(<ExperimentShowcase section={section as any} />);
    expect(container.textContent).toContain('Projectile Motion');
    expect(container.textContent).toContain('DNA Double Helix');
    expect(container.textContent).toContain('Chemical Equilibrium');
  });

  it('does NOT fall back to PNG thumbnails for featured experiments', () => {
    const { container } = render(<ExperimentShowcase section={section as any} />);
    const imgs = container.querySelectorAll('img[src*="/imgs/experiments/"]');
    // All 3 featured experiments should use SVG anim, never PNG
    expect(imgs.length).toBe(0);
  });
});
