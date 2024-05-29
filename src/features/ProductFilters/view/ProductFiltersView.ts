import type { PriceRange, SizeProductCount } from '@/shared/API/types/type';
import type { Category } from '@/shared/types/product';
import type ProductFiltersParams from '@/shared/types/productFilters';

import RouterModel from '@/app/Router/model/RouterModel.ts';
import ButtonModel from '@/shared/Button/model/ButtonModel.ts';
import EventMediatorModel from '@/shared/EventMediator/model/EventMediatorModel.ts';
import InputModel from '@/shared/Input/model/InputModel.ts';
import LinkModel from '@/shared/Link/model/LinkModel.ts';
import getStore from '@/shared/Store/Store.ts';
import observeStore, { selectCurrentLanguage } from '@/shared/Store/observer.ts';
import { BUTTON_TEXT } from '@/shared/constants/buttons.ts';
import { AUTOCOMPLETE_OPTION, LANGUAGE_CHOICE } from '@/shared/constants/common.ts';
import MEDIATOR_EVENT from '@/shared/constants/events.ts';
import { META_FILTERS, META_FILTERS_ID, PRICE_RANGE_LABEL, TITLE } from '@/shared/constants/filters.ts';
import { INPUT_TYPE } from '@/shared/constants/forms.ts';
import { SEARCH_PARAMS_FIELD } from '@/shared/constants/product.ts';
import createBaseElement from '@/shared/utils/createBaseElement.ts';
import * as noUiSlider from 'nouislider';

import styles from './productFiltersView.module.scss';

const BASE_PRODUCT_COUNT = '(0)';
const INPUT_PRICE_STEP = 5;

class ProductFiltersView {
  private callback: () => void;

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

  constructor(params: ProductFiltersParams | null, callback: () => void) {
    this.params = params;
    this.callback = callback;
    this.categoryList = this.createCategoryList();
    this.priceSlider = this.createPriceSlider();
    this.sizesList = this.createSizesList();
    this.resetFiltersButton = this.createResetFiltersButton();
    this.defaultFilters = this.createDefaultFilters();
    this.metaFilters = this.createMetaFilters();
    this.setPriceSliderHandlers();
  }

  private categoryClickHandler(parentCategory: { category: Category; count: number } | null): void {
    const searchParams = RouterModel.getSearchParams();
    if (
      searchParams.has(SEARCH_PARAMS_FIELD.CATEGORY) &&
      searchParams.get(SEARCH_PARAMS_FIELD.CATEGORY) === parentCategory?.category.parent?.id
    ) {
      RouterModel.deleteSearchParams(SEARCH_PARAMS_FIELD.CATEGORY);
    } else {
      RouterModel.setSearchParams(SEARCH_PARAMS_FIELD.CATEGORY, parentCategory?.category.parent?.id ?? '');
    }

    RouterModel.deleteSearchParams(SEARCH_PARAMS_FIELD.PAGE);

    this.callback();
  }

  private createCategoryItems(subcategories: Map<string, { category: Category; count: number }[]>): void {
    subcategories.forEach((subcategories, parentCategoryID) => {
      const parentCategory = this.getParentCategory(parentCategoryID);

      const parentLi = createBaseElement({
        cssClasses: [styles.categoryItem],
        tag: 'li',
      });
      if (parentCategory?.category.parent) {
        parentLi.append(this.createCategoryLink({ category: parentCategory.category.parent, count: 0 }).getHTML());
      }

      parentLi.addEventListener('click', () => {
        this.categoryClickHandler(parentCategory);
      });

      this.categoryList.append(parentLi);

      subcategories.forEach((subcategory) => {
        const li = createBaseElement({
          cssClasses: [styles.categoryItem, styles.subcategoryItem],
          tag: 'li',
        });
        li.append(this.createCategoryLink(subcategory).getHTML());
        li.addEventListener('click', () => {
          this.subcategoryClickHandler(subcategory);
        });
        this.categoryList.append(li);
      });
    });
  }

  private createCategoryLink(category: { category: Category; count: number }): LinkModel {
    const text = category.category.name[Number(getStore().getState().currentLanguage === LANGUAGE_CHOICE.RU)].value;
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
      this.switchSelectedFilter(categoryLink);
    });

    const innerContent = category.count ? `(${category.count})` : '';

    const span = createBaseElement({
      attributes: {
        id: category.category.id,
      },
      cssClasses: [styles.categoryLinkCount],
      innerContent,
      tag: 'span',
    });

    if (category.count) {
      this.categoryCountSpan.push(span);
    }
    categoryLink.getHTML().append(span);

    this.categoryLinks.push(categoryLink);

    observeStore(selectCurrentLanguage, () => {
      const text = category.category.name[Number(getStore().getState().currentLanguage === LANGUAGE_CHOICE.RU)].value;
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

    const parentCategories = this.getParentCategories();
    const subcategories = this.getSubcategories(parentCategories);

    this.createCategoryItems(subcategories);

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
      RouterModel.setSearchParams(SEARCH_PARAMS_FIELD.META, id);
      RouterModel.deleteSearchParams(SEARCH_PARAMS_FIELD.PAGE);
      this.metaLinks.forEach((link) => this.switchSelectedFilter(link, false));
      this.switchSelectedFilter(link, true);
      this.callback();
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
    const min = this.params?.priceRange?.min ?? 0;
    const max = this.params?.priceRange?.max ?? 0;
    const slider = createBaseElement({
      cssClasses: [styles.slider],
      tag: 'div',
    });

    this.priceSlider = noUiSlider.create(slider, {
      behaviour: 'tap',
      connect: true,
      keyboardSupport: true,
      range: this.params?.priceRange ?? { max: 0, min: 0 },
      start: [min, max],
    });

    this.priceSlider.on('change', (values) => {
      const [min, max] = values;
      this.priceInputs.get(PRICE_RANGE_LABEL[getStore().getState().currentLanguage].FROM)?.setValue(String(min));
      this.priceInputs.get(PRICE_RANGE_LABEL[getStore().getState().currentLanguage].TO)?.setValue(String(max));
      RouterModel.deleteSearchParams(SEARCH_PARAMS_FIELD.MIN_PRICE);
      RouterModel.deleteSearchParams(SEARCH_PARAMS_FIELD.MAX_PRICE);
      RouterModel.setSearchParams(SEARCH_PARAMS_FIELD.MIN_PRICE, String(min));
      RouterModel.setSearchParams(SEARCH_PARAMS_FIELD.MAX_PRICE, String(max));
      this.callback();
    });

    this.priceSlider.on('slide', (values) => {
      const [min, max] = values;
      this.priceInputs.get(PRICE_RANGE_LABEL[getStore().getState().currentLanguage].FROM)?.setValue(String(min));
      this.priceInputs.get(PRICE_RANGE_LABEL[getStore().getState().currentLanguage].TO)?.setValue(String(max));
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

    this.resetFiltersButton.getHTML().addEventListener('click', () => {
      this.sizeLinks.forEach((link) => this.switchSelectedFilter(link, false));
      this.categoryLinks.forEach((link) => this.switchSelectedFilter(link, false));
      this.metaLinks.forEach((link) => {
        this.switchSelectedFilter(link, false);
        if (link.getHTML().id === META_FILTERS.en.ALL_PRODUCTS) {
          this.switchSelectedFilter(link, true);
        }
      });

      RouterModel.clearSearchParams();
      EventMediatorModel.getInstance().notify(MEDIATOR_EVENT.CLEAR_CATALOG_SEARCH, '');
      this.callback();
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
      RouterModel.deleteSearchParams(SEARCH_PARAMS_FIELD.PAGE);
      RouterModel.setSearchParams(SEARCH_PARAMS_FIELD.SIZE, size.size);
      this.sizeLinks.forEach((link) => this.switchSelectedFilter(link, false));
      this.switchSelectedFilter(sizeLink, true);
      this.callback();
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

  private getParentCategories(): Set<string> {
    const parentCategories = new Set<string>();
    this.params?.categoriesProductCount?.forEach((category) => {
      if (category.category.parent) {
        parentCategories.add(category.category.parent.id);
      }
    });
    return parentCategories;
  }

  private getParentCategory(parentCategoryID: string): { category: Category; count: number } | null {
    const parentCategory = this.params?.categoriesProductCount?.find(
      (category) => category.category.parent?.id === parentCategoryID,
    );
    if (parentCategory) {
      return parentCategory;
    }
    return null;
  }

  private getSubcategories(parentCategories: Set<string>): Map<string, { category: Category; count: number }[]> {
    const subcategories = new Map<string, { category: Category; count: number }[]>();
    parentCategories.forEach((parentCategoryID) => {
      this.params?.categoriesProductCount?.forEach((category) => {
        if (category.category.parent?.id === parentCategoryID) {
          const existingSubcategories = subcategories.get(parentCategoryID) ?? [];
          subcategories.set(parentCategoryID, [
            ...existingSubcategories,
            { category: category.category, count: category.count },
          ]);
        }
      });
    });
    return subcategories;
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

    fromInput?.getHTML().addEventListener('change', () => this.updateSelectedPrice(fromInput, toInput));
    toInput?.getHTML().addEventListener('change', () => this.updateSelectedPrice(fromInput, toInput));
  }

  private subcategoryClickHandler(subcategory: { category: Category; count: number }): void {
    const currentSubcategories = RouterModel.getSearchParams().getAll(SEARCH_PARAMS_FIELD.SUBCATEGORY);
    const currentSubcategory = currentSubcategories?.find((id) => id === subcategory.category.id);
    const currentLink = this.categoryLinks.find((link) => link.getHTML().id === subcategory.category.id);
    RouterModel.deleteSearchParams(SEARCH_PARAMS_FIELD.PAGE);

    if (currentSubcategory) {
      const filteredSubcategories = currentSubcategories.filter((id) => id !== currentSubcategory);
      if (!filteredSubcategories.length) {
        RouterModel.deleteSearchParams(SEARCH_PARAMS_FIELD.SUBCATEGORY);
        if (currentLink) {
          this.switchSelectedFilter(currentLink, false);
        }
      } else {
        RouterModel.deleteSearchParams(SEARCH_PARAMS_FIELD.SUBCATEGORY);
        filteredSubcategories.forEach((id) => RouterModel.appendSearchParams(SEARCH_PARAMS_FIELD.SUBCATEGORY, id));
        filteredSubcategories.forEach((id) => {
          const currentLink = this.categoryLinks.find((link) => link.getHTML().id === id);
          if (currentLink) {
            this.switchSelectedFilter(currentLink, true);
          }
        });
      }
    } else {
      RouterModel.appendSearchParams(SEARCH_PARAMS_FIELD.SUBCATEGORY, subcategory.category.id);
      if (currentLink) {
        this.switchSelectedFilter(currentLink, true);
      }
    }
    this.callback();
  }

  private updateSelectedPrice(from: InputModel | null = null, to: InputModel | null = null): void {
    RouterModel.setSearchParams(SEARCH_PARAMS_FIELD.MIN_PRICE, from?.getValue() ?? '0');
    RouterModel.setSearchParams(SEARCH_PARAMS_FIELD.MAX_PRICE, to?.getValue() ?? '0');
    this.callback();
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

  public setInitialActiveFilters(activeFilters: {
    categoryLinks: string[];
    metaLinks: string[];
    sizeLinks: string[];
  }): void {
    this.sizeLinks.forEach((link) => this.switchSelectedFilter(link, false));
    this.categoryLinks.forEach((link) => this.switchSelectedFilter(link, false));
    this.metaLinks.forEach((link) => this.switchSelectedFilter(link, false));

    activeFilters.categoryLinks.forEach((id) => {
      const currentLink = this.categoryLinks.find((link) => link.getHTML().id === id);
      if (currentLink) {
        this.switchSelectedFilter(currentLink, true);
      }
    });
    activeFilters.sizeLinks.forEach((id) => {
      const currentLink = this.sizeLinks.find((link) => link.getHTML().id === id);
      if (currentLink) {
        this.switchSelectedFilter(currentLink, true);
      }
    });
    activeFilters.metaLinks.forEach((id) => {
      const currentLink = this.metaLinks.find((link) => link.getHTML().id === id);
      if (currentLink) {
        this.switchSelectedFilter(currentLink, true);
      }
    });
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

  public updatePriceRange(params: PriceRange): void {
    if (this.params) {
      this.params.priceRange = params;
    }
    this.priceSlider.updateOptions(
      {
        range: { max: params.max ?? 0, min: params.min ?? 0 },
        start: [params.min ?? 0, params.max ?? 0],
      },
      true,
    );
    const fromInput = this.priceInputs.get(PRICE_RANGE_LABEL[getStore().getState().currentLanguage].FROM);
    const toInput = this.priceInputs.get(PRICE_RANGE_LABEL[getStore().getState().currentLanguage].TO);
    fromInput?.setValue(params.min.toFixed(2) ?? '');
    toInput?.setValue(params.max.toFixed(2) ?? '');
  }
}

export default ProductFiltersView;
