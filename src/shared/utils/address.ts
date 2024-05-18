import type { Address } from '@commercetools/platform-sdk';

import { billingAddressMessage, shippingAddressMessage } from './messageTemplates.ts';

const findAddressIndex = (addresses: Address[], targetAddress: Address): null | number => {
  const index = addresses?.findIndex(
    (address) =>
      address.city === targetAddress?.city &&
      address.country === targetAddress?.country &&
      address.postalCode === targetAddress?.postalCode &&
      address.streetName === targetAddress?.streetName &&
      address.streetNumber === targetAddress?.streetNumber,
  );
  return index !== undefined && index >= 0 ? index : null;
};

export function addressMessage(type: string, text: string): string {
  switch (type) {
    case 'billing':
      return billingAddressMessage(text);
    case 'shipping':
      return shippingAddressMessage(text);
    default:
      return '';
  }
}

export default findAddressIndex;
