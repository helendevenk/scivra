import type { Experiment } from "@/shared/types/experiment";

export const photosynthesisLightReactions: Experiment = {
  id: "photosynthesis-light-reactions",
  slug: "photosynthesis-light-reactions",
  title: "Photosynthesis: Light Reactions",
  subtitle: "Photosystems I & II, electron transport chain, and ATP synthesis",
  description:
    "Trace the path of light energy through the chloroplast thylakoid membrane. Watch photons excite electrons in Photosystem II, follow them through the electron transport chain, and observe ATP synthase generate ATP. Adjust light intensity and wavelength to see how they affect the rate of light reactions.",
  thumbnail: "/imgs/experiments/photosynthesis-light-reactions.png",
  standards: { ngss: ["HS-LS1-5"], gcse: [], ap: ["2.A.2"] },
  primaryStandard: "ap-biology",
  category: "biology",
  subject: "biology",
  gradeLevel: "AP",
  tags: ["photosynthesis", "light reactions", "photosystem", "electron transport", "ATP synthase", "AP Biology"],
  difficulty: "advanced",
  parameters: [
    { id: "lightIntensity", label: "Light Intensity", unit: "%", min: 0, max: 100, default: 70, step: 5, tier: "free" },
    { id: "wavelength", label: "Wavelength", unit: "nm", min: 380, max: 750, default: 680, step: 10, tier: "free" },
    { id: "co2Level", label: "CO₂ Level", unit: "ppm", min: 100, max: 1000, default: 400, step: 50, tier: "free" },
  ],
  formulas: [
    { latex: "6\\text{CO}_2 + 6\\text{H}_2\\text{O} \\xrightarrow{\\text{light}} \\text{C}_6\\text{H}_{12}\\text{O}_6 + 6\\text{O}_2", description: "Overall photosynthesis equation" },
    { latex: "2\\text{H}_2\\text{O} \\rightarrow 4\\text{H}^+ + 4e^- + \\text{O}_2", description: "Water splitting (photolysis) at Photosystem II" },
  ],
  theory: "The light reactions of photosynthesis occur in the thylakoid membrane. Photosystem II (P680) absorbs photons and splits water, releasing O₂ and electrons. These electrons pass through the electron transport chain (plastoquinone → cytochrome b6f → plastocyanin), pumping H⁺ into the thylakoid lumen. Photosystem I (P700) re-energizes the electrons, which reduce NADP⁺ to NADPH via ferredoxin. The H⁺ gradient drives ATP synthase (chemiosmosis), producing ATP. Red light (680 nm) is most efficiently absorbed by chlorophyll a; action spectra show peaks at ~430 nm (blue) and ~680 nm (red).",
  instructions: "Adjust light intensity and wavelength to observe their effects on electron flow rate, ATP production, and O₂ evolution. The animation shows electron movement through the thylakoid membrane components.",
  challenges: [
    { id: "plr-c1", question: "Why does green light produce less ATP than red or blue light?", hint: "Chlorophyll reflects green light — it's not absorbed, so photosystems aren't excited", tier: "free" },
    { id: "plr-c2", question: "What would happen if you block the electron transport chain with DCMU?", hint: "Electrons can't flow from PSII → PSI. Water splitting stops, no O₂ produced, no NADPH made, ATP production drops dramatically", tier: "pro" },
  ],
  wave: 12, tier: "free", estimatedTime: 25,
  relatedExperiments: ["cellular-respiration"],
  htmlPath: "/experiments/ap-biology/photosynthesis-light-reactions.html",
  seoTitle: "Photosynthesis Light Reactions Simulation | Scivra AP Biology",
  seoKeywords: ["photosynthesis simulation", "light reactions interactive", "electron transport chain", "AP Biology"],
  jsonLd: { "@type": "LearningResource", educationalLevel: "High School", teaches: "Photosynthesis Light Reactions" },
  contentSections: {
    whatIsIt:
      "The light reactions are the first stage of photosynthesis, converting solar energy into the chemical carriers ATP and NADPH that power sugar synthesis in the Calvin cycle. The action unfolds across the thylakoid membrane of the chloroplast: Photosystem II (P680) absorbs a photon and strips electrons from water molecules, releasing O₂ as a byproduct. Those electrons travel through a chain of carriers — plastoquinone, the cytochrome b6f complex, plastocyanin — to Photosystem I (P700), which re-energizes them and hands them off to reduce NADP⁺ to NADPH. The H⁺ gradient built by this electron flow drives ATP synthase in a process parallel to mitochondrial chemiosmosis. Adjust light intensity and wavelength in the simulation to see exactly how photon input shapes electron flow rate, ATP output, and O₂ evolution.",
    parameterExplanations: {
      lightIntensity:
        "The percentage of maximum photon flux hitting the thylakoid membrane, from 0% (darkness) to 100% (saturating light). Increasing intensity raises the rate at which P680 is excited, accelerating electron flow through the Z-scheme and boosting both ATP and NADPH production — until the light-saturation point, above which enzyme-limited Calvin cycle steps become the bottleneck.",
      wavelength:
        "The wavelength of incident light in nanometers (380–750 nm). Chlorophyll a absorbs most strongly at ~430 nm (violet-blue) and ~680 nm (red), matching the P680 absorption peak. Green wavelengths (~550 nm) are reflected rather than absorbed, so electron flow and O₂ output drop sharply in the green region of the spectrum — the simulation's action spectrum response demonstrates this directly.",
      co2Level:
        "Atmospheric CO₂ concentration in ppm, ranging from 100 to 1000 ppm. CO₂ is not consumed by the light reactions, but it indirectly limits the system by determining how quickly the Calvin cycle pulls NADPH and ATP from the light stage. At high CO₂ the cycle accelerates, drawing down NADPH faster and preventing photoinhibition buildup; at very low CO₂ the cycle stalls and ATP/NADPH accumulate.",
    },
    misconceptions: [
      {
        wrong:
          "Photosynthesis only happens during the day, while respiration only happens at night.",
        correct:
          "Photosynthesis requires light and is indeed light-dependent, but respiration runs continuously in all living plant cells, 24 hours a day. During daylight, photosynthesis usually produces more O₂ than respiration consumes, so the net gas exchange appears to be only O₂ out — but both processes run simultaneously.",
      },
      {
        wrong:
          "Chloroplasts produce oxygen by splitting CO₂.",
        correct:
          "The oxygen released during photosynthesis comes from water (H₂O), not CO₂. Water is split at Photosystem II (P680) through a process called photolysis: 2 H₂O → 4 H⁺ + 4 e⁻ + O₂. CO₂ is fixed into sugars in the Calvin cycle, not during the light reactions.",
      },
      {
        wrong:
          "More light always means faster photosynthesis — there is no upper limit.",
        correct:
          "Light saturation is real. Above the light-saturation point, reaction-center chlorophylls are already absorbing photons as fast as downstream enzymes can process electrons. Additional photons cannot accelerate the ETC further and can even cause photoinhibition by damaging PSII. The simulation shows this plateau in ATP output at high light intensities.",
      },
      {
        wrong:
          "NADPH and ATP are just byproducts — the real product of photosynthesis is oxygen.",
        correct:
          "ATP and NADPH are the actual functional outputs of the light reactions, used directly to power the Calvin cycle. Oxygen is a byproduct of water splitting, discarded because the cell needs the electrons, not the oxygen. From the cell's perspective, O₂ release is waste management.",
      },
    ],
    teacherUseCases: [
      "Action spectrum investigation: have students step the wavelength slider from 380 nm to 750 nm in 30 nm increments, record relative O₂ evolution at each wavelength, and plot the action spectrum. Compare their curve to chlorophyll's absorption spectrum and discuss why they largely match.",
      "Light intensity vs. ATP rate plot: ask pairs to record ATP production rate at 0%, 20%, 40%, 60%, 80%, and 100% light intensity. Graph the data, identify the light-saturation point, and discuss what limits the rate beyond that point — tie to AP Bio 2.A.2.",
      "Z-scheme electron path: pause the simulation and ask students to trace a single electron from water splitting at P680 all the way to NADPH formation at P700. Require them to name every carrier in order (plastoquinone, cytochrome b6f, plastocyanin, ferredoxin, NADP⁺ reductase).",
      "CO₂ feedback misconception probe: set CO₂ to minimum and ask 'Why does ATP output drop if CO₂ isn't used in the light reactions?' Use responses to reveal whether students understand the Calvin cycle as a consumer of light-reaction products.",
      "Comparison to cellular respiration ETC: after running this simulation, have students map structural parallels between the thylakoid ETC and the mitochondrial ETC — proton pumping, ATP synthase, electron donors and acceptors — reinforcing Big Idea 2 energetics patterns.",
    ],
    faq: [
      {
        question: "Why does green light produce so little photosynthesis?",
        answer:
          "Chlorophyll a and b absorb most efficiently in the red (~680 nm) and blue (~430 nm) regions of the spectrum. Green wavelengths (~500–560 nm) are absorbed much less efficiently — most green light is reflected or transmitted, which is why plants appear green. Photosynthesis still proceeds in pure green light because accessory pigments and partial chlorophyll absorption capture some photons, but electron flow, O₂ output, and ATP/NADPH production all drop sharply compared to red or blue light.",
      },
      {
        question: "What is the Z-scheme?",
        answer:
          "The Z-scheme describes the energy pathway of electrons through the two photosystems, named for the Z-shape the diagram makes when energy is plotted against redox potential. Electrons start at a low energy state in water, jump to high energy at P680 (PSII), lose energy through the ETC while pumping H⁺, jump again to high energy at P700 (PSI), and finally reduce NADP⁺ to NADPH. Each electron is boosted twice — once at PSII and once at PSI — by absorbing two photons in total.",
      },
      {
        question: "How does the proton gradient in chloroplasts compare to the one in mitochondria?",
        answer:
          "The mechanism is identical: electron transport pumps H⁺ across a membrane, building a gradient that drives ATP synthase. In chloroplasts the gradient is across the thylakoid membrane (H⁺ accumulates inside the lumen); in mitochondria it is across the inner membrane (H⁺ accumulates in the intermembrane space). Both use the same rotary ATP synthase mechanism.",
      },
      {
        question: "Which AP Biology standard does this simulation address?",
        answer:
          "The primary standard is AP Bio 2.A.2, which requires students to explain how photosynthesis captures free energy and transfers it to organic molecules via electron transport and chemiosmosis. The light reactions are the core mechanism: photon energy is converted to the chemical energy of ATP and NADPH, which are then used to fix CO₂ in the Calvin cycle.",
      },
      {
        question: "Where does the oxygen we breathe come from in photosynthesis?",
        answer:
          "Oxygen comes exclusively from the splitting of water at Photosystem II — this was confirmed by isotope labeling experiments using H₂¹⁸O. When water is oxidized, 2 H₂O → 4 H⁺ + 4 e⁻ + O₂, the oxygen atoms are released as O₂ gas. Carbon dioxide oxygen atoms end up in sugar, not in the released O₂.",
      },
    ],
  },
};
