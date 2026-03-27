import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock external dependencies before imports
vi.mock('@/shared/models/config', () => ({
  getAllConfigs: vi.fn().mockResolvedValue({}),
}));

const mockAddProvider = vi.fn();
vi.mock('@/extensions/storage', () => {
  class MockStorageManager {
    providers: any[] = [];
    defaultProvider: any = undefined;
    addProvider(provider: any, isDefault = false) {
      mockAddProvider(provider, isDefault);
      this.providers.push(provider);
      if (isDefault) this.defaultProvider = provider;
    }
    getProviders() {
      return this.providers;
    }
    getDefaultProvider() {
      return this.defaultProvider;
    }
  }
  class MockR2Provider {
    readonly name = 'r2';
    configs: any;
    constructor(cfg: any) { this.configs = cfg; }
  }
  class MockS3Provider {
    readonly name = 's3';
    configs: any;
    constructor(cfg: any) { this.configs = cfg; }
  }
  return {
    StorageManager: MockStorageManager,
    R2Provider: MockR2Provider,
    S3Provider: MockS3Provider,
  };
});

import {
  getStorageServiceWithConfigs,
  getStorageService,
} from '@/shared/services/storage';
import { getAllConfigs } from '@/shared/models/config';
import type { Configs } from '@/shared/models/config';

describe('storage service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getStorageServiceWithConfigs', () => {
    it('should add R2Provider as default when R2 keys are configured', () => {
      const configs: Configs = {
        r2_access_key: 'access-key',
        r2_secret_key: 'secret-key',
        r2_bucket_name: 'my-bucket',
      };
      getStorageServiceWithConfigs(configs);
      expect(mockAddProvider).toHaveBeenCalledTimes(1);
      const [provider, isDefault] = mockAddProvider.mock.calls[0];
      expect(provider.name).toBe('r2');
      expect(isDefault).toBe(true);
    });

    it('should pass R2 config values correctly', () => {
      const configs: Configs = {
        r2_access_key: 'ak',
        r2_secret_key: 'sk',
        r2_bucket_name: 'bucket',
        r2_account_id: 'acct-123',
        r2_upload_path: 'uploads/test',
        r2_endpoint: 'https://custom.r2.endpoint',
        r2_domain: 'https://cdn.scivra.com',
      };
      getStorageServiceWithConfigs(configs);
      const provider = mockAddProvider.mock.calls[0][0];
      expect(provider.configs.accessKeyId).toBe('ak');
      expect(provider.configs.secretAccessKey).toBe('sk');
      expect(provider.configs.bucket).toBe('bucket');
      expect(provider.configs.accountId).toBe('acct-123');
      expect(provider.configs.uploadPath).toBe('uploads/test');
      expect(provider.configs.endpoint).toBe('https://custom.r2.endpoint');
      expect(provider.configs.publicDomain).toBe('https://cdn.scivra.com');
      expect(provider.configs.region).toBe('auto');
    });

    it('should use empty string for accountId when r2_account_id is missing', () => {
      const configs: Configs = {
        r2_access_key: 'ak',
        r2_secret_key: 'sk',
        r2_bucket_name: 'bucket',
      };
      getStorageServiceWithConfigs(configs);
      const provider = mockAddProvider.mock.calls[0][0];
      expect(provider.configs.accountId).toBe('');
    });

    it('should NOT add R2Provider when r2_access_key is missing', () => {
      const configs: Configs = {
        r2_secret_key: 'sk',
        r2_bucket_name: 'bucket',
      };
      getStorageServiceWithConfigs(configs);
      const r2Calls = mockAddProvider.mock.calls.filter(
        (c: any) => c[0].name === 'r2'
      );
      expect(r2Calls).toHaveLength(0);
    });

    it('should NOT add R2Provider when r2_secret_key is missing', () => {
      const configs: Configs = {
        r2_access_key: 'ak',
        r2_bucket_name: 'bucket',
      };
      getStorageServiceWithConfigs(configs);
      const r2Calls = mockAddProvider.mock.calls.filter(
        (c: any) => c[0].name === 'r2'
      );
      expect(r2Calls).toHaveLength(0);
    });

    it('should NOT add R2Provider when r2_bucket_name is missing', () => {
      const configs: Configs = {
        r2_access_key: 'ak',
        r2_secret_key: 'sk',
      };
      getStorageServiceWithConfigs(configs);
      const r2Calls = mockAddProvider.mock.calls.filter(
        (c: any) => c[0].name === 'r2'
      );
      expect(r2Calls).toHaveLength(0);
    });

    it('should add S3Provider when S3 keys are configured', () => {
      const configs: Configs = {
        s3_access_key: 's3-ak',
        s3_secret_key: 's3-sk',
        s3_bucket: 's3-bucket',
        s3_endpoint: 'https://s3.amazonaws.com',
        s3_region: 'us-east-1',
        s3_domain: 'https://s3.cdn.com',
      };
      getStorageServiceWithConfigs(configs);
      expect(mockAddProvider).toHaveBeenCalledTimes(1);
      const [provider, isDefault] = mockAddProvider.mock.calls[0];
      expect(provider.name).toBe('s3');
      // S3 is not set as default (addProvider called without isDefault, defaults to false)
      expect(isDefault).toBe(false);
    });

    it('should NOT add S3Provider when S3 keys are incomplete', () => {
      const configs: Configs = {
        s3_access_key: 's3-ak',
        // missing s3_secret_key and s3_bucket
      };
      getStorageServiceWithConfigs(configs);
      expect(mockAddProvider).not.toHaveBeenCalled();
    });

    it('should add both R2 and S3 providers when both are configured', () => {
      const configs: Configs = {
        r2_access_key: 'r2-ak',
        r2_secret_key: 'r2-sk',
        r2_bucket_name: 'r2-bucket',
        s3_access_key: 's3-ak',
        s3_secret_key: 's3-sk',
        s3_bucket: 's3-bucket',
      };
      getStorageServiceWithConfigs(configs);
      expect(mockAddProvider).toHaveBeenCalledTimes(2);
      const providerNames = mockAddProvider.mock.calls.map((c: any) => c[0].name);
      expect(providerNames).toContain('r2');
      expect(providerNames).toContain('s3');
    });

    it('should add no providers when configs are empty', () => {
      const configs: Configs = {};
      getStorageServiceWithConfigs(configs);
      expect(mockAddProvider).not.toHaveBeenCalled();
    });

    it('should return a StorageManager instance', () => {
      const configs: Configs = {};
      const manager = getStorageServiceWithConfigs(configs);
      expect(manager).toBeDefined();
      expect(typeof manager.addProvider).toBe('function');
    });
  });

  describe('getStorageService', () => {
    it('should use provided configs without calling getAllConfigs', async () => {
      const configs: Configs = {
        r2_access_key: 'ak',
        r2_secret_key: 'sk',
        r2_bucket_name: 'bucket',
      };
      await getStorageService(configs);
      expect(getAllConfigs).not.toHaveBeenCalled();
    });

    it('should call getAllConfigs when no configs provided', async () => {
      vi.mocked(getAllConfigs).mockResolvedValue({});
      await getStorageService();
      expect(getAllConfigs).toHaveBeenCalledTimes(1);
    });

    it('should return StorageManager instance', async () => {
      const manager = await getStorageService({});
      expect(manager).toBeDefined();
    });
  });
});
