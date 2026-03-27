import { describe, it, expect } from 'vitest';
import {
  calculateFrequency,
  calculateWavelength,
  calculatePhotonEnergy,
  calculatePhotonEnergyEv,
  getWaveBandName,
} from '@/shared/lib/physics/waves';

describe('calculateFrequency', () => {
  it('returns f = c/λ for valid wavelength', () => {
    expect(calculateFrequency(550e-9)).toBeCloseTo(5.45e14, -12);
  });
  it('returns 0 for zero wavelength', () => { expect(calculateFrequency(0)).toBe(0); });
  it('returns 0 for negative', () => { expect(calculateFrequency(-1)).toBe(0); });
  it('returns 0 for NaN', () => { expect(calculateFrequency(NaN)).toBe(0); });
});

describe('calculateWavelength', () => {
  it('returns λ = c/f for valid frequency', () => {
    const wl = calculateWavelength(5.45e14);
    expect(wl).toBeGreaterThan(540e-9);
    expect(wl).toBeLessThan(560e-9);
  });
  it('returns 0 for zero frequency', () => { expect(calculateWavelength(0)).toBe(0); });
  it('returns 0 for negative', () => { expect(calculateWavelength(-1)).toBe(0); });
});

describe('calculatePhotonEnergy', () => {
  it('returns E = hf for valid frequency', () => {
    expect(calculatePhotonEnergy(5e14)).toBeCloseTo(3.313e-19, 22);
  });
  it('returns 0 for zero', () => { expect(calculatePhotonEnergy(0)).toBe(0); });
});

describe('calculatePhotonEnergyEv', () => {
  it('converts to eV', () => {
    expect(calculatePhotonEnergyEv(5e14)).toBeCloseTo(2.069, 2);
  });
  it('returns 0 for invalid', () => { expect(calculatePhotonEnergyEv(0)).toBe(0); });
});

describe('getWaveBandName', () => {
  it('radio waves', () => { expect(getWaveBandName(10)).toBe('Radio Waves'); });
  it('microwaves', () => { expect(getWaveBandName(0.01)).toBe('Microwaves'); });
  it('infrared', () => { expect(getWaveBandName(1e-6)).toBe('Infrared'); });
  it('visible light', () => { expect(getWaveBandName(550e-9)).toBe('Visible Light'); });
  it('ultraviolet', () => { expect(getWaveBandName(100e-9)).toBe('Ultraviolet'); });
  it('x-rays', () => { expect(getWaveBandName(1e-10)).toBe('X-rays'); });
  it('gamma rays', () => { expect(getWaveBandName(1e-13)).toBe('Gamma Rays'); });
  it('unknown for invalid', () => { expect(getWaveBandName(-1)).toBe('Unknown'); });
  it('unknown for NaN', () => { expect(getWaveBandName(NaN)).toBe('Unknown'); });
});
