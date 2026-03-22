import type { DisciplineConfig } from './types';
import { physicsConfig } from './physics';
import { chemistryConfig } from './chemistry';
import { biologyConfig } from './biology';
import { mathConfig } from './math';
import { earthScienceConfig } from './earth-science';

/** 所有学科配置注册表 */
const DISCIPLINE_REGISTRY: Record<string, DisciplineConfig> = {
  physics: physicsConfig,
  chemistry: chemistryConfig,
  biology: biologyConfig,
  math: mathConfig,
  'earth-science': earthScienceConfig,
};

/**
 * 获取学科配置，默认返回 physics
 * 未知学科回退到 physics，永远不抛异常
 */
export function getDisciplineConfig(id?: string): DisciplineConfig {
  if (!id) return DISCIPLINE_REGISTRY.physics;
  return DISCIPLINE_REGISTRY[id] ?? DISCIPLINE_REGISTRY.physics;
}

/** 获取所有已启用的学科（用于 UI 渲染） */
export function getEnabledDisciplines(): DisciplineConfig[] {
  return Object.values(DISCIPLINE_REGISTRY).filter((d) => d.enabled);
}

/** 获取所有学科（包括未启用的，用于 UI 显示 Coming Soon） */
export function getAllDisciplines(): DisciplineConfig[] {
  return Object.values(DISCIPLINE_REGISTRY);
}

/** 验证学科 ID 是否有效 */
export function isValidDiscipline(id: string): boolean {
  return id in DISCIPLINE_REGISTRY;
}

export type { DisciplineConfig } from './types';
