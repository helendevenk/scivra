import type {
  Experiment,
  GradeLevel,
  PrimaryStandard,
  Subject,
} from "@/shared/types/experiment";

type ExperimentModule = Record<string, Experiment>;

const subjectCache = new Map<Subject, Promise<Experiment[]>>();

const moduleImporters: Record<string, () => Promise<ExperimentModule>> = {
  "./data/ac-circuits": () => import("./data/ac-circuits"),
  "./data/amperes-law": () => import("./data/amperes-law"),
  "./data/angular-momentum-3d": () => import("./data/angular-momentum-3d"),
  "./data/atomic-interactions": () => import("./data/atomic-interactions"),
  "./data/balancing-act": () => import("./data/balancing-act"),
  "./data/balloons-static-electricity": () =>
    import("./data/balloons-static-electricity"),
  "./data/bending-light": () => import("./data/bending-light"),
  "./data/bernoulli-fluid-dynamics": () =>
    import("./data/bernoulli-fluid-dynamics"),
  "./data/blackbody-spectrum": () => import("./data/blackbody-spectrum"),
  "./data/build-a-nucleus": () => import("./data/build-a-nucleus"),
  "./data/buoyancy-basics": () => import("./data/buoyancy-basics"),
  "./data/buoyancy": () => import("./data/buoyancy"),
  "./data/capacitors-rc-circuits": () =>
    import("./data/capacitors-rc-circuits"),
  "./data/circuit-ac-virtual-lab": () =>
    import("./data/circuit-ac-virtual-lab"),
  "./data/circuit-dc-virtual-lab": () =>
    import("./data/circuit-dc-virtual-lab"),
  "./data/circular-motion": () => import("./data/circular-motion"),
  "./data/color-vision": () => import("./data/color-vision"),
  "./data/coulombs-law": () => import("./data/coulombs-law"),
  "./data/dc-circuits-basic": () => import("./data/dc-circuits-basic"),
  "./data/density-lab": () => import("./data/density-lab"),
  "./data/diffusion": () => import("./data/diffusion"),
  "./data/doppler-effect": () => import("./data/doppler-effect"),
  "./data/electric-field-lines": () => import("./data/electric-field-lines"),
  "./data/electric-potential-voltage": () =>
    import("./data/electric-potential-voltage"),
  "./data/electromagnetic-induction": () =>
    import("./data/electromagnetic-induction"),
  "./data/em-spectrum": () => import("./data/em-spectrum"),
  "./data/energy-skate-park-basics": () =>
    import("./data/energy-skate-park-basics"),
  "./data/faradays-electromagnetic-lab": () =>
    import("./data/faradays-electromagnetic-lab"),
  "./data/fluid-statics": () => import("./data/fluid-statics"),
  "./data/forces-motion-basics": () => import("./data/forces-motion-basics"),
  "./data/fourier-making-waves": () => import("./data/fourier-making-waves"),
  "./data/friction-lab": () => import("./data/friction-lab"),
  "./data/gases-intro": () => import("./data/gases-intro"),
  "./data/gauss-law": () => import("./data/gauss-law"),
  "./data/generator": () => import("./data/generator"),
  "./data/geometric-optics-basics": () =>
    import("./data/geometric-optics-basics"),
  "./data/geometric-optics-lenses": () =>
    import("./data/geometric-optics-lenses"),
  "./data/gravitational-fields": () => import("./data/gravitational-fields"),
  "./data/gravity-force-lab-basics": () =>
    import("./data/gravity-force-lab-basics"),
  "./data/gravity-orbits": () => import("./data/gravity-orbits"),
  "./data/heat-engines": () => import("./data/heat-engines"),
  "./data/hookes-law": () => import("./data/hookes-law"),
  "./data/ideal-gas-thermodynamics": () =>
    import("./data/ideal-gas-thermodynamics"),
  "./data/john-travoltage": () => import("./data/john-travoltage"),
  "./data/k5-energy-conversion": () => import("./data/k5-energy-conversion"),
  "./data/k5-force-motion": () => import("./data/k5-force-motion"),
  "./data/k5-light-propagation": () => import("./data/k5-light-propagation"),
  "./data/k5-magnetism": () => import("./data/k5-magnetism"),
  "./data/k5-simple-machines": () => import("./data/k5-simple-machines"),
  "./data/k5-solar-energy": () => import("./data/k5-solar-energy"),
  "./data/k5-sound-vibration": () => import("./data/k5-sound-vibration"),
  "./data/k5-sound-waves": () => import("./data/k5-sound-waves"),
  "./data/keplers-laws": () => import("./data/keplers-laws"),
  "./data/kinematics-graphs": () => import("./data/kinematics-graphs"),
  "./data/lorentz-force": () => import("./data/lorentz-force"),
  "./data/magnets-and-electromagnets": () =>
    import("./data/magnets-and-electromagnets"),
  "./data/masses-springs-basics": () => import("./data/masses-springs-basics"),
  "./data/masses-springs": () => import("./data/masses-springs"),
  "./data/models-hydrogen-atom": () => import("./data/models-hydrogen-atom"),
  "./data/molecules-and-light": () => import("./data/molecules-and-light"),
  "./data/momentum-collisions": () => import("./data/momentum-collisions"),
  "./data/ms-electric-circuits-advanced": () =>
    import("./data/ms-electric-circuits-advanced"),
  "./data/ms-energy-conservation": () =>
    import("./data/ms-energy-conservation"),
  "./data/ms-force-motion-graphs": () =>
    import("./data/ms-force-motion-graphs"),
  "./data/ms-newtons-laws": () => import("./data/ms-newtons-laws"),
  "./data/ms-wave-interactions-advanced": () =>
    import("./data/ms-wave-interactions-advanced"),
  "./data/my-solar-system": () => import("./data/my-solar-system"),
  "./data/newtons-laws": () => import("./data/newtons-laws"),
  "./data/normal-modes": () => import("./data/normal-modes"),
  "./data/nuclear-decay": () => import("./data/nuclear-decay"),
  "./data/ohms-law": () => import("./data/ohms-law"),
  "./data/pendulum-lab": () => import("./data/pendulum-lab"),
  "./data/photoelectric-effect": () => import("./data/photoelectric-effect"),
  "./data/pressure-lab": () => import("./data/pressure-lab"),
  "./data/projectile-data-lab": () => import("./data/projectile-data-lab"),
  "./data/projectile-motion": () => import("./data/projectile-motion"),
  "./data/quantum-coin-toss": () => import("./data/quantum-coin-toss"),
  "./data/quantum-measurement": () => import("./data/quantum-measurement"),
  "./data/resistance-wire": () => import("./data/resistance-wire"),
  "./data/rlc-circuit": () => import("./data/rlc-circuit"),
  "./data/roller-coaster": () => import("./data/roller-coaster"),
  "./data/rotational-kinematics-advanced": () =>
    import("./data/rotational-kinematics-advanced"),
  "./data/rotational-motion": () => import("./data/rotational-motion"),
  "./data/rutherford-scattering": () => import("./data/rutherford-scattering"),
  "./data/simple-harmonic-motion": () =>
    import("./data/simple-harmonic-motion"),
  "./data/single-slit-diffraction": () =>
    import("./data/single-slit-diffraction"),
  "./data/states-of-matter-basics": () =>
    import("./data/states-of-matter-basics"),
  "./data/vector-addition": () => import("./data/vector-addition"),
  "./data/wave-interference": () => import("./data/wave-interference"),
  "./data/wave-on-string": () => import("./data/wave-on-string"),
  "./data/waves-intro": () => import("./data/waves-intro"),
  "./data/work-energy-theorem": () => import("./data/work-energy-theorem"),
  "./data/acid-base-ph": () => import("./data/acid-base-ph"),
  "./data/atomic-structure": () => import("./data/atomic-structure"),
  "./data/balancing-chemical-equations": () =>
    import("./data/balancing-chemical-equations"),
  "./data/beers-law-lab": () => import("./data/beers-law-lab"),
  "./data/build-a-molecule": () => import("./data/build-a-molecule"),
  "./data/calorimetry": () => import("./data/calorimetry"),
  "./data/chemical-equilibrium": () => import("./data/chemical-equilibrium"),
  "./data/electrochemistry": () => import("./data/electrochemistry"),
  "./data/electron-configuration": () =>
    import("./data/electron-configuration"),
  "./data/gas-properties": () => import("./data/gas-properties"),
  "./data/k5-chemical-changes": () => import("./data/k5-chemical-changes"),
  "./data/k5-mixtures-solutions": () => import("./data/k5-mixtures-solutions"),
  "./data/k5-states-of-matter": () => import("./data/k5-states-of-matter"),
  "./data/lewis-structures": () => import("./data/lewis-structures"),
  "./data/molecular-bonding": () => import("./data/molecular-bonding"),
  "./data/molecular-polarity": () => import("./data/molecular-polarity"),
  "./data/ms-acid-base-reactions": () =>
    import("./data/ms-acid-base-reactions"),
  "./data/ms-atoms-molecules": () => import("./data/ms-atoms-molecules"),
  "./data/ms-chemical-bonding": () => import("./data/ms-chemical-bonding"),
  "./data/ms-chemical-reactions": () => import("./data/ms-chemical-reactions"),
  "./data/ms-chemical-stoichiometry": () =>
    import("./data/ms-chemical-stoichiometry"),
  "./data/reaction-kinetics": () => import("./data/reaction-kinetics"),
  "./data/solutions-dilutions": () => import("./data/solutions-dilutions"),
  "./data/stoichiometry": () => import("./data/stoichiometry"),
  "./data/thermochemistry": () => import("./data/thermochemistry"),
  "./data/cell-structure-3d": () => import("./data/cell-structure-3d"),
  "./data/cellular-respiration-detail": () =>
    import("./data/cellular-respiration-detail"),
  "./data/cellular-respiration": () => import("./data/cellular-respiration"),
  "./data/dna-double-helix": () => import("./data/dna-double-helix"),
  "./data/dna-replication-detail": () =>
    import("./data/dna-replication-detail"),
  "./data/ecological-succession": () => import("./data/ecological-succession"),
  "./data/enzyme-kinetics": () => import("./data/enzyme-kinetics"),
  "./data/evidence-of-evolution": () => import("./data/evidence-of-evolution"),
  "./data/hardy-weinberg": () => import("./data/hardy-weinberg"),
  "./data/immune-system": () => import("./data/immune-system"),
  "./data/k5-animal-adaptations": () =>
    import("./data/k5-animal-adaptations"),
  "./data/k5-food-chain": () => import("./data/k5-food-chain"),
  "./data/k5-habitats": () => import("./data/k5-habitats"),
  "./data/k5-plant-life-cycle": () => import("./data/k5-plant-life-cycle"),
  "./data/k5-plant-needs": () => import("./data/k5-plant-needs"),
  "./data/meiosis": () => import("./data/meiosis"),
  "./data/membrane-transport": () => import("./data/membrane-transport"),
  "./data/mitosis": () => import("./data/mitosis"),
  "./data/ms-cell-division-comparison": () =>
    import("./data/ms-cell-division-comparison"),
  "./data/ms-ecosystems": () => import("./data/ms-ecosystems"),
  "./data/ms-food-web-dynamics": () => import("./data/ms-food-web-dynamics"),
  "./data/ms-genetics-punnett": () => import("./data/ms-genetics-punnett"),
  "./data/ms-genetics": () => import("./data/ms-genetics"),
  "./data/ms-photosynthesis-respiration": () =>
    import("./data/ms-photosynthesis-respiration"),
  "./data/natural-selection": () => import("./data/natural-selection"),
  "./data/neuron-action-potential": () =>
    import("./data/neuron-action-potential"),
  "./data/photosynthesis-light-reactions": () =>
    import("./data/photosynthesis-light-reactions"),
  "./data/photosynthesis": () => import("./data/photosynthesis"),
  "./data/population-dynamics": () => import("./data/population-dynamics"),
  "./data/protein-synthesis-3d": () => import("./data/protein-synthesis-3d"),
  "./data/protein-synthesis": () => import("./data/protein-synthesis"),
  "./data/atmosphere-layers": () => import("./data/atmosphere-layers"),
  "./data/climate-change-modeling": () =>
    import("./data/climate-change-modeling"),
  "./data/glaciers-ice-ages": () => import("./data/glaciers-ice-ages"),
  "./data/greenhouse-effect": () => import("./data/greenhouse-effect"),
  "./data/k5-day-night-seasons": () => import("./data/k5-day-night-seasons"),
  "./data/k5-landforms-erosion": () => import("./data/k5-landforms-erosion"),
  "./data/k5-moon-phases": () => import("./data/k5-moon-phases"),
  "./data/k5-stars-space": () => import("./data/k5-stars-space"),
  "./data/k5-water-cycle": () => import("./data/k5-water-cycle"),
  "./data/k5-weather-measurement": () =>
    import("./data/k5-weather-measurement"),
  "./data/k5-weather-patterns": () => import("./data/k5-weather-patterns"),
  "./data/mineral-identification": () => import("./data/mineral-identification"),
  "./data/moon-geology": () => import("./data/moon-geology"),
  "./data/ms-earthquake-epicenter": () =>
    import("./data/ms-earthquake-epicenter"),
  "./data/ms-moon-phases-detailed": () =>
    import("./data/ms-moon-phases-detailed"),
  "./data/ms-plate-tectonics": () => import("./data/ms-plate-tectonics"),
  "./data/ms-weather-systems": () => import("./data/ms-weather-systems"),
  "./data/ocean-currents": () => import("./data/ocean-currents"),
  "./data/plate-tectonics-advanced": () =>
    import("./data/plate-tectonics-advanced"),
  "./data/radiometric-dating": () => import("./data/radiometric-dating"),
  "./data/rock-cycle": () => import("./data/rock-cycle"),
  "./data/seismic-waves": () => import("./data/seismic-waves"),
  "./data/soil-formation": () => import("./data/soil-formation"),
  "./data/solar-system-scale": () => import("./data/solar-system-scale"),
  "./data/star-life-cycle": () => import("./data/star-life-cycle"),
  "./data/tides-lunar-gravity": () => import("./data/tides-lunar-gravity"),
  "./data/volcano-eruption-types": () =>
    import("./data/volcano-eruption-types"),
  "./data/water-cycle-detail": () => import("./data/water-cycle-detail"),
  "./data/calculus-grapher": () => import("./data/calculus-grapher"),
  "./data/curve-fitting": () => import("./data/curve-fitting"),
  "./data/plinko-probability": () => import("./data/plinko-probability"),
};

function extractExperiment(
  subject: Subject,
  modulePath: string,
  mod: ExperimentModule
): Experiment {
  const experiment = Object.values(mod)[0];

  if (!experiment) {
    throw new Error(
      `实验模块未导出有效数据: subject=${subject}, module=${modulePath}`
    );
  }

  return experiment;
}

async function loadModules(
  subject: Subject,
  modules: Array<Promise<ExperimentModule>>,
  modulePaths: string[]
): Promise<Experiment[]> {
  const loaded = await Promise.all(modules);

  return loaded.map((mod, index) =>
    extractExperiment(subject, modulePaths[index] ?? "unknown", mod)
  );
}

const subjectLoaders: Record<Subject, () => Promise<Experiment[]>> = {
  physics: async () => {
    const modulePaths = [
      "./data/ac-circuits",
      "./data/amperes-law",
      "./data/angular-momentum-3d",
      "./data/atomic-interactions",
      "./data/balancing-act",
      "./data/balloons-static-electricity",
      "./data/bending-light",
      "./data/bernoulli-fluid-dynamics",
      "./data/blackbody-spectrum",
      "./data/build-a-nucleus",
      "./data/buoyancy-basics",
      "./data/buoyancy",
      "./data/capacitors-rc-circuits",
      "./data/circuit-ac-virtual-lab",
      "./data/circuit-dc-virtual-lab",
      "./data/circular-motion",
      "./data/color-vision",
      "./data/coulombs-law",
      "./data/dc-circuits-basic",
      "./data/density-lab",
      "./data/diffusion",
      "./data/doppler-effect",
      "./data/electric-field-lines",
      "./data/electric-potential-voltage",
      "./data/electromagnetic-induction",
      "./data/em-spectrum",
      "./data/energy-skate-park-basics",
      "./data/faradays-electromagnetic-lab",
      "./data/fluid-statics",
      "./data/forces-motion-basics",
      "./data/fourier-making-waves",
      "./data/friction-lab",
      "./data/gases-intro",
      "./data/gauss-law",
      "./data/generator",
      "./data/geometric-optics-basics",
      "./data/geometric-optics-lenses",
      "./data/gravitational-fields",
      "./data/gravity-force-lab-basics",
      "./data/gravity-orbits",
      "./data/heat-engines",
      "./data/hookes-law",
      "./data/ideal-gas-thermodynamics",
      "./data/john-travoltage",
      "./data/k5-energy-conversion",
      "./data/k5-force-motion",
      "./data/k5-light-propagation",
      "./data/k5-magnetism",
      "./data/k5-simple-machines",
      "./data/k5-solar-energy",
      "./data/k5-sound-vibration",
      "./data/k5-sound-waves",
      "./data/keplers-laws",
      "./data/kinematics-graphs",
      "./data/lorentz-force",
      "./data/magnets-and-electromagnets",
      "./data/masses-springs-basics",
      "./data/masses-springs",
      "./data/models-hydrogen-atom",
      "./data/molecules-and-light",
      "./data/momentum-collisions",
      "./data/ms-electric-circuits-advanced",
      "./data/ms-energy-conservation",
      "./data/ms-force-motion-graphs",
      "./data/ms-newtons-laws",
      "./data/ms-wave-interactions-advanced",
      "./data/my-solar-system",
      "./data/newtons-laws",
      "./data/normal-modes",
      "./data/nuclear-decay",
      "./data/ohms-law",
      "./data/pendulum-lab",
      "./data/photoelectric-effect",
      "./data/pressure-lab",
      "./data/projectile-data-lab",
      "./data/projectile-motion",
      "./data/quantum-coin-toss",
      "./data/quantum-measurement",
      "./data/resistance-wire",
      "./data/rlc-circuit",
      "./data/roller-coaster",
      "./data/rotational-kinematics-advanced",
      "./data/rotational-motion",
      "./data/rutherford-scattering",
      "./data/simple-harmonic-motion",
      "./data/single-slit-diffraction",
      "./data/states-of-matter-basics",
      "./data/vector-addition",
      "./data/wave-interference",
      "./data/wave-on-string",
      "./data/waves-intro",
      "./data/work-energy-theorem",
    ];

    return loadModules(
      "physics",
      modulePaths.map((path) => moduleImporters[path]()),
      modulePaths
    );
  },
  chemistry: async () => {
    const modulePaths = [
      "./data/acid-base-ph",
      "./data/atomic-structure",
      "./data/balancing-chemical-equations",
      "./data/beers-law-lab",
      "./data/build-a-molecule",
      "./data/calorimetry",
      "./data/chemical-equilibrium",
      "./data/electrochemistry",
      "./data/electron-configuration",
      "./data/gas-properties",
      "./data/k5-chemical-changes",
      "./data/k5-mixtures-solutions",
      "./data/k5-states-of-matter",
      "./data/lewis-structures",
      "./data/molecular-bonding",
      "./data/molecular-polarity",
      "./data/ms-acid-base-reactions",
      "./data/ms-atoms-molecules",
      "./data/ms-chemical-bonding",
      "./data/ms-chemical-reactions",
      "./data/ms-chemical-stoichiometry",
      "./data/reaction-kinetics",
      "./data/solutions-dilutions",
      "./data/stoichiometry",
      "./data/thermochemistry",
    ];

    return loadModules(
      "chemistry",
      modulePaths.map((path) => moduleImporters[path]()),
      modulePaths
    );
  },
  biology: async () => {
    const modulePaths = [
      "./data/cell-structure-3d",
      "./data/cellular-respiration-detail",
      "./data/cellular-respiration",
      "./data/dna-double-helix",
      "./data/dna-replication-detail",
      "./data/ecological-succession",
      "./data/enzyme-kinetics",
      "./data/evidence-of-evolution",
      "./data/hardy-weinberg",
      "./data/immune-system",
      "./data/k5-animal-adaptations",
      "./data/k5-food-chain",
      "./data/k5-habitats",
      "./data/k5-plant-life-cycle",
      "./data/k5-plant-needs",
      "./data/meiosis",
      "./data/membrane-transport",
      "./data/mitosis",
      "./data/ms-cell-division-comparison",
      "./data/ms-ecosystems",
      "./data/ms-food-web-dynamics",
      "./data/ms-genetics-punnett",
      "./data/ms-genetics",
      "./data/ms-photosynthesis-respiration",
      "./data/natural-selection",
      "./data/neuron-action-potential",
      "./data/photosynthesis-light-reactions",
      "./data/photosynthesis",
      "./data/population-dynamics",
      "./data/protein-synthesis-3d",
      "./data/protein-synthesis",
    ];

    return loadModules(
      "biology",
      modulePaths.map((path) => moduleImporters[path]()),
      modulePaths
    );
  },
  "earth-science": async () => {
    const modulePaths = [
      "./data/atmosphere-layers",
      "./data/climate-change-modeling",
      "./data/glaciers-ice-ages",
      "./data/greenhouse-effect",
      "./data/k5-day-night-seasons",
      "./data/k5-landforms-erosion",
      "./data/k5-moon-phases",
      "./data/k5-stars-space",
      "./data/k5-water-cycle",
      "./data/k5-weather-measurement",
      "./data/k5-weather-patterns",
      "./data/mineral-identification",
      "./data/moon-geology",
      "./data/ms-earthquake-epicenter",
      "./data/ms-moon-phases-detailed",
      "./data/ms-plate-tectonics",
      "./data/ms-weather-systems",
      "./data/ocean-currents",
      "./data/plate-tectonics-advanced",
      "./data/radiometric-dating",
      "./data/rock-cycle",
      "./data/seismic-waves",
      "./data/soil-formation",
      "./data/solar-system-scale",
      "./data/star-life-cycle",
      "./data/tides-lunar-gravity",
      "./data/volcano-eruption-types",
      "./data/water-cycle-detail",
    ];

    return loadModules(
      "earth-science",
      modulePaths.map((path) => moduleImporters[path]()),
      modulePaths
    );
  },
  math: async () => {
    const modulePaths = [
      "./data/calculus-grapher",
      "./data/curve-fitting",
      "./data/plinko-probability",
    ];

    return loadModules(
      "math",
      modulePaths.map((path) => moduleImporters[path]()),
      modulePaths
    );
  },
};

export async function getExperimentsBySubjectAsync(
  subject: Subject
): Promise<Experiment[]> {
  const cached = subjectCache.get(subject);

  if (cached) {
    return cached;
  }

  const promise = subjectLoaders[subject]();
  subjectCache.set(subject, promise);

  return promise;
}

export async function getStandardsForSubjectAsync(
  subject: Subject
): Promise<PrimaryStandard[]> {
  const experiments = await getExperimentsBySubjectAsync(subject);
  const standards = new Set<PrimaryStandard>();

  for (const experiment of experiments) {
    standards.add(experiment.primaryStandard);
  }

  return Array.from(standards);
}

export async function getExperimentsByStandardForSubjectAsync(
  subject: Subject,
  standard: PrimaryStandard
): Promise<Experiment[]> {
  const experiments = await getExperimentsBySubjectAsync(subject);

  return experiments.filter(
    (experiment) => experiment.primaryStandard === standard
  );
}

export async function getExperimentBySlugForSubjectAsync(
  subject: Subject,
  slug: string
): Promise<Experiment | undefined> {
  const experiments = await getExperimentsBySubjectAsync(subject);

  return experiments.find((experiment) => experiment.slug === slug);
}

export async function getAllSubjectsWithCountsAsync(
  gradeLevel?: GradeLevel
): Promise<
  Array<{
    subject: Subject;
    count: number;
  }>
> {
  const subjects = Object.keys(subjectLoaders) as Subject[];
  const subjectExperiments = await Promise.all(
    subjects.map(async (subject) => ({
      subject,
      experiments: await getExperimentsBySubjectAsync(subject),
    }))
  );

  return subjectExperiments
    .map(({ subject, experiments }) => ({
      subject,
      count: gradeLevel
        ? experiments.filter(
            (experiment) => experiment.gradeLevel === gradeLevel
          ).length
        : experiments.length,
    }))
    .filter(({ count }) => count > 0);
}
