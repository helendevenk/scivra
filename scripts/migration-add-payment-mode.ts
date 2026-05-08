/**
 * One-shot migration: add payment_mode column to order + subscription tables.
 * Idempotent (uses ADD COLUMN IF NOT EXISTS).
 *
 * Usage: npx tsx scripts/migration-add-payment-mode.ts
 */
import 'dotenv/config';
import postgres from 'postgres';

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error('DATABASE_URL not set');
  }

  const sql = postgres(url, { max: 1 });

  try {
    const before = await sql`
      SELECT table_name, column_name, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name IN ('order', 'subscription') AND column_name = 'payment_mode'
      ORDER BY table_name;
    `;
    console.log('BEFORE:', before);

    await sql`ALTER TABLE "order" ADD COLUMN IF NOT EXISTS payment_mode text NOT NULL DEFAULT 'test'`;
    console.log('OK: order.payment_mode added');

    await sql`ALTER TABLE subscription ADD COLUMN IF NOT EXISTS payment_mode text NOT NULL DEFAULT 'test'`;
    console.log('OK: subscription.payment_mode added');

    const after = await sql`
      SELECT table_name, column_name, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name IN ('order', 'subscription') AND column_name = 'payment_mode'
      ORDER BY table_name;
    `;
    console.log('AFTER:', after);

    const orderRows = await sql`SELECT COUNT(*)::int AS n, payment_mode FROM "order" GROUP BY payment_mode`;
    const subRows = await sql`SELECT COUNT(*)::int AS n, payment_mode FROM subscription GROUP BY payment_mode`;
    console.log('order rows by mode:', orderRows);
    console.log('subscription rows by mode:', subRows);
  } finally {
    await sql.end();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
