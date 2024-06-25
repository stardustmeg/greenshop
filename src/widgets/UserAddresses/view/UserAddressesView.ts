import ButtonModel from '@/shared/Button/model/ButtonModel.ts';
import observeStore, { selectCurrentLanguage } from '@/shared/Store/observer.ts';
import SVG_DETAIL from '@/shared/constants/svg.ts';
import TOOLTIP_TEXT from '@/shared/constants/tooltip.ts';
import createBaseElement from '@/shared/utils/createBaseElement.ts';
import createSVGUse from '@/shared/utils/createSVGUse.ts';
import getCurrentLanguage from '@/shared/utils/getCurrentLanguage.ts';

import styles from './userAddressesView.module.scss';

class UserAddressView {
  private addressesListWrapper: HTMLUListElement;

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
    this.addressesListWrapper = this.createAddressesListWrapper();
    this.addressesWrapper = this.createHTML();

    this.observeStoreChanges();
  }

  private createAddressesListWrapper(): HTMLUListElement {
    return createBaseElement({
      cssClasses: [styles.addressesListWrapper],
      tag: 'ul',
    });
  }

  private createBillingLogo(): HTMLDivElement {
    this.billingLogo = createBaseElement({ cssClasses: [styles.billingLogo], tag: 'div' });
    const svg = document.createElementNS(SVG_DETAIL.SVG_URL, 'svg');
    svg.append(createSVGUse(SVG_DETAIL.BILL));
    this.billingLogo.append(svg);
    return this.billingLogo;
  }

  private createCreateBillingAddressButton(): ButtonModel {
    return new ButtonModel({
      classes: [styles.createAddressButton],
      title: TOOLTIP_TEXT[getCurrentLanguage()].ADD_BILLING_ADDRESS,
    });
  }

  private createCreateShippingAddressButton(): ButtonModel {
    return new ButtonModel({
      classes: [styles.createAddressButton],
      title: TOOLTIP_TEXT[getCurrentLanguage()].ADD_SHIPPING_ADDRESS,
    });
  }

  private createHTML(): HTMLDivElement {
    this.addressesWrapper = createBaseElement({
      cssClasses: [styles.addressesWrapper],
      tag: 'div',
    });

    this.createBillingAddressButton.getHTML().append(this.billingLogo);
    this.createShippingAddressButton.getHTML().append(this.shippingLogo);

    this.addressesWrapper.append(
      this.createBillingAddressButton.getHTML(),
      this.createShippingAddressButton.getHTML(),
      this.addressesListWrapper,
    );
    return this.addressesWrapper;
  }

  private createShippingLogo(): HTMLDivElement {
    this.shippingLogo = createBaseElement({ cssClasses: [styles.shippingLogo], tag: 'div' });
    const svg = document.createElementNS(SVG_DETAIL.SVG_URL, 'svg');
    svg.append(createSVGUse(SVG_DETAIL.DELIVERY));
    this.shippingLogo.append(svg);
    return this.shippingLogo;
  }

  private observeStoreChanges(): void {
    observeStore(selectCurrentLanguage, () => {
      this.createBillingAddressButton.getHTML().title = TOOLTIP_TEXT[getCurrentLanguage()].ADD_BILLING_ADDRESS;
      this.createShippingAddressButton.getHTML().title = TOOLTIP_TEXT[getCurrentLanguage()].ADD_SHIPPING_ADDRESS;
    });
  }

  public getAddressesListWrapper(): HTMLUListElement {
    return this.addressesListWrapper;
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
}

export default UserAddressView;
