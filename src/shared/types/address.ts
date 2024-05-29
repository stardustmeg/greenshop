export const ADDRESS_TYPE = {
  BILLING: 'billing',
  GENERAL: 'general',
  SHIPPING: 'shipping',
} as const;

export type AddressType = (typeof ADDRESS_TYPE)[keyof typeof ADDRESS_TYPE];

export const SINGLE_ADDRESS = 'asBilling';

export interface AddressOptions {
  setAsBilling?: boolean;
  setDefault?: boolean;
}
