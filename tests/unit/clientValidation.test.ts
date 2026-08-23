import { describe, expect, it } from 'vitest';
import {
  validateClientInput,
  validateEmail,
  validateOib,
  validatePhone,
} from '../../src/lib/clientValidation';

describe('client validation (BD-T001–T003)', () => {
  it('accepts local@domain with a dot in the domain', () => {
    expect(validateEmail('ada@bank.example')).toBe(true);
    expect(validateEmail(' ada@bank.example ')).toBe(true);
  });

  it('rejects email that is not local@domain with a dotted domain', () => {
    expect(validateEmail('')).toBe(false);
    expect(validateEmail('nodomain')).toBe(false);
    expect(validateEmail('a@localhost')).toBe(false);
    expect(validateEmail('a@b@c.com')).toBe(false);
    expect(validateEmail('a b@bank.example')).toBe(false);
  });

  it('accepts phone with optional + and spaces and 8–15 digits', () => {
    expect(validatePhone('12345678')).toBe(true);
    expect(validatePhone('+385 91 123 4567')).toBe(true);
    expect(validatePhone('  +123456789012345 ')).toBe(true);
  });

  it('rejects phone outside the digit rules', () => {
    expect(validatePhone('1234567')).toBe(false);
    expect(validatePhone('1234567890123456')).toBe(false);
    expect(validatePhone('+12-34')).toBe(false);
    expect(validatePhone('++385911234567')).toBe(false);
  });

  it('requires OIB to be exactly 11 digits with no checksum', () => {
    expect(validateOib('12345678901')).toBe(true);
    expect(validateOib('1234567890')).toBe(false);
    expect(validateOib('123456789012')).toBe(false);
    expect(validateOib('1234567890a')).toBe(false);
  });

  it('names field errors and trims names', () => {
    const result = validateClientInput({
      first_name: '  Ada  ',
      last_name: '  Lovelace  ',
      email: 'ada@bank.example',
      phone: '12345678',
      oib: '12345678901',
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.first_name).toBe('Ada');
      expect(result.value.last_name).toBe('Lovelace');
    }

    const invalid = validateClientInput({
      first_name: ' ',
      last_name: '',
      email: 'bad',
      phone: '12',
      oib: '1',
    });
    expect(invalid.ok).toBe(false);
    if (!invalid.ok) {
      expect(invalid.fields.first_name).toBe('Enter a first name.');
      expect(invalid.fields.last_name).toBe('Enter a last name.');
      expect(invalid.fields.email).toBe(
        'Enter an email like name@bank.example.',
      );
      expect(invalid.fields.phone).toBe('Enter a phone with 8–15 digits.');
      expect(invalid.fields.oib).toBe('Enter an 11-digit OIB.');
    }
  });
});
