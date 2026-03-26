import type { Experiment } from "@/shared/types/experiment";

export const neuronActionPotential: Experiment = {
  id: "neuron-action-potential",
  slug: "neuron-action-potential",
  title: "Neuron & Action Potential",
  subtitle: "The electrical language of the nervous system",
  description:
    "Explore the structure of a neuron and fire an action potential. Watch sodium channels open as the membrane depolarizes past threshold, see the rapid voltage spike propagate down the axon, and observe repolarization as potassium channels open. Adjust stimulus strength, ion concentrations, and myelination.",
  thumbnail: "/imgs/experiments/neuron-action-potential.png",

  standards: {
    ngss: ["HS-LS1-2"],
    gcse: ["B5.1", "B5.2"],
    ap: ["3.D.2", "3.E.2"],
  },
  primaryStandard: "ap-biology",
  category: "biology",
  subject: "biology",
  gradeLevel: "AP",
  tags: ["neuron", "action potential", "Na/K channels", "depolarization", "myelination", "AP Biology"],
  difficulty: "advanced",

  parameters: [
    {
      id: "stimulusStrength",
      label: "Stimulus Strength",
      unit: "mV",
      min: 5,
      max: 60,
      default: 25,
      step: 5,
      tier: "free",
    },
    {
      id: "sodiumConc",
      label: "Extracellular Na⁺ Concentration",
      unit: "mM",
      min: 50,
      max: 200,
      default: 145,
      step: 5,
      tier: "free",
    },
    {
      id: "myelination",
      label: "Myelin Sheath Coverage",
      unit: "%",
      min: 0,
      max: 100,
      default: 80,
      step: 10,
      tier: "pro",
    },
    {
      id: "channelBlocker",
      label: "Na⁺ Channel Blocker (tetrodotoxin)",
      unit: "%",
      min: 0,
      max: 100,
      default: 0,
      step: 10,
      tier: "pro",
    },
  ],

  formulas: [
    {
      latex: "E_m = -70 \\text{ mV (resting)} \\to +40 \\text{ mV (peak)} \\to -90 \\text{ mV (hyperpol.)}",
      description: "Membrane potential during action potential phases",
    },
    {
      latex: "E_{Na} = \\frac{RT}{zF} \\ln\\frac{[\\text{Na}^+]_o}{[\\text{Na}^+]_i} \\approx +60 \\text{ mV}",
      description: "Nernst equation: equilibrium potential for Na⁺",
    },
    {
      latex: "v_{myelinated} \\gg v_{unmyelinated} \\quad (\\text{saltatory conduction})",
      description: "Myelin increases conduction velocity via saltatory conduction at nodes of Ranvier",
    },
  ],

  theory:
    "Neurons maintain a resting membrane potential of −70 mV due to the Na⁺/K⁺ ATPase pump (3 Na⁺ out, 2 K⁺ in) and selective ion permeability. An action potential is triggered when a stimulus depolarizes the membrane to threshold (≈−55 mV). Voltage-gated Na⁺ channels open rapidly → Na⁺ rushes in → membrane depolarizes to +40 mV. Na⁺ channels then inactivate while K⁺ channels open → K⁺ rushes out → repolarization and brief hyperpolarization (refractory period). The action potential propagates down the axon; myelination creates saltatory conduction (jumping between nodes of Ranvier), dramatically increasing speed (up to 120 m/s in myelinated vs 0.5 m/s in unmyelinated). Multiple sclerosis involves myelin sheath degradation.",

  instructions:
    "Set stimulus strength and click 'Stimulate'. Watch the voltage trace build in the oscilloscope-style graph. If the stimulus exceeds threshold, an action potential fires — observe the Na⁺ and K⁺ channel animations. Reduce Na⁺ concentration to see how the amplitude changes. Toggle myelination (Pro) to compare conduction velocities.",

  challenges: [
    {
      id: "nap-c1",
      question: "What is the threshold potential for a typical neuron, and what happens if a stimulus is below threshold?",
      hint: "Threshold ≈ −55 mV. Below threshold, a graded potential forms but decays — no action potential fires (all-or-nothing principle).",
      tier: "free",
    },
    {
      id: "nap-c2",
      question: "Why can't a second action potential fire immediately after the first?",
      hint: "The refractory period: Na⁺ channels are inactivated (absolute refractory) or the membrane is hyperpolarized (relative refractory). A stronger stimulus is needed during relative refractory period.",
      tier: "free",
    },
    {
      id: "nap-c3",
      question: "Tetrodotoxin (TTX) blocks voltage-gated Na⁺ channels. What effect does this have on action potential generation?",
      hint: "No Na⁺ influx → membrane cannot depolarize past threshold → no action potential. TTX causes paralysis and is lethal. Found in puffer fish.",
      tier: "free",
    },
    {
      id: "nap-c4",
      question: "In multiple sclerosis, the myelin sheath is degraded. Predict the effect on: (a) conduction velocity, (b) the type of conduction, (c) neurological symptoms.",
      hint: "(a) Velocity decreases dramatically, (b) saltatory conduction fails → continuous conduction or signal failure, (c) symptoms: muscle weakness, numbness, visual disturbances — due to slowed or blocked nerve signals.",
      tier: "pro",
    },
  ],

  wave: 3,
  tier: "free",
  estimatedTime: 18,
  relatedExperiments: ["membrane-transport", "cellular-respiration"],

  seoTitle: "Neuron Action Potential Interactive Animation | NeonPhysics AP Biology",
  seoKeywords: [
    "action potential simulation",
    "neuron animation",
    "depolarization repolarization",
    "Na K channels interactive",
    "AP Biology nervous system",
    "myelination conduction",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "High School",
    teaches: "Neuron Structure and Action Potential",
  },
};
