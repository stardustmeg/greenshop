import ButtonModel from '@/shared/Button/model/ButtonModel.ts';
import getStore from '@/shared/Store/Store.ts';
import observeStore, { selectCurrentLanguage } from '@/shared/Store/observer.ts';
import SVG_DETAILS from '@/shared/constants/svg.ts';
import TOOLTIP_TEXT from '@/shared/constants/tooltip.ts';
import createBaseElement from '@/shared/utils/createBaseElement.ts';
import createSVGUse from '@/shared/utils/createSVGUse.ts';

import styles from './userAddressesView.module.scss';

class UserAddressView {
  private addressesWrapper: HTMLDivElement;

  private billingLogo: HTMLDivElement;

  private createBillingAddressButton: ButtonModel;

  private createShippingAddressButton: ButtonModel;

  private shippingLogo: HTMLDivElement;

  constructor() {
    this.billingLogo = this.createBillingLogo();
    this.shippingLogo = this.createShippingLogo();
    this.createBillingAddressButton = this.createCreateBillingAddressButton();
    this.createShippingAddressButton = this.createCreateShippingAddressButton();
    this.addressesWrapper = this.createHTML();
  }

  private createBillingLogo(): HTMLDivElement {
    this.billingLogo = createBaseElement({ cssClasses: [styles.billingLogo], tag: 'div' });
    const svg = document.createElementNS(SVG_DETAILS.SVG_URL, 'svg');
    svg.append(createSVGUse(SVG_DETAILS.WALLET));
    this.billingLogo.append(svg);
    return this.billingLogo;
  }

  private createCreateBillingAddressButton(): ButtonModel {
    this.createBillingAddressButton = new ButtonModel({
      classes: [styles.createAddressButton],
      title: TOOLTIP_TEXT[getStore().getState().currentLanguage].ADD_BILLING_ADDRESS,
    });

    this.createBillingAddressButton.getHTML().append(this.billingLogo);

    observeStore(selectCurrentLanguage, () => {
      this.createBillingAddressButton.getHTML().title =
        TOOLTIP_TEXT[getStore().getState().currentLanguage].ADD_BILLING_ADDRESS;
    });

    return this.createBillingAddressButton;
  }

  private createCreateShippingAddressButton(): ButtonModel {
    this.createShippingAddressButton = new ButtonModel({
      classes: [styles.createAddressButton],
      title: TOOLTIP_TEXT[getStore().getState().currentLanguage].ADD_SHIPPING_ADDRESS,
    });

    this.createShippingAddressButton.getHTML().append(this.shippingLogo);

    observeStore(selectCurrentLanguage, () => {
      this.createShippingAddressButton.getHTML().title =
        TOOLTIP_TEXT[getStore().getState().currentLanguage].ADD_SHIPPING_ADDRESS;
    });

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

  private createShippingLogo(): HTMLDivElement {
    this.shippingLogo = createBaseElement({ cssClasses: [styles.shippingLogo], tag: 'div' });
    const svg = document.createElementNS(SVG_DETAILS.SVG_URL, 'svg');
    svg.append(createSVGUse(SVG_DETAILS.TRUCK));
    this.shippingLogo.append(svg);
    return this.shippingLogo;
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
