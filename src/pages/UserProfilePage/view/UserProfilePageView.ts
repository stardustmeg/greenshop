import ButtonModel from '@/shared/Button/model/ButtonModel.ts';
import LinkModel from '@/shared/Link/model/LinkModel.ts';
import getStore from '@/shared/Store/Store.ts';
import { BUTTON_TEXT, BUTTON_TEXT_KEYS } from '@/shared/constants/buttons.ts';
import COUNTRIES_LIST from '@/shared/constants/countriesList.ts';
import { USER_INFO_MENU_LINK, USER_INFO_MENU_LINK_KEYS } from '@/shared/constants/pages.ts';
import clearOutElement from '@/shared/utils/clearOutElement.ts';
import createBaseElement from '@/shared/utils/createBaseElement.ts';
import findKeyByValue from '@/shared/utils/findKeyByValue.ts';
import observeCurrentLanguage from '@/shared/utils/observeCurrentLanguage.ts';

import styles from './userProfilePageView.module.scss';

class UserProfilePageView {
  private accountDetailsLink: LinkModel;

  private accountLogoutButton: ButtonModel;

  private accountMenu: HTMLUListElement;

  private addressesLink: LinkModel;

  private addressesWrapper: HTMLDivElement;

  private links: LinkModel[] = [];

  private ordersLink: LinkModel;

  private page: HTMLDivElement;

  private parent: HTMLDivElement;

  private supportLink: LinkModel;

  private userProfileWrapper: HTMLDivElement;

  private wishListLink: LinkModel;

  constructor(parent: HTMLDivElement) {
    this.parent = parent;
    clearOutElement(this.parent);

    this.accountLogoutButton = this.createLogoutButton();
    this.accountDetailsLink = this.createAccountDetailsLink();
    this.addressesLink = this.createAddressesLink();
    this.ordersLink = this.createOrdersLink();
    this.supportLink = this.createSupportLink();
    this.wishListLink = this.createWishListLink();
    this.accountMenu = this.createAccountMenu();

    this.addressesWrapper = this.createAddresses();

    this.userProfileWrapper = this.createUserProfileWrapper();
    this.page = this.createHTML();
  }

  private createAccountDetailsLink(): LinkModel {
    this.accountDetailsLink = new LinkModel({
      attrs: {
        href: '#account-details',
      },
      classes: [styles.link],
      text: USER_INFO_MENU_LINK[getStore().getState().currentLanguage].PERSONAL_INFO,
    });
    this.links.push(this.accountDetailsLink);

    observeCurrentLanguage(
      this.accountDetailsLink.getHTML(),
      USER_INFO_MENU_LINK,
      USER_INFO_MENU_LINK_KEYS.PERSONAL_INFO,
    );

    return this.accountDetailsLink;
  }

  private createAccountMenu(): HTMLUListElement {
    this.accountMenu = createBaseElement({
      cssClasses: [styles.accountMenu],
      tag: 'ul',
    });

    this.links.forEach((link) => {
      const li = createBaseElement({
        cssClasses: [styles.accountMenuItem],
        tag: 'li',
      });
      li.append(link.getHTML());

      this.accountMenu.append(li);
    });
    this.accountMenu.append(this.accountLogoutButton.getHTML());
    return this.accountMenu;
  }

  private createAddresses(): HTMLDivElement {
    const { currentUser } = getStore().getState();
    if (!currentUser) {
      return createBaseElement({
        cssClasses: [styles.addressesWrapper],
        tag: 'div',
      });
    }
    const { addresses, defaultBillingAddressId, defaultShippingAddressId, locale } = currentUser;
    this.addressesWrapper = createBaseElement({
      cssClasses: [styles.addressesWrapper],
      tag: 'div',
    });
    addresses.forEach((address) => {
      const country = findKeyByValue(COUNTRIES_LIST[locale], address.country);
      const standartAddressText = `${address.streetName}, ${address.city}, ${country}, ${address.postalCode}`;
      let addressText = `${standartAddressText}`;
      // TBD check the format of default addresses
      if (defaultBillingAddressId) {
        addressText = `${standartAddressText} (default billing address)`;
      }
      if (defaultShippingAddressId) {
        addressText = `${standartAddressText} (default shipping address)`;
      }
      const addressWrapper = this.createUserElement(addressText);
      this.addressesWrapper.append(addressWrapper);
    });
    return this.addressesWrapper;
  }

  private createAddressesLink(): LinkModel {
    this.addressesLink = new LinkModel({
      attrs: {
        href: '#addresses',
      },
      classes: [styles.link],
      text: USER_INFO_MENU_LINK[getStore().getState().currentLanguage].ADDRESSES,
    });
    this.links.push(this.addressesLink);

    observeCurrentLanguage(this.addressesLink.getHTML(), USER_INFO_MENU_LINK, USER_INFO_MENU_LINK_KEYS.ADDRESSES);

    return this.addressesLink;
  }

  private createHTML(): HTMLDivElement {
    this.page = createBaseElement({
      cssClasses: [styles.userProfilePage],
      tag: 'div',
    });

    this.page.append(this.userProfileWrapper);
    this.parent.append(this.page);

    return this.page;
  }

  private createLogoutButton(): ButtonModel {
    this.accountLogoutButton = new ButtonModel({
      classes: [styles.logoutButton],
      text: BUTTON_TEXT[getStore().getState().currentLanguage].LOG_OUT,
    });

    observeCurrentLanguage(this.accountLogoutButton.getHTML(), BUTTON_TEXT, BUTTON_TEXT_KEYS.LOG_OUT);

    return this.accountLogoutButton;
  }

  private createOrdersLink(): LinkModel {
    this.ordersLink = new LinkModel({
      attrs: {
        href: '#orders',
      },
      classes: [styles.link],
      text: USER_INFO_MENU_LINK[getStore().getState().currentLanguage].ORDERS,
    });
    this.links.push(this.ordersLink);

    observeCurrentLanguage(this.ordersLink.getHTML(), USER_INFO_MENU_LINK, USER_INFO_MENU_LINK_KEYS.ORDERS);

    return this.ordersLink;
  }

  private createSupportLink(): LinkModel {
    this.supportLink = new LinkModel({
      attrs: {
        href: '#support',
      },
      classes: [styles.link],
      text: USER_INFO_MENU_LINK[getStore().getState().currentLanguage].SUPPORT,
    });
    this.links.push(this.supportLink);

    observeCurrentLanguage(this.supportLink.getHTML(), USER_INFO_MENU_LINK, USER_INFO_MENU_LINK_KEYS.SUPPORT);

    return this.supportLink;
  }

  private createUserElement(
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

  private createUserProfileWrapper(): HTMLDivElement {
    this.userProfileWrapper = createBaseElement({
      cssClasses: [styles.userProfileWrapper],
      tag: 'div',
    });

    this.userProfileWrapper.append(this.accountMenu);
    return this.userProfileWrapper;
  }

  private createWishListLink(): LinkModel {
    this.wishListLink = new LinkModel({
      attrs: {
        href: '#wishlist',
      },
      classes: [styles.link],
      text: USER_INFO_MENU_LINK[getStore().getState().currentLanguage].WISHLIST,
    });
    this.links.push(this.wishListLink);

    observeCurrentLanguage(this.wishListLink.getHTML(), USER_INFO_MENU_LINK, USER_INFO_MENU_LINK_KEYS.WISHLIST);

    return this.wishListLink;
  }

  public getAccountLogoutButton(): ButtonModel {
    return this.accountLogoutButton;
  }

  public getHTML(): HTMLDivElement {
    return this.page;
  }
}
export default UserProfilePageView;
