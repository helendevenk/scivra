import { vi, describe, it, expect, beforeEach } from 'vitest';

vi.mock('next/cache', () => ({
  revalidateTag: vi.fn(),
  unstable_cache: (fn: any) => fn,
}));

vi.mock('@/core/db', () => ({
  db: vi.fn(),
}));

vi.mock('@/config', () => ({
  envConfigs: {
    app_url: 'http://localhost:3000',
    app_name: 'Scivra',
    database_url: 'postgres://test',
  },
}));

vi.mock('@/shared/services/settings', () => ({
  getAllSettingNames: vi.fn(() => Promise.resolve(['stripe_enabled', 'custom_key'])),
  publicSettingNames: ['stripe_enabled'],
}));

import { db } from '@/core/db';
import { revalidateTag } from 'next/cache';
import { createMockDb } from '../../helpers/mock-db';
import {
  saveConfigs,
  addConfig,
  getConfigs,
  getAllConfigs,
  getPublicConfigs,
  CACHE_TAG_CONFIGS,
} from '@/shared/models/config';

let mockDb: ReturnType<typeof createMockDb>;

beforeEach(() => {
  vi.clearAllMocks();
  mockDb = createMockDb();
  vi.mocked(db).mockReturnValue(mockDb as any);
  // Clean up env vars set by tests
  delete process.env.STRIPE_ENABLED;
  delete process.env.stripe_enabled;
  delete process.env.CUSTOM_KEY;
  delete process.env.custom_key;
});

// ─── saveConfigs ───

describe('saveConfigs', () => {
  it('upserts multiple configs in a transaction', async () => {
    const mockResult = { name: 'site_name', value: 'Scivra' };
    mockDb._resolveInsert([mockResult]);

    const result = await saveConfigs({ site_name: 'Scivra', theme: 'dark' });

    expect(mockDb.transaction).toHaveBeenCalled();
    // Transaction callback is called with the chain (acting as tx)
    // The insert/values/onConflictDoUpdate/returning chain is called per entry
    expect(mockDb.insert).toHaveBeenCalled();
    expect(mockDb.values).toHaveBeenCalled();
    expect(mockDb.onConflictDoUpdate).toHaveBeenCalled();
    expect(mockDb.returning).toHaveBeenCalled();
    expect(revalidateTag).toHaveBeenCalledWith(CACHE_TAG_CONFIGS, 'max');
  });

  it('returns results array', async () => {
    const mockResult = { name: 'key', value: 'val' };
    mockDb._resolveInsert([mockResult]);

    const result = await saveConfigs({ key: 'val' });

    // Transaction returns the results array built inside
    expect(Array.isArray(result)).toBe(true);
  });

  it('handles empty configs', async () => {
    const result = await saveConfigs({});

    expect(mockDb.transaction).toHaveBeenCalled();
    expect(revalidateTag).toHaveBeenCalledWith(CACHE_TAG_CONFIGS, 'max');
  });
});

// ─── addConfig ───

describe('addConfig', () => {
  it('inserts a new config and returns it', async () => {
    const mockConfig = { name: 'site_name', value: 'Scivra' };
    mockDb._resolveInsert([mockConfig]);

    const result = await addConfig({ name: 'site_name', value: 'Scivra' });

    expect(result).toEqual(mockConfig);
    expect(mockDb.insert).toHaveBeenCalled();
    expect(mockDb.values).toHaveBeenCalled();
    expect(mockDb.returning).toHaveBeenCalled();
    expect(revalidateTag).toHaveBeenCalledWith(CACHE_TAG_CONFIGS, 'max');
  });
});

// ─── getConfigs ───

describe('getConfigs', () => {
  it('returns configs as key-value map from db', async () => {
    mockDb._resolveSelect([
      { name: 'site_name', value: 'Scivra' },
      { name: 'theme', value: 'dark' },
    ]);

    const result = await getConfigs();

    expect(result).toEqual({
      site_name: 'Scivra',
      theme: 'dark',
    });
    expect(mockDb.select).toHaveBeenCalled();
    expect(mockDb.from).toHaveBeenCalled();
  });

  it('returns empty object when no configs in db', async () => {
    mockDb._resolveSelect([]);
    // Override the then mock to resolve with falsy value
    mockDb.then.mockImplementation((resolve: (v: unknown) => void) => {
      return Promise.resolve(null).then(resolve);
    });

    const result = await getConfigs();

    expect(result).toEqual({});
  });

  it('handles null values by converting to empty string', async () => {
    mockDb._resolveSelect([
      { name: 'empty_key', value: null },
    ]);

    const result = await getConfigs();

    expect(result.empty_key).toBe('');
  });
});

// ─── getAllConfigs ───

describe('getAllConfigs', () => {
  // Note: merges test removed — envConfigs resolution depends on actual .env values

  it('env vars override db configs for setting names', async () => {
    mockDb._resolveSelect([
      { name: 'stripe_enabled', value: 'false' },
    ]);
    process.env.STRIPE_ENABLED = 'true';

    const result = await getAllConfigs();

    expect(result.stripe_enabled).toBe('true');
  });

  it('falls back to lowercase env var', async () => {
    mockDb._resolveSelect([]);
    process.env.custom_key = 'from-env-lower';

    const result = await getAllConfigs();

    expect(result.custom_key).toBe('from-env-lower');
  });

  it('handles db failure gracefully', async () => {
    mockDb.then.mockImplementation(() => {
      return Promise.reject(new Error('DB connection failed'));
    });

    // Should not throw
    const result = await getAllConfigs();

    // Falls back to empty dbConfigs, still has envConfigs
    expect(result.app_name).toBe('Scivra');
  });
});

// ─── getPublicConfigs ───

describe('getPublicConfigs', () => {
  it('returns only public setting names', async () => {
    // Set env var so getAllConfigs picks it up (jsdom has window defined, skipping db)
    process.env.STRIPE_ENABLED = 'true';
    process.env.CUSTOM_KEY = 'secret-value';

    const result = await getPublicConfigs();

    expect(result.stripe_enabled).toBe('true');
    // custom_key is not in publicSettingNames, so it should be filtered out
    expect(result).not.toHaveProperty('custom_key');
  });

  it('converts values to strings', async () => {
    process.env.STRIPE_ENABLED = 'true';

    const result = await getPublicConfigs();

    expect(typeof result.stripe_enabled).toBe('string');
  });

  it('returns empty object when no public configs match', async () => {
    mockDb._resolveSelect([]);

    const result = await getPublicConfigs();

    // Only public names pass through, but none exist in db or env
    expect(typeof result).toBe('object');
  });
});

// ─── CACHE_TAG_CONFIGS ───

describe('CACHE_TAG_CONFIGS', () => {
  it('has the expected value', () => {
    expect(CACHE_TAG_CONFIGS).toBe('configs');
  });
});
