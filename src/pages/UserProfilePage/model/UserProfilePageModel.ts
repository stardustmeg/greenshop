import type { Page } from '@/shared/types/page.ts';

import RouterModel from '@/app/Router/model/RouterModel.ts';
import getCustomerModel from '@/shared/API/customer/model/CustomerModel.ts';
import getStore from '@/shared/Store/Store.ts';
import { setAuthToken, setCurrentPage, switchIsUserLoggedIn } from '@/shared/Store/actions.ts';
import { PAGE_ID } from '@/shared/constants/pages.ts';
import showErrorMessage from '@/shared/utils/userMessage.ts';
import UserAddressesModel from '@/widgets/UserAddresses/model/UserAddressesModel.ts';
import UserInfoModel from '@/widgets/UserInfo/model/UserInfoModel.ts';

import UserProfilePageView from '../view/UserProfilePageView.ts';

class UserProfilePageModel implements Page {
  private addresses: UserAddressesModel | null = null;

  private userInfo: UserInfoModel | null = null;

  private view: UserProfilePageView;

  constructor(parent: HTMLDivElement) {
    this.view = new UserProfilePageView(parent);

    this.setAddressesLinkHandler();
    this.setPersonalInfoLinkHandler();
    this.init().catch(showErrorMessage);
  }

  private addressesLinkHandler(): void {
    this.userInfo?.hide();
    this.addresses?.show();
  }

  private async init(): Promise<void> {
    try {
      const user = await getCustomerModel().getCurrentUser();

      if (user) {
        this.userInfo = new UserInfoModel(user);
        this.addresses = new UserAddressesModel(user);
        this.view.getUserProfileWrapper().append(this.userInfo.getHTML(), this.addresses.getHTML());
        this.setAccountLogoutButtonHandler();
        getStore().dispatch(setCurrentPage(PAGE_ID.USER_PROFILE_PAGE));
      }
    } catch (error) {
      showErrorMessage();
    }
  }

  private logoutHandler(): void {
    localStorage.clear();
    getStore().dispatch(setAuthToken(null));
    getStore().dispatch(switchIsUserLoggedIn(false));
    getCustomerModel().logout().catch(showErrorMessage);
    RouterModel.getInstance().navigateTo(PAGE_ID.LOGIN_PAGE);
  }

  private personalInfoLinkHandler(): void {
    this.addresses?.hide();
    this.userInfo?.show();
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
