import type { Page } from '@/shared/types/common.ts';

import getStore from '@/shared/Store/Store.ts';
import { setCurrentPage } from '@/shared/Store/actions.ts';
import { PAGE_ID } from '@/shared/constants/pages.ts';

import CatalogPageView from '../view/CatalogPageView.ts';

class CatalogPageModel implements Page {
  private view: CatalogPageView;

  constructor(parent: HTMLDivElement) {
    this.view = new CatalogPageView(parent);
    this.init();
  }

  private init(): void {
    getStore().dispatch(setCurrentPage(PAGE_ID.CATALOG_PAGE));
  }

  public getHTML(): HTMLDivElement {
    return this.view.getHTML();
  }
}

export default CatalogPageModel;
