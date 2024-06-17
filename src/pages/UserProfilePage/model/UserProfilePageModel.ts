import type { Page } from '@/shared/types/page.ts';

import RouterModel from '@/app/Router/model/RouterModel.ts';
import getCustomerModel from '@/shared/API/customer/model/CustomerModel.ts';
import getStore from '@/shared/Store/Store.ts';
import { setCurrentPage } from '@/shared/Store/actions.ts';
import { SERVER_MESSAGE_KEY } from '@/shared/constants/messages.ts';
import { PAGE_ID } from '@/shared/constants/pages.ts';
import createBaseElement from '@/shared/utils/createBaseElement.ts';
import { showErrorMessage } from '@/shared/utils/userMessage.ts';
import UserInfoModel from '@/widgets/UserInfo/model/UserInfoModel.ts';

import UserProfilePageView from '../view/UserProfilePageView.ts';

class UserProfilePageModel implements Page {
  private userInfo: UserInfoModel | null = null;

  private view: UserProfilePageView | null = null;

  constructor(parent: HTMLDivElement) {
    const { isUserLoggedIn } = getStore().getState();
    if (!isUserLoggedIn) {
      RouterModel.getInstance().navigateTo(PAGE_ID.LOGIN_PAGE);
      showErrorMessage(SERVER_MESSAGE_KEY.NEED_LOGIN);
    } else {
      this.view = new UserProfilePageView(parent);
      this.init().catch(showErrorMessage);
    }
  }

  private async init(): Promise<void> {
    try {
      const user = await getCustomerModel().getCurrentUser();
      if (user) {
        this.userInfo = new UserInfoModel(user);
        this.view?.getUserProfileWrapper().append(this.userInfo.getHTML());
        getStore().dispatch(setCurrentPage(PAGE_ID.USER_PROFILE_PAGE));
      }
    } catch (error) {
      showErrorMessage(SERVER_MESSAGE_KEY.NEED_LOGIN);
    }
  }

  public getHTML(): HTMLDivElement {
    if (this.view) {
      return this.view.getHTML();
    }

    return createBaseElement({
      tag: 'div',
    });
  }
}

export default UserProfilePageModel;
