import type { SizeProductCount } from '@/shared/API/types/type';
import type { Category } from '@/shared/types/product';
import type ProductFiltersParams from '@/shared/types/productFilters';

import ButtonModel from '@/shared/Button/model/ButtonModel.ts';
import InputModel from '@/shared/Input/model/InputModel.ts';
import LinkModel from '@/shared/Link/model/LinkModel.ts';
import getStore from '@/shared/Store/Store.ts';
import observeStore, { selectCurrentLanguage } from '@/shared/Store/observer.ts';
import { LANGUAGE_CHOICE } from '@/shared/constants/buttons.ts';
import { AUTOCOMPLETE_OPTION } from '@/shared/constants/common.ts';
import { FILTER_INPUT_RANGE_LABEL, FILTER_RESET_BUTTON, FILTER_TITLE } from '@/shared/constants/filters.ts';
import { INPUT_TYPE } from '@/shared/constants/forms.ts';
import createBaseElement from '@/shared/utils/createBaseElement.ts';
import * as noUiSlider from 'nouislider';

import styles from './productFiltersView.module.scss';

const BASE_FILTER_LINK_COUNT = '(0)';
const SLIDER_PRICE_OFFSET = 10;
const INPUT_PRICE_STEP = 5;

class ProductFiltersView {
  private categoryCountSpan: HTMLSpanElement[] = [];

  private categoryLinks: LinkModel[] = [];

  private categoryList: HTMLUListElement;

  private filters: HTMLDivElement;

  private params: ProductFiltersParams;

  private priceInputs: Map<string, InputModel> = new Map();

  private priceSlider: noUiSlider.API;

  private resetFiltersButton: ButtonModel;

  private sizeCountSpan: HTMLSpanElement[] = [];

  private sizeLinks: LinkModel[] = [];

  private sizesList: HTMLUListElement;

  constructor(params: ProductFiltersParams) {
    this.params = params;
    this.categoryList = this.createCategoryList();
    this.priceSlider = this.createPriceSlider();
    this.sizesList = this.createSizesList();
    this.resetFiltersButton = this.createResetFiltersButton();
    this.filters = this.createHTML();
  }

  private createCategoryLink(category: Category): LinkModel {
    const text = category.name[getStore().getState().currentLanguage === LANGUAGE_CHOICE.EN ? 0 : 1].value;
    const categoryLink = new LinkModel({
      attrs: {
        href: category.key,
        id: category.id,
      },
      classes: [styles.categoryLink],
      text,
    });

    categoryLink.getHTML().addEventListener('click', (event) => {
      event.preventDefault();
    });

    const span = createBaseElement({
      attributes: {
        id: category.id,
      },
      cssClasses: [styles.categoryLinkCount],
      innerContent: BASE_FILTER_LINK_COUNT,
      tag: 'span',
    });

    this.categoryCountSpan.push(span);
    categoryLink.getHTML().append(span);

    const productsCount =
      this.params.categoriesProductCount?.find((item) => item.category.key === category.key)?.count ?? 0;
    span.textContent = `(${productsCount})`;

    this.categoryLinks.push(categoryLink);
    return categoryLink;
  }

  private createCategoryList(): HTMLUListElement {
    const { filtersList, filtersListTitle } = this.createFiltersList(
      {
        list: [styles.categoryList],
        title: [styles.categoryTitle],
      },
      FILTER_TITLE[getStore().getState().currentLanguage].CATEGORY,
    );

    this.categoryList = filtersList;

    this.params.categories?.forEach((category) => {
      const li = createBaseElement({
        cssClasses: [styles.categoryItem],
        tag: 'li',
      });

      li.append(this.createCategoryLink(category).getHTML());
      this.categoryList.append(li);
    });

    observeStore(selectCurrentLanguage, () => {
      this.categoryCountSpan.length = 0;
      this.categoryLinks.length = 0;
      this.categoryList.innerHTML = '';
      this.categoryList.append(filtersListTitle);
      filtersListTitle.textContent = FILTER_TITLE[getStore().getState().currentLanguage].CATEGORY;
      this.params.categories?.forEach((category) => {
        this.categoryList.append(this.createCategoryLink(category).getHTML());
      });
    });

    return this.categoryList;
  }

  private createFiltersList(
    classes: Record<string, string[]>,
    title: string,
  ): {
    filtersList: HTMLUListElement;
    filtersListTitle: HTMLHeadingElement;
  } {
    const filtersList = createBaseElement({
      cssClasses: classes.list,
      tag: 'ul',
    });

    const filtersListTitle = createBaseElement({
      cssClasses: classes.title,
      innerContent: title,
      tag: 'h3',
    });
    filtersList.append(filtersListTitle);
    return { filtersList, filtersListTitle };
  }

  private createHTML(): HTMLDivElement {
    this.filters = createBaseElement({
      cssClasses: [styles.filters],
      tag: 'div',
    });

    this.filters.append(
      this.categoryList,
      this.createPriceWrapper(),
      this.priceSlider.target,
      this.sizesList,
      this.resetFiltersButton.getHTML(),
    );

    return this.filters;
  }

  private createPriceLabel(direction: string): {
    priceLabel: HTMLLabelElement;
    priceSpan: HTMLSpanElement;
  } {
    const priceLabel = createBaseElement({
      attributes: {
        for: direction,
      },
      cssClasses: [styles.priceLabel],
      tag: 'label',
    });

    const priceSpan = createBaseElement({
      cssClasses: [styles.priceSpan],
      innerContent: direction,
      tag: 'span',
    });

    const minPrice = this.params.priceRange?.min.toFixed(2) ?? '';
    const maxPrice = this.params.priceRange?.max.toFixed(2) ?? '';

    const priceInput = new InputModel({
      autocomplete: AUTOCOMPLETE_OPTION.OFF,
      id:
        direction === FILTER_INPUT_RANGE_LABEL[getStore().getState().currentLanguage].FROM
          ? FILTER_INPUT_RANGE_LABEL[getStore().getState().currentLanguage].FROM
          : FILTER_INPUT_RANGE_LABEL[getStore().getState().currentLanguage].TO,
      max: this.params.priceRange?.max,
      min: this.params.priceRange?.min,
      placeholder:
        direction === FILTER_INPUT_RANGE_LABEL[getStore().getState().currentLanguage].FROM ? minPrice : maxPrice,
      step: INPUT_PRICE_STEP,
      type: INPUT_TYPE.NUMBER,
      value: direction === FILTER_INPUT_RANGE_LABEL[getStore().getState().currentLanguage].FROM ? minPrice : maxPrice,
    });
    priceInput.getHTML().classList.add(styles.priceInput, styles[direction]);
    this.priceInputs.set(direction, priceInput);
    priceLabel.append(priceSpan, priceInput.getHTML());
    return { priceLabel, priceSpan };
  }

  private createPriceSlider(): noUiSlider.API {
    const { max, min } = this.params.priceRange ?? { max: 0, min: 0 };
    const SLIDER_START_MIN = min + max / SLIDER_PRICE_OFFSET;
    const SLIDER_START_MAX = max - max / SLIDER_PRICE_OFFSET;
    const slider = createBaseElement({
      attributes: {
        id: 'slider',
      },
      cssClasses: [styles.slider],
      tag: 'div',
    });

    this.priceSlider = noUiSlider.create(slider, {
      behaviour: 'tap',
      connect: true,
      keyboardSupport: true,
      range: this.params.priceRange ?? { max: 0, min: 0 },
      start: [SLIDER_START_MIN, SLIDER_START_MAX],
    });

    return this.priceSlider;
  }

  private createPriceWrapper(): HTMLDivElement {
    const priceWrapper = createBaseElement({
      cssClasses: [styles.priceWrapper],
      tag: 'div',
    });

    const title = createBaseElement({
      cssClasses: [styles.priceTitle],
      innerContent: FILTER_TITLE[getStore().getState().currentLanguage].PRICE,
      tag: 'h3',
    });

    observeStore(selectCurrentLanguage, () => {
      title.textContent = FILTER_TITLE[getStore().getState().currentLanguage].PRICE;
    });

    const from = this.createPriceLabel(FILTER_INPUT_RANGE_LABEL[getStore().getState().currentLanguage].FROM);
    const to = this.createPriceLabel(FILTER_INPUT_RANGE_LABEL[getStore().getState().currentLanguage].TO);
    priceWrapper.append(from.priceLabel, this.priceSlider.target, to.priceLabel);

    observeStore(selectCurrentLanguage, () => {
      from.priceSpan.textContent = FILTER_INPUT_RANGE_LABEL[getStore().getState().currentLanguage].FROM;
      to.priceSpan.textContent = FILTER_INPUT_RANGE_LABEL[getStore().getState().currentLanguage].TO;
    });
    return priceWrapper;
  }

  private createResetFiltersButton(): ButtonModel {
    this.resetFiltersButton = new ButtonModel({
      classes: [styles.resetFiltersButton],
      text: FILTER_RESET_BUTTON[getStore().getState().currentLanguage].RESET,
    });

    return this.resetFiltersButton;
  }

  private createSizeLink(size: SizeProductCount): LinkModel {
    const sizeLink = new LinkModel({
      attrs: {
        href: size.size,
        id: size.size,
      },
      classes: [styles.sizeLink],
      text: size.size,
    });

    sizeLink.getHTML().addEventListener('click', (event) => {
      event.preventDefault();
    });

    const span = createBaseElement({
      attributes: {
        id: size.size,
      },
      cssClasses: [styles.sizeLinkCount],
      innerContent: `(${size.count})`,
      tag: 'span',
    });

    this.sizeCountSpan.push(span);
    sizeLink.getHTML().append(span);

    this.sizeLinks.push(sizeLink);
    return sizeLink;
  }

  private createSizesList(): HTMLUListElement {
    const { filtersList, filtersListTitle } = this.createFiltersList(
      {
        list: [styles.sizesList],
        title: [styles.sizesTitle],
      },
      FILTER_TITLE[getStore().getState().currentLanguage].SIZE,
    );

    this.sizesList = filtersList;

    this.params.sizes?.forEach((size) => {
      const li = createBaseElement({
        cssClasses: [styles.sizeItem],
        tag: 'li',
      });

      li.append(this.createSizeLink(size).getHTML());
      this.sizesList.append(li);
    });

    observeStore(selectCurrentLanguage, () => {
      this.sizeCountSpan.length = 0;
      this.sizeLinks.length = 0;
      this.sizesList.innerHTML = '';
      this.sizesList.append(filtersListTitle);
      filtersListTitle.textContent = FILTER_TITLE[getStore().getState().currentLanguage].SIZE;
      this.params.sizes?.forEach((size) => this.sizesList.append(this.createSizeLink(size).getHTML()));
    });

    return this.sizesList;
  }

  public getCategoryLinks(): LinkModel[] {
    return this.categoryLinks;
  }

  public getFiltersResetButton(): ButtonModel {
    return this.resetFiltersButton;
  }

  public getHTML(): HTMLDivElement {
    return this.filters;
  }

  public getPriceInputs(): Map<string, InputModel> {
    return this.priceInputs;
  }

  public getPriceSlider(): noUiSlider.API {
    return this.priceSlider;
  }

  public getSizeLinks(): LinkModel[] {
    return this.sizeLinks;
  }

  public switchSelectedFilter(filterLink: LinkModel, toggle?: boolean): void {
    filterLink.getHTML().classList.toggle(styles.activeLink, toggle);
  }

  public updateParams(params: ProductFiltersParams): void {
    this.params = params;
    this.params.categoriesProductCount?.forEach((categoryCount) => {
      const currentSpan = this.categoryCountSpan.find((span) => span.id === categoryCount.category.id) ?? null;
      if (currentSpan) {
        currentSpan.innerText = `(${categoryCount.count})`;
      }
    });
  }
}

export default ProductFiltersView;
