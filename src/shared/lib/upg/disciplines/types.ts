// ============================================================
// DisciplineConfig — 学科可插拔配置接口
// ============================================================

/** CDN 库定义 */
export interface CdnLib {
  name: string;
  url: string;
  /** 是否可选（optional=true 时生成的 HTML 可以不引用） */
  optional: boolean;
  /** 全局变量名，用于质量检查验证 */
  globalName?: string;
}

/** 学科质量检查规则 */
export interface DisciplineQualityRule {
  id: string;
  description: string;
  /** 'error' 阻断生成, 'warning' 仅标记 */
  severity: 'error' | 'warning';
  /** 检查函数 */
  check: (html: string) => { passed: boolean; message?: string };
}

/** 物理准确性验证规则（Phase 3.5 使用） */
export interface ValidationRule {
  id: string;
  name: string;
  description: string;
  /** 检查函数，同步返回 0-100 分 */
  validate: (html: string) => ValidationResult;
}

export interface ValidationResult {
  score: number; // 0-100
  passed: boolean; // score >= threshold
  details: string; // 人类可读的验证说明
}

/** 课标对齐 */
export interface CurriculumAlignment {
  standard: string; // 'AP_PHYSICS_1' | 'NGSS' | 'IB' | ...
  topics: string[];
}

/** 学科配置主接口 */
export interface DisciplineConfig {
  /** 唯一标识，对应 DB category 字段 */
  id: string;
  /** 显示名 */
  name: { en: string; zh: string };
  /** Lucide icon name */
  icon: string;
  /** 主题色 oklch 值 */
  themeColor: string;
  /** CSS 渐变（UI 卡片头部等） */
  cssGradient: string;

  // === Prompt 层 ===
  /** 学科专属 system prompt 片段，注入到基础 prompt 之后 */
  systemPromptModule: string;
  /** 可视化模式建议（3D/SVG/Hybrid） */
  visualizationHints: string;
  /** 解析解参考 */
  analyticalSolutions: string;
  /** 常见主题列表 */
  commonTopics: Array<{
    en: string;
    zh: string;
    complexity: 'low' | 'medium' | 'high';
  }>;

  // === 验证层 ===
  /** 学科特有质量检查规则（叠加到通用规则之上） */
  qualityRules: DisciplineQualityRule[];
  /** 物理准确性验证规则（Phase 3.5） */
  validationRules: ValidationRule[];
  /** 验证通过阈值（0-100，默认 60） */
  validationThreshold: number;

  // === CDN 层 ===
  /** 学科需要的额外 CDN 库 */
  additionalCdnLibs: CdnLib[];

  // === 课标层 ===
  curriculumStandards: CurriculumAlignment[];

  // === 状态 ===
  /** 是否已启用（S1 只有 physics 为 true） */
  enabled: boolean;
  /** 上线阶段 */
  stage: 'S1' | 'S2' | 'S3';
}
