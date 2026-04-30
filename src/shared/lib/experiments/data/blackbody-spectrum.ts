import type { Experiment } from "@/shared/types/experiment";

export const blackbodySpectrum: Experiment = {
  id: "blackbody-spectrum",
  slug: "blackbody-spectrum-radiation",
  title: "Blackbody Spectrum",
  subtitle: "Explore thermal radiation and the quantum revolution",
  description:
    "Adjust the temperature of a glowing object and observe how its emission spectrum changes. Discover Wien's Displacement Law, Stefan-Boltzmann Law, and why classical physics failed to predict the spectrum.",
  thumbnail: "/imgs/experiments/photoelectric-effect.png",

  standards: {
    ngss: ["HS-PS4-1", "HS-PS4-3"],
    gcse: ["AQA P7.1"],
    ap: ["MOD-1.A", "MOD-1.B"],
  },
  primaryStandard: "ap-physics-2",
  category: "modern",
  subject: "physics",
  gradeLevel: "AP",
  tags: ["blackbody radiation", "Wien's law", "Stefan-Boltzmann", "thermal emission", "quantum physics", "Planck"],
  difficulty: "intermediate",

  parameters: [
    { id: "temperature", label: "Temperature", unit: "K", min: 300, max: 30000, default: 5778, step: 100, tier: "free" },
  ],

  formulas: [
    { latex: "\\lambda_{max} = \\frac{b}{T}", description: "Wien's Displacement Law (b = 2.898×10⁻³ m·K)" },
    { latex: "P = \\sigma A T^4", description: "Stefan-Boltzmann Law" },
    { latex: "E = h\\nu = \\frac{hc}{\\lambda}", description: "Photon energy (Planck)" },
  ],

  theory:
    "A blackbody is an ideal object that absorbs all incident radiation and emits radiation based solely on its temperature. As temperature increases, the peak emission wavelength shifts to shorter wavelengths (Wien's Law) and total power increases dramatically (Stefan-Boltzmann). Classical physics predicted infinite emission at short wavelengths (ultraviolet catastrophe). Planck resolved this by quantizing energy, birthing quantum mechanics.",
  instructions:
    "Use the temperature slider to change the object's temperature. Observe the emission spectrum shift from infrared (red glow) to visible white. The spectrum peak follows Wien's Law. Compare with the failed classical Rayleigh-Jeans prediction.",
  challenges: [
    { id: "bb-c1", question: "The Sun's surface is ~5778K. What is its peak emission wavelength?", hint: "λ_max = 2.898×10⁻³ / 5778", tier: "free" },
    { id: "bb-c2", question: "At what temperature does an object peak in the visible range (~550nm)?", hint: "Solve Wien's Law for T: T = b/λ_max", tier: "free" },
    { id: "bb-c3", question: "How much more power does a 6000K star emit compared to a 3000K star?", hint: "P ∝ T⁴; ratio = (6000/3000)⁴ = 16", tier: "pro" },
  ],

  wave: 8,
  tier: "free",
  estimatedTime: 20,
  relatedExperiments: ["photoelectric-effect", "models-hydrogen-atom", "molecules-and-light"],

  seoTitle: "Blackbody Spectrum Simulation | Wien's Law | AP Physics 2",
  seoKeywords: ["blackbody radiation", "Wien's displacement law", "Stefan-Boltzmann", "thermal radiation", "AP Physics 2", "quantum"],
  jsonLd: { "@type": "LearningResource", educationalLevel: "High School", teaches: "Blackbody Radiation, Wien's Law, Stefan-Boltzmann Law" },

  contentSections: {
    whatIsIt:
      "Heat any object up enough and it will start to glow. The burner on an electric stove glows dull red around 800 K. The filament in an old incandescent bulb glows yellow-white near 2800 K. The Sun's surface, at 5778 K, glows so bright and balanced across the visible range that we call its mix 'white' and define our entire color sense around it. The remarkable thing is that the spectrum — the distribution of emitted wavelengths — depends almost entirely on temperature, not on what the object is made of. That's the blackbody spectrum, and the simulation lets you sweep temperature from a cool 300 K (room temperature, peaking deep in the infrared) up to 30 000 K (a hot blue O-class star) and watch two laws play out at once: Wien's displacement law λ_max·T = 2.898×10⁻³ m·K, which says the peak wavelength shifts shorter as things heat up; and the Stefan-Boltzmann law P = σAT⁴, which says the total radiated power explodes as the fourth power of temperature. Trying to predict this spectrum from classical wave physics in 1900 produced an answer that diverged to infinity at short wavelengths — the 'ultraviolet catastrophe' — and forced Planck to quantize energy, which is the first crack from which all of quantum mechanics grew.",
    parameterExplanations: {
      temperature:
        "Absolute temperature of the blackbody, in kelvins. This single parameter sets the entire spectrum: the wavelength of peak emission via Wien's law (λ_max = b/T), the total radiated power via Stefan-Boltzmann (P ∝ T⁴), and the visible color the eye perceives. Doubling T quadruples the peak frequency and increases total power by a factor of 16. The default is 5778 K, the surface temperature of the Sun.",
    },
    misconceptions: [
      {
        wrong:
          "A hotter object glows brighter, and that's the only difference.",
        correct:
          "Hotter objects glow brighter and shift the peak of their spectrum toward shorter wavelengths — they change color. A 1000 K stove burner glows dull red. A 3000 K bulb glows orange-yellow. A 6000 K star glows white-yellow. A 30 000 K star glows blue. Two changes, not one.",
      },
      {
        wrong:
          "The Sun is yellow because it emits more yellow light than any other color.",
        correct:
          "Wien's law puts the Sun's peak emission near 500 nm, which is actually green. The Sun emits roughly equally across the visible band, and our eyes integrate that mix into 'white.' The Sun looks yellow from Earth's surface because the atmosphere preferentially scatters blue out of direct sunlight (which is why the sky is blue). Above the atmosphere, sunlight is essentially white.",
      },
      {
        wrong:
          "Blackbody radiation only happens for objects that look black.",
        correct:
          "'Blackbody' is a thermal-physics idealization: an object that absorbs all incoming radiation and emits a temperature-dependent spectrum. Real objects approximate this when they are opaque and reach thermal equilibrium. The Sun is essentially a blackbody. So is the filament of a tungsten bulb. So is your own body, peaking in the far infrared at ~310 K.",
      },
      {
        wrong:
          "Doubling the temperature doubles the radiated power.",
        correct:
          "Doubling T multiplies total power by 2⁴ = 16. The Stefan-Boltzmann law's fourth-power dependence is why small temperature changes have huge energy consequences — a 6000 K star radiates 16× more power per unit area than a 3000 K star, even though both feel hot.",
      },
      {
        wrong:
          "Classical physics predicted the blackbody spectrum just fine; quantum was a refinement.",
        correct:
          "Classical physics (Rayleigh-Jeans law) predicted infinite total radiated power and infinite spectral intensity in the ultraviolet. This is the ultraviolet catastrophe. Planck's quantization of energy — assuming oscillators emit only in discrete chunks E = hf — was the only way to make the spectrum match experiment, and it could not be derived from any classical theory. Quantum was a rescue, not a refinement.",
      },
    ],
    teacherUseCases: [
      "Stellar color thermometer: give students a list of named stars (Antares ~3500 K, the Sun 5778 K, Sirius ~9940 K, Rigel ~12 000 K) and ask them to predict color for each, then verify using the simulation. Connects astronomy to thermal physics directly.",
      "Wien's law graphing exercise: have students record λ_max at five different temperatures, plot λ_max vs 1/T, and confirm the straight line through the origin with slope = 2.898×10⁻³ m·K. This is a cleaner version of the original Wien measurement.",
      "Stefan-Boltzmann power scaling: ask students to predict by what factor radiated power changes when T goes from 3000 K to 6000 K. Most will guess 2× or 4×; the correct 16× is a memorable shock when verified in the sim.",
      "Ultraviolet catastrophe overlay: toggle the classical Rayleigh-Jeans curve next to Planck's curve at T = 5000 K. Students should see the classical curve diverge at short wavelengths while the quantum curve has a finite peak. Use this to motivate why quantization was necessary.",
      "Why is the sky blue / why does the Sun look yellow: chain Wien's law (peak at ~500 nm = green), the Sun's near-flat visible output, and Rayleigh scattering's wavelength-fourth dependence into a single explanation. Run the simulation at 5778 K and walk through how light gets from the surface to your eye.",
    ],
    faq: [
      {
        question: "What's the difference between Wien's law and the Stefan-Boltzmann law?",
        answer:
          "Both come from the Planck spectrum but answer different questions. Wien's displacement law (λ_max = b/T, with b ≈ 2.898×10⁻³ m·K) tells you where the spectrum peaks — i.e., the dominant color. Stefan-Boltzmann (P = σAT⁴) tells you how much total power the object radiates per unit surface area. Wien is about color; Stefan-Boltzmann is about brightness. Both are direct consequences of Planck's full curve.",
      },
      {
        question: "Why does the Sun look yellow if it peaks at green?",
        answer:
          "The Sun's surface at 5778 K does peak near 500 nm, which is green, but the spectrum is broad — it emits significant power across the entire visible range, which is why we call its mix 'white' rather than 'green.' From Earth's surface the Sun appears yellowish because Rayleigh scattering removes blue and violet wavelengths from direct sunlight more efficiently than red and yellow (those scattered photons fill the rest of the sky and make it blue). Astronauts above the atmosphere see the Sun as essentially white.",
      },
      {
        question: "What was the ultraviolet catastrophe, and how did Planck fix it?",
        answer:
          "Classical electromagnetism plus equipartition (every wave mode gets kT of energy on average) predicted that a blackbody should radiate infinite power, with most of it at the shortest wavelengths. Experiment showed the opposite: the spectrum has a finite peak and falls off in the ultraviolet. Planck assumed in 1900 that an oscillator at frequency f could only emit energy in discrete units of hf. High-frequency modes need too much energy per quantum to be excited at finite temperature, so they are suppressed. With this single ad-hoc rule, the predicted curve matched experiment exactly. He didn't believe his own assumption was physical — Einstein later showed it had to be.",
      },
      {
        question: "Is my body actually a blackbody?",
        answer:
          "Pretty close, in the infrared. Skin at ~310 K emits a Planck spectrum peaking near 9.3 μm (mid-infrared), with total radiated power around 100 W for a typical adult. That's exactly what thermal-imaging cameras see, and it's why night-vision goggles can spot a person in the dark. You're a slightly imperfect emitter (emissivity ~0.97), but the difference from an ideal blackbody is small enough to ignore in most calculations.",
      },
      {
        question: "How does the blackbody spectrum lead into the photoelectric effect?",
        answer:
          "Both experiments showed that energy at the atomic scale is quantized, not continuous. Planck (1900) had to quantize oscillator energy to fix the blackbody spectrum but treated this as a mathematical trick. Einstein (1905) showed that quantization had to apply to the light itself by explaining the photoelectric effect with photons of energy hf. Together, blackbody and photoelectric are the two pillars on which the photon concept stands, and they bookend the moment classical physics broke.",
      },
      {
        question: "How does this map to AP Physics 2 standards MOD-1.A and MOD-1.B?",
        answer:
          "MOD-1.A introduces the photon model E = hf and the quantum nature of light. MOD-1.B covers thermal emission and the temperature dependence of the emitted spectrum, including Wien's law and Stefan-Boltzmann. The simulation lets students see both laws emerge from one parameter (temperature) and reinforces why classical theory failed where quantum theory succeeded.",
      },
    ],
  },
};
