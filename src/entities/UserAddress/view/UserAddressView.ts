import type { UserAddressType } from '@/shared/constants/forms.ts';
import type { User } from '@/shared/types/user';
import type { Address } from '@commercetools/platform-sdk';

import COUNTRIES_LIST from '@/shared/constants/countriesList.ts';
import { USER_ADDRESS_TYPE } from '@/shared/constants/forms.ts';
import { addressMessage } from '@/shared/utils/address.ts';
import createBaseElement from '@/shared/utils/createBaseElement.ts';
import findKeyByValue from '@/shared/utils/findKeyByValue.ts';
import { defaultBillingAddress, defaultShippingAddress } from '@/shared/utils/messageTemplates.ts';

import styles from './userAddressView.module.scss';

class UserAddressView {
  private addressesWrapper: HTMLDivElement;

  private currentUser: User;

  constructor(currentUser: User) {
    this.currentUser = currentUser;
    this.addressesWrapper = this.createCurrentAddresses();
  }

  private createAddressElement(
    text: string,
    tag: keyof HTMLElementTagNameMap = 'li',
    classes: string[] = [styles.info],
  ): HTMLElement {
    return createBaseElement({
      cssClasses: classes,
      innerContent: text,
      tag,
    });
  }

  private createAddresses(addresses: Address[], defaultAddress: Address | null, type: UserAddressType): void {
    addresses.forEach((address) => {
      const { locale } = this.currentUser;
      const country = findKeyByValue(COUNTRIES_LIST[locale], address.country);
      const standartAddressText = `${address.streetName}, ${address.city}, ${country}, ${address.postalCode}`;
      let addressText = addressMessage(type, standartAddressText);

      if (defaultAddress && defaultAddress.id === address.id) {
        if (type === USER_ADDRESS_TYPE.BILLING) {
          addressText = defaultBillingAddress(standartAddressText);
        } else if (type === USER_ADDRESS_TYPE.SHIPPING) {
          addressText = defaultShippingAddress(standartAddressText);
        }
      }

      const addressWrapper = this.createAddressElement(addressText);
      this.addressesWrapper.append(addressWrapper);
    });
  }

  private createCurrentAddresses(): HTMLDivElement {
    const { billingAddress, defaultBillingAddressId, defaultShippingAddressId, shippingAddress } = this.currentUser;
    this.addressesWrapper = createBaseElement({
      cssClasses: [styles.addressesWrapper, styles.hidden],
      tag: 'div',
    });

    this.createAddresses(billingAddress, defaultBillingAddressId, USER_ADDRESS_TYPE.BILLING);
    this.createAddresses(shippingAddress, defaultShippingAddressId, USER_ADDRESS_TYPE.SHIPPING);

    return this.addressesWrapper;
  }

  public getHTML(): HTMLDivElement {
    return this.addressesWrapper;
  }

  public hide(): void {
    this.addressesWrapper.classList.add(styles.hidden);
  }

  public show(): void {
    this.addressesWrapper.classList.remove(styles.hidden);
  }
}

export default UserAddressView;
