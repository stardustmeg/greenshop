import type { Page } from '@/shared/types/common.ts';

import getStore from '@/shared/Store/Store.ts';
import { setCurrentPage } from '@/shared/Store/actions.ts';
import { PAGE_ID } from '@/shared/constants/pages.ts';

import UserProfilePageView from '../view/UserProfilePageView.ts';

class UserProfilePageModel implements Page {
  private view: UserProfilePageView;

  constructor(parent: HTMLDivElement) {
    this.view = new UserProfilePageView(parent);
    this.init();
  }

  private init(): void {
    getStore().dispatch(setCurrentPage(PAGE_ID.MAIN_PAGE));
  }

  public getHTML(): HTMLDivElement {
    return this.view.getHTML();
  }
}

export default UserProfilePageModel;
