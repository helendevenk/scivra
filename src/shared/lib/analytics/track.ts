/**
 * Dual-write analytics helper for homepage observation (Phase 2).
 *
 * Writes each event to two sinks:
 *   1. Vercel Analytics (window.va) — primary dashboard
 *   2. /api/analytics/event — fallback for ad-blocker resilience + Sentry
 *
 * Fire-and-forget: never throws, never blocks UI. Analytics MUST NOT break UX.
 *
 * See docs/plans/2026-04-22-homepage-visual-overhaul.md Phase 0 for event spec.
 */

export type HomepageEvent =
  | 'hero_cta_click'
  | 'hero_3d_preview_click'
  | 'grade_tile_click'
  | 'experiment_card_click'
  | 'scroll_depth_25'
  | 'scroll_depth_50'
  | 'scroll_depth_75';

export type EventPayload = Record<
  string,
  string | number | boolean | null | undefined
>;

type VercelAnalyticsFn = (cmd: 'event', args: { name: string; data: EventPayload }) => void;

export function track(event: HomepageEvent, payload: EventPayload = {}): void {
  if (typeof window === 'undefined') return;

  // 1. Vercel Analytics (if loaded)
  const va = (window as unknown as { va?: VercelAnalyticsFn }).va;
  if (typeof va === 'function') {
    try {
      va('event', { name: event, data: payload });
    } catch {
      // swallow — analytics must never break UI
    }
  }

  // 2. Fallback endpoint (always try — double-write is by design)
  try {
    const body = JSON.stringify({ event, payload, ts: Date.now() });
    const promise = fetch('/api/analytics/event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      keepalive: true,
    });
    if (promise && typeof promise.catch === 'function') {
      promise.catch(() => {
        /* ad-blocker or offline — expected, ignore */
      });
    }
  } catch {
    /* fetch may throw synchronously in edge cases — ignore */
  }
}
