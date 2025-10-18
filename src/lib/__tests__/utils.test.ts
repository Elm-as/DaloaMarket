import { describe, it, expect } from 'vitest';
import { formatPrice, validateIvorianPhone, cn } from '../utils';

describe('utils', () => {
  it('formatPrice should format numbers correctly', () => {
  // Normalize whitespace (including non-breaking spaces) before comparing
  const normalize = (s: string) => s.replace(/\s+/g, '');
  expect(normalize(formatPrice(1500))).toBe('1500FCFA');
  expect(normalize(formatPrice(0))).toBe('0FCFA');
  expect(normalize(formatPrice(1234567))).toBe('1234567FCFA');
  });

  it('validateIvorianPhone should validate common formats', () => {
    expect(validateIvorianPhone('07 00 00 00')).toBe(false);
    expect(validateIvorianPhone('07 000000')).toBe(false);
    // utils expects 10 digits for local numbers
    expect(validateIvorianPhone('0700000000')).toBe(true);
  // With country code +225 followed by 10 digits -> total 13 digits
  // Example: local number '0700000000' -> +2250700000000
  expect(validateIvorianPhone('+2250700000000')).toBe(true);
  });

  it('cn should concatenate class names', () => {
  expect(cn('a', null, 'c')).toBe('a c');
    expect(cn(null, undefined, 'd')).toBe('d');
  });
});
