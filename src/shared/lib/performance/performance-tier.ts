/**
 * 性能分级系统
 * 根据设备信息判断性能等级
 */

import { getDeviceInfo, detectGPU, detectCPU, detectMemory } from './device-detector';

export type PerformanceTier = 'high' | 'medium' | 'low';

export interface PerformanceProfile {
  tier: PerformanceTier;
  gpuScore: number;
  cpuScore: number;
  memory: number;
  deviceType: 'mobile' | 'tablet' | 'desktop';
  reason: string;
}

/**
 * 计算设备性能等级
 */
export function calculatePerformanceTier(): PerformanceProfile {
  const deviceInfo = getDeviceInfo();
  const gpuInfo = detectGPU();
  const cpuInfo = detectCPU();
  const memory = detectMemory();

  const gpuScore = gpuInfo.score;
  const cpuScore = cpuInfo.score;

  // 综合评分
  const totalScore = (gpuScore * 0.5) + (cpuScore * 0.3) + (memory / 16 * 100 * 0.2);

  let tier: PerformanceTier;
  let reason: string;

  // 移动设备特殊处理
  if (deviceInfo.deviceType === 'mobile') {
    if (memory >= 6 && gpuScore >= 60) {
      tier = 'medium';
      reason = 'High-end mobile device';
    } else if (memory >= 4 && gpuScore >= 40) {
      tier = 'low';
      reason = 'Mid-range mobile device';
    } else {
      tier = 'low';
      reason = 'Low-end mobile device';
    }
  }
  // 平板设备
  else if (deviceInfo.deviceType === 'tablet') {
    if (memory >= 8 && gpuScore >= 70) {
      tier = 'high';
      reason = 'High-end tablet';
    } else if (memory >= 4 && gpuScore >= 50) {
      tier = 'medium';
      reason = 'Mid-range tablet';
    } else {
      tier = 'low';
      reason = 'Low-end tablet';
    }
  }
  // 桌面设备
  else {
    if (totalScore >= 75) {
      tier = 'high';
      reason = 'Desktop with dedicated GPU';
    } else if (totalScore >= 50) {
      tier = 'medium';
      reason = 'Desktop with integrated GPU';
    } else {
      tier = 'low';
      reason = 'Low-end desktop or old hardware';
    }
  }

  return {
    tier,
    gpuScore,
    cpuScore,
    memory,
    deviceType: deviceInfo.deviceType,
    reason,
  };
}

/**
 * 从 localStorage 获取用户手动设置的性能模式
 */
export function getUserPreferredTier(): PerformanceTier | null {
  if (typeof window === 'undefined') return null;

  try {
    const saved = localStorage.getItem('upg_performance_tier');
    if (saved && ['high', 'medium', 'low'].includes(saved)) {
      return saved as PerformanceTier;
    }
  } catch (e) {
    // localStorage 不可用
  }

  return null;
}

/**
 * 保存用户手动设置的性能模式
 */
export function saveUserPreferredTier(tier: PerformanceTier | 'auto'): void {
  if (typeof window === 'undefined') return;

  try {
    if (tier === 'auto') {
      localStorage.removeItem('upg_performance_tier');
    } else {
      localStorage.setItem('upg_performance_tier', tier);
    }
  } catch (e) {
    // localStorage 不可用
  }
}

/**
 * 获取最终性能等级（优先用户设置，否则自动检测）
 */
export function getPerformanceTier(): PerformanceTier {
  const userPreferred = getUserPreferredTier();
  if (userPreferred) {
    return userPreferred;
  }

  const profile = calculatePerformanceTier();
  return profile.tier;
}
