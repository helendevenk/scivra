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
    { id: "source_voltage", label: "Source Voltage (peak)", unit: "V", min: 1, max: 100, default: 10, step: 0.5, tier: "free" },
    { id: "frequency", label: "Frequency", unit: "Hz", min: 1, max: 10000, default: 60, step: 1, tier: "free" },
    { id: "resistance", label: "Resistance", unit: "Ω", min: 0, max: 1000, default: 100, step: 1, tier: "free" },
    { id: "capacitance", label: "Capacitance", unit: "μF", min: 0.1, max: 1000, default: 100, step: 0.1, tier: "pro" },
    { id: "inductance", label: "Inductance", unit: "mH", min: 0, max: 1000, default: 0, step: 1, tier: "pro" },
  ],

  formulas: [
    { latex: "Z = \\sqrt{R^2 + (X_L - X_C)^2}", description: "Impedance" },
    { latex: "\\phi = \\arctan\\left(\\frac{X_L - X_C}{R}\\right)", description: "Phase angle" },
    { latex: "I_{rms} = \\frac{V_{rms}}{Z}", description: "RMS current" },
  ],

  theory:
    "AC circuits require analysis with phasors and complex impedance. The total impedance Z of a series RLC circuit combines resistance R with inductive reactance X_L and capacitive reactance X_C. At resonance (X_L = X_C), impedance is purely resistive and current is maximized. An oscilloscope reveals phase relationships between voltage and current waveforms.",
  instructions:
    "Use the component toolbar to build your circuit. Connect the oscilloscope probes to measure waveforms. Adjust frequency to find resonance — the oscilloscope will show V and I in phase. The phasor diagram updates in real time.",
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

  contentSections: {
    whatIsIt:
      "Pop the case off a guitar pedal or a cheap radio and you'll find the same three components staring back at you: resistors, capacitors, and inductors wired into an AC signal path. They are the building blocks of every analog filter, tuner, and power supply in the room. The catch is that AC current and AC voltage do not always peak at the same instant — capacitors make current lead voltage, inductors make it lag, and a real circuit blends both effects. This virtual lab gives you an oscilloscope, real component sliders, and a phasor diagram so you can see the phase shift as a number, a waveform, and a rotating arrow at the same time. Build a series RLC circuit, sweep the source frequency, and watch the impedance triangle rotate as the circuit slides through resonance.",
    parameterExplanations: {
      source_voltage:
        "The peak voltage of the AC source in volts. RMS is V_peak/√2, so a 10 V peak source delivers about 7.07 V RMS. This sets the overall amplitude of every waveform you see on the oscilloscope.",
      frequency:
        "The driving frequency of the source in hertz. As you sweep it, X_L grows and X_C shrinks; resonance is the one frequency where they exactly cancel and current peaks.",
      resistance:
        "Pure ohmic resistance R in the loop, in ohms. Resistance is what dissipates real power and sets the minimum impedance of the circuit at resonance.",
      capacitance:
        "Capacitor value in microfarads. Larger C lowers capacitive reactance at any given frequency and shifts the resonant frequency downward, since f_0 = 1/(2π√LC).",
      inductance:
        "Inductor value in millihenries. Larger L raises inductive reactance at any frequency and also pulls the resonant frequency lower. Set this to 0 to model a simpler RC circuit.",
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
          "In a series RLC at or near resonance, V_L and V_C can each be many times the source voltage. They are equal in magnitude but 180° out of phase, so they cancel in the loop equation while individually being huge. This is the trick behind radio receivers and Tesla coils.",
      },
    ],
    teacherUseCases: [
      "Phase shift discovery: students set L = 0 and observe an RC circuit on the scope, then set C = 0 and look at an RL circuit. They record the sign and rough size of the phase shift in each case and compare to predictions.",
      "Resonance experiment: with default L and C, sweep frequency from 1 Hz to 1000 Hz in 10 to 20 steps, recording V_R, V_L, V_C, and I at each step. Students plot all three voltages vs. frequency and identify the resonant frequency.",
      "Misconception probe: at resonance, ask students to predict whether V_L will be smaller, equal, or larger than the source voltage. Many will say smaller; the simulation will show that V_L can be much larger when X_L >> R.",
      "Q-factor lab: have one team set R = 10 Ω and another set R = 200 Ω, both with the same L and C. Compare the sharpness of the current-vs-frequency peak and discuss bandwidth and selectivity in radio receivers.",
      "Filter design challenge: ask students to design an RC low-pass filter with a target cutoff frequency, set the components in the simulation, and verify by sweeping frequency that the output amplitude rolls off as expected.",
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
          "At resonance the current I in the loop is V_source/R, which can be quite large because impedance is at its minimum. The voltage across the inductor is V_L = I × X_L, and X_L can be many times R, so V_L easily exceeds V_source. The same is true for V_C. They are exactly opposite in phase, so when you go around the loop they cancel and Kirchhoff's voltage law is still satisfied.",
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
