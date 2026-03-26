/**
 * Scivra - Energy Conservation Physics Engine
 * Pure functions for energy conservation calculations (roller coaster).
 */

const G = 9.8; // m/s²

function isValid(...values: number[]): boolean {
  return values.every((v) => typeof v === "number" && !Number.isNaN(v));
}

/** Total mechanical energy: E = KE + PE = 0.5*m*v² + m*g*h */
export function calculateTotalEnergy(
  mass: number,
  velocity: number,
  height: number
): number {
  if (!isValid(mass, velocity, height) || mass <= 0 || height < 0) return 0;
  return 0.5 * mass * velocity * velocity + mass * G * height;
}

/** Derive velocity from energy conservation: v = sqrt(2*(E - m*g*h) / m) */
export function calculateVelocityFromEnergy(
  totalEnergy: number,
  mass: number,
  height: number
): number {
  if (!isValid(totalEnergy, mass, height) || mass <= 0 || totalEnergy < 0)
    return 0;
  const ke = totalEnergy - mass * G * height;
  if (ke <= 0) return 0;
  return Math.sqrt((2 * ke) / mass);
}

/** Derive max height from energy conservation: h = (E - 0.5*m*v²) / (m*g) */
export function calculateHeightFromEnergy(
  totalEnergy: number,
  mass: number,
  velocity: number
): number {
  if (!isValid(totalEnergy, mass, velocity) || mass <= 0 || totalEnergy < 0)
    return 0;
  const pe = totalEnergy - 0.5 * mass * velocity * velocity;
  if (pe <= 0) return 0;
  return pe / (mass * G);
}

/** Simulate a roller coaster point given initial height (starting from rest) */
export function simulateRollerCoasterPoint(
  mass: number,
  initialHeight: number,
  currentHeight: number
): { velocity: number; ke: number; pe: number; totalEnergy: number } {
  const zero = { velocity: 0, ke: 0, pe: 0, totalEnergy: 0 };
  if (!isValid(mass, initialHeight, currentHeight) || mass <= 0) return zero;

  const totalEnergy = mass * G * initialHeight;
  const pe = mass * G * currentHeight;
  const ke = totalEnergy - pe;

  if (ke < 0) return { velocity: 0, ke: 0, pe: totalEnergy, totalEnergy };

  const velocity = Math.sqrt((2 * ke) / mass);
  return { velocity, ke, pe, totalEnergy };
}
