import { describe, it, expect, beforeAll } from 'vitest';
import axe from 'axe-core';

const HOMEPAGE_URL = process.env.A11Y_BASE_URL ?? 'http://localhost:3000';

describe('Homepage WCAG AA', () => {
  beforeAll(async () => {
    const res = await fetch(HOMEPAGE_URL);
    if (!res.ok) {
      throw new Error(
        `Expected dev server at ${HOMEPAGE_URL} to return 200, got ${res.status}`
      );
    }
    const html = await res.text();

    // Vitest runs in a jsdom environment. Inject the fetched HTML into the
    // global document so axe-core can traverse it using its native DOM checks.
    // Setting innerHTML on documentElement replaces only the inner markup,
    // so we must also forward the <html> element's own attributes (e.g. lang).
    document.documentElement.innerHTML = html;

    // Restore attributes that live on <html> itself but are lost when we
    // replace innerHTML (the outer <html> tag isn't part of innerHTML).
    const langMatch = html.match(/<html[^>]*\slang="([^"]+)"/i);
    if (langMatch) {
      document.documentElement.setAttribute('lang', langMatch[1]);
    }
  }, 30_000);

  it('has no serious or critical WCAG 2.1 AA violations', async () => {
    const results = await axe.run(document, {
      runOnly: {
        type: 'tag',
        values: ['wcag2a', 'wcag2aa', 'wcag21aa'],
      },
      resultTypes: ['violations'],
    });

    const serious = results.violations.filter(
      (v) => v.impact === 'serious' || v.impact === 'critical'
    );

    if (serious.length > 0) {
      console.error(
        'WCAG violations found:\n' +
          serious
            .map(
              (v) =>
                `  [${v.impact}] ${v.id} — ${v.help} (${v.nodes.length} node${v.nodes.length === 1 ? '' : 's'})`
            )
            .join('\n')
      );
    }
    expect(serious).toHaveLength(0);
  }, 30_000);
});
