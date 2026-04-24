#!/usr/bin/env node
/**
 * SEO audit — checks 5 canonical SEO properties on a URL.
 *
 * Checks:
 *   1. <link rel="canonical"> present + absolute URL
 *   2. <script type="application/ld+json"> present + valid JSON + has @type
 *   3. <link rel="alternate" hreflang="..."> at minimum en + x-default
 *   4. exactly one <h1>
 *   5. OG card: og:title, og:description, og:image, og:type, og:url
 *
 * Usage: node scripts/seo-audit.mjs [url]
 *   (default url: http://localhost:3000)
 *
 * Exit 0 on PASS, 1 on any FAIL, 2 on crash
 */

const url = process.argv[2] ?? 'http://localhost:3000';

async function main() {
  let res;
  try {
    res = await fetch(url, { redirect: 'follow' });
  } catch (err) {
    console.error(`FAIL: could not fetch ${url}: ${err.message}`);
    process.exit(1);
  }

  if (!res.ok) {
    console.error(`FAIL: ${url} returned ${res.status}`);
    process.exit(1);
  }

  const html = await res.text();
  const results = [];

  // 1. Canonical
  const canonicalMatch = html.match(
    /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i
  );
  results.push({
    check: 'canonical',
    pass: canonicalMatch !== null && /^https?:\/\//.test(canonicalMatch?.[1] ?? ''),
    detail: canonicalMatch?.[1] ?? 'missing',
  });

  // 2. JSON-LD
  const jsonLdMatches = [
    ...html.matchAll(
      /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi
    ),
  ];
  let jsonLdPass = false;
  let jsonLdDetail = 'missing';
  for (const m of jsonLdMatches) {
    try {
      const data = JSON.parse(m[1].trim());
      const type = data['@type'] ?? (Array.isArray(data) && data[0]?.['@type']);
      if (type) {
        jsonLdPass = true;
        jsonLdDetail = type;
        break;
      }
    } catch {
      /* skip invalid */
    }
  }
  results.push({ check: 'json-ld', pass: jsonLdPass, detail: jsonLdDetail });

  // 3. Hreflang — site is currently English-only (zh locale was retired
  // in commit 14a0056). Require at minimum 'en' + 'x-default'; if more
  // locales come back later, they're tolerated, just not required here.
  const hreflangs = [
    ...html.matchAll(/<link[^>]+hreflang=["']([^"']+)["']/gi),
  ].map((m) => m[1]);
  results.push({
    check: 'hreflang',
    pass: hreflangs.includes('en') && hreflangs.includes('x-default'),
    detail: hreflangs.join(',') || 'missing',
  });

  // 4. Single H1
  const h1Count = (html.match(/<h1[\s>]/gi) ?? []).length;
  results.push({
    check: 'single-h1',
    pass: h1Count === 1,
    detail: `found ${h1Count}`,
  });

  // 5. OG card
  const requiredOg = ['og:title', 'og:description', 'og:image', 'og:type', 'og:url'];
  const ogMissing = requiredOg.filter(
    (prop) =>
      !new RegExp(`property=["']${prop.replace(':', '\\:')}["']`, 'i').test(html)
  );
  results.push({
    check: 'og-card',
    pass: ogMissing.length === 0,
    detail: ogMissing.length === 0 ? 'complete' : `missing: ${ogMissing.join(',')}`,
  });

  // Output
  console.log(`SEO Audit · ${url}\n`);
  let failed = 0;
  for (const r of results) {
    const icon = r.pass ? '✓' : '✗';
    console.log(`  ${icon} ${r.check.padEnd(12)} — ${r.detail}`);
    if (!r.pass) failed++;
  }

  console.log(
    `\n${failed === 0 ? 'PASS' : 'FAIL'} (${results.length - failed}/${results.length})`
  );
  process.exit(failed === 0 ? 0 : 1);
}

main().catch((err) => {
  console.error('seo-audit crashed:', err);
  process.exit(2);
});
