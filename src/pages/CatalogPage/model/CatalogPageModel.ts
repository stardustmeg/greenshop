import type { Page } from '@/shared/types/page.ts';

import getStore from '@/shared/Store/Store.ts';
import { setCurrentPage } from '@/shared/Store/actions.ts';
import { PAGE_ID } from '@/shared/constants/pages.ts';
import CatalogModel from '@/widgets/Catalog/model/CatalogModel.ts';

import CatalogPageView from '../view/CatalogPageView.ts';

class CatalogPageModel implements Page {
  private catalog = new CatalogModel();

  private view: CatalogPageView;

  constructor(parent: HTMLDivElement) {
    this.view = new CatalogPageView(parent);
    this.init();
  }

  private init(): void {
    getStore().dispatch(setCurrentPage(PAGE_ID.CATALOG_PAGE));
    this.getHTML().append(this.catalog.getHTML());
  }

  public getHTML(): HTMLDivElement {
    return this.view.getHTML();
  }
}

export default CatalogPageModel;
