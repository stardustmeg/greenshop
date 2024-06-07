import type { ProductWithCount } from '@/shared/API/types/type';
import type { Cart } from '@/shared/types/cart';
import type { ShoppingList } from '@/shared/types/shopping-list';

import ProductCardModel from '@/entities/ProductCard/model/ProductCardModel.ts';
import getCartModel from '@/shared/API/cart/model/CartModel.ts';
import getProductModel from '@/shared/API/product/model/ProductModel.ts';
import getShoppingListModel from '@/shared/API/shopping-list/model/ShoppingListModel.ts';
import EventMediatorModel from '@/shared/EventMediator/model/EventMediatorModel.ts';
import LoaderModel from '@/shared/Loader/model/LoaderModel.ts';
import getStore from '@/shared/Store/Store.ts';
import observeStore, { selectCurrentLanguage } from '@/shared/Store/observer.ts';
import MEDIATOR_EVENT from '@/shared/constants/events.ts';
import { EMPTY_PRODUCT } from '@/shared/constants/product.ts';
import { LOADER_SIZE } from '@/shared/constants/sizes.ts';
import createBaseElement from '@/shared/utils/createBaseElement.ts';
import { showErrorMessage } from '@/shared/utils/userMessage.ts';

import styles from './wishlistPageView.module.scss';

class WishlistPageView {
  private page: HTMLDivElement;

  private parent: HTMLDivElement;

  private wishlist: HTMLUListElement;

  constructor(parent: HTMLDivElement) {
    this.parent = parent;
    this.parent.innerHTML = '';
    this.wishlist = this.createWishlist();
    this.page = this.createHTML();
    window.scrollTo(0, 0);
  }

  private createHTML(): HTMLDivElement {
    this.page = createBaseElement({
      cssClasses: [styles.wishlistPage],
      tag: 'div',
    });

    this.page.append(this.wishlist);
    this.parent.append(this.page);

    return this.page;
  }

  private createWishlist(): HTMLUListElement {
    this.wishlist = createBaseElement({
      cssClasses: [styles.wishlist],
      tag: 'ul',
    });

    this.drawWishlist().catch(showErrorMessage);
    EventMediatorModel.getInstance().subscribe(MEDIATOR_EVENT.REDRAW_WISHLIST, this.drawWishlist.bind(this));
    observeStore(selectCurrentLanguage, () => {
      if (this.wishlist.classList.contains(styles.emptyList)) {
        this.wishlist.textContent = EMPTY_PRODUCT[getStore().getState().currentLanguage].EMPTY;
      }
    });

    return this.wishlist;
  }

  private drawWishlistItems(shoppingList: ShoppingList, cart: Cart, products: ProductWithCount): void {
    shoppingList.products.forEach((product) => {
      const currentProduct = products.products.find((item) => item.id === product.productId);
      if (currentProduct) {
        this.wishlist.append(new ProductCardModel(currentProduct, null, cart).getHTML());
      }
    });
  }

  public async drawWishlist(): Promise<void> {
    this.wishlist.innerHTML = '';
    const loader = new LoaderModel(LOADER_SIZE.EXTRA_LARGE);
    loader.setAbsolutePosition();
    this.wishlist.append(loader.getHTML());
    const [shoppingList, cart, products] = await Promise.all([
      getShoppingListModel().getShoppingList(),
      getCartModel().getCart(),
      getProductModel().getProducts(),
    ]);
    loader.getHTML().remove();
    this.drawWishlistItems(shoppingList, cart, products);
    this.switchEmptyList(!shoppingList.products.length);
  }

  public getHTML(): HTMLDivElement {
    return this.page;
  }

  public getWishlist(): HTMLUListElement {
    return this.wishlist;
  }

  public switchEmptyList(isEmpty: boolean): void {
    this.wishlist.classList.toggle(styles.emptyList, isEmpty);
    if (isEmpty) {
      this.wishlist.textContent = EMPTY_PRODUCT[getStore().getState().currentLanguage].EMPTY;
    }
  }
}
export default WishlistPageView;