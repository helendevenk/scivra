import { vi, describe, it, expect } from 'vitest';

vi.mock('@/extensions/ads', () => ({
  AdsManager: class { addProvider = vi.fn(); },
  AdsenseProvider: class { constructor(public cfg: any) {} },
}));

vi.mock('@/shared/models/config', () => ({
  getAllConfigs: vi.fn(async () => ({ adsense_code: 'ca-pub-123' })),
}));

import { getAdsManagerWithConfigs, getAdsService } from '@/shared/services/ads';

describe('getAdsManagerWithConfigs', () => {
  it('adds AdsenseProvider when adsense_code present', () => {
    const mgr = getAdsManagerWithConfigs({ adsense_code: 'ca-pub-123' } as any);
    expect(mgr.addProvider).toHaveBeenCalledTimes(1);
  });

  it('skips provider when no adsense_code', () => {
    const mgr = getAdsManagerWithConfigs({} as any);
    expect(mgr.addProvider).not.toHaveBeenCalled();
  });
});

describe('getAdsService', () => {
  it('returns AdsManager instance', async () => {
    const svc = await getAdsService();
    expect(svc).toBeDefined();
  });
});
