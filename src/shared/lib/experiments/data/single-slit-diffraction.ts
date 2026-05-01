import type { Experiment } from "@/shared/types/experiment";

export const singleSlitDiffraction: Experiment = {
  id: "single-slit-diffraction",
  slug: "single-slit-diffraction-pattern",
  title: "Single-Slit Diffraction",
  subtitle: "Explore how slit width and wavelength shape the diffraction intensity pattern",
  description:
    "Shine monochromatic light through a single slit and watch the Fraunhofer diffraction pattern form on a distant screen. Adjust slit width and wavelength to see the central maximum widen or narrow, and observe minima positions shift. Compare with double-slit interference to understand how diffraction modulates the multi-slit envelope.",
  thumbnail: "/imgs/experiments/single-slit-diffraction.png",

  standards: {
    ngss: ["HS-PS4-3"],
    gcse: ["P7.1"],
    ap: ["WVS-1.D", "WVS-1.E"],
  },
  primaryStandard: "ap-physics-2",
  category: "waves",
  subject: "physics",
  gradeLevel: "AP",
  tags: ["diffraction", "single slit", "light waves", "interference", "Fraunhofer", "AP Physics 2", "optics"],
  difficulty: "advanced",

  parameters: [
    {
      id: "slit_width",
      label: "Slit Width (a)",
      unit: "μm",
      min: 0.5,
      max: 20,
      default: 5,
      step: 0.5,
      tier: "free",
    },
    {
      id: "wavelength",
      label: "Wavelength",
      unit: "nm",
      min: 380,
      max: 780,
      default: 550,
      step: 10,
      tier: "free",
    },
    {
      id: "screen_distance",
      label: "Screen Distance",
      unit: "m",
      min: 0.5,
      max: 5,
      default: 2,
      step: 0.5,
      tier: "pro",
    },
    {
      id: "compare_double",
      label: "Compare Double-Slit (0=off, 1=on)",
      unit: "",
      min: 0,
      max: 1,
      default: 0,
      step: 1,
      tier: "pro",
    },
  ],

  formulas: [
    {
      latex: "a \\sin\\theta = m\\lambda \\quad (m = \\pm1, \\pm2, \\ldots)",
      description: "Dark fringe condition for single-slit diffraction",
    },
    {
      latex: "\\Delta y \\approx \\frac{\\lambda L}{a}",
      description: "Approximate fringe spacing on a distant screen",
    },
    {
      latex: "I(\\theta) \\propto \\left[\\frac{\\sin\\alpha}{\\alpha}\\right]^2 \\quad \\alpha = \\frac{\\pi a \\sin\\theta}{\\lambda}",
      description: "Intensity distribution (sinc² envelope)",
    },
  ],

  theory:
    "Single-slit diffraction arises from Huygens' principle: every point within the slit acts as a secondary wavelet source. At the central maximum (θ = 0) all wavelets arrive in phase, producing maximum intensity. At the first minimum, the slit can be divided into two halves whose wavelets cancel pairwise. The condition a·sinθ = mλ locates all minima (m ≠ 0). The central bright fringe is twice as wide as the side maxima and carries most of the light energy. Narrowing the slit increases diffraction (wider central maximum) — a direct consequence of Heisenberg's uncertainty principle at the quantum level. When two slits are present, the single-slit envelope modulates the double-slit interference fringes, producing missing orders wherever a diffraction minimum coincides with an interference maximum.",

  instructions:
    "Start with default settings (a = 5 μm, λ = 550 nm). Drag the slit width slider and watch the central maximum expand as the slit narrows. Change wavelength using the color-coded slider — longer wavelengths diffract more. Move the screen closer or farther (Pro) to observe how the angular positions are fixed but spatial positions scale with L. Toggle double-slit comparison (Pro) to see how the sinc² envelope suppresses some double-slit fringes.",

  challenges: [
    {
      id: "ssd-c1",
      question: "The slit width is halved. How does the width of the central bright fringe change?",
      hint: "Central fringe width ∝ λL/a. If a halves, what happens to the width?",
      tier: "free",
    },
    {
      id: "ssd-c2",
      question: "Red light (700 nm) replaces green light (550 nm) through the same slit. How does the diffraction pattern change?",
      hint: "Longer wavelength → larger sinθ for minima → wider pattern.",
      tier: "free",
    },
    {
      id: "ssd-c3",
      question: "Why is the central maximum much wider and brighter than the secondary maxima?",
      hint: "Consider how many wavelets add constructively at θ = 0 versus at a secondary maximum. Also compare the areas under each lobe of the sinc² curve.",
      tier: "pro",
    },
  ],

  wave: 7,
  tier: "pro",
  estimatedTime: 25,
  relatedExperiments: ["wave-interference", "geometric-optics-lenses", "em-spectrum"],

  seoTitle: "Single-Slit Diffraction — Light Pattern Simulation | Scivra",
  seoKeywords: [
    "single slit diffraction simulation",
    "diffraction pattern",
    "Fraunhofer diffraction",
    "AP Physics 2 optics",
    "wavelength slit width",
    "sinc squared intensity",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "High School",
    teaches: "Single-Slit Diffraction and Wave Optics",
  },

  contentSections: {
    whatIsIt:
      "Shine a laser pointer through a narrow slit at a wall and you don't get a single bright line — you get a wide central bright band with a parade of dimmer bands fading away on either side. That pattern is single-slit diffraction, and it is one of the cleanest pieces of evidence that light is a wave. Every point inside the slit re-radiates the incoming wave (Huygens' principle), and on the screen those secondary wavelets either reinforce each other or cancel pairwise depending on path length differences. The minima sit exactly where a·sinθ = mλ, and the full intensity profile is a sinc² envelope with most energy in the central maximum, twice as wide as any side fringe. The simulation lets you change the slit width, sweep the wavelength, push the screen back, and overlay a double-slit pattern to see how the envelope modulates double-slit fringes.",
    parameterExplanations: {
      slit_width:
        "Width of the slit a, measured in micrometers. The narrower the slit, the more strongly the light spreads — central maximum width is proportional to λL/a. Drop a from 10 μm to 2 μm and the central fringe expands fivefold. This is the geometric face of the uncertainty principle: confining the wave laterally forces it to spread in direction.",
      wavelength:
        "Wavelength of the monochromatic light, in nanometers. Visible light runs from about 380 nm (violet) to 780 nm (red). Longer wavelengths diffract more, so a red laser produces a wider pattern than a green one through the same slit — the same reason AM radio bends around buildings better than FM.",
      screen_distance:
        "Distance L from the slit to the screen, in meters. The angles of the minima are fixed by a·sinθ = mλ and don't depend on L, but the spatial fringe spacing on the screen scales linearly with L: Δy ≈ λL/a. Doubling the screen distance doubles the visible pattern width.",
      compare_double:
        "Toggles a side-by-side double-slit interference pattern (1 = on, 0 = off). With both slits open you get fast cosine fringes from interference, but their amplitude is multiplied by the same sinc² envelope from each slit's diffraction. Wherever a diffraction zero coincides with an interference maximum, that whole interference order goes missing.",
    },
    misconceptions: [
      {
        wrong:
          "Diffraction proves light is only a wave and has no particle behavior.",
        correct:
          "Diffraction is wave behavior, but it does not erase photon evidence. A beam of many photons builds the same diffraction pattern one detection at a time, while the photoelectric effect shows that light energy arrives in quanta. The modern picture needs both: wave amplitudes set probabilities, and photons arrive as discrete events.",
      },
      {
        wrong:
          "A wider slit gives a wider diffraction pattern.",
        correct:
          "Backwards. A wider slit gives a narrower pattern; a narrower slit gives a wider pattern. Width on the screen scales as λL/a, with a in the denominator. Make the slit big enough and diffraction effectively disappears — the light just goes straight through.",
      },
      {
        wrong:
          "All the bright fringes in a single-slit pattern are the same width.",
        correct:
          "The central maximum is twice as wide as any of the secondary maxima. The minima sit at sinθ = mλ/a for m = ±1, ±2, ±3..., so the central peak runs from m = −1 to m = +1 (width 2λ/a), while every secondary peak only spans one m-step (width λ/a).",
      },
      {
        wrong:
          "If I cover half the slit, the pattern just gets dimmer by half.",
        correct:
          "Reducing the slit width a doesn't merely dim the same image — it changes the geometry. The central maximum gets wider, the angles of the minima shift, and for uniform illumination through a fixed-height slit the transmitted power drops roughly in proportion to the slit width. You don't get half a pattern; you get a different pattern.",
      },
      {
        wrong:
          "In a double-slit experiment, the slit width doesn't matter — only the spacing does.",
        correct:
          "Slit spacing sets the fast interference fringe spacing, but slit width sets the diffraction envelope that modulates them. If a/d is just right, entire interference orders disappear because the diffraction zero lands on top of an interference maximum. AP Physics 2 questions love this combination.",
      },
    ],
    teacherUseCases: [
      "Wavelength measurement lab: lock the slit width and ask students to measure the central fringe width for three different colors, then back out each wavelength using Δy = λL/a. They should recover values within ~10% of the published wavelengths for red, green, and violet.",
      "Inverse-relationship discovery: have students record central fringe width as they shrink slit width through five values (e.g., 10, 5, 2, 1, 0.5 μm). Plotting width vs 1/a should give a straight line through the origin, making the inverse proportionality unavoidable.",
      "Missing orders investigation: turn on the double-slit overlay and pick parameters where the third interference order coincides with the first diffraction zero. Ask students to identify which order is missing and explain why using a/d.",
      "Connecting to single-photon experiments: after students see the wave behavior, mention that the same pattern builds up dot-by-dot if photons are sent through one at a time. Use this as a bridge to the wave-particle discussion that culminates in the photoelectric effect.",
      "Quick wavelength estimator for stations: post a laser, a slit, and a meter stick. Have student pairs report the laser's wavelength after one measurement. Useful as a fast pre-lab assessment of whether they understand how the variables connect.",
    ],
    faq: [
      {
        question: "Why does narrowing the slit make the pattern wider instead of narrower?",
        answer:
          "It looks counterintuitive but it's exactly what wave physics predicts. The central fringe half-angle is sinθ ≈ λ/a. Smaller a means bigger sinθ, which means the light has to spread out over a wider angular range. Physically, confining the wave to a narrower slit forces it to have a broader range of transverse momentum components, which translates directly into a broader spread on the screen — a classroom-friendly preview of the Heisenberg uncertainty principle.",
      },
      {
        question: "What's the difference between diffraction and interference?",
        answer:
          "They're really the same physics — superposition of wavelets — applied in slightly different settings. Interference traditionally refers to a small number of discrete sources (like two slits), while diffraction refers to a continuous distribution of sources (every point inside one slit). In the double-slit experiment both happen at once: each slit individually diffracts (wide envelope) and the two slits' outputs interfere (fast fringes inside the envelope).",
      },
      {
        question: "Why does the central maximum look so much brighter than the side fringes?",
        answer:
          "At θ = 0 every wavelet from across the slit arrives in phase, so the amplitudes all add. As you move off-axis the wavelets fan out of phase and their sum drops fast — the sinc² envelope falls to about 4.5% at the first secondary maximum. About 90% of the transmitted energy is in the central peak, and the rest leaks into the side fringes.",
      },
      {
        question: "Can I use the single-slit formula for a circular aperture, like a telescope?",
        answer:
          "Roughly. A circular aperture of diameter D produces a similar central spot (the Airy disk) with first dark ring at sinθ ≈ 1.22 λ/D. The 1.22 factor comes from the Bessel-function geometry of a circle versus a slit. Same physics, slightly different math, and it's what sets the resolution limit of every telescope and camera.",
      },
      {
        question: "How does this map to AP Physics 2 standards WVS-1.D and WVS-1.E?",
        answer:
          "WVS-1.D covers the conditions for constructive and destructive interference in wave systems, which is what locates the diffraction minima. WVS-1.E asks students to relate wavelength, slit width, and screen geometry to predict fringe positions and explain qualitatively how the pattern changes when each variable is altered. The simulation lets students do exactly that with controlled, reproducible inputs.",
      },
    ],
  },
};
