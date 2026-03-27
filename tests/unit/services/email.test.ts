import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock external dependencies before imports
vi.mock('@/shared/models/config', () => ({
  getAllConfigs: vi.fn().mockResolvedValue({}),
}));

const mockAddProvider = vi.fn();
vi.mock('@/extensions/email', () => {
  class MockEmailManager {
    providers: any[] = [];
    addProvider(provider: any) {
      mockAddProvider(provider);
      this.providers.push(provider);
    }
    getProviders() {
      return this.providers;
    }
  }
  class MockResendProvider {
    readonly name = 'resend';
    configs: any;
    constructor(cfg: any) {
      this.configs = cfg;
    }
  }
  return {
    EmailManager: MockEmailManager,
    ResendProvider: MockResendProvider,
  };
});

import {
  getEmailServiceWithConfigs,
  getEmailService,
} from '@/shared/services/email';
import { getAllConfigs } from '@/shared/models/config';
import type { Configs } from '@/shared/models/config';

describe('email service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getEmailServiceWithConfigs', () => {
    it('should add ResendProvider when resend_api_key is configured', () => {
      const configs: Configs = {
        resend_api_key: 're_test_key',
        resend_sender_email: 'noreply@scivra.com',
      };
      const manager = getEmailServiceWithConfigs(configs);
      expect(mockAddProvider).toHaveBeenCalledTimes(1);
      const provider = mockAddProvider.mock.calls[0][0];
      expect(provider.name).toBe('resend');
      expect(provider.configs.apiKey).toBe('re_test_key');
      expect(provider.configs.defaultFrom).toBe('noreply@scivra.com');
    });

    it('should not add any provider when resend_api_key is missing', () => {
      const configs: Configs = {};
      const manager = getEmailServiceWithConfigs(configs);
      expect(mockAddProvider).not.toHaveBeenCalled();
    });

    it('should not add provider when resend_api_key is empty string', () => {
      const configs: Configs = { resend_api_key: '' };
      const manager = getEmailServiceWithConfigs(configs);
      expect(mockAddProvider).not.toHaveBeenCalled();
    });

    it('should return an EmailManager instance', () => {
      const configs: Configs = {};
      const manager = getEmailServiceWithConfigs(configs);
      expect(manager).toBeDefined();
      expect(typeof manager.addProvider).toBe('function');
    });
  });

  describe('getEmailService', () => {
    it('should use provided configs without calling getAllConfigs', async () => {
      const configs: Configs = {
        resend_api_key: 're_test_key',
        resend_sender_email: 'test@scivra.com',
      };
      const manager = await getEmailService(configs);
      expect(getAllConfigs).not.toHaveBeenCalled();
      expect(manager).toBeDefined();
    });

    it('should call getAllConfigs when no configs provided', async () => {
      vi.mocked(getAllConfigs).mockResolvedValue({
        resend_api_key: 're_from_db',
        resend_sender_email: 'db@scivra.com',
      });
      const manager = await getEmailService();
      expect(getAllConfigs).toHaveBeenCalledTimes(1);
      expect(manager).toBeDefined();
    });

    it('should return EmailManager with provider when configs have resend key', async () => {
      const configs: Configs = {
        resend_api_key: 're_test',
        resend_sender_email: 'sender@scivra.com',
      };
      const manager = await getEmailService(configs);
      expect(mockAddProvider).toHaveBeenCalledTimes(1);
    });
  });
});
