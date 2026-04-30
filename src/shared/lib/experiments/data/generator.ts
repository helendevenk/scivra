import type { Experiment } from "@/shared/types/experiment";

export const generator: Experiment = {
  id: "generator",
  slug: "electric-generator-motor",
  title: "Generator",
  subtitle: "Convert mechanical energy to electrical energy",
  description:
    "Spin a coil in a magnetic field and generate alternating current. Explore how generators and motors work, observe AC output on an oscilloscope, and understand the energy conversion process.",
  thumbnail: "/imgs/experiments/electromagnetic-induction.png",

  standards: {
    ngss: ["HS-PS2-5", "HS-PS3-2"],
    gcse: ["AQA P7.6"],
    ap: ["CHA-5.A", "CHA-5.B", "CHA-5.D"],
  },
  primaryStandard: "ap-physics-2",
  category: "electricity",
  subject: "physics",
  gradeLevel: "AP",
  tags: ["generator", "motor", "electromagnetic induction", "AC current", "coil rotation", "energy conversion"],
  difficulty: "intermediate",

  parameters: [
    { id: "rotation_speed", label: "Rotation Speed", unit: "rpm", min: 0, max: 3000, default: 300, step: 10, tier: "free" },
    { id: "field_strength", label: "Field Strength", unit: "T", min: 0.1, max: 2, default: 0.5, step: 0.1, tier: "free" },
    { id: "coil_turns", label: "Coil Turns", unit: "N", min: 1, max: 200, default: 50, step: 5, tier: "free" },
    { id: "coil_area", label: "Coil Area", unit: "cm²", min: 1, max: 100, default: 20, step: 1, tier: "pro" },
  ],

  formulas: [
    { latex: "\\mathcal{E}(t) = NBA\\omega\\sin(\\omega t)", description: "Generator EMF" },
    { latex: "\\omega = 2\\pi f", description: "Angular frequency" },
    { latex: "\\mathcal{E}_{max} = NBA\\omega", description: "Peak EMF" },
  ],

  theory:
    "An electric generator converts mechanical energy to electrical energy by rotating a coil in a magnetic field. The changing magnetic flux induces an alternating EMF proportional to the number of turns N, field strength B, coil area A, and angular velocity ω. This is the reverse of a motor. The output frequency equals the rotation frequency — 60 Hz for US power grids requires 3600 rpm (or 1800 rpm with 4-pole machines).",
  instructions:
    "Adjust the rotation speed slider and observe the AC output on the oscilloscope. Increase field strength or coil turns to boost the peak voltage. Switch to motor mode — now the external AC drives rotation instead.",
  challenges: [
    { id: "ge-c1", question: "A coil with N=100, B=0.5T, A=0.01m² spins at 60Hz. What is the peak EMF?", hint: "ε_max = NBAω = 100 × 0.5 × 0.01 × 2π×60 ≈ 188 V", tier: "free" },
    { id: "ge-c2", question: "Why does the EMF vary as sin(ωt) and not cos(ωt)?", hint: "It depends on the starting angle — 0° at t=0 when coil is parallel to field gives sin", tier: "free" },
    { id: "ge-c3", question: "Why do wind turbines use permanent magnet generators instead of electromagnets?", hint: "Permanent magnets need no excitation power and work even when grid is down", tier: "pro" },
  ],

  wave: 8,
  tier: "free",
  estimatedTime: 20,
  relatedExperiments: ["faradays-electromagnetic-lab", "electromagnetic-induction", "ac-circuits"],

  seoTitle: "Electric Generator Simulation | Faraday's Law | AP Physics 2",
  seoKeywords: ["electric generator", "motor", "electromagnetic induction", "AC current", "Faraday's law", "AP Physics 2"],
  jsonLd: { "@type": "LearningResource", educationalLevel: "High School", teaches: "Electric Generator, Faraday's Law, AC Generation" },

  contentSections: {
    whatIsIt:
      "Every kilowatt-hour on your power bill came from a coil of wire spinning inside a magnetic field — that is what a generator is, whether it's hooked to a steam turbine in a coal plant, a propeller in a wind farm, or a hand crank on an emergency radio. Reverse the energy flow and the same machine becomes a motor: send AC into the coil and it spins, doing useful work on whatever is connected to its shaft. The two devices share the same physics, the same magnets, and often the same hardware, separated only by which side of the energy conversion you start from. This lab lets you spin a virtual coil at variable rpm in an adjustable magnetic field, watch the AC output curl across an oscilloscope as a clean sine wave, then flip into motor mode and feel how electrical input drives mechanical rotation. Crank the speed up and the peak voltage and frequency rise together.",
    parameterExplanations: {
      rotation_speed:
        "How fast the coil rotates, in revolutions per minute. The output frequency in hertz equals rpm/60 (for a single-pole-pair machine), and peak EMF scales linearly with angular velocity ω.",
      field_strength:
        "Magnetic field B between the magnets in tesla. Peak EMF is proportional to B, so doubling B doubles output voltage at any rotation speed without changing frequency.",
      coil_turns:
        "Number of loops in the rotating coil, N. Each turn contributes equally to the induced EMF, so peak voltage is proportional to N — that is why real generators wind hundreds or thousands of turns.",
      coil_area:
        "Cross-sectional area of the coil in square centimeters. Larger area means more flux through the coil at any orientation, and peak EMF scales linearly with A.",
    },
    misconceptions: [
      {
        wrong:
          "A generator and a motor are different machines that happen to use similar parts.",
        correct:
          "They are the same machine running in opposite directions. Spin the shaft of a motor and it generates EMF; force current into a generator's coil and it produces torque on the shaft. The hardware difference between an AC motor and an AC generator is often nothing — only the energy flow distinguishes them.",
      },
      {
        wrong:
          "Generators output a steady DC voltage like a battery.",
        correct:
          "A coil rotating in a steady magnetic field produces sinusoidal AC, because the flux through the coil varies as cos(ωt) and its derivative is -ω·sin(ωt). DC output requires either rectification (diodes) or a commutator (split-ring contacts) to flip the connection at every half-rotation.",
      },
      {
        wrong:
          "Spinning the coil twice as fast doubles only the voltage.",
        correct:
          "It doubles both the peak voltage and the output frequency. Peak EMF is NBA·ω, and ω = 2πf, so frequency tracks the rotation speed exactly. That's why grid generators have to be locked to a precise rpm: 3600 rpm for 60 Hz on US grids with a single pole pair, or 1800 rpm for a four-pole machine.",
      },
      {
        wrong:
          "If the magnets are stronger, the generator outputs higher frequency.",
        correct:
          "Magnet strength only changes amplitude, not frequency. Frequency is set entirely by how fast you rotate the coil. If you want 60 Hz output you need exactly 3600 rpm (single pole pair); stronger magnets just make those 60 Hz oscillations bigger in voltage.",
      },
    ],
    teacherUseCases: [
      "Peak-EMF predictor: students compute ε_max = NBA·ω from the formula sheet for a given setting, then run the simulation and read peak voltage off the oscilloscope. They tabulate predicted vs. measured for at least five settings and discuss any systematic differences.",
      "Frequency-rpm relationship investigation: have students set N, B, and A to fixed values, then sweep rpm in 200 rpm steps. They record output frequency, plot f vs. rpm, and confirm the slope corresponds to 1/60 (Hz per rpm).",
      "Misconception probe on motor vs. generator: ask students 'is there a physical difference between a motor and a generator?' before flipping the simulation into motor mode. Use the same hardware running both ways as the discussion entry point.",
      "Energy-conversion data collection: at three rotation speeds, students record peak voltage, RMS voltage, peak current into a known load, and compute average power. They compare power output to qualitative mechanical input (how hard the crank would feel).",
      "Grid-connection design problem: ask 'how would you build a generator that outputs exactly 60 Hz from a wind turbine spinning at 15 rpm?' This opens up the multi-pole-pair concept and gearboxes used in real wind farms.",
    ],
    faq: [
      {
        question: "Why does a coil rotating in a uniform magnetic field produce alternating current and not direct current?",
        answer:
          "As the coil rotates, the flux through it varies sinusoidally as Φ = BA·cos(ωt). Faraday's Law gives EMF = -N·dΦ/dt = NBA·ω·sin(ωt), which is also sinusoidal but shifted 90° in phase. The output crosses zero, swings positive, crosses zero again, and swings negative once per rotation. The only way to get DC out of this same hardware is to add a commutator that flips the connection every half-cycle, or to use external diodes to rectify.",
      },
      {
        question: "Why is the peak EMF proportional to all four of N, B, A, and ω?",
        answer:
          "Faraday's Law states ε = -N·dΦ/dt with Φ = BA·cos(ωt). Differentiating gives ε = NBA·ω·sin(ωt), so the amplitude NBA·ω contains all four factors as a product. That is why real generators stack as many turns as practical, use the strongest magnets they can afford, build large-area rotors, and run at high rpm — every factor multiplies the output. There is no way to get high voltage without scaling at least one of them.",
      },
      {
        question: "How is a US 60 Hz generator different from a European 50 Hz one?",
        answer:
          "Mechanically, only the rotation speed. A single pole-pair generator running at 3600 rpm gives 60 Hz; at 3000 rpm it gives 50 Hz. Most large grid generators have multiple pole pairs, so a 4-pole machine runs at 1800 rpm for 60 Hz or 1500 rpm for 50 Hz. Once frequency is set, every appliance, transformer, and motor in the grid is designed around it, which is why you can't just plug a 60 Hz appliance into a 50 Hz outlet without checking compatibility.",
      },
      {
        question: "How does this experiment connect to AP Physics 2 standard CHA-5.A and NGSS HS-PS2-5?",
        answer:
          "AP Physics 2 standard CHA-5.A asks students to apply Faraday's Law to predict induced EMF in a rotating coil, and CHA-5.B and CHA-5.D extend that to energy conversion in generators and motors. NGSS HS-PS2-5 covers the evidence that changing magnetic fields produce electric currents. This lab supports both by letting students manipulate N, B, A, and rpm and read the resulting sinusoidal output, while motor mode lets them see the reverse conversion of electrical energy into mechanical motion.",
      },
      {
        question: "Why do wind turbines often use permanent magnet generators rather than electromagnets?",
        answer:
          "Permanent magnets need no excitation current and no auxiliary power supply, which means a direct-drive permanent-magnet generator can produce power even when there is no grid connection — useful when the turbine is starting up or running off-grid. They also have no field windings to short out and no slip rings to wear, lowering maintenance. The trade-off is cost and weight, since rare-earth magnets are expensive and heavy, but for variable-speed wind applications the simplicity often wins out.",
      },
    ],
  },
};
