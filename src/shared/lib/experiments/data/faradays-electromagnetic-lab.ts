import type { Experiment } from "@/shared/types/experiment";

export const faradaysElectromagneticLab: Experiment = {
  id: "faradays-electromagnetic-lab",
  slug: "faradays-electromagnetic-induction-lab",
  title: "Faraday's Electromagnetic Lab",
  subtitle: "Discover electromagnetic induction with a magnet and coil",
  description:
    "Move a bar magnet through a coil of wire and watch electricity generated. Explore Faraday's Law of induction, Lenz's Law, and the principles behind generators and transformers.",
  thumbnail: "/imgs/experiments/electromagnetic-induction.png",

  standards: {
    ngss: ["HS-PS2-5", "HS-PS3-2"],
    gcse: ["AQA P7.5", "AQA P7.6"],
    ap: ["CHA-5.A", "CHA-5.B", "CHA-5.C"],
  },
  primaryStandard: "ap-physics-2",
  category: "electricity",
  subject: "physics",
  gradeLevel: "AP",
  tags: ["Faraday's law", "electromagnetic induction", "Lenz's law", "coil", "magnet", "generator"],
  difficulty: "intermediate",

  parameters: [
    { id: "magnet_strength", label: "Magnet Strength", unit: "T", min: 0.1, max: 5, default: 1, step: 0.1, tier: "free" },
    { id: "coil_turns", label: "Coil Turns", unit: "N", min: 1, max: 100, default: 10, step: 1, tier: "free" },
    { id: "magnet_speed", label: "Magnet Speed", unit: "m/s", min: 0, max: 5, default: 1, step: 0.1, tier: "pro" },
  ],

  formulas: [
    { latex: "\\mathcal{E} = -N\\frac{d\\Phi_B}{dt}", description: "Faraday's Law of Induction" },
    { latex: "\\Phi_B = B \\cdot A \\cdot \\cos\\theta", description: "Magnetic flux" },
  ],

  theory:
    "Faraday's Law states that a changing magnetic flux through a coil induces an electromotive force (EMF) proportional to the rate of change and the number of turns. Lenz's Law determines the direction: the induced current creates a magnetic field opposing the change that caused it. This principle underlies all electric generators, transformers, and induction cooktops.",
  instructions:
    "Drag the magnet toward and through the coil. The voltmeter shows induced EMF. Move the magnet faster or use more coil turns to increase the induced voltage. Reverse direction to reverse the current. Connect a light bulb to the coil and see it glow.",
  challenges: [
    { id: "fl-c1", question: "What happens to the induced EMF when you double the number of coil turns?", hint: "ε = N × dΦ/dt — doubling N doubles ε", tier: "free" },
    { id: "fl-c2", question: "The magnet is stationary inside the coil. Why is there no induced EMF?", hint: "Faraday's Law requires dΦ/dt ≠ 0 — flux must be changing", tier: "free" },
    { id: "fl-c3", question: "Why does Lenz's Law mean the induced current always opposes the motion causing it?", hint: "Energy conservation: creating current from nothing would violate it", tier: "pro" },
  ],

  wave: 8,
  tier: "free",
  estimatedTime: 20,
  relatedExperiments: ["electromagnetic-induction", "generator", "magnets-and-electromagnets"],

  seoTitle: "Faraday's Electromagnetic Lab | Induction Simulation | AP Physics 2",
  seoKeywords: ["Faraday's law", "electromagnetic induction", "Lenz's law", "generator", "AP Physics 2"],
  jsonLd: { "@type": "LearningResource", educationalLevel: "High School", teaches: "Faraday's Law, Electromagnetic Induction, Lenz's Law" },

  contentSections: {
    whatIsIt:
      "A hand-crank flashlight has no batteries — you spin a magnet near a coil and the bulb lights up. Pump a foot off the ground and a metal-detector wand at airport security buzzes. Set a saucepan on an induction cooktop and the pan heats up while the surface stays cool to the touch. All three rely on the same trick: changing the magnetic flux through a coil of wire creates a voltage across that coil. Faraday wrote the law in 1831, and Lenz pointed out that the induced current always flows in the direction that fights the change that caused it. This lab gives you a movable bar magnet, a coil with adjustable turns, and a voltmeter so you can prove both laws yourself. Slow the magnet down and the EMF drops; add more turns and it climbs; freeze the magnet inside the coil and it falls to zero.",
    parameterExplanations: {
      magnet_strength:
        "Magnetic field magnitude of the bar magnet in tesla. A stronger magnet means more flux through the coil at every position, so the induced EMF when the magnet is moving scales up proportionally.",
      coil_turns:
        "Number of loops in the coil, N. Faraday's Law has an explicit factor of N — doubling the turns doubles the induced EMF for the same flux change.",
      magnet_speed:
        "Speed of the magnet through the coil in m/s. EMF depends on dΦ/dt, and faster motion makes flux change more rapidly per unit time, so a slow walk through the coil produces a much smaller voltage than a quick toss.",
    },
    misconceptions: [
      {
        wrong:
          "A magnet sitting next to a coil produces a current — magnets just push electrons.",
        correct:
          "A stationary magnet next to a stationary coil induces no current at all, no matter how strong it is. What matters is dΦ/dt — flux must be changing. Move the magnet, change its strength, or rotate the coil and you get a current; hold everything still and the voltmeter reads zero.",
      },
      {
        wrong:
          "Induced EMF only happens when the magnet moves — that is the only way to change the flux.",
        correct:
          "Anything that changes flux works. You can move the magnet, change the magnet's field strength (an electromagnet ramping up), tilt or rotate the coil to change the angle, or shrink/expand the coil's area. dΦ/dt is what drives EMF, and there are many ways to change Φ.",
      },
      {
        wrong:
          "Lenz's Law just says current flows in some direction; the minus sign in Faraday's Law is bookkeeping.",
        correct:
          "The minus sign is conservation of energy. The induced current creates its own magnetic field that opposes the change in flux. If it didn't, you could keep ramping up current with no work input and break energy conservation. Try to push the magnet in faster and you feel a real force pushing back.",
      },
      {
        wrong:
          "More coil turns just means a longer wire with more resistance, so the EMF gets bigger but the current stays the same.",
        correct:
          "Each turn sees the same dΦ/dt, and Faraday's Law sums them: ε = N·dΦ/dt. The total EMF really does scale with N. Resistance also scales with wire length, so the resulting current depends on both effects, but the EMF on its own is genuinely N times larger.",
      },
    ],
    teacherUseCases: [
      "Speed–EMF investigation: have students hold magnet strength and turns fixed, then vary magnet speed from 0 to 5 m/s in 0.5 m/s steps. They record peak EMF at each speed, plot ε vs. speed, and fit a line to extract the proportionality constant.",
      "Misconception probe on stationary magnets: place the magnet inside the coil at zero velocity and ask 'how big is the induced EMF right now?' Many students will say 'huge — the magnet is so close.' Use the voltmeter reading of 0 V as the entry point for a Faraday's Law discussion.",
      "Turns scaling experiment: students fix magnet strength and speed, then vary N from 5 to 50 turns. They predict in advance that EMF doubles when N doubles, then confirm with the data.",
      "Lenz's Law direction prediction: before each pass, ask students to predict whether the induced current will flow clockwise or counterclockwise based on the magnet's polarity and direction of motion. Compare to the simulation's voltmeter sign.",
      "Generator preview: show that pulling the magnet in and pushing it out give opposite-sign EMF pulses. Use this to motivate why a coil rotating in a steady field produces an alternating-current sine wave.",
    ],
    faq: [
      {
        question: "Why is there no induced EMF when the magnet sits still inside the coil?",
        answer:
          "Faraday's Law states that ε = -N·dΦ/dt. If the magnet is stationary and its strength is constant, the magnetic flux Φ through the coil is also constant, so dΦ/dt = 0 and the EMF is zero. The flux can be enormous and you still get no induced voltage. Induction is fundamentally about change over time, not about the size of the field at any one instant.",
      },
      {
        question: "Why does doubling the number of turns double the induced EMF?",
        answer:
          "The coil acts as N loops in series. Each loop sees the same magnetic flux Φ from the magnet and the same rate of change dΦ/dt. Each loop contributes an EMF of -dΦ/dt, and because they are wired in series these EMFs add. The total is ε = -N·dΦ/dt, so N is a direct multiplier. Real generators and transformers exploit this by winding thousands of turns to step a small flux change up to a useful voltage.",
      },
      {
        question: "What does Lenz's Law actually say about the direction of induced current?",
        answer:
          "The induced current flows in the direction that produces a magnetic field opposing the change in flux that caused it. If you push a north pole into a coil, the coil's induced current creates its own north pole on the side facing you, repelling the incoming magnet. Pull the magnet out and the induced current reverses to attract it back. Either way, you do work against this opposition, and that work is what becomes the electrical energy in the coil.",
      },
      {
        question: "How does this experiment connect to AP Physics 2 standards CHA-5.A and NGSS HS-PS2-5?",
        answer:
          "AP Physics 2 standard CHA-5.A and its companions CHA-5.B and CHA-5.C require students to apply Faraday's and Lenz's laws to predict the magnitude and direction of induced EMF in a coil. NGSS HS-PS2-5 asks for evidence that changing magnetic fields can produce electric currents — exactly what this lab demonstrates. Manipulating magnet strength, speed, and turns gives students a controlled way to confirm both magnitude (ε proportional to N·B·v) and direction (Lenz's Law sign) predictions.",
      },
      {
        question: "Why does the bulb glow only while the magnet is moving, not after it has stopped?",
        answer:
          "EMF requires a non-zero dΦ/dt. While the magnet is moving toward or away from the coil, the flux through the coil is changing, so an EMF drives current through the bulb and it glows. The instant the magnet stops, the flux becomes constant, dΦ/dt drops to zero, and the EMF vanishes — even though the magnet is still right there. The bulb goes dark because there is no longer any energy being pumped into the circuit by the moving magnet.",
      },
    ],
  },
};
