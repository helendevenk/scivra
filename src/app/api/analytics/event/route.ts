import { NextResponse } from 'next/server';

const ALLOWED_EVENTS = new Set([
  'hero_cta_click',
  'grade_tile_click',
  'experiment_card_click',
  'scroll_depth_25',
  'scroll_depth_50',
  'scroll_depth_75',
]);

export const runtime = 'edge';

/**
 * Fallback analytics endpoint — used by src/shared/lib/analytics/track.ts when
 * Vercel Analytics (window.va) is blocked by ad-blockers or not loaded.
 *
 * v1 strategy: log structured JSON to stdout. Vercel captures logs and surfaces
 * them in the Analytics > Logs tab + Sentry breadcrumbs can pull from here.
 *
 * Future (Phase F): push to Upstash Redis with 24h retention if volume warrants.
 */
export async function POST(req: Request): Promise<Response> {
  let body: { event?: unknown; payload?: unknown; ts?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }

  if (typeof body.event !== 'string' || !ALLOWED_EVENTS.has(body.event)) {
    return NextResponse.json({ error: 'invalid_event' }, { status: 400 });
  }

  const payload =
    body.payload && typeof body.payload === 'object' && !Array.isArray(body.payload)
      ? (body.payload as Record<string, unknown>)
      : {};

  console.log(
    JSON.stringify({
      kind: 'analytics_event',
      event: body.event,
      payload,
      ts: typeof body.ts === 'number' ? body.ts : Date.now(),
    })
  );

  return new NextResponse(null, { status: 204 });
}
