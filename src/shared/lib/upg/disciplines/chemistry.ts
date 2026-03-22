import type { DisciplineConfig } from './types';

export const chemistryConfig: DisciplineConfig = {
  id: 'chemistry',
  name: { en: 'Chemistry', zh: '化学' },
  icon: 'FlaskConical',
  themeColor: 'oklch(0.60 0.20 50)',
  cssGradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  enabled: false,
  stage: 'S2',

  systemPromptModule: `
## Chemistry-Specific Requirements (S2)
- Molecular structures: ball-and-stick or space-filling models
- Atom colors: CPK convention (C=dark gray, O=red, N=blue, H=white, S=yellow, Cl=green)
- Bond visualization: single (cylinder), double (parallel), triple (three cylinders)
- Reaction animations: bond breaking/forming with transition state
- Energy diagrams: reactants → TS → products with activation energy labeled
- Orbital shapes: s/p/d as transparent isosurfaces
`,

  visualizationHints: `
- 3D mode: molecular geometry, crystal lattice, orbital shapes
- SVG mode: reaction energy diagrams, phase diagrams, titration curves
- Hybrid: reaction mechanism (3D molecules + energy profile)
`,

  analyticalSolutions: `
- Ideal gas: PV = nRT
- Arrhenius: k = A·e^(-Ea/RT)
- Beer-Lambert: A = εlc
- Nernst: E = E° - (RT/nF)·ln(Q)
`,

  commonTopics: [
    { en: 'Water Molecule Geometry', zh: '水分子几何构型', complexity: 'low' },
    { en: 'Benzene Orbital Structure', zh: '苯的轨道结构', complexity: 'medium' },
    { en: 'SN2 Reaction Mechanism', zh: 'SN2反应机理', complexity: 'high' },
  ],

  qualityRules: [],
  validationRules: [],
  validationThreshold: 60,
  additionalCdnLibs: [],
  curriculumStandards: [],
};
