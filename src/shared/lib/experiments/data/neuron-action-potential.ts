import type { Experiment } from "@/shared/types/experiment";

export const neuronActionPotential: Experiment = {
  id: "neuron-action-potential",
  slug: "neuron-action-potential",
  title: "Neuron & Action Potential",
  subtitle: "The electrical language of the nervous system",
  description:
    "Explore the structure of a neuron and fire an action potential. Watch sodium channels open as the membrane depolarizes past threshold, see the rapid voltage spike propagate down the axon, and observe repolarization as potassium channels open. Adjust stimulus current, firing rate, and myelination.",
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
      id: "stimulusCurrent",
      label: "Stimulus Current",
      unit: "mV",
      min: 5,
      max: 30,
      default: 15,
      step: 1,
      tier: "free",
    },
    {
      id: "firingRate",
      label: "Firing Rate",
      unit: "Hz",
      min: 1,
      max: 8,
      default: 1,
      step: 1,
      tier: "free",
    },
    {
      id: "myelination",
      label: "Myelination",
      unit: "level",
      min: 0,
      max: 2,
      default: 2,
      step: 1,
      tier: "free",
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
    "Use the Stimulus Current, Firing Rate, and Myelination sliders to set the input strength, pulse frequency, and conduction condition. Click Stimulate to fire the neuron, then compare the Single Action Potential, Rapid Firing (Tetanus), and Inhibitory (GABA, no AP) presets.",

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
  htmlControlAliases: { stimulusCurrent: "sl-stim", firingRate: "sl-rate", myelination: "sl-myelin" },
  presets: [
    {
      id: "applyPreset:0",
      label: "Single Action Potential",
      description:
        "A threshold-level stimulus produces one clean action potential, useful for walking through resting state, threshold, depolarization, repolarization, and refractory recovery.",
      paramValues: { stimulusCurrent: 15, firingRate: 1, myelination: 2 },
    },
    {
      id: "applyPreset:1",
      label: "Rapid Firing (Tetanus)",
      description:
        "A stronger stimulus with a higher firing rate shows repeated action potentials and supports discussion of frequency coding rather than spike-height coding.",
      paramValues: { stimulusCurrent: 20, firingRate: 5, myelination: 2 },
    },
    {
      id: "applyPreset:2",
      label: "Inhibitory (GABA, no AP)",
      description:
        "An inhibitory setup keeps the membrane below threshold, showing why hyperpolarizing input can block a spike even when the neuron receives stimulation.",
      paramValues: { stimulusCurrent: 8, firingRate: 1, myelination: 2 },
    },
  ],
  contentSections: {
    whatIsIt:
      "A neuron fires an action potential by rapidly reversing its membrane voltage — from a resting −70 mV to a peak of roughly +30 mV — in about 1–2 milliseconds. The resting potential is maintained by the Na⁺/K⁺ ATPase pump (3 Na⁺ out, 2 K⁺ in) and selective membrane permeability. When a stimulus pushes the membrane past the threshold of approximately −55 mV, voltage-gated Na⁺ channels snap open, flooding the cell with Na⁺ (depolarization). Na⁺ channels then inactivate while K⁺ channels open, driving the membrane back negative (repolarization) through a brief hyperpolarization that marks the refractory period. Critically, this response is all-or-none: a sub-threshold stimulus produces only a decaying graded potential, never a full spike. The simulation lets you adjust stimulus current, firing rate, and myelination, then jump between preset firing conditions.",
    parameterExplanations: {
      stimulusCurrent:
        "Stimulus Current controls how strongly the neuron is depolarized before an action potential can begin. At low values, the membrane voltage moves upward but may stay below threshold, so the change fades as a graded potential. Once the stimulus reaches the threshold region, voltage-gated Na⁺ channels open in a positive feedback loop and the neuron fires a full spike. Raising the current beyond threshold does not make the spike taller because action potentials are all-or-none. Use this slider with the Single Action Potential preset to separate the question “does it fire?” from the mistaken idea that a stronger input creates a larger spike.",
      firingRate:
        "Firing Rate sets how often the simulation applies stimulation pulses, measured in hertz. A low rate produces isolated spikes with enough time to see depolarization, repolarization, and refractory recovery after each event. A higher rate creates repeated firing, making it easier to discuss how neurons encode stronger signals by spike frequency rather than spike height. If pulses arrive too close together, the refractory period becomes visible because Na⁺ channels need time to reset before another full action potential can occur. Compare 1 Hz with the Rapid Firing preset to connect the voltage trace to real neural signal coding.",
      myelination:
        "Myelination represents the condition of the insulating myelin sheath around the axon. In the HTML simulation, 0 means demyelinated, 1 means partial myelination, and 2 means normal myelination. Myelin prevents current from leaking across the membrane between nodes of Ranvier, so the action potential appears to jump from node to node in saltatory conduction. Normal myelination produces faster, cleaner propagation, while demyelination slows the signal and can make transmission unreliable. Move this slider after firing a single spike to show why myelin damage in disorders such as multiple sclerosis affects timing and coordination rather than the chemical identity of the ion channels.",
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
      "Threshold demonstration: have students increase Stimulus Current from 5 mV upward and record whether an action potential fires at each value. Plot binary fire/no-fire data against stimulus, identify threshold, and use this as the entry point for all-or-none discussion — directly addresses AP Bio 3.D.2.",
      "Frequency coding comparison: keep Stimulus Current above threshold, move Firing Rate from 1 Hz to higher values, and have students describe what changes in the voltage trace. Emphasize that signal intensity is represented by firing frequency, not by taller spikes.",
      "Preset prediction routine: before clicking each preset, ask students to predict whether they will see a single spike, repeated spikes, or no spike. Then use the observed trace to connect excitatory input, inhibitory input, threshold, and refractory recovery.",
      "Myelination disease modeling: drag Myelination from Normal to Partial to Demyelinated and ask students to predict what neurological symptoms would result from this loss. Connect to multiple sclerosis and use it as a misconception probe — students often think MS destroys neurons rather than their insulating sheath.",
      "Data collection on conduction timing: at Demyelinated, Partial, and Normal myelination levels, record the time between stimulus application and signal arrival at the axon terminal in the simulation. Calculate relative conduction velocity ratios and compare them to the idea of saltatory conduction.",
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
          "If tetrodotoxin blocks voltage-gated Na⁺ channels, no action potential can fire because the Na⁺ influx required for rapid depolarization is absent. In biological systems, TTX poisoning paralyzes voluntary muscles and can stop breathing by blocking motor neuron firing. The key mechanism is the same one shown during a normal spike: without functioning Na⁺ channels, the membrane cannot enter the positive-feedback depolarization phase that carries the signal down the axon.",
      },
      {
        question: "Does the Na⁺/K⁺ pump fire during every action potential to restore ion balance?",
        answer:
          "The pump runs continuously but is too slow to restore ion balance during any single action potential. Each spike moves only a tiny fraction of intracellular Na⁺ and K⁺ — a neuron can fire hundreds of times before ion gradients deplete measurably. The pump maintains the resting gradient over the long term, not on a spike-by-spike basis.",
      },
    ],
  },
};
