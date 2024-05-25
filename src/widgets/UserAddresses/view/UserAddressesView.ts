import ButtonModel from '@/shared/Button/model/ButtonModel.ts';
import getStore from '@/shared/Store/Store.ts';
import { BUTTON_TEXT, BUTTON_TEXT_KEYS } from '@/shared/constants/buttons.ts';
import createBaseElement from '@/shared/utils/createBaseElement.ts';
import observeCurrentLanguage from '@/shared/utils/observeCurrentLanguage.ts';

import styles from './userAddressesView.module.scss';

class UserAddressView {
  private addressesWrapper: HTMLDivElement;

  private createBillingAddressButton: ButtonModel;

  private createShippingAddressButton: ButtonModel;

  constructor() {
    this.createBillingAddressButton = this.createCreateBillingAddressButton();
    this.createShippingAddressButton = this.createCreateShippingAddressButton();
    this.addressesWrapper = this.createHTML();
  }

  private createCreateBillingAddressButton(): ButtonModel {
    this.createBillingAddressButton = new ButtonModel({
      classes: [styles.createAddressButton],
      text: BUTTON_TEXT[getStore().getState().currentLanguage].NEW_ADDRESS,
    });

    observeCurrentLanguage(this.createBillingAddressButton.getHTML(), BUTTON_TEXT, BUTTON_TEXT_KEYS.NEW_ADDRESS);

    return this.createBillingAddressButton;
  }

  private createCreateShippingAddressButton(): ButtonModel {
    this.createShippingAddressButton = new ButtonModel({
      classes: [styles.createAddressButton],
      text: BUTTON_TEXT[getStore().getState().currentLanguage].NEW_ADDRESS,
    });
    observeCurrentLanguage(this.createShippingAddressButton.getHTML(), BUTTON_TEXT, BUTTON_TEXT_KEYS.NEW_ADDRESS);
    return this.createShippingAddressButton;
  }

  private createHTML(): HTMLDivElement {
    this.addressesWrapper = createBaseElement({
      cssClasses: [styles.addressesWrapper, styles.hidden],
      tag: 'div',
    });

    this.addressesWrapper.append(this.createBillingAddressButton.getHTML(), this.createShippingAddressButton.getHTML());
    return this.addressesWrapper;
  }

  public getCreateBillingAddressButton(): ButtonModel {
    return this.createBillingAddressButton;
  }

  public getCreateShippingAddressButton(): ButtonModel {
    return this.createShippingAddressButton;
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
