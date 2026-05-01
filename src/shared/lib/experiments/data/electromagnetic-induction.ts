import type { Experiment } from "@/shared/types/experiment";

export const electromagneticInduction: Experiment = {
  id: "electromagnetic-induction",
  slug: "electromagnetic-induction-faradays-law-lenz",
  title: "Electromagnetic Induction",
  subtitle: "See how changing magnetic flux generates EMF — Faraday's and Lenz's Laws in action",
  description:
    "Rotate a coil inside a magnetic field and observe the sinusoidal EMF produced. Adjust field strength, coil turns, angular velocity, and area to explore Faraday's Law quantitatively and discover why Lenz's Law is a direct consequence of energy conservation.",
  thumbnail: "/imgs/experiments/electromagnetic-induction.png",

  standards: {
    ngss: ["HS-PS2-5", "HS-PS3-5"],
    gcse: ["P7.3", "P7.4"],
    ap: ["CHA-4.B", "CHA-4.C", "CHA-4.D"],
  },
  primaryStandard: "ap-physics-c",
  category: "electricity",
  subject: "physics",
  gradeLevel: "AP",
  tags: [
    "electromagnetic induction",
    "Faraday's law",
    "Lenz's law",
    "magnetic flux",
    "EMF",
    "generator",
    "coil",
  ],
  difficulty: "advanced",

  parameters: [
    {
      id: "B_field",
      label: "Magnetic Field",
      unit: "T",
      min: 0.1,
      max: 2.0,
      default: 0.5,
      step: 0.1,
      tier: "free",
    },
    {
      id: "rotation_speed",
      label: "Angular Velocity",
      unit: "rad/s",
      min: 0.1,
      max: 10,
      default: 2,
      step: 0.1,
      tier: "free",
    },
    {
      id: "coil_turns",
      label: "Turns (N)",
      unit: "",
      min: 1,
      max: 200,
      default: 50,
      step: 1,
      tier: "pro",
    },
    {
      id: "coil_area",
      label: "Coil Area",
      unit: "cm²",
      min: 10,
      max: 500,
      default: 100,
      step: 10,
      tier: "pro",
    },
  ],

  formulas: [
    {
      latex: "\\Phi = B \\cdot A \\cdot \\cos(\\theta)",
      description: "Magnetic Flux",
    },
    {
      latex: "\\varepsilon = -N\\frac{d\\Phi}{dt}",
      description: "Faraday's Law of Induction",
    },
    {
      latex: "\\varepsilon = NBA\\omega\\sin(\\omega t)",
      description: "Peak EMF for rotating coil",
    },
    {
      latex: "\\text{Lenz's Law: induced current opposes change in flux}",
      description: "Direction of induced current",
    },
  ],

  theory:
    "Faraday's Law states that the induced EMF in a coil equals the negative rate of change of magnetic flux through it: ε = −N dΦ/dt. For a coil of N turns and area A rotating at angular velocity ω in field B, the flux varies as Φ = BA cos(ωt), giving a peak EMF of NBAω. Lenz's Law determines the polarity of the induced EMF: it always opposes the change that caused it, which is a direct statement of energy conservation.",
  instructions:
    "Use the B field and angular velocity sliders to change the EMF waveform and watch the real-time graph. Unlock Pro mode to vary coil turns and area, then verify that peak EMF scales linearly with each parameter.",

  challenges: [
    {
      id: "ei-c1",
      question:
        "A single-turn coil of area 0.01 m² rotates at ω = 10 rad/s in B = 0.5 T. What is the peak EMF?",
      hint: "Use ε_peak = NBAω with N = 1",
      tier: "free",
    },
    {
      id: "ei-c2",
      question: "What physical law does Lenz's Law ultimately conserve?",
      hint: "Think about what would happen if induced current aided the flux change",
      tier: "free",
    },
    {
      id: "ei-c3",
      question: "If the number of turns N is doubled, how does the peak EMF change?",
      hint: "Look at the formula ε_peak = NBAω",
      tier: "pro",
    },
  ],

  wave: 7,
  tier: "pro",
  estimatedTime: 30,
  relatedExperiments: ["lorentz-force", "dc-circuits-basic", "electric-field-lines"],

  seoTitle: "Electromagnetic Induction — Faraday's Law & Lenz's Law Simulation | Scivra",
  seoKeywords: [
    "electromagnetic induction",
    "Faraday's law",
    "Lenz's law",
    "magnetic flux",
    "induced EMF",
    "generator simulation",
    "AP Physics electricity",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "High School",
    teaches: "Electromagnetic Induction, Faraday's Law, and Lenz's Law",
  },
  contentSections: {
    whatIsIt:
      "Faraday's Law of Induction states that the EMF induced in a coil equals the negative rate of change of magnetic flux through it: ε = −N dΦ_B/dt. Flux Φ_B = BA cos θ changes whenever B changes, the coil area changes, or the coil rotates relative to B. For a coil of N turns and area A spinning at angular velocity ω in field B, Φ_B(t) = BA cos(ωt) and the induced EMF is ε(t) = NBAω sin(ωt) — a sinusoid whose peak grows with all four parameters. Lenz's Law gives the minus sign physical meaning: the induced current always flows in the direction that opposes the flux change, a direct consequence of energy conservation. The simulation plots the live EMF waveform as you adjust B_field, rotation_speed, coil_turns, and coil_area.",
    parameterExplanations: {
      B_field:
        "Magnetic field strength in tesla. Peak EMF scales as ε_peak = NBAω, so doubling B_field doubles the amplitude of the sinusoidal EMF output. This also doubles dΦ/dt at every instant, which you can observe as the waveform's amplitude stretching vertically.",
      rotation_speed:
        "Angular velocity ω in rad/s. Increasing ω does two things simultaneously: it increases the rate of flux change — dΦ_B/dt = −BAω sin(ωt) per turn, so |ε| = N|dΦ_B/dt| has peak NBAω — and it compresses the sinusoidal waveform horizontally, so the oscillation frequency and amplitude both rise together.",
      coil_turns:
        "Number of turns N in the coil. Faraday's Law sums contributions from all N loops: ε = −N dΦ_B/dt, so peak EMF scales exactly linearly with coil_turns. Doubling N from 50 to 100 doubles the output voltage without changing the waveform shape or frequency.",
      coil_area:
        "Cross-sectional area of the coil in cm². Flux Φ_B = BA cos(ωt) is proportional to area, so peak EMF ε_peak = NBAω scales linearly with coil_area as well. Larger area means more field lines threading the coil per turn, producing a proportionally larger EMF.",
    },
    misconceptions: [
      {
        wrong:
          "Faraday's Law and Lenz's Law are two separate laws that both describe electromagnetic induction.",
        correct:
          "Lenz's Law is not a separate empirical law — it is the physical interpretation of the minus sign in Faraday's equation ε = −N dΦ_B/dt. The minus sign mandates that the induced EMF drives a current that opposes the change in flux; Lenz's Law simply names that opposition. If the induced current aided the flux change, energy would be created from nothing.",
      },
      {
        wrong:
          "The induced EMF is largest when the magnetic flux through the coil is largest (coil face perpendicular to B).",
        correct:
          "EMF = −dΦ/dt is maximum when flux is CHANGING fastest, not when flux itself is maximum. Φ = BA cos(ωt) is largest when the coil face is perpendicular to B (θ = 0), but its rate of change — NBAω sin(ωt) — is largest a quarter-turn later when θ = 90° (the coil face is parallel to B and the coil plane contains B). Maximum flux and maximum EMF are 90° out of phase.",
      },
      {
        wrong:
          "A stationary coil in a changing magnetic field doesn't follow Faraday's Law — that only applies to moving coils.",
        correct:
          "Faraday's Law applies to any change in flux: ε = −N dΦ_B/dt. dΦ can arise from changing B (transformer action), changing area, or changing orientation. A stationary coil in a time-varying B field is the basis of transformer operation — the coil need not move at all.",
      },
      {
        wrong:
          "Lenz's Law means the induced current always flows opposite to the current that created B.",
        correct:
          "Lenz's Law says the induced current opposes the change in flux, not the original current. If B is increasing, the induced current creates a field opposing the increase (opposing B). If B is decreasing, the induced current creates a field supporting B (in the same direction as the original field). The direction depends on whether flux is increasing or decreasing.",
      },
      {
        wrong:
          "Doubling the rotation speed doubles the period of the EMF oscillation.",
        correct:
          "Doubling ω halves the period T = 2π/ω — the oscillation gets faster, not slower. It also doubles the peak EMF through the ω factor in ε_peak = NBAω. Both frequency and amplitude increase together when angular velocity rises.",
      },
    ],
    teacherUseCases: [
      "Peak EMF prediction before simulation: have students compute ε_peak = NBAω for the default settings (B = 0.5 T, ω = 2 rad/s, N = 50, A = 100 cm² = 0.01 m²) before running the simulation. Expected result: ε_peak = 50 × 0.5 × 0.01 × 2 = 0.5 V. Then run the simulation and compare the displayed waveform amplitude to their prediction.",
      "Linear scaling verification: fix three parameters and sweep the fourth across its range, recording ε_peak at each step. Students should find a straight line through the origin in all four cases, directly verifying the factored form ε_peak = NBAω and distinguishing it from quadratic or threshold dependencies.",
      "Lenz's Law direction probe: pause the coil at 90° rotation (coil face parallel to B, maximum dΦ/dt) and ask students to determine the direction of induced current using Lenz's Law before the simulation reveals it. Then discuss: if the induced current aided rather than opposed the flux change, where would the energy come from?",
      "Waveform decomposition: ask students why the EMF is sinusoidal and not, for example, triangular or square. Walk through Φ(t) = NBA cos(ωt) → dΦ/dt = −NBAω sin(ωt), connecting the derivative of cosine to sine and to the shape they see on the display. This reinforces calculus-based differentiation in a physical context addressing CHA-4.B.",
      "Flux vs. EMF phase relationship: overlay the Φ_B(t) and ε(t) curves and ask students to identify the 90° phase shift between them. Confirm that peak flux corresponds to zero EMF and zero flux (maximum rate of change) corresponds to peak EMF, directly connecting the mathematical dΦ/dt to the physical waveform they observe.",
    ],
    faq: [
      {
        question: "What is the difference between magnetic flux and induced EMF?",
        answer:
          "Magnetic flux Φ_B = BA cos θ is the total field threading a surface — measured in webers (Wb = T·m²). Induced EMF ε = −N dΦ_B/dt is the rate at which flux changes through all N turns — measured in volts. Flux can be large (coil face perpendicular to B) while EMF is zero; EMF is maximum when flux is changing fastest, which for a rotating coil occurs when the coil face is parallel to B.",
      },
      {
        question: "What AP Physics C standards does this simulation cover?",
        answer:
          "The simulation addresses CHA-4.B (Faraday's Law: ε = −dΦ_B/dt, sources of flux change), CHA-4.C (Lenz's Law and the direction of induced current and EMF), and CHA-4.D (motional EMF and applications including generators). All three codes appear in the experiment's standards.ap[] array.",
      },
      {
        question: "Why does the EMF formula have a negative sign?",
        answer:
          "The negative sign encodes Lenz's Law: the induced EMF drives a current that generates a magnetic field opposing the change in flux. Without the negative sign, Faraday's Law would predict runaway amplification — induced current would increase flux, which would induce more current, violating conservation of energy. The minus sign is a mathematical statement that nature resists changes in flux.",
      },
      {
        question: "How does a real electric generator use this principle?",
        answer:
          "A generator rotates a coil (or magnet) so that Φ_B(t) = NBA cos(ωt) oscillates continuously, producing ε(t) = NBAω sin(ωt). Peak EMF = NBAω, so increasing field strength B, coil area A, number of turns N, or rotation speed ω all raise output voltage. Power grids run at ω = 2π × 60 rad/s (60 Hz in North America); the NBAω product is engineered to deliver the required grid voltage.",
      },
      {
        question: "What are eddy currents and how do they relate to Faraday's Law?",
        answer:
          "When a conducting (but non-coiled) material sits in a changing magnetic flux, Faraday's Law still applies — the material itself acts as a collection of closed loops. The induced currents that circulate inside the conductor are called eddy currents. They dissipate energy as heat (Joule heating) and by Lenz's Law create forces that oppose the motion causing the flux change — the principle behind magnetic braking in trains and induction cooktops.",
      },
      {
        question: "If I double both coil_turns and coil_area, how does peak EMF change?",
        answer:
          "Peak EMF = NBAω, so doubling N multiplies by 2 and doubling A multiplies by another 2, giving a net factor of 4. Set coil_turns to twice its starting value and coil_area to twice its starting value and confirm that the waveform amplitude quadruples. The relationship is strictly linear in each parameter independently.",
      },
    ],
  },
};
