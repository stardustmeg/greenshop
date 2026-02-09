/* eslint-disable max-lines-per-function */
import type UserAddressModel from '@/entities/UserAddress/model/UserAddressModel';

import type { Address, User } from '../types/user';

import { ADDRESS, type AddressType } from '../constants/forms.ts';

const determineNewAddress = (
  addressesContainsID: (array: Address[]) => boolean,
  defaultContainsID: (defaultAddress: Address | null) => boolean,
  user: User,
  createAddress: (activeTypes: AddressType[], inactiveTypes?: AddressType[]) => UserAddressModel,
): UserAddressModel => {
  const { billingAddress, defaultBillingAddressId, defaultShippingAddressId, shippingAddress } = user;
  switch (true) {
    case defaultContainsID(defaultBillingAddressId) &&
      defaultContainsID(defaultShippingAddressId) &&
      addressesContainsID(billingAddress) &&
      addressesContainsID(shippingAddress): // billing, shipping, defaultBilling, defaultShipping
      return createAddress([ADDRESS.SHIPPING, ADDRESS.BILLING, ADDRESS.DEFAULT_BILLING, ADDRESS.DEFAULT_SHIPPING]);

    case addressesContainsID(billingAddress) &&
      defaultContainsID(defaultBillingAddressId) &&
      defaultContainsID(defaultShippingAddressId): // billing, defaultBilling, defaultShipping
      return createAddress([ADDRESS.BILLING, ADDRESS.DEFAULT_BILLING, ADDRESS.DEFAULT_SHIPPING], [ADDRESS.SHIPPING]);

    case addressesContainsID(shippingAddress) &&
      defaultContainsID(defaultBillingAddressId) &&
      defaultContainsID(defaultShippingAddressId): // shipping, defaultBilling, defaultShipping
      return createAddress([ADDRESS.SHIPPING, ADDRESS.DEFAULT_BILLING, ADDRESS.DEFAULT_SHIPPING], [ADDRESS.BILLING]);

    case addressesContainsID(shippingAddress) &&
      addressesContainsID(billingAddress) &&
      defaultContainsID(defaultBillingAddressId): // billing, shipping, defaultBilling
      return createAddress([ADDRESS.BILLING, ADDRESS.SHIPPING, ADDRESS.DEFAULT_BILLING], [ADDRESS.DEFAULT_SHIPPING]);

    case addressesContainsID(billingAddress) &&
      defaultContainsID(defaultShippingAddressId) &&
      addressesContainsID(shippingAddress): // billing, shipping, defaultShipping
      return createAddress([ADDRESS.BILLING, ADDRESS.SHIPPING, ADDRESS.DEFAULT_SHIPPING], [ADDRESS.DEFAULT_BILLING]);

    case defaultContainsID(defaultBillingAddressId) && defaultContainsID(defaultShippingAddressId): // defaultBilling, defaultShipping
      return createAddress([ADDRESS.DEFAULT_BILLING, ADDRESS.DEFAULT_SHIPPING], [ADDRESS.BILLING, ADDRESS.SHIPPING]);

    case addressesContainsID(billingAddress) && addressesContainsID(shippingAddress): // billing, shipping
      return createAddress([ADDRESS.BILLING, ADDRESS.SHIPPING], [ADDRESS.DEFAULT_BILLING, ADDRESS.DEFAULT_SHIPPING]);

    case addressesContainsID(billingAddress) && defaultContainsID(defaultBillingAddressId): // billing, defaultBilling
      return createAddress([ADDRESS.BILLING, ADDRESS.DEFAULT_BILLING], [ADDRESS.SHIPPING, ADDRESS.DEFAULT_SHIPPING]);

    case addressesContainsID(billingAddress) && defaultContainsID(defaultShippingAddressId): // billing, defaultShipping
      return createAddress([ADDRESS.BILLING, ADDRESS.DEFAULT_BILLING], [ADDRESS.SHIPPING, ADDRESS.DEFAULT_SHIPPING]);

    case addressesContainsID(shippingAddress) && defaultContainsID(defaultShippingAddressId): // shipping, defaultShipping
      return createAddress([ADDRESS.SHIPPING, ADDRESS.DEFAULT_SHIPPING], [ADDRESS.BILLING, ADDRESS.DEFAULT_BILLING]);

    case addressesContainsID(shippingAddress) && defaultContainsID(defaultBillingAddressId): // shipping, defaultBilling
      return createAddress([ADDRESS.SHIPPING, ADDRESS.DEFAULT_SHIPPING], [ADDRESS.BILLING, ADDRESS.DEFAULT_BILLING]);

    case addressesContainsID(billingAddress): // billing
      return createAddress([ADDRESS.BILLING], [ADDRESS.DEFAULT_SHIPPING, ADDRESS.SHIPPING, ADDRESS.DEFAULT_BILLING]);

    case addressesContainsID(shippingAddress): // shipping
      return createAddress([ADDRESS.SHIPPING], [ADDRESS.DEFAULT_SHIPPING, ADDRESS.BILLING, ADDRESS.DEFAULT_BILLING]);

    case defaultContainsID(defaultBillingAddressId): // defaultBilling
      return createAddress([ADDRESS.DEFAULT_BILLING], [ADDRESS.SHIPPING, ADDRESS.BILLING, ADDRESS.DEFAULT_SHIPPING]);

    case defaultContainsID(defaultShippingAddressId): // defaultShipping
      return createAddress([ADDRESS.DEFAULT_SHIPPING], [ADDRESS.SHIPPING, ADDRESS.BILLING, ADDRESS.DEFAULT_BILLING]);

    default: // None
      return createAddress([], [ADDRESS.SHIPPING, ADDRESS.BILLING, ADDRESS.DEFAULT_BILLING, ADDRESS.DEFAULT_SHIPPING]);
  }
};

export default determineNewAddress;
