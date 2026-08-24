import { describe, expect, it } from 'vitest';
import {
  EMPTY_PRODUCTS_COPY,
  OPTIONAL_PRODUCTS_COPY,
  PRODUCT_CODES,
} from '../../src/lib/products';

describe('product catalog (CRM-001)', () => {
  it('has six fixed English banking products', () => {
    expect(PRODUCT_CODES).toEqual([
      'bank_account',
      'credit_card',
      'loan',
      'savings',
      'mobile_banking',
      'online_banking',
    ]);
  });

  it('uses empty and optional product copy', () => {
    expect(EMPTY_PRODUCTS_COPY).toBe('No products assigned.');
    expect(OPTIONAL_PRODUCTS_COPY).toBe('Products are optional.');
  });
});
