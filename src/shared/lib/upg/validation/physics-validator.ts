import type { ValidationRule } from '../disciplines/types';

/**
 * Physics-specific validation rules.
 * These are plugged into physicsConfig.validationRules in Phase 3.5.
 */
export const physicsValidationRules: ValidationRule[] = [
  {
    id: 'pv-energy-conservation',
    name: 'Energy Conservation',
    description:
      "Check if total energy calculation exists and doesn't drift",
    validate: (html) => {
      const hasEnergy =
        /totalEnergy|kineticEnergy|potentialEnergy|energy/i.test(html);
      const hasConservationCheck =
        /total.*=.*kinetic.*\+.*potential|E\s*=\s*KE\s*\+\s*PE/i.test(html);

      if (!hasEnergy) {
        return {
          score: 50,
          passed: true,
          details: 'No energy system detected (neutral)',
        };
      }
      if (hasConservationCheck) {
        return {
          score: 100,
          passed: true,
          details: 'Energy conservation check present',
        };
      }
      return {
        score: 30,
        passed: false,
        details: 'Energy variables exist but no conservation check',
      };
    },
  },
  {
    id: 'pv-physical-constants',
    name: 'Physical Constants',
    description: 'Verify physical constants are reasonable',
    validate: (html) => {
      const gMatch = html.match(
        /(?:const|let|var)\s+g\s*=\s*([\d.]+)/
      );
      if (gMatch) {
        const g = parseFloat(gMatch[1]);
        if (g >= 9.7 && g <= 9.9) {
          return { score: 100, passed: true, details: `g=${g} (correct)` };
        }
        if (g === 10) {
          return {
            score: 80,
            passed: true,
            details: `g=${g} (approximate, acceptable)`,
          };
        }
        return {
          score: 20,
          passed: false,
          details: `g=${g} (suspicious value)`,
        };
      }
      return {
        score: 70,
        passed: true,
        details: 'No gravity constant detected (may not be needed)',
      };
    },
  },
  {
    id: 'pv-analytical-overlay',
    name: 'Analytical Solution Overlay',
    description:
      'Check if analytical/theoretical solution is displayed alongside numerical',
    validate: (html) => {
      const hasAnalytical =
        /analytical|theoretical|exact.solution|closed.form/i.test(html);
      const hasComparison =
        /numerical.*analytical|simulation.*theory/i.test(html);

      if (hasComparison) {
        return {
          score: 100,
          passed: true,
          details: 'Analytical-numerical comparison present',
        };
      }
      if (hasAnalytical) {
        return {
          score: 70,
          passed: true,
          details:
            'Analytical reference mentioned but comparison unclear',
        };
      }
      return {
        score: 40,
        passed: false,
        details: 'No analytical solution overlay detected',
      };
    },
  },
  {
    id: 'pv-nan-protection',
    name: 'NaN/Infinity Protection',
    description: 'Check for numerical stability safeguards',
    validate: (html) => {
      const hasNanCheck = /isNaN|isFinite|Number\.isFinite/.test(html);
      const hasDtCap =
        /Math\.min.*dt|dt.*Math\.min|deltaTime.*cap|dt\s*>\s*[\d.]+/.test(
          html
        );

      const score = (hasNanCheck ? 50 : 0) + (hasDtCap ? 50 : 0);
      return {
        score: Math.max(score, 30),
        passed: score >= 50,
        details: `NaN check: ${hasNanCheck ? '✓' : '✗'}, dt cap: ${hasDtCap ? '✓' : '✗'}`,
      };
    },
  },
  {
    id: 'pv-unit-labels',
    name: 'SI Unit Labels',
    description: 'Verify SI units are displayed in the interface',
    validate: (html) => {
      const unitPatterns = [
        /\bm\/s\b/,
        /\bkg\b/,
        /\bN\b/,
        /\bJ\b/,
        /\brad\/s\b/,
        /\bHz\b/,
        /\bPa\b/,
        /\bW\b/,
        /\bC\b/,
        /\bV\b/,
        /\bA\b/,
      ];
      const found = unitPatterns.filter((p) => p.test(html)).length;
      const score = Math.min(found * 20, 100);

      return {
        score: Math.max(score, 30),
        passed: found >= 2,
        details: `${found} SI unit types detected`,
      };
    },
  },
];
