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

const experiments: Experiment[] = [
  newtonsLaws,
  projectileMotion,
  emSpectrum,
  rollerCoaster,
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
