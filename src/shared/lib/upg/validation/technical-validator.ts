/**
 * Technical validator — scores HTML quality independent of discipline.
 * Upgraded from quality-checker's boolean checks to a weighted scoring system.
 */

interface TechValidationDetail {
  ruleId: string;
  ruleName: string;
  score: number;
  passed: boolean;
  message: string;
}

export function runTechnicalValidation(html: string): {
  score: number;
  details: TechValidationDetail[];
} {
  const checks = [
    {
      id: 'tv-animation-loop',
      name: 'Animation Loop',
      weight: 15,
      test: () => /setAnimationLoop|requestAnimationFrame/.test(html),
    },
    {
      id: 'tv-resize-handler',
      name: 'Responsive Resize',
      weight: 10,
      test: () => /window.*resize|addEventListener.*resize/.test(html),
    },
    {
      id: 'tv-error-handling',
      name: 'Error Handling',
      weight: 10,
      test: () => /try\s*\{/.test(html),
    },
    {
      id: 'tv-lighting',
      name: 'Adequate Lighting',
      weight: 10,
      test: () =>
        /AmbientLight|DirectionalLight|PointLight|SpotLight|HemisphereLight/.test(html),
    },
    {
      id: 'tv-orbit-controls',
      name: 'OrbitControls from CDN',
      weight: 15,
      test: () =>
        /OrbitControls/.test(html) && !/class\s+OrbitControls/.test(html),
    },
    {
      id: 'tv-sliders',
      name: 'Interactive Sliders',
      weight: 10,
      test: () =>
        (html.match(/<input[^>]+type=["']range["']/gi) || []).length >= 1,
    },
    {
      id: 'tv-katex',
      name: 'KaTeX Formulas',
      weight: 10,
      test: () => /katex|\\frac|\\vec/.test(html),
    },
    {
      id: 'tv-quiz',
      name: 'Quiz Component',
      weight: 5,
      test: () => /quiz|question|answer/i.test(html),
    },
    {
      id: 'tv-pixel-ratio',
      name: 'Pixel Ratio Handling',
      weight: 5,
      test: () => /setPixelRatio/.test(html),
    },
    {
      id: 'tv-no-blacklist',
      name: 'No Blacklisted Code',
      weight: 10,
      test: () =>
        !/\beval\s*\(|\bnew\s+Function\s*\(|document\.cookie/.test(html),
    },
  ];

  let totalWeight = 0;
  let earnedWeight = 0;
  const details: TechValidationDetail[] = checks.map((c) => {
    const passed = c.test();
    totalWeight += c.weight;
    if (passed) earnedWeight += c.weight;
    return {
      ruleId: c.id,
      ruleName: c.name,
      score: passed ? 100 : 0,
      passed,
      message: passed ? 'OK' : `Missing: ${c.name}`,
    };
  });

  return {
    score: Math.round((earnedWeight / totalWeight) * 100),
    details,
  };
}
