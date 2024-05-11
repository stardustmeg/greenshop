import type RouterModel from '@/app/Router/model/RouterModel.ts';
import type { Page } from '@/shared/types/common.ts';

import getCustomerModel from '@/shared/API/customer/model/CustomerModel.ts';
import getStore from '@/shared/Store/Store.ts';
import { setCurrentPage, setCurrentUser } from '@/shared/Store/actions.ts';
import { PAGE_ID } from '@/shared/constants/pages.ts';
import showErrorMessage from '@/shared/utils/userMessage.ts';

import UserProfilePageView from '../view/UserProfilePageView.ts';

class UserProfilePageModel implements Page {
  private router: RouterModel;

  private view: UserProfilePageView;

  constructor(parent: HTMLDivElement, router: RouterModel) {
    this.router = router;
    this.view = new UserProfilePageView(parent);
    this.init();
  }

  private init(): void {
    this.setAccountLogoutButtonHandler();
    getStore().dispatch(setCurrentPage(PAGE_ID.USER_PROFILE_PAGE));
  }

  private async logoutHandler(): Promise<boolean> {
    localStorage.clear();
    getStore().dispatch(setCurrentUser(null));
    try {
      getCustomerModel().logout();
      await this.router.navigateTo(PAGE_ID.LOGIN_PAGE);
    } catch {
      showErrorMessage();
    }
    return true;
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

  public getHTML(): HTMLDivElement {
    return this.view.getHTML();
  }
}

export default UserProfilePageModel;
