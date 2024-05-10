import createBaseElement from '@/shared/utils/createBaseElement.ts';

import styles from './catalogView.module.scss';

class CatalogView {
  private catalog: HTMLDivElement;

  private itemsList: HTMLUListElement;

  constructor() {
    this.itemsList = this.createItemsList();
    this.catalog = this.createHTML();
  }

  private createHTML(): HTMLDivElement {
    this.catalog = createBaseElement({
      cssClasses: [styles.catalog],
      tag: 'div',
    });
    this.catalog.append(this.itemsList);
    return this.catalog;
  }

  private createItemsList(): HTMLUListElement {
    this.itemsList = createBaseElement({
      cssClasses: [styles.itemsList],
      tag: 'ul',
    });
    return this.itemsList;
  }

  public getHTML(): HTMLDivElement {
    return this.catalog;
  }

  public getItemsList(): HTMLUListElement {
    return this.itemsList;
  }
}

export default CatalogView;
