/**
 * NeonPhysics - Projectile Motion Physics Engine
 * Pure functions for projectile motion calculations (no air resistance).
 */

const G = 9.8; // m/s²

function isValid(...values: number[]): boolean {
  return values.every((v) => typeof v === "number" && !Number.isNaN(v));
}

/** Position at time t */
export function calculateProjectilePosition(
  v0: number,
  angle: number,
  t: number
): { x: number; y: number } {
  if (!isValid(v0, angle, t) || v0 < 0) return { x: 0, y: 0 };
  const vx = v0 * Math.cos(angle);
  const vy = v0 * Math.sin(angle);
  const x = vx * t;
  const y = vy * t - 0.5 * G * t * t;
  return { x, y: Math.max(0, y) };
}

/** Velocity components at time t */
export function calculateProjectileVelocity(
  v0: number,
  angle: number,
  t: number
): { vx: number; vy: number } {
  if (!isValid(v0, angle, t) || v0 < 0) return { vx: 0, vy: 0 };
  return {
    vx: v0 * Math.cos(angle),
    vy: v0 * Math.sin(angle) - G * t,
  };
}

/** Maximum height: h = (v0*sin(θ))^2 / (2g) */
export function calculateMaxHeight(v0: number, angle: number): number {
  if (!isValid(v0, angle) || v0 < 0) return 0;
  const vy = v0 * Math.sin(angle);
  return (vy * vy) / (2 * G);
}

/** Range: R = v0^2 * sin(2θ) / g */
export function calculateRange(v0: number, angle: number): number {
  if (!isValid(v0, angle) || v0 < 0) return 0;
  return (v0 * v0 * Math.sin(2 * angle)) / G;
}

/** Total flight time: T = 2*v0*sin(θ) / g */
export function calculateFlightTime(v0: number, angle: number): number {
  if (!isValid(v0, angle) || v0 < 0) return 0;
  return (2 * v0 * Math.sin(angle)) / G;
}
