import type { Page } from '@/shared/types/common.ts';

import getStore from '@/shared/Store/Store.ts';
import { setCurrentPage } from '@/shared/Store/actions.ts';
import { PAGE_ID } from '@/shared/constants/pages.ts';

import AboutUsPageView from '../view/AboutUsPageView.ts';

class AboutUsPageModel implements Page {
  private view: AboutUsPageView;

  constructor(parent: HTMLDivElement) {
    this.view = new AboutUsPageView(parent);
    this.init();
  }

  private init(): void {
    getStore().dispatch(setCurrentPage(PAGE_ID.ABOUT_US_PAGE));
  }

  public getHTML(): HTMLDivElement {
    return this.view.getHTML();
  }
}

export default AboutUsPageModel;
