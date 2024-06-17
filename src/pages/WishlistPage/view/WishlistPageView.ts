import type { OptionsRequest, ProductWithCount } from '@/shared/API/types/type.ts';
import type { Cart } from '@/shared/types/cart.ts';
import type { ShoppingList } from '@/shared/types/shopping-list';

import RouterModel from '@/app/Router/model/RouterModel.ts';
import ProductCardModel from '@/entities/ProductCard/model/ProductCardModel.ts';
import getCartModel from '@/shared/API/cart/model/CartModel.ts';
import getProductModel from '@/shared/API/product/model/ProductModel.ts';
import FilterProduct from '@/shared/API/product/utils/filter.ts';
import getShoppingListModel from '@/shared/API/shopping-list/model/ShoppingListModel.ts';
import { FilterFields } from '@/shared/API/types/type.ts';
import EventMediatorModel from '@/shared/EventMediator/model/EventMediatorModel.ts';
import LoaderModel from '@/shared/Loader/model/LoaderModel.ts';
import observeStore, { selectCurrentLanguage } from '@/shared/Store/observer.ts';
import MEDIATOR_EVENT from '@/shared/constants/events.ts';
import { EMPTY_PRODUCT } from '@/shared/constants/product.ts';
import { LOADER_SIZE } from '@/shared/constants/sizes.ts';
import createBaseElement from '@/shared/utils/createBaseElement.ts';
import getCurrentLanguage from '@/shared/utils/getCurrentLanguage.ts';
import { showErrorMessage } from '@/shared/utils/userMessage.ts';

import styles from './wishlistPageView.module.scss';

class WishlistPageView {
  private breadcrumbsContainer: HTMLDivElement;

  private page: HTMLDivElement;

  private parent: HTMLDivElement;

  private productCards: ProductCardModel[] = [];

  private wishlist: HTMLUListElement;

  constructor(parent: HTMLDivElement) {
    this.parent = parent;
    this.parent.innerHTML = '';
    this.breadcrumbsContainer = this.createBreadcrumbsContainer();
    this.wishlist = this.createWishlist();
    this.page = this.createHTML();
    window.scrollTo(0, 0);
  }

  private createBreadcrumbsContainer(): HTMLDivElement {
    this.breadcrumbsContainer = createBaseElement({
      cssClasses: [styles.breadcrumbsContainer],
      tag: 'div',
    });
    return this.breadcrumbsContainer;
  }

  private createHTML(): HTMLDivElement {
    this.page = createBaseElement({
      cssClasses: [styles.wishlistPage],
      tag: 'div',
    });

    this.page.prepend(this.breadcrumbsContainer);
    this.page.append(this.wishlist);
    this.parent.append(this.page);

    return this.page;
  }

  private createWishlist(): HTMLUListElement {
    this.wishlist = createBaseElement({
      cssClasses: [styles.wishlist],
      tag: 'ul',
    });

    this.drawWishlist().then(this.openProductInfo.bind(this)).catch(showErrorMessage);
    EventMediatorModel.getInstance().subscribe(MEDIATOR_EVENT.REDRAW_WISHLIST, this.drawWishlist.bind(this));
    observeStore(selectCurrentLanguage, () => {
      if (this.wishlist.classList.contains(styles.emptyList)) {
        this.wishlist.textContent = EMPTY_PRODUCT[getCurrentLanguage()].EMPTY;
      }
    });

    return this.wishlist;
  }

  private drawWishlistItems(shoppingList: ShoppingList, cart: Cart, products: ProductWithCount): void {
    shoppingList.products.forEach((product) => {
      const currentProduct = products.products.find((item) => item.id === product.productId);
      if (currentProduct) {
        const productCard = new ProductCardModel(currentProduct, null, cart);
        this.productCards.push(productCard);
        this.wishlist.append(productCard.getHTML());
      }
    });
  }

  private openProductInfo(): void {
    if (RouterModel.getPageID()) {
      this.productCards.find((productCard) => productCard.getKey() === RouterModel.getPageID())?.openProductInfoModal();
    }
  }

  public async drawWishlist(): Promise<void> {
    this.wishlist.innerHTML = '';
    const loader = new LoaderModel(LOADER_SIZE.EXTRA_LARGE);
    loader.setAbsolutePosition();
    this.wishlist.append(loader.getHTML());
    const [shoppingList, cart] = await Promise.all([
      getShoppingListModel().getShoppingList(),
      getCartModel().getCart(),
    ]);

    const filter = new FilterProduct();
    shoppingList.products.forEach((product) => {
      filter.addFilter(FilterFields.ID, product.productId);
    });
    const options: OptionsRequest = {
      filter,
      limit: shoppingList.products.length,
    };
    const products = await getProductModel().getProducts(options);
    loader.getHTML().remove();
    this.drawWishlistItems(shoppingList, cart, products);
    this.switchEmptyList(!shoppingList.products.length);
  }

  public getBreadcrumbsContainer(): HTMLDivElement {
    return this.breadcrumbsContainer;
  }

  public getHTML(): HTMLDivElement {
    return this.page;
  }

  public getWishlist(): HTMLUListElement {
    return this.wishlist;
  }

  public removeProductCard(key: string): void {
    const currentProductCard = this.productCards.find((productCard) => productCard.getKey() === key);
    if (currentProductCard) {
      currentProductCard.getHTML().remove();
      this.productCards = this.productCards.filter((productCard) => productCard.getKey() !== key);
      this.switchEmptyList(!this.productCards.length);
    }
  }

  public switchEmptyList(isEmpty: boolean): void {
    this.wishlist.classList.toggle(styles.emptyList, isEmpty);
    if (isEmpty) {
      this.wishlist.textContent = EMPTY_PRODUCT[getCurrentLanguage()].EMPTY;
    }
  }
}
export default WishlistPageView;
