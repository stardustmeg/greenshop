import ButtonModel from '@/shared/Button/model/ButtonModel.ts';
import LinkModel from '@/shared/Link/model/LinkModel.ts';
import getStore from '@/shared/Store/Store.ts';
import { BUTTON_TEXT, BUTTON_TEXT_KEYS } from '@/shared/constants/buttons.ts';
import { USER_PROFILE_MENU_LINK } from '@/shared/constants/links.ts';
import { USER_INFO_MENU_LINK, USER_INFO_MENU_LINK_KEYS } from '@/shared/constants/pages.ts';
import clearOutElement from '@/shared/utils/clearOutElement.ts';
import createBaseElement from '@/shared/utils/createBaseElement.ts';
import observeCurrentLanguage from '@/shared/utils/observeCurrentLanguage.ts';

import styles from './userProfilePageView.module.scss';

class UserProfilePageView {
  private accountLogoutButton: ButtonModel;

  private accountMenu: HTMLUListElement;

  private addressesLink: LinkModel;

  private links: LinkModel[] = [];

  private ordersLink: LinkModel;

  private page: HTMLDivElement;

  private parent: HTMLDivElement;

  private personalInfoLink: LinkModel;

  private supportLink: LinkModel;

  private userProfileWrapper: HTMLDivElement;

  constructor(parent: HTMLDivElement) {
    this.parent = parent;
    clearOutElement(this.parent);

    this.accountLogoutButton = this.createLogoutButton();
    this.personalInfoLink = this.createPersonalInfoLink();
    this.addressesLink = this.createAddressesLink();
    this.ordersLink = this.createOrdersLink();
    this.supportLink = this.createSupportLink();
    this.accountMenu = this.createAccountMenu();

    this.setLinksHandlers();
    this.userProfileWrapper = this.createUserProfileWrapper();
    this.page = this.createHTML();
    window.scrollTo(0, 0);
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
        href: USER_PROFILE_MENU_LINK.ADDRESSES,
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
        href: USER_PROFILE_MENU_LINK.ORDERS,
      },
      classes: [styles.link],
      text: USER_INFO_MENU_LINK[getStore().getState().currentLanguage].ORDERS,
    });
    this.links.push(this.ordersLink);

    observeCurrentLanguage(this.ordersLink.getHTML(), USER_INFO_MENU_LINK, USER_INFO_MENU_LINK_KEYS.ORDERS);

    return this.ordersLink;
  }

  private createPersonalInfoLink(): LinkModel {
    this.personalInfoLink = new LinkModel({
      attrs: {
        href: USER_PROFILE_MENU_LINK.PERSONAL_INFO,
      },
      classes: [styles.link],
      text: USER_INFO_MENU_LINK[getStore().getState().currentLanguage].PERSONAL_INFO,
    });
    this.links.push(this.personalInfoLink);

    observeCurrentLanguage(
      this.personalInfoLink.getHTML(),
      USER_INFO_MENU_LINK,
      USER_INFO_MENU_LINK_KEYS.PERSONAL_INFO,
    );
    this.personalInfoLink.getHTML().classList.add(styles.active);
    this.personalInfoLink.setDisabled();
    return this.personalInfoLink;
  }

  private createSupportLink(): LinkModel {
    this.supportLink = new LinkModel({
      attrs: {
        href: USER_PROFILE_MENU_LINK.SUPPORT,
      },
      classes: [styles.link],
      text: USER_INFO_MENU_LINK[getStore().getState().currentLanguage].SUPPORT,
    });
    this.links.push(this.supportLink);

    observeCurrentLanguage(this.supportLink.getHTML(), USER_INFO_MENU_LINK, USER_INFO_MENU_LINK_KEYS.SUPPORT);

    return this.supportLink;
  }

  private createUserProfileWrapper(): HTMLDivElement {
    this.userProfileWrapper = createBaseElement({
      cssClasses: [styles.userProfileWrapper],
      tag: 'div',
    });

    this.userProfileWrapper.append(this.accountMenu);
    return this.userProfileWrapper;
  }

  private setLinksHandlers(): boolean {
    this.links.forEach((link) => {
      link.getHTML().addEventListener('click', (event) => {
        event.preventDefault();
        // TBD replace route with route
        const route = link.getHTML().attributes.getNamedItem('href')?.value;
        if (route) {
          this.switchActiveLink(route);
        }
      });
    });
    return true;
  }

  private switchActiveLink(route: string): void {
    this.links.forEach((link) => {
      link.getHTML().classList.remove(styles.active);
      link.setEnabled();
    });

    const currentLink = this.links.find((link) => link.getHTML().attributes.getNamedItem('href')?.value === route);

    if (currentLink) {
      currentLink.getHTML().classList.add(styles.active);
      currentLink.setDisabled();
    }
  }

  public getAccountLogoutButton(): ButtonModel {
    return this.accountLogoutButton;
  }

  public getAddressesLink(): LinkModel {
    return this.addressesLink;
  }

  public getHTML(): HTMLDivElement {
    return this.page;
  }

  public getLinks(): LinkModel[] {
    return this.links;
  }

  public getPersonalInfoLink(): LinkModel {
    return this.personalInfoLink;
  }

  public getUserProfileWrapper(): HTMLDivElement {
    return this.userProfileWrapper;
  }
}
export default UserProfilePageView;
