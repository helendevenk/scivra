import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  detectDeviceType,
  detectGPU,
  detectCPU,
  detectMemory,
  detectNetwork,
  getDeviceInfo,
} from '@/shared/lib/performance/device-detector';

// ── Helpers ──

function setUserAgent(ua: string) {
  Object.defineProperty(navigator, 'userAgent', {
    value: ua,
    configurable: true,
  });
}

function setInnerWidth(width: number) {
  Object.defineProperty(window, 'innerWidth', {
    value: width,
    configurable: true,
  });
}

// ── detectDeviceType ──

describe('detectDeviceType', () => {
  const originalUA = navigator.userAgent;
  const originalWidth = window.innerWidth;

  afterEach(() => {
    Object.defineProperty(navigator, 'userAgent', {
      value: originalUA,
      configurable: true,
    });
    Object.defineProperty(window, 'innerWidth', {
      value: originalWidth,
      configurable: true,
    });
  });

  it('should return desktop for standard desktop user agent', () => {
    setUserAgent(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
    );
    expect(detectDeviceType()).toBe('desktop');
  });

  it('should return mobile for iPhone user agent', () => {
    setUserAgent(
      'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15'
    );
    setInnerWidth(375);
    expect(detectDeviceType()).toBe('mobile');
  });

  it('should return mobile for Android phone user agent', () => {
    setUserAgent(
      'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 Mobile'
    );
    setInnerWidth(412);
    expect(detectDeviceType()).toBe('mobile');
  });

  it('should return tablet for iPad user agent', () => {
    setUserAgent(
      'Mozilla/5.0 (iPad; CPU OS 16_0 like Mac OS X) AppleWebKit/605.1.15'
    );
    expect(detectDeviceType()).toBe('tablet');
  });

  it('should return tablet for mobile UA with wide screen (>= 768)', () => {
    setUserAgent(
      'Mozilla/5.0 (Linux; Android 13; SM-X200) AppleWebKit/537.36 Mobile'
    );
    setInnerWidth(800);
    expect(detectDeviceType()).toBe('tablet');
  });

  it('should return mobile for BlackBerry user agent', () => {
    setUserAgent('Mozilla/5.0 BlackBerry; Touch)');
    setInnerWidth(320);
    expect(detectDeviceType()).toBe('mobile');
  });
});

// ── detectGPU ──

describe('detectGPU', () => {
  const originalCreateElement = document.createElement.bind(document);

  afterEach(() => {
    document.createElement = originalCreateElement;
  });

  it('should return no-webgl result when canvas has no WebGL context', () => {
    document.createElement = vi.fn().mockReturnValue({
      getContext: () => null,
    }) as unknown as typeof document.createElement;

    const result = detectGPU();
    expect(result.renderer).toBe('no-webgl');
    expect(result.score).toBe(0);
    expect(result.maxTextureSize).toBe(0);
  });

  it('should score high for NVIDIA GPU', () => {
    const mockGL = {
      getExtension: () => ({
        UNMASKED_RENDERER_WEBGL: 0x9246,
        UNMASKED_VENDOR_WEBGL: 0x9245,
      }),
      getParameter: (param: number) => {
        if (param === 0x9246) return 'NVIDIA GeForce RTX 4090';
        if (param === 0x9245) return 'NVIDIA Corporation';
        if (param === 0x0d33) return 16384; // MAX_TEXTURE_SIZE
        if (param === 0x8dfa) return 4096; // MAX_VERTEX_UNIFORM_VECTORS
        if (param === 0x8dfd) return 1024; // MAX_FRAGMENT_UNIFORM_VECTORS
        return 0;
      },
      MAX_TEXTURE_SIZE: 0x0d33,
      MAX_VERTEX_UNIFORM_VECTORS: 0x8dfa,
      MAX_FRAGMENT_UNIFORM_VECTORS: 0x8dfd,
    };

    document.createElement = vi.fn().mockReturnValue({
      getContext: () => mockGL,
    }) as unknown as typeof document.createElement;

    const result = detectGPU();
    expect(result.renderer).toBe('NVIDIA GeForce RTX 4090');
    expect(result.vendor).toBe('NVIDIA Corporation');
    // base 50 + nvidia 30 + texture16384 10 = 90
    expect(result.score).toBe(90);
  });

  it('should score for AMD GPU', () => {
    const mockGL = {
      getExtension: () => ({
        UNMASKED_RENDERER_WEBGL: 0x9246,
        UNMASKED_VENDOR_WEBGL: 0x9245,
      }),
      getParameter: (param: number) => {
        if (param === 0x9246) return 'AMD Radeon RX 7900';
        if (param === 0x9245) return 'AMD';
        if (param === 0x0d33) return 8192;
        if (param === 0x8dfa) return 4096;
        if (param === 0x8dfd) return 1024;
        return 0;
      },
      MAX_TEXTURE_SIZE: 0x0d33,
      MAX_VERTEX_UNIFORM_VECTORS: 0x8dfa,
      MAX_FRAGMENT_UNIFORM_VECTORS: 0x8dfd,
    };

    document.createElement = vi.fn().mockReturnValue({
      getContext: () => mockGL,
    }) as unknown as typeof document.createElement;

    const result = detectGPU();
    // base 50 + amd 25 + texture8192 5 = 80
    expect(result.score).toBe(80);
  });

  it('should score for Intel GPU', () => {
    const mockGL = {
      getExtension: () => ({
        UNMASKED_RENDERER_WEBGL: 0x9246,
        UNMASKED_VENDOR_WEBGL: 0x9245,
      }),
      getParameter: (param: number) => {
        if (param === 0x9246) return 'Intel UHD Graphics 630';
        if (param === 0x9245) return 'Intel Inc.';
        if (param === 0x0d33) return 4096;
        if (param === 0x8dfa) return 1024;
        if (param === 0x8dfd) return 256;
        return 0;
      },
      MAX_TEXTURE_SIZE: 0x0d33,
      MAX_VERTEX_UNIFORM_VECTORS: 0x8dfa,
      MAX_FRAGMENT_UNIFORM_VECTORS: 0x8dfd,
    };

    document.createElement = vi.fn().mockReturnValue({
      getContext: () => mockGL,
    }) as unknown as typeof document.createElement;

    const result = detectGPU();
    // base 50 + intel 10 + texture4096 0 = 60
    expect(result.score).toBe(60);
  });

  it('should score for Apple GPU', () => {
    const mockGL = {
      getExtension: () => ({
        UNMASKED_RENDERER_WEBGL: 0x9246,
        UNMASKED_VENDOR_WEBGL: 0x9245,
      }),
      getParameter: (param: number) => {
        if (param === 0x9246) return 'Apple M2 Pro';
        if (param === 0x9245) return 'Apple';
        if (param === 0x0d33) return 16384;
        if (param === 0x8dfa) return 4096;
        if (param === 0x8dfd) return 1024;
        return 0;
      },
      MAX_TEXTURE_SIZE: 0x0d33,
      MAX_VERTEX_UNIFORM_VECTORS: 0x8dfa,
      MAX_FRAGMENT_UNIFORM_VECTORS: 0x8dfd,
    };

    document.createElement = vi.fn().mockReturnValue({
      getContext: () => mockGL,
    }) as unknown as typeof document.createElement;

    const result = detectGPU();
    // base 50 + apple 35 + texture16384 10 = 95
    expect(result.score).toBe(95);
  });

  it('should penalize small texture size', () => {
    const mockGL = {
      getExtension: () => null,
      getParameter: (param: number) => {
        if (param === 0x0d33) return 2048; // small texture
        if (param === 0x8dfa) return 128;
        if (param === 0x8dfd) return 64;
        return 'unknown';
      },
      MAX_TEXTURE_SIZE: 0x0d33,
      MAX_VERTEX_UNIFORM_VECTORS: 0x8dfa,
      MAX_FRAGMENT_UNIFORM_VECTORS: 0x8dfd,
    };

    document.createElement = vi.fn().mockReturnValue({
      getContext: () => mockGL,
    }) as unknown as typeof document.createElement;

    const result = detectGPU();
    // base 50 + unknown GPU 0 + small texture -10 = 40
    expect(result.score).toBe(40);
    expect(result.renderer).toBe('unknown');
  });

  it('should clamp score to 0-100 range', () => {
    // A scenario where score could theoretically go below 0 or above 100
    const mockGL = {
      getExtension: () => null,
      getParameter: (param: number) => {
        if (param === 0x0d33) return 1024; // very small
        if (param === 0x8dfa) return 64;
        if (param === 0x8dfd) return 32;
        return 'unknown';
      },
      MAX_TEXTURE_SIZE: 0x0d33,
      MAX_VERTEX_UNIFORM_VECTORS: 0x8dfa,
      MAX_FRAGMENT_UNIFORM_VECTORS: 0x8dfd,
    };

    document.createElement = vi.fn().mockReturnValue({
      getContext: () => mockGL,
    }) as unknown as typeof document.createElement;

    const result = detectGPU();
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
  });
});

// ── detectCPU ──

describe('detectCPU', () => {
  it('should return cores and a score between 0-100', () => {
    const result = detectCPU();
    expect(result.cores).toBeGreaterThanOrEqual(1);
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
  });

  it('should use hardwareConcurrency when available', () => {
    const original = navigator.hardwareConcurrency;
    Object.defineProperty(navigator, 'hardwareConcurrency', {
      value: 16,
      configurable: true,
    });

    const result = detectCPU();
    expect(result.cores).toBe(16);

    Object.defineProperty(navigator, 'hardwareConcurrency', {
      value: original,
      configurable: true,
    });
  });
});

// ── detectMemory ──

describe('detectMemory', () => {
  it('should return a number (GB)', () => {
    const result = detectMemory();
    expect(typeof result).toBe('number');
    expect(result).toBeGreaterThan(0);
  });

  it('should default to 4 when deviceMemory is not available', () => {
    // jsdom doesn't have deviceMemory, so it should fall back to 4
    const result = detectMemory();
    expect(result).toBe(4);
  });
});

// ── detectNetwork ──

describe('detectNetwork', () => {
  const originalOnLine = navigator.onLine;

  afterEach(() => {
    Object.defineProperty(navigator, 'onLine', {
      value: originalOnLine,
      configurable: true,
    });
    // Clean up connection mocks
    Object.defineProperty(navigator, 'connection', {
      value: undefined,
      configurable: true,
    });
  });

  it('should return online fast when connected without connection API', () => {
    Object.defineProperty(navigator, 'onLine', {
      value: true,
      configurable: true,
    });

    const result = detectNetwork();
    expect(result.isOnline).toBe(true);
    expect(result.connectionType).toBe('fast');
  });

  it('should return offline when navigator.onLine is false', () => {
    Object.defineProperty(navigator, 'onLine', {
      value: false,
      configurable: true,
    });

    const result = detectNetwork();
    expect(result.isOnline).toBe(false);
    expect(result.connectionType).toBe('offline');
  });

  it('should detect slow connection (2g)', () => {
    Object.defineProperty(navigator, 'onLine', {
      value: true,
      configurable: true,
    });
    Object.defineProperty(navigator, 'connection', {
      value: { effectiveType: '2g' },
      configurable: true,
    });

    const result = detectNetwork();
    expect(result.isOnline).toBe(true);
    expect(result.connectionType).toBe('slow');
  });

  it('should detect slow connection (slow-2g)', () => {
    Object.defineProperty(navigator, 'onLine', {
      value: true,
      configurable: true,
    });
    Object.defineProperty(navigator, 'connection', {
      value: { effectiveType: 'slow-2g' },
      configurable: true,
    });

    const result = detectNetwork();
    expect(result.connectionType).toBe('slow');
  });

  it('should detect fast connection (4g)', () => {
    Object.defineProperty(navigator, 'onLine', {
      value: true,
      configurable: true,
    });
    Object.defineProperty(navigator, 'connection', {
      value: { effectiveType: '4g' },
      configurable: true,
    });

    const result = detectNetwork();
    expect(result.connectionType).toBe('fast');
  });
});

// ── getDeviceInfo ──

describe('getDeviceInfo', () => {
  it('should return a complete DeviceInfo object', () => {
    const info = getDeviceInfo();
    expect(info).toHaveProperty('gpu');
    expect(info).toHaveProperty('memory');
    expect(info).toHaveProperty('cores');
    expect(info).toHaveProperty('deviceType');
    expect(info).toHaveProperty('isOnline');
    expect(info).toHaveProperty('connectionType');
    expect(info).toHaveProperty('pixelRatio');
    expect(typeof info.memory).toBe('number');
    expect(typeof info.cores).toBe('number');
    expect(typeof info.pixelRatio).toBe('number');
    expect(['mobile', 'tablet', 'desktop']).toContain(info.deviceType);
    expect(['slow', 'fast', 'offline']).toContain(info.connectionType);
  });
});
