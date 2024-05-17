import type { SizeProductCount } from '@/shared/API/types/type';
import type { Category } from '@/shared/types/product';
import type ProductFiltersParams from '@/shared/types/productFilters';

import ButtonModel from '@/shared/Button/model/ButtonModel.ts';
import InputModel from '@/shared/Input/model/InputModel.ts';
import LinkModel from '@/shared/Link/model/LinkModel.ts';
import getStore from '@/shared/Store/Store.ts';
import observeStore, { selectCurrentLanguage } from '@/shared/Store/observer.ts';
import { BUTTON_TEXT } from '@/shared/constants/buttons.ts';
import { AUTOCOMPLETE_OPTION, LANGUAGE_CHOICE } from '@/shared/constants/common.ts';
import { META_FILTERS, META_FILTERS_ID, PRICE_RANGE_LABEL, TITLE } from '@/shared/constants/filters.ts';
import { INPUT_TYPE } from '@/shared/constants/forms.ts';
import { PAGE_ID } from '@/shared/constants/pages.ts';
import createBaseElement from '@/shared/utils/createBaseElement.ts';
import * as noUiSlider from 'nouislider';

import styles from './productFiltersView.module.scss';

const SEGMENTS_TO_KEEP = import.meta.env.VITE_APP_PATH_SEGMENTS_TO_KEEP;
const DEFAULT_SEGMENT = import.meta.env.VITE_APP_DEFAULT_SEGMENT;

const BASE_PRODUCT_COUNT = '(0)';
const SLIDER_PRICE_OFFSET = 10;
const INPUT_PRICE_STEP = 5;

class ProductFiltersView {
  private categoryCountSpan: HTMLSpanElement[] = [];

  private categoryLinks: LinkModel[] = [];

  private categoryList: HTMLUListElement;

  private defaultFilters: HTMLDivElement;

  private metaFilters: HTMLDivElement;

  private metaLinks: LinkModel[] = [];

  private params: ProductFiltersParams | null;

  private priceInputs: Map<string, InputModel> = new Map();

  private priceSlider: noUiSlider.API;

  private resetFiltersButton: ButtonModel;

  private sizeCountSpan: HTMLSpanElement[] = [];

  private sizeLinks: LinkModel[] = [];

  private sizesList: HTMLUListElement;

  constructor(params: ProductFiltersParams | null) {
    this.params = params;
    this.categoryList = this.createCategoryList();
    this.priceSlider = this.createPriceSlider();
    this.sizesList = this.createSizesList();
    this.resetFiltersButton = this.createResetFiltersButton();
    this.defaultFilters = this.createDefaultFilters();
    this.metaFilters = this.createMetaFilters();
    this.setPriceSliderHandlers();
  }

  private createCategoryLink(category: { category: Category; count: number }): LinkModel {
    const text = category.category.name[getStore().getState().currentLanguage === LANGUAGE_CHOICE.EN ? 0 : 1].value;
    const categoryLink = new LinkModel({
      attrs: {
        href: category.category.key,
        id: category.category.id,
      },
      classes: [styles.categoryLink],
      text,
    });

    categoryLink.getHTML().addEventListener('click', (event) => {
      event.preventDefault();
    });

    const span = createBaseElement({
      attributes: {
        id: category.category.id,
      },
      cssClasses: [styles.categoryLinkCount],
      innerContent: `(${category.count})`,
      tag: 'span',
    });

    this.categoryCountSpan.push(span);
    categoryLink.getHTML().append(span);

    this.categoryLinks.push(categoryLink);

    observeStore(selectCurrentLanguage, () => {
      const text = category.category.name[getStore().getState().currentLanguage === LANGUAGE_CHOICE.EN ? 0 : 1].value;
      const textNode = [...categoryLink.getHTML().childNodes].find((child) => child.nodeType === Node.TEXT_NODE);
      if (textNode) {
        textNode.textContent = text;
      }
    });

    return categoryLink;
  }

  private createCategoryList(): HTMLUListElement {
    const { filtersList, filtersListTitle } = this.createFiltersList(
      {
        list: [styles.categoryList],
        title: [styles.categoryTitle],
      },
      TITLE[getStore().getState().currentLanguage].CATEGORY,
    );

    this.categoryList = filtersList;

    this.params?.categoriesProductCount?.forEach((category) => {
      const li = createBaseElement({
        cssClasses: [styles.categoryItem],
        tag: 'li',
      });

      li.append(this.createCategoryLink(category).getHTML());
      this.categoryList.append(li);
    });

    observeStore(selectCurrentLanguage, () => {
      filtersListTitle.textContent = TITLE[getStore().getState().currentLanguage].CATEGORY;
    });

    return this.categoryList;
  }

  private createDefaultFilters(): HTMLDivElement {
    this.defaultFilters = createBaseElement({
      cssClasses: [styles.defaultFilters],
      tag: 'div',
    });

    this.defaultFilters.append(
      this.categoryList,
      this.createPriceWrapper(),
      this.priceSlider.target,
      this.sizesList,
      this.resetFiltersButton.getHTML(),
    );

    return this.defaultFilters;
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

  private createMetaFilters(): HTMLDivElement {
    this.metaFilters = createBaseElement({
      cssClasses: [styles.metaFilters],
      tag: 'div',
    });

    const allProductsLink = this.createMetaLink(
      META_FILTERS[getStore().getState().currentLanguage].ALL_PRODUCTS,
      META_FILTERS_ID.ALL_PRODUCTS,
      META_FILTERS.en.ALL_PRODUCTS,
    );
    const newArrivalsLink = this.createMetaLink(
      META_FILTERS[getStore().getState().currentLanguage].NEW_ARRIVALS,
      META_FILTERS_ID.NEW_ARRIVALS,
      META_FILTERS.en.NEW_ARRIVALS,
    );
    const saleLink = this.createMetaLink(
      META_FILTERS[getStore().getState().currentLanguage].SALE,
      META_FILTERS_ID.SALE,
      META_FILTERS.en.SALE,
    );
    allProductsLink.getHTML().classList.add(styles.activeLink);
    this.metaFilters.append(allProductsLink.getHTML(), newArrivalsLink.getHTML(), saleLink.getHTML());

    observeStore(selectCurrentLanguage, () => {
      allProductsLink.getHTML().textContent = META_FILTERS[getStore().getState().currentLanguage].ALL_PRODUCTS;
      newArrivalsLink.getHTML().textContent = META_FILTERS[getStore().getState().currentLanguage].NEW_ARRIVALS;
      saleLink.getHTML().textContent = META_FILTERS[getStore().getState().currentLanguage].SALE;
    });

    return this.metaFilters;
  }

  private createMetaLink(text: string, href: string, id: string): LinkModel {
    const link = new LinkModel({
      attrs: {
        href,
        id,
      },
      classes: [styles.metaLink],
      text,
    });

    link.getHTML().addEventListener('click', (event) => {
      event.preventDefault();
      const path = PAGE_ID.CATALOG_PAGE;
      const url = `${window.location.pathname.split(DEFAULT_SEGMENT)[SEGMENTS_TO_KEEP]}/${path}/${href}`;
      history.pushState({ path }, '', url);
    });

    this.metaLinks.push(link);

    return link;
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

    const minPrice = this.params?.priceRange?.min.toFixed(2) ?? '';
    const maxPrice = this.params?.priceRange?.max.toFixed(2) ?? '';
    const from = PRICE_RANGE_LABEL[getStore().getState().currentLanguage].FROM;
    const to = PRICE_RANGE_LABEL[getStore().getState().currentLanguage].TO;

    const priceInput = new InputModel({
      autocomplete: AUTOCOMPLETE_OPTION.OFF,
      id: direction === from ? from : to,
      max: this.params?.priceRange?.max,
      min: this.params?.priceRange?.min,
      placeholder: direction === from ? minPrice : maxPrice,
      step: INPUT_PRICE_STEP,
      type: INPUT_TYPE.NUMBER,
      value: direction === from ? minPrice : maxPrice,
    });
    priceInput.getHTML().classList.add(styles.priceInput, styles[direction]);
    this.priceInputs.set(direction, priceInput);
    priceLabel.append(priceSpan, priceInput.getHTML());
    return { priceLabel, priceSpan };
  }

  private createPriceSlider(): noUiSlider.API {
    const { max, min } = this.params?.priceRange ?? { max: 0, min: 0 };
    const SLIDER_START_MIN = min + max / SLIDER_PRICE_OFFSET;
    const SLIDER_START_MAX = max - max / SLIDER_PRICE_OFFSET;
    const slider = createBaseElement({
      cssClasses: [styles.slider],
      tag: 'div',
    });

    this.priceSlider = noUiSlider.create(slider, {
      behaviour: 'tap',
      connect: true,
      keyboardSupport: true,
      range: this.params?.priceRange ?? { max: 0, min: 0 },
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
      innerContent: TITLE[getStore().getState().currentLanguage].PRICE,
      tag: 'h3',
    });

    observeStore(selectCurrentLanguage, () => {
      title.textContent = TITLE[getStore().getState().currentLanguage].PRICE;
    });

    const from = this.createPriceLabel(PRICE_RANGE_LABEL[getStore().getState().currentLanguage].FROM);
    const to = this.createPriceLabel(PRICE_RANGE_LABEL[getStore().getState().currentLanguage].TO);
    priceWrapper.append(title, from.priceLabel, this.priceSlider.target, to.priceLabel);

    observeStore(selectCurrentLanguage, () => {
      from.priceSpan.textContent = PRICE_RANGE_LABEL[getStore().getState().currentLanguage].FROM;
      to.priceSpan.textContent = PRICE_RANGE_LABEL[getStore().getState().currentLanguage].TO;
    });
    return priceWrapper;
  }

  private createResetFiltersButton(): ButtonModel {
    this.resetFiltersButton = new ButtonModel({
      classes: [styles.resetFiltersButton],
      text: BUTTON_TEXT[getStore().getState().currentLanguage].RESET,
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
      TITLE[getStore().getState().currentLanguage].SIZE,
    );

    this.sizesList = filtersList;

    this.params?.sizes?.forEach((size) => {
      const li = createBaseElement({
        cssClasses: [styles.sizeItem],
        tag: 'li',
      });

      li.append(this.createSizeLink(size).getHTML());
      this.sizesList.append(li);
    });

    observeStore(selectCurrentLanguage, () => {
      filtersListTitle.textContent = TITLE[getStore().getState().currentLanguage].SIZE;
    });

    return this.sizesList;
  }

  private redrawProductsCount(): void {
    this.params?.categoriesProductCount?.forEach((categoryCount) => {
      const currentSpan = this.categoryCountSpan.find((span) => span.id === categoryCount.category.id) ?? null;
      if (currentSpan) {
        currentSpan.innerText = `(${categoryCount.count})`;
      }
    });

    this.params?.sizes?.forEach((size) => {
      const currentSpan = this.sizeCountSpan.find((span) => span.id === size.size) ?? null;
      if (currentSpan) {
        currentSpan.innerText = `(${size.count})`;
      }
    });
  }

  private setPriceSliderHandlers(): void {
    const fromInput = this.priceInputs.get(PRICE_RANGE_LABEL[getStore().getState().currentLanguage].FROM);
    const toInput = this.priceInputs.get(PRICE_RANGE_LABEL[getStore().getState().currentLanguage].TO);

    this.priceSlider.on('update', (values) => {
      const [min, max] = values;
      fromInput?.setValue(String(min));
      toInput?.setValue(String(max));
    });

    fromInput?.getHTML().addEventListener('change', () => {
      this.priceSlider.set([fromInput.getValue(), toInput?.getValue() ?? 0]);
    });
    toInput?.getHTML().addEventListener('change', () => {
      this.priceSlider.set([fromInput?.getValue() ?? 0, toInput.getValue()]);
    });
  }

  public getCategoryLinks(): LinkModel[] {
    return this.categoryLinks;
  }

  public getDefaultFilters(): HTMLDivElement {
    return this.defaultFilters;
  }

  public getFiltersResetButton(): ButtonModel {
    return this.resetFiltersButton;
  }

  public getMetaFilters(): HTMLDivElement {
    return this.metaFilters;
  }

  public getMetaLinks(): LinkModel[] {
    return this.metaLinks;
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

  public updateParams(params: ProductFiltersParams | null): void {
    this.params = params;
    this.categoryCountSpan.forEach((span) => {
      const currentSpan = span;
      currentSpan.innerText = BASE_PRODUCT_COUNT;
    });
    this.sizeCountSpan.forEach((span) => {
      const currentSpan = span;
      currentSpan.innerText = BASE_PRODUCT_COUNT;
    });
    this.redrawProductsCount();
  }
}

export default ProductFiltersView;
