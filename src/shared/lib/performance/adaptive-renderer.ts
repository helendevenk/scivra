/**
 * 自适应渲染配置
 * 根据性能等级提供不同的渲染参数
 */

import type { PerformanceTier } from './performance-tier';

export interface RenderConfig {
  // Three.js 渲染器配置
  antialias: boolean;
  pixelRatio: number;
  shadowMapEnabled: boolean;
  shadowMapType: 'basic' | 'pcf' | 'pcfsoft' | 'vsm';

  // 场景复杂度
  maxParticles: number;
  geometryDetail: 'low' | 'medium' | 'high';
  textureQuality: 'low' | 'medium' | 'high';

  // 性能优化
  enablePostProcessing: boolean;
  targetFPS: number;
  enableAdaptiveDegradation: boolean; // 帧率过低时自动降级

  // 移动端特殊优化
  reducedMotion: boolean;
  batteryOptimization: boolean;
}

/**
 * 高性能配置（桌面 + 独立显卡）
 */
const HIGH_PERFORMANCE_CONFIG: RenderConfig = {
  antialias: true,
  pixelRatio: Math.min(window.devicePixelRatio || 1, 2),
  shadowMapEnabled: true,
  shadowMapType: 'pcfsoft',
  maxParticles: 10000,
  geometryDetail: 'high',
  textureQuality: 'high',
  enablePostProcessing: true,
  targetFPS: 60,
  enableAdaptiveDegradation: false,
  reducedMotion: false,
  batteryOptimization: false,
};

/**
 * 中等性能配置（笔记本 + 集成显卡 / 高端移动设备）
 */
const MEDIUM_PERFORMANCE_CONFIG: RenderConfig = {
  antialias: true,
  pixelRatio: 1,
  shadowMapEnabled: false,
  shadowMapType: 'basic',
  maxParticles: 5000,
  geometryDetail: 'medium',
  textureQuality: 'medium',
  enablePostProcessing: false,
  targetFPS: 45,
  enableAdaptiveDegradation: true,
  reducedMotion: false,
  batteryOptimization: false,
};

/**
 * 低性能配置（低端移动设备 / 老旧设备）
 */
const LOW_PERFORMANCE_CONFIG: RenderConfig = {
  antialias: false,
  pixelRatio: 1,
  shadowMapEnabled: false,
  shadowMapType: 'basic',
  maxParticles: 1000,
  geometryDetail: 'low',
  textureQuality: 'low',
  enablePostProcessing: false,
  targetFPS: 30,
  enableAdaptiveDegradation: true,
  reducedMotion: true,
  batteryOptimization: true,
};

/**
 * 根据性能等级获取渲染配置
 */
export function getRenderConfig(tier: PerformanceTier): RenderConfig {
  switch (tier) {
    case 'high':
      return { ...HIGH_PERFORMANCE_CONFIG };
    case 'medium':
      return { ...MEDIUM_PERFORMANCE_CONFIG };
    case 'low':
      return { ...LOW_PERFORMANCE_CONFIG };
    default:
      return { ...MEDIUM_PERFORMANCE_CONFIG };
  }
}

/**
 * 生成 Three.js 渲染器初始化代码
 */
export function generateRendererCode(config: RenderConfig): string {
  return `
// 创建渲染器（性能优化配置）
const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById('canvas'),
  antialias: ${config.antialias},
  alpha: true,
  powerPreference: '${config.batteryOptimization ? 'low-power' : 'high-performance'}',
});

renderer.setSize(window.innerWidth * 0.6, window.innerHeight * 0.8);
renderer.setPixelRatio(${config.pixelRatio});

${config.shadowMapEnabled ? `
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.${config.shadowMapType.toUpperCase()}ShadowMap;
` : '// 阴影已禁用以提升性能'}
`.trim();
}

/**
 * 生成几何体细节配置代码
 */
export function generateGeometryCode(config: RenderConfig, geometryType: 'sphere' | 'cylinder' | 'torus'): string {
  const detailLevels = {
    sphere: {
      high: { widthSegments: 64, heightSegments: 64 },
      medium: { widthSegments: 32, heightSegments: 32 },
      low: { widthSegments: 16, heightSegments: 16 },
    },
    cylinder: {
      high: { radialSegments: 64, heightSegments: 32 },
      medium: { radialSegments: 32, heightSegments: 16 },
      low: { radialSegments: 16, heightSegments: 8 },
    },
    torus: {
      high: { tubularSegments: 100, radialSegments: 64 },
      medium: { tubularSegments: 50, radialSegments: 32 },
      low: { tubularSegments: 25, radialSegments: 16 },
    },
  };

  const detail = detailLevels[geometryType][config.geometryDetail];

  switch (geometryType) {
    case 'sphere': {
      const sphereDetail = detail as { widthSegments: number; heightSegments: number };
      return `new THREE.SphereGeometry(radius, ${sphereDetail.widthSegments}, ${sphereDetail.heightSegments})`;
    }
    case 'cylinder': {
      const cylinderDetail = detail as { radialSegments: number; heightSegments: number };
      return `new THREE.CylinderGeometry(radiusTop, radiusBottom, height, ${cylinderDetail.radialSegments}, ${cylinderDetail.heightSegments})`;
    }
    case 'torus': {
      const torusDetail = detail as { radialSegments: number; tubularSegments: number };
      return `new THREE.TorusGeometry(radius, tube, ${torusDetail.radialSegments}, ${torusDetail.tubularSegments})`;
    }
    default:
      return `new THREE.SphereGeometry(radius, 32, 32)`;
  }
}

/**
 * 生成 FPS 监控代码（用于自适应降级）
 */
export function generateFPSMonitorCode(config: RenderConfig): string {
  if (!config.enableAdaptiveDegradation) {
    return '// 自适应降级已禁用';
  }

  return `
// FPS 监控和自适应降级
let frameCount = 0;
let lastTime = performance.now();
let currentFPS = ${config.targetFPS};
let lowFPSCount = 0;

function monitorFPS() {
  frameCount++;
  const currentTime = performance.now();
  const elapsed = currentTime - lastTime;

  if (elapsed >= 1000) {
    currentFPS = Math.round((frameCount * 1000) / elapsed);
    frameCount = 0;
    lastTime = currentTime;

    // 如果 FPS 持续低于目标的 70%，自动降级
    if (currentFPS < ${config.targetFPS} * 0.7) {
      lowFPSCount++;
      if (lowFPSCount >= 3) {
        console.warn('Low FPS detected, reducing quality...');
        // 降低粒子数量
        if (typeof particleSystem !== 'undefined' && particleSystem.geometry.attributes.position.count > 500) {
          const positions = particleSystem.geometry.attributes.position.array;
          particleSystem.geometry.setDrawRange(0, Math.floor(positions.length / 3 / 2));
        }
        lowFPSCount = 0;
      }
    } else {
      lowFPSCount = 0;
    }
  }
}
`.trim();
}
