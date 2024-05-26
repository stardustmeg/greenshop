import type { UserAddressType } from '@/shared/constants/forms.ts';
import type { Address, User } from '@/shared/types/user';

import ButtonModel from '@/shared/Button/model/ButtonModel.ts';
import getStore from '@/shared/Store/Store.ts';
import observeStore, { selectCurrentLanguage } from '@/shared/Store/observer.ts';
import COUNTRIES_LIST from '@/shared/constants/countriesList.ts';
import { USER_ADDRESS_TYPE } from '@/shared/constants/forms.ts';
import SVG_DETAILS from '@/shared/constants/svg.ts';
import TOOLTIP_TEXT from '@/shared/constants/tooltip.ts';
import createBaseElement from '@/shared/utils/createBaseElement.ts';
import createSVGUse from '@/shared/utils/createSVGUse.ts';
import findKeyByValue from '@/shared/utils/findKeyByValue.ts';
import {
  addressMessage,
  addressTemplate,
  defaultBillingAddress,
  defaultShippingAddress,
} from '@/shared/utils/messageTemplates.ts';

import styles from './userAddressView.module.scss';

class UserAddressView {
  private deleteButton: ButtonModel;

  private deleteLogo: HTMLDivElement;

  private editButton: ButtonModel;

  private editLogo: HTMLDivElement;

  private view: HTMLLIElement;

  constructor(user: User, address: Address, type: UserAddressType, defaultAddressId: string) {
    this.deleteLogo = this.createDeleteLogo();
    this.editLogo = this.createEditLogo();
    this.deleteButton = this.createDeleteButton();
    this.editButton = this.createEditButton();
    this.view = this.createHTML(user, address, type, defaultAddressId);
  }

  private createAddress(user: User, address: Address, type: UserAddressType, defaultAddressId: string): string {
    const { locale } = user;

    const country = findKeyByValue(COUNTRIES_LIST[locale], address.country);
    const standartAddressText = addressTemplate(address.streetName, address.city, country, address.postalCode);
    let addressText = addressMessage(standartAddressText, type);

    if (defaultAddressId === address.id) {
      if (type === USER_ADDRESS_TYPE.BILLING) {
        addressText = defaultBillingAddress(standartAddressText);
      } else if (type === USER_ADDRESS_TYPE.SHIPPING) {
        addressText = defaultShippingAddress(standartAddressText);
      }
    }
    return addressText;
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

  private createHTML(user: User, address: Address, type: UserAddressType, defaultAddressId: string): HTMLLIElement {
    this.view = createBaseElement({
      attributes: { 'data-type': type },
      cssClasses: [styles.info],
      tag: 'li',
    });
    const addressText = createBaseElement({
      cssClasses: [styles.addressText],
      innerContent: this.createAddress(user, address, type, defaultAddressId),
      tag: 'span',
    });

    this.view.append(addressText, this.editButton.getHTML(), this.deleteButton.getHTML());
    return this.view;
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
}

export default UserAddressView;
