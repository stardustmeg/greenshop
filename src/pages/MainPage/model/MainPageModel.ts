import type { Page } from '@/shared/types/common.ts';

import getStore from '@/shared/Store/Store.ts';
import { setCurrentPage } from '@/shared/Store/actions.ts';
import { PAGE_ID } from '@/shared/constants/pages.ts';

import MainPageView from '../view/MainPageView.ts';

class MainPageModel implements Page {
  private view: MainPageView;

  constructor(parent: HTMLDivElement) {
    this.view = new MainPageView(parent);
    this.init();
  }

  private init(): void {
    getStore().dispatch(setCurrentPage(PAGE_ID.MAIN_PAGE));
  }

  public getHTML(): HTMLDivElement {
    return this.view.getHTML();
  }
}

export default MainPageModel;
