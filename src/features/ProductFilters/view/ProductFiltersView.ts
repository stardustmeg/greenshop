import type { SizeProductCount } from '@/shared/API/types/type';
import type { Category } from '@/shared/types/product';
import type ProductFiltersParams from '@/shared/types/productFilters';

import { append, remove, set } from '@/app/Router/helpers/helpers.ts';
import RouterModel from '@/app/Router/model/RouterModel.ts';
import ButtonModel from '@/shared/Button/model/ButtonModel.ts';
import EventMediatorModel from '@/shared/EventMediator/model/EventMediatorModel.ts';
import InputModel from '@/shared/Input/model/InputModel.ts';
import LinkModel from '@/shared/Link/model/LinkModel.ts';
import observeStore, { selectCurrentLanguage } from '@/shared/Store/observer.ts';
import { BUTTON_TEXT } from '@/shared/constants/buttons.ts';
import { AUTOCOMPLETE_OPTION, LANGUAGE_CHOICE } from '@/shared/constants/common.ts';
import MEDIATOR_EVENT from '@/shared/constants/events.ts';
import { META_FILTER, META_FILTER_ID, PRICE_RANGE_LABEL, TITLE } from '@/shared/constants/filters.ts';
import { INPUT_TYPE } from '@/shared/constants/forms.ts';
import { PAGE_ID } from '@/shared/constants/pages.ts';
import { SEARCH_PARAMS_FIELD } from '@/shared/constants/product.ts';
import createBaseElement from '@/shared/utils/createBaseElement.ts';
import getCurrentLanguage from '@/shared/utils/getCurrentLanguage.ts';
import getLanguageValue from '@/shared/utils/getLanguageValue.ts';
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
    const handleCategoryChange = (url: URL, key: string, value: string): void => {
      if (searchParams.has(key) && searchParams.get(key) === value) {
        remove(url, key);
      } else {
        set(url, key, value);
      }
    };
    RouterModel.changeSearchParams((url) => {
      handleCategoryChange(url, SEARCH_PARAMS_FIELD.CATEGORY, parentCategory?.category.parent?.key ?? '');
      remove(url, SEARCH_PARAMS_FIELD.PAGE);
    });

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
    const text = getLanguageValue(category.category.name);
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
        id: category.category.key,
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
      const text = getLanguageValue(category.category.name);
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
      TITLE[getCurrentLanguage()].CATEGORY,
    );

    this.categoryList = filtersList;

    const parentCategories = this.getParentCategories();
    const subcategories = this.getSubcategories(parentCategories);

    this.createCategoryItems(subcategories);

    observeStore(selectCurrentLanguage, () => {
      filtersListTitle.textContent = TITLE[getCurrentLanguage()].CATEGORY;
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

    const currentLanguage = getCurrentLanguage();

    const allProductsLink = this.createMetaLink(
      META_FILTER[currentLanguage].ALL_PRODUCTS,
      META_FILTER_ID.ALL_PRODUCTS,
      META_FILTER.en.ALL_PRODUCTS,
    );
    const newArrivalsLink = this.createMetaLink(
      META_FILTER[currentLanguage].NEW_ARRIVALS,
      META_FILTER_ID.NEW_ARRIVALS,
      META_FILTER.en.NEW_ARRIVALS,
    );
    const saleLink = this.createMetaLink(META_FILTER[currentLanguage].SALE, META_FILTER_ID.SALE, META_FILTER.en.SALE);
    allProductsLink.getHTML().classList.add(styles.activeLink);
    this.metaFilters.append(allProductsLink.getHTML(), newArrivalsLink.getHTML(), saleLink.getHTML());

    observeStore(selectCurrentLanguage, () => {
      const currentLanguage = getCurrentLanguage();
      allProductsLink.getHTML().textContent = META_FILTER[currentLanguage].ALL_PRODUCTS;
      newArrivalsLink.getHTML().textContent = META_FILTER[currentLanguage].NEW_ARRIVALS;
      saleLink.getHTML().textContent = META_FILTER[currentLanguage].SALE;
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

      RouterModel.changeSearchParams((url) => {
        set(url, SEARCH_PARAMS_FIELD.META, id);
        remove(url, SEARCH_PARAMS_FIELD.PAGE);
      });
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

    const currentLanguage = getCurrentLanguage();

    const minPrice = this.params?.priceRange?.min.toFixed(2) ?? '';
    const maxPrice = this.params?.priceRange?.max.toFixed(2) ?? '';
    const from = PRICE_RANGE_LABEL[currentLanguage].FROM;
    const to = PRICE_RANGE_LABEL[currentLanguage].TO;

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

    const currentLanguage = getCurrentLanguage();

    this.priceSlider.on('change', (values) => {
      const [min, max] = values;
      this.priceInputs.get(PRICE_RANGE_LABEL[currentLanguage].FROM)?.setValue(String(min));
      this.priceInputs.get(PRICE_RANGE_LABEL[currentLanguage].TO)?.setValue(String(max));
      RouterModel.changeSearchParams((url) => {
        remove(url, [SEARCH_PARAMS_FIELD.MIN_PRICE, SEARCH_PARAMS_FIELD.MAX_PRICE]);
        set(url, SEARCH_PARAMS_FIELD.MIN_PRICE, String(min));
        set(url, SEARCH_PARAMS_FIELD.MAX_PRICE, String(max));
      });
      this.callback();
    });

    this.priceSlider.on('slide', (values) => {
      const [min, max] = values;
      this.priceInputs.get(PRICE_RANGE_LABEL[currentLanguage].FROM)?.setValue(String(min));
      this.priceInputs.get(PRICE_RANGE_LABEL[currentLanguage].TO)?.setValue(String(max));
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
      innerContent: TITLE[getCurrentLanguage()].PRICE,
      tag: 'h3',
    });

    observeStore(selectCurrentLanguage, () => {
      title.textContent = TITLE[getCurrentLanguage()].PRICE;
    });

    const currentLanguage = getCurrentLanguage();

    const from = this.createPriceLabel(PRICE_RANGE_LABEL[currentLanguage].FROM);
    const to = this.createPriceLabel(PRICE_RANGE_LABEL[currentLanguage].TO);
    priceWrapper.append(title, from.priceLabel, this.priceSlider.target, to.priceLabel);

    observeStore(selectCurrentLanguage, () => {
      const currentLanguage = getCurrentLanguage();
      from.priceSpan.textContent = PRICE_RANGE_LABEL[currentLanguage].FROM;
      to.priceSpan.textContent = PRICE_RANGE_LABEL[currentLanguage].TO;
    });
    return priceWrapper;
  }

  private createResetFiltersButton(): ButtonModel {
    this.resetFiltersButton = new ButtonModel({
      classes: [styles.resetFiltersButton],
      text: BUTTON_TEXT[getCurrentLanguage()].RESET,
    });

    this.resetFiltersButton.getHTML().addEventListener('click', () => {
      this.sizeLinks.forEach((link) => this.switchSelectedFilter(link, false));
      this.categoryLinks.forEach((link) => this.switchSelectedFilter(link, false));
      this.metaLinks.forEach((link) => {
        this.switchSelectedFilter(link, false);
        if (link.getHTML().id === META_FILTER.en.ALL_PRODUCTS) {
          this.switchSelectedFilter(link, true);
        }
      });

      RouterModel.getInstance().navigateTo(PAGE_ID.CATALOG_PAGE);
      EventMediatorModel.getInstance().notify(MEDIATOR_EVENT.CLEAR_CATALOG_SEARCH, '');
      this.callback();
    });

    observeStore(selectCurrentLanguage, () => {
      this.resetFiltersButton.getHTML().textContent = BUTTON_TEXT[getCurrentLanguage()].RESET;
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
      RouterModel.changeSearchParams((url) => {
        remove(url, SEARCH_PARAMS_FIELD.PAGE);
        set(url, SEARCH_PARAMS_FIELD.SIZE, size.size);
      });
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
      TITLE[getCurrentLanguage()].SIZE,
    );

    this.sizesList = filtersList;

    const sortedSizes = this.params?.sizes?.sort((a, b) => {
      const lastA = a.size.at(-1);
      const lastB = b.size.at(-1);
      if (lastA && lastB) {
        return lastB.localeCompare(lastA, LANGUAGE_CHOICE.EN, { numeric: true, sensitivity: 'base' });
      }
      return 0;
    });

    sortedSizes?.forEach((size) => {
      const li = createBaseElement({
        cssClasses: [styles.sizeItem],
        tag: 'li',
      });

      li.append(this.createSizeLink(size).getHTML());
      this.sizesList.append(li);
    });

    observeStore(selectCurrentLanguage, () => {
      filtersListTitle.textContent = TITLE[getCurrentLanguage()].SIZE;
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
      const currentSpan = this.categoryCountSpan.find((span) => span.id === categoryCount.category.key) ?? null;
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
    const currentLanguage = getCurrentLanguage();
    const fromInput = this.priceInputs.get(PRICE_RANGE_LABEL[currentLanguage].FROM);
    const toInput = this.priceInputs.get(PRICE_RANGE_LABEL[currentLanguage].TO);

    fromInput?.getHTML().addEventListener('change', () => this.updateSelectedPrice(fromInput, toInput));
    toInput?.getHTML().addEventListener('change', () => this.updateSelectedPrice(fromInput, toInput));
  }

  private subcategoryClickHandler(subcategory: { category: Category; count: number }): void {
    const subcategories = RouterModel.getSearchParams().getAll(SEARCH_PARAMS_FIELD.SUBCATEGORY);
    const currentSubcategory = subcategories?.find((key) => key === subcategory.category.key);
    const currentLink = this.categoryLinks.find((link) => link.getHTML().id === subcategory.category.key);
    RouterModel.changeSearchParams((url) => remove(url, SEARCH_PARAMS_FIELD.PAGE));

    if (currentSubcategory) {
      const filteredSubcategory = subcategories.filter((key) => key !== currentSubcategory);
      if (!filteredSubcategory.length) {
        RouterModel.changeSearchParams((url) => remove(url, SEARCH_PARAMS_FIELD.SUBCATEGORY));
        if (currentLink) {
          this.switchSelectedFilter(currentLink, false);
        }
      } else {
        RouterModel.changeSearchParams((url) => remove(url, SEARCH_PARAMS_FIELD.SUBCATEGORY));
        filteredSubcategory.forEach((key) =>
          RouterModel.changeSearchParams((url) => append(url, SEARCH_PARAMS_FIELD.SUBCATEGORY, key)),
        );
        filteredSubcategory.forEach((key) => {
          const currentLink = this.categoryLinks.find((link) => link.getHTML().id === key);
          if (currentLink) {
            this.switchSelectedFilter(currentLink, true);
          }
        });
      }
    } else {
      RouterModel.changeSearchParams((url) => append(url, SEARCH_PARAMS_FIELD.SUBCATEGORY, subcategory.category.key));
      if (currentLink) {
        this.switchSelectedFilter(currentLink, true);
      }
    }
    this.callback();
  }

  private updatePriceRange(): void {
    this.priceSlider.updateOptions(
      {
        start: [this.params?.priceRange?.min ?? 0, this.params?.priceRange?.max ?? 0],
      },
      true,
    );
    const currentLanguage = getCurrentLanguage();
    const fromInput = this.priceInputs.get(PRICE_RANGE_LABEL[currentLanguage].FROM);
    const toInput = this.priceInputs.get(PRICE_RANGE_LABEL[currentLanguage].TO);
    fromInput?.setValue((this.params?.priceRange?.min ?? 0).toFixed(2));
    toInput?.setValue((this.params?.priceRange?.max ?? 0).toFixed(2));
  }

  private updateSelectedPrice(from: InputModel | null = null, to: InputModel | null = null): void {
    RouterModel.changeSearchParams((url) => {
      set(url, SEARCH_PARAMS_FIELD.MIN_PRICE, from?.getValue() ?? '0');
      set(url, SEARCH_PARAMS_FIELD.MAX_PRICE, to?.getValue() ?? '0');
    });
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

    activeFilters.categoryLinks.forEach((key) => {
      const currentLink = this.categoryLinks.find((link) => link.getHTML().id === key);
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
    this.updatePriceRange();
    this.redrawProductsCount();
  }
}

export default ProductFiltersView;
