/**
 * Maps experiment ID → public HTML file path.
 * Wave 2-6 experiments use standalone HTML simulations (Three.js CDN).
 * Wave 1 experiments use React Three Fiber components (see ExperimentClient).
 */
export const EXPERIMENT_HTML_MAP: Record<string, string> = {
  // Wave 7 — AP Physics gap-fill (Batch 1–3)
  "dc-circuits-basic": "/experiments/ap-physics/dc-circuits-basic.html",
  "geometric-optics-lenses": "/experiments/ap-physics/geometric-optics-lenses.html",
  "photoelectric-effect": "/experiments/ap-physics/photoelectric-effect.html",
  "ideal-gas-thermodynamics": "/experiments/ap-physics/ideal-gas-thermodynamics.html",
  "electromagnetic-induction": "/experiments/ap-physics/electromagnetic-induction.html",
  "electric-potential-voltage": "/experiments/ap-physics/electric-potential-voltage.html",
  "capacitors-rc-circuits": "/experiments/ap-physics/capacitors-rc-circuits.html",
  "bernoulli-fluid-dynamics": "/experiments/ap-physics/bernoulli-fluid-dynamics.html",
  "work-energy-theorem": "/experiments/ap-physics/work-energy-theorem.html",
  "kinematics-graphs": "/experiments/ap-physics/kinematics-graphs.html",
  "nuclear-decay": "/experiments/ap-physics/nuclear-decay.html",
  "doppler-effect": "/experiments/ap-physics/doppler-effect.html",
  "single-slit-diffraction": "/experiments/ap-physics/single-slit-diffraction.html",
  "heat-engines": "/experiments/ap-physics/heat-engines.html",

  // Wave 2 — AP Physics
  "simple-harmonic-motion":
    "/experiments/ap-physics/shm-simple-harmonic-motion.html",
  "momentum-collisions": "/experiments/ap-physics/momentum-collisions.html",
  "lorentz-force": "/experiments/ap-physics/lorentz-force.html",
  "electric-field-lines": "/experiments/ap-physics/electric-field-lines.html",
  "wave-interference": "/experiments/ap-physics/wave-interference.html",
  "circular-motion": "/experiments/ap-physics/circular-motion.html",
  "rotational-motion": "/experiments/ap-physics/rotational-motion.html",
  "gravitational-fields": "/experiments/ap-physics/gravitational-fields.html",
  "fluid-statics": "/experiments/ap-physics/fluid-statics.html",

  // Wave 3 — AP Biology
  "dna-double-helix": "/experiments/ap-biology/dna-double-helix.html",
  "protein-synthesis": "/experiments/ap-biology/protein-synthesis.html",
  mitosis: "/experiments/ap-biology/mitosis.html",
  meiosis: "/experiments/ap-biology/meiosis.html",
  "cellular-respiration": "/experiments/ap-biology/cellular-respiration.html",
  photosynthesis: "/experiments/ap-biology/photosynthesis.html",
  "enzyme-kinetics": "/experiments/ap-biology/enzyme-kinetics.html",
  "neuron-action-potential":
    "/experiments/ap-biology/neuron-action-potential.html",
  "membrane-transport": "/experiments/ap-biology/membrane-transport.html",
  "natural-selection": "/experiments/ap-biology/natural-selection.html",

  // Wave 4 — AP Chemistry
  "molecular-bonding": "/experiments/ap-chemistry/molecular-bonding.html",
  "reaction-kinetics": "/experiments/ap-chemistry/reaction-kinetics.html",
  thermochemistry: "/experiments/ap-chemistry/thermochemistry.html",
  "chemical-equilibrium": "/experiments/ap-chemistry/chemical-equilibrium.html",
  "atomic-structure": "/experiments/ap-chemistry/atomic-structure.html",
  "acid-base-ph": "/experiments/ap-chemistry/acid-base-ph.html",
  electrochemistry: "/experiments/ap-chemistry/electrochemistry.html",

  // Wave 5 — Elementary K-5
  "k5-force-motion": "/experiments/elementary/k5-physics-force-motion.html",
  "k5-states-of-matter":
    "/experiments/elementary/k5-chemistry-states-of-matter.html",
  "k5-light-propagation":
    "/experiments/elementary/k5-physics-light-propagation.html",
  "k5-sound-waves": "/experiments/elementary/k5-physics-sound-waves.html",
  "k5-simple-machines":
    "/experiments/elementary/k5-physics-simple-machines.html",
  "k5-energy-conversion":
    "/experiments/elementary/k5-physics-energy-conversion.html",
  "k5-food-chain": "/experiments/elementary/k5-biology-food-chain.html",
  "k5-water-cycle": "/experiments/elementary/k5-earth-water-cycle.html",
  "k5-day-night-seasons":
    "/experiments/elementary/k5-earth-day-night-seasons.html",
  "k5-moon-phases": "/experiments/elementary/k5-earth-moon-phases.html",
  "k5-magnetism": "/experiments/elementary/k5-physics-magnetism.html",

  // Wave 8 — AP Physics (50 new experiments)
  "ac-circuits": "/experiments/ap-physics/ac-circuits.html",
  "atomic-interactions": "/experiments/ap-physics/atomic-interactions.html",
  "balancing-act": "/experiments/ap-physics/balancing-act.html",
  "balloons-static-electricity": "/experiments/ap-physics/balloons-static-electricity.html",
  "bending-light": "/experiments/ap-physics/bending-light.html",
  "blackbody-spectrum": "/experiments/ap-physics/blackbody-spectrum.html",
  "build-a-nucleus": "/experiments/ap-physics/build-a-nucleus.html",
  buoyancy: "/experiments/ap-physics/buoyancy.html",
  "buoyancy-basics": "/experiments/ap-physics/buoyancy-basics.html",
  "calculus-grapher": "/experiments/ap-physics/calculus-grapher.html",
  "circuit-ac-virtual-lab": "/experiments/ap-physics/circuit-ac-virtual-lab.html",
  "circuit-dc-virtual-lab": "/experiments/ap-physics/circuit-dc-virtual-lab.html",
  "color-vision": "/experiments/ap-physics/color-vision.html",
  "coulombs-law": "/experiments/ap-physics/coulombs-law.html",
  "curve-fitting": "/experiments/ap-physics/curve-fitting.html",
  "density-lab": "/experiments/ap-physics/density-lab.html",
  diffusion: "/experiments/ap-physics/diffusion.html",
  "energy-skate-park-basics": "/experiments/ap-physics/energy-skate-park-basics.html",
  "faradays-electromagnetic-lab": "/experiments/ap-physics/faradays-electromagnetic-lab.html",
  "forces-motion-basics": "/experiments/ap-physics/forces-motion-basics.html",
  "fourier-making-waves": "/experiments/ap-physics/fourier-making-waves.html",
  "friction-lab": "/experiments/ap-physics/friction-lab.html",
  "gases-intro": "/experiments/ap-physics/gases-intro.html",
  generator: "/experiments/ap-physics/generator.html",
  "geometric-optics-basics": "/experiments/ap-physics/geometric-optics-basics.html",
  "gravity-force-lab-basics": "/experiments/ap-physics/gravity-force-lab-basics.html",
  "gravity-orbits": "/experiments/ap-physics/gravity-orbits.html",
  "hookes-law": "/experiments/ap-physics/hookes-law.html",
  "john-travoltage": "/experiments/ap-physics/john-travoltage.html",
  "keplers-laws": "/experiments/ap-physics/keplers-laws.html",
  "magnets-and-electromagnets": "/experiments/ap-physics/magnets-and-electromagnets.html",
  "masses-springs": "/experiments/ap-physics/masses-springs.html",
  "masses-springs-basics": "/experiments/ap-physics/masses-springs-basics.html",
  "models-hydrogen-atom": "/experiments/ap-physics/models-hydrogen-atom.html",
  "molecules-and-light": "/experiments/ap-physics/molecules-and-light.html",
  "my-solar-system": "/experiments/ap-physics/my-solar-system.html",
  "normal-modes": "/experiments/ap-physics/normal-modes.html",
  "ohms-law": "/experiments/ap-physics/ohms-law.html",
  "pendulum-lab": "/experiments/ap-physics/pendulum-lab.html",
  "plinko-probability": "/experiments/ap-physics/plinko-probability.html",
  "pressure-lab": "/experiments/ap-physics/pressure-lab.html",
  "projectile-data-lab": "/experiments/ap-physics/projectile-data-lab.html",
  "quantum-coin-toss": "/experiments/ap-physics/quantum-coin-toss.html",
  "quantum-measurement": "/experiments/ap-physics/quantum-measurement.html",
  "resistance-wire": "/experiments/ap-physics/resistance-wire.html",
  "rutherford-scattering": "/experiments/ap-physics/rutherford-scattering.html",
  "states-of-matter-basics": "/experiments/ap-physics/states-of-matter-basics.html",
  "vector-addition": "/experiments/ap-physics/vector-addition.html",
  "wave-on-string": "/experiments/ap-physics/wave-on-string.html",
  "waves-intro": "/experiments/ap-physics/waves-intro.html",

  // Wave 6 — Middle School 6-8
  "ms-newtons-laws": "/experiments/middle/ms-newtons-laws.html",
  "ms-energy-conservation": "/experiments/middle/ms-energy-conservation.html",
  "ms-chemical-reactions": "/experiments/middle/ms-chemical-reactions.html",
  "ms-atoms-molecules": "/experiments/middle/ms-atoms-molecules.html",
  "ms-plate-tectonics": "/experiments/middle/ms-plate-tectonics.html",
  "ms-photosynthesis-respiration":
    "/experiments/middle/ms-photosynthesis-respiration.html",
  "ms-genetics": "/experiments/middle/ms-genetics.html",
  "ms-ecosystems": "/experiments/middle/ms-ecosystems.html",
  "ms-weather-systems": "/experiments/middle/ms-weather-systems.html",
};

export function getExperimentHtmlPath(id: string): string | null {
  return EXPERIMENT_HTML_MAP[id] ?? null;
}
