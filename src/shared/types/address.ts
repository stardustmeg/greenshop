export const ADDRESS_TYPE = {
  BILLING: 'billing',
  SHIPPING: 'shipping',
} as const;

export const SINGLE_ADDRESS = 'asBilling';

export type AddressType = (typeof ADDRESS_TYPE)[keyof typeof ADDRESS_TYPE];

export interface AddressOptions {
  delete?: boolean;
  edit?: boolean;
  setAsBilling?: boolean;
  setDefault?: boolean;
}
