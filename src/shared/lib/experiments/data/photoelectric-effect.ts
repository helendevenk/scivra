import type { Experiment } from "@/shared/types/experiment";

export const photoelectricEffect: Experiment = {
  id: "photoelectric-effect",
  slug: "photoelectric-effect-photon-energy-work-function",
  title: "Photoelectric Effect",
  subtitle: "Discover how light frequency — not intensity — ejects electrons",
  description:
    "Illuminate metal surfaces with light of varying frequency and intensity. Observe that photoelectrons only appear above a threshold frequency, and measure stopping voltage to determine maximum kinetic energy.",
  thumbnail: "/imgs/experiments/photoelectric-effect.png",

  standards: {
    ngss: ["HS-PS4-3", "HS-PS4-4"],
    gcse: ["P8.1", "P8.2"],
    ap: ["MOD-1.A", "MOD-1.B", "MOD-1.C"],
  },
  primaryStandard: "ap-physics-2",
  category: "modern",
  subject: "physics",
  gradeLevel: "AP",
  tags: [
    "photoelectric effect",
    "photon",
    "work function",
    "quantum mechanics",
    "Einstein",
    "threshold frequency",
    "stopping voltage",
  ],
  difficulty: "intermediate",

  parameters: [
    {
      id: "light_frequency",
      label: "Light Frequency",
      unit: "×10¹⁴ Hz",
      min: 4,
      max: 10,
      default: 6,
      step: 0.1,
      tier: "free",
    },
    {
      id: "light_intensity",
      label: "Light Intensity",
      unit: "W/m²",
      min: 1,
      max: 100,
      default: 50,
      step: 1,
      tier: "free",
    },
    {
      id: "metal_type",
      label: "Metal (0=Na φ=2.28eV, 1=Al φ=4.08eV, 2=Cu φ=4.5eV)",
      unit: "",
      min: 0,
      max: 2,
      default: 0,
      step: 1,
      tier: "pro",
    },
    {
      id: "stopping_voltage",
      label: "Stopping Voltage",
      unit: "V",
      min: 0,
      max: 5,
      default: 0,
      step: 0.1,
      tier: "pro",
    },
  ],

  formulas: [
    {
      latex: "E = hf \\quad (h = 6.626 \\times 10^{-34}\\,\\text{J·s})",
      description: "Photon Energy",
    },
    {
      latex: "KE_{max} = hf - \\varphi",
      description: "Einstein Photoelectric Equation",
    },
    {
      latex: "eV_{stop} = KE_{max}",
      description: "Stopping Voltage relation",
    },
    {
      latex: "f_{threshold} = \\frac{\\varphi}{h}",
      description: "Threshold Frequency",
    },
  ],

  theory:
    "Einstein's 1905 explanation of the photoelectric effect treats light as discrete photons each carrying energy E = hf. An electron can only escape the metal surface if a single photon supplies energy exceeding the work function φ. Intensity controls how many photons arrive per second but does not increase individual photon energy, so higher intensity below threshold still produces zero photoelectrons.",
  instructions:
    "Increase light frequency until the electron counter starts registering — that is the threshold frequency. Note that raising intensity below threshold never produces electrons. Switch to Pro mode to select different metals and measure the stopping voltage that exactly halts the fastest electrons.",

  challenges: [
    {
      id: "pe-c1",
      question:
        "Why does increasing light intensity below the threshold frequency produce NO photoelectrons?",
      hint: "Think about what a single photon's energy depends on",
      tier: "free",
    },
    {
      id: "pe-c2",
      question:
        "Sodium has a work function φ = 2.28 eV. What is the minimum threshold frequency?",
      hint: "Use f_threshold = φ/h, convert φ to joules first",
      tier: "free",
    },
    {
      id: "pe-c3",
      question:
        "Light of f = 5 × 10¹⁴ Hz shines on copper (φ = 4.5 eV). Are photoelectrons emitted?",
      hint: "Calculate photon energy E = hf and compare with φ",
      tier: "pro",
    },
  ],

  wave: 7,
  tier: "pro",
  estimatedTime: 25,
  relatedExperiments: ["atomic-structure", "em-spectrum", "wave-interference"],

  seoTitle: "Photoelectric Effect — Photon Energy & Work Function Simulation | Scivra",
  seoKeywords: [
    "photoelectric effect",
    "photon energy",
    "work function",
    "Einstein",
    "threshold frequency",
    "quantum physics simulation",
    "AP Physics modern physics",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "High School",
    teaches: "Photoelectric Effect and Quantum Nature of Light",
  },

  contentSections: {
    whatIsIt:
      "By 1900 the wave model of light had been so successful — refraction, diffraction, double-slit interference all behaved exactly as Maxwell's equations predicted — that it looked like light was a closed case. Then experimenters started shining UV light on metal plates and noticed something the wave theory could not explain. Below a certain frequency, no electrons came out, no matter how bright the light. Above that frequency, electrons came out instantly, even at extremely low intensity. Cranking up the brightness gave more electrons, but never gave them more energy per electron. Einstein's 1905 paper — the one that won him the Nobel Prize, not relativity — fixed this by treating light as a stream of discrete photons each carrying energy E = hf. A single photon either has enough energy to free a single electron from the metal (E ≥ φ, where φ is the work function) or it doesn't, and intensity just controls how many photons arrive per second. The simulation lets you sweep frequency across the threshold, change intensity, swap among sodium / aluminum / copper plates with different work functions, and apply a stopping voltage to measure the maximum kinetic energy of the ejected electrons. This is the experiment that broke classical physics.",
    parameterExplanations: {
      light_frequency:
        "Frequency of the incoming light, in units of 10¹⁴ Hz. Photon energy is E = hf, so frequency directly controls how much energy each photon delivers. Below the threshold f₀ = φ/h, no electrons escape regardless of intensity. Above it, kinetic energy scales linearly with f.",
      light_intensity:
        "Brightness of the beam, in W/m². Intensity controls the number of photons per second hitting the surface, not the energy per photon. So intensity scales the photoelectric current above threshold but cannot create a current below threshold. This is the parameter that decisively breaks the wave theory's prediction.",
      metal_type:
        "Choice of cathode metal. Sodium (φ = 2.28 eV) ejects electrons with visible light. Aluminum (φ = 4.08 eV) needs near-UV. Copper (φ = 4.5 eV) needs deeper UV. Work function is the minimum energy needed to liberate the most loosely bound electron from the metal's surface, and it is a property of the material.",
      stopping_voltage:
        "Reverse voltage applied to slow down ejected electrons. The stopping voltage is the smallest V_stop that brings the photoelectric current to zero, which means it just barely halts the fastest electrons: eV_stop = KE_max = hf − φ. Plotting V_stop vs f for different metals gives a family of parallel lines, all with slope h/e — a direct measurement of Planck's constant.",
    },
    misconceptions: [
      {
        wrong:
          "Brighter light gives more energetic photoelectrons.",
        correct:
          "Brighter light gives more electrons per second but each electron has the same maximum kinetic energy. Energy per electron is fixed by photon energy (frequency), not by how many photons arrive. This is the single most-tested misconception on AP Physics 2 quantum questions.",
      },
      {
        wrong:
          "If I just wait long enough, even low-frequency light will eventually pile up enough energy to eject electrons.",
        correct:
          "Wave theory predicts exactly that, and the experiment kills it. Below threshold frequency, electrons never come out, no matter how long you wait or how bright the beam. Each photon-electron interaction is one-shot — you can't accumulate energy from many subthreshold photons into one electron.",
      },
      {
        wrong:
          "All the photoelectrons come out with the same kinetic energy.",
        correct:
          "Only the maximum kinetic energy is hf − φ. That's the energy of an electron right at the surface that absorbs a photon and escapes losing only φ. Electrons that start below the surface lose extra energy on the way out, so the photoelectron beam contains a spread of kinetic energies up to KE_max.",
      },
      {
        wrong:
          "The photoelectric effect proves light is just a particle.",
        correct:
          "It proves light has particle-like behavior in this experiment. Diffraction and interference still demand a wave description. The honest summary is that light is neither — it's a quantum field that behaves wave-like in some experiments and particle-like in others. AP Physics 2 calls this wave-particle duality.",
      },
      {
        wrong:
          "Different metals just have different threshold frequencies because of mass.",
        correct:
          "Threshold frequency depends on the work function φ — the binding energy of the most loosely held electron at the metal's surface, which is set by the metal's electronic structure, not the mass of its atoms. Sodium has the smallest φ in this sim because its outer electron sits in a high-energy 3s orbital that's only loosely bound.",
      },
    ],
    teacherUseCases: [
      "Threshold-frequency lab: have students fix intensity at a high value and slowly raise frequency from below threshold to above for each metal. They should find no current at all until f crosses φ/h, and the threshold should match the predicted value within a few percent.",
      "Determining Planck's constant: ask students to record stopping voltage at five frequencies above threshold for one metal, then plot V_stop vs f. The slope is h/e — multiplying by e gives Planck's constant directly. This is a real Nobel-quality measurement done in 30 minutes.",
      "Intensity vs frequency contest: let students try every combination of intensity and frequency to find one that produces the most energetic electrons. They should converge on max frequency, and notice that intensity does nothing to KE_max — exactly the contradiction with classical wave theory.",
      "1905 mini-history reading: pair the simulation with a one-page excerpt from Einstein's 1905 paper. Have students identify which experimental fact the wave model could not handle and which formula Einstein introduced to fix it.",
      "Unit conversion drill: students often forget to convert work function from eV to joules before computing threshold frequency. Build a worksheet where students must compute f_threshold for each metal in the sim, then verify experimentally. Connects modern-physics calculations to clean unit hygiene.",
    ],
    faq: [
      {
        question: "What exactly is the work function and why does it depend on the metal?",
        answer:
          "The work function φ is the minimum energy needed to free the most loosely bound electron from a metal's surface. It depends on the metal because each material has a different electronic structure: sodium's outermost electron sits in a high-energy 3s orbital that is only weakly held (φ = 2.28 eV), while copper's outer electrons are more tightly bound (φ = 4.5 eV). Surface conditions matter too — oxidation can change the effective φ by tenths of an eV.",
      },
      {
        question: "How do I calculate the threshold frequency for a given metal?",
        answer:
          "Use f_threshold = φ/h, where h = 6.626×10⁻³⁴ J·s. First convert φ from electron-volts to joules (1 eV = 1.602×10⁻¹⁹ J). For sodium: φ = 2.28 eV = 3.65×10⁻¹⁹ J, giving f_threshold ≈ 5.51×10¹⁴ Hz, which sits in the green visible range. That's why sodium photocells respond to ordinary light, while a copper photocell needs UV.",
      },
      {
        question: "Why does the stopping voltage equal the maximum kinetic energy divided by e?",
        answer:
          "Photoelectrons leave the metal with kinetic energy KE = hf − φ. To stop them you apply a reverse potential V_stop. As an electron crosses that potential, the field does work eV_stop against its motion. The fastest electrons stop exactly when eV_stop = KE_max, which gives eV_stop = hf − φ. Plot V_stop versus f and you get a line of slope h/e and intercept −φ/e — every quantity in modern photoelectric physics, from one straight line.",
      },
      {
        question: "Why didn't classical wave physics predict the threshold frequency?",
        answer:
          "Wave theory says energy is delivered continuously. A bright low-frequency beam delivers a lot of energy per second; given enough time, that energy should accumulate in an electron and free it. Experiment showed this never happens. The fix was to quantize the light itself: each photon delivers hf in one indivisible chunk, and either that chunk is enough to free one electron or it isn't. There's no time-averaging across photons. This was the first experiment that forced energy quantization onto light, not just onto matter.",
      },
      {
        question: "How does this map to AP Physics 2 standards MOD-1.A through MOD-1.C?",
        answer:
          "MOD-1.A introduces the photon model E = hf and asks students to compute photon energy from frequency. MOD-1.B covers the photoelectric equation KE_max = hf − φ and the role of the work function. MOD-1.C addresses the experimental observations (threshold frequency, intensity-independence of KE_max, instantaneous emission) that motivated the photon model. The simulation's challenges are written to hit each of these in order.",
      },
      {
        question: "What's the modern interpretation of wave-particle duality?",
        answer:
          "Light isn't 'really' a wave or 'really' a particle — both are limiting descriptions of an underlying quantum object (a photon, the excitation of the electromagnetic field). In experiments where amplitudes need to interfere (slits, gratings, antennas), the wave description wins. In experiments where energy is exchanged in discrete amounts with matter (photoelectric, Compton, atomic absorption), the particle description wins. Both are right; neither is complete.",
      },
    ],
  },
};
