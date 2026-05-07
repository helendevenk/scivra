/**
 * Stripe Webhook Race Cleanup
 *
 * Run BEFORE `pnpm db:push` adds the new UNIQUE / partial UNIQUE constraints
 * on subscription / order / credit. The constraints will fail to create if
 * existing race-duplicate rows are still present.
 *
 * Steps (executed inside a single transaction):
 *   1. Normalize legacy '' values to NULL on credit.order_no /
 *      credit.subscription_no.
 *   2. Order dedup: merge duplicate (payment_provider, transaction_id)
 *      orders. Rewrite credit.order_no to canonical order before deleting
 *      orphans.
 *   3. After (2), re-check for duplicate (order_no, transaction_type='grant')
 *      credits that may have been produced by step 2.
 *   4. Abort if any duplicate GRANT has remaining_credits < credits
 *      (already consumed -> manual reconciliation required).
 *   5. Delete unconsumed duplicate GRANT credits, keeping the earliest row.
 *   6. Subscription dedup: pick canonical row (preference order:
 *      referenced-by-credit > referenced-by-order > earliest created_at),
 *      rewrite order/credit subscription_no, delete orphans.
 *
 * Idempotent: safe to re-run. After it succeeds the duplicates are gone, so a
 * subsequent run finds nothing and is a no-op.
 *
 * Production preflight: run the same checks dry on prod before deploy. See
 * docs/payment/stripe-setup.md "Stripe Race Cleanup" section.
 *
 * Usage:
 *   pnpm tsx scripts/cleanup-stripe-race.ts
 *   pnpm tsx scripts/cleanup-stripe-race.ts --dry-run
 */

import 'dotenv/config';
import postgres from 'postgres';

const DRY_RUN = process.argv.includes('--dry-run');

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error(
    '❌ DATABASE_URL is not set. Load it from .env or export it before running.'
  );
  process.exit(1);
}

const sql = postgres(databaseUrl, { max: 1 });

async function main() {
  console.log(
    DRY_RUN
      ? '🧪 DRY RUN — no writes will be committed'
      : '🚀 LIVE RUN — changes will be committed'
  );

  await sql.begin(async (tx) => {
    // ─── Step 1: Normalize '' → NULL on credit references ───
    const normalizeOrder = await tx`
      UPDATE credit SET order_no = NULL WHERE order_no = ''
    `;
    const normalizeSub = await tx`
      UPDATE credit SET subscription_no = NULL WHERE subscription_no = ''
    `;
    console.log(
      `  step 1: normalized credit.order_no=${normalizeOrder.count} credit.subscription_no=${normalizeSub.count}`
    );

    // ─── Step 2: Order dedup ───
    // Build temp table of duplicates with canonical (earliest created_at).
    await tx`
      CREATE TEMP TABLE _order_canonical ON COMMIT DROP AS
      SELECT
        payment_provider,
        transaction_id,
        (
          SELECT o2.order_no
          FROM "order" o2
          WHERE o2.payment_provider = o.payment_provider
            AND o2.transaction_id = o.transaction_id
          ORDER BY o2.created_at ASC
          LIMIT 1
        ) AS canonical_order_no,
        array_agg(o.order_no ORDER BY o.created_at) AS all_order_nos
      FROM "order" o
      WHERE o.transaction_id IS NOT NULL
      GROUP BY o.payment_provider, o.transaction_id
      HAVING count(*) > 1
    `;

    const orderDupCount = await tx<{ count: number }[]>`
      SELECT count(*)::int AS count FROM _order_canonical
    `;
    const orderDups = orderDupCount[0]?.count ?? 0;
    console.log(`  step 2a: detected ${orderDups} order duplicate group(s)`);

    if (orderDups > 0) {
      // Rewrite credit references to canonical order.
      const creditRewrite = await tx`
        UPDATE credit c
        SET order_no = oc.canonical_order_no
        FROM _order_canonical oc
        WHERE c.order_no = ANY(oc.all_order_nos)
          AND c.order_no IS DISTINCT FROM oc.canonical_order_no
      `;
      console.log(
        `  step 2b: rewrote ${creditRewrite.count} credit.order_no reference(s)`
      );

      // Delete orphan order rows (everything in all_order_nos except canonical).
      const orderDelete = await tx`
        DELETE FROM "order"
        WHERE order_no IN (
          SELECT unnest(all_order_nos)
          FROM _order_canonical
          WHERE NOT (canonical_order_no = ANY(ARRAY[order_no]))
        )
        AND order_no NOT IN (
          SELECT canonical_order_no FROM _order_canonical
        )
      `;
      console.log(`  step 2c: deleted ${orderDelete.count} orphan order(s)`);
    }

    // ─── Step 3: Re-check duplicate GRANT credits AFTER order merge ───
    const consumedDup = await tx<{ id: string }[]>`
      SELECT c1.id
      FROM credit c1
      WHERE c1.order_no IS NOT NULL
        AND c1.transaction_type = 'grant'
        AND c1.remaining_credits < c1.credits
        AND EXISTS (
          SELECT 1 FROM credit c2
          WHERE c2.order_no = c1.order_no
            AND c2.transaction_type = 'grant'
            AND c2.id <> c1.id
        )
    `;

    if (consumedDup.length > 0) {
      console.error(
        `\n❌ ABORT: ${consumedDup.length} duplicate GRANT credit row(s) ` +
          `with consumed remaining_credits. Manual reconciliation required.\n` +
          `Inspect with:\n` +
          `  SELECT * FROM credit WHERE id IN (${consumedDup
            .map((r) => `'${r.id}'`)
            .join(',')});\n`
      );
      throw new Error('Aborting cleanup: consumed duplicate GRANT credits');
    }

    const grantDup = await tx`
      DELETE FROM credit
      WHERE id IN (
        SELECT id FROM (
          SELECT id, ROW_NUMBER() OVER (
            PARTITION BY order_no, transaction_type
            ORDER BY created_at ASC
          ) AS rn
          FROM credit
          WHERE order_no IS NOT NULL AND transaction_type = 'grant'
        ) t
        WHERE rn > 1
      )
    `;
    console.log(
      `  step 3: deleted ${grantDup.count} duplicate unconsumed GRANT credit(s)`
    );

    // ─── Step 4: Subscription dedup ───
    await tx`
      CREATE TEMP TABLE _subscription_canonical ON COMMIT DROP AS
      SELECT
        payment_provider,
        subscription_id,
        COALESCE(
          (
            SELECT s2.subscription_no
            FROM subscription s2
            WHERE s2.payment_provider = s.payment_provider
              AND s2.subscription_id = s.subscription_id
              AND EXISTS (
                SELECT 1 FROM credit c
                WHERE c.subscription_no = s2.subscription_no
              )
            ORDER BY s2.created_at ASC
            LIMIT 1
          ),
          (
            SELECT s2.subscription_no
            FROM subscription s2
            WHERE s2.payment_provider = s.payment_provider
              AND s2.subscription_id = s.subscription_id
              AND EXISTS (
                SELECT 1 FROM "order" o
                WHERE o.subscription_no = s2.subscription_no
              )
            ORDER BY s2.created_at ASC
            LIMIT 1
          ),
          (
            SELECT s2.subscription_no
            FROM subscription s2
            WHERE s2.payment_provider = s.payment_provider
              AND s2.subscription_id = s.subscription_id
            ORDER BY s2.created_at ASC
            LIMIT 1
          )
        ) AS canonical_subscription_no,
        array_agg(s.subscription_no ORDER BY s.created_at) AS all_subscription_nos
      FROM subscription s
      WHERE s.subscription_id IS NOT NULL
      GROUP BY s.payment_provider, s.subscription_id
      HAVING count(*) > 1
    `;

    const subDupCount = await tx<{ count: number }[]>`
      SELECT count(*)::int AS count FROM _subscription_canonical
    `;
    const subDups = subDupCount[0]?.count ?? 0;
    console.log(`  step 4a: detected ${subDups} subscription duplicate group(s)`);

    if (subDups > 0) {
      // Abort on credit corruption: same sub_id but credits point to different
      // subscription_no values (would mean canonical choice is ambiguous).
      const corrupt = await tx<{ count: number }[]>`
        SELECT count(*)::int AS count
        FROM (
          SELECT sc.payment_provider, sc.subscription_id,
                 count(DISTINCT c.subscription_no) AS cnt
          FROM _subscription_canonical sc
          JOIN credit c ON c.subscription_no = ANY(sc.all_subscription_nos)
          GROUP BY 1, 2
          HAVING count(DISTINCT c.subscription_no) > 1
        ) t
      `;
      if ((corrupt[0]?.count ?? 0) > 0) {
        throw new Error(
          `Aborting cleanup: ${corrupt[0]!.count} subscription_id has ` +
            `credit rows pointing to multiple subscription_no — manual ` +
            `reconciliation required.`
        );
      }

      const orderRewrite = await tx`
        UPDATE "order" o
        SET subscription_no = sc.canonical_subscription_no
        FROM _subscription_canonical sc
        WHERE o.subscription_no = ANY(sc.all_subscription_nos)
          AND o.subscription_no IS DISTINCT FROM sc.canonical_subscription_no
      `;
      console.log(
        `  step 4b: rewrote ${orderRewrite.count} order.subscription_no reference(s)`
      );

      const creditRewrite = await tx`
        UPDATE credit c
        SET subscription_no = sc.canonical_subscription_no
        FROM _subscription_canonical sc
        WHERE c.subscription_no = ANY(sc.all_subscription_nos)
          AND c.subscription_no IS DISTINCT FROM sc.canonical_subscription_no
      `;
      console.log(
        `  step 4c: rewrote ${creditRewrite.count} credit.subscription_no reference(s)`
      );

      const subDelete = await tx`
        DELETE FROM subscription
        WHERE subscription_no IN (
          SELECT unnest(all_subscription_nos) FROM _subscription_canonical
        )
        AND subscription_no NOT IN (
          SELECT canonical_subscription_no FROM _subscription_canonical
        )
      `;
      console.log(
        `  step 4d: deleted ${subDelete.count} orphan subscription(s)`
      );
    }

    if (DRY_RUN) {
      throw new Error('DRY_RUN: rolling back transaction');
    }
  });

  console.log('\n✅ Cleanup complete. Now safe to run `pnpm db:push`.');
  await sql.end();
}

main().catch(async (err) => {
  if (err instanceof Error && err.message.startsWith('DRY_RUN')) {
    console.log('\n🧪 Dry run finished — transaction rolled back. No changes written.');
    await sql.end();
    process.exit(0);
  }
  console.error('\n❌ Cleanup failed:', err);
  await sql.end();
  process.exit(1);
});
