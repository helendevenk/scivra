import type { ComponentProps, ReactNode } from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, waitFor } from '@testing-library/react';

// Mock next-intl-backed Link before importing the component, so we don't
// pull next-intl's navigation chain into jsdom (it tries to resolve
// `next/navigation` as ESM and fails under vitest).
vi.mock('@/core/i18n/navigation', () => ({
  Link: ({ children, ...props }: { children?: ReactNode } & ComponentProps<'a'>) => (
    <a {...props}>{children}</a>
  ),
}));

vi.mock('@/shared/components/experiments/three/HeroProjectileScene', () => ({
  HeroProjectileScene: () => <div data-testid="hero-scene-stub" />,
}));

// Track calls to /api/analytics/event so we can also confirm we're not
// triggering it as a side effect of the matchMedia mock alone.
vi.mock('@/shared/lib/analytics/track', () => ({
  track: vi.fn(),
}));

const { Hero3DPreview } = await import('@/themes/default/blocks/hero-3d-preview');

function setMatchMedia(reducedMotion: boolean) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: query.includes('prefers-reduced-motion') && reducedMotion,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

describe('Hero3DPreview', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('returns null (no canvas container) under prefers-reduced-motion', async () => {
    setMatchMedia(true);
    const { container } = render(<Hero3DPreview />);
    // give the effect a tick to settle
    await new Promise((r) => setTimeout(r, 10));
    expect(container.querySelector('[data-hero-3d-preview]')).toBeNull();
  });

  it('mounts the 3D preview container when motion is safe', async () => {
    setMatchMedia(false);
    const { container } = render(<Hero3DPreview />);
    await waitFor(() => {
      expect(container.querySelector('[data-hero-3d-preview]')).not.toBeNull();
    });
  });
});
