import getStore from '@/shared/Store/Store.ts';
import observeStore, { selectCurrentLanguage } from '@/shared/Store/observer.ts';
import { EMPTY_PRODUCT } from '@/shared/constants/product.ts';
import createBaseElement from '@/shared/utils/createBaseElement.ts';

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

    observeStore(selectCurrentLanguage, () => {
      if (this.wishlist.classList.contains(styles.emptyList)) {
        this.wishlist.textContent = EMPTY_PRODUCT[getStore().getState().currentLanguage].EMPTY;
      }
    });

    return this.wishlist;
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
