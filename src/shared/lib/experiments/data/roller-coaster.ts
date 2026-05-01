import type { Experiment } from "@/shared/types/experiment";

export const rollerCoaster: Experiment = {
  id: "roller-coaster",
  slug: "energy-conservation-roller-coaster",
  title: "Energy Conservation Roller Coaster",
  subtitle: "Ride the energy transformation",
  description:
    "Design a roller coaster track and watch kinetic and potential energy transform in real time. Verify conservation of mechanical energy at every point on the track.",
  thumbnail: "/imgs/experiments/energy-conservation.png",

  standards: {
    ngss: ["HS-PS3-1", "HS-PS3-2"],
    gcse: ["P1.1", "P1.3"],
    ap: ["4.C.1", "5.B.4"],
  },
  primaryStandard: "ngss-hs",
  category: "mechanics",
  subject: "physics",
  gradeLevel: "9-12",
  tags: [
    "energy",
    "conservation",
    "kinetic",
    "potential",
    "roller coaster",
    "gravity",
  ],
  difficulty: "intermediate",

  parameters: [
    {
      id: "initialHeight",
      label: "Initial Height",
      unit: "m",
      min: 5,
      max: 100,
      default: 30,
      step: 1,
      tier: "free",
    },
    {
      id: "mass",
      label: "Cart Mass",
      unit: "kg",
      min: 0.5,
      max: 50,
      default: 5,
      step: 0.5,
      tier: "free",
    },
    {
      id: "friction",
      label: "Track Friction",
      unit: "",
      min: 0,
      max: 0.5,
      default: 0,
      step: 0.01,
      tier: "pro",
    },
  ],

  formulas: [
    {
      latex: "E_{total} = KE + PE = \\frac{1}{2}mv^2 + mgh",
      description: "Total mechanical energy",
    },
    {
      latex: "v = \\sqrt{2g(h_0 - h)}",
      description: "Velocity from energy conservation",
    },
    {
      latex: "KE = \\frac{1}{2}mv^2",
      description: "Kinetic energy",
    },
    {
      latex: "PE = mgh",
      description: "Gravitational potential energy",
    },
  ],

  theory:
    "The law of conservation of energy states that energy cannot be created or destroyed, only transformed. In a frictionless roller coaster, the total mechanical energy (KE + PE) remains constant. As the cart descends, PE converts to KE; as it climbs, KE converts back to PE.",
  instructions:
    "Set the initial height and mass. Press play to release the cart. Watch the energy bar chart update in real time. Enable friction to see energy dissipation.",
  challenges: [
    {
      id: "rc-c1",
      question: "What is the velocity at the bottom if released from 20m?",
      hint: "Use v = √(2gh)",
      tier: "free",
    },
    {
      id: "rc-c2",
      question: "Can the cart reach a hill higher than its starting point?",
      hint: "Think about total energy",
      tier: "free",
    },
    {
      id: "rc-c3",
      question: "How much energy is lost to friction over one full loop?",
      hint: "Compare total energy at start and end",
      tier: "pro",
    },
  ],

  wave: 1,
  tier: "free",
  estimatedTime: 18,
  relatedExperiments: ["newtons-laws"],

  seoTitle:
    "Energy Conservation Roller Coaster — Interactive 3D Simulation | Scivra",
  seoKeywords: [
    "energy conservation",
    "roller coaster physics",
    "kinetic potential energy",
    "physics simulation",
    "mechanical energy",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "High School",
    teaches: "Conservation of Energy",
  },
  contentSections: {
    whatIsIt:
      "At the top of a roller coaster's first hill, nearly all the car's mechanical energy sits as gravitational potential energy: PE = mgh. The instant the car crests and plunges downward, potential energy converts to kinetic energy: KE = ½mv². At the bottom of the valley, potential energy reaches its minimum and speed reaches its maximum. As the car climbs the next hill, kinetic energy converts back to potential energy — and on the cycle continues, over and over. In a frictionless system the total mechanical energy (KE + PE) never changes: every joule lost in height is gained in speed. Real coasters have friction, which converts some mechanical energy to thermal energy in the wheels and rails — that energy is not destroyed, just no longer useful for moving the car, which is why each subsequent peak must be shorter than the one before it. This simulation lets you set the initial height (5–100 m), cart mass (0.5–50 kg), and friction (0–0.5) and watch the real-time energy bar chart verify conservation at every point on the track.",
    parameterExplanations: {
      initialHeight:
        "The starting height of the cart above the lowest point on the track, in meters (5–100 m). This directly sets the total mechanical energy available: E_total = mgh₀. Doubling the height doubles the total energy and increases the maximum speed at the bottom by a factor of √2, since v_max = √(2gh₀).",
      mass:
        "The cart mass in kilograms (0.5–50 kg). In a frictionless system, mass cancels out of the energy conservation equation and has no effect on speed or height reached — a 1 kg cart and a 50 kg cart released from the same height hit the bottom at the same speed. With friction enabled, heavier carts lose proportionally more energy to thermal dissipation per unit distance.",
      friction:
        "A dimensionless friction coefficient (0–0.5) representing resistance between wheels and track. At friction = 0 the total mechanical energy is perfectly conserved. Increasing friction causes the cart to lose energy to heat, reducing the height the cart can reach on subsequent hills. The energy bar chart will show the thermal energy component growing with each pass.",
    },
    misconceptions: [
      {
        wrong:
          "Friction destroys energy — the cart has less energy after friction acts on it.",
        correct:
          "Energy cannot be destroyed. Friction converts mechanical energy (kinetic + potential) into thermal energy in the wheels, axles, and rails. The total energy of the system — mechanical plus thermal — remains constant. What decreases is only the mechanically useful portion available to lift the cart higher.",
      },
      {
        wrong:
          "A heavier cart will go faster at the bottom of the hill because it has more energy.",
        correct:
          "PE = mgh and KE = ½mv². Setting them equal gives v = √(2gh), which contains no mass term. Every cart, regardless of mass, reaches the same speed at the bottom if released from the same height in a frictionless track. Mass affects total energy but not speed.",
      },
      {
        wrong:
          "A roller coaster needs an engine to keep moving after the initial drop.",
        correct:
          "After the chain lifts the car to the first peak (doing work against gravity), the rest of the ride is driven entirely by gravity. The car continuously exchanges PE for KE and back. No engine is needed as long as each subsequent hill is lower than the previous one — which is why real coasters are designed with descending peak heights.",
      },
      {
        wrong:
          "The cart can be launched high enough to clear a second hill taller than the starting hill.",
        correct:
          "Without external energy input, the cart can never reach a height greater than its starting height. Total mechanical energy is fixed at E = mgh₀. At any point on the track, PE = mgh cannot exceed mgh₀, so h cannot exceed h₀. Any friction makes this ceiling even lower.",
      },
      {
        wrong:
          "At the very bottom of the track, all energy is kinetic so the cart has no potential energy at all.",
        correct:
          "Potential energy is measured relative to a chosen reference height. If the bottom of the track is chosen as h = 0 m, then PE = 0 at that point and all energy is kinetic — that is correct for that reference. But if a lower reference is chosen, the cart still has PE at the track bottom. The total energy conservation holds regardless of which reference you pick, as long as you are consistent.",
      },
    ],
    teacherUseCases: [
      "Frictionless energy verification: set initialHeight to 50 m, mass to 5 kg, and friction to 0. Pause the simulation at multiple track positions and have students read KE and PE from the bar chart, calculate their sum each time, and verify that KE + PE remains constant at mgh₀ = 5 × 9.8 × 50 = 2,450 J.",
      "Mass independence demonstration: run two trials at initialHeight 30 m — one at mass 1 kg and one at mass 50 kg, both with friction 0. Record the speed at the bottom for each. Students should find v = √(2 × 9.8 × 30) ≈ 24.2 m/s in both cases. Confront the intuition that heavier means faster.",
      "Friction energy audit: set initialHeight to 60 m, mass to 10 kg, and friction to 0.2. Pause after one full loop and record the thermal energy shown. Ask: 'Where did that energy go, and can we get it back to lift the cart?' Reinforce HS-PS3-2's focus on energy transfer and degradation.",
      "Maximum reachable height prediction: set initialHeight to 40 m and friction to 0. Ask students to predict the maximum height the cart can reach on a subsequent hill. They should predict 40 m. Then set friction to 0.1 and predict what happens. Run and compare prediction to simulation. Connects to HS-PS3-1.",
      "Height-speed relationship: keep mass at 5 kg and friction at 0. Sweep initialHeight through 10, 20, 40, and 80 m. Have students record the bottom speed each time and check whether speed doubles when height quadruples (it should: v ∝ √h). Plot v² vs. h and verify the linear relationship predicted by KE = mgh.",
    ],
    faq: [
      {
        question: "Why does doubling the initial height not double the speed at the bottom?",
        answer:
          "Speed at the bottom comes from v = √(2gh₀). Doubling h₀ multiplies the expression under the square root by 2, so speed increases by √2 ≈ 1.41, not by 2. To double the speed you need to quadruple the height. This square-root relationship is a direct consequence of KE = ½mv² — energy scales with v², so speed scales with √(energy).",
      },
      {
        question: "Which NGSS standards does this experiment address?",
        answer:
          "HS-PS3-1 asks students to create a computational model to calculate the change in the energy of one component in a system when the change in energy of the other component(s) and energy flows in and out of the system are known — exactly the KE-PE exchange shown here. HS-PS3-2 asks students to develop and use models to illustrate that energy at the macroscopic scale can be accounted for as a combination of energy associated with the motions of particles (thermal) and energy associated with relative positions of objects, which is directly demonstrated by the friction-enabled thermal energy display.",
      },
      {
        question: "Does mass ever matter in this experiment?",
        answer:
          "In a frictionless simulation, mass cancels from the energy equations and has no effect on speed or height reached — set mass anywhere from 0.5 to 50 kg and v_max is identical. With friction enabled (friction greater than 0), mass does matter: the friction force is typically proportional to the normal force, which depends on mass, so heavier carts lose more energy per meter traveled and reach lower heights on subsequent peaks.",
      },
      {
        question: "What happens to the 'lost' energy when friction is on?",
        answer:
          "Friction converts kinetic energy into thermal energy through microscopic interactions between the cart wheels and the rail surface. The molecules in the metal vibrate faster — the rail and wheels get slightly warmer. That thermal energy spreads out into the surroundings and cannot be efficiently converted back into kinetic energy. Total energy is conserved across the entire system (cart + track + surroundings), but the mechanically useful fraction decreases with each pass.",
      },
      {
        question: "Can a roller coaster loop require a minimum speed, and why?",
        answer:
          "Yes. At the top of a circular loop, the cart needs enough centripetal force to maintain contact with the track. The minimum condition is that gravity alone provides the centripetal force: mg = mv²/r, giving v_min = √(gr) at the top of a loop of radius r. If the cart arrives at the top with less than this speed, it loses contact with the track. This is a separate constraint from energy conservation — it limits the track geometry given the initial height, and it is why loops must be sized appropriately relative to the starting drop.",
      },
    ],
  },
};
