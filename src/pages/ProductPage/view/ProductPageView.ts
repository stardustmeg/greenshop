import getStore from '@/shared/Store/Store.ts';
import observeStore, { selectCurrentLanguage } from '@/shared/Store/observer.ts';
import { PRODUCT_INFO_TEXT } from '@/shared/constants/product.ts';
import createBaseElement from '@/shared/utils/createBaseElement.ts';

import styles from './productPageView.module.scss';

class ProductPageView {
  private fullDescription: HTMLParagraphElement;

  private fullDescriptionWrapper: HTMLDivElement;

  private page: HTMLDivElement;

  private parent: HTMLDivElement;

  constructor(parent: HTMLDivElement) {
    this.parent = parent;
    this.parent.innerHTML = '';
    this.fullDescription = this.createFullDescription();
    this.fullDescriptionWrapper = this.createFullDescriptionWrapper();
    this.page = this.createHTML();
    window.scrollTo(0, 0);
  }

  private createFullDescription(): HTMLParagraphElement {
    this.fullDescription = createBaseElement({
      cssClasses: [styles.fullDescription],
      tag: 'p',
    });
    return this.fullDescription;
  }

  private createFullDescriptionWrapper(): HTMLDivElement {
    this.fullDescriptionWrapper = createBaseElement({
      cssClasses: [styles.fullDescriptionWrapper],
      innerContent: PRODUCT_INFO_TEXT[getStore().getState().currentLanguage].FULL_DESCRIPTION,
      tag: 'div',
    });

    observeStore(selectCurrentLanguage, () => {
      const text = PRODUCT_INFO_TEXT[getStore().getState().currentLanguage].FULL_DESCRIPTION;
      const textNode = [...this.fullDescriptionWrapper.childNodes].find((child) => child.nodeType === Node.TEXT_NODE);
      if (textNode) {
        textNode.textContent = text;
      }
    });

    this.fullDescriptionWrapper.append(this.fullDescription);
    return this.fullDescriptionWrapper;
  }

  private createHTML(): HTMLDivElement {
    this.page = createBaseElement({
      cssClasses: [styles.itemPage],
      tag: 'div',
    });

    this.parent.append(this.page);

    return this.page;
  }

  public getFullDescriptionWrapper(): HTMLDivElement {
    return this.fullDescriptionWrapper;
  }

  public getHTML(): HTMLDivElement {
    return this.page;
  }

  public setFullDescription(text: string): HTMLParagraphElement {
    this.fullDescription.innerText = text;
    return this.fullDescription;
  }
}

export default ProductPageView;
