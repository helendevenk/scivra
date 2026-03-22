import type { DisciplineConfig } from './types';

export const earthScienceConfig: DisciplineConfig = {
  id: 'earth-science',
  name: { en: 'Earth & Space', zh: '地球与空间' },
  icon: 'Globe',
  themeColor: 'oklch(0.55 0.15 200)',
  cssGradient: 'linear-gradient(135deg, #2193b0 0%, #6dd5ed 100%)',
  enabled: false,
  stage: 'S3',

  systemPromptModule: `
## Earth & Space Science Requirements (S3)
- Planetary motion: Accurate orbital mechanics with scale indicators
- Atmosphere: Layer visualization with temperature/pressure profiles
- Geology: Plate tectonics, rock cycle, seismic wave propagation
- Weather: Air mass movement, pressure systems, Coriolis effect
- Astronomy: Star lifecycle, H-R diagram, galaxy rotation curves
`,

  visualizationHints: `
- 3D mode: planetary systems, Earth cross-sections, atmospheric layers
- SVG mode: weather maps, geological timelines, H-R diagrams
- Hybrid: plate tectonics (3D Earth + cross-section)
`,

  analyticalSolutions: '',

  commonTopics: [
    { en: 'Solar System Orbits', zh: '太阳系轨道', complexity: 'medium' },
    { en: 'Plate Tectonics', zh: '板块构造', complexity: 'medium' },
    { en: 'Atmospheric Layers', zh: '大气层结构', complexity: 'low' },
  ],

  qualityRules: [],
  validationRules: [],
  validationThreshold: 60,
  additionalCdnLibs: [],
  curriculumStandards: [],
};
