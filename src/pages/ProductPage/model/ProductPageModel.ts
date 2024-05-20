import type { Page, PageParams } from '@/shared/types/page.ts';

import getStore from '@/shared/Store/Store.ts';
import { setCurrentPage } from '@/shared/Store/actions.ts';
import { PAGE_ID } from '@/shared/constants/pages.ts';

import ProductPageView from '../view/ProductPageView.ts';

class ProductPageModel implements Page {
  private view: ProductPageView;

  constructor(parent: HTMLDivElement, params: PageParams) {
    this.view = new ProductPageView(parent);
    this.init();
    // eslint-disable-next-line no-console
    console.log(params, params.product);
  }

  private init(): void {
    getStore().dispatch(setCurrentPage(PAGE_ID.PRODUCT_PAGE));
  }

  public getHTML(): HTMLDivElement {
    return this.view.getHTML();
  }
}

export default ProductPageModel;
