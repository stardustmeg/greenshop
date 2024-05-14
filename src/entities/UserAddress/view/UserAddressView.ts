import ButtonModel from '@/shared/Button/model/ButtonModel.ts';
import getStore from '@/shared/Store/Store.ts';
import { BUTTON_TEXT, BUTTON_TEXT_KEYS } from '@/shared/constants/buttons.ts';
import COUNTRIES_LIST from '@/shared/constants/countriesList.ts';
import createBaseElement from '@/shared/utils/createBaseElement.ts';
import findKeyByValue from '@/shared/utils/findKeyByValue.ts';
import { defaultBillingAddress, defaultShippingAddress } from '@/shared/utils/messageTemplate.ts';
import observeCurrentLanguage from '@/shared/utils/observeCurrentLanguage.ts';

import styles from './userAddressView.module.scss';

class UserAddressView {
  private addressesWrapper: HTMLDivElement;

  private editInfoButton: ButtonModel;

  constructor() {
    this.editInfoButton = this.createEditInfoButton();
    this.addressesWrapper = this.createAddresses();
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

  private createAddresses(): HTMLDivElement {
    const { currentUser } = getStore().getState();
    if (!currentUser) {
      return createBaseElement({
        cssClasses: [styles.addressesWrapper, styles.hidden],
        tag: 'div',
      });
    }
    const { addresses, defaultBillingAddressId, defaultShippingAddressId, locale } = currentUser;

    this.addressesWrapper = createBaseElement({
      cssClasses: [styles.addressesWrapper, styles.hidden],
      tag: 'div',
    });
    addresses.forEach((address) => {
      const country = findKeyByValue(COUNTRIES_LIST[locale], address.country);
      const standartAddressText = `${address.streetName}, ${address.city}, ${country}, ${address.postalCode}`;
      let addressText = `${standartAddressText}`;

      if (defaultBillingAddressId?.id === address.id) {
        addressText = defaultBillingAddress(standartAddressText);
      }
      if (defaultShippingAddressId?.id === address.id) {
        addressText = defaultShippingAddress(standartAddressText);
      }
      const addressWrapper = this.createAddressElement(addressText);
      this.addressesWrapper.append(addressWrapper);
    });
    this.addressesWrapper.append(this.editInfoButton.getHTML());
    return this.addressesWrapper;
  }

  private createEditInfoButton(): ButtonModel {
    this.editInfoButton = new ButtonModel({
      classes: [styles.editInfoButton],
      text: BUTTON_TEXT[getStore().getState().currentLanguage].EDIT_INFO,
    });

    observeCurrentLanguage(this.editInfoButton.getHTML(), BUTTON_TEXT, BUTTON_TEXT_KEYS.EDIT_INFO);

    return this.editInfoButton;
  }

  public getEditInfoButton(): ButtonModel {
    return this.editInfoButton;
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
