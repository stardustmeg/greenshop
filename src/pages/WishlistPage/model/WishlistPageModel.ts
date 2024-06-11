import type { BreadcrumbLink } from '@/shared/types/link.ts';
import type { Page } from '@/shared/types/page.ts';

import BreadcrumbsModel from '@/features/Breadcrumbs/model/BreadcrumbsModel.ts';
import getStore from '@/shared/Store/Store.ts';
import { setCurrentPage } from '@/shared/Store/actions.ts';
import observeStore, { selectCurrentLanguage } from '@/shared/Store/observer.ts';
import { PAGE_ID, PAGE_TITLE } from '@/shared/constants/pages.ts';
import getCurrentLanguage from '@/shared/utils/getCurrentLanguage.ts';

import WishlistPageView from '../view/WishlistPageView.ts';

class WishlistPageModel implements Page {
  private view: WishlistPageView;

  constructor(parent: HTMLDivElement) {
    this.view = new WishlistPageView(parent);
    this.init();

    this.observeLanguage();
  }

  private createBreadcrumbLinksData(): BreadcrumbLink[] {
    return [
      { link: PAGE_ID.MAIN_PAGE, name: PAGE_TITLE[getCurrentLanguage()].main },
      { link: PAGE_ID.CATALOG_PAGE, name: PAGE_TITLE[getCurrentLanguage()].catalog },
      { link: PAGE_ID.WISHLIST_PAGE, name: PAGE_TITLE[getCurrentLanguage()].wishlist },
    ];
  }

  private init(): void {
    this.initBreadcrumbs();
    getStore().dispatch(setCurrentPage(PAGE_ID.WISHLIST_PAGE));
  }

  private initBreadcrumbs(): void {
    const breadcrumbsContainer = this.view.getBreadcrumbsContainer();
    const breadcrumbs = new BreadcrumbsModel();
    breadcrumbs.addBreadcrumbLinks(this.createBreadcrumbLinksData());

    while (breadcrumbsContainer.firstChild) {
      breadcrumbsContainer.removeChild(breadcrumbsContainer.firstChild);
    }
    breadcrumbsContainer.appendChild(breadcrumbs.getHTML());
  }

  private observeLanguage(): void {
    observeStore(selectCurrentLanguage, () => {
      this.initBreadcrumbs();
    });
  }

  public getHTML(): HTMLDivElement {
    return this.view.getHTML();
  }
}

export default WishlistPageModel;
