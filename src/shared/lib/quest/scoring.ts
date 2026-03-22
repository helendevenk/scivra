/**
 * Quest Step Scoring Engine
 *
 * Handles scoring for different step types in the POE
 * (Predict-Observe-Explain) pedagogical model.
 */

interface ScoringResult {
  score: number;
  maxScore: number;
  feedback?: string;
}

interface PredictConfig {
  predictionType: 'numeric' | 'multiple_choice' | 'open_ended';
  numericTarget?: number;
  numericUnit?: string;
  numericTolerance?: number;
  options_en?: string[];
  options_zh?: string[];
  correctIndex?: number;
}

interface CompareConfig {
  showChart?: boolean;
  feedbackEn?: string;
  feedbackZh?: string;
}

interface ExplainConfig {
  explanationType: 'multiple_choice' | 'free_text';
  options_en?: string[];
  options_zh?: string[];
  correctIndex?: number;
  referenceEn?: string;
  referenceZh?: string;
}

export function scoreStep(
  stepType: string,
  configJson: string | null,
  responseType: string,
  responseValue: string | null,
  maxPoints: number
): ScoringResult {
  switch (stepType) {
    case 'knowledge':
      return scoreKnowledge(maxPoints);
    case 'predict':
      return scorePredict(configJson, responseType, responseValue, maxPoints);
    case 'experiment':
      return scoreExperiment(maxPoints);
    case 'compare':
      return scoreCompare(responseValue, maxPoints);
    case 'explain':
      return scoreExplain(configJson, responseType, responseValue, maxPoints);
    default:
      return { score: 0, maxScore: maxPoints };
  }
}

function scoreKnowledge(maxPoints: number): ScoringResult {
  // Auto-pass: full points for viewing knowledge content
  return { score: maxPoints, maxScore: maxPoints, feedback: 'Knowledge reviewed' };
}

function scorePredict(
  configJson: string | null,
  responseType: string,
  responseValue: string | null,
  maxPoints: number
): ScoringResult {
  if (!configJson || !responseValue) {
    return { score: 0, maxScore: maxPoints, feedback: 'No response provided' };
  }

  const config: PredictConfig = JSON.parse(configJson);

  switch (config.predictionType) {
    case 'numeric': {
      if (config.numericTarget === undefined) {
        return { score: maxPoints, maxScore: maxPoints };
      }
      const predicted = parseFloat(responseValue);
      if (isNaN(predicted)) {
        return { score: 0, maxScore: maxPoints, feedback: 'Invalid number' };
      }
      const tolerance = (config.numericTolerance ?? 10) / 100;
      const target = config.numericTarget;
      const deviation = Math.abs(predicted - target) / Math.abs(target || 1);

      if (deviation <= tolerance) {
        return {
          score: maxPoints,
          maxScore: maxPoints,
          feedback: 'Prediction within tolerance',
        };
      }
      // Partial credit based on how close
      const partial = Math.max(0, 1 - deviation) * maxPoints;
      return {
        score: Math.round(partial),
        maxScore: maxPoints,
        feedback: `Prediction off by ${Math.round(deviation * 100)}%`,
      };
    }

    case 'multiple_choice': {
      if (config.correctIndex === undefined) {
        return { score: maxPoints, maxScore: maxPoints };
      }
      const chosen = parseInt(responseValue, 10);
      if (chosen === config.correctIndex) {
        return { score: maxPoints, maxScore: maxPoints, feedback: 'Correct prediction' };
      }
      return { score: 0, maxScore: maxPoints, feedback: 'Incorrect prediction' };
    }

    case 'open_ended':
      // Auto-pass for MVP (teacher reviews later)
      return {
        score: maxPoints,
        maxScore: maxPoints,
        feedback: 'Prediction recorded',
      };

    default:
      return { score: 0, maxScore: maxPoints };
  }
}

function scoreExperiment(maxPoints: number): ScoringResult {
  // Auto-pass when user confirms observation
  return {
    score: maxPoints,
    maxScore: maxPoints,
    feedback: 'Observation confirmed',
  };
}

function scoreCompare(
  responseValue: string | null,
  maxPoints: number
): ScoringResult {
  if (!responseValue) {
    return {
      score: Math.round(maxPoints * 0.2),
      maxScore: maxPoints,
      feedback: 'No comparison data',
    };
  }

  // responseValue should contain deviation percentage
  // Format: JSON { predicted, observed, deviationPercent }
  try {
    const data = JSON.parse(responseValue);
    const deviation = Math.abs(data.deviationPercent ?? 100);

    let ratio: number;
    let feedback: string;

    if (deviation < 10) {
      ratio = 1.0;
      feedback = 'Excellent prediction! Within 10% of observed value.';
    } else if (deviation < 25) {
      ratio = 0.7;
      feedback = 'Good prediction. Within 25% of observed value.';
    } else if (deviation < 50) {
      ratio = 0.4;
      feedback = 'Fair prediction. Within 50% of observed value.';
    } else {
      ratio = 0.2;
      feedback = 'Prediction was far from observed value. Review the concepts.';
    }

    return {
      score: Math.round(maxPoints * ratio),
      maxScore: maxPoints,
      feedback,
    };
  } catch {
    return {
      score: Math.round(maxPoints * 0.2),
      maxScore: maxPoints,
      feedback: 'Comparison completed (participation points)',
    };
  }
}

function scoreExplain(
  configJson: string | null,
  responseType: string,
  responseValue: string | null,
  maxPoints: number
): ScoringResult {
  if (!configJson || !responseValue) {
    return { score: 0, maxScore: maxPoints, feedback: 'No explanation provided' };
  }

  const config: ExplainConfig = JSON.parse(configJson);

  switch (config.explanationType) {
    case 'multiple_choice': {
      if (config.correctIndex === undefined) {
        return { score: maxPoints, maxScore: maxPoints };
      }
      const chosen = parseInt(responseValue, 10);
      if (chosen === config.correctIndex) {
        return {
          score: maxPoints,
          maxScore: maxPoints,
          feedback: 'Correct explanation',
        };
      }
      return {
        score: 0,
        maxScore: maxPoints,
        feedback: 'Incorrect explanation',
      };
    }

    case 'free_text':
      // Auto-pass for MVP
      return {
        score: maxPoints,
        maxScore: maxPoints,
        feedback: 'Explanation recorded',
      };

    default:
      return { score: 0, maxScore: maxPoints };
  }
}
