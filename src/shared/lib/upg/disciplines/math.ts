import type { DisciplineConfig } from './types';

export const mathConfig: DisciplineConfig = {
  id: 'math',
  name: { en: 'Math', zh: '数学' },
  icon: 'Sigma',
  themeColor: 'oklch(0.55 0.15 300)',
  cssGradient: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
  enabled: false,
  stage: 'S2',

  systemPromptModule: `
## Math-Specific Requirements (S2)
- Function plotting: Accurate 2D/3D function graphs with axis labels
- Geometry: Interactive constructions with drag-and-drop points
- Calculus: Animated Riemann sums, tangent lines, area under curves
- Statistics: Histograms, normal distributions, sampling animations
- Linear algebra: Vector spaces, matrix transformations, eigenvalue visualization
`,

  visualizationHints: `
- 3D mode: 3D surfaces, vector fields, parametric curves
- SVG mode: 2D function plots, geometric constructions, probability trees
- Hybrid: calculus (3D surface + 2D cross-section integral)
`,

  analyticalSolutions: '',

  commonTopics: [
    { en: 'Sine and Cosine Waves', zh: '正弦余弦波', complexity: 'low' },
    { en: 'Derivatives Visualization', zh: '导数可视化', complexity: 'medium' },
    { en: '3D Surface Plotting', zh: '三维曲面绘制', complexity: 'high' },
  ],

  qualityRules: [],
  validationRules: [],
  validationThreshold: 60,
  additionalCdnLibs: [],
  curriculumStandards: [],
};
