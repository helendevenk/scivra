/**
 * Scivra - Waves Physics Engine
 * Pure functions for wave and electromagnetic calculations.
 */

const SPEED_OF_LIGHT = 3e8; // m/s
const PLANCK_CONSTANT = 6.626e-34; // J·s
const EV_PER_JOULE = 1 / 1.602e-19; // eV/J

function isValid(...values: number[]): boolean {
  return values.every((v) => typeof v === "number" && !Number.isNaN(v));
}

/** f = c / λ */
export function calculateFrequency(wavelength: number): number {
  if (!isValid(wavelength) || wavelength <= 0) return 0;
  return SPEED_OF_LIGHT / wavelength;
}

/** λ = c / f */
export function calculateWavelength(frequency: number): number {
  if (!isValid(frequency) || frequency <= 0) return 0;
  return SPEED_OF_LIGHT / frequency;
}

/** E = hf (in Joules) */
export function calculatePhotonEnergy(frequency: number): number {
  if (!isValid(frequency) || frequency <= 0) return 0;
  return PLANCK_CONSTANT * frequency;
}

/** E in electron-volts */
export function calculatePhotonEnergyEv(frequency: number): number {
  const energyJ = calculatePhotonEnergy(frequency);
  if (energyJ === 0) return 0;
  return energyJ * EV_PER_JOULE;
}

/** Classify wavelength into EM spectrum band */
export function getWaveBandName(wavelength: number): string {
  if (!isValid(wavelength) || wavelength <= 0) return "Unknown";

  if (wavelength > 1) return "Radio Waves";
  if (wavelength > 1e-3) return "Microwaves";
  if (wavelength > 700e-9) return "Infrared";
  if (wavelength >= 380e-9) return "Visible Light";
  if (wavelength > 10e-9) return "Ultraviolet";
  if (wavelength > 0.01e-9) return "X-rays";
  return "Gamma Rays";
}
