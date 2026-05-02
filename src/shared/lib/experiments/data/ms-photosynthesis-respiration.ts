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
  primaryStandard: "ngss-ms",
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

  seoTitle: "Photosynthesis Respiration Middle School | Scivra Biology",
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
  contentSections: {
    whatIsIt:
      "All life on Earth needs energy to move, grow, and reproduce. But where does that energy come from, and how do living things actually use it? Photosynthesis and cellular respiration are the two interconnected processes that answer those questions. Photosynthesis happens in chloroplasts — the green structures inside plant cells. Using sunlight, carbon dioxide from the air, and water absorbed from the soil, plants build glucose molecules and release oxygen as a byproduct. Essentially, plants are tiny solar-powered food factories. Cellular respiration is the reverse: it happens in the mitochondria of nearly every living cell — plant, animal, or fungus — and it breaks glucose back down using oxygen to release the energy stored in its chemical bonds. That released energy is packaged into ATP molecules, the rechargeable batteries that power everything a cell does. The oxygen we breathe in fuels respiration; the CO2 we breathe out is its waste product. Together, photosynthesis and cellular respiration form a continuous cycle that moves carbon through ecosystems and keeps energy flowing through all life on Earth. This simulation lets you see inside both organelles at once and explore what happens when conditions like light intensity or CO2 availability change.",
    parameterExplanations: {
      lightIntensity:
        "Controls how much light reaches the chloroplast, adjustable from 0% to 100% in steps of 5%. At 0% there is no light energy available and photosynthesis stops entirely — the plant can only do cellular respiration and will slowly use up stored glucose. At 100%, maximum light drives the fastest possible photosynthesis rate given the current CO2 level. Note that increasing light beyond what the CO2 supply can support will not increase glucose production further — CO2 then becomes the limiting factor.",
      co2Level:
        "Sets the atmospheric concentration of carbon dioxide available to the plant, from 100 ppm to 1000 ppm in steps of 50 ppm. Today's atmospheric CO2 is approximately 420 ppm. Carbon dioxide is a raw material for photosynthesis — more CO2 generally means faster glucose production up to the point where light or temperature becomes limiting. Reducing CO2 below about 200 ppm can slow photosynthesis noticeably even in bright light.",
      process:
        "Switches which biological process the animation displays: 0 = Photosynthesis only (shows the chloroplast converting light energy, CO2, and water into glucose and oxygen), 1 = Cellular Respiration only (shows the mitochondrion breaking down glucose with oxygen to release ATP, CO2, and water), 2 = Both simultaneously in a split view. The Both mode (2) is especially powerful for seeing how the oxygen released by photosynthesis feeds directly into respiration and how the CO2 released by respiration cycles back into photosynthesis.",
      temperature:
        "Controls the temperature of the environment in degrees Celsius, adjustable from 5 to 45 in steps of 5. This is a Pro-tier parameter. Both photosynthesis and cellular respiration are driven by enzymes that work best within a moderate temperature range. Too cold and the enzymes slow down; too hot and they begin to lose their shape and stop working. Setting temperature above about 40 degrees Celsius typically shows a sharp decline in both processes, while temperatures between 20 and 30 degrees Celsius generally support peak rates.",
    },
    misconceptions: [
      {
        wrong: "Plants do photosynthesis but not cellular respiration.",
        correct:
          "Plants do both. Photosynthesis happens only in cells containing chloroplasts during daylight. Cellular respiration happens in the mitochondria of every living plant cell, day and night, to power the plant's own growth and metabolism. During the day, plants typically photosynthesize faster than they respire, producing a net surplus of glucose and oxygen. At night, with photosynthesis shut off, only respiration continues — plants do take in oxygen and release CO2 in the dark.",
      },
      {
        wrong: "Photosynthesis and cellular respiration are opposite processes that cancel each other out.",
        correct:
          "The two processes are mirror images chemically — one builds glucose using energy, the other breaks glucose to release energy — but they do not simply cancel each other out. Photosynthesis captures solar energy and stores it in chemical bonds. Cellular respiration harvests that stored energy to do work. Together they form the carbon cycle at the cellular level: carbon atoms cycle between CO2 in the air and glucose in living things, while energy flows in one direction — from sunlight through chemistry to heat.",
      },
      {
        wrong: "More light always means more photosynthesis.",
        correct:
          "Light intensity is one of several factors that can limit photosynthesis rate. When light is low, increasing it speeds up photosynthesis. But once there is enough light, the reaction is often limited instead by CO2 availability or enzyme capacity. Adding more light beyond that point produces no additional glucose — the plant has reached a light saturation point. The co2Level slider lets you observe how raising CO2 can shift the limiting factor and allow photosynthesis to increase again.",
      },
      {
        wrong: "ATP is a food molecule that plants make during photosynthesis.",
        correct:
          "ATP (adenosine triphosphate) is the cell's energy currency — a molecule that carries and delivers energy to wherever it is needed inside a cell. Photosynthesis does produce ATP and NADPH in its light reactions, but that ATP is used internally to build glucose and is not exported to the rest of the cell. Cellular respiration then breaks glucose back down and produces the large amounts of ATP that power cell-wide processes — muscle movement, protein building, cell division, and everything else. Glucose from photosynthesis is the stable savings account; cellular respiration is what converts it into spendable ATP.",
      },
    ],
    teacherUseCases: [
      "Set process to 2 (Both), lightIntensity to 70, and co2Level to 400. Ask students to identify which organelle produces oxygen and which produces ATP, then trace where the oxygen goes after it leaves the chloroplast.",
      "Set process to 0 (Photosynthesis only) and reduce lightIntensity from 70 to 0 in steps while holding co2Level constant at 400. Have students record glucose production rate at each light level and graph the relationship between light intensity and photosynthesis rate.",
      "Compare limiting factors: hold lightIntensity at 100 and vary co2Level from 100 to 1000 in three steps. Then hold co2Level at 400 and vary lightIntensity from 0 to 100. Ask students which parameter has a larger effect on photosynthesis rate at the settings they tested.",
      "Set process to 1 (Cellular Respiration only) and ask students to explain what happens to a plant's energy supply if it is kept in complete darkness for several days. Connect this to real scenarios like shipping plants and the importance of light for survival.",
      "Use the temperature slider (Pro) to explore enzyme sensitivity: set temperature to 25 degrees and record the process rate, then increase to 40 and 45 degrees. Ask students why the rate drops sharply at high temperatures and what that implies for plants during heat waves.",
    ],
    faq: [
      {
        question: "Why do plants look green?",
        answer:
          "Chlorophyll, the pigment inside chloroplasts that absorbs light energy for photosynthesis, absorbs red and blue wavelengths of light very efficiently but reflects green wavelengths. Because green light bounces back to our eyes rather than being absorbed, leaves appear green. Plants do have additional pigments (like carotenoids) that absorb other wavelengths, which is why some leaves appear yellow, orange, or red — particularly in autumn when chlorophyll breaks down and reveals those other pigments.",
      },
      {
        question: "What happens to a plant kept in a sealed, lit container?",
        answer:
          "Initially, the plant photosynthesize and uses up CO2 while producing O2. As CO2 concentration drops, photosynthesis rate slows. Eventually CO2 becomes so scarce that photosynthesis stops almost entirely, and the plant can only do cellular respiration. If the container is truly sealed and the plant respires faster than a small residual photosynthesis rate, CO2 gradually accumulates while O2 is consumed. The plant will eventually be unable to survive if CO2 and O2 levels drift too far from the usable range.",
      },
      {
        question: "Which NGSS standards does this experiment address?",
        answer:
          "This simulation supports MS-LS1-6 (construct a scientific explanation based on evidence for the role of photosynthesis in the cycling of matter and flow of energy into and out of organisms) and MS-LS1-7 (develop a model to describe how food is rearranged through chemical reactions forming new molecules that support growth and/or release energy as this matter moves through an organism). The split-screen Both mode visually models both matter cycling and energy flow simultaneously.",
      },
      {
        question: "Do animals do anything like photosynthesis?",
        answer:
          "Most animals cannot photosynthesize because they lack chloroplasts. A few extraordinary exceptions exist — the sea slug Elysia chlorotica can incorporate chloroplasts from algae it eats and use them to photosynthesize for a period of time. Some coral-forming animals host photosynthetic algae called zooxanthellae in their tissues and receive glucose from them. But the vast majority of animals, including humans, are entirely dependent on consuming organisms that originally captured solar energy through photosynthesis.",
      },
      {
        question: "Why is cellular respiration important if plants already made glucose through photosynthesis?",
        answer:
          "Glucose is energy stored in chemical bonds — it is potential energy waiting to be used. Cells cannot directly use glucose to power muscle contractions, build proteins, or run ion pumps. They need ATP, the cell's direct energy currency. Cellular respiration is the process that converts the potential energy locked in glucose into ATP molecules that can be immediately spent wherever energy is needed in the cell. Without respiration, glucose would just sit in the cell unusable — like having money in a foreign currency you cannot spend until it is exchanged.",
      },
    ],
  },
};
