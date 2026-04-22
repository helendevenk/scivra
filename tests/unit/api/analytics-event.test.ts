import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { POST } from '@/app/api/analytics/event/route';

describe('POST /api/analytics/event · fallback analytics endpoint', () => {
  let consoleSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => undefined);
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  async function post(body: unknown): Promise<Response> {
    const req = new Request('http://localhost/api/analytics/event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: typeof body === 'string' ? body : JSON.stringify(body),
    });
    return POST(req);
  }

  it('accepts valid event and returns 204', async () => {
    const res = await post({
      event: 'hero_cta_click',
      payload: { variant: 'primary', locale: 'en' },
      ts: Date.now(),
    });
    expect(res.status).toBe(204);
  });

  it('logs structured event to stderr/stdout for Vercel capture', async () => {
    await post({ event: 'scroll_depth_25', payload: { locale: 'en' } });
    expect(consoleSpy).toHaveBeenCalled();
    const logged = JSON.parse(String(consoleSpy.mock.calls[0][0]));
    expect(logged.kind).toBe('analytics_event');
    expect(logged.event).toBe('scroll_depth_25');
  });

  it('rejects unknown event name with 400', async () => {
    const res = await post({ event: 'malicious_event', payload: {} });
    expect(res.status).toBe(400);
  });

  it('returns 400 on malformed JSON', async () => {
    const res = await post('not json at all');
    expect(res.status).toBe(400);
  });

  it('accepts all 6 allowed event names', async () => {
    const events = [
      'hero_cta_click',
      'grade_tile_click',
      'experiment_card_click',
      'scroll_depth_25',
      'scroll_depth_50',
      'scroll_depth_75',
    ];
    for (const event of events) {
      const res = await post({ event, payload: {} });
      expect(res.status, `event ${event}`).toBe(204);
    }
  });
});
