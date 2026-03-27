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
};
