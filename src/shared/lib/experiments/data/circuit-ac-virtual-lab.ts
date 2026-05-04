import type { Experiment } from "@/shared/types/experiment";

export const circuitAcVirtualLab: Experiment = {
  id: "circuit-ac-virtual-lab",
  slug: "circuit-ac-virtual-lab",
  title: "AC Circuit Virtual Lab",
  subtitle: "Build and analyze AC circuits with real measurements",
  description:
    "Construct AC circuits with resistors, capacitors, and inductors using virtual lab equipment. Measure voltage and current with oscilloscopes, observe phase shifts, and analyze RLC circuit behavior.",
  thumbnail: "/imgs/experiments/dc-circuits.png",

  standards: {
    ngss: ["HS-PS3-2"],
    gcse: ["AQA P2.5"],
    ap: ["CHA-3.A", "CHA-3.B", "CHA-3.C", "CHA-3.D"],
  },
  primaryStandard: "ap-physics-2",
  category: "electricity",
  subject: "physics",
  gradeLevel: "AP",
  tags: ["AC circuit", "oscilloscope", "RLC", "impedance", "virtual lab", "phase shift"],
  difficulty: "advanced",

  parameters: [
    { id: "frequency", label: "Frequency", unit: "Hz", min: 10, max: 10000, default: 1000, step: 10, tier: "free" },
    { id: "resistance", label: "Resistance", unit: "Ω", min: 10, max: 1000, default: 100, step: 10, tier: "free" },
    { id: "inductance", label: "Inductance", unit: "mH", min: 1, max: 100, default: 25, step: 1, tier: "free" },
    { id: "capacitance", label: "Capacitance", unit: "μF", min: 1, max: 100, default: 1, step: 1, tier: "free" },
  ],

  formulas: [
    { latex: "Z = \\sqrt{R^2 + (X_L - X_C)^2}", description: "Impedance" },
    { latex: "\\phi = \\arctan\\left(\\frac{X_L - X_C}{R}\\right)", description: "Phase angle" },
    { latex: "I_{rms} = \\frac{V_{rms}}{Z}", description: "RMS current" },
  ],

  theory:
    "AC circuits require analysis with phasors and complex impedance. The total impedance Z of a series RLC circuit combines resistance R with inductive reactance X_L and capacitive reactance X_C. At resonance (X_L = X_C), impedance is purely resistive and current is maximized. An oscilloscope reveals phase relationships between voltage and current waveforms.",
  instructions:
    "Use only the four sliders: Frequency, Resistance, Inductance, and Capacitance. Tune the series RLC circuit while the oscilloscope, phasor diagram, and frequency-response graph update in real time, then adjust one slider at a time to compare how each parameter changes current, phase, impedance, and frequency response.",
  challenges: [
    { id: "ca-c1", question: "At 60 Hz, what is the capacitive reactance of a 100μF capacitor?", hint: "X_C = 1/(2π × 60 × 100×10⁻⁶)", tier: "free" },
    { id: "ca-c2", question: "Find the resonant frequency for L=100mH, C=100μF.", hint: "f₀ = 1/(2π√(LC))", tier: "free" },
    { id: "ca-c3", question: "At resonance, why is the voltage across L and C each larger than the source voltage?", hint: "V_L = IX_L; at resonance X_L can be >> R, so V_L >> V_source", tier: "pro" },
  ],

  wave: 8,
  tier: "pro",
  estimatedTime: 35,
  relatedExperiments: ["ac-circuits", "circuit-dc-virtual-lab", "dc-circuits-basic"],

  seoTitle: "AC Circuit Virtual Lab | RLC Circuits | AP Physics 2 Simulation",
  seoKeywords: ["AC circuit lab", "RLC circuit", "impedance", "oscilloscope", "AP Physics 2", "virtual lab"],
  jsonLd: { "@type": "LearningResource", educationalLevel: "High School", teaches: "AC Circuits, RLC, Impedance" },
  htmlControlAliases: { frequency: "sl-f", resistance: "sl-R", inductance: "sl-L", capacitance: "sl-C" },

  contentSections: {
    whatIsIt:
      "Pop the case off a guitar pedal or a cheap radio and you'll find the same three components staring back at you: resistors, capacitors, and inductors wired into an AC signal path. They are the building blocks of every analog filter, tuner, and power supply in the room. The catch is that AC current and AC voltage do not always peak at the same instant — capacitors make current lead voltage, inductors make it lag, and a real circuit blends both effects. This virtual lab gives you an oscilloscope, real component sliders, and a phasor diagram so you can see the phase shift as a number, a waveform, and a rotating arrow at the same time. Build a series RLC circuit, sweep the source frequency, and watch the impedance triangle rotate as the circuit slides through resonance.",
    parameterExplanations: {
      frequency:
        "Frequency sets how many AC cycles the source completes each second. In this lab it is the fastest way to move the same RLC circuit from capacitive behavior to inductive behavior. At low frequency, the capacitor's reactance is large and can dominate the phase shift; at high frequency, the inductor's reactance grows and can dominate instead. Somewhere between those extremes, X_L and X_C become equal, so the circuit is at resonance and the current reaches its maximum for the fixed 10 V source. Move only Frequency to see current, impedance, and phase change together.",
      resistance:
        "Resistance controls the real, energy-dissipating part of the circuit. Unlike inductive or capacitive reactance, resistance does not depend on frequency, so it sets the floor for total impedance at resonance. Lower resistance gives a larger current peak and a higher Q value, making the resonance curve narrower and more selective. Higher resistance damps the circuit, lowers the peak current, and makes the transition from capacitive to inductive behavior less sharp. Adjust only Resistance to isolate how damping changes the phasor diagram and the frequency-response graph.",
      inductance:
        "Inductance measures how strongly the coil opposes changes in current. The slider is shown in millihenries, while the calculation converts it to henries. As Inductance increases, inductive reactance X_L = 2πfL increases at the same frequency, so current tends to lag the source voltage more strongly. Larger L also lowers the resonant frequency because f_0 depends on 1/sqrt(LC). This makes the slider useful for showing that resonance is set by the pair of energy-storage components, not by resistance alone. Hold Capacitance fixed and raise Inductance to watch the resonance marker shift left on the graph.",
      capacitance:
        "Capacitance measures how much charge the capacitor stores for a given voltage. The slider is shown in microfarads, while the calculation converts it to farads. Increasing Capacitance lowers capacitive reactance X_C = 1/(2πfC), so the capacitor offers less opposition to AC current at the same frequency. It also lowers the resonant frequency when Inductance is unchanged, because a larger energy-storage capacity makes the LC exchange slower. Change only Capacitance to see how a larger capacitor changes current, phase angle, and the apparent filter cutoff.",
    },
    misconceptions: [
      {
        wrong:
          "In an AC circuit, voltage and current always peak at the same time, just like in a battery circuit.",
        correct:
          "Only in a pure resistor are V and I in phase. A capacitor makes the current peak before the voltage does (current leads), and an inductor makes the current peak after (current lags). The oscilloscope shows this as a horizontal shift between the two waves.",
      },
      {
        wrong:
          "Impedance is just the sum R + X_L + X_C — you add reactances like resistors in series.",
        correct:
          "Reactances are 90° out of phase with R, so you cannot just add them. Impedance is Z = √(R² + (X_L − X_C)²), which is the Pythagorean combination of the resistive and net reactive parts. That is why the phasor diagram is a right triangle.",
      },
      {
        wrong:
          "At resonance the capacitor and inductor stop doing anything because they cancel out.",
        correct:
          "They are still active — energy sloshes back and forth between them every cycle. What cancels is their net opposition to current, because X_L equals X_C. Each component still has a real, often very large, voltage across it; it just adds to zero around the LC pair.",
      },
      {
        wrong:
          "The voltage across an individual component can never be larger than the source voltage.",
        correct:
          "In a series RLC circuit at or near resonance, V_L and V_C can each be many times the fixed source amplitude. They are equal in magnitude but 180° out of phase, so they cancel in the loop equation while individually being large. This is the same selectivity principle used in tuned circuits such as radio receivers.",
      },
    ],
    teacherUseCases: [
      "Phase shift discovery: students keep Resistance, Inductance, and Capacitance fixed, then sweep Frequency across the resonance point. They record whether the circuit behaves more capacitive, resistive, or inductive and compare the sign of the phase angle to the phasor diagram.",
      "Resonance experiment: students use the sliders to set a series RLC circuit, then sweep Frequency below and above the computed peak in 10 to 20 steps. Students record V_R, V_L, V_C, and I at each step, plot the curves, and identify the resonant frequency.",
      "Misconception probe: at resonance, ask students to predict whether V_L will be smaller, equal, or larger than the source voltage. Many will say smaller; the simulation will show that V_L can be much larger when X_L >> R.",
      "Q-factor lab: students hold Frequency, Inductance, and Capacitance fixed, then change only Resistance. They should connect lower resistance with a sharper current-vs-frequency peak and stronger frequency selectivity.",
      "Filter comparison challenge: students vary Frequency and Capacitance one at a time, then explain how the response differs across settings using impedance and phase evidence.",
    ],
    faq: [
      {
        question: "Why does the oscilloscope show voltage and current shifted from each other in time?",
        answer:
          "Capacitors and inductors store energy instead of just dissipating it, and that storage takes time. A capacitor needs charge to build up before its voltage rises, so current peaks first and voltage lags by 90°. An inductor opposes changes in current, so when voltage peaks current is still climbing — current lags voltage by 90°. Mix these with a resistor and you get an intermediate phase shift between 0° and ±90°, which is what φ = arctan((X_L − X_C)/R) measures.",
      },
      {
        question: "How can the voltage across L or C be larger than the source voltage at resonance?",
        answer:
          "At resonance the current in the loop is large because impedance is at its minimum. The voltage across the inductor is V_L = I × X_L, and X_L can be many times larger than R, so V_L can exceed the fixed source amplitude. The same is true for V_C. Those two component voltages are opposite in phase, so when you go around the loop they cancel and Kirchhoff's voltage law is still satisfied.",
      },
      {
        question: "What is the difference between peak current and RMS current?",
        answer:
          "Peak current is the maximum instantaneous value the AC current reaches in a cycle. RMS current is what an AC ammeter reads and is what you plug into power formulas; for a sine wave I_rms = I_peak/√2. Use peak when you are sizing components for breakdown voltage; use RMS when you are calculating heat dissipation or matching DC equivalent values.",
      },
      {
        question: "How does this lab map to AP Physics 2 standard CHA-3.A and NGSS HS-PS3-2?",
        answer:
          "AP Physics 2 standard CHA-3.A asks students to analyze AC circuits using impedance, phase, and energy considerations, and CHA-3.B through CHA-3.D push them to reason quantitatively about RLC behavior. This virtual lab supports all of that by letting students vary R, L, C, and f and read Z, φ, and I directly. NGSS HS-PS3-2 covers energy transfer in electrical systems, which the lab illustrates through real vs. reactive power and the resonance peak.",
      },
      {
        question: "Why does the current peak at one specific frequency instead of growing with frequency?",
        answer:
          "Inductive reactance grows with frequency while capacitive reactance shrinks with frequency. Below resonance the circuit looks capacitive (X_C dominates), above resonance it looks inductive (X_L dominates), and at the one frequency where X_L = X_C the impedance is just R. That is the lowest impedance the circuit can have, so I = V/Z is at its maximum there. Move away from f_0 in either direction and the current drops off.",
      },
    ],
  },
};
