import postgres from 'postgres';
import { describe, expect, inject, it } from 'vitest';

describe('testcontainers PG smoke', () => {
  it('can connect to test container and SELECT 1', async () => {
    const url = process.env.DATABASE_URL_TEST ?? inject('databaseUrlTest');
    expect(url).toBeDefined();

    const sql = postgres(url, { max: 1 });
    try {
      const result = await sql`SELECT 1 as one`;
      expect(result[0].one).toBe(1);
    } finally {
      await sql.end();
    }
  });
});
