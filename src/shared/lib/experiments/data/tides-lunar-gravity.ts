import type { Experiment } from "@/shared/types/experiment";

export const tidesLunarGravity: Experiment = {
  id: "tides-lunar-gravity",
  slug: "tides-lunar-gravity",
  title: "Tides & Lunar Gravity",
  subtitle: "How the Moon and Sun create tidal bulges on Earth",
  description:
    "Visualize how the Moon's gravitational pull creates tidal bulges on opposite sides of Earth. Observe spring tides (Sun + Moon aligned) and neap tides (Sun and Moon at 90°). Adjust the Moon's orbital position and watch how coastal water levels rise and fall through a full tidal cycle.",
  thumbnail: "/imgs/experiments/tides-lunar-gravity.png",

  standards: {
    ngss: ["HS-ESS1-4", "MS-ESS1-2"],
    gcse: [],
    ap: [],
  },
  primaryStandard: "ngss-hs",
  category: "earth",
  subject: "earth-science",
  gradeLevel: "9-12",
  tags: [
    "tides",
    "lunar gravity",
    "spring tide",
    "neap tide",
    "tidal bulge",
    "Moon orbit",
    "gravitational force",
    "Earth Science",
  ],
  difficulty: "beginner",

  parameters: [
    {
      id: "moonMass",
      label: "Moon Mass",
      unit: "×normal",
      min: 0.1,
      max: 5,
      default: 1,
      step: 0.1,
      tier: "free",
    },
    {
      id: "moonDistance",
      label: "Moon Distance",
      unit: "×normal",
      min: 0.5,
      max: 2,
      default: 1,
      step: 0.1,
      tier: "free",
    },
  ],

  formulas: [
    {
      latex: "F_{\\text{tidal}} = \\frac{2GMmr}{d^3}",
      description:
        "Tidal force is proportional to mass M of the attracting body and inversely proportional to the cube of distance d. The factor of 2r (Earth's diameter) arises from the differential pull across Earth.",
    },
    {
      latex: "\\frac{F_{\\text{Moon}}}{F_{\\text{Sun}}} \\approx 2.2",
      description:
        "Despite the Sun being far more massive, the Moon's proximity makes its tidal force ~2.2× stronger. Tides scale as M/d³, heavily favoring nearby objects.",
    },
  ],

  theory:
    "Tides result from the differential gravitational pull across Earth's diameter. The Moon pulls the near side of Earth more strongly than the center, and the center more than the far side. This creates two tidal bulges: one facing the Moon (direct gravitational pull) and one on the opposite side (where the center is pulled away from the water). As Earth rotates, coastal locations pass through both bulges, experiencing two high tides per day (semidiurnal tide). When Sun and Moon align (new/full moon), their tidal forces add up — producing extra-large spring tides. When they're at 90° (quarter moons), forces partially cancel — producing smaller neap tides. The tidal range varies from ~1 m (open ocean) to >15 m in funnel-shaped bays (Bay of Fundy). Tidal friction is gradually slowing Earth's rotation (~2.3 ms/century) and pushing the Moon farther away (~3.8 cm/year).",

  instructions:
    "Use the Moon Mass and Moon Distance sliders to change the strength of the lunar tidal force. Compare the Spring Tide, Neap Tide, and Perigee presets to see how alignment and distance change tidal range.",

  challenges: [
    {
      id: "tlg-c1",
      question: "Why are there two high tides per day instead of one?",
      hint: "The tidal bulge exists on BOTH sides of Earth — the side facing the Moon (direct pull) and the opposite side (inertial bulge). As Earth rotates, a coastal point passes through both bulges in ~24 hours.",
      tier: "free",
    },
    {
      id: "tlg-c2",
      question: "Why does the Moon have a stronger tidal effect than the Sun?",
      hint: "Tidal force ∝ M/d³. The Sun is 27 million × more massive but 390× farther. (27M)/(390³) ≈ 0.46, so the Sun's tidal force is actually less than half the Moon's. Proximity matters more than mass for tides.",
      tier: "free",
    },
  ],

  wave: 10,
  tier: "free",
  estimatedTime: 20,
  relatedExperiments: ["solar-system-scale", "star-life-cycle"],
  htmlPath: "/experiments/earth-science/tides-lunar-gravity.html",

  seoTitle: "Tides & Lunar Gravity Simulation | Scivra Earth Science",
  seoKeywords: [
    "tides simulation",
    "lunar gravity interactive",
    "spring neap tides",
    "tidal bulge visualization",
    "Moon Earth tides",
    "Earth science virtual lab",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "High School",
    teaches: "Tidal Forces and Lunar Gravitational Effects",
  },
  htmlControlAliases: { moonMass: "moonSlider", moonDistance: "distSlider" },
  presets: [
    {
      id: "spring",
      label: "Spring Tide (Sun + Moon Aligned)",
      description:
        "Spring tides occur when the Sun, Earth, and Moon are aligned, so the solar and lunar tidal forces reinforce each other. The result is a larger tidal range with higher high tides and lower low tides.",
    },
    {
      id: "neap",
      label: "Neap Tide (Sun + Moon Perpendicular)",
      description:
        "Neap tides occur when the Sun and Moon pull at roughly right angles, so their tidal effects partially offset each other. This produces a smaller tidal range than a spring tide.",
    },
    {
      id: "perigee",
      label: "Perigee (Moon Closest to Earth)",
      description:
        "Perigee is the part of the Moon's orbit when it is closest to Earth. Because tidal force follows F ∝ M/d³, even a smaller distance can noticeably increase the lunar tide.",
    },
  ],
  contentSections: {
    whatIsIt:
      "Stand at a beach and watch the waterline creep up the sand for six hours, then reverse for six hours — that rhythm is Earth responding to the Moon's gravity, and it has been running for 4.5 billion years. Tides are not caused by the Moon simply pulling the ocean toward it; they arise from the difference in gravitational pull across Earth's diameter. The Moon tugs the near-side ocean more strongly than Earth's center, and tugs Earth's center more strongly than the far-side ocean. The result is two tidal bulges — one facing the Moon and one on the opposite side — and as Earth rotates through them, most coastlines experience two high tides roughly every 25 hours. The Sun also contributes a tidal force about 46% as strong as the Moon's; when Sun, Earth, and Moon align at new or full moon, their forces add to produce spring tides, while a 90° arrangement at quarter moons produces smaller neap tides. This simulation lets you adjust the Moon's mass and distance and watch the tidal bulges and coastal gauge respond in real time.",
    parameterExplanations: {
      moonMass:
        "Moon Mass changes the Moon's mass relative to its normal value, so 1×normal represents today's Moon and larger values represent a more massive Moon. In the tidal-force relationship F ∝ M/d³, mass is directly proportional to tidal force: doubling the Moon's mass roughly doubles the lunar tidal contribution when distance stays the same. Use this slider after trying the Spring Tide and Neap Tide presets to separate two ideas: alignment controls whether solar and lunar tides add or partially cancel, while Moon Mass controls how strong the lunar part is. This is a useful way to connect the visual tidal bulges to a mathematical model.",
      moonDistance:
        "Moon Distance changes the Earth-Moon distance relative to its normal value, so 1×normal represents today's average distance. Tidal force follows F ∝ M/d³, which means distance has a very strong effect: moving the Moon closer increases tides by the cube of the distance change, while moving it farther away weakens tides quickly. Try the Perigee preset first, then adjust Moon Distance while keeping Moon Mass at 1×normal. Compare that result with Spring Tide and Neap Tide presets to see that close distance and Sun-Moon alignment are different causes of larger or smaller tidal range.",
    },
    misconceptions: [
      {
        wrong:
          "The Moon only pulls water on the side of Earth facing it, so there should be just one high tide per day.",
        correct:
          "There are two tidal bulges, not one. On the Moon-facing side the ocean is pulled toward the Moon more than Earth's center is. On the opposite side, Earth's center is pulled toward the Moon more than the far ocean is, leaving that water behind as a second bulge. Both bulges are real, which is why most coasts get two high tides per ~25 hours.",
      },
      {
        wrong:
          "The Sun is so much bigger than the Moon that the Sun must control the tides.",
        correct:
          "Tidal force depends on mass divided by the cube of distance (M/d³), not just mass. The Sun is 27 million times more massive than the Moon but also 390 times farther away. Cubing 390 and dividing gives the Sun a tidal force only about 46% of the Moon's — the Moon dominates tides despite being far smaller.",
      },
      {
        wrong:
          "High tide always occurs when the Moon is directly overhead.",
        correct:
          "In the real ocean, beyond this simplified model, the tidal bulge is slightly ahead of the Moon's position because Earth rotates faster than the Moon orbits and friction between the ocean and seafloor drags the bulge forward. Additionally, local geography — bay shape, ocean basin resonance, and coastline geometry — can shift high tide by several hours from the Moon's overhead transit. This simulation aligns bulges directly with the Moon for conceptual clarity; the phase lag and geographic variation are real-world complications not represented here.",
      },
      {
        wrong:
          "Tides only happen in oceans; lakes and rivers are unaffected.",
        correct:
          "The solid Earth itself deforms slightly under tidal forces (Earth tides of up to ~55 cm), and the atmosphere has tidal pressure waves. Large lakes like the Great Lakes do experience tides, but they are only a few centimeters — too small to notice against wind-driven waves. The effect is real everywhere on and in Earth.",
      },
      {
        wrong:
          "Spring tides only happen in spring (the season).",
        correct:
          "Spring tides have nothing to do with the spring season. The word comes from the German 'springen' (to leap up). Spring tides occur at every new moon and full moon — roughly twice per month — whenever the Sun, Earth, and Moon are aligned and their tidal forces combine.",
      },
    ],
    teacherUseCases: [
      "HS-ESS1-4 model comparison: have students select Spring Tide, Neap Tide, and Perigee presets, then record which setup creates the largest tidal range. Students explain whether the change comes from alignment, distance, or both.",
      "MS-ESS1-2 gravity model: set the Neap Tide preset, then move only the Moon Mass slider from 0.5×normal to 2×normal. Ask students to describe how a stronger gravitational source changes the Earth-Moon tide model.",
      "Quantitative proportionality lab: keep Moon Distance at 1×normal, compare Moon Mass at 1×normal and 2×normal, then connect the result to F ∝ M/d³. Use the Spring Tide preset afterward to show that solar alignment adds a separate effect.",
      "Inverse-cube distance investigation: start with the Perigee preset and move the Moon Distance slider outward toward 2×normal while students predict how quickly tidal range should shrink. This supports HS-ESS1-4 by tying a computational representation to orbital distance.",
      "CER discussion: groups choose one preset and one slider change, then make a claim about tidal range using slider values as evidence. Require students to reference either Sun-Moon alignment or the F ∝ M/d³ relationship in their reasoning.",
    ],
    faq: [
      {
        question: "Why are there two high tides per day instead of one per day?",
        answer:
          "Tidal force is a gravitational gradient — it stretches Earth along the Earth-Moon line. The near-side ocean bulges toward the Moon; the far-side ocean bulges away because the rest of Earth is pulled toward the Moon more than that far water is. Two bulges exist simultaneously, and as Earth completes one rotation in ~24 hours while the Moon advances in its orbit, a coastal point passes through both bulges in about 24 hours 50 minutes, giving the familiar ~12.5-hour interval between high tides.",
      },
      {
        question: "Which NGSS standard is directly targeted by this experiment?",
        answer:
          "HS-ESS1-4 asks students to use mathematical or computational representations to predict the motion of orbiting objects in the solar system, including using gravitational relationships to explain phenomena such as tides. MS-ESS1-2 (also listed) asks middle-level students to develop a model to describe the role of gravity in the motions of the solar system, making this simulation useful for both grade bands. Adjust Moon Mass and Moon Distance to explore how the F ∝ M/d³ relationship that HS-ESS1-4 describes plays out in the visible tidal range.",
      },
      {
        question: "Why does the Moon slow down Earth's rotation over geologic time?",
        answer:
          "The ocean's tidal bulge is dragged slightly ahead of the Moon by Earth's faster rotation. That off-center bulge exerts a slight gravitational backward tug on Earth's spin (tidal braking), slowing Earth by about 2.3 milliseconds per century. By conservation of angular momentum, that angular momentum transfers to the Moon, which gradually spirals outward at about 3.8 cm per year — a rate confirmed by laser ranging to retroreflectors left by Apollo astronauts.",
      },
      {
        question: "Why are tidal ranges so different around the world?",
        answer:
          "The Moon's tidal force sets a global amplitude, but local geography amplifies or dampens it dramatically. The Bay of Fundy in Nova Scotia has tidal ranges exceeding 16 m because its shape acts like a funnel whose resonant period (~13 hours) nearly matches the tidal forcing period (~12.5 hours), building up energy with each cycle. Semi-enclosed seas like the Mediterranean have ranges under 30 cm because water cannot pile up efficiently.",
      },
      {
        question: "Can tides affect space missions or satellites?",
        answer:
          "Yes — tidal forces from Earth stretch and compress near-Earth satellites over every orbit, gradually affecting orbital parameters through tidal dissipation. More dramatically, tidal forces determine the Roche limit: the minimum orbital distance at which a moon or comet can survive without being torn apart by tidal forces exceeding its own self-gravity. Saturn's rings are thought to be debris from objects that crossed the Roche limit.",
      },
    ],
  },
};
