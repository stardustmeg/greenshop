import type { BreadCrumbLink } from '@/shared/types/link.ts';
import type { Page } from '@/shared/types/page.ts';

import ProductCardModel from '@/entities/ProductCard/model/ProductCardModel.ts';
import BreadcrumbsModel from '@/features/Breadcrumbs/model/BreadcrumbsModel.ts';
import getCartModel from '@/shared/API/cart/model/CartModel.ts';
import getProductModel from '@/shared/API/product/model/ProductModel.ts';
import getShoppingListModel from '@/shared/API/shopping-list/model/ShoppingListModel.ts';
import EventMediatorModel from '@/shared/EventMediator/model/EventMediatorModel.ts';
import LoaderModel from '@/shared/Loader/model/LoaderModel.ts';
import getStore from '@/shared/Store/Store.ts';
import { setCurrentPage } from '@/shared/Store/actions.ts';
import MEDIATOR_EVENT from '@/shared/constants/events.ts';
import { PAGE_ID } from '@/shared/constants/pages.ts';
import { LOADER_SIZE } from '@/shared/constants/sizes.ts';
import { buildPathName } from '@/shared/utils/buildPathname.ts';
import { showErrorMessage } from '@/shared/utils/userMessage.ts';

import WishlistPageView from '../view/WishlistPageView.ts';

class WishlistPageModel implements Page {
  private view: WishlistPageView;

  constructor(parent: HTMLDivElement) {
    this.view = new WishlistPageView(parent);
    this.init();
  }

  private createNavigationLinks(): BreadCrumbLink[] {
    const links = [
      {
        link: buildPathName(PAGE_ID.MAIN_PAGE, null, null),
        name: PAGE_ID.MAIN_PAGE.toString(),
      },
      {
        link: buildPathName(PAGE_ID.CATALOG_PAGE, null, null),
        name: PAGE_ID.CATALOG_PAGE.toString(),
      },
    ];

    return links;
  }

  private async drawWishlist(): Promise<void> {
    const wishList = this.view.getWishlist();
    wishList.innerHTML = '';
    const loader = new LoaderModel(LOADER_SIZE.EXTRA_LARGE);
    loader.setAbsolutePosition();
    wishList.append(loader.getHTML());
    const shoppingList = await getShoppingListModel().getShoppingList();
    const cart = await getCartModel().getCart();

    getProductModel()
      .getProducts()
      .then((products) => {
        shoppingList.products.forEach((product) => {
          const currentProduct = products.products.find((item) => item.id === product.productId);
          if (currentProduct) {
            this.view.getWishlist().append(new ProductCardModel(currentProduct, null, cart).getHTML());
          }
        });

        this.view.switchEmptyList(!shoppingList.products.length);
      })
      .catch(showErrorMessage)
      .finally(() => loader.getHTML().remove());
  }

  private init(): void {
    this.initBreadcrumbs();
    getStore().dispatch(setCurrentPage(PAGE_ID.WISHLIST_PAGE));
    this.drawWishlist().catch(showErrorMessage);
    EventMediatorModel.getInstance().subscribe(MEDIATOR_EVENT.REDRAW_WISHLIST, this.drawWishlist.bind(this));
  }

  private initBreadcrumbs(): void {
    const links = this.createNavigationLinks();
    this.getHTML().append(new BreadcrumbsModel(links).getHTML());
  }

  public getHTML(): HTMLDivElement {
    return this.view.getHTML();
  }
}

export default WishlistPageModel;
