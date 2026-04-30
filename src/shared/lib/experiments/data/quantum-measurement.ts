import type { Experiment } from "@/shared/types/experiment";

export const quantumMeasurement: Experiment = {
  id: "quantum-measurement",
  slug: "quantum-measurement-uncertainty",
  title: "Quantum Measurement",
  subtitle: "Explore how measurement affects quantum systems",
  description:
    "Investigate the Heisenberg Uncertainty Principle through interactive experiments. Observe wave-particle duality, measure position and momentum simultaneously, and see how measurement disturbs a quantum system.",
  thumbnail: "/imgs/experiments/photoelectric-effect.png",

  standards: {
    ngss: ["HS-PS4-3"],
    gcse: [],
    ap: ["MOD-4.A", "MOD-4.B"],
  },
  primaryStandard: "ap-physics-2",
  category: "modern",
  subject: "physics",
  gradeLevel: "AP",
  tags: ["Heisenberg uncertainty", "quantum measurement", "wave-particle duality", "wavefunction", "position momentum"],
  difficulty: "advanced",

  parameters: [
    { id: "slit_width", label: "Slit Width", unit: "nm", min: 1, max: 200, default: 50, step: 1, tier: "free" },
    { id: "particle_wavelength", label: "Particle Wavelength", unit: "nm", min: 1, max: 200, default: 50, step: 1, tier: "free" },
  ],

  formulas: [
    { latex: "\\Delta x \\cdot \\Delta p \\geq \\frac{\\hbar}{2}", description: "Heisenberg Uncertainty Principle" },
    { latex: "\\Delta E \\cdot \\Delta t \\geq \\frac{\\hbar}{2}", description: "Energy-time uncertainty" },
    { latex: "\\lambda = \\frac{h}{p}", description: "de Broglie wavelength" },
  ],

  theory:
    "The Heisenberg Uncertainty Principle states that position and momentum cannot both be precisely known simultaneously: Δx·Δp ≥ ℏ/2. This is not a measurement limitation but a fundamental property of quantum states. Narrowing a slit (precise position) causes wider diffraction (uncertain momentum). The double-slit experiment shows that measuring which-path information destroys the interference pattern — measurement irreversibly disturbs the quantum state.",
  instructions:
    "Adjust slit width to control position uncertainty. Observe how the diffraction pattern widens (momentum uncertainty increases). Enable which-path detection to see interference disappear. Use the momentum spectrum to verify the uncertainty relation.",
  challenges: [
    { id: "qm-c1", question: "A slit narrows from 100nm to 10nm. How does the diffraction spread change?", hint: "Δx decreases by 10×, so Δp must increase by 10× — much wider spread", tier: "free" },
    { id: "qm-c2", question: "An electron is confined in a 1nm box. What is its minimum kinetic energy?", hint: "Δx=1nm → Δp ≥ ℏ/(2×10⁻⁹) → KE = (Δp)²/(2m_e)", tier: "free" },
    { id: "qm-c3", question: "Why does measuring which-slit a photon goes through destroy interference?", hint: "Which-path information collapses position superposition — you've made it a particle, not a wave", tier: "pro" },
  ],

  wave: 8,
  tier: "free",
  estimatedTime: 25,
  relatedExperiments: ["quantum-coin-toss", "photoelectric-effect", "single-slit-diffraction"],

  seoTitle: "Quantum Measurement — Heisenberg Uncertainty | AP Physics 2",
  seoKeywords: ["quantum measurement", "Heisenberg uncertainty", "wave-particle duality", "double slit", "AP Physics 2"],
  jsonLd: { "@type": "LearningResource", educationalLevel: "High School", teaches: "Heisenberg Uncertainty, Wave-Particle Duality, Quantum Measurement" },

  contentSections: {
    whatIsIt:
      "Send a single photon at a slit and you'd expect it to make a single dot on the detector behind. Instead, over many photons, you get a smeared diffraction pattern — and the narrower the slit, the *wider* the spread on the screen. That's the Heisenberg Uncertainty Principle made visible: pinning down where the photon is (narrow slit, small Δx) forces its momentum to be wildly uncertain (wide angular spread, large Δp). The product is bounded below: Δx·Δp ≥ ℏ/2, no matter how clever your apparatus is. This isn't your instruments being bad — it's a fundamental property of any quantum object. Slit width on the input, particle wavelength inside the box, and a momentum spectrum on the output are all you need to verify the inequality. Try a 100 nm slit and the diffraction is barely visible. Squeeze it to 10 nm and the pattern explodes outward. Add a 'which-slit' detector to a double-slit setup and the interference fringes vanish, because measurement forces the photon to commit to one path. The trade-off between knowing position and knowing momentum is woven into the universe itself.",
    parameterExplanations: {
      slit_width:
        "The width of the slit in nanometers, which sets the position uncertainty Δx of any particle passing through. A narrow slit (small Δx) localizes the particle's position precisely as it passes, but the uncertainty principle then forces a large Δp — and that translates into a wide angular spread of the outgoing diffraction pattern. A wide slit gives a tighter beam (small Δp) but you can't say where in the slit each particle was. Sweeping slit_width is the cleanest way to demonstrate the position–momentum trade-off live.",
      particle_wavelength:
        "The de Broglie wavelength λ = h/p of the incoming particle, in nanometers. Bigger wavelength means smaller momentum (since p = h/λ), and the diffraction angle θ for a slit of width a goes roughly as sin θ ≈ λ/a. Long-wavelength particles diffract a lot through a given slit; short-wavelength particles barely diffract. This is why electron microscopes (very short λ) achieve much higher resolution than light microscopes — the wave's spread limits how sharply you can localize.",
    },
    misconceptions: [
      {
        wrong:
          "Heisenberg uncertainty is just measurement error — better instruments could fix it.",
        correct:
          "It's a fundamental property of conjugate observables, not an instrument problem. The inequality Δx·Δp ≥ ℏ/2 holds even with theoretically perfect measurements, even in principle, even in your dreams. It comes from the mathematics of waves: any wavefunction localized in position must be a superposition of many momentum components, and vice versa. There is no measurement device, present or future, that escapes the bound. Calling it measurement error is the single most common quantum misconception.",
      },
      {
        wrong:
          "Quantum particles only act wave-like when no one is looking.",
        correct:
          "They always have wave properties — interference, diffraction, and a real wavelength. What changes is what you *measure*. If you measure position (e.g., 'which slit did it go through?') you get particle-like information and lose the interference. If you don't measure position, the wave nature shows up in the pattern on the screen. The particle isn't switching modes; you're choosing which observable to access, and they're complementary.",
      },
      {
        wrong:
          "If you know momentum exactly, the position is somewhere you just don't know — but it has a definite value.",
        correct:
          "An exact-momentum state is a plane wave that fills *all* space — there is literally no defined position, not even one you're ignorant of. This is what makes the uncertainty fundamental rather than epistemic. The wavefunction itself doesn't have a definite x; it's spread across the entire universe. Measure x and you'll find one, but before measurement there genuinely isn't one to find.",
      },
      {
        wrong:
          "Light is a wave and electrons are particles, so wave-particle duality only matters for one or the other.",
        correct:
          "Both behave as both. Photons make interference patterns (wave) and trigger discrete photon-counter clicks (particle). Electrons make a double-slit interference pattern just as cleanly as photons do, and they leave individual track impacts in detectors. Even big molecules like buckyballs (C₆₀) have shown double-slit interference in the lab. Wave-particle duality is universal for quantum objects — there's no 'wave species' versus 'particle species.'",
      },
    ],
    teacherUseCases: [
      "Slit-width sweep: at fixed wavelength, narrow the slit from 100 nm to 10 nm to 1 nm and have students measure (or estimate) the diffraction spread. They should find that Δp scales inversely with slit width, verifying Δx·Δp ≈ constant.",
      "Confined-electron problem: a classic AP problem — an electron in a 1 nm box has minimum kinetic energy KE_min ~ (Δp)²/(2m) ~ ℏ²/(2m·Δx²). Plug in Δx=1 nm and get a few hundred meV. Tie this to why the smallest atoms have a definite size: ground-state confinement.",
      "Which-path destruction of interference: enable the which-slit detector and watch the interference fringes wash out. Use this to introduce why measurement irreversibly disturbs quantum systems and why complementary observables can't both be accessed at once.",
      "Electron microscope motivation: ask why electron microscopes outperform optical microscopes for resolution. Connection to λ = h/p — high-momentum electrons have tiny wavelengths and can diffract less, achieving sub-nanometer resolution.",
      "Energy-time uncertainty extension: discuss ΔE·Δt ≥ ℏ/2 in the context of short-lived particle decays (broad mass uncertainties) and why excited atomic states have natural linewidths inversely proportional to their lifetimes.",
    ],
    faq: [
      {
        question: "What does ℏ/2 actually mean in the uncertainty principle?",
        answer:
          "ℏ (h-bar) is the reduced Planck constant, ≈ 1.05 × 10⁻³⁴ J·s. The factor of 1/2 comes from the rigorous mathematical derivation using the variance of position and momentum operators (it's the strict lower bound, achieved by Gaussian wavepackets). Some textbooks write Δx·Δp ≥ ℏ as a rough order-of-magnitude version. For AP problems the order-of-magnitude version is usually fine, but the formally correct bound is ℏ/2.",
      },
      {
        question: "Why does a narrow slit cause a wider diffraction pattern?",
        answer:
          "Pinning the photon's transverse position to the slit width Δx means its transverse momentum spread is at least Δp ≥ ℏ/(2Δx). After leaving the slit, that transverse momentum spreads the wavefunction outward over distance L by an angle ≈ Δp/p, which gives a smear of size L·λ/Δx on the screen. Cutting Δx in half doubles the smear. The narrower the gate, the wider the after-pattern — pure consequence of the uncertainty principle.",
      },
      {
        question: "Does the uncertainty principle apply to macroscopic objects?",
        answer:
          "In principle yes, but in practice the bound is so much smaller than typical macroscopic uncertainties that it doesn't matter. For a 1 kg ball, ℏ/2 corresponds to position-momentum uncertainty about 10⁻³⁴ — utterly invisible compared to thermal noise and air turbulence. Uncertainty becomes physically important when you're dealing with electrons, photons, atoms — particles whose natural action scales are comparable to ℏ. That's why we don't see uncertainty effects in everyday life.",
      },
      {
        question: "Is uncertainty about a single particle, or only about a statistical ensemble?",
        answer:
          "It's about ensembles of identically prepared particles. Δx and Δp are statistical spreads — standard deviations — over many measurements on independent copies of the same state. You don't have a known position-momentum pair that's individually fuzzy; rather, repeated measurements on equivalent states give a distribution whose widths obey the inequality. For a single particle, individual measurements give definite results; only the *spread* across many runs is constrained.",
      },
      {
        question: "How does this connect to AP Physics 2 MOD-4.A and MOD-4.B?",
        answer:
          "MOD-4.A covers wave-particle duality and de Broglie wavelength λ = h/p — exactly the input to the simulation's diffraction pattern. MOD-4.B introduces the uncertainty principle conceptually and asks students to reason about why we can't simultaneously know position and momentum. Watching narrowing slit width force broadening momentum spread is the visual proof of MOD-4.B in action. Together they're the foundational quantum unit of AP Physics 2.",
      },
    ],
  },
};
