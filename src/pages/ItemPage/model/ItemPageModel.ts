import type { Page } from '@/shared/types/common.ts';

import getStore from '@/shared/Store/Store.ts';
import { setCurrentPage } from '@/shared/Store/actions.ts';
import { PAGE_ID } from '@/shared/constants/pages.ts';

import ItemPageView from '../view/ItemPageView.ts';

class ItemPageModel implements Page {
  private view: ItemPageView;

  constructor(parent: HTMLDivElement) {
    this.view = new ItemPageView(parent);
    this.init();
  }

  private init(): void {
    getStore().dispatch(setCurrentPage(PAGE_ID.ITEM_PAGE));
  }

  public getHTML(): HTMLDivElement {
    return this.view.getHTML();
  }
}

export default ItemPageModel;
