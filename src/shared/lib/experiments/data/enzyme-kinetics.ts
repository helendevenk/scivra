import type { Experiment } from '@/shared/types/experiment';

export const enzymeKinetics: Experiment = {
  id: 'enzyme-kinetics',
  slug: 'enzyme-kinetics',
  title: 'Enzyme Kinetics & Michaelis-Menten',
  subtitle: 'How enzymes speed up reactions',
  description:
    'Explore the catalytic cycle of enzymes at the molecular level. Watch substrate molecules bind to the active site, form enzyme-substrate complexes, and release products. Plot real-time Michaelis-Menten and Lineweaver-Burk curves. Add competitive, non-competitive, or uncompetitive inhibitors and see Km and Vmax shift.',
  thumbnail: '/imgs/experiments/enzyme-kinetics.png',

  standards: {
    ngss: ['HS-LS1-6', 'HS-LS1-7'],
    gcse: ['B2.5', 'B2.6'],
    ap: ['2.A.3', '4.A.1'],
  },
  primaryStandard: 'ap-biology',
  category: 'biology',
  subject: 'biology',
  gradeLevel: 'AP',
  tags: [
    'enzyme kinetics',
    'Michaelis-Menten',
    'inhibition',
    'active site',
    'Km Vmax',
    'AP Biology',
  ],
  difficulty: 'advanced',

  parameters: [
    {
      id: 'substrateConcentration',
      label: 'Substrate [S]',
      unit: 'mM',
      min: 0.5,
      max: 20,
      default: 4,
      step: 0.5,
      tier: 'free',
    },
    {
      id: 'enzymeAmount',
      label: 'Enzyme Amount',
      unit: 'relative units',
      min: 1,
      max: 20,
      step: 1,
      default: 10,
      tier: 'free',
    },
    {
      id: 'inhibitorConcentration',
      label: 'Inhibitor [I]',
      unit: 'mM',
      min: 0,
      max: 10,
      default: 0,
      step: 0.5,
      tier: 'free',
    },
  ],

  formulas: [
    {
      latex: 'v = \\frac{V_{\\max}[S]}{K_m + [S]}',
      description:
        'Michaelis-Menten equation: reaction rate as a function of substrate concentration',
    },
    {
      latex: 'K_m = \\frac{k_{-1} + k_2}{k_1} \\approx \\frac{k_{-1}}{k_1}',
      description:
        'Km ≈ dissociation constant of ES complex (substrate affinity)',
    },
    {
      latex:
        '\\frac{1}{v} = \\frac{K_m}{V_{\\max}} \\cdot \\frac{1}{[S]} + \\frac{1}{V_{\\max}}',
      description:
        'Lineweaver-Burk double-reciprocal plot (x-intercept = -1/Km, y-intercept = 1/Vmax)',
    },
  ],

  theory:
    'Enzymes are biological catalysts that lower activation energy by forming a specific enzyme-substrate (ES) complex at the active site (lock-and-key or induced fit). The catalytic cycle: E + S ⇌ ES → E + P. The Michaelis-Menten model describes reaction rate (v) as a function of [S]: v = Vmax[S]/(Km + [S]). Km (Michaelis constant) is the [S] at half-Vmax — a measure of enzyme-substrate affinity (lower Km = higher affinity). Competitive inhibitors increase apparent Km (compete with substrate for active site). Non-competitive inhibitors decrease Vmax (bind allosteric site, alter enzyme shape). Uncompetitive inhibitors decrease both Km and Vmax (bind ES complex only). Temperature and pH also affect enzyme activity by denaturing the protein.',

  instructions:
    'Use the Substrate [S] slider to change molecule availability, the Enzyme Amount slider to change how many active sites are present, and the Inhibitor [I] slider to add inhibitor molecules. Start with Normal Enzyme (Km=2mM), then compare Competitive Inhibition and Noncompetitive Inhibition presets. Watch velocity, apparent Km, apparent Vmax, ES complexes, saturation, and the Michaelis-Menten curve as you change one slider at a time.',

  challenges: [
    {
      id: 'ek-c1',
      question:
        'An enzyme has Km = 4 mM and Vmax = 80 μmol/min. What is the reaction rate when [S] = 4 mM?',
      hint: 'v = Vmax[S]/(Km+[S]) = 80×4/(4+4) = 320/8 = 40 μmol/min (= Vmax/2, as expected at Km).',
      tier: 'free',
    },
    {
      id: 'ek-c2',
      question:
        'Enzyme A has Km = 2 mM and Enzyme B has Km = 10 mM. Which has higher substrate affinity?',
      hint: 'Lower Km = higher affinity. Enzyme A (Km = 2 mM) has higher substrate affinity.',
      tier: 'free',
    },
    {
      id: 'ek-c3',
      question:
        'On a Lineweaver-Burk plot, a competitive inhibitor shifts the x-intercept but not the y-intercept. What does this mean for Km and Vmax?',
      hint: 'x-intercept = -1/Km → shifts means Km increases (apparent). y-intercept = 1/Vmax → unchanged means Vmax unchanged. Competitive: ↑Km, same Vmax.',
      tier: 'free',
    },
    {
      id: 'ek-c4',
      question:
        'Aspirin (acetylsalicylic acid) irreversibly acetylates the active site of COX-2 enzyme. Is this competitive or non-competitive inhibition? How does it affect Vmax?',
      hint: 'Irreversible modification of active site = irreversible competitive-like (covalent). Available enzyme is permanently reduced → apparent Vmax decreases (fewer functional enzyme molecules). Some classify this as mechanism-based inhibition.',
      tier: 'pro',
    },
  ],

  wave: 3,
  tier: 'free',
  estimatedTime: 18,
  relatedExperiments: ['cellular-respiration', 'photosynthesis'],

  seoTitle: 'Enzyme Kinetics Michaelis-Menten Interactive | Scivra AP Biology',
  seoKeywords: [
    'enzyme kinetics simulation',
    'Michaelis-Menten interactive',
    'Lineweaver-Burk plot',
    'enzyme inhibition',
    'AP Biology enzymes',
    'Km Vmax calculator',
  ],
  jsonLd: {
    '@type': 'LearningResource',
    educationalLevel: 'High School',
    teaches: 'Enzyme Kinetics and the Michaelis-Menten Model',
  },
  htmlControlAliases: {
    substrateConcentration: 'sl-s',
    enzymeAmount: 'sl-e',
    inhibitorConcentration: 'sl-i',
  },
  presets: [
    {
      id: '0',
      label: 'Normal Enzyme (Km=2mM)',
      description:
        'A baseline enzyme run with 4.0 mM substrate, 10 relative enzyme units, and no inhibitor. Use it as the reference case for comparing velocity, apparent Km, Vmax, ES complexes, and saturation.',
    },
    {
      id: '1',
      label: 'Competitive Inhibition',
      description:
        'Adds inhibitor while keeping substrate and enzyme amount constant. The model raises apparent Km while leaving Vmax unchanged, showing how active-site competition can be overcome by more substrate.',
    },
    {
      id: '2',
      label: 'Noncompetitive Inhibition',
      description:
        'Adds inhibitor while keeping substrate and enzyme amount constant. The model lowers apparent Vmax while Km stays unchanged, showing how allosteric inhibition reduces available catalytic activity.',
    },
  ],
  contentSections: {
    whatIsIt:
      'Enzyme kinetics describes how fast enzymes catalyze reactions and what factors control that speed. Enzymes are protein catalysts that lower the activation energy of reactions by binding substrates at a specialized pocket called the active site, forming an enzyme-substrate (ES) complex. The Michaelis-Menten equation quantifies this: v = Vmax[S]/(Km + [S]), where Vmax is the maximum rate when all enzyme active sites are occupied, and Km is the substrate concentration that achieves half that maximum speed. A low Km means the enzyme reaches half-Vmax at a low substrate concentration — a sign of high affinity. In the simulation you control substrate concentration, enzyme amount, and inhibitor concentration while comparing normal, competitive, and noncompetitive preset conditions.',
    parameterExplanations: {
      substrateConcentration:
        'Substrate [S] controls how many substrate molecules are available for enzyme binding, from 0.5 to 20 mM. At low substrate, many active sites sit empty, so adding more substrate produces a clear velocity increase. As [S] rises, active sites spend more time occupied and the curve bends toward Vmax instead of increasing linearly. Compare the same substrate value across the Normal Enzyme, Competitive Inhibition, and Noncompetitive Inhibition presets: competitive inhibition makes the same [S] less effective by increasing apparent Km, while noncompetitive inhibition mainly lowers the ceiling the curve can reach.',
      enzymeAmount:
        'Enzyme Amount changes the number of enzyme particles and active sites in the 3D scene, from 1 to 20 relative units. More enzyme gives substrate molecules more places to bind, so the animation can form more ES complexes and release more product over time. In real kinetics this is tied to Vmax because Vmax depends on total active enzyme concentration and catalytic turnover. Use this slider after setting a substrate level: if substrate is scarce, adding enzyme may have a smaller effect than expected because there is not enough substrate to occupy every active site.',
      inhibitorConcentration:
        'Inhibitor [I] sets the concentration of inhibitor molecules, from 0 to 10 mM. When inhibitor is above zero, the model can show either competitive or noncompetitive behavior depending on the selected preset. In the Competitive Inhibition preset, inhibitor competes with substrate for the active site, increasing apparent Km while Vmax stays the same. In the Noncompetitive Inhibition preset, inhibitor reduces effective catalytic capacity, lowering apparent Vmax while Km stays unchanged. Keep [S] and Enzyme Amount constant, then move only this slider to isolate how inhibitor dose reshapes velocity and saturation.',
    },
    misconceptions: [
      {
        wrong:
          'Enzymes are consumed by the reactions they catalyze and must be replenished.',
        correct:
          'Enzymes are catalysts — they emerge from each reaction cycle unchanged and ready to bind another substrate molecule. A single enzyme molecule can process thousands of substrate molecules per second. This is why cells need only small amounts of enzyme relative to substrate.',
      },
      {
        wrong:
          'A higher Km means the enzyme works better because it can handle more substrate.',
        correct:
          'Higher Km means lower affinity — the enzyme needs more substrate to reach half its maximum rate. A lower Km is the mark of a high-affinity enzyme that operates efficiently even at low substrate concentrations. Km is an inverse proxy for affinity, not a measure of capacity.',
      },
      {
        wrong:
          'Competitive inhibition permanently blocks the enzyme by occupying the active site.',
        correct:
          "Competitive inhibition is reversible in the classical sense: inhibitor and substrate compete for the same site, so adding more substrate can outcompete the inhibitor and restore velocity toward Vmax. The apparent Km rises (more substrate needed to reach half-Vmax), but Vmax itself is unchanged. Irreversible inhibitors like nerve agents or aspirin's COX modification are a different mechanism.",
      },
      {
        wrong:
          'Temperature always increases enzyme activity — hotter is always faster.',
        correct:
          "Up to the optimal temperature (~37°C for most human enzymes), increasing temperature speeds catalysis. Beyond the optimum, heat disrupts the non-covalent bonds that maintain the active site's shape, denaturing the enzyme and causing activity to drop rapidly toward zero. The Michaelis-Menten equation captures rate at a fixed optimal temperature.",
      },
      {
        wrong: 'All inhibitors reduce Vmax on a Michaelis-Menten plot.',
        correct:
          'Competitive and noncompetitive inhibitors change the curve in different ways. Competitive inhibitors leave Vmax unchanged but raise apparent Km, meaning more substrate is needed to approach the same maximum rate. Noncompetitive inhibitors lower apparent Vmax because they reduce effective enzyme activity, while Km stays about the same in this model. Read the live apparent Km and Vmax values instead of assuming every inhibitor has the same graph pattern.',
      },
    ],
    teacherUseCases: [
      'Baseline data collection: start with the Normal Enzyme (Km=2mM) preset, then have students vary only Substrate [S] and record velocity, ES complexes, and saturation to connect the Michaelis-Menten curve to AP Bio 2.A.3.',
      'Active-site availability comparison: keep Substrate [S] fixed, move Enzyme Amount from low to high, and ask students to explain why more active sites can raise product formation only when enough substrate is present.',
      'Inhibitor mechanism challenge: use Competitive Inhibition and Noncompetitive Inhibition presets with the same Substrate [S], Enzyme Amount, and Inhibitor [I] values, then ask students to identify which live readout changes: apparent Km or apparent Vmax.',
      'Dose-response mini-lab: in the Competitive Inhibition preset, increase Inhibitor [I] from 0 to 10 mM while students predict whether adding more substrate could recover velocity. Repeat in Noncompetitive Inhibition and compare.',
      'Misconception probe on enzyme consumption: pause after a substrate binds and releases product. Ask whether that enzyme molecule was destroyed, then resume so students can see the same enzyme bind another substrate.',
    ],
    faq: [
      {
        question: 'What does Km actually measure in biological terms?',
        answer:
          'Km is approximately equal to the dissociation constant of the enzyme-substrate complex (Kd = k₋₁/k₁). It represents the substrate concentration at which half the enzyme molecules are occupied. A Km of 2 mM means you need 2 mM substrate to fill 50% of active sites; a Km of 0.05 mM means the enzyme is half-saturated at far lower concentrations — indicating stronger substrate binding.',
      },
      {
        question: 'Why does competitive inhibition not change Vmax?',
        answer:
          "A competitive inhibitor only blocks access to the active site — it does not alter the enzyme's catalytic ability once substrate is bound. At saturating substrate concentrations, substrate vastly outnumbers inhibitor and essentially all active sites are occupied by substrate. The enzyme reaches the same maximum rate, just requiring more substrate to get there, which is why apparent Km rises but Vmax is unchanged.",
      },
      {
        question: 'What AP Biology standards does enzyme kinetics address?',
        answer:
          'Enzyme kinetics directly covers AP Bio 2.A.3 (enzymes and the mechanisms of enzyme activity) and 4.A.1 (the subcomponents of biological molecules affect their function). Students should be able to interpret Michaelis-Menten curves, predict how competitive and noncompetitive inhibitors affect apparent Km and Vmax, and connect enzyme function to NGSS HS-LS1-6 and HS-LS1-7.',
      },
      {
        question:
          'What is the difference between competitive and noncompetitive inhibition?',
        answer:
          'Competitive inhibitors compete with substrate for the active site. In the simulation this raises apparent Km because more substrate is needed to reach the same fraction of Vmax, but Vmax itself can still be reached at high substrate. Noncompetitive inhibitors bind away from the active site and reduce the effective amount of working enzyme. That lowers apparent Vmax while Km stays about the same.',
      },
      {
        question: 'How do I find Km from the simulation graph?',
        answer:
          'Locate Vmax on the plateau of the Michaelis-Menten curve, calculate half that value, then find the substrate concentration on the x-axis where v = Vmax/2. That x-value is Km. In this simulation, also watch the live apparent Km value in the data panel. Under competitive inhibition it increases, while under noncompetitive inhibition it stays about the same.',
      },
    ],
  },
};
