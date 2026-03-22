import type { BatchPromptConfig } from '../types';
import { p0MotionConfigs } from './p0-motion';

/**
 * Load all prompt configurations.
 * Add new config modules here as they're created.
 */
export function loadPromptConfigs(): BatchPromptConfig[] {
  return [
    ...p0MotionConfigs,
    // TODO: Add more config modules as they're created
    // ...p0WavesConfigs,
    // ...p0ElectroConfigs,
    // ...p0ThermoConfigs,
    // ...p0UpgradesConfigs,
    // ...p1Configs,
    // ...p2Configs,
  ];
}
