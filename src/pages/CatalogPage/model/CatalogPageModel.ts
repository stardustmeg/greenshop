import type { Page, PageParams } from '@/shared/types/page.ts';

import getStore from '@/shared/Store/Store.ts';
import { setCurrentPage } from '@/shared/Store/actions.ts';
import { PAGE_ID } from '@/shared/constants/pages.ts';
import CatalogModel from '@/widgets/Catalog/model/CatalogModel.ts';

import CatalogPageView from '../view/CatalogPageView.ts';

class CatalogPageModel implements Page {
  private catalog: CatalogModel;

  private view: CatalogPageView;

  constructor(parent: HTMLDivElement, params: PageParams) {
    this.view = new CatalogPageView(parent);
    this.catalog = new CatalogModel(params.catalog?.searchParams || '');
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
