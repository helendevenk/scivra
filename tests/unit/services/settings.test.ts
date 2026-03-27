import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock next-intl/server before imports
// Cannot use external variable in vi.mock factory (hoisted), so inline the mock function
vi.mock('next-intl/server', () => ({
  getTranslations: vi.fn().mockResolvedValue(
    (key: string) => `translated:${key}`
  ),
}));

import {
  getSettingTabs,
  getSettingGroups,
  getSettings,
  getAllSettingNames,
  publicSettingNames,
  type Setting,
  type SettingGroup,
} from '@/shared/services/settings';

describe('settings service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getSettingTabs', () => {
    it('should return all expected tabs', async () => {
      const tabs = await getSettingTabs('general');
      const tabNames = tabs.map((t) => t.name);
      expect(tabNames).toEqual([
        'general',
        'auth',
        'payment',
        'email',
        'storage',
        'ai',
        'analytics',
        'ads',
        'affiliate',
        'customer_service',
      ]);
    });

    it('should mark the active tab correctly', async () => {
      const tabs = await getSettingTabs('payment');
      const activeTabs = tabs.filter((t) => t.is_active);
      expect(activeTabs).toHaveLength(1);
      expect(activeTabs[0].name).toBe('payment');
    });

    it('should have no active tab when tab param does not match', async () => {
      const tabs = await getSettingTabs('nonexistent');
      const activeTabs = tabs.filter((t) => t.is_active);
      expect(activeTabs).toHaveLength(0);
    });

    it('should set correct URLs for each tab', async () => {
      const tabs = await getSettingTabs('general');
      for (const tab of tabs) {
        expect(tab.url).toBe(`/admin/settings/${tab.name}`);
      }
    });

    it('should use translated titles', async () => {
      const tabs = await getSettingTabs('general');
      for (const tab of tabs) {
        expect(tab.title).toContain('translated:');
      }
    });
  });

  describe('getSettingGroups', () => {
    it('should return all setting groups', async () => {
      const groups = await getSettingGroups();
      expect(groups.length).toBeGreaterThan(0);
      const groupNames = groups.map((g) => g.name);
      expect(groupNames).toContain('appinfo');
      expect(groupNames).toContain('stripe');
      expect(groupNames).toContain('resend');
      expect(groupNames).toContain('r2');
      expect(groupNames).toContain('openrouter');
    });

    it('should assign each group to a valid tab', async () => {
      const groups = await getSettingGroups();
      const validTabs = [
        'general',
        'auth',
        'payment',
        'email',
        'storage',
        'ai',
        'analytics',
        'ads',
        'affiliate',
        'customer_service',
      ];
      for (const group of groups) {
        expect(validTabs).toContain(group.tab);
      }
    });

    it('should have unique group names', async () => {
      const groups = await getSettingGroups();
      const names = groups.map((g) => g.name);
      expect(new Set(names).size).toBe(names.length);
    });
  });

  describe('getSettings', () => {
    it('should return all settings', async () => {
      const settings = await getSettings();
      expect(settings.length).toBeGreaterThan(0);
    });

    it('should have unique setting names', async () => {
      const settings = await getSettings();
      const names = settings.map((s) => s.name);
      expect(new Set(names).size).toBe(names.length);
    });

    it('should assign each setting to a valid group', async () => {
      const settings = await getSettings();
      const groups = await getSettingGroups();
      const validGroupNames = groups.map((g) => g.name);
      for (const setting of settings) {
        if (setting.group) {
          expect(validGroupNames).toContain(setting.group);
        }
      }
    });

    it('should have valid types for all settings', async () => {
      const settings = await getSettings();
      const validTypes = [
        'text',
        'textarea',
        'password',
        'email',
        'url',
        'number',
        'switch',
        'select',
        'checkbox',
        'upload_image',
      ];
      for (const setting of settings) {
        expect(validTypes).toContain(setting.type);
      }
    });

    it('should include key settings like app_name and stripe_secret_key', async () => {
      const settings = await getSettings();
      const names = settings.map((s) => s.name);
      expect(names).toContain('app_name');
      expect(names).toContain('stripe_secret_key');
      expect(names).toContain('resend_api_key');
      expect(names).toContain('openrouter_api_key');
    });
  });

  describe('getAllSettingNames', () => {
    it('should return array of all setting names', async () => {
      const names = await getAllSettingNames();
      expect(Array.isArray(names)).toBe(true);
      expect(names.length).toBeGreaterThan(0);
      expect(names).toContain('app_name');
      expect(names).toContain('app_description');
    });

    it('should match the count of getSettings', async () => {
      const names = await getAllSettingNames();
      const settings = await getSettings();
      expect(names.length).toBe(settings.length);
    });
  });

  describe('publicSettingNames', () => {
    it('should be a non-empty array of strings', () => {
      expect(Array.isArray(publicSettingNames)).toBe(true);
      expect(publicSettingNames.length).toBeGreaterThan(0);
      for (const name of publicSettingNames) {
        expect(typeof name).toBe('string');
      }
    });

    it('should contain auth and payment related settings', () => {
      expect(publicSettingNames).toContain('email_auth_enabled');
      expect(publicSettingNames).toContain('google_auth_enabled');
      expect(publicSettingNames).toContain('stripe_enabled');
    });

    it('should NOT contain secret settings', () => {
      expect(publicSettingNames).not.toContain('stripe_secret_key');
      expect(publicSettingNames).not.toContain('resend_api_key');
      expect(publicSettingNames).not.toContain('openrouter_api_key');
    });
  });
});
