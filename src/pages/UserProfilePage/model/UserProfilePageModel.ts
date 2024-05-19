import type RouterModel from '@/app/Router/model/RouterModel.ts';
import type { Page } from '@/shared/types/page.ts';

import UserAddressModel from '@/entities/UserAddress/model/UserAddressModel.ts';
import UserInfoModel from '@/entities/UserInfo/model/UserInfoModel.ts';
import getCustomerModel from '@/shared/API/customer/model/CustomerModel.ts';
import getStore from '@/shared/Store/Store.ts';
import { setCurrentPage, setCurrentUser, switchIsUserLoggedIn } from '@/shared/Store/actions.ts';
import { PAGE_ID } from '@/shared/constants/pages.ts';

import UserProfilePageView from '../view/UserProfilePageView.ts';

class UserProfilePageModel implements Page {
  private addresses = new UserAddressModel();

  private router: RouterModel | null = null;

  private userInfo = new UserInfoModel();

  private view: UserProfilePageView;

  constructor(parent: HTMLDivElement, router: RouterModel | null) {
    this.router = router;
    this.view = new UserProfilePageView(parent);

    this.setAddressesLinkHandler();
    this.setPersonalInfoLinkHandler();
    this.init();
  }

  private addressesLinkHandler(): void {
    this.userInfo.hide();
    this.addresses.show();
  }

  private init(): void {
    this.view.getUserProfileWrapper().append(this.userInfo.getHTML(), this.addresses.getHTML());
    this.setAccountLogoutButtonHandler();
    getStore().dispatch(setCurrentPage(PAGE_ID.USER_PROFILE_PAGE));
  }

  private logoutHandler(): void {
    localStorage.clear();
    getStore().dispatch(setCurrentUser(null));
    getStore().dispatch(switchIsUserLoggedIn(false));
    getCustomerModel().logout();
    this.router?.navigateTo(PAGE_ID.LOGIN_PAGE);
  }

  private personalInfoLinkHandler(): void {
    this.addresses.hide();
    this.userInfo.show();
  }

  private setAccountLogoutButtonHandler(): void {
    const logoutButton = this.view.getAccountLogoutButton();
    logoutButton.getHTML().addEventListener('click', () => this.logoutHandler());
  }

  private setAddressesLinkHandler(): void {
    const addressesLink = this.view.getAddressesLink();
    addressesLink.getHTML().addEventListener('click', () => this.addressesLinkHandler());
  }

  private setPersonalInfoLinkHandler(): void {
    const personalInfoLink = this.view.getPersonalInfoLink();
    personalInfoLink.getHTML().addEventListener('click', () => this.personalInfoLinkHandler());
  }

  public getHTML(): HTMLDivElement {
    return this.view.getHTML();
  }
}

export default UserProfilePageModel;
