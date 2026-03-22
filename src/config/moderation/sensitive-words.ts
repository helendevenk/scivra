/**
 * Sensitive Words Configuration
 *
 * 敏感词库配置文件
 *
 * 分类：
 * - political: 政治敏感词
 * - violence: 暴力相关
 * - adult: 色情内容
 * - illegal: 违法犯罪
 * - spam: 垃圾信息
 */

export interface SensitiveWordCategory {
  name: string;
  severity: 'high' | 'medium' | 'low'; // high: 直接拒绝, medium: 标记待审, low: 记录但通过
  keywords: string[];
}

/**
 * 敏感词库
 *
 * 注意：
 * 1. 这是基础词库，实际部署时应该从配置文件或数据库加载
 * 2. 支持中英文混合
 * 3. 支持正则表达式匹配（未来扩展）
 */
export const SENSITIVE_WORD_CATEGORIES: SensitiveWordCategory[] = [
  {
    name: 'political',
    severity: 'high',
    keywords: [
      // 政治敏感词（示例，实际部署时需要更完整的词库）
      '政治敏感词示例1',
      '政治敏感词示例2',
      // 注意：这里只是占位符，实际部署时需要替换为真实词库
    ],
  },
  {
    name: 'violence',
    severity: 'high',
    keywords: [
      '暴力',
      '杀人',
      '自杀',
      '恐怖主义',
      'terrorism',
      'violence',
      'murder',
      'suicide',
      '爆炸',
      'bomb',
      '武器',
      'weapon',
    ],
  },
  {
    name: 'adult',
    severity: 'high',
    keywords: [
      '色情',
      '裸体',
      'porn',
      'nude',
      'sex',
      '性交',
      '成人内容',
      'adult content',
    ],
  },
  {
    name: 'illegal',
    severity: 'high',
    keywords: [
      '毒品',
      '赌博',
      'drug',
      'gambling',
      '洗钱',
      'money laundering',
      '诈骗',
      'fraud',
      '黑客',
      'hacking',
    ],
  },
  {
    name: 'spam',
    severity: 'low',
    keywords: [
      // 垃圾信息关键词（低优先级，教育平台特性）
      '点击这里',
      'click here',
      '立即购买',
      'buy now',
      '限时优惠',
      'limited offer',
    ],
  },
];

/**
 * 获取所有高严重性敏感词
 */
export function getHighSeverityKeywords(): string[] {
  return SENSITIVE_WORD_CATEGORIES
    .filter(cat => cat.severity === 'high')
    .flatMap(cat => cat.keywords);
}

/**
 * 获取所有敏感词（扁平化）
 */
export function getAllKeywords(): string[] {
  return SENSITIVE_WORD_CATEGORIES.flatMap(cat => cat.keywords);
}

/**
 * 根据类别获取敏感词
 */
export function getKeywordsByCategory(categoryName: string): string[] {
  const category = SENSITIVE_WORD_CATEGORIES.find(cat => cat.name === categoryName);
  return category?.keywords ?? [];
}

/**
 * 获取敏感词的严重性级别
 */
export function getKeywordSeverity(keyword: string): 'high' | 'medium' | 'low' | null {
  for (const category of SENSITIVE_WORD_CATEGORIES) {
    if (category.keywords.includes(keyword)) {
      return category.severity;
    }
  }
  return null;
}
