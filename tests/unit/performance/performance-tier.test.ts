import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// ── Mock device-detector ──
const mockGetDeviceInfo = vi.fn();
const mockDetectGPU = vi.fn();
const mockDetectCPU = vi.fn();
const mockDetectMemory = vi.fn();

vi.mock('@/shared/lib/performance/device-detector', () => ({
  getDeviceInfo: (...args: unknown[]) => mockGetDeviceInfo(...args),
  detectGPU: (...args: unknown[]) => mockDetectGPU(...args),
  detectCPU: (...args: unknown[]) => mockDetectCPU(...args),
  detectMemory: (...args: unknown[]) => mockDetectMemory(...args),
}));

import {
  calculatePerformanceTier,
  getUserPreferredTier,
  saveUserPreferredTier,
  getPerformanceTier,
} from '@/shared/lib/performance/performance-tier';

// ── localStorage mock ──

function createLocalStorageMock() {
  const store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => { store[key] = value; }),
    removeItem: vi.fn((key: string) => { delete store[key]; }),
    clear: vi.fn(() => { Object.keys(store).forEach(k => delete store[k]); }),
    get length() { return Object.keys(store).length; },
    key: vi.fn((i: number) => Object.keys(store)[i] ?? null),
    _store: store,
  };
}

// ── Helpers ──

function setupDeviceMocks(overrides: {
  deviceType?: 'mobile' | 'tablet' | 'desktop';
  gpuScore?: number;
  cpuScore?: number;
  memory?: number;
}) {
  const deviceType = overrides.deviceType ?? 'desktop';
  const gpuScore = overrides.gpuScore ?? 70;
  const cpuScore = overrides.cpuScore ?? 60;
  const memory = overrides.memory ?? 8;

  mockGetDeviceInfo.mockReturnValue({
    gpu: 'test-gpu',
    memory,
    cores: 8,
    deviceType,
    isOnline: true,
    connectionType: 'fast',
    pixelRatio: 1,
  });
  mockDetectGPU.mockReturnValue({
    renderer: 'test-gpu',
    vendor: 'test',
    maxTextureSize: 8192,
    maxVertexUniforms: 1024,
    maxFragmentUniforms: 256,
    score: gpuScore,
  });
  mockDetectCPU.mockReturnValue({ cores: 8, score: cpuScore });
  mockDetectMemory.mockReturnValue(memory);
}

// ── calculatePerformanceTier ──

describe('calculatePerformanceTier', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Desktop tests
  describe('desktop', () => {
    it('should return high tier for high-performance desktop', () => {
      // totalScore = 90*0.5 + 80*0.3 + (16/16*100)*0.2 = 45+24+20 = 89
      setupDeviceMocks({ deviceType: 'desktop', gpuScore: 90, cpuScore: 80, memory: 16 });
      const result = calculatePerformanceTier();
      expect(result.tier).toBe('high');
      expect(result.reason).toBe('Desktop with dedicated GPU');
      expect(result.deviceType).toBe('desktop');
    });

    it('should return medium tier for mid-range desktop', () => {
      // totalScore = 60*0.5 + 50*0.3 + (8/16*100)*0.2 = 30+15+10 = 55
      setupDeviceMocks({ deviceType: 'desktop', gpuScore: 60, cpuScore: 50, memory: 8 });
      const result = calculatePerformanceTier();
      expect(result.tier).toBe('medium');
      expect(result.reason).toBe('Desktop with integrated GPU');
    });

    it('should return low tier for low-end desktop', () => {
      // totalScore = 20*0.5 + 20*0.3 + (2/16*100)*0.2 = 10+6+2.5 = 18.5
      setupDeviceMocks({ deviceType: 'desktop', gpuScore: 20, cpuScore: 20, memory: 2 });
      const result = calculatePerformanceTier();
      expect(result.tier).toBe('low');
      expect(result.reason).toBe('Low-end desktop or old hardware');
    });

    it('should return medium at totalScore boundary (50)', () => {
      // Need totalScore exactly 50: gpuScore*0.5 + cpuScore*0.3 + (mem/16*100)*0.2 = 50
      // 60*0.5 + 40*0.3 + (4/16*100)*0.2 = 30+12+5 = 47 → low
      // 60*0.5 + 50*0.3 + (4/16*100)*0.2 = 30+15+5 = 50 → medium
      setupDeviceMocks({ deviceType: 'desktop', gpuScore: 60, cpuScore: 50, memory: 4 });
      const result = calculatePerformanceTier();
      expect(result.tier).toBe('medium');
    });

    it('should return high at totalScore boundary (75)', () => {
      // 80*0.5 + 70*0.3 + (8/16*100)*0.2 = 40+21+10 = 71 → medium
      // 90*0.5 + 70*0.3 + (8/16*100)*0.2 = 45+21+10 = 76 → high
      setupDeviceMocks({ deviceType: 'desktop', gpuScore: 90, cpuScore: 70, memory: 8 });
      const result = calculatePerformanceTier();
      expect(result.tier).toBe('high');
    });
  });

  // Mobile tests
  describe('mobile', () => {
    it('should return medium for high-end mobile (memory>=6, gpuScore>=60)', () => {
      setupDeviceMocks({ deviceType: 'mobile', gpuScore: 70, memory: 8 });
      const result = calculatePerformanceTier();
      expect(result.tier).toBe('medium');
      expect(result.reason).toBe('High-end mobile device');
    });

    it('should return low for mid-range mobile (memory>=4, gpuScore>=40)', () => {
      setupDeviceMocks({ deviceType: 'mobile', gpuScore: 45, memory: 4 });
      const result = calculatePerformanceTier();
      expect(result.tier).toBe('low');
      expect(result.reason).toBe('Mid-range mobile device');
    });

    it('should return low for low-end mobile', () => {
      setupDeviceMocks({ deviceType: 'mobile', gpuScore: 20, memory: 2 });
      const result = calculatePerformanceTier();
      expect(result.tier).toBe('low');
      expect(result.reason).toBe('Low-end mobile device');
    });

    it('should never return high for mobile (even with top specs)', () => {
      setupDeviceMocks({ deviceType: 'mobile', gpuScore: 100, cpuScore: 100, memory: 16 });
      const result = calculatePerformanceTier();
      expect(result.tier).not.toBe('high');
    });
  });

  // Tablet tests
  describe('tablet', () => {
    it('should return high for high-end tablet (memory>=8, gpuScore>=70)', () => {
      setupDeviceMocks({ deviceType: 'tablet', gpuScore: 80, memory: 8 });
      const result = calculatePerformanceTier();
      expect(result.tier).toBe('high');
      expect(result.reason).toBe('High-end tablet');
    });

    it('should return medium for mid-range tablet (memory>=4, gpuScore>=50)', () => {
      setupDeviceMocks({ deviceType: 'tablet', gpuScore: 55, memory: 4 });
      const result = calculatePerformanceTier();
      expect(result.tier).toBe('medium');
      expect(result.reason).toBe('Mid-range tablet');
    });

    it('should return low for low-end tablet', () => {
      setupDeviceMocks({ deviceType: 'tablet', gpuScore: 30, memory: 2 });
      const result = calculatePerformanceTier();
      expect(result.tier).toBe('low');
      expect(result.reason).toBe('Low-end tablet');
    });
  });

  // Return shape
  it('should return gpuScore, cpuScore, memory, deviceType in profile', () => {
    setupDeviceMocks({ deviceType: 'desktop', gpuScore: 70, cpuScore: 60, memory: 8 });
    const result = calculatePerformanceTier();
    expect(result.gpuScore).toBe(70);
    expect(result.cpuScore).toBe(60);
    expect(result.memory).toBe(8);
    expect(result.deviceType).toBe('desktop');
  });
});

// ── getUserPreferredTier ──

describe('getUserPreferredTier', () => {
  let mockLS: ReturnType<typeof createLocalStorageMock>;

  beforeEach(() => {
    mockLS = createLocalStorageMock();
    Object.defineProperty(window, 'localStorage', { value: mockLS, configurable: true });
  });

  it('should return null when nothing is saved', () => {
    expect(getUserPreferredTier()).toBeNull();
  });

  it('should return saved tier value', () => {
    mockLS._store['upg_performance_tier'] = 'high';
    expect(getUserPreferredTier()).toBe('high');
  });

  it('should return null for invalid saved value', () => {
    mockLS._store['upg_performance_tier'] = 'ultra';
    expect(getUserPreferredTier()).toBeNull();
  });

  it('should return each valid tier', () => {
    for (const tier of ['high', 'medium', 'low'] as const) {
      mockLS._store['upg_performance_tier'] = tier;
      expect(getUserPreferredTier()).toBe(tier);
    }
  });
});

// ── saveUserPreferredTier ──

describe('saveUserPreferredTier', () => {
  let mockLS: ReturnType<typeof createLocalStorageMock>;

  beforeEach(() => {
    mockLS = createLocalStorageMock();
    Object.defineProperty(window, 'localStorage', { value: mockLS, configurable: true });
  });

  it('should save tier to localStorage', () => {
    saveUserPreferredTier('low');
    expect(mockLS.setItem).toHaveBeenCalledWith('upg_performance_tier', 'low');
  });

  it('should remove key when set to auto', () => {
    saveUserPreferredTier('auto');
    expect(mockLS.removeItem).toHaveBeenCalledWith('upg_performance_tier');
  });

  it('should overwrite previous value', () => {
    saveUserPreferredTier('high');
    saveUserPreferredTier('low');
    expect(mockLS.setItem).toHaveBeenLastCalledWith('upg_performance_tier', 'low');
  });
});

// ── getPerformanceTier ──

describe('getPerformanceTier', () => {
  let mockLS: ReturnType<typeof createLocalStorageMock>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockLS = createLocalStorageMock();
    Object.defineProperty(window, 'localStorage', { value: mockLS, configurable: true });
  });

  it('should return user preferred tier when set', () => {
    mockLS._store['upg_performance_tier'] = 'low';
    const result = getPerformanceTier();
    expect(result).toBe('low');
    // Should not call detection functions
    expect(mockGetDeviceInfo).not.toHaveBeenCalled();
  });

  it('should fall back to auto-detection when no preference', () => {
    setupDeviceMocks({ deviceType: 'desktop', gpuScore: 90, cpuScore: 80, memory: 16 });
    const result = getPerformanceTier();
    expect(result).toBe('high');
    expect(mockGetDeviceInfo).toHaveBeenCalled();
  });
});
