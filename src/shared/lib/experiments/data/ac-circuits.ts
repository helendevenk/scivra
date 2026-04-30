import type { Experiment } from "@/shared/types/experiment";

export const acCircuits: Experiment = {
  id: "ac-circuits",
  slug: "ac-circuits-simulation",
  title: "AC Circuits",
  subtitle: "Explore alternating current, capacitors, and inductors",
  description:
    "Investigate AC circuits with resistors, capacitors, and inductors. Observe phase relationships between voltage and current, measure impedance, and explore resonance in LC circuits.",
  thumbnail: "/imgs/experiments/dc-circuits.png",

  standards: {
    ngss: ["HS-PS3-2", "HS-PS3-5"],
    gcse: ["AQA P2.5"],
    ap: ["CHA-3.A", "CHA-3.B", "CHA-3.C"],
  },
  primaryStandard: "ap-physics-2",
  category: "electricity",
  subject: "physics",
  gradeLevel: "AP",
  tags: ["AC circuits", "impedance", "capacitor", "inductor", "resonance", "phase"],
  difficulty: "advanced",

  parameters: [
    { id: "frequency", label: "Frequency", unit: "Hz", min: 1, max: 1000, default: 60, step: 1, tier: "free" },
    { id: "resistance", label: "Resistance", unit: "Ω", min: 1, max: 1000, default: 100, step: 1, tier: "free" },
    { id: "capacitance", label: "Capacitance", unit: "μF", min: 0.1, max: 100, default: 10, step: 0.1, tier: "free" },
    { id: "inductance", label: "Inductance", unit: "mH", min: 1, max: 500, default: 100, step: 1, tier: "pro" },
  ],

  formulas: [
    { latex: "X_C = \\frac{1}{2\\pi f C}", description: "Capacitive reactance" },
    { latex: "X_L = 2\\pi f L", description: "Inductive reactance" },
    { latex: "Z = \\sqrt{R^2 + (X_L - X_C)^2}", description: "Impedance" },
    { latex: "f_0 = \\frac{1}{2\\pi\\sqrt{LC}}", description: "Resonant frequency" },
  ],

  theory:
    "In AC circuits, capacitors and inductors create frequency-dependent opposition called reactance. Capacitive reactance decreases with frequency while inductive reactance increases. At resonance, they cancel each other and only resistance limits current. Understanding AC circuits is essential for power systems, radio communications, and signal processing.",
  instructions:
    "Adjust frequency and observe how impedance changes. At resonance frequency, current reaches its maximum. The phasor diagram shows phase angles between voltage and current for each component.",
  challenges: [
    { id: "ac-c1", question: "At what frequency is capacitive reactance equal to resistance?", hint: "Set X_C = R and solve for f", tier: "free" },
    { id: "ac-c2", question: "Find the resonant frequency for L=100mH, C=10μF", hint: "Use f₀ = 1/(2π√LC)", tier: "free" },
    { id: "ac-c3", question: "How does power factor change near resonance?", hint: "Power factor = R/Z", tier: "pro" },
  ],

  wave: 8,
  tier: "pro",
  estimatedTime: 30,
  relatedExperiments: ["dc-circuits-basic", "electromagnetic-induction", "faradays-electromagnetic-lab"],

  seoTitle: "AC Circuits Interactive Simulation | AP Physics 2 Virtual Lab",
  seoKeywords: ["AC circuits", "impedance", "resonance", "AP Physics 2", "capacitor inductor", "alternating current"],
  jsonLd: { "@type": "LearningResource", educationalLevel: "High School", teaches: "AC Circuits, Impedance, Resonance" },

  contentSections: {
    whatIsIt:
      "Look at the back of your phone charger and you'll find two voltage labels — one for the wall outlet (120 V AC) and one for what gets sent to your phone (5 V DC). The wall outlet is the alternating-current side: 60 times every second, the voltage swings from positive to negative and back, pushing electrons forward, then yanking them backward through your home wiring. Once you add a capacitor or an inductor to that AC line, things get strange. Capacitors fight low-frequency signals but pass high-frequency ones; inductors do the opposite. At one special frequency, called resonance, the two effects cancel and current shoots up. This lab lets you spin the frequency dial on a virtual RLC circuit and watch reactance, impedance, and current respond in real time, including the resonance peak that radio receivers and tuned filters depend on.",
    parameterExplanations: {
      frequency:
        "How many times per second the AC source flips polarity, in hertz. The default 60 Hz matches US wall power. Sweeping frequency is how you find the resonance peak, where capacitive and inductive reactance cancel.",
      resistance:
        "Pure ohmic resistance R, the part of the circuit that dissipates power as heat. Resistance does not depend on frequency, but it sets the height and width of the resonance peak — bigger R, blunter peak.",
      capacitance:
        "Stores charge on plates and pushes back on AC with reactance X_C = 1/(2πfC). Bigger capacitance means lower reactance, especially at high frequency, so the capacitor looks more and more like a wire as f rises.",
      inductance:
        "A coil that resists changes in current via X_L = 2πfL. Bigger inductance means more opposition to high-frequency current, so the inductor acts like a wire at DC and like a near-open circuit at very high f.",
    },
    misconceptions: [
      {
        wrong:
          "AC and DC are two different kinds of electricity made of different particles.",
        correct:
          "Same electrons, different motion. In DC the charges drift steadily in one direction. In AC they oscillate back and forth — in US wiring, 60 full cycles every second. Nothing about the charges themselves changes; only the push driving them flips sign.",
      },
      {
        wrong:
          "A 120 V wall outlet means the voltage is sitting at 120 V, just like a battery.",
        correct:
          "120 V is the RMS value of an oscillating sine wave. The peak is V_peak = V_rms × √2 ≈ 170 V, and the voltage spends just as much time negative as positive. RMS is the equivalent DC voltage that would deliver the same average power.",
      },
      {
        wrong:
          "Capacitors and inductors block AC current the same way resistors block DC current.",
        correct:
          "Their opposition is called reactance and it depends on frequency. X_C shrinks as f grows; X_L grows as f grows. They also store and return energy to the circuit instead of dissipating it as heat the way a resistor does.",
      },
      {
        wrong:
          "At resonance, the circuit must have a huge resistance because so much is happening.",
        correct:
          "It is the opposite. At resonance X_L equals X_C and they cancel, leaving only R as the impedance. That is the smallest the circuit's total opposition can be at any frequency, which is why current peaks there.",
      },
    ],
    teacherUseCases: [
      "Resonance hunt: have students sweep frequency from 10 Hz to 1000 Hz with the default L and C and record the current at every step. They should plot I vs f and identify the resonant frequency, then compare to the predicted f_0 = 1/(2π√LC).",
      "Misconception probe on RMS vs peak: ask 'if the lab shows a 10 V peak source, what does a normal AC voltmeter read?' Get students to predict before looking, then compare their answer to V_peak/√2.",
      "Data collection assignment: at three frequencies (well below resonance, at resonance, well above), record X_C, X_L, Z, and I, then compute power factor R/Z and compare across the three points.",
      "Component intuition: lock everything else and double the capacitance. Ask students to predict whether the resonant frequency goes up or down, then verify in the simulation. Same drill for doubling inductance.",
      "Engineering bridge: discuss why old-style radio tuners were a variable capacitor in series with a fixed coil. Have students change C in the simulation to model 'tuning' to a different station's frequency.",
    ],
    faq: [
      {
        question: "What does the resonant frequency depend on, and why doesn't resistance show up in the formula?",
        answer:
          "The resonant frequency is f_0 = 1/(2π√LC). It depends only on L and C because resonance is defined as the frequency where X_L equals X_C, and both reactances are set entirely by L, C, and f — resistance never enters that condition. Resistance still matters because it controls how sharp and how tall the current peak at resonance is, but it cannot shift where the peak sits.",
      },
      {
        question: "Why is the peak voltage in an outlet ~170 V if the label says 120 V?",
        answer:
          "AC voltage is a sine wave that swings between +V_peak and -V_peak. RMS (root mean square) is the constant DC voltage that would deliver the same average power into a pure resistor, and for a sine wave V_rms = V_peak/√2. So 120 V RMS corresponds to V_peak = 120 × √2 ≈ 170 V. Appliance ratings, breakers, and meters are almost always RMS so engineers can use the same power formulas as DC.",
      },
      {
        question: "How does capacitive reactance change when I crank the frequency way up?",
        answer:
          "It drops. X_C = 1/(2πfC) is inversely proportional to frequency, so doubling f cuts X_C in half, and at very high frequency the capacitor looks almost like a plain wire. That is why capacitors are used as 'AC bypasses' — they let high-frequency signal pass while still blocking DC, since at f = 0 the reactance is infinite.",
      },
      {
        question: "How does this experiment connect to AP Physics 2 standards CHA-3.A through CHA-3.C?",
        answer:
          "AP Physics 2 expects students to model AC circuits with resistors, capacitors, and inductors, compute reactance and impedance, and explain phase relationships between voltage and current — that is exactly what CHA-3.A through CHA-3.C cover. This lab supports those targets by letting students manipulate f, R, L, and C and see the resulting Z, I, and phase change in real time, which is also aligned with NGSS HS-PS3-2 on energy transfer in electrical systems.",
      },
      {
        question: "What is impedance, and how is it different from resistance?",
        answer:
          "Impedance Z is the total opposition an AC circuit gives to current and is measured in ohms, just like resistance. The difference is that Z combines R with the reactances of capacitors and inductors using Z = √(R² + (X_L − X_C)²). Resistance dissipates energy as heat, while reactance stores and returns energy each cycle, so Z is generally larger than R alone except at resonance, where the reactances cancel and Z = R.",
      },
    ],
  },
};
