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

  seoTitle: "Neuron Action Potential Interactive Animation | Scivra AP Biology",
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
  contentSections: {
    whatIsIt:
      "A neuron fires an action potential by rapidly reversing its membrane voltage — from a resting −70 mV to a peak of roughly +30 mV — in about 1–2 milliseconds. The resting potential is maintained by the Na⁺/K⁺ ATPase pump (3 Na⁺ out, 2 K⁺ in) and selective membrane permeability. When a stimulus pushes the membrane past the threshold of approximately −55 mV, voltage-gated Na⁺ channels snap open, flooding the cell with Na⁺ (depolarization). Na⁺ channels then inactivate while K⁺ channels open, driving the membrane back negative (repolarization) through a brief hyperpolarization that marks the refractory period. Critically, this response is all-or-none: a sub-threshold stimulus produces only a decaying graded potential, never a full spike. The simulation lets you adjust stimulus strength, extracellular Na⁺, myelination, and channel blockers to explore every phase of this electrical event.",
    parameterExplanations: {
      stimulusStrength:
        "The magnitude of the applied depolarizing current in mV equivalent, from 5 to 60 mV. Stimuli below the threshold value (~15–20 mV above resting, reaching approximately −55 mV) produce only a graded potential that decays without firing. Once stimulus strength crosses threshold, the full action potential fires — increasing strength beyond that point changes nothing about the spike shape, only how reliably threshold is reached (all-or-none principle).",
      sodiumConc:
        "Extracellular Na⁺ concentration in mM, normally ~145 mM in the human body. Reducing extracellular Na⁺ decreases the electrochemical driving force for Na⁺ influx, lowering the peak depolarization voltage (normally ~+30 mV). Raising it above 145 mM increases the Na⁺ equilibrium potential, pushing the peak higher. This slider directly demonstrates why extracellular Na⁺ determines action potential amplitude.",
      myelination:
        "The percentage of axon length covered by myelin sheath, from 0% (bare unmyelinated axon) to 100% (fully myelinated). Myelin is an electrical insulator that forces ionic current to jump between exposed nodes of Ranvier — saltatory conduction. Full myelination increases conduction velocity from roughly 0.5 m/s to over 100 m/s. Dragging this slider from 0 to 100% shows the dramatic acceleration in signal propagation visible in the simulation timeline.",
      channelBlocker:
        "The percentage of voltage-gated Na⁺ channels blocked by tetrodotoxin (TTX), a neurotoxin from puffer fish, from 0% to 100%. As blockade increases, fewer Na⁺ channels can open during a stimulus, reducing depolarization amplitude until, near 100% block, no action potential can fire at all. This slider recreates the pharmacological experiment that proved Na⁺ channels are essential for action potential generation.",
    },
    misconceptions: [
      {
        wrong:
          "A stronger stimulus produces a larger action potential — the size of the spike depends on how hard you push.",
        correct:
          "The action potential is all-or-none: once threshold is crossed (~−55 mV), the spike always rises to the same peak (~+30 mV) regardless of how much additional stimulus is applied. Stimulus strength determines whether the neuron fires, not how large the resulting spike is. Signal intensity in the nervous system is encoded by firing frequency, not spike height.",
      },
      {
        wrong:
          "During repolarization, Na⁺ is actively pumped back out to restore the resting potential.",
        correct:
          "Repolarization is driven by K⁺ efflux through voltage-gated K⁺ channels opening — not by active Na⁺ pumping. The Na⁺/K⁺ ATPase pump does eventually restore the original ion distributions, but it operates slowly over many action potentials, not during the sub-millisecond repolarization phase itself.",
      },
      {
        wrong:
          "After an action potential fires, the neuron can immediately fire again.",
        correct:
          "The absolute refractory period follows every action potential: Na⁺ channels are inactivated and cannot reopen regardless of stimulus strength. During the subsequent relative refractory period, the membrane is hyperpolarized below −70 mV, requiring a stronger-than-normal stimulus to reach threshold. This prevents backward signal propagation and sets a maximum firing frequency.",
      },
      {
        wrong:
          "Myelin speeds up conduction by making ions flow faster through the membrane.",
        correct:
          "Myelin insulates the axon membrane, preventing ion leakage between nodes of Ranvier. This does not speed up ion flow; it forces the electrical signal to jump from node to node (saltatory conduction) rather than regenerating continuously along the entire membrane. The effect on speed is dramatic: myelinated axons conduct at 70–120 m/s versus 0.5–2 m/s for unmyelinated axons.",
      },
    ],
    teacherUseCases: [
      "Threshold demonstration: have students increase stimulus strength in 5 mV steps from minimum and record whether an action potential fires at each level. Plot binary fire/no-fire data against stimulus, identify threshold, and use this as the entry point for all-or-none discussion — directly addresses AP Bio 3.D.2.",
      "Na⁺ concentration experiment: set channelBlocker to 0%, then have students lower sodiumConc from 145 mM to 70 mM in 15 mM steps, recording peak depolarization voltage each time. Graph peak vs. Na⁺ concentration to observe the Nernst relationship — ties to the Nernst equation formula shown in the simulation.",
      "Myelination disease modeling: drag myelination from 100% to 0% and ask students to predict what neurological symptoms would result from this loss. Connect to multiple sclerosis and use it as a misconception probe — students often think MS destroys neurons rather than their insulating sheath.",
      "TTX channel blocker pharmacology: have students apply channelBlocker in 20% increments and record the minimum stimulus needed to fire an action potential (or confirm it cannot fire). Discuss how this models the mechanism of local anesthetics and puffer fish toxin, addressing AP Bio 3.E.2.",
      "Data collection on conduction velocity: at 0%, 50%, and 100% myelination, record the time between stimulus application and signal arrival at the axon terminal in the simulation. Calculate relative conduction velocity ratios and compare to published values (myelinated ~100 m/s, unmyelinated ~0.5 m/s).",
    ],
    faq: [
      {
        question: "What is the threshold potential and why does it matter?",
        answer:
          "Threshold is the membrane voltage (~−55 mV) at which enough voltage-gated Na⁺ channels open to create a self-amplifying Na⁺ influx. Below threshold, the few channels that open are insufficient to outpace K⁺ leak channels, and the depolarization fades. Above threshold, Na⁺ influx accelerates in a positive feedback loop, driving the membrane to peak depolarization of approximately +30 mV within about 0.5 ms.",
      },
      {
        question: "How does the all-or-none principle connect to AP Bio standards?",
        answer:
          "AP Bio 3.D.2 requires students to explain how neurons transmit information using action potentials, including the all-or-none nature of the response. Students must be able to describe why sub-threshold stimuli fail to fire and explain that information is encoded in firing frequency rather than spike amplitude. NGSS HS-LS1-2 addresses the broader cell communication context.",
      },
      {
        question: "Why do Na⁺ channels inactivate instead of just closing?",
        answer:
          "Voltage-gated Na⁺ channels have two gates: an activation gate that opens rapidly when the membrane depolarizes, and an inactivation gate (the 'ball and chain') that plugs the channel from the intracellular side within 1–2 ms. This dual-gate design ensures that Na⁺ influx is self-terminating regardless of whether voltage stays high, creating the absolute refractory period and preventing runaway depolarization.",
      },
      {
        question: "What happens if tetrodotoxin blocks all Na⁺ channels?",
        answer:
          "At 100% channel blockade in the simulation, no action potential can fire regardless of stimulus strength, because the Na⁺ influx required to cross threshold is absent. In biological systems, TTX poisoning paralyzes voluntary muscles and can stop breathing by blocking motor neuron firing. The lethal dose for humans is roughly 1–2 mg, making TTX one of the most potent non-protein toxins known.",
      },
      {
        question: "Does the Na⁺/K⁺ pump fire during every action potential to restore ion balance?",
        answer:
          "The pump runs continuously but is too slow to restore ion balance during any single action potential. Each spike moves only a tiny fraction of intracellular Na⁺ and K⁺ — a neuron can fire hundreds of times before ion gradients deplete measurably. The pump maintains the resting gradient over the long term, not on a spike-by-spike basis.",
      },
    ],
  },
};
