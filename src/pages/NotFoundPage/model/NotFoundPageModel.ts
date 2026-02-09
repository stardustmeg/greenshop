import type { Page } from '@/shared/types/page.ts';

import RouterModel from '@/app/Router/model/RouterModel.ts';
import getStore from '@/shared/Store/Store.ts';
import { setCurrentPage } from '@/shared/Store/actions.ts';
import { PAGE_ID } from '@/shared/constants/pages.ts';

import NotFoundPageView from '../view/NotFoundPageView.ts';

class NotFoundPageModel implements Page {
  private view: NotFoundPageView;

  constructor(parent: HTMLDivElement) {
    this.view = new NotFoundPageView(parent);
    this.init();
  }

  private init(): boolean {
    getStore().dispatch(setCurrentPage(PAGE_ID.NOT_FOUND_PAGE));
    this.toMainButtonHandler();
    return true;
  }

  private toMainButtonHandler(): boolean {
    const toMainButton = this.view.getToMainButton().getHTML();
    toMainButton.addEventListener('click', () => RouterModel.getInstance().navigateTo(PAGE_ID.MAIN_PAGE));
    return true;
  }

  public getHTML(): HTMLDivElement {
    return this.view.getHTML();
  }
}

export default NotFoundPageModel;
