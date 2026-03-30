/**
 * Maps experiment slug → public HTML file path.
 * Wave 2+ experiments use standalone HTML simulations (Three.js CDN).
 * Wave 1 experiments use React Three Fiber components (see ExperimentClient).
 */
export const EXPERIMENT_HTML_MAP: Record<string, string> = {
  // Wave 7 — AP Physics gap-fill (Batch 1–3)
  "dc-circuits-basic": "/experiments-v2/ap-physics/dc-circuits-basic.html",
  "geometric-optics-lenses": "/experiments-v2/ap-physics/geometric-optics-lenses.html",
  "photoelectric-effect": "/experiments-v2/ap-physics/photoelectric-effect.html",
  "ideal-gas-thermodynamics": "/experiments-v2/ap-physics/ideal-gas-thermodynamics.html",
  "electromagnetic-induction": "/experiments-v2/ap-physics/electromagnetic-induction.html",
  "electric-potential-voltage": "/experiments-v2/ap-physics/electric-potential-voltage.html",
  "capacitors-rc-circuits": "/experiments-v2/ap-physics/capacitors-rc-circuits.html",
  "bernoulli-fluid-dynamics": "/experiments-v2/ap-physics/bernoulli-fluid-dynamics.html",
  "work-energy-theorem": "/experiments-v2/ap-physics/work-energy-theorem.html",
  "kinematics-graphs": "/experiments-v2/ap-physics/kinematics-graphs.html",
  "nuclear-decay": "/experiments-v2/ap-physics/nuclear-decay.html",
  "doppler-effect": "/experiments-v2/ap-physics/doppler-effect.html",
  "single-slit-diffraction": "/experiments-v2/ap-physics/single-slit-diffraction.html",
  "heat-engines": "/experiments-v2/ap-physics/heat-engines.html",

  // Wave 2 — AP Physics
  "simple-harmonic-motion":
    "/experiments-v2/ap-physics/shm-simple-harmonic-motion.html",
  "momentum-collisions": "/experiments-v2/ap-physics/momentum-collisions.html",
  "lorentz-force": "/experiments-v2/ap-physics/lorentz-force.html",
  "electric-field-lines": "/experiments-v2/ap-physics/electric-field-lines.html",
  "wave-interference": "/experiments-v2/ap-physics/wave-interference.html",
  "circular-motion": "/experiments-v2/ap-physics/circular-motion.html",
  "rotational-motion": "/experiments-v2/ap-physics/rotational-motion.html",
  "gravitational-fields": "/experiments-v2/ap-physics/gravitational-fields.html",
  "fluid-statics": "/experiments-v2/ap-physics/fluid-statics.html",

  // Wave 3 — AP Biology
  "dna-double-helix": "/experiments-v2/ap-biology/dna-double-helix.html",
  "protein-synthesis": "/experiments-v2/ap-biology/protein-synthesis.html",
  mitosis: "/experiments-v2/ap-biology/mitosis.html",
  meiosis: "/experiments-v2/ap-biology/meiosis.html",
  "cellular-respiration": "/experiments-v2/ap-biology/cellular-respiration.html",
  photosynthesis: "/experiments-v2/ap-biology/photosynthesis.html",
  "enzyme-kinetics": "/experiments-v2/ap-biology/enzyme-kinetics.html",
  "neuron-action-potential":
    "/experiments-v2/ap-biology/neuron-action-potential.html",
  "membrane-transport": "/experiments-v2/ap-biology/membrane-transport.html",
  "natural-selection": "/experiments-v2/ap-biology/natural-selection.html",

  // Wave 4 — AP Chemistry
  "molecular-bonding": "/experiments-v2/ap-chemistry/molecular-bonding.html",
  "reaction-kinetics": "/experiments-v2/ap-chemistry/reaction-kinetics.html",
  thermochemistry: "/experiments-v2/ap-chemistry/thermochemistry.html",
  "chemical-equilibrium": "/experiments-v2/ap-chemistry/chemical-equilibrium.html",
  "atomic-structure": "/experiments-v2/ap-chemistry/atomic-structure.html",
  "acid-base-ph": "/experiments-v2/ap-chemistry/acid-base-ph.html",
  electrochemistry: "/experiments-v2/ap-chemistry/electrochemistry.html",

  // Wave 5 — Elementary K-5
  "k5-force-motion": "/experiments-v2/elementary/k5-physics-force-motion.html",
  "k5-states-of-matter":
    "/experiments-v2/elementary/k5-chemistry-states-of-matter.html",
  "k5-light-propagation":
    "/experiments-v2/elementary/k5-physics-light-propagation.html",
  "k5-sound-waves": "/experiments-v2/elementary/k5-physics-sound-waves.html",
  "k5-simple-machines":
    "/experiments-v2/elementary/k5-physics-simple-machines.html",
  "k5-energy-conversion":
    "/experiments-v2/elementary/k5-physics-energy-conversion.html",
  "k5-food-chain": "/experiments-v2/elementary/k5-biology-food-chain.html",
  "k5-water-cycle": "/experiments-v2/elementary/k5-earth-water-cycle.html",
  "k5-day-night-seasons":
    "/experiments-v2/elementary/k5-earth-day-night-seasons.html",
  "k5-moon-phases": "/experiments-v2/elementary/k5-earth-moon-phases.html",
  "k5-magnetism": "/experiments-v2/elementary/k5-physics-magnetism.html",

  // Wave 8 — AP Physics (50 new experiments)
  "ac-circuits": "/experiments-v2/ap-physics/ac-circuits.html",
  "atomic-interactions": "/experiments-v2/ap-physics/atomic-interactions.html",
  "balancing-act": "/experiments-v2/ap-physics/balancing-act.html",
  "balloons-static-electricity": "/experiments-v2/ap-physics/balloons-static-electricity.html",
  "bending-light": "/experiments-v2/ap-physics/bending-light.html",
  "blackbody-spectrum": "/experiments-v2/ap-physics/blackbody-spectrum.html",
  "build-a-nucleus": "/experiments-v2/ap-physics/build-a-nucleus.html",
  buoyancy: "/experiments-v2/ap-physics/buoyancy.html",
  "buoyancy-basics": "/experiments-v2/ap-physics/buoyancy-basics.html",
  "calculus-grapher": "/experiments-v2/ap-physics/calculus-grapher.html",
  "circuit-ac-virtual-lab": "/experiments-v2/ap-physics/circuit-ac-virtual-lab.html",
  "circuit-dc-virtual-lab": "/experiments-v2/ap-physics/circuit-dc-virtual-lab.html",
  "color-vision": "/experiments-v2/ap-physics/color-vision.html",
  "coulombs-law": "/experiments-v2/ap-physics/coulombs-law.html",
  "curve-fitting": "/experiments-v2/ap-physics/curve-fitting.html",
  "density-lab": "/experiments-v2/ap-physics/density-lab.html",
  diffusion: "/experiments-v2/ap-physics/diffusion.html",
  "energy-skate-park-basics": "/experiments-v2/ap-physics/energy-skate-park-basics.html",
  "faradays-electromagnetic-lab": "/experiments-v2/ap-physics/faradays-electromagnetic-lab.html",
  "forces-motion-basics": "/experiments-v2/ap-physics/forces-motion-basics.html",
  "fourier-making-waves": "/experiments-v2/ap-physics/fourier-making-waves.html",
  "friction-lab": "/experiments-v2/ap-physics/friction-lab.html",
  "gases-intro": "/experiments-v2/ap-physics/gases-intro.html",
  generator: "/experiments-v2/ap-physics/generator.html",
  "geometric-optics-basics": "/experiments-v2/ap-physics/geometric-optics-basics.html",
  "gravity-force-lab-basics": "/experiments-v2/ap-physics/gravity-force-lab-basics.html",
  "gravity-orbits": "/experiments-v2/ap-physics/gravity-orbits.html",
  "hookes-law": "/experiments-v2/ap-physics/hookes-law.html",
  "john-travoltage": "/experiments-v2/ap-physics/john-travoltage.html",
  "keplers-laws": "/experiments-v2/ap-physics/keplers-laws.html",
  "magnets-and-electromagnets": "/experiments-v2/ap-physics/magnets-and-electromagnets.html",
  "masses-springs": "/experiments-v2/ap-physics/masses-springs.html",
  "masses-springs-basics": "/experiments-v2/ap-physics/masses-springs-basics.html",
  "models-hydrogen-atom": "/experiments-v2/ap-physics/models-hydrogen-atom.html",
  "molecules-and-light": "/experiments-v2/ap-physics/molecules-and-light.html",
  "my-solar-system": "/experiments-v2/ap-physics/my-solar-system.html",
  "normal-modes": "/experiments-v2/ap-physics/normal-modes.html",
  "ohms-law": "/experiments-v2/ap-physics/ohms-law.html",
  "pendulum-lab": "/experiments-v2/ap-physics/pendulum-lab.html",
  "plinko-probability": "/experiments-v2/ap-physics/plinko-probability.html",
  "pressure-lab": "/experiments-v2/ap-physics/pressure-lab.html",
  "projectile-data-lab": "/experiments-v2/ap-physics/projectile-data-lab.html",
  "quantum-coin-toss": "/experiments-v2/ap-physics/quantum-coin-toss.html",
  "quantum-measurement": "/experiments-v2/ap-physics/quantum-measurement.html",
  "resistance-wire": "/experiments-v2/ap-physics/resistance-wire.html",
  "rutherford-scattering": "/experiments-v2/ap-physics/rutherford-scattering.html",
  "states-of-matter-basics": "/experiments-v2/ap-physics/states-of-matter-basics.html",
  "vector-addition": "/experiments-v2/ap-physics/vector-addition.html",
  "wave-on-string": "/experiments-v2/ap-physics/wave-on-string.html",
  "waves-intro": "/experiments-v2/ap-physics/waves-intro.html",

  // Wave 6 — Middle School 6-8
  "ms-newtons-laws": "/experiments-v2/middle/ms-newtons-laws.html",
  "ms-energy-conservation": "/experiments-v2/middle/ms-energy-conservation.html",
  "ms-chemical-reactions": "/experiments-v2/middle/ms-chemical-reactions.html",
  "ms-atoms-molecules": "/experiments-v2/middle/ms-atoms-molecules.html",
  "ms-plate-tectonics": "/experiments-v2/middle/ms-plate-tectonics.html",
  "ms-photosynthesis-respiration":
    "/experiments-v2/middle/ms-photosynthesis-respiration.html",
  "ms-genetics": "/experiments-v2/middle/ms-genetics.html",
  "ms-ecosystems": "/experiments-v2/middle/ms-ecosystems.html",
  "ms-weather-systems": "/experiments-v2/middle/ms-weather-systems.html",

  // Wave 9 — AP Chemistry Core (C-08 to C-17)
  "balancing-chemical-equations":
    "/experiments-v2/ap-chemistry/balancing-chemical-equations.html",
  "electron-configuration":
    "/experiments-v2/ap-chemistry/electron-configuration.html",
  "lewis-structures": "/experiments-v2/ap-chemistry/lewis-structures.html",
  "beers-law-lab": "/experiments-v2/ap-chemistry/beers-law-lab.html",
  "solutions-dilutions": "/experiments-v2/ap-chemistry/solutions-dilutions.html",
  "stoichiometry": "/experiments-v2/ap-chemistry/stoichiometry.html",
  "calorimetry": "/experiments-v2/ap-chemistry/calorimetry.html",
  "gas-properties": "/experiments-v2/ap-chemistry/gas-properties.html",
  "build-a-molecule": "/experiments-v2/ap-chemistry/build-a-molecule.html",
  "molecular-polarity": "/experiments-v2/ap-chemistry/molecular-polarity.html",
  // Wave 10 — Earth Science
  "greenhouse-effect": "/experiments-v2/earth-science/greenhouse-effect.html",
  "radiometric-dating": "/experiments-v2/earth-science/radiometric-dating.html",
  "atmosphere-layers": "/experiments-v2/earth-science/atmosphere-layers.html",
  "solar-system-scale": "/experiments-v2/earth-science/solar-system-scale.html",
  "seismic-waves": "/experiments-v2/earth-science/seismic-waves.html",
  "rock-cycle": "/experiments-v2/earth-science/rock-cycle.html",
  "climate-change-modeling": "/experiments-v2/earth-science/climate-change-modeling.html",
  "star-life-cycle": "/experiments-v2/earth-science/star-life-cycle.html",
  "soil-formation": "/experiments-v2/earth-science/soil-formation.html",
  "tides-lunar-gravity": "/experiments-v2/earth-science/tides-lunar-gravity.html",
  "glaciers-ice-ages": "/experiments-v2/earth-science/glaciers-ice-ages.html",
  "plate-tectonics-advanced": "/experiments-v2/earth-science/plate-tectonics-advanced.html",

  // Wave 11 — Biology AP (B-11 to B-16)
  "immune-system": "/experiments-v2/ap-biology/immune-system.html",
  "population-dynamics": "/experiments-v2/ap-biology/population-dynamics.html",
  "ecological-succession": "/experiments-v2/ap-biology/ecological-succession.html",
  "evidence-of-evolution": "/experiments-v2/ap-biology/evidence-of-evolution.html",
  "hardy-weinberg": "/experiments-v2/ap-biology/hardy-weinberg.html",
  "cell-structure-3d": "/experiments-v2/ap-biology/cell-structure-3d.html",

  // Wave 11 — K5 Extensions (K5-12 to K5-19)
  "k5-chemical-changes": "/experiments-v2/elementary/k5-chemical-changes.html",
  "k5-mixtures-solutions": "/experiments-v2/elementary/k5-mixtures-solutions.html",
  "k5-weather-patterns": "/experiments-v2/elementary/k5-weather-patterns.html",
  "k5-landforms-erosion": "/experiments-v2/elementary/k5-landforms-erosion.html",
  "k5-stars-space": "/experiments-v2/elementary/k5-stars-space.html",
  "k5-plant-life-cycle": "/experiments-v2/elementary/k5-plant-life-cycle.html",
  "k5-animal-adaptations": "/experiments-v2/elementary/k5-animal-adaptations.html",
  "k5-solar-energy": "/experiments-v2/elementary/k5-solar-energy.html",

  // Wave 11 — Middle School Extensions (MS-10 to MS-17)
  "ms-chemical-bonding": "/experiments-v2/middle/ms-chemical-bonding.html",
  "ms-acid-base-reactions": "/experiments-v2/middle/ms-acid-base-reactions.html",
  "ms-earthquake-epicenter": "/experiments-v2/middle/ms-earthquake-epicenter.html",
  "ms-moon-phases-detailed": "/experiments-v2/middle/ms-moon-phases-detailed.html",
  "ms-cell-division-comparison": "/experiments-v2/middle/ms-cell-division-comparison.html",
  "ms-food-web-dynamics": "/experiments-v2/middle/ms-food-web-dynamics.html",
  "ms-electric-circuits-advanced": "/experiments-v2/middle/ms-electric-circuits-advanced.html",
  "ms-wave-interactions-advanced": "/experiments-v2/middle/ms-wave-interactions-advanced.html",

  // Wave 12 — AP Physics C (P-83 to P-87)
  "gauss-law": "/experiments-v2/ap-physics-c/gauss-law.html",
  "amperes-law": "/experiments-v2/ap-physics-c/amperes-law.html",
  "rlc-circuit": "/experiments-v2/ap-physics-c/rlc-circuit.html",
  "rotational-kinematics-advanced": "/experiments-v2/ap-physics-c/rotational-kinematics-advanced.html",
  "angular-momentum-3d": "/experiments-v2/ap-physics-c/angular-momentum-3d.html",

  // Wave 12 — P2 Batch
  "ocean-currents": "/experiments-v2/earth-science/ocean-currents.html",
  "ms-chemical-stoichiometry": "/experiments-v2/middle/ms-chemical-stoichiometry.html",
  "ms-genetics-punnett": "/experiments-v2/middle/ms-genetics-punnett.html",
  "ms-force-motion-graphs": "/experiments-v2/middle/ms-force-motion-graphs.html",
  "photosynthesis-light-reactions": "/experiments-v2/ap-biology/photosynthesis-light-reactions.html",
  "cellular-respiration-detail": "/experiments-v2/ap-biology/cellular-respiration-detail.html",
  "dna-replication-detail": "/experiments-v2/ap-biology/dna-replication-detail.html",
  "protein-synthesis-3d": "/experiments-v2/ap-biology/protein-synthesis-3d.html",
  "moon-geology": "/experiments-v2/earth-science/moon-geology.html",
  "water-cycle-detail": "/experiments-v2/earth-science/water-cycle-detail.html",
  "mineral-identification": "/experiments-v2/earth-science/mineral-identification.html",
  "volcano-eruption-types": "/experiments-v2/earth-science/volcano-eruption-types.html",
  "k5-sound-vibration": "/experiments-v2/elementary/k5-sound-vibration.html",
  "k5-plant-needs": "/experiments-v2/elementary/k5-plant-needs.html",
  "k5-weather-measurement": "/experiments-v2/elementary/k5-weather-measurement.html",
  "k5-habitats": "/experiments-v2/elementary/k5-habitats.html",
};

export function getExperimentHtmlPath(slug: string): string | null {
  return EXPERIMENT_HTML_MAP[slug] ?? null;
}
