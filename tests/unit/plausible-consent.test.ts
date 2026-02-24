import { describe, it, expect } from 'vitest';
import {
  shouldEnablePlausible,
  isEeaOrUk,
} from '@/extensions/analytics/plausible-consent';

describe('shouldEnablePlausible', () => {
  it('enables for non-EEA regions regardless of consent', () => {
    expect(shouldEnablePlausible({ regionCode: 'US', consentDecision: null })).toBe(true);
    expect(shouldEnablePlausible({ regionCode: 'JP', consentDecision: 'reject' })).toBe(true);
    expect(shouldEnablePlausible({ regionCode: 'CN', consentDecision: null })).toBe(true);
  });

  it('enables for null region', () => {
    expect(shouldEnablePlausible({ regionCode: null, consentDecision: null })).toBe(true);
  });

  it('enables for EEA region with accept', () => {
    expect(shouldEnablePlausible({ regionCode: 'DE', consentDecision: 'accept' })).toBe(true);
    expect(shouldEnablePlausible({ regionCode: 'FR', consentDecision: 'accept' })).toBe(true);
  });

  it('disables for EEA region without accept', () => {
    expect(shouldEnablePlausible({ regionCode: 'DE', consentDecision: null })).toBe(false);
    expect(shouldEnablePlausible({ regionCode: 'FR', consentDecision: 'reject' })).toBe(false);
  });

  it('disables for UK without accept', () => {
    expect(shouldEnablePlausible({ regionCode: 'GB', consentDecision: null })).toBe(false);
    expect(shouldEnablePlausible({ regionCode: 'UK', consentDecision: 'reject' })).toBe(false);
  });

  it('handles case-insensitive region codes', () => {
    expect(shouldEnablePlausible({ regionCode: 'de', consentDecision: null })).toBe(false);
    expect(shouldEnablePlausible({ regionCode: 'us', consentDecision: null })).toBe(true);
  });
});

describe('isEeaOrUk', () => {
  it('returns true for EEA countries', () => {
    expect(isEeaOrUk('DE')).toBe(true);
    expect(isEeaOrUk('FR')).toBe(true);
    expect(isEeaOrUk('NL')).toBe(true);
  });

  it('returns true for UK', () => {
    expect(isEeaOrUk('GB')).toBe(true);
    expect(isEeaOrUk('UK')).toBe(true);
  });

  it('returns false for non-EEA', () => {
    expect(isEeaOrUk('US')).toBe(false);
    expect(isEeaOrUk('CN')).toBe(false);
  });

  it('returns false for null', () => {
    expect(isEeaOrUk(null)).toBe(false);
  });

  it('handles lowercase', () => {
    expect(isEeaOrUk('de')).toBe(true);
    expect(isEeaOrUk('us')).toBe(false);
  });
});
