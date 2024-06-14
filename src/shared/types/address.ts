export const ADDRESS = {
  BILLING: 'billing',
  GENERAL: 'general',
  SHIPPING: 'shipping',
} as const;

export type AddressType = (typeof ADDRESS)[keyof typeof ADDRESS];

export const SINGLE_ADDRESS = 'asBilling';

export interface AddressOptions {
  setAsBilling?: boolean;
  setDefault?: boolean;
}
