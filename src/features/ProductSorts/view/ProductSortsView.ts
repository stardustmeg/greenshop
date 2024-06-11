import { set } from '@/app/Router/helpers/helpers.ts';
import RouterModel from '@/app/Router/model/RouterModel.ts';
import { SortDirection } from '@/shared/API/types/type.ts';
import LinkModel from '@/shared/Link/model/LinkModel.ts';
import observeStore, { selectCurrentLanguage } from '@/shared/Store/observer.ts';
import { DATA_KEYS } from '@/shared/constants/common.ts';
import { SEARCH_PARAMS_FIELD } from '@/shared/constants/product.ts';
import { SORTING_ID, TEXT, TEXT_KEYS } from '@/shared/constants/sorting.ts';
import createBaseElement from '@/shared/utils/createBaseElement.ts';
import getCurrentLanguage from '@/shared/utils/getCurrentLanguage.ts';

import styles from './productSortsView.module.scss';

class ProductSortsView {
  private callback: () => void;

  private currentSortingSpan: HTMLSpanElement;

  private sortingList: HTMLUListElement;

  private sortingListLinks: LinkModel[] = [];

  private sortingListTitle: HTMLHeadingElement;

  private sortingWrapper: HTMLDivElement;

  constructor(callback: () => void) {
    this.callback = callback;
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
    const selectedSorting = RouterModel.getSearchParams().get(SEARCH_PARAMS_FIELD.FIELD);
    const currentLanguage = getCurrentLanguage();

    this.currentSortingSpan = createBaseElement({
      cssClasses: [styles.currentSortingSpan],
      innerContent:
        selectedSorting && selectedSorting in TEXT
          ? TEXT[currentLanguage][selectedSorting.toUpperCase()]
          : TEXT[currentLanguage].DEFAULT.toUpperCase(),
      tag: 'span',
    });

    observeStore(selectCurrentLanguage, () => {
      const selectedSorting = RouterModel.getSearchParams().get(SEARCH_PARAMS_FIELD.FIELD);
      const currentLanguage = getCurrentLanguage();

      this.currentSortingSpan.innerText =
        selectedSorting && selectedSorting in TEXT
          ? TEXT[currentLanguage][selectedSorting.toUpperCase()]
          : TEXT[currentLanguage].DEFAULT.toUpperCase();
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

  private createSortingLink(href: string, key: string, id: string): LinkModel {
    const link = new LinkModel({
      attrs: {
        [DATA_KEYS.DIRECTION]: SortDirection.ASC,
        href,
        id,
      },
      classes: [styles.sortingLink],
      text: TEXT[getCurrentLanguage()][key],
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

      this.currentSortingSpan.innerText = TEXT[getCurrentLanguage()][key];
      RouterModel.changeSearchParams((url) => {
        set(url, SEARCH_PARAMS_FIELD.FIELD, link.getHTML().id);
        set(url, SEARCH_PARAMS_FIELD.DIRECTION, String(link.getHTML().getAttribute(DATA_KEYS.DIRECTION)));
      });
      this.callback();
    });

    this.sortingListLinks.push(link);

    return link;
  }

  private createSortingList(): HTMLUListElement {
    this.sortingList = createBaseElement({
      cssClasses: [styles.sortingList],
      tag: 'ul',
    });

    const defaultSortingLink = this.createSortingLink('', TEXT_KEYS.DEFAULT, SORTING_ID.DEFAULT);
    const priceLink = this.createSortingLink('', TEXT_KEYS.PRICE, SORTING_ID.PRICE);
    const nameLink = this.createSortingLink('', TEXT_KEYS.NAME, SORTING_ID.NAME);

    const initialField = RouterModel.getSearchParams().get(SEARCH_PARAMS_FIELD.FIELD);
    const initialDirection = RouterModel.getSearchParams().get(SEARCH_PARAMS_FIELD.DIRECTION);
    const currentLink = this.sortingListLinks.find((link) => link.getHTML().id === initialField);
    currentLink?.getHTML().classList.add(styles.activeLink);

    if (currentLink && initialField) {
      currentLink?.getHTML().classList.toggle(styles.pass, initialDirection === SortDirection.DESC);
      // TBD check hight
      // currentLink?.getHTML().classList.toggle(styles.hight, initialDirection === SortDirection.DESC);
      currentLink.getHTML().dataset.field = initialField;
    }

    observeStore(selectCurrentLanguage, () => {
      const currentLanguage = getCurrentLanguage();
      defaultSortingLink.getHTML().innerText = TEXT[currentLanguage].DEFAULT;
      priceLink.getHTML().innerText = TEXT[currentLanguage].PRICE;
      nameLink.getHTML().innerText = TEXT[currentLanguage].NAME;
    });

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
      innerContent: TEXT[getCurrentLanguage()].SORT_BY,
      tag: 'span',
    });

    observeStore(selectCurrentLanguage, () => {
      span.innerText = TEXT[getCurrentLanguage()].SORT_BY;
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
