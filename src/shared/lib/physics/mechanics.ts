/**
 * SeePhysics - Mechanics Physics Engine
 * Pure functions for classical mechanics calculations.
 * All functions handle invalid inputs gracefully (return 0).
 */

function isValid(...values: number[]): boolean {
  return values.every((v) => typeof v === "number" && !Number.isNaN(v));
}

/** a = F / m */
export function calculateAcceleration(force: number, mass: number): number {
  if (!isValid(force, mass) || mass <= 0) return 0;
  return force / mass;
}

/** v = v0 + a * dt */
export function calculateVelocity(
  v0: number,
  acceleration: number,
  dt: number
): number {
  if (!isValid(v0, acceleration, dt)) return 0;
  return v0 + acceleration * dt;
}

/** s = s0 + v * dt */
export function calculateDisplacement(
  s0: number,
  velocity: number,
  dt: number
): number {
  if (!isValid(s0, velocity, dt)) return 0;
  return s0 + velocity * dt;
}

/** KE = 0.5 * m * v^2 */
export function calculateKineticEnergy(
  mass: number,
  velocity: number
): number {
  if (!isValid(mass, velocity) || mass < 0) return 0;
  return 0.5 * mass * velocity * velocity;
}

/** PE = m * g * h */
export function calculatePotentialEnergy(
  mass: number,
  gravity: number,
  height: number
): number {
  if (!isValid(mass, gravity, height) || mass < 0 || height < 0) return 0;
  return mass * gravity * height;
}

/** p = m * v */
export function calculateMomentum(mass: number, velocity: number): number {
  if (!isValid(mass, velocity) || mass <= 0) return 0;
  return mass * velocity;
}
