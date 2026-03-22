import { getDisciplineConfig } from '../disciplines';
import { runTechnicalValidation } from './technical-validator';

export interface FullValidationResult {
  technicalScore: number; // 0-100
  disciplineScore: number; // 0-100
  overallScore: number; // weighted average
  verified: boolean; // overallScore >= threshold
  details: Array<{
    ruleId: string;
    ruleName: string;
    score: number;
    passed: boolean;
    message: string;
  }>;
}

/**
 * Run full validation (technical + discipline-specific).
 * Does NOT block generation — results stored as metadata.
 * Synchronous: all S1 validation rules are regex-based.
 */
export function runFullValidation(
  html: string,
  discipline: string
): FullValidationResult {
  const config = getDisciplineConfig(discipline);

  // Technical validation (universal)
  const techResult = runTechnicalValidation(html);

  // Discipline validation (from config.validationRules)
  const discResults = config.validationRules.map((rule) => {
    const result = rule.validate(html);
    return {
      ruleId: rule.id,
      ruleName: rule.name,
      score: result.score,
      passed: result.passed,
      message: result.details,
    };
  });

  const techScore = techResult.score;
  const discScore =
    discResults.length > 0
      ? discResults.reduce((sum, r) => sum + r.score, 0) / discResults.length
      : 100; // No discipline rules = full score

  // CTO: weight technical higher (more mature), discipline is regex approximation in S1
  const overallScore = Math.round(techScore * 0.6 + discScore * 0.4);

  return {
    technicalScore: techScore,
    disciplineScore: discScore,
    overallScore,
    verified: overallScore >= config.validationThreshold,
    details: [...techResult.details, ...discResults],
  };
}
