import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock external dependencies before imports
vi.mock('@/shared/models/config', () => ({
  getAllConfigs: vi.fn().mockResolvedValue({}),
}));

vi.mock('@/extensions/ai', () => {
  class MockAIManager {
    providers: any[] = [];
    addProvider(provider: any, isDefault = false) {
      this.providers.push(provider);
    }
    getProviders() {
      return this.providers;
    }
  }
  return {
    AIManager: MockAIManager,
  };
});

import {
  getAIManagerWithConfigs,
  getAIService,
} from '@/shared/services/ai';
import { getAllConfigs } from '@/shared/models/config';
import type { Configs } from '@/shared/models/config';

describe('ai service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAIManagerWithConfigs', () => {
    it('should return an AIManager instance', () => {
      const configs: Configs = {};
      const manager = getAIManagerWithConfigs(configs);
      expect(manager).toBeDefined();
      expect(typeof manager.addProvider).toBe('function');
    });

    it('should return a new AIManager regardless of configs', () => {
      const configs: Configs = {
        openrouter_api_key: 'sk-or-test',
        replicate_api_token: 'r8_test',
      };
      const manager = getAIManagerWithConfigs(configs);
      expect(manager).toBeDefined();
    });

    it('should return different instances on each call', () => {
      const configs: Configs = {};
      const manager1 = getAIManagerWithConfigs(configs);
      const manager2 = getAIManagerWithConfigs(configs);
      expect(manager1).not.toBe(manager2);
    });
  });

  describe('getAIService', () => {
    it('should use provided configs without calling getAllConfigs', async () => {
      const configs: Configs = { openrouter_api_key: 'sk-or-test' };
      const manager = await getAIService(configs);
      expect(getAllConfigs).not.toHaveBeenCalled();
      expect(manager).toBeDefined();
    });

    it('should call getAllConfigs when no configs provided', async () => {
      vi.mocked(getAllConfigs).mockResolvedValue({});
      const manager = await getAIService();
      expect(getAllConfigs).toHaveBeenCalledTimes(1);
      expect(manager).toBeDefined();
    });

    it('should return AIManager instance', async () => {
      const manager = await getAIService({});
      expect(manager).toBeDefined();
      expect(typeof manager.addProvider).toBe('function');
    });
  });
});
