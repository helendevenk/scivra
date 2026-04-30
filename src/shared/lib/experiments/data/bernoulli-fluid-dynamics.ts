import type { Experiment } from "@/shared/types/experiment";

export const bernoulliFluidDynamics: Experiment = {
  id: "bernoulli-fluid-dynamics",
  slug: "bernoulli-equation-venturi-airfoil",
  title: "Bernoulli's Principle & Fluid Flow",
  subtitle: "Discover why faster flow means lower pressure — from Venturi tubes to airplane wings",
  description:
    "Control fluid velocity and pipe geometry in a Venturi tube simulation. Watch the continuity equation force speed increases at constrictions and observe the pressure drop that follows from Bernoulli's equation, connecting directly to how airfoils generate lift.",
  thumbnail: "/imgs/experiments/bernoulli-fluid-dynamics.png",

  standards: {
    ngss: ["HS-PS2-1", "HS-ETS1-2"],
    gcse: ["P5.5", "P5.6"],
    ap: ["FLD-1.A", "FLD-1.B", "FLD-1.C"],
  },
  primaryStandard: "ap-physics-2",
  category: "mechanics",
  subject: "physics",
  gradeLevel: "AP",
  tags: [
    "Bernoulli's principle",
    "fluid dynamics",
    "Venturi effect",
    "continuity equation",
    "pressure",
    "lift",
    "airfoil",
    "flow velocity",
  ],
  difficulty: "intermediate",

  parameters: [
    {
      id: "flow_velocity",
      label: "Inlet Velocity",
      unit: "m/s",
      min: 1,
      max: 20,
      default: 5,
      step: 0.5,
      tier: "free",
    },
    {
      id: "pipe_ratio",
      label: "Area Ratio A₁/A₂ (wide:narrow)",
      unit: "",
      min: 1,
      max: 4,
      default: 2,
      step: 0.5,
      tier: "free",
    },
    {
      id: "fluid_density",
      label: "Fluid Density",
      unit: "kg/m³",
      min: 800,
      max: 1200,
      default: 1000,
      step: 50,
      tier: "pro",
    },
    {
      id: "height_difference",
      label: "Height Difference",
      unit: "m",
      min: 0,
      max: 5,
      default: 0,
      step: 0.5,
      tier: "pro",
    },
  ],

  formulas: [
    {
      latex: "P + \\frac{1}{2}\\rho v^2 + \\rho g h = \\text{const}",
      description: "Bernoulli's Equation",
    },
    {
      latex: "A_1 v_1 = A_2 v_2",
      description: "Continuity Equation (incompressible flow)",
    },
    {
      latex: "\\Delta P = \\frac{1}{2}\\rho(v_2^2 - v_1^2)",
      description: "Pressure difference from velocity change",
    },
  ],

  theory:
    "Bernoulli's equation is an energy conservation statement for steady, incompressible flow: the sum of static pressure, dynamic pressure (½ρv²), and hydrostatic pressure (ρgh) remains constant along a streamline. The continuity equation A₁v₁ = A₂v₂ forces fluid to accelerate through a constriction, which Bernoulli's equation then links to a corresponding pressure drop. Airfoil lift arises because the curved upper surface accelerates flow, lowering pressure above the wing.",
  instructions:
    "Increase the inlet velocity and area ratio to see the pressure difference build in the Venturi section. The color gradient along the pipe shows high (blue) to low (red) pressure regions. Unlock Pro mode to change fluid density and add a height difference between inlet and outlet.",

  challenges: [
    {
      id: "bfd-c1",
      question: "The pipe cross-section is halved at a constriction. How does velocity change? What happens to pressure?",
      hint: "Apply continuity A₁v₁ = A₂v₂ first, then Bernoulli",
      tier: "free",
    },
    {
      id: "bfd-c2",
      question: "Using Bernoulli's principle, explain why an airplane wing generates lift.",
      hint: "Consider the upper versus lower surface curvature and resulting flow speeds",
      tier: "free",
    },
    {
      id: "bfd-c3",
      question:
        "Inlet A₁ = 0.1 m² with v₁ = 2 m/s, outlet A₂ = 0.05 m². What is the outlet velocity and pressure change (ρ = 1000 kg/m³)?",
      hint: "Use continuity for velocity, then ΔP = ½ρ(v₂² − v₁²)",
      tier: "pro",
    },
  ],

  wave: 7,
  tier: "pro",
  estimatedTime: 25,
  relatedExperiments: ["fluid-statics", "newtons-laws", "circular-motion"],

  seoTitle: "Bernoulli's Principle & Fluid Dynamics — Venturi & Airfoil Simulation | Scivra",
  seoKeywords: [
    "Bernoulli's principle",
    "fluid dynamics",
    "Venturi effect",
    "continuity equation",
    "airfoil lift",
    "pressure and velocity",
    "AP Physics fluids",
  ],
  jsonLd: {
    "@type": "LearningResource",
    educationalLevel: "High School",
    teaches: "Bernoulli's Principle and Fluid Flow Dynamics",
  },

  contentSections: {
    whatIsIt:
      "Hold a strip of paper just below your lip and blow across the top — the strip lifts. Stand near a passing subway train and feel yourself pulled toward the edge. Every such surprising tug is the same equation in action: Bernoulli's principle, the energy-conservation rule for steady, incompressible flow. Bernoulli says the sum of static pressure, dynamic pressure (½ρv²), and hydrostatic pressure (ρgh) along a streamline stays constant — so where the fluid speeds up, pressure drops. Pair Bernoulli with continuity A₁v₁ = A₂v₂ and you can predict that any constriction in a pipe forces the fluid to accelerate and the pressure to fall. That's a Venturi tube, the heart of carburetors, atomizers, flowmeters, and airplane lift. This lab puts a Venturi tube on screen with adjustable inlet velocity, area ratio, density, and height. Color-coded pressure gradients make the link visual, and readouts let you check Bernoulli quantitatively.",
    parameterExplanations: {
      flow_velocity:
        "Speed of the fluid entering the wide section, in m/s. This is v₁ in the continuity equation. Higher v₁ means more mass flow per second, so the constricted section has to speed up even more (v₂ = v₁ · A₁/A₂) to keep up. Doubling v₁ doubles v₂ and roughly quadruples the pressure drop, because dynamic pressure scales as v².",
      pipe_ratio:
        "Ratio of wide-section area to narrow-section area (A₁/A₂). A ratio of 2 means the narrow section is half as wide and the fluid moves twice as fast there. The bigger the ratio, the bigger the speed jump and the bigger the pressure drop — but if you push it too hard you can drop the pressure low enough to vaporize liquids (cavitation), which damages real pumps and propellers.",
      fluid_density:
        "Density of the fluid in kg/m³. Water is about 1000, light oil roughly 800, salt water about 1025, mercury 13,600. Density appears in both the dynamic pressure ½ρv² and hydrostatic ρgh terms, so a denser fluid produces a larger pressure swing for the same velocity change. That's why hydraulic systems use thicker fluids than air-based ones.",
      height_difference:
        "Vertical drop or rise between the inlet and outlet, in meters. Raising the outlet adds ρgh of hydrostatic pressure to fight against, lowering it gives the flow a gravity assist. This is the same term that explains why water from a high reservoir gushes faster than water at the same depth from a shallow tank — gravity does the work.",
    },
    misconceptions: [
      {
        wrong:
          "Bernoulli's principle says fast-moving air pulls things into it.",
        correct:
          "There's no pulling. Where the air is moving fast, its static pressure is low; the slower air around it has higher pressure and pushes objects toward the low-pressure region. The net force always points from high pressure to low pressure. Calling it a 'pull' is a useful shorthand but masks the actual mechanism.",
      },
      {
        wrong:
          "An airplane wing generates lift because air on top has further to travel and arrives at the back at the same time.",
        correct:
          "That 'equal transit time' explanation is wrong. Real measurements show air on top of an airfoil arrives at the trailing edge before the air on the bottom. Lift comes from the wing's angle of attack and curvature deflecting air downward (Newton's third law), and the corresponding pressure difference (Bernoulli) between the faster top flow and slower bottom flow. Both views — Newton and Bernoulli — give the same lift force.",
      },
      {
        wrong:
          "Heat and temperature don't matter in fluid dynamics — pressure is just pressure.",
        correct:
          "For incompressible flow at moderate speeds Bernoulli's equation does ignore temperature, but the underlying ideal-gas pressure depends on temperature through PV = nRT. In high-speed compressible flow (above Mach 0.3 or so), temperature changes during compression and Bernoulli's incompressible form has to be replaced by the compressible energy equation. Temperature is the average kinetic energy per molecule; heat is energy transferred — the same intensive/extensive distinction that matters in the rest of thermo.",
      },
      {
        wrong:
          "If I make the constriction tiny enough, I can drop pressure to negative values.",
        correct:
          "Static pressure can't go below zero — once it reaches the fluid's vapor pressure, the liquid boils. That's cavitation, and it forms vapor bubbles that collapse violently, eroding pump impellers and propeller blades. So Bernoulli predicts a pressure drop, but at extreme constrictions reality switches to a different mode (two-phase flow) instead of producing negative pressure.",
      },
      {
        wrong:
          "Bernoulli's equation works for any fluid in any flow.",
        correct:
          "Bernoulli's equation in its standard form requires four assumptions: steady flow, incompressible fluid, no viscosity (no friction), and motion along a single streamline. Real flows often violate one or more — viscous flow in a long pipe loses energy, turbulent flow has fluctuating velocities, and compressible flow needs the gas dynamics version. The textbook equation is an excellent first approximation, not a universal law.",
      },
    ],
    teacherUseCases: [
      "Continuity-first lab: have students fix the inlet velocity and predict the outlet velocity for area ratios of 1.5, 2.0, 3.0, and 4.0 before running the simulation. Check answers and use the result to anchor A₁v₁ = A₂v₂ in their heads.",
      "Pressure-drop measurement lab: with v₁ = 5 m/s, have students record the simulated fluid speed at five points along the pipe (two upstream, the throat, and two downstream), measure the static pressure at each point, then plot the Bernoulli-predicted pressure against the measured pressure and report the percent difference at the throat.",
      "Airfoil bridge: after the Venturi exercise, have students sketch how the curved upper surface of a wing acts like a half-Venturi, accelerating air over the top and dropping its pressure. Connect to lift = ΔP × wing area.",
      "Curveball or banana kick: assign students to research how a spinning ball creates a velocity asymmetry on its two sides (Magnus effect) and use Bernoulli to predict which way the ball curves. Real video clips of curveballs make this memorable.",
      "Misconception probe: ask the class 'is high-speed air pulling on objects or is something else pushing?' before running the simulation. Use the pressure-gradient readout to drive home that net force always points from high to low pressure — there is no 'pulling'.",
    ],
    faq: [
      {
        question: "Why does pressure drop where the fluid speeds up?",
        answer:
          "Energy conservation. Bernoulli's equation says (static pressure) + (½ρv²) + (ρgh) is constant along a streamline. If kinetic energy density (½ρv²) goes up, something else has to go down to compensate. At constant height, that something is static pressure. The fluid traded pressure energy for kinetic energy as it accelerated through the constriction.",
      },
      {
        question: "Where does the energy come from to speed up the fluid through a constriction?",
        answer:
          "From the pressure difference. The wide upstream region has higher static pressure than the narrow downstream region, and that pressure difference does work on the fluid, accelerating it. No external pump is needed inside the Venturi; the pressure gradient already there is what drives the speed-up. Of course the original pressure had to come from somewhere — usually a pump or gravity at the source.",
      },
      {
        question: "How does Bernoulli's principle explain airplane wing lift?",
        answer:
          "An airfoil at a positive angle of attack deflects air downward; by Newton's third law the air pushes the wing upward. Equivalently, the curved upper surface and angle of attack force air to travel faster over the top of the wing than the bottom; by Bernoulli the upper static pressure is lower than the lower static pressure, and the net pressure difference times the wing area gives the lift force. Both descriptions give the same answer; they're complementary, not competing.",
      },
      {
        question: "What's cavitation and why is it bad?",
        answer:
          "When Bernoulli predicts a pressure drop below the local vapor pressure of the liquid, the liquid boils and forms vapor bubbles. Those bubbles collapse violently when they reach a region of higher pressure, sending out shock waves that pit and erode metal surfaces. Boat propellers, pump impellers, and high-head turbines all have to be designed to keep static pressure above the vapor pressure threshold — a major real-world constraint on Bernoulli applications.",
      },
      {
        question: "When does Bernoulli's equation fail?",
        answer:
          "Whenever its four assumptions break: steady flow, incompressible fluid, no viscosity, and a single streamline. Long pipes have viscous losses (use Bernoulli plus a head-loss term). Aircraft above Mach 0.3 need compressible flow corrections. Turbulent flow has fluctuating velocities you have to time-average. And streamlines that mix or separate (boundary-layer separation, stall) break the same-streamline assumption. Bernoulli is a powerful first-pass tool, but real engineering uses it with corrections.",
      },
      {
        question: "How does this connect to AP Physics 2 standards FLD-1.A through FLD-1.C?",
        answer:
          "AP Physics 2 FLD-1.A asks students to apply the continuity equation A₁v₁ = A₂v₂ to incompressible flow, FLD-1.B asks them to apply Bernoulli's equation to predict pressure changes from velocity and height changes, and FLD-1.C asks them to use both together to analyze real systems like Venturi tubes, airfoils, and pipe flow. NGSS HS-PS2-1 also expects students to apply Newton's second law to fluid systems. This lab builds all those expectations on a single visual screen.",
      },
    ],
  },
};
