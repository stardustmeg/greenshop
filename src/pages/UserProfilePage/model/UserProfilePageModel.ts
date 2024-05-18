import type RouterModel from '@/app/Router/model/RouterModel.ts';
import type { Page } from '@/shared/types/common.ts';

import UserAddressModel from '@/entities/UserAddress/model/UserAddressModel.ts';
import UserInfoModel from '@/entities/UserInfo/model/UserInfoModel.ts';
import getCustomerModel from '@/shared/API/customer/model/CustomerModel.ts';
import getStore from '@/shared/Store/Store.ts';
import { setAuthToken, setCurrentPage, setCurrentUser, switchIsUserLoggedIn } from '@/shared/Store/actions.ts';
import { PAGE_ID } from '@/shared/constants/pages.ts';
import showErrorMessage from '@/shared/utils/userMessage.ts';

import UserProfilePageView from '../view/UserProfilePageView.ts';

class UserProfilePageModel implements Page {
  private addresses: UserAddressModel | null = null;

  private router: RouterModel;

  private userInfo: UserInfoModel | null = null;

  private view: UserProfilePageView;

  constructor(parent: HTMLDivElement, router: RouterModel) {
    this.router = router;
    this.view = new UserProfilePageView(parent);

    this.setAddressesLinkHandler();
    this.setPersonalInfoLinkHandler();
    this.init();
  }

  private addressesLinkHandler(): void {
    this.userInfo?.hide();
    this.addresses?.show();
  }

  private init(): void {
    getCustomerModel()
      .getCurrentUser()
      .then((user) => {
        if (user) {
          this.userInfo = new UserInfoModel(user);
          this.addresses = new UserAddressModel(user);
          this.view.getUserProfileWrapper().append(this.userInfo.getHTML(), this.addresses.getHTML());
          this.setAccountLogoutButtonHandler();
          getStore().dispatch(setCurrentPage(PAGE_ID.USER_PROFILE_PAGE));
        }
      })
      .catch(showErrorMessage);
  }

  private async logoutHandler(): Promise<boolean> {
    localStorage.clear();
    getStore().dispatch(setCurrentUser(null));
    getStore().dispatch(setAuthToken(null));
    getStore().dispatch(switchIsUserLoggedIn(false));
    try {
      getCustomerModel().logout();
      await this.router.navigateTo(PAGE_ID.LOGIN_PAGE);
    } catch {
      showErrorMessage();
    }
    return true;
  }

  private personalInfoLinkHandler(): void {
    this.addresses?.hide();
    this.userInfo?.show();
  }

  private setAccountLogoutButtonHandler(): boolean {
    const logoutButton = this.view.getAccountLogoutButton();
    logoutButton.getHTML().addEventListener('click', async () => {
      try {
        await this.logoutHandler();
      } catch {
        showErrorMessage();
      }
    });
    return true;
  }

  private setAddressesLinkHandler(): void {
    const addressesLink = this.view.getAddressesLink();
    addressesLink.getHTML().addEventListener('click', () => {
      this.addressesLinkHandler();
    });
  }

  private setPersonalInfoLinkHandler(): void {
    const personalInfoLink = this.view.getPersonalInfoLink();
    personalInfoLink.getHTML().addEventListener('click', () => {
      this.personalInfoLinkHandler();
    });
  }

  public getHTML(): HTMLDivElement {
    return this.view.getHTML();
  }
}

export default UserProfilePageModel;
