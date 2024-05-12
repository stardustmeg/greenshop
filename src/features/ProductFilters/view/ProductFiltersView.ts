import type { Category } from '@/shared/types/product';
import type ProductFiltersParams from '@/shared/types/productFilters';

import InputModel from '@/shared/Input/model/InputModel.ts';
import LinkModel from '@/shared/Link/model/LinkModel.ts';
import getStore from '@/shared/Store/Store.ts';
import observeStore, { selectCurrentLanguage } from '@/shared/Store/observer.ts';
import { LANGUAGE_CHOICE } from '@/shared/constants/buttons.ts';
import { INPUT_TYPE } from '@/shared/constants/forms.ts';
import createBaseElement from '@/shared/utils/createBaseElement.ts';
import * as noUiSlider from 'nouislider';

import styles from './productFiltersView.module.scss';

const BASE_CATEGORY_LINK_COUNT = '(0)';
const TEXT_RADIX = 10;

class ProductFiltersView {
  private categoryCountSpan: HTMLSpanElement[] = [];

  private categoryLinks: LinkModel[] = [];

  private categoryList: HTMLUListElement;

  private filters: HTMLDivElement;

  private params: ProductFiltersParams;

  private priceInputs: Map<string, InputModel> = new Map();

  private priceSlider: noUiSlider.API;

  constructor(params: ProductFiltersParams) {
    this.params = params;
    this.categoryList = this.createCategoryList();
    this.priceSlider = this.createPriceSlider();
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
      innerContent: BASE_CATEGORY_LINK_COUNT,
      tag: 'span',
    });

    this.categoryCountSpan.push(span);
    categoryLink.getHTML().append(span);

    this.params.products?.forEach((product) => {
      product.category.forEach((categoryEl) => {
        if (category.key === categoryEl.key) {
          const text = span.innerText.match(/\d+/);
          const updatedText = text ? `(${Number(parseInt(text[0], TEXT_RADIX)) + 1})` : BASE_CATEGORY_LINK_COUNT;
          span.innerText = updatedText;
        }
      });
    });
    this.categoryLinks.push(categoryLink);
    return categoryLink;
  }

  private createCategoryList(): HTMLUListElement {
    this.categoryList = createBaseElement({
      cssClasses: [styles.categoryList],
      tag: 'ul',
    });

    const title = createBaseElement({
      cssClasses: [styles.categoryTitle],
      innerContent: 'Categories',
      tag: 'h3',
    });
    this.categoryList.append(title);

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
      this.categoryList.append(title);
      this.params.categories?.forEach((category) => {
        this.categoryList.append(this.createCategoryLink(category).getHTML());
      });
    });

    return this.categoryList;
  }

  private createHTML(): HTMLDivElement {
    this.filters = createBaseElement({
      cssClasses: [styles.filters],
      tag: 'div',
    });

    this.filters.append(this.categoryList, this.createPriceWrapper(), this.priceSlider.target);

    return this.filters;
  }

  private createPriceLabel(direction: string): HTMLLabelElement {
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
      autocomplete: 'off',
      id: direction,
      placeholder: direction === 'from' ? minPrice : maxPrice,
      type: INPUT_TYPE.NUMBER,
      value: direction === 'from' ? minPrice : maxPrice,
    });
    priceInput.getHTML().classList.add(styles.priceInput, styles[direction]);
    this.priceInputs.set(direction, priceInput);
    priceLabel.append(priceSpan, priceInput.getHTML());
    return priceLabel;
  }

  private createPriceSlider(): noUiSlider.API {
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
      range: this.params.priceRange ?? { max: 100, min: 0 },
      start: [40, 320],
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
      innerContent: 'Price range',
      tag: 'h3',
    });

    priceWrapper.append(title, this.createPriceLabel('from'), this.createPriceLabel('to'));
    return priceWrapper;
  }

  public getCategoryLinks(): LinkModel[] {
    return this.categoryLinks;
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

  public switchSelectCategory(categoryLink: LinkModel): void {
    categoryLink.getHTML().classList.toggle(styles.activeLink);
  }

  public updateParams(params: ProductFiltersParams): void {
    this.params = params;
    this.params.categories?.forEach((category) => {
      const currentSpan = this.categoryCountSpan.find((span) => span.id === category.id) ?? null;
      if (currentSpan) {
        currentSpan.innerText = BASE_CATEGORY_LINK_COUNT;
      }
      this.params.products?.forEach((product) => {
        product.category.forEach((categoryEl) => {
          if (category.id === categoryEl.id && currentSpan) {
            const text = currentSpan?.innerText.match(/\d+/);
            const updatedText = text ? `(${Number(parseInt(text[0], TEXT_RADIX)) + 1})` : BASE_CATEGORY_LINK_COUNT;
            currentSpan.innerText = updatedText;
          }
        });
      });
    });
  }
}

export default ProductFiltersView;
