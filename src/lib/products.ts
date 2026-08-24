export const PRODUCT_CODES = [
  'bank_account',
  'credit_card',
  'loan',
  'savings',
  'mobile_banking',
  'online_banking',
] as const;

export type ProductCode = (typeof PRODUCT_CODES)[number];

export type ProductRecord = {
  id: string;
  code: string;
  name: string;
};

export const EMPTY_PRODUCTS_COPY = 'No products assigned.';
export const OPTIONAL_PRODUCTS_COPY = 'Products are optional.';
