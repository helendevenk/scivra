import type { Experiment } from "@/shared/types/experiment";

export const msPhotosynthesisRespiration: Experiment = {
  id: "ms-photosynthesis-respiration",
  slug: "ms-photosynthesis-respiration",
  title: "Photosynthesis & Cellular Respiration",
  subtitle: "How living things make and use energy",
  description:
    "See inside a chloroplast as light energy converts CO₂ and H₂O into glucose and oxygen. Then watch a mitochondrion as glucose is broken down to release ATP. Discover how these two processes are mirror images of each other and how they sustain all life on Earth.",
  thumbnail: "/imgs/experiments/ms-photosynthesis-respiration.png",

  standards: {
    ngss: ["MS-LS1-6", "MS-LS1-7", "HS-LS1-5"],
    gcse: ["B2.3", "B2.4"],
    ap: [],
  },
  category: "biology",
  subject: "biology",
  gradeLevel: "6-8",
  tags: ["photosynthesis", "cellular respiration", "ATP", "chloroplast", "mitochondria", "middle school", "6-8"],
  difficulty: "intermediate",

  parameters: [
    {
      id: "lightIntensity",
      label: "Light Intensity",
      unit: "%",
      min: 0,
      max: 100,
      default: 70,
      step: 5,
      tier: "free",
    },
    {
      id: "co2Level",
      label: "CO₂ Level",
      unit: "ppm",
      min: 100,
      max: 1000,
      default: 400,
      step: 50,
      tier: "free",
    },
    {
      id: "process",
      label: "Process (0=Photosynthesis, 1=Respiration, 2=Both)",
      unit: "",
      min: 0,
      max: 2,
      default: 2,
      step: 1,
      tier: "free",
    },
    {
      id: "temperature",
      label: "Temperature",
      unit: "°C",
      min: 5,
      max: 45,
      default: 25,
      step: 5,
      tier: "pro",
    },
  ],

  formulas: [
    {
      latex: "6\\text{CO}_2 + 6\\text{H}_2\\text{O} + \\text{light} \\to \\text{C}_6\\text{H}_{12}\\text{O}_6 + 6\\text{O}_2",
      description: "Photosynthesis: carbon dioxide + water + light → glucose + oxygen",
    },
    {
      latex: "\\text{C}_6\\text{H}_{12}\\text{O}_6 + 6\\text{O}_2 \\to 6\\text{CO}_2 + 6\\text{H}_2\\text{O} + \\text{ATP}",
      description: "Cellular respiration: glucose + oxygen → CO₂ + water + energy (ATP)",
    },
  ],

  theory:
    "Photosynthesis and cellular respiration are complementary processes that cycle energy and matter through ecosystems. Photosynthesis occurs in chloroplasts (green organelles in plant cells): light energy (absorbed by chlorophyll) drives the conversion of CO₂ + H₂O into glucose (C₆H₁₂O₆) and oxygen. The oxygen is released as a byproduct — this is the source of Earth's atmospheric oxygen. Cellular respiration occurs in mitochondria of all living cells: glucose is broken down through glycolysis, the Krebs cycle, and the electron transport chain, releasing ATP (the cell's energy currency), CO₂, and water. The two processes are essentially the reverse of each other. The carbon atoms in every glucose molecule have been cycled through the atmosphere countless times.",

  instructions:
    "In Both mode, watch photosynthesis (top: chloroplast, produces O₂ and glucose) and respiration (bottom: mitochondria, consumes glucose and produces ATP) running simultaneously. Reduce light intensity — photosynthesis slows; the plant has less glucose. Increase CO₂ to boost photosynthesis rate. Toggle between processes to study each in detail.",

  challenges: [
    {
      id: "psr-ms-c1",
      question: "Which gas do plants release during photosynthesis? Which gas do they take in?",
      hint: "Plants take in CO₂ (carbon dioxide) and release O₂ (oxygen) during photosynthesis. This is the opposite of cellular respiration, which takes in O₂ and releases CO₂.",
      tier: "free",
    },
    {
      id: "psr-ms-c2",
      question: "Why do plants grow faster with more light, up to a point? What limits them after that?",
      hint: "More light → faster photosynthesis → more glucose → more growth. But after a certain intensity, CO₂ availability or temperature becomes the limiting factor, and growth plateaus. Too much light can also damage chlorophyll.",
      tier: "free",
    },
    {
      id: "psr-ms-c3",
      question: "If you put a plant in a sealed, lit container, what happens over time to CO₂ and O₂ levels?",
      hint: "CO₂ decreases (used in photosynthesis), O₂ increases (released in photosynthesis). Eventually CO₂ runs out and photosynthesis stops. At night (dark), respiration reverses the trend.",
      tier: "free",
    },
    {
      id: "psr-ms-c4",
      question: "A plant produces 180 g of glucose in one day. How many grams of CO₂ did it absorb? (Molar masses: glucose=180 g/mol, CO₂=44 g/mol)",
      hint: "1 mol glucose (180 g) requires 6 mol CO₂. 6 × 44 = 264 g CO₂ absorbed per 180 g glucose produced.",
      tier: "pro",
    },
  ],

  wave: 6,
  tier: "free",
  estimatedTime: 14,
  relatedExperiments: ["photosynthesis", "cellular-respiration", "ms-ecosystems"],

  seoTitle: "Photosynthesis Respiration Middle School | NeonPhysics Biology",
  seoKeywords: [
    "photosynthesis respiration middle school simulation",
    "chloroplast mitochondria interactive",
    "ATP glucose energy 6-8",
    "carbon cycle photosynthesis",
    "biology energy middle school",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "Middle School",
    teaches: "Photosynthesis and Cellular Respiration",
  },
};
