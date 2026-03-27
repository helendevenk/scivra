import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock external dependencies before imports
vi.mock('@/shared/models/config', () => ({
  getAllConfigs: vi.fn().mockResolvedValue({}),
}));

const mockAddProvider = vi.fn();
vi.mock('@/extensions/analytics', () => {
  class MockAnalyticsManager {
    providers: any[] = [];
    addProvider(provider: any) {
      mockAddProvider(provider);
      this.providers.push(provider);
    }
    getProviders() {
      return this.providers;
    }
  }
  class MockGoogleAnalyticsProvider {
    readonly name = 'google_analytics';
    configs: any;
    constructor(cfg: any) { this.configs = cfg; }
  }
  class MockClarityAnalyticsProvider {
    readonly name = 'clarity';
    configs: any;
    constructor(cfg: any) { this.configs = cfg; }
  }
  class MockPlausibleAnalyticsProvider {
    readonly name = 'plausible';
    configs: any;
    constructor(cfg: any) { this.configs = cfg; }
  }
  class MockOpenPanelAnalyticsProvider {
    readonly name = 'openpanel';
    configs: any;
    constructor(cfg: any) { this.configs = cfg; }
  }
  class MockVercelAnalyticsProvider {
    readonly name = 'vercel_analytics';
    configs: any;
    constructor(cfg: any) { this.configs = cfg; }
  }
  return {
    AnalyticsManager: MockAnalyticsManager,
    GoogleAnalyticsProvider: MockGoogleAnalyticsProvider,
    ClarityAnalyticsProvider: MockClarityAnalyticsProvider,
    PlausibleAnalyticsProvider: MockPlausibleAnalyticsProvider,
    OpenPanelAnalyticsProvider: MockOpenPanelAnalyticsProvider,
    VercelAnalyticsProvider: MockVercelAnalyticsProvider,
  };
});

import {
  getAnalyticsManagerWithConfigs,
  getAnalyticsService,
} from '@/shared/services/analytics';
import { getAllConfigs } from '@/shared/models/config';
import type { Configs } from '@/shared/models/config';

describe('analytics service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAnalyticsManagerWithConfigs', () => {
    it('should add GoogleAnalyticsProvider when google_analytics_id is set', () => {
      const configs: Configs = { google_analytics_id: 'G-TESTID' };
      getAnalyticsManagerWithConfigs(configs);
      expect(mockAddProvider).toHaveBeenCalledTimes(1);
      expect(mockAddProvider.mock.calls[0][0].name).toBe('google_analytics');
      expect(mockAddProvider.mock.calls[0][0].configs.gaId).toBe('G-TESTID');
    });

    it('should add ClarityAnalyticsProvider when clarity_id is set', () => {
      const configs: Configs = { clarity_id: 'clarity-123' };
      getAnalyticsManagerWithConfigs(configs);
      expect(mockAddProvider).toHaveBeenCalledTimes(1);
      expect(mockAddProvider.mock.calls[0][0].name).toBe('clarity');
      expect(mockAddProvider.mock.calls[0][0].configs.clarityId).toBe('clarity-123');
    });

    it('should add PlausibleAnalyticsProvider when both domain and src are set', () => {
      const configs: Configs = {
        plausible_domain: 'scivra.com',
        plausible_src: 'https://plausible.io/js/script.js',
      };
      getAnalyticsManagerWithConfigs(configs);
      expect(mockAddProvider).toHaveBeenCalledTimes(1);
      expect(mockAddProvider.mock.calls[0][0].name).toBe('plausible');
    });

    it('should NOT add PlausibleAnalyticsProvider when only domain is set', () => {
      const configs: Configs = { plausible_domain: 'scivra.com' };
      getAnalyticsManagerWithConfigs(configs);
      const plausibleCalls = mockAddProvider.mock.calls.filter(
        (c: any) => c[0].name === 'plausible'
      );
      expect(plausibleCalls).toHaveLength(0);
    });

    it('should NOT add PlausibleAnalyticsProvider when only src is set', () => {
      const configs: Configs = {
        plausible_src: 'https://plausible.io/js/script.js',
      };
      getAnalyticsManagerWithConfigs(configs);
      const plausibleCalls = mockAddProvider.mock.calls.filter(
        (c: any) => c[0].name === 'plausible'
      );
      expect(plausibleCalls).toHaveLength(0);
    });

    it('should add OpenPanelAnalyticsProvider when openpanel_client_id is set', () => {
      const configs: Configs = { openpanel_client_id: 'op-client-1' };
      getAnalyticsManagerWithConfigs(configs);
      expect(mockAddProvider).toHaveBeenCalledTimes(1);
      expect(mockAddProvider.mock.calls[0][0].name).toBe('openpanel');
    });

    it('should add VercelAnalyticsProvider when vercel_analytics_enabled is true', () => {
      const configs: Configs = { vercel_analytics_enabled: 'true' };
      getAnalyticsManagerWithConfigs(configs);
      expect(mockAddProvider).toHaveBeenCalledTimes(1);
      expect(mockAddProvider.mock.calls[0][0].name).toBe('vercel_analytics');
    });

    it('should NOT add VercelAnalyticsProvider when vercel_analytics_enabled is false', () => {
      const configs: Configs = { vercel_analytics_enabled: 'false' };
      getAnalyticsManagerWithConfigs(configs);
      const vercelCalls = mockAddProvider.mock.calls.filter(
        (c: any) => c[0].name === 'vercel_analytics'
      );
      expect(vercelCalls).toHaveLength(0);
    });

    it('should add multiple providers when multiple configs are set', () => {
      const configs: Configs = {
        google_analytics_id: 'G-TEST',
        clarity_id: 'clarity-1',
        openpanel_client_id: 'op-1',
      };
      getAnalyticsManagerWithConfigs(configs);
      expect(mockAddProvider).toHaveBeenCalledTimes(3);
    });

    it('should add no providers when configs are empty', () => {
      const configs: Configs = {};
      getAnalyticsManagerWithConfigs(configs);
      expect(mockAddProvider).not.toHaveBeenCalled();
    });

    it('should return an AnalyticsManager instance', () => {
      const configs: Configs = {};
      const manager = getAnalyticsManagerWithConfigs(configs);
      expect(manager).toBeDefined();
      expect(typeof manager.addProvider).toBe('function');
    });
  });

  describe('getAnalyticsService', () => {
    it('should use provided configs without calling getAllConfigs', async () => {
      const configs: Configs = { google_analytics_id: 'G-TEST' };
      await getAnalyticsService(configs);
      expect(getAllConfigs).not.toHaveBeenCalled();
    });

    it('should call getAllConfigs when no configs provided', async () => {
      vi.mocked(getAllConfigs).mockResolvedValue({});
      await getAnalyticsService();
      expect(getAllConfigs).toHaveBeenCalledTimes(1);
    });

    it('should return AnalyticsManager instance', async () => {
      const manager = await getAnalyticsService({});
      expect(manager).toBeDefined();
    });
  });
});
