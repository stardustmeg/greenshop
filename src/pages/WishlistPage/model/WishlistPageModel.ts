import type { BreadcrumbLink } from '@/shared/types/link.ts';
import type { Page } from '@/shared/types/page.ts';

import BreadcrumbsModel from '@/features/Breadcrumbs/model/BreadcrumbsModel.ts';
import getStore from '@/shared/Store/Store.ts';
import { setCurrentPage } from '@/shared/Store/actions.ts';
import { PAGE_ID } from '@/shared/constants/pages.ts';
import { buildCatalogPathName, buildMainPathName, buildWishlistPathName } from '@/shared/utils/buildPathname.ts';

import WishlistPageView from '../view/WishlistPageView.ts';

class WishlistPageModel implements Page {
  private breadcrumbs = new BreadcrumbsModel();

  private view: WishlistPageView;

  constructor(parent: HTMLDivElement) {
    this.view = new WishlistPageView(parent);
    this.init();
  }

  private createBreadcrumbLinksData(): BreadcrumbLink[] {
    return [
      { link: buildMainPathName(), name: PAGE_ID.MAIN_PAGE.toString() },
      { link: buildCatalogPathName(), name: PAGE_ID.CATALOG_PAGE.toString() },
      { link: buildWishlistPathName(), name: PAGE_ID.WISHLIST_PAGE.toString() },
    ];
  }

  private init(): void {
    this.initBreadcrumbs();
    getStore().dispatch(setCurrentPage(PAGE_ID.WISHLIST_PAGE));
  }

  private initBreadcrumbs(): void {
    this.breadcrumbs.addBreadcrumbLinks(this.createBreadcrumbLinksData());
    this.getHTML().append(this.breadcrumbs.getHTML());
  }

  public getHTML(): HTMLDivElement {
    return this.view.getHTML();
  }
}

export default WishlistPageModel;
