import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { Hero3DPreview } from '@/themes/default/blocks/hero-3d-preview';

vi.mock('@/shared/components/experiments/three/HeroProjectileScene', () => ({
  HeroProjectileScene: () => <div data-testid="hero-scene-stub" />,
}));

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
