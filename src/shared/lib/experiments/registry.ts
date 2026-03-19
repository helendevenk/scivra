import type {
  Experiment,
  PhysicsCategory,
  Tier,
  Wave,
} from "@/shared/types/experiment";
import { newtonsLaws } from "./data/newtons-laws";
import { projectileMotion } from "./data/projectile-motion";
import { emSpectrum } from "./data/em-spectrum";
import { rollerCoaster } from "./data/roller-coaster";
// Wave 2 — AP Physics (P-01 to P-05)
import { simpleHarmonicMotion } from "./data/simple-harmonic-motion";
import { momentumCollisions } from "./data/momentum-collisions";
import { lorentzForce } from "./data/lorentz-force";
import { electricFieldLines } from "./data/electric-field-lines";
import { waveInterference } from "./data/wave-interference";
// Wave 2 — AP Physics (P-06 to P-09)
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
// Wave 4 — AP Chemistry (C-01 to C-07)
import { molecularBonding } from "./data/molecular-bonding";
import { reactionKinetics } from "./data/reaction-kinetics";
import { thermochemistry } from "./data/thermochemistry";
import { chemicalEquilibrium } from "./data/chemical-equilibrium";
import { atomicStructure } from "./data/atomic-structure";
import { acidBasePh } from "./data/acid-base-ph";
import { electrochemistry } from "./data/electrochemistry";

const experiments: Experiment[] = [
  // Wave 1 — original 4
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
