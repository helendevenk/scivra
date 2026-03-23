import { describe, it, expect } from "vitest";
import {
  calculateAcceleration,
  calculateVelocity,
  calculateDisplacement,
  calculateKineticEnergy,
  calculatePotentialEnergy,
  calculateMomentum,
} from "@/shared/lib/physics/mechanics";
import {
  calculateProjectilePosition,
  calculateProjectileVelocity,
  calculateMaxHeight,
  calculateRange,
  calculateFlightTime,
} from "@/shared/lib/physics/projectile";
import {
  calculateTotalEnergy,
  calculateVelocityFromEnergy,
  calculateHeightFromEnergy,
  simulateRollerCoasterPoint,
} from "@/shared/lib/physics/energy";
import {
  calculateFrequency,
  calculateWavelength,
  calculatePhotonEnergy,
  calculatePhotonEnergyEv,
  getWaveBandName,
} from "@/shared/lib/physics/waves";

// Constants matching source files
const G = 9.8;
const SPEED_OF_LIGHT = 3e8;
const PLANCK_CONSTANT = 6.626e-34;
const EV_PER_JOULE = 1 / 1.602e-19;

describe("mechanics.ts", () => {
  // Test 1: F=10, m=2 returns 5
  it("calculateAcceleration: F=10, m=2 returns 5", () => {
    expect(calculateAcceleration(10, 2)).toBe(5);
  });

  // Test 2: mass 0 returns 0
  it("calculateAcceleration: mass 0 returns 0", () => {
    expect(calculateAcceleration(10, 0)).toBe(0);
  });

  // Test 3: NaN input returns 0
  it("calculateAcceleration: NaN input returns 0", () => {
    expect(calculateAcceleration(NaN, 2)).toBe(0);
    expect(calculateAcceleration(10, NaN)).toBe(0);
  });

  // Test 4: v0=0, a=10, dt=2 returns 20
  it("calculateVelocity: v0=0, a=10, dt=2 returns 20", () => {
    expect(calculateVelocity(0, 10, 2)).toBe(20);
  });

  // Test 5: s0=0, v=5, dt=3 returns 15
  it("calculateDisplacement: s0=0, v=5, dt=3 returns 15", () => {
    expect(calculateDisplacement(0, 5, 3)).toBe(15);
  });

  // Test 6: m=2, v=3 returns 9
  it("calculateKineticEnergy: m=2, v=3 returns 9", () => {
    expect(calculateKineticEnergy(2, 3)).toBe(9);
  });

  // Test 7: negative mass returns 0
  it("calculateKineticEnergy: negative mass returns 0", () => {
    expect(calculateKineticEnergy(-1, 3)).toBe(0);
  });

  // Test 8: m=1, g=9.8, h=10 returns 98
  it("calculatePotentialEnergy: m=1, g=9.8, h=10 returns 98", () => {
    expect(calculatePotentialEnergy(1, 9.8, 10)).toBeCloseTo(98, 5);
  });

  // Test 9: m=5, v=4 returns 20
  it("calculateMomentum: m=5, v=4 returns 20", () => {
    expect(calculateMomentum(5, 4)).toBe(20);
  });
});

describe("projectile.ts", () => {
  const angle45 = Math.PI / 4;

  // Test 10: known angle/velocity/time
  it("calculateProjectilePosition: known angle/velocity/time", () => {
    const v0 = 20;
    const t = 1;
    const pos = calculateProjectilePosition(v0, angle45, t);
    const expectedX = v0 * Math.cos(angle45) * t;
    const expectedY = v0 * Math.sin(angle45) * t - 0.5 * G * t * t;
    expect(pos.x).toBeCloseTo(expectedX, 5);
    expect(pos.y).toBeCloseTo(expectedY, 5);
  });

  // Test 11: y clamped to 0 (no underground)
  it("calculateProjectilePosition: y clamped to 0", () => {
    // Large time so projectile has hit ground
    const pos = calculateProjectilePosition(10, angle45, 100);
    expect(pos.y).toBe(0);
  });

  // Test 12: v0=0 returns origin
  it("calculateProjectilePosition: v0=0 returns origin", () => {
    const pos = calculateProjectilePosition(0, angle45, 5);
    expect(pos.x).toBe(0);
    expect(pos.y).toBe(0);
  });

  // Test 13: correct vx/vy components
  it("calculateProjectileVelocity: correct vx/vy components", () => {
    const v0 = 20;
    const t = 1;
    const vel = calculateProjectileVelocity(v0, angle45, t);
    expect(vel.vx).toBeCloseTo(v0 * Math.cos(angle45), 5);
    expect(vel.vy).toBeCloseTo(v0 * Math.sin(angle45) - G * t, 5);
  });

  // Test 14: 45 degree max height
  it("calculateMaxHeight: 45 degree angle", () => {
    const v0 = 20;
    const vy = v0 * Math.sin(angle45);
    const expected = (vy * vy) / (2 * G);
    expect(calculateMaxHeight(v0, angle45)).toBeCloseTo(expected, 5);
  });

  // Test 15: 45 degree optimal range
  it("calculateRange: 45 degree optimal range", () => {
    const v0 = 20;
    const expected = (v0 * v0 * Math.sin(2 * angle45)) / G;
    expect(calculateRange(v0, angle45)).toBeCloseTo(expected, 5);
  });

  // Test 16: correct total flight time
  it("calculateFlightTime: correct total time", () => {
    const v0 = 20;
    const expected = (2 * v0 * Math.sin(angle45)) / G;
    expect(calculateFlightTime(v0, angle45)).toBeCloseTo(expected, 5);
  });
});

describe("energy.ts", () => {
  // Test 17: KE + PE sum
  it("calculateTotalEnergy: KE + PE sum", () => {
    const m = 2;
    const v = 5;
    const h = 10;
    const expected = 0.5 * m * v * v + m * G * h;
    expect(calculateTotalEnergy(m, v, h)).toBeCloseTo(expected, 5);
  });

  // Test 18: derives velocity correctly
  it("calculateVelocityFromEnergy: derives velocity correctly", () => {
    const m = 2;
    const h = 5;
    const totalE = m * G * 10; // from rest at h=10
    const ke = totalE - m * G * h;
    const expected = Math.sqrt((2 * ke) / m);
    expect(calculateVelocityFromEnergy(totalE, m, h)).toBeCloseTo(expected, 5);
  });

  // Test 19: returns 0 when KE would be negative
  it("calculateVelocityFromEnergy: returns 0 when KE negative", () => {
    // totalEnergy < m*g*h means KE < 0
    expect(calculateVelocityFromEnergy(10, 2, 100)).toBe(0);
  });

  // Test 20: derives height correctly
  it("calculateHeightFromEnergy: derives height correctly", () => {
    const m = 2;
    const v = 3;
    const totalE = 200;
    const pe = totalE - 0.5 * m * v * v;
    const expected = pe / (m * G);
    expect(calculateHeightFromEnergy(totalE, m, v)).toBeCloseTo(expected, 5);
  });

  // Test 21: energy conservation maintained
  it("simulateRollerCoasterPoint: energy conservation maintained", () => {
    const m = 5;
    const h0 = 20;
    const hCurrent = 10;
    const result = simulateRollerCoasterPoint(m, h0, hCurrent);
    expect(result.totalEnergy).toBeCloseTo(m * G * h0, 5);
    expect(result.ke + result.pe).toBeCloseTo(result.totalEnergy, 5);
    expect(result.velocity).toBeGreaterThan(0);
  });

  // Test 22: returns zero struct for invalid inputs
  it("simulateRollerCoasterPoint: returns zero struct for invalid inputs", () => {
    const result = simulateRollerCoasterPoint(-1, 10, 5);
    expect(result).toEqual({ velocity: 0, ke: 0, pe: 0, totalEnergy: 0 });
  });
});

describe("waves.ts", () => {
  // Test 23: f = c / wavelength
  it("calculateFrequency: f = c / wavelength", () => {
    const wavelength = 500e-9; // 500nm visible light
    expect(calculateFrequency(wavelength)).toBeCloseTo(
      SPEED_OF_LIGHT / wavelength,
      0
    );
  });

  // Test 24: wavelength=0 returns 0
  it("calculateFrequency: wavelength=0 returns 0", () => {
    expect(calculateFrequency(0)).toBe(0);
  });

  // Test 25: inverse of frequency
  it("calculateWavelength: inverse of frequency", () => {
    const freq = 6e14; // visible light frequency
    expect(calculateWavelength(freq)).toBeCloseTo(SPEED_OF_LIGHT / freq, 15);
  });

  // Test 26: E = hf
  it("calculatePhotonEnergy: E = hf", () => {
    const freq = 6e14;
    expect(calculatePhotonEnergy(freq)).toBeCloseTo(
      PLANCK_CONSTANT * freq,
      40
    );
  });

  // Test 27: correct eV conversion
  it("calculatePhotonEnergyEv: correct eV conversion", () => {
    const freq = 6e14;
    const energyJ = PLANCK_CONSTANT * freq;
    const expectedEv = energyJ * EV_PER_JOULE;
    expect(calculatePhotonEnergyEv(freq)).toBeCloseTo(expectedEv, 5);
  });

  // Test 28: visible light range (380-700nm)
  it("getWaveBandName: visible light range (380-700nm)", () => {
    expect(getWaveBandName(500e-9)).toBe("Visible Light");
    expect(getWaveBandName(380e-9)).toBe("Visible Light");
    expect(getWaveBandName(700e-9)).toBe("Visible Light");
  });

  // Test 29: radio waves (> 1m)
  it("getWaveBandName: radio waves (> 1m)", () => {
    expect(getWaveBandName(10)).toBe("Radio Waves");
    expect(getWaveBandName(1.5)).toBe("Radio Waves");
  });

  // Test 30: invalid input returns Unknown
  it("getWaveBandName: invalid input returns Unknown", () => {
    expect(getWaveBandName(-1)).toBe("Unknown");
    expect(getWaveBandName(0)).toBe("Unknown");
    expect(getWaveBandName(NaN)).toBe("Unknown");
  });
});
