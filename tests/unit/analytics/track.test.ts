import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { track } from '@/shared/lib/analytics/track';

describe('track() · dual-write analytics helper', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    global.fetch = vi.fn(() => Promise.resolve(new Response(null, { status: 204 })));
    (window as unknown as { va?: unknown }).va = vi.fn();
  });

  afterEach(() => {
    global.fetch = originalFetch;
    delete (window as unknown as { va?: unknown }).va;
  });

  it('calls window.va when Vercel Analytics is loaded', () => {
    track('hero_cta_click', { variant: 'primary', locale: 'en' });
    const va = (window as unknown as { va: ReturnType<typeof vi.fn> }).va;
    expect(va).toHaveBeenCalledWith('event', {
      name: 'hero_cta_click',
      data: { variant: 'primary', locale: 'en' },
    });
  });

  it('also posts to /api/analytics/event fallback', () => {
    track('hero_cta_click', { variant: 'primary', locale: 'en' });
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/analytics/event',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
    );
  });

  it('does not throw when window.va is absent', () => {
    delete (window as unknown as { va?: unknown }).va;
    expect(() => track('scroll_depth_25', { locale: 'en' })).not.toThrow();
  });

  it('swallows fetch rejection (fire-and-forget)', () => {
    global.fetch = vi.fn(() => Promise.reject(new Error('adblock')));
    expect(() => track('scroll_depth_50', { locale: 'zh' })).not.toThrow();
  });

  it('sends event payload shape {event, payload, ts}', () => {
    track('experiment_card_click', {
      experiment_id: 'projectile',
      subject: 'physics',
      grade: '9-12',
      locale: 'en',
    });
    const call = (global.fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    const body = JSON.parse(call[1].body);
    expect(body.event).toBe('experiment_card_click');
    expect(body.payload.subject).toBe('physics');
    expect(typeof body.ts).toBe('number');
  });
});
