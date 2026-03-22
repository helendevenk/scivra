import type { DisciplineConfig } from './types';

export const biologyConfig: DisciplineConfig = {
  id: 'biology',
  name: { en: 'Biology', zh: '生物' },
  icon: 'Dna',
  themeColor: 'oklch(0.55 0.20 145)',
  cssGradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
  enabled: false,
  stage: 'S2',

  systemPromptModule: `
## Biology-Specific Requirements (S2)
- Cell structures: Use transparent membranes with organelles inside
- DNA/RNA: Double helix with correct base pairing colors
- Molecular biology: Protein folding, enzyme-substrate binding animations
- Ecology: Population dynamics, food web visualization
- Evolution: Phylogenetic trees, natural selection simulation
`,

  visualizationHints: `
- 3D mode: cell structures, DNA helix, protein folding
- SVG mode: pedigree charts, population graphs, metabolic pathways
- Hybrid: cell division (3D + phase timeline)
`,

  analyticalSolutions: `
- Population growth: N(t) = N₀·e^(rt) (exponential), N(t) = K/(1 + ((K-N₀)/N₀)·e^(-rt)) (logistic)
- Hardy-Weinberg: p² + 2pq + q² = 1
- Michaelis-Menten: v = Vmax·[S]/(Km + [S])
`,

  commonTopics: [
    { en: 'Cell Membrane Transport', zh: '细胞膜运输', complexity: 'low' },
    { en: 'DNA Replication', zh: 'DNA复制', complexity: 'medium' },
    { en: 'Population Dynamics', zh: '种群动态', complexity: 'medium' },
  ],

  qualityRules: [],
  validationRules: [],
  validationThreshold: 60,
  additionalCdnLibs: [],
  curriculumStandards: [],
};
