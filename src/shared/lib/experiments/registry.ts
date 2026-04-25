import type {
  Experiment,
  GradeLevel,
  PhysicsCategory,
  PrimaryStandard,
  Subject,
  Tier,
  Wave,
} from "@/shared/types/experiment";
import { getExperimentsBySubjectAsync } from "./registry-subjects";
import { SUBJECT_LIST } from "./subjects";

// Wave 1 — Original 4
import { newtonsLaws } from "./data/newtons-laws";
import { projectileMotion } from "./data/projectile-motion";
import { emSpectrum } from "./data/em-spectrum";
import { rollerCoaster } from "./data/roller-coaster";

// Wave 2 — AP Physics (P-01 to P-09)
import { simpleHarmonicMotion } from "./data/simple-harmonic-motion";
import { momentumCollisions } from "./data/momentum-collisions";
import { lorentzForce } from "./data/lorentz-force";
import { electricFieldLines } from "./data/electric-field-lines";
import { waveInterference } from "./data/wave-interference";
import { circularMotion } from "./data/circular-motion";
import { rotationalMotion } from "./data/rotational-motion";
import { gravitationalFields } from "./data/gravitational-fields";
import { fluidStatics } from "./data/fluid-statics";

// Wave 3 — AP Biology (B-01 to B-10)
import { dnaDoubleHelix } from "./data/dna-double-helix";
import { proteinSynthesis } from "./data/protein-synthesis";
import { mitosis } from "./data/mitosis";
import { meiosis } from "./data/meiosis";
import { cellularRespiration } from "./data/cellular-respiration";
import { photosynthesis } from "./data/photosynthesis";
import { enzymeKinetics } from "./data/enzyme-kinetics";
import { neuronActionPotential } from "./data/neuron-action-potential";
import { membraneTransport } from "./data/membrane-transport";
import { naturalSelection } from "./data/natural-selection";

// Wave 4 — AP Chemistry (C-01 to C-07)
import { molecularBonding } from "./data/molecular-bonding";
import { reactionKinetics } from "./data/reaction-kinetics";
import { thermochemistry } from "./data/thermochemistry";
import { chemicalEquilibrium } from "./data/chemical-equilibrium";
import { atomicStructure } from "./data/atomic-structure";
import { acidBasePh } from "./data/acid-base-ph";
import { electrochemistry } from "./data/electrochemistry";

// Wave 5 — Elementary K-5 (K5-01 to K5-11)
import { k5ForceMotion } from "./data/k5-force-motion";
import { k5StatesOfMatter } from "./data/k5-states-of-matter";
import { k5LightPropagation } from "./data/k5-light-propagation";
import { k5SoundWaves } from "./data/k5-sound-waves";
import { k5SimpleMachines } from "./data/k5-simple-machines";
import { k5EnergyConversion } from "./data/k5-energy-conversion";
import { k5FoodChain } from "./data/k5-food-chain";
import { k5WaterCycle } from "./data/k5-water-cycle";
import { k5DayNightSeasons } from "./data/k5-day-night-seasons";
import { k5MoonPhases } from "./data/k5-moon-phases";
import { k5Magnetism } from "./data/k5-magnetism";

// Wave 6 — Middle School 6-8 (MS-01 to MS-09)
import { msNewtonsLaws } from "./data/ms-newtons-laws";
import { msEnergyConservation } from "./data/ms-energy-conservation";
import { msChemicalReactions } from "./data/ms-chemical-reactions";
import { msAtomsMolecules } from "./data/ms-atoms-molecules";
import { msPlateTectonics } from "./data/ms-plate-tectonics";
import { msPhotosynthesisRespiration } from "./data/ms-photosynthesis-respiration";
import { msGenetics } from "./data/ms-genetics";
import { msEcosystems } from "./data/ms-ecosystems";
import { msWeatherSystems } from "./data/ms-weather-systems";

// Wave 7 — AP Physics gap-fill (14 experiments)
import { dcCircuitsBasic } from "./data/dc-circuits-basic";
import { geometricOpticsLenses } from "./data/geometric-optics-lenses";
import { photoelectricEffect } from "./data/photoelectric-effect";
import { idealGasThermodynamics } from "./data/ideal-gas-thermodynamics";
import { electromagneticInduction } from "./data/electromagnetic-induction";
import { electricPotentialVoltage } from "./data/electric-potential-voltage";
import { capacitorsRcCircuits } from "./data/capacitors-rc-circuits";
import { bernoulliFluidDynamics } from "./data/bernoulli-fluid-dynamics";
import { workEnergyTheorem } from "./data/work-energy-theorem";
import { kinematicsGraphs } from "./data/kinematics-graphs";
import { nuclearDecay } from "./data/nuclear-decay";
import { dopplerEffect } from "./data/doppler-effect";
import { singleSlitDiffraction } from "./data/single-slit-diffraction";
import { heatEngines } from "./data/heat-engines";

// Wave 8 — 50 AP Physics HTML experiments
import { acCircuits } from "./data/ac-circuits";
import { atomicInteractions } from "./data/atomic-interactions";
import { balancingAct } from "./data/balancing-act";
import { balloonsStaticElectricity } from "./data/balloons-static-electricity";
import { bendingLight } from "./data/bending-light";
import { blackbodySpectrum } from "./data/blackbody-spectrum";
import { buildANucleus } from "./data/build-a-nucleus";
import { buoyancy } from "./data/buoyancy";
import { buoyancyBasics } from "./data/buoyancy-basics";
import { calculusGrapher } from "./data/calculus-grapher";
import { circuitAcVirtualLab } from "./data/circuit-ac-virtual-lab";
import { circuitDcVirtualLab } from "./data/circuit-dc-virtual-lab";
import { colorVision } from "./data/color-vision";
import { coulombsLaw } from "./data/coulombs-law";
import { curveFitting } from "./data/curve-fitting";
import { densityLab } from "./data/density-lab";
import { diffusion } from "./data/diffusion";
import { energySkateParkBasics } from "./data/energy-skate-park-basics";
import { faradaysElectromagneticLab } from "./data/faradays-electromagnetic-lab";
import { forcesMotionBasics } from "./data/forces-motion-basics";
import { fourierMakingWaves } from "./data/fourier-making-waves";
import { frictionLab } from "./data/friction-lab";
import { gasesIntro } from "./data/gases-intro";
import { generator } from "./data/generator";
import { geometricOpticsBasics } from "./data/geometric-optics-basics";
import { gravityForceLabBasics } from "./data/gravity-force-lab-basics";
import { gravityOrbits } from "./data/gravity-orbits";
import { hookesLaw } from "./data/hookes-law";
import { johnTravoltage } from "./data/john-travoltage";
import { keplersLaws } from "./data/keplers-laws";
import { magnetsAndElectromagnets } from "./data/magnets-and-electromagnets";
import { massesSprings } from "./data/masses-springs";
import { massesSpringsBasics } from "./data/masses-springs-basics";
import { modelsHydrogenAtom } from "./data/models-hydrogen-atom";
import { moleculesAndLight } from "./data/molecules-and-light";
import { mySolarSystem } from "./data/my-solar-system";
import { normalModes } from "./data/normal-modes";
import { ohmsLaw } from "./data/ohms-law";
import { pendulumLab } from "./data/pendulum-lab";
import { plinkoProbability } from "./data/plinko-probability";
import { pressureLab } from "./data/pressure-lab";
import { projectileDataLab } from "./data/projectile-data-lab";
import { quantumCoinToss } from "./data/quantum-coin-toss";
import { quantumMeasurement } from "./data/quantum-measurement";
import { resistanceWire } from "./data/resistance-wire";
import { rutherfordScattering } from "./data/rutherford-scattering";
import { statesOfMatterBasics } from "./data/states-of-matter-basics";
import { vectorAddition } from "./data/vector-addition";
import { waveOnString } from "./data/wave-on-string";
import { wavesIntro } from "./data/waves-intro";

// Wave 9 — AP Chemistry Core (C-08 to C-17)
import { balancingChemicalEquations } from "./data/balancing-chemical-equations";
import { electronConfiguration } from "./data/electron-configuration";
import { lewisStructures } from "./data/lewis-structures";
import { beersLawLab } from "./data/beers-law-lab";
import { solutionsDilutions } from "./data/solutions-dilutions";
import { stoichiometry } from "./data/stoichiometry";
import { calorimetry } from "./data/calorimetry";
import { gasProperties } from "./data/gas-properties";
import { buildAMolecule } from "./data/build-a-molecule";
import { molecularPolarity } from "./data/molecular-polarity";

// Wave 10 — Earth Science NGSS (ES-06 to ES-18)
import { greenhouseEffect } from "./data/greenhouse-effect";
import { radiometricDating } from "./data/radiometric-dating";
import { atmosphereLayers } from "./data/atmosphere-layers";
import { solarSystemScale } from "./data/solar-system-scale";
import { seismicWaves } from "./data/seismic-waves";
import { rockCycle } from "./data/rock-cycle";
import { climateChangeModeling } from "./data/climate-change-modeling";
import { starLifeCycle } from "./data/star-life-cycle";
import { soilFormation } from "./data/soil-formation";
import { tidesLunarGravity } from "./data/tides-lunar-gravity";
import { glaciersIceAges } from "./data/glaciers-ice-ages";
import { plateTectonicsAdvanced } from "./data/plate-tectonics-advanced";

// Wave 11 — Biology AP (B-11 to B-16)
import { immuneSystem } from "./data/immune-system";
import { populationDynamics } from "./data/population-dynamics";
import { ecologicalSuccession } from "./data/ecological-succession";
import { evidenceOfEvolution } from "./data/evidence-of-evolution";
import { hardyWeinberg } from "./data/hardy-weinberg";
import { cellStructure3d } from "./data/cell-structure-3d";

// Wave 11 — K5 Extensions (K5-12 to K5-19)
import { k5ChemicalChanges } from "./data/k5-chemical-changes";
import { k5MixturesSolutions } from "./data/k5-mixtures-solutions";
import { k5WeatherPatterns } from "./data/k5-weather-patterns";
import { k5LandformsErosion } from "./data/k5-landforms-erosion";
import { k5StarsSpace } from "./data/k5-stars-space";
import { k5PlantLifeCycle } from "./data/k5-plant-life-cycle";
import { k5AnimalAdaptations } from "./data/k5-animal-adaptations";
import { k5SolarEnergy } from "./data/k5-solar-energy";

// Wave 11 — Middle School Extensions (MS-10 to MS-17)
import { msChemicalBonding } from "./data/ms-chemical-bonding";
import { msAcidBaseReactions } from "./data/ms-acid-base-reactions";
import { msEarthquakeEpicenter } from "./data/ms-earthquake-epicenter";
import { msMoonPhasesDetailed } from "./data/ms-moon-phases-detailed";
import { msCellDivisionComparison } from "./data/ms-cell-division-comparison";
import { msFoodWebDynamics } from "./data/ms-food-web-dynamics";
import { msElectricCircuitsAdvanced } from "./data/ms-electric-circuits-advanced";
import { msWaveInteractionsAdvanced } from "./data/ms-wave-interactions-advanced";

// Wave 12 — AP Physics C (P-83 to P-87)
import { gaussLaw } from "./data/gauss-law";
import { amperesLaw } from "./data/amperes-law";
import { rlcCircuit } from "./data/rlc-circuit";
import { rotationalKinematicsAdvanced } from "./data/rotational-kinematics-advanced";
import { angularMomentum3d } from "./data/angular-momentum-3d";

// Wave 12 — P2 Batch
import { oceanCurrents } from "./data/ocean-currents";
import { msChemicalStoichiometry } from "./data/ms-chemical-stoichiometry";
import { msGeneticsPunnett } from "./data/ms-genetics-punnett";
import { msForceMotionGraphs } from "./data/ms-force-motion-graphs";
import { photosynthesisLightReactions } from "./data/photosynthesis-light-reactions";
import { cellularRespirationDetail } from "./data/cellular-respiration-detail";
import { dnaReplicationDetail } from "./data/dna-replication-detail";
import { proteinSynthesis3d } from "./data/protein-synthesis-3d";
import { moonGeology } from "./data/moon-geology";
import { waterCycleDetail } from "./data/water-cycle-detail";
import { mineralIdentification } from "./data/mineral-identification";
import { volcanoEruptionTypes } from "./data/volcano-eruption-types";
import { k5SoundVibration } from "./data/k5-sound-vibration";
import { k5PlantNeeds } from "./data/k5-plant-needs";
import { k5WeatherMeasurement } from "./data/k5-weather-measurement";
import { k5Habitats } from "./data/k5-habitats";

const experiments: Experiment[] = [
  // Wave 1 — Original 4
  newtonsLaws,
  projectileMotion,
  emSpectrum,
  rollerCoaster,
  // Wave 2 — AP Physics core (P-01 to P-05)
  simpleHarmonicMotion,
  momentumCollisions,
  lorentzForce,
  electricFieldLines,
  waveInterference,
  // Wave 2 — AP Physics extended (P-06 to P-09)
  circularMotion,
  rotationalMotion,
  gravitationalFields,
  fluidStatics,
  // Wave 3 — AP Biology (B-01 to B-10)
  dnaDoubleHelix,
  proteinSynthesis,
  mitosis,
  meiosis,
  cellularRespiration,
  photosynthesis,
  enzymeKinetics,
  neuronActionPotential,
  membraneTransport,
  naturalSelection,
  // Wave 4 — AP Chemistry (C-01 to C-07)
  molecularBonding,
  reactionKinetics,
  thermochemistry,
  chemicalEquilibrium,
  atomicStructure,
  acidBasePh,
  electrochemistry,
  // Wave 5 — Elementary K-5 (K5-01 to K5-11)
  k5ForceMotion,
  k5StatesOfMatter,
  k5LightPropagation,
  k5SoundWaves,
  k5SimpleMachines,
  k5EnergyConversion,
  k5FoodChain,
  k5WaterCycle,
  k5DayNightSeasons,
  k5MoonPhases,
  k5Magnetism,
  // Wave 6 — Middle School 6-8 (MS-01 to MS-09)
  msNewtonsLaws,
  msEnergyConservation,
  msChemicalReactions,
  msAtomsMolecules,
  msPlateTectonics,
  msPhotosynthesisRespiration,
  msGenetics,
  msEcosystems,
  msWeatherSystems,
  // Wave 7 — AP Physics gap-fill (14 experiments)
  dcCircuitsBasic,
  geometricOpticsLenses,
  photoelectricEffect,
  idealGasThermodynamics,
  electromagneticInduction,
  electricPotentialVoltage,
  capacitorsRcCircuits,
  bernoulliFluidDynamics,
  workEnergyTheorem,
  kinematicsGraphs,
  nuclearDecay,
  dopplerEffect,
  singleSlitDiffraction,
  heatEngines,
  // Wave 8 — 50 AP Physics HTML experiments
  acCircuits,
  atomicInteractions,
  balancingAct,
  balloonsStaticElectricity,
  bendingLight,
  blackbodySpectrum,
  buildANucleus,
  buoyancy,
  buoyancyBasics,
  calculusGrapher,
  circuitAcVirtualLab,
  circuitDcVirtualLab,
  colorVision,
  coulombsLaw,
  curveFitting,
  densityLab,
  diffusion,
  energySkateParkBasics,
  faradaysElectromagneticLab,
  forcesMotionBasics,
  fourierMakingWaves,
  frictionLab,
  gasesIntro,
  generator,
  geometricOpticsBasics,
  gravityForceLabBasics,
  gravityOrbits,
  hookesLaw,
  johnTravoltage,
  keplersLaws,
  magnetsAndElectromagnets,
  massesSprings,
  massesSpringsBasics,
  modelsHydrogenAtom,
  moleculesAndLight,
  mySolarSystem,
  normalModes,
  ohmsLaw,
  pendulumLab,
  plinkoProbability,
  pressureLab,
  projectileDataLab,
  quantumCoinToss,
  quantumMeasurement,
  resistanceWire,
  rutherfordScattering,
  statesOfMatterBasics,
  vectorAddition,
  waveOnString,
  wavesIntro,
  // Wave 9 — AP Chemistry Core (C-08 to C-17)
  balancingChemicalEquations,
  electronConfiguration,
  lewisStructures,
  beersLawLab,
  solutionsDilutions,
  stoichiometry,
  calorimetry,
  gasProperties,
  buildAMolecule,
  molecularPolarity,
  // Wave 10 — Earth Science NGSS (ES-06 to ES-18)
  greenhouseEffect,
  radiometricDating,
  atmosphereLayers,
  solarSystemScale,
  seismicWaves,
  rockCycle,
  climateChangeModeling,
  starLifeCycle,
  soilFormation,
  tidesLunarGravity,
  glaciersIceAges,
  plateTectonicsAdvanced,
  // Wave 11 — Biology AP (B-11 to B-16)
  immuneSystem,
  populationDynamics,
  ecologicalSuccession,
  evidenceOfEvolution,
  hardyWeinberg,
  cellStructure3d,
  // Wave 11 — K5 Extensions
  k5ChemicalChanges,
  k5MixturesSolutions,
  k5WeatherPatterns,
  k5LandformsErosion,
  k5StarsSpace,
  k5PlantLifeCycle,
  k5AnimalAdaptations,
  k5SolarEnergy,
  // Wave 11 — Middle School Extensions
  msChemicalBonding,
  msAcidBaseReactions,
  msEarthquakeEpicenter,
  msMoonPhasesDetailed,
  msCellDivisionComparison,
  msFoodWebDynamics,
  msElectricCircuitsAdvanced,
  msWaveInteractionsAdvanced,
  // Wave 12 — AP Physics C
  gaussLaw,
  amperesLaw,
  rlcCircuit,
  rotationalKinematicsAdvanced,
  angularMomentum3d,
  // Wave 12 — P2 Batch
  oceanCurrents,
  msChemicalStoichiometry,
  msGeneticsPunnett,
  msForceMotionGraphs,
  photosynthesisLightReactions,
  cellularRespirationDetail,
  dnaReplicationDetail,
  proteinSynthesis3d,
  moonGeology,
  waterCycleDetail,
  mineralIdentification,
  volcanoEruptionTypes,
  k5SoundVibration,
  k5PlantNeeds,
  k5WeatherMeasurement,
  k5Habitats,
];

export function getAllExperiments(): Experiment[] {
  return experiments;
}

export function getExperiment(id: string): Experiment | undefined {
  return experiments.find((e) => e.id === id);
}

export function getExperimentBySlug(slug: string): Experiment | undefined {
  return experiments.find((e) => e.slug === slug);
}

export function getExperimentsByCategory(
  category: PhysicsCategory
): Experiment[] {
  return experiments.filter((e) => e.category === category);
}

export function getExperimentsByTier(tier: Tier): Experiment[] {
  return experiments.filter((e) => e.tier === tier);
}

export function getExperimentsByWave(wave: Wave): Experiment[] {
  return experiments.filter((e) => e.wave === wave);
}

export function getExperimentsBySubject(subject: Subject): Experiment[] {
  return experiments.filter((e) => e.subject === subject);
}

export function getExperimentsByGradeLevel(
  gradeLevel: GradeLevel
): Experiment[] {
  return experiments.filter((e) => e.gradeLevel === gradeLevel);
}

export function getExperimentsByStandard(
  standard: PrimaryStandard
): Experiment[] {
  return experiments.filter((e) => e.primaryStandard === standard);
}

export function getStandardsForSubject(
  subject: Subject
): PrimaryStandard[] {
  const standards = new Set<PrimaryStandard>();
  for (const e of experiments) {
    if (e.subject === subject) {
      standards.add(e.primaryStandard);
    }
  }
  return Array.from(standards);
}

export function getAllSubjectsWithCounts(
  gradeLevel?: GradeLevel
): Array<{
  subject: Subject;
  count: number;
}> {
  const counts = new Map<Subject, number>();
  for (const e of experiments) {
    if (e.subject) {
      if (gradeLevel && e.gradeLevel !== gradeLevel) continue;
      counts.set(e.subject, (counts.get(e.subject) || 0) + 1);
    }
  }
  return Array.from(counts.entries()).map(([subject, count]) => ({
    subject,
    count,
  }));
}

export async function getAllExperimentsAsync(): Promise<Experiment[]> {
  const bySubject = await Promise.all(
    SUBJECT_LIST.map((subject) => getExperimentsBySubjectAsync(subject))
  );

  return bySubject.flat();
}
