import ButtonModel from '@/shared/Button/model/ButtonModel.ts';
import LinkModel from '@/shared/Link/model/LinkModel.ts';
import getStore from '@/shared/Store/Store.ts';
import { BUTTON_TEXT, BUTTON_TEXT_KEYS } from '@/shared/constants/buttons.ts';
import createBaseElement from '@/shared/utils/createBaseElement.ts';
import observeCurrentLanguage from '@/shared/utils/observeCurrentLanguage.ts';

import styles from './userProfilePageView.module.scss';

class UserProfilePageView {
  private accountDetailsLink: LinkModel;

  private accountLogoutButton: ButtonModel;

  private accountMenu: HTMLUListElement;

  private addressesLink: LinkModel;

  private links: LinkModel[] = [];

  private ordersLink: LinkModel;

  private page: HTMLDivElement;

  private parent: HTMLDivElement;

  private supportLink: LinkModel;

  private userInfoWrapper: HTMLDivElement;

  private wishListLink: LinkModel;

  constructor(parent: HTMLDivElement) {
    this.parent = parent;
    this.parent.innerHTML = '';
    this.userInfoWrapper = this.createUserInfoWrapper();

    this.accountLogoutButton = this.createLogoutButton();
    this.accountDetailsLink = this.createAccountDetailsLink();
    this.addressesLink = this.createAddressesLink();
    this.ordersLink = this.createOrdersLink();
    this.supportLink = this.createSupportLink();
    this.wishListLink = this.createWishListLink();
    this.accountMenu = this.createAccountMenu();
    this.page = this.createHTML();
  }

  private createAccountDetailsLink(): LinkModel {
    this.accountDetailsLink = new LinkModel({
      attrs: {
        href: '#account-details',
      },
      classes: [styles.accountDetailsLink],
      text: 'Account Details',
    });
    this.links.push(this.accountDetailsLink);
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

  private createAddressesLink(): LinkModel {
    this.addressesLink = new LinkModel({
      attrs: {
        href: '#addresses',
      },
      classes: [styles.addressesLink],
      text: 'Addresses',
    });
    this.links.push(this.addressesLink);
    return this.addressesLink;
  }

  private createHTML(): HTMLDivElement {
    this.page = createBaseElement({
      cssClasses: [styles.userProfilePage],
      tag: 'div',
    });

    this.page.append(this.accountMenu, this.userInfoWrapper);
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
      classes: [styles.ordersLink],
      text: 'Orders',
    });
    this.links.push(this.ordersLink);
    return this.ordersLink;
  }

  private createSupportLink(): LinkModel {
    this.supportLink = new LinkModel({
      attrs: {
        href: '#support',
      },
      classes: [styles.supportLink],
      text: 'Support',
    });
    this.links.push(this.supportLink);
    return this.supportLink;
  }

  private createUserInfoWrapper(): HTMLDivElement {
    this.userInfoWrapper = createBaseElement({
      cssClasses: [styles.userInfoWrapper],
      tag: 'div',
    });
    return this.userInfoWrapper;
  }

  private createWishListLink(): LinkModel {
    this.wishListLink = new LinkModel({
      attrs: {
        href: '#wishlist',
      },
      classes: [styles.wishListLink],
      text: 'Wishlist',
    });
    this.links.push(this.wishListLink);
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
