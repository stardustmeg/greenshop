import type { TooltipTextKeysType } from '@/shared/constants/tooltip.ts';
import type { Address } from '@/shared/types/user';

import ButtonModel from '@/shared/Button/model/ButtonModel.ts';
import observeStore, { selectCurrentLanguage } from '@/shared/Store/observer.ts';
import COUNTRIES_LIST from '@/shared/constants/countriesList.ts';
import { ADDRESS_TEXT, ADDRESS_TYPE, type AddressTypeType } from '@/shared/constants/forms.ts';
import SVG_DETAILS from '@/shared/constants/svg.ts';
import TOOLTIP_TEXT, { TOOLTIP_TEXT_KEYS } from '@/shared/constants/tooltip.ts';
import createBaseElement from '@/shared/utils/createBaseElement.ts';
import createSVGUse from '@/shared/utils/createSVGUse.ts';
import findKeyByValue from '@/shared/utils/findKeyByValue.ts';
import getCurrentLanguage from '@/shared/utils/getCurrentLanguage.ts';

import styles from './userAddressView.module.scss';

class UserAddressView {
  private citySpan: HTMLSpanElement;

  private countrySpan: HTMLSpanElement;

  private currentAddress: Address;

  private deleteButton: ButtonModel;

  private editButton: ButtonModel;

  private labels: Map<HTMLDivElement, { inactive?: boolean; type: AddressTypeType }> = new Map();

  private labelsWrapper: HTMLDivElement;

  private postalCodeSpan: HTMLSpanElement;

  private streetNameSpan: HTMLSpanElement;

  private view: HTMLLIElement;

  constructor(address: Address, types: AddressTypeType[], inactiveTypes?: AddressTypeType[]) {
    this.currentAddress = address;
    this.deleteButton = this.createDeleteButton();
    this.editButton = this.createEditButton();
    this.citySpan = this.createCitySpan();
    this.countrySpan = this.createCountrySpan();
    this.postalCodeSpan = this.createPostalCodeSpan();
    this.streetNameSpan = this.createStreetNameSpan();
    this.labelsWrapper = this.createLabelsWrapper();
    this.view = this.createHTML(types, inactiveTypes);
  }

  private createCitySpan(): HTMLSpanElement {
    this.citySpan = createBaseElement({
      cssClasses: [styles.citySpan],
      innerContent: ADDRESS_TEXT[getCurrentLanguage()].CITY,
      tag: 'span',
    });

    observeStore(selectCurrentLanguage, () => {
      const text = ADDRESS_TEXT[getCurrentLanguage()].CITY;
      const textNode = [...this.citySpan.childNodes].find((child) => child.nodeType === Node.TEXT_NODE);
      if (textNode) {
        textNode.textContent = text;
      }
    });

    const accentSpan = createBaseElement({
      cssClasses: [styles.accentSpan],
      innerContent: this.currentAddress.city,
      tag: 'span',
    });

    this.citySpan.append(accentSpan);
    return this.citySpan;
  }

  private createCountrySpan(): HTMLSpanElement {
    this.countrySpan = createBaseElement({
      cssClasses: [styles.countrySpan],
      innerContent: ADDRESS_TEXT[getCurrentLanguage()].COUNTRY,
      tag: 'span',
    });

    const accentSpan = createBaseElement({
      cssClasses: [styles.accentSpan],
      innerContent: findKeyByValue(COUNTRIES_LIST[getCurrentLanguage()], this.currentAddress.country) ?? '',
      tag: 'span',
    });

    this.countrySpan.append(accentSpan);
    observeStore(selectCurrentLanguage, () => {
      accentSpan.innerText = findKeyByValue(COUNTRIES_LIST[getCurrentLanguage()], this.currentAddress.country) ?? '';

      const text = ADDRESS_TEXT[getCurrentLanguage()].COUNTRY;
      const textNode = [...this.countrySpan.childNodes].find((child) => child.nodeType === Node.TEXT_NODE);
      if (textNode) {
        textNode.textContent = text;
      }
    });
    return this.countrySpan;
  }

  private createDeleteButton(): ButtonModel {
    this.deleteButton = new ButtonModel({
      classes: [styles.deleteButton],
      title: TOOLTIP_TEXT[getCurrentLanguage()].DELETE_ADDRESS,
    });

    const svg = document.createElementNS(SVG_DETAILS.SVG_URL, 'svg');
    svg.append(createSVGUse(SVG_DETAILS.DELETE));
    this.deleteButton.getHTML().append(svg);

    observeStore(selectCurrentLanguage, () => {
      this.deleteButton.getHTML().title = TOOLTIP_TEXT[getCurrentLanguage()].DELETE_ADDRESS;
    });

    return this.deleteButton;
  }

  private createEditButton(): ButtonModel {
    this.editButton = new ButtonModel({
      classes: [styles.editButton],
      title: TOOLTIP_TEXT[getCurrentLanguage()].EDIT_ADDRESS,
    });

    const svg = document.createElementNS(SVG_DETAILS.SVG_URL, 'svg');
    svg.append(createSVGUse(SVG_DETAILS.EDIT));
    this.editButton.getHTML().append(svg);

    observeStore(selectCurrentLanguage, () => {
      this.editButton.getHTML().title = TOOLTIP_TEXT[getCurrentLanguage()].EDIT_ADDRESS;
    });

    return this.editButton;
  }

  private createHTML(activeTypes: AddressTypeType[], inactiveTypes?: AddressTypeType[]): HTMLLIElement {
    this.view = createBaseElement({
      cssClasses: [styles.addressItem],
      tag: 'li',
    });

    activeTypes.forEach((type) => {
      this.setActiveAddressLabel(type);
    });

    if (inactiveTypes) {
      inactiveTypes.forEach((type) => {
        this.setActiveAddressLabel(type, true);
      });
    }

    const addressTextWrapper = createBaseElement({
      cssClasses: [styles.addressTextWrapper],
      tag: 'div',
    });
    addressTextWrapper.append(this.countrySpan, this.citySpan, this.streetNameSpan, this.postalCodeSpan);

    const buttonsWrapper = createBaseElement({
      cssClasses: [styles.buttonsWrapper],
      tag: 'div',
    });
    buttonsWrapper.append(this.editButton.getHTML(), this.deleteButton.getHTML());

    this.view.append(this.labelsWrapper, addressTextWrapper, buttonsWrapper);

    return this.view;
  }

  private createLabel(text: string, additionalStyles: string[], titleKey: TooltipTextKeysType): HTMLDivElement {
    const label = createBaseElement({
      cssClasses: [styles.addressType, ...additionalStyles],
      innerContent: text,
      tag: 'div',
      title: TOOLTIP_TEXT[getCurrentLanguage()][titleKey],
    });

    observeStore(selectCurrentLanguage, () => {
      label.title = TOOLTIP_TEXT[getCurrentLanguage()][titleKey];
    });

    return label;
  }

  private createLabelsWrapper(): HTMLDivElement {
    this.labelsWrapper = createBaseElement({
      cssClasses: [styles.labelsWrapper],
      tag: 'div',
    });
    return this.labelsWrapper;
  }

  private createPostalCodeSpan(): HTMLSpanElement {
    this.postalCodeSpan = createBaseElement({
      cssClasses: [styles.postalCodeSpan],
      innerContent: ADDRESS_TEXT[getCurrentLanguage()].POSTAL_CODE,
      tag: 'span',
    });

    observeStore(selectCurrentLanguage, () => {
      const text = ADDRESS_TEXT[getCurrentLanguage()].POSTAL_CODE;
      const textNode = [...this.postalCodeSpan.childNodes].find((child) => child.nodeType === Node.TEXT_NODE);
      if (textNode) {
        textNode.textContent = text;
      }
    });

    const accentSpan = createBaseElement({
      cssClasses: [styles.accentSpan],
      innerContent: this.currentAddress.postalCode,
      tag: 'span',
    });

    this.postalCodeSpan.append(accentSpan);
    return this.postalCodeSpan;
  }

  private createStreetNameSpan(): HTMLSpanElement {
    this.streetNameSpan = createBaseElement({
      cssClasses: [styles.streetNameSpan],
      innerContent: ADDRESS_TEXT[getCurrentLanguage()].STREET,
      tag: 'span',
    });

    observeStore(selectCurrentLanguage, () => {
      const text = ADDRESS_TEXT[getCurrentLanguage()].STREET;
      const textNode = [...this.streetNameSpan.childNodes].find((child) => child.nodeType === Node.TEXT_NODE);
      if (textNode) {
        textNode.textContent = text;
      }
    });

    const accentSpan = createBaseElement({
      cssClasses: [styles.accentSpan],
      innerContent: this.currentAddress.streetName,
      tag: 'span',
    });

    this.streetNameSpan.append(accentSpan);
    return this.streetNameSpan;
  }

  private setActiveAddressLabel(ActiveType: AddressTypeType, inactive?: boolean): void {
    let addressType = null;
    switch (ActiveType) {
      case ADDRESS_TYPE.BILLING:
        addressType = this.createLabel(ActiveType, [styles.billing], TOOLTIP_TEXT_KEYS.SWITCH_BILLING_ADDRESS);
        this.labelsWrapper.append(addressType);
        break;

      case ADDRESS_TYPE.SHIPPING:
        addressType = this.createLabel(ActiveType, [styles.shipping], TOOLTIP_TEXT_KEYS.SWITCH_SHIPPING_ADDRESS);
        this.labelsWrapper.append(addressType);
        break;

      case ADDRESS_TYPE.DEFAULT_BILLING:
        addressType = this.createLabel(
          ActiveType,
          [styles.defaultBilling],
          TOOLTIP_TEXT_KEYS.SWITCH_DEFAULT_BILLING_ADDRESS,
        );
        this.labelsWrapper.append(addressType);
        break;

      case ADDRESS_TYPE.DEFAULT_SHIPPING:
        addressType = this.createLabel(
          ActiveType,
          [styles.defaultShipping],
          TOOLTIP_TEXT_KEYS.SWITCH_DEFAULT_SHIPPING_ADDRESS,
        );
        this.labelsWrapper.append(addressType);
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

  public setDisabled(): void {
    this.view.classList.add(styles.disabled);
  }

  public setEnabled(): void {
    this.view.classList.remove(styles.disabled);
  }

  public toggleState(isDisabled: boolean): void {
    this.view.classList.toggle(styles.disabled, isDisabled);
  }
}

export default UserAddressView;
