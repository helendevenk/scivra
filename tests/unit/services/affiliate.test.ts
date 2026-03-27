import { vi, describe, it, expect } from 'vitest';

vi.mock('@/extensions/affiliate', () => ({
  AffiliateManager: class { addProvider = vi.fn(); },
  AffonsoAffiliateProvider: class { constructor(public cfg: any) {} },
  PromoteKitAffiliateProvider: class { constructor(public cfg: any) {} },
}));

vi.mock('@/shared/models/config', () => ({
  getAllConfigs: vi.fn(async () => ({
    affonso_enabled: 'true',
    affonso_id: 'aff-123',
    affonso_cookie_duration: '30',
    promotekit_enabled: 'true',
    promotekit_id: 'pk-456',
  })),
}));

import { getAffiliateManagerWithConfigs, getAffiliateService } from '@/shared/services/affiliate';

describe('getAffiliateManagerWithConfigs', () => {
  it('adds both providers when configured', () => {
    const mgr = getAffiliateManagerWithConfigs({
      affonso_enabled: 'true',
      affonso_id: 'aff-123',
      affonso_cookie_duration: '30',
      promotekit_enabled: 'true',
      promotekit_id: 'pk-456',
    } as any);
    expect(mgr.addProvider).toHaveBeenCalledTimes(2);
  });

  it('skips affonso when not enabled', () => {
    const mgr = getAffiliateManagerWithConfigs({
      affonso_enabled: 'false',
      promotekit_enabled: 'true',
      promotekit_id: 'pk-456',
    } as any);
    expect(mgr.addProvider).toHaveBeenCalledTimes(1);
  });

  it('skips all when no config', () => {
    const mgr = getAffiliateManagerWithConfigs({} as any);
    expect(mgr.addProvider).not.toHaveBeenCalled();
  });
});

describe('getAffiliateService', () => {
  it('returns AffiliateManager', async () => {
    const svc = await getAffiliateService();
    expect(svc).toBeDefined();
  });
});
