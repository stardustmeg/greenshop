/* eslint-disable max-lines-per-function */
import type { TooltipTextKeysType } from '@/shared/constants/tooltip.ts';
import type { Address } from '@/shared/types/user';

import ButtonModel from '@/shared/Button/model/ButtonModel.ts';
import getStore from '@/shared/Store/Store.ts';
import observeStore, { selectCurrentLanguage } from '@/shared/Store/observer.ts';
import COUNTRIES_LIST from '@/shared/constants/countriesList.ts';
import { ADDRESS_TYPE, type AddressTypeType } from '@/shared/constants/forms.ts';
import SVG_DETAILS from '@/shared/constants/svg.ts';
import TOOLTIP_TEXT, { TOOLTIP_TEXT_KEYS } from '@/shared/constants/tooltip.ts';
import createBaseElement from '@/shared/utils/createBaseElement.ts';
import createSVGUse from '@/shared/utils/createSVGUse.ts';
import findKeyByValue from '@/shared/utils/findKeyByValue.ts';
import { addressTemplate } from '@/shared/utils/messageTemplates.ts';

import styles from './userAddressView.module.scss';

class UserAddressView {
  private currentAddress: Address;

  private deleteButton: ButtonModel;

  private deleteLogo: HTMLDivElement;

  private editButton: ButtonModel;

  private editLogo: HTMLDivElement;

  private labels: Map<HTMLDivElement, { inactive?: boolean; type: AddressTypeType }> = new Map();

  private view: HTMLLIElement;

  constructor(locale: string, address: Address, types: AddressTypeType[], inactiveTypes?: AddressTypeType[]) {
    this.currentAddress = address;
    this.deleteLogo = this.createDeleteLogo();
    this.deleteButton = this.createDeleteButton();
    this.editLogo = this.createEditLogo();
    this.editButton = this.createEditButton();
    this.view = this.createHTML(locale, types, inactiveTypes);
  }

  private createAddressText(locale: string): string {
    const { city, country, postalCode, streetName } = this.currentAddress;

    const countryKey = findKeyByValue(COUNTRIES_LIST[locale], country);
    const standardAddressText = addressTemplate(streetName, city, countryKey, postalCode);

    return standardAddressText;
  }

  private createDeleteButton(): ButtonModel {
    this.deleteButton = new ButtonModel({
      classes: [styles.deleteButton],
      title: TOOLTIP_TEXT[getStore().getState().currentLanguage].DELETE_ADDRESS,
    });

    this.deleteButton.getHTML().append(this.deleteLogo);

    observeStore(selectCurrentLanguage, () => {
      this.deleteButton.getHTML().title = TOOLTIP_TEXT[getStore().getState().currentLanguage].DELETE_ADDRESS;
    });

    return this.deleteButton;
  }

  private createDeleteLogo(): HTMLDivElement {
    this.deleteLogo = createBaseElement({ cssClasses: [styles.deleteLogo], tag: 'div' });
    const svg = document.createElementNS(SVG_DETAILS.SVG_URL, 'svg');
    svg.append(createSVGUse(SVG_DETAILS.BIN));
    this.deleteLogo.append(svg);
    return this.deleteLogo;
  }

  private createEditButton(): ButtonModel {
    this.editButton = new ButtonModel({
      classes: [styles.editButton],
      title: TOOLTIP_TEXT[getStore().getState().currentLanguage].EDIT_ADDRESS,
    });

    this.editButton.getHTML().append(this.editLogo);

    observeStore(selectCurrentLanguage, () => {
      this.editButton.getHTML().title = TOOLTIP_TEXT[getStore().getState().currentLanguage].EDIT_ADDRESS;
    });

    return this.editButton;
  }

  private createEditLogo(): HTMLDivElement {
    this.editLogo = createBaseElement({ cssClasses: [styles.editLogo], tag: 'div' });
    const svg = document.createElementNS(SVG_DETAILS.SVG_URL, 'svg');
    svg.append(createSVGUse(SVG_DETAILS.EDIT));
    this.editLogo.append(svg);
    return this.editLogo;
  }

  private createHTML(locale: string, activeTypes: AddressTypeType[], inactiveTypes?: AddressTypeType[]): HTMLLIElement {
    this.view = createBaseElement({
      cssClasses: [styles.addressItem],
      tag: 'li',
    });
    const addressText = createBaseElement({
      cssClasses: [styles.addressText],
      innerContent: this.createAddressText(locale),
      tag: 'span',
    });

    activeTypes.forEach((type) => {
      this.setActiveAddressLabel(type);
    });

    if (inactiveTypes) {
      inactiveTypes.forEach((type) => {
        this.setActiveAddressLabel(type, true);
      });
    }

    this.view.append(addressText, this.editButton.getHTML(), this.deleteButton.getHTML());

    observeStore(selectCurrentLanguage, () => {
      addressText.innerText = this.createAddressText(getStore().getState().currentLanguage);
    });

    return this.view;
  }

  private createLabel(text: string, additionalStyles: string[], titleKey: TooltipTextKeysType): HTMLDivElement {
    const label = createBaseElement({
      cssClasses: [styles.addressType, ...additionalStyles],
      innerContent: text,
      tag: 'div',
      title: TOOLTIP_TEXT[getStore().getState().currentLanguage][titleKey],
    });

    observeStore(selectCurrentLanguage, () => {
      label.title = TOOLTIP_TEXT[getStore().getState().currentLanguage][titleKey];
    });

    return label;
  }

  private setActiveAddressLabel(ActiveType: AddressTypeType, inactive?: boolean): void {
    let addressType = null;
    switch (ActiveType) {
      case ADDRESS_TYPE.BILLING:
        addressType = this.createLabel(ActiveType, [styles.billing], TOOLTIP_TEXT_KEYS.SWITCH_BILLING_ADDRESS);
        this.view.append(addressType);
        break;

      case ADDRESS_TYPE.SHIPPING:
        addressType = this.createLabel(ActiveType, [styles.shipping], TOOLTIP_TEXT_KEYS.SWITCH_SHIPPING_ADDRESS);
        this.view.append(addressType);
        break;

      case ADDRESS_TYPE.DEFAULT_BILLING:
        addressType = this.createLabel(
          ActiveType,
          [styles.defaultBilling],
          TOOLTIP_TEXT_KEYS.SWITCH_DEFAULT_BILLING_ADDRESS,
        );
        this.view.append(addressType);
        break;

      case ADDRESS_TYPE.DEFAULT_SHIPPING:
        addressType = this.createLabel(
          ActiveType,
          [styles.defaultShipping],
          TOOLTIP_TEXT_KEYS.SWITCH_DEFAULT_SHIPPING_ADDRESS,
        );
        this.view.append(addressType);
        break;
      default:
        break;
    }

    if (addressType) {
      this.labels.set(addressType, {
        inactive,
        type: ActiveType,
      });
    }

    if (inactive) {
      addressType?.classList.add(styles.inactive);
    }
  }

  public getCurrentAddress(): Address {
    return this.currentAddress;
  }

  public getDeleteButton(): ButtonModel {
    return this.deleteButton;
  }

  public getEditButton(): ButtonModel {
    return this.editButton;
  }

  public getHTML(): HTMLLIElement {
    return this.view;
  }

  public getLabels(): Map<HTMLDivElement, { inactive?: boolean; type: AddressTypeType }> {
    return this.labels;
  }
}

export default UserAddressView;
