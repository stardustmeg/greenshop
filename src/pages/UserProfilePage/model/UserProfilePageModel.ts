import type RouterModel from '@/app/Router/model/RouterModel.ts';
import type { Page } from '@/shared/types/common.ts';

import getCustomerModel from '@/shared/API/customer/model/CustomerModel.ts';
import serverMessageModel from '@/shared/ServerMessage/model/ServerMessageModel.ts';
import getStore from '@/shared/Store/Store.ts';
import { setCurrentPage, setCurrentUser } from '@/shared/Store/actions.ts';
import { MESSAGE_STATUS, SERVER_MESSAGE } from '@/shared/constants/messages.ts';
import { PAGE_ID } from '@/shared/constants/pages.ts';

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
      serverMessageModel.showServerMessage(
        SERVER_MESSAGE[getStore().getState().currentLanguage].BAD_REQUEST,
        MESSAGE_STATUS.ERROR,
      );
    }
    return true;
  }

  private setAccountLogoutButtonHandler(): boolean {
    const logoutButton = this.view.getAccountLogoutButton();
    logoutButton.getHTML().addEventListener('click', async () => {
      try {
        await this.logoutHandler();
      } catch {
        serverMessageModel.showServerMessage(
          SERVER_MESSAGE[getStore().getState().currentLanguage].BAD_REQUEST,
          MESSAGE_STATUS.ERROR,
        );
      }
    });
    return true;
  }

  public getHTML(): HTMLDivElement {
    return this.view.getHTML();
  }
}

export default UserProfilePageModel;
