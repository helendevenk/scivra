import type { Experiment } from "@/shared/types/experiment";

export const magnetsAndElectromagnets: Experiment = {
  id: "magnets-and-electromagnets",
  slug: "magnets-electromagnets-field-lines",
  title: "Magnets and Electromagnets",
  subtitle: "Explore permanent magnets and electromagnets",
  description:
    "Visualize magnetic field lines around bar magnets and electromagnets. Compare field strengths, observe how current creates magnetic fields, and discover how coils act as magnets.",
  thumbnail: "/imgs/experiments/electromagnetic-induction.png",

  standards: {
    ngss: ["HS-PS2-5"],
    gcse: ["AQA P7.4"],
    ap: ["CHA-4.A", "CHA-4.B", "CHA-4.C"],
  },
  primaryStandard: "ap-physics-2",
  category: "electricity",
  subject: "physics",
  gradeLevel: "9-12",
  tags: ["magnets", "electromagnet", "magnetic field", "field lines", "solenoid", "current"],
  difficulty: "beginner",

  parameters: [
    { id: "current", label: "Coil Current", unit: "A", min: -10, max: 10, default: 5, step: 0.5, tier: "free" },
    { id: "turns", label: "Coil Turns", unit: "N", min: 1, max: 50, default: 10, step: 1, tier: "free" },
    { id: "bar_strength", label: "Bar Magnet Strength", unit: "T", min: 0, max: 5, default: 1, step: 0.1, tier: "pro" },
  ],

  formulas: [
    { latex: "B_{solenoid} = \\mu_0 \\frac{N}{L} I", description: "Magnetic field inside solenoid" },
    { latex: "\\vec{F} = q\\vec{v} \\times \\vec{B}", description: "Force on moving charge" },
  ],

  theory:
    "A moving electric charge creates a magnetic field. In a coil (solenoid), each turn contributes to a net magnetic field inside, analogous to a bar magnet. The field strength is proportional to current and turns per unit length. Reversing current direction reverses field polarity. Permanent magnets have aligned electron spins that act like many tiny current loops.",
  instructions:
    "Toggle between bar magnet mode and coil mode. Use the compass to probe field direction anywhere in space. Increase current to strengthen the electromagnet. Switch to the field line view to see the full pattern. Compare the coil field to the bar magnet field — they look identical far from the source.",
  challenges: [
    { id: "me-c1", question: "What happens to the electromagnet field when you reverse current direction?", hint: "Field reverses — north and south poles swap", tier: "free" },
    { id: "me-c2", question: "A solenoid with 100 turns, 10cm long, carries 2A. What is B inside?", hint: "B = μ₀(N/L)I = 4π×10⁻⁷ × (100/0.1) × 2", tier: "free" },
    { id: "me-c3", question: "Why is an iron core placed inside an electromagnet?", hint: "Iron has high magnetic permeability — it amplifies the field by hundreds of times", tier: "pro" },
  ],

  wave: 8,
  tier: "free",
  estimatedTime: 15,
  relatedExperiments: ["faradays-electromagnetic-lab", "lorentz-force", "electromagnetic-induction"],

  seoTitle: "Magnets and Electromagnets Simulation | Magnetic Field | AP Physics 2",
  seoKeywords: ["magnets", "electromagnet", "magnetic field lines", "solenoid", "AP Physics 2"],
  jsonLd: { "@type": "LearningResource", educationalLevel: "High School", teaches: "Magnetic Fields, Electromagnets, Solenoid" },

  contentSections: {
    whatIsIt:
      "A refrigerator magnet sticks because every iron atom inside it has electrons whose spins are roughly aligned, all pointing the same way like a tiny crowd doing the wave. A junkyard electromagnet does the same job with no permanent magnetism at all — flip the switch and a moving current through a coil creates a field strong enough to lift a car; flip it off and the car drops. The two devices look different but produce field-line patterns that are nearly identical away from the source. This lab lets you swap between a bar magnet and a current-carrying coil, drag a compass through the surrounding space, and watch the field lines bend and crowd together near the poles. Increase the current, add more turns, or reverse the current direction and the field responds — exactly the way Maxwell's equations predict.",
    parameterExplanations: {
      current:
        "Coil current in amperes; can be positive or negative. Magnitude sets field strength (B is proportional to I), and the sign sets the polarity — flipping the sign swaps the north and south poles of the electromagnet.",
      turns:
        "Number of loops in the coil. Each loop adds its contribution to the field on the axis, so doubling N roughly doubles B inside a long solenoid for the same current.",
      bar_strength:
        "Magnetization of the permanent bar magnet in tesla. Increasing it stretches the field lines further into space. Use this to compare a strong neodymium magnet to a weak ferrite magnet visually.",
    },
    misconceptions: [
      {
        wrong:
          "Magnets attract all metals — that is what 'magnetic' means.",
        correct:
          "Only ferromagnetic metals (iron, nickel, cobalt, and a few alloys) are strongly attracted. Aluminum, copper, gold, and silver are not pulled toward a refrigerator magnet at all. Try it with a soda can next to a strong magnet — nothing happens.",
      },
      {
        wrong:
          "An electromagnet has to have an iron core to work.",
        correct:
          "An air-core coil already produces a magnetic field on its own — that is exactly what the simulation shows. The iron core is a multiplier: it raises the field by hundreds or thousands of times because iron's magnetic permeability is much greater than air's. The physics is the same; the iron just amplifies it.",
      },
      {
        wrong:
          "Magnetic field lines are real physical lines that exist in space, like fishing lines.",
        correct:
          "They are a drawing tool. The lines show the direction a compass needle would point at each location and how dense the field is, but space itself is not striped. The field is continuous and exists everywhere; the lines are just how we visualize it.",
      },
      {
        wrong:
          "If you cut a bar magnet in half, you get one piece that's just north and one that's just south.",
        correct:
          "You get two complete magnets, each with its own north and south. Magnetism comes from aligned electron spins, and every chunk of the magnet still has those spins. There is no such thing as an isolated magnetic pole, no matter how small you slice.",
      },
    ],
    teacherUseCases: [
      "Field-line mapping: have students set the simulation to bar-magnet mode and place the compass at 12 different locations around the magnet. They sketch the field direction at each point and connect them into smooth field lines, then check against the field-line view.",
      "Solenoid B-field measurement: with N = 10 and L estimated from the simulation, students vary the current from 1 A to 10 A and record B. They plot B vs. I, fit a line, and recover μ₀N/L from the slope.",
      "Misconception probe on cores: ask 'will the coil produce any field if there is no iron inside?' Most students hesitate. Run the simulation with no core and show that there is a clear pattern of field lines, then discuss the role of permeability.",
      "Polarity flip experiment: set the current to +5 A, sketch the field direction inside the coil, then flip to -5 A and sketch again. Students explain in their own words why the north and south poles swap.",
      "Bar magnet vs. coil comparison: show field-line view for both at similar field strengths and ask 'far from the source, can you tell them apart?' Use this to connect electron-spin loops in iron to actual current loops in the coil.",
    ],
    faq: [
      {
        question: "Why does running current through a coil create a magnetic field?",
        answer:
          "Every moving charge generates a magnetic field — that is one of the four core results of electromagnetism, formalized by the Biot–Savart and Ampère laws. A single straight wire wraps a circular field around itself by the right-hand rule. Bend that wire into a loop and the field on the axis points straight through. Stack many loops into a solenoid and the contributions add up inside the coil while partially cancelling outside, giving you a field that looks just like a bar magnet's.",
      },
      {
        question: "What makes some materials magnetic and others not?",
        answer:
          "Magnetism in materials comes from the magnetic moments of their electrons. In ferromagnetic materials like iron, nickel, and cobalt, neighboring atoms naturally align their spins in domains, and an external field can line the domains up so the bulk material becomes magnetic. Aluminum and copper have electron configurations where these alignments do not lock in, so they show only very weak (paramagnetic or diamagnetic) effects that you can't feel with everyday magnets.",
      },
      {
        question: "Why is the magnetic field stronger inside the solenoid than outside?",
        answer:
          "Inside a long solenoid, every turn contributes a field pointing in the same axial direction, so the contributions stack and the field is approximately uniform with magnitude B = μ₀(N/L)I. Outside, the field from each turn partially cancels its neighbors and what is left spreads through a much larger volume, so the field there is weak. That is why magnetic shielding and inductor cores funnel field through the inside.",
      },
      {
        question: "How does this experiment fit AP Physics 2 standards CHA-4.A and NGSS HS-PS2-5?",
        answer:
          "NGSS HS-PS2-5 asks students to plan and conduct investigations to provide evidence that an electric current can produce a magnetic field — that is the core finding of this simulation. AP Physics 2 standard CHA-4.A and its companions CHA-4.B and CHA-4.C require students to model magnetic fields from permanent magnets and current-carrying configurations, and to predict directions using right-hand rules. The lab supports all of that by letting students vary current, turns, and bar strength while inspecting field lines and compass directions.",
      },
      {
        question: "What does it mean physically that the field strength inside the coil scales with N/L?",
        answer:
          "N/L is the number of turns per unit length, often written as n. Doubling the number of turns while keeping the coil the same length doubles the field, and stretching the coil to twice its length while keeping N constant cuts the field in half. Strong electromagnets are made by packing many tightly wound turns into a small length, then increasing the current. Adding an iron core multiplies the field on top of that.",
      },
    ],
  },
};
