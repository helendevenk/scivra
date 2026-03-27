import type { Experiment } from "@/shared/types/experiment";

export const diffusion: Experiment = {
  id: "diffusion",
  slug: "diffusion-osmosis-simulation",
  title: "Diffusion",
  subtitle: "Watch particles spread from high to low concentration",
  description:
    "Observe molecules diffusing across a membrane from high to low concentration. Adjust temperature, membrane permeability, and concentration gradients to explore Fick's Law of diffusion.",
  thumbnail: "/imgs/experiments/ideal-gas-thermodynamics.png",

  standards: {
    ngss: ["HS-PS2-6", "HS-LS1-3"],
    gcse: ["AQA B3.1", "AQA C4.2"],
    ap: ["ENE-2.L", "ENE-2.M"],
  },
  primaryStandard: "ap-physics-2",
  category: "modern",
  subject: "physics",
  gradeLevel: "9-12",
  tags: ["diffusion", "osmosis", "concentration gradient", "Fick's law", "membrane", "molecular motion"],
  difficulty: "intermediate",

  parameters: [
    { id: "temp", label: "Temperature", unit: "K", min: 200, max: 800, default: 300, step: 10, tier: "free" },
    { id: "conc_left", label: "Left Concentration", unit: "mol/L", min: 0, max: 10, default: 8, step: 0.1, tier: "free" },
    { id: "conc_right", label: "Right Concentration", unit: "mol/L", min: 0, max: 10, default: 2, step: 0.1, tier: "free" },
    { id: "membrane_pore", label: "Pore Size", unit: "nm", min: 0.1, max: 5, default: 1, step: 0.1, tier: "pro" },
  ],

  formulas: [
    { latex: "J = -D\\frac{\\Delta C}{\\Delta x}", description: "Fick's First Law of Diffusion" },
    { latex: "D \\propto \\sqrt{\\frac{k_B T}{m}}", description: "Diffusion coefficient vs. temperature" },
  ],

  theory:
    "Diffusion is the net movement of particles from regions of high concentration to low concentration driven by thermal motion. Fick's First Law states that the diffusion flux J is proportional to the concentration gradient. Higher temperatures increase particle kinetic energy, speeding diffusion. Membrane pore size selectively restricts passage — larger molecules diffuse more slowly through smaller pores.",
  instructions:
    "The simulation starts with high concentration on the left and low on the right. Watch particles drift across the membrane. Increase temperature to speed up diffusion. Change pore size to limit which particles cross. Plot concentration vs. time to see exponential equilibration.",
  challenges: [
    { id: "di-c1", question: "How does doubling the temperature affect diffusion rate?", hint: "D ∝ √T, so doubling T increases D by √2 ≈ 1.41", tier: "free" },
    { id: "di-c2", question: "At equilibrium, do particles stop moving? Why?", hint: "Particles continue moving randomly but net flux = 0", tier: "free" },
    { id: "di-c3", question: "Why does a larger pore size increase diffusion flux proportionally but larger molecules diffuse more slowly?", hint: "Pore size sets the cross-sectional area; molecular mass affects D via √(1/m)", tier: "pro" },
  ],

  wave: 8,
  tier: "free",
  estimatedTime: 20,
  relatedExperiments: ["atomic-interactions", "states-of-matter-basics", "gases-intro"],

  seoTitle: "Diffusion Simulation — Fick's Law | AP Physics 2 Lab",
  seoKeywords: ["diffusion", "osmosis", "Fick's law", "concentration gradient", "membrane", "AP Physics 2"],
  jsonLd: { "@type": "LearningResource", educationalLevel: "High School", teaches: "Diffusion, Fick's Law, Concentration Gradient" },
};
