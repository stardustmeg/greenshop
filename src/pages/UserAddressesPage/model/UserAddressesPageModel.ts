import type { Page } from '@/shared/types/page.ts';

import RouterModel from '@/app/Router/model/RouterModel.ts';
import getCustomerModel from '@/shared/API/customer/model/CustomerModel.ts';
import getStore from '@/shared/Store/Store.ts';
import { setCurrentPage } from '@/shared/Store/actions.ts';
import { SERVER_MESSAGE_KEY } from '@/shared/constants/messages.ts';
import { PAGE_ID } from '@/shared/constants/pages.ts';
import createBaseElement from '@/shared/utils/createBaseElement.ts';
import { showErrorMessage } from '@/shared/utils/userMessage.ts';
import UserAddressesModel from '@/widgets/UserAddresses/model/UserAddressesModel.ts';

import UserAddressesPageView from '../view/UserAddressesPageView.ts';

class UserAddressesPageModel implements Page {
  private addresses: UserAddressesModel | null = null;

  private view: UserAddressesPageView | null = null;

  constructor(parent: HTMLDivElement) {
    const { isUserLoggedIn } = getStore().getState();
    if (!isUserLoggedIn) {
      RouterModel.getInstance().navigateTo(PAGE_ID.LOGIN_PAGE);
      showErrorMessage(SERVER_MESSAGE_KEY.NEED_LOGIN);
    } else {
      this.view = new UserAddressesPageView(parent);
      this.init().catch(showErrorMessage);
    }
  }

  private async init(): Promise<void> {
    try {
      const user = await getCustomerModel().getCurrentUser();
      if (user) {
        this.addresses = new UserAddressesModel(user);
        this.view?.getHTML().append(this.addresses.getHTML());
        getStore().dispatch(setCurrentPage(PAGE_ID.USER_ADDRESSES_PAGE));
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

export default UserAddressesPageModel;
