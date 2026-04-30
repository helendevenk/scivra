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

  contentSections: {
    whatIsIt:
      "Open a bottle of perfume across the room and the scent reaches you in a few minutes. Drop ink into still water and the color spreads outward without stirring. Every such observation is diffusion: net movement of particles from high to low concentration, driven entirely by random thermal motion. No pumping — every molecule wanders independently, but because there are more on the high-concentration side, statistically more cross to the low side. Fick's First Law captures it: J = −D · ΔC/Δx, where flux is proportional to the gradient and D depends on temperature, mass, and medium. Add a semi-permeable membrane and you get osmosis — the case where the diffusing species is the solvent crossing in response to solute concentration. This lab puts a two-chamber box on screen with a tunable membrane, lets you set temperature and concentrations, and shows the molecular dance plus the concentration-vs-time curve.",
    parameterExplanations: {
      temp:
        "Absolute temperature in kelvin. Temperature controls how fast molecules move; KE_avg = (3/2)k_B T. Higher T means faster molecules, which means more frequent membrane crossings, which means a larger diffusion coefficient (D ∝ √T from the kinetic-theory derivation). Doubling T from 300 K to 600 K speeds diffusion by a factor of √2 ≈ 1.41 — a significant boost, which is why warm tea brews faster than iced tea.",
      conc_left:
        "Particle concentration in the left chamber, in mol/L. Sets the high-concentration side at start. Fick's First Law J = −D · ΔC/Δx says the flux is proportional to the difference between left and right; bigger gradient means faster initial flow. As particles diffuse rightward, conc_left drops and the gradient shrinks, so the diffusion rate slows over time — that's why concentration vs. time curves bend toward equilibrium exponentially.",
      conc_right:
        "Particle concentration in the right chamber, in mol/L. Together with conc_left this sets the initial gradient. Equilibrium is reached when both chambers have the same concentration (the average of the two starting values, by mass conservation). Equilibrium does not mean particles stop moving — it means equal numbers cross each direction per second, so net flux is zero.",
      membrane_pore:
        "Effective membrane pore size in nanometers. Bigger pores let more particles through per unit time, so flux scales roughly with cross-sectional area. Smaller pores selectively block larger molecules — this is how cell membranes choose which solutes to admit, and how dialysis filters separate small waste molecules from larger blood proteins. Set pore size below the particle diameter and diffusion stops entirely.",
    },
    misconceptions: [
      {
        wrong:
          "At equilibrium the molecules stop moving because there's nothing more to do.",
        correct:
          "Molecules keep moving at full thermal speed at equilibrium — KE_avg = (3/2)k_B T doesn't go to zero. What stops is the net flux. Equal numbers cross each direction per second, so concentrations stay constant. Watch the simulation at equilibrium and you'll see particles still bouncing across the membrane in both directions; the net flow is just zero.",
      },
      {
        wrong:
          "Particles diffuse from high to low concentration because they 'want to' spread out.",
        correct:
          "Molecules don't want anything. Each one moves randomly, independent of all the others. The net flow toward low concentration is statistical: with more particles on the high side, it's simply more likely that one of them is the next to cross. This is the second-law-of-thermodynamics flavor of diffusion — entropy increases because spreading out has way more microstates than staying clumped.",
      },
      {
        wrong:
          "Osmosis is special diffusion where water is somehow pulled across the membrane by the solute.",
        correct:
          "Osmosis is just diffusion of water through a membrane that blocks the solute. Water diffuses both directions equally if there is no solute. Add solute on one side and that side has slightly fewer water molecules (because solute occupies some volume and interacts with water), so net water flow goes from low solute to high solute concentration. Nothing 'pulls' the water — it just diffuses normally based on its own concentration gradient.",
      },
      {
        wrong:
          "Heat and temperature mean the same thing in this experiment.",
        correct:
          "Temperature is the average kinetic energy per molecule (intensive); heat is the energy transferred between systems (extensive). Two boxes of gas at the same T have molecules with the same average KE, but the bigger box holds more total thermal energy. Diffusion rate depends on T because that controls per-molecule speed; the total amount of heat in the system doesn't directly enter Fick's law.",
      },
      {
        wrong:
          "Bigger molecules diffuse faster because they're more massive.",
        correct:
          "Bigger and heavier molecules diffuse slower. From kinetic theory v_avg ∝ 1/√m, so a hydrogen molecule (m = 2) zips along about four times faster than oxygen (m = 32) at the same temperature. The diffusion coefficient D scales roughly with v_avg, so heavier molecules also have smaller D. That's why oxygen takes longer to diffuse across an alveolar membrane than CO₂ would on its own — even though biology helps speed up the actual gas exchange.",
      },
    ],
    teacherUseCases: [
      "Equilibrium prediction: have students compute the final equilibrium concentration before running the simulation. With c_left = 8 and c_right = 2, mass conservation gives 5 in each chamber. Compare with the simulation's final readout to anchor the average rule.",
      "Temperature dependence lab: have student pairs run the simulation at 200 K, 400 K, and 800 K with identical starting concentrations, recording time-to-half-equilibrium each time. Plot vs. √T to recover the kinetic-theory prediction.",
      "Pore-selectivity discussion: assign teams to find the pore size that just stops the simulated particle from crossing. Connect the result to real cell membranes (water channels are ~0.3 nm, ions move through specific channels) and dialysis filters (let urea through but not albumin).",
      "Osmosis tie-in: ask 'why does pickling shrivel a cucumber?' before the lab. Use the high-solute-low-solute logic to predict that water leaves the cucumber's cells, then run a simulation with the right side as 'high solute' to model it visually.",
      "Misconception probe: at equilibrium, pause the simulation and ask 'are the particles still moving?' Many students will say no because the concentration isn't changing. Use the still-moving particles on screen to drive home the difference between net flux and microscopic motion.",
    ],
    faq: [
      {
        question: "Why does diffusion happen — what's the actual driving force?",
        answer:
          "Random thermal motion of independent molecules, plus statistics. Each molecule wanders aimlessly, but because there are more molecules on the high-concentration side, more of them happen to cross to the low side per second than the other way around. There's no force pushing molecules from high to low — it's a probability argument. Equilibrium is reached when crossings happen equally in both directions, so net flux is zero even though individual molecules keep moving.",
      },
      {
        question: "How does temperature affect diffusion rate?",
        answer:
          "Increasing temperature increases molecular kinetic energy (KE_avg = (3/2)k_B T), so molecules move faster and cross the membrane more often. The diffusion coefficient D scales as √T from kinetic-theory arguments, so doubling T from 300 K to 600 K speeds diffusion by √2 ≈ 1.41. That's why warm tea brews faster than iced tea, why heating a perfume bottle makes the scent reach you faster, and why biological reactions slow dramatically in cold temperatures.",
      },
      {
        question: "What's the difference between diffusion and osmosis?",
        answer:
          "Diffusion is the general phenomenon: any species moving from high to low concentration. Osmosis is the specific case where water (the solvent) diffuses through a semi-permeable membrane that blocks the solute. The water still follows the same Fick's law it always does — just with the membrane filtering out one species. Net water flow is from low solute to high solute concentration because that's where water concentration is lower.",
      },
      {
        question: "If diffusion is just random motion, why doesn't a stinky sock un-stink?",
        answer:
          "It does, slowly. Smell molecules diffuse outward from the sock indefinitely. The reason it doesn't 'un-stink' on a useful timescale is that fresh smell molecules keep being released, replacing the ones that diffused away. Stop the source and ventilate the room, and the stink does eventually fade as molecules disperse to immeasurably low concentrations. The second law forbids the molecules from spontaneously gathering back into the sock — that's the 'entropy always increases' rule in action.",
      },
      {
        question: "Why does a salt water IV not damage red blood cells?",
        answer:
          "Hospital IV saline is ~0.9% NaCl, the same osmotic concentration as blood plasma — that's called isotonic. With equal solute concentration on both sides of the cell membrane, water diffuses equally in both directions and the cell stays the same size. Pure water (hypotonic) would cause cells to swell and burst (water flowing in by osmosis); seawater (hypertonic) would shrivel them like the cucumber. Matching osmotic concentrations is critical for any IV fluid.",
      },
      {
        question: "How does this connect to AP Physics 2 standards ENE-2.L and ENE-2.M?",
        answer:
          "AP Physics 2 ENE-2.L asks students to apply Fick's First Law to predict diffusion flux given a concentration gradient, and ENE-2.M asks them to relate diffusion rate to molecular kinetic energy and temperature. NGSS HS-PS2-6 expects students to use molecular models to explain the function of selectively permeable membranes, and HS-LS1-3 covers feedback mechanisms with diffusion across cell membranes. This lab makes both molecular and macroscopic views available simultaneously.",
      },
    ],
  },
};
