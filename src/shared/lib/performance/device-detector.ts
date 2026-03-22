/**
 * 设备性能检测模块
 * 检测 GPU、CPU、内存、设备类型和网络状态
 */

export interface DeviceInfo {
  gpu: string;
  memory: number; // GB
  cores: number;
  deviceType: 'mobile' | 'tablet' | 'desktop';
  isOnline: boolean;
  connectionType: 'slow' | 'fast' | 'offline';
  pixelRatio: number;
}

export interface GPUBenchmarkResult {
  renderer: string;
  vendor: string;
  maxTextureSize: number;
  maxVertexUniforms: number;
  maxFragmentUniforms: number;
  score: number; // 0-100
}

/**
 * 检测设备类型
 */
export function detectDeviceType(): 'mobile' | 'tablet' | 'desktop' {
  if (typeof window === 'undefined') return 'desktop';

  const ua = navigator.userAgent.toLowerCase();
  const isMobile = /mobile|android|iphone|ipod|blackberry|iemobile|opera mini/i.test(ua);
  const isTablet = /tablet|ipad|playbook|silk/i.test(ua) ||
                   (isMobile && window.innerWidth >= 768);

  if (isTablet) return 'tablet';
  if (isMobile) return 'mobile';
  return 'desktop';
}

/**
 * 检测 GPU 性能
 */
export function detectGPU(): GPUBenchmarkResult {
  if (typeof window === 'undefined') {
    return {
      renderer: 'unknown',
      vendor: 'unknown',
      maxTextureSize: 0,
      maxVertexUniforms: 0,
      maxFragmentUniforms: 0,
      score: 50, // 默认中等性能
    };
  }

  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl') as WebGLRenderingContext | null;

  if (!gl) {
    return {
      renderer: 'no-webgl',
      vendor: 'unknown',
      maxTextureSize: 0,
      maxVertexUniforms: 0,
      maxFragmentUniforms: 0,
      score: 0,
    };
  }

  // 获取 GPU 信息
  const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
  const renderer = debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : 'unknown';
  const vendor = debugInfo ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) : 'unknown';

  // 获取 GPU 能力参数
  const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
  const maxVertexUniforms = gl.getParameter(gl.MAX_VERTEX_UNIFORM_VECTORS);
  const maxFragmentUniforms = gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_VECTORS);

  // 计算 GPU 性能分数 (0-100)
  let score = 50; // 基础分

  // 根据 GPU 型号调整分数
  const rendererLower = renderer.toLowerCase();
  if (rendererLower.includes('nvidia') || rendererLower.includes('geforce')) {
    score += 30;
  } else if (rendererLower.includes('amd') || rendererLower.includes('radeon')) {
    score += 25;
  } else if (rendererLower.includes('intel')) {
    score += 10;
  } else if (rendererLower.includes('apple') || rendererLower.includes('m1') || rendererLower.includes('m2')) {
    score += 35;
  }

  // 根据纹理大小调整分数
  if (maxTextureSize >= 16384) {
    score += 10;
  } else if (maxTextureSize >= 8192) {
    score += 5;
  } else if (maxTextureSize < 4096) {
    score -= 10;
  }

  // 限制分数范围
  score = Math.max(0, Math.min(100, score));

  return {
    renderer,
    vendor,
    maxTextureSize,
    maxVertexUniforms,
    maxFragmentUniforms,
    score,
  };
}

/**
 * 检测 CPU 性能（简单基准测试）
 */
export function detectCPU(): { cores: number; score: number } {
  if (typeof window === 'undefined') {
    return { cores: 4, score: 50 };
  }

  const cores = navigator.hardwareConcurrency || 2;

  // 简单的 CPU 基准测试（计算密集型任务）
  const startTime = performance.now();
  let sum = 0;
  for (let i = 0; i < 1000000; i++) {
    sum += Math.sqrt(i);
  }
  const endTime = performance.now();
  const duration = endTime - startTime;

  // 根据执行时间计算分数（越快分数越高）
  // 假设 10ms 为高性能，50ms 为低性能
  let score = 100 - (duration / 50) * 100;
  score = Math.max(0, Math.min(100, score));

  return { cores, score };
}

/**
 * 检测设备内存
 */
export function detectMemory(): number {
  if (typeof window === 'undefined') return 4;

  // @ts-ignore - deviceMemory 是实验性 API
  const memory = navigator.deviceMemory || 4; // GB
  return memory;
}

/**
 * 检测网络状态
 */
export function detectNetwork(): { isOnline: boolean; connectionType: 'slow' | 'fast' | 'offline' } {
  if (typeof window === 'undefined') {
    return { isOnline: true, connectionType: 'fast' };
  }

  const isOnline = navigator.onLine;

  if (!isOnline) {
    return { isOnline: false, connectionType: 'offline' };
  }

  // @ts-ignore - connection 是实验性 API
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;

  if (!connection) {
    return { isOnline: true, connectionType: 'fast' };
  }

  const effectiveType = connection.effectiveType;
  const connectionType = (effectiveType === 'slow-2g' || effectiveType === '2g') ? 'slow' : 'fast';

  return { isOnline, connectionType };
}

/**
 * 获取完整设备信息
 */
export function getDeviceInfo(): DeviceInfo {
  const deviceType = detectDeviceType();
  const memory = detectMemory();
  const { cores } = detectCPU();
  const { isOnline, connectionType } = detectNetwork();
  const { renderer } = detectGPU();
  const pixelRatio = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;

  return {
    gpu: renderer,
    memory,
    cores,
    deviceType,
    isOnline,
    connectionType,
    pixelRatio,
  };
}
