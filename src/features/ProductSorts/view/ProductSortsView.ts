import { SortDirection } from '@/shared/API/types/type.ts';
import LinkModel from '@/shared/Link/model/LinkModel.ts';
import getStore from '@/shared/Store/Store.ts';
import { SORTING_ID, TEXT } from '@/shared/constants/sorting.ts';
import createBaseElement from '@/shared/utils/createBaseElement.ts';

import styles from './productSortsView.module.scss';

class ProductSortsView {
  private currentSortingSpan: HTMLSpanElement;

  private sortingList: HTMLUListElement;

  private sortingListLinks: LinkModel[] = [];

  private sortingListTitle: HTMLHeadingElement;

  private sortingWrapper: HTMLDivElement;

  constructor() {
    this.currentSortingSpan = this.createCurrentSortingSpan();
    this.sortingListTitle = this.createSortingListTitle();
    this.sortingList = this.createSortingList();
    this.sortingWrapper = this.createHTML();

    document.addEventListener('click', ({ target }) => {
      if (
        this.sortingListLinks.every((link) => link.getHTML() !== target) &&
        target instanceof Element &&
        target !== this.sortingListTitle &&
        !this.sortingListTitle.contains(target) &&
        this.sortingList.classList.contains(styles.visible)
      ) {
        this.sortingList.classList.remove(styles.visible);
      }
    });
  }

  private createCurrentSortingSpan(): HTMLSpanElement {
    this.currentSortingSpan = createBaseElement({
      cssClasses: [styles.currentSortingSpan],
      innerContent: TEXT[getStore().getState().currentLanguage].DEFAULT,
      tag: 'span',
    });

    return this.currentSortingSpan;
  }

  private createHTML(): HTMLDivElement {
    this.sortingWrapper = createBaseElement({
      cssClasses: [styles.sortingWrapper],
      tag: 'div',
    });

    this.sortingWrapper.append(this.sortingListTitle, this.sortingList);
    return this.sortingWrapper;
  }

  private createSortingLink(href: string, text: string, id: string): LinkModel {
    const link = new LinkModel({
      attrs: {
        'data-direction': SortDirection.ASC,
        href,
        id,
      },
      classes: [styles.sortingLink],
      text,
    });
    link.getHTML().classList.add(styles.hight);

    link.getHTML().addEventListener('click', (event) => {
      event.preventDefault();
      if (link.getHTML().classList.contains(styles.activeLink)) {
        link.getHTML().classList.toggle(styles.pass);
        link.getHTML().classList.toggle(styles.hight);
        link.getHTML().dataset.direction =
          link.getHTML().dataset.direction === SortDirection.ASC ? SortDirection.DESC : SortDirection.ASC;
      }
      this.sortingListLinks.forEach((link) => link.getHTML().classList.remove(styles.activeLink));
      link.getHTML().classList.add(styles.activeLink);
      this.currentSortingSpan.innerText = text;
    });

    this.sortingListLinks.push(link);

    return link;
  }

  private createSortingList(): HTMLUListElement {
    this.sortingList = createBaseElement({
      cssClasses: [styles.sortingList],
      tag: 'ul',
    });

    const defaultSortingLink = this.createSortingLink(
      '',
      TEXT[getStore().getState().currentLanguage].DEFAULT,
      SORTING_ID.DEFAULT,
    );

    defaultSortingLink.getHTML().classList.add(styles.activeLink);

    const priceLink = this.createSortingLink('', TEXT[getStore().getState().currentLanguage].PRICE, SORTING_ID.PRICE);

    const nameLink = this.createSortingLink('', TEXT[getStore().getState().currentLanguage].NAME, SORTING_ID.NAME);

    this.sortingList.append(defaultSortingLink.getHTML(), priceLink.getHTML(), nameLink.getHTML());

    return this.sortingList;
  }

  private createSortingListTitle(): HTMLHeadingElement {
    this.sortingListTitle = createBaseElement({
      cssClasses: [styles.sortingListTitle],
      tag: 'h3',
    });

    const span = createBaseElement({
      cssClasses: [styles.sortingListTitleSpan],
      innerContent: 'Sort by:',
      tag: 'span',
    });

    this.sortingListTitle.addEventListener('click', () => {
      this.sortingList.classList.toggle(styles.visible);
    });

    this.sortingListTitle.append(span, this.currentSortingSpan);

    return this.sortingListTitle;
  }

  public getHTML(): HTMLDivElement {
    return this.sortingWrapper;
  }

  public getSortingLinks(): LinkModel[] {
    return this.sortingListLinks;
  }
}

export default ProductSortsView;
