export const GENERIC_CLIENT_ERROR = 'Operation failed.';

export type ClientInput = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  oib: string;
};

export type FieldErrors = Partial<Record<keyof ClientInput, string>>;

export type ValidationResult =
  { ok: true; value: ClientInput } | { ok: false; fields: FieldErrors };

function hasSingleAt(email: string): boolean {
  return email.split('@').length === 2;
}

export function validateEmail(email: string): boolean {
  const trimmed = email.trim();
  if (!trimmed || trimmed.includes(' ')) {
    return false;
  }
  if (!hasSingleAt(trimmed)) {
    return false;
  }
  const [local, domain] = trimmed.split('@');
  if (!local || !domain) {
    return false;
  }
  return domain.includes('.');
}

export function validatePhone(phone: string): boolean {
  const trimmed = phone.trim();
  if (!trimmed) {
    return false;
  }
  const noSpaces = trimmed.replace(/ /g, '');
  if (!/^\+?[0-9]+$/.test(noSpaces)) {
    return false;
  }
  const digits = noSpaces.startsWith('+') ? noSpaces.slice(1) : noSpaces;
  return digits.length >= 8 && digits.length <= 15;
}

export function validateOib(oib: string): boolean {
  return /^[0-9]{11}$/.test(oib.trim());
}

export function validateClientInput(input: ClientInput): ValidationResult {
  const first_name = input.first_name.trim();
  const last_name = input.last_name.trim();
  const email = input.email.trim();
  const phone = input.phone.trim();
  const oib = input.oib.trim();
  const fields: FieldErrors = {};

  if (!first_name) {
    fields.first_name = 'first name';
  }
  if (!last_name) {
    fields.last_name = 'last name';
  }
  if (!validateEmail(email)) {
    fields.email = 'email';
  }
  if (!validatePhone(phone)) {
    fields.phone = 'phone';
  }
  if (!validateOib(oib)) {
    fields.oib = 'OIB';
  }

  if (Object.keys(fields).length > 0) {
    return { ok: false, fields };
  }

  return {
    ok: true,
    value: { first_name, last_name, email, phone, oib },
  };
}

export function isUniqueEmailViolation(
  error: { code?: string } | null,
): boolean {
  return error?.code === '23505';
}
