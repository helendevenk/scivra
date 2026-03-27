import { vi, describe, it, expect } from 'vitest';

vi.mock('@/extensions/customer-service', () => ({
  CustomerServiceManager: class { addProvider = vi.fn(); },
  CrispCustomerServiceProvider: class { constructor(public cfg: any) {} },
  TawkCustomerServiceProvider: class { constructor(public cfg: any) {} },
}));

vi.mock('@/shared/models/config', () => ({
  getAllConfigs: vi.fn(async () => ({
    crisp_enabled: 'true',
    crisp_website_id: 'crisp-123',
    tawk_enabled: 'true',
    tawk_property_id: 'tawk-p',
    tawk_widget_id: 'tawk-w',
  })),
}));

import { getCustomerServiceWithConfigs, getCustomerService } from '@/shared/services/customer_service';

describe('getCustomerServiceWithConfigs', () => {
  it('adds both providers when configured', () => {
    const mgr = getCustomerServiceWithConfigs({
      crisp_enabled: 'true', crisp_website_id: 'c-1',
      tawk_enabled: 'true', tawk_property_id: 'tp', tawk_widget_id: 'tw',
    } as any);
    expect(mgr.addProvider).toHaveBeenCalledTimes(2);
  });

  it('skips crisp when not enabled', () => {
    const mgr = getCustomerServiceWithConfigs({
      crisp_enabled: 'false',
      tawk_enabled: 'true', tawk_property_id: 'tp', tawk_widget_id: 'tw',
    } as any);
    expect(mgr.addProvider).toHaveBeenCalledTimes(1);
  });

  it('skips tawk when missing widget id', () => {
    const mgr = getCustomerServiceWithConfigs({
      crisp_enabled: 'true', crisp_website_id: 'c-1',
      tawk_enabled: 'true', tawk_property_id: 'tp',
    } as any);
    expect(mgr.addProvider).toHaveBeenCalledTimes(1);
  });

  it('skips all when no config', () => {
    const mgr = getCustomerServiceWithConfigs({} as any);
    expect(mgr.addProvider).not.toHaveBeenCalled();
  });
});

describe('getCustomerService', () => {
  it('returns manager', async () => {
    const svc = await getCustomerService();
    expect(svc).toBeDefined();
  });
});
