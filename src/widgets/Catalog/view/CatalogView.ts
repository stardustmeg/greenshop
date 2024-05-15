import getStore from '@/shared/Store/Store.ts';
import observeStore, { selectCurrentLanguage } from '@/shared/Store/observer.ts';
import { EMPTY_PRODUCT } from '@/shared/constants/product.ts';
import createBaseElement from '@/shared/utils/createBaseElement.ts';

import styles from './catalogView.module.scss';

class CatalogView {
  private catalog: HTMLDivElement;

  private itemsList: HTMLUListElement;

  private leftWrapper: HTMLDivElement;

  private rightBottomWrapper: HTMLDivElement;

  private rightTopWrapper: HTMLDivElement;

  private rightWrapper: HTMLDivElement;

  constructor() {
    this.itemsList = this.createItemsList();
    this.leftWrapper = this.createLeftWrapper();
    this.rightTopWrapper = this.createRightTopWrapper();
    this.rightBottomWrapper = this.createRightBottomWrapper();
    this.rightWrapper = this.createRightWrapper();
    this.catalog = this.createHTML();
  }

  private createHTML(): HTMLDivElement {
    this.catalog = createBaseElement({
      cssClasses: [styles.catalog],
      tag: 'div',
    });
    this.catalog.append(this.leftWrapper, this.rightWrapper);
    return this.catalog;
  }

  private createItemsList(): HTMLUListElement {
    this.itemsList = createBaseElement({
      cssClasses: [styles.itemsList],
      tag: 'ul',
    });
    observeStore(selectCurrentLanguage, () => {
      if (this.itemsList.classList.contains(styles.emptyList)) {
        this.itemsList.textContent = EMPTY_PRODUCT[getStore().getState().currentLanguage].EMPTY;
      }
    });
    return this.itemsList;
  }

  private createLeftWrapper(): HTMLDivElement {
    this.leftWrapper = createBaseElement({
      cssClasses: [styles.leftWrapper],
      tag: 'div',
    });

    return this.leftWrapper;
  }

  private createRightBottomWrapper(): HTMLDivElement {
    this.rightBottomWrapper = createBaseElement({
      cssClasses: [styles.rightBottomWrapper],
      tag: 'div',
    });

    this.rightBottomWrapper.append(this.itemsList);

    return this.rightBottomWrapper;
  }

  private createRightTopWrapper(): HTMLDivElement {
    this.rightTopWrapper = createBaseElement({
      cssClasses: [styles.rightTopWrapper],
      tag: 'div',
    });

    return this.rightTopWrapper;
  }

  private createRightWrapper(): HTMLDivElement {
    this.rightWrapper = createBaseElement({
      cssClasses: [styles.rightWrapper],
      tag: 'div',
    });

    this.rightWrapper.append(this.rightTopWrapper, this.rightBottomWrapper);

    return this.rightWrapper;
  }

  public getHTML(): HTMLDivElement {
    return this.catalog;
  }

  public getItemsList(): HTMLUListElement {
    return this.itemsList;
  }

  public getLeftWrapper(): HTMLDivElement {
    return this.leftWrapper;
  }

  public getRightBottomWrapper(): HTMLDivElement {
    return this.rightBottomWrapper;
  }

  public getRightTopWrapper(): HTMLDivElement {
    return this.rightTopWrapper;
  }

  public getRightWrapper(): HTMLDivElement {
    return this.rightWrapper;
  }

  public switchEmptyList(isEmpty: boolean): void {
    this.itemsList.classList.toggle(styles.emptyList, isEmpty);
    if (isEmpty) {
      this.itemsList.textContent = EMPTY_PRODUCT[getStore().getState().currentLanguage].EMPTY;
    }
  }
}

export default CatalogView;
