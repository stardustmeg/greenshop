import type { BreadcrumbLink } from '@/shared/types/link.ts';
import type { Page } from '@/shared/types/page.ts';

import RouterModel from '@/app/Router/model/RouterModel.ts';
import BreadcrumbsModel from '@/features/Breadcrumbs/model/BreadcrumbsModel.ts';
import EventMediatorModel from '@/shared/EventMediator/model/EventMediatorModel.ts';
import modal from '@/shared/Modal/model/ModalModel.ts';
import getStore from '@/shared/Store/Store.ts';
import { setCurrentPage } from '@/shared/Store/actions.ts';
import observeStore, { selectCurrentLanguage } from '@/shared/Store/observer.ts';
import MEDIATOR_EVENT from '@/shared/constants/events.ts';
import { PAGE_ID, PAGE_TITLE } from '@/shared/constants/pages.ts';

import WishlistPageView from '../view/WishlistPageView.ts';

class WishlistPageModel implements Page {
  private view: WishlistPageView;

  constructor(parent: HTMLDivElement) {
    this.view = new WishlistPageView(parent);
    this.init();
  }

  private createBreadcrumbLinksData(): BreadcrumbLink[] {
    return [
      { link: PAGE_ID.MAIN_PAGE, name: PAGE_TITLE[getStore().getState().currentLanguage].main },
      { link: PAGE_ID.CATALOG_PAGE, name: PAGE_TITLE[getStore().getState().currentLanguage].catalog },
      { link: PAGE_ID.WISHLIST_PAGE, name: PAGE_TITLE[getStore().getState().currentLanguage].wishlist },
    ];
  }

  private init(): void {
    this.observeLanguage();
    this.initBreadcrumbs();
    modal.hide();
    getStore().dispatch(setCurrentPage(PAGE_ID.WISHLIST_PAGE));
    EventMediatorModel.getInstance().subscribe(MEDIATOR_EVENT.CHANGE_WISHLIST_BUTTON, (key) => {
      if (RouterModel.getCurrentPage() === PAGE_ID.WISHLIST_PAGE) {
        this.view.removeProductCard(String(key));
        modal.hide(() => RouterModel.getInstance().navigateTo(PAGE_ID.WISHLIST_PAGE));
      }
    });
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
