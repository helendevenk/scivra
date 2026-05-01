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
      id: "moonAngle",
      label: "Moon Position",
      unit: "°",
      min: 0,
      max: 360,
      default: 0,
      step: 5,
      tier: "free",
    },
    {
      id: "sunAngle",
      label: "Sun Position",
      unit: "°",
      min: 0,
      max: 360,
      default: 90,
      step: 5,
      tier: "free",
    },
    {
      id: "playbackSpeed",
      label: "Time Speed",
      unit: "×",
      min: 0,
      max: 5,
      default: 1,
      step: 0.5,
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
    "Watch the Moon orbit Earth and observe the tidal bulges on the ocean surface. Adjust moon and sun positions manually, or let time advance automatically. The tide gauge at right shows water level at a coastal point. Notice how alignment creates spring tides and perpendicular positions create neap tides.",

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
  contentSections: {
    whatIsIt:
      "Stand at a beach and watch the waterline creep up the sand for six hours, then reverse for six hours — that rhythm is Earth responding to the Moon's gravity, and it has been running for 4.5 billion years. Tides are not caused by the Moon simply pulling the ocean toward it; they arise from the difference in gravitational pull across Earth's diameter. The Moon tugs the near-side ocean more strongly than Earth's center, and tugs Earth's center more strongly than the far-side ocean. The result is two tidal bulges — one facing the Moon and one on the opposite side — and as Earth rotates through them, most coastlines experience two high tides roughly every 25 hours. The Sun also contributes a tidal force about 46% as strong as the Moon's; when Sun, Earth, and Moon align at new or full moon, their forces add to produce spring tides, while a 90° arrangement at quarter moons produces smaller neap tides. This simulation lets you rotate the Moon and Sun to any position and watch the tidal bulges and coastal gauge respond in real time.",
    parameterExplanations: {
      moonAngle:
        "The Moon's orbital position around Earth in degrees (0°–360°). Rotating this changes which side of Earth faces the Moon and therefore where the two tidal bulges sit. Setting moonAngle and sunAngle to the same value or 180° apart creates spring tides.",
      sunAngle:
        "The Sun's direction relative to Earth in degrees (0°–360°). When sunAngle is 90° or 270° away from moonAngle, the Sun and Moon are perpendicular and their tidal forces partially cancel, producing neap tides. When they align (0° or 180° difference), tidal forces add to form spring tides.",
      playbackSpeed:
        "Controls the rate at which the Moon orbits and Earth rotates in the animation, from 0× (paused) to 5×. At 0.5× you can watch the tidal bulge migrate slowly; at 5× you can observe a full spring-to-neap cycle over the Moon's ~29.5-day orbit.",
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
      "Spring and neap tide comparison: set playbackSpeed to 0 and manually sweep moonAngle from 0° to 180° while keeping sunAngle at 90°. Ask students to sketch the tide gauge reading at 0°, 45°, 90°, 135°, and 180°, then identify which positions produce spring versus neap tides and explain why.",
      "Two-bulge demonstration: set moonAngle to 0° and playbackSpeed to 0.5× to advance time slowly. Ask students to count how many times the coastal gauge spike occurs per full Earth rotation and explain why the answer is two, not one, using the gravity-difference concept.",
      "Sun-Moon alignment lab: set sunAngle to 0° and sweep moonAngle through 0°, 90°, 180°, and 270°. Have students predict which moonAngle values will produce the highest and lowest tidal range before running, then verify. Connects to HS-ESS1-4.",
      "Quantitative tidal force ratio: after observing that spring tides are larger than neap tides, have students use F_Sun ≈ 0.46 × F_Moon to reason about amplitudes. At spring tide the forces add (amplitude ≈ 1.46 M), at neap tide they partially cancel (amplitude ≈ 0.54 M), giving an idealized spring-to-neap ratio of about 1.46 / 0.54 ≈ 2.7. Compare this prediction to the gauge display and discuss why real ratios vary with local geography.",
      "Orbital period and tidal cycle: set playbackSpeed to 5 and let the simulation run through a full 29.5-day lunar cycle. Ask students to count the number of spring and neap tide events and connect this to the real-world coastal flooding calendar published by NOAA.",
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
          "HS-ESS1-4 asks students to use mathematical or computational representations to predict the motion of orbiting objects in the solar system, including using gravitational relationships to explain phenomena such as tides. MS-ESS1-2 (also listed) asks middle-level students to develop a model to describe the role of gravity in the motions of the solar system, making this simulation useful for both grade bands. Set moonAngle and sunAngle to explore all alignment configurations and directly verify the spring/neap pattern that HS-ESS1-4 describes.",
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
