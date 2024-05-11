import type { Category } from '@/shared/types/product';
import type ProductFiltersParams from '@/shared/types/productFilters';

import LinkModel from '@/shared/Link/model/LinkModel.ts';
import getStore from '@/shared/Store/Store.ts';
import observeStore, { selectCurrentLanguage } from '@/shared/Store/observer.ts';
import { LANGUAGE_CHOICE } from '@/shared/constants/buttons.ts';
import createBaseElement from '@/shared/utils/createBaseElement.ts';

import styles from './productFiltersView.module.scss';

const BASE_CATEGORY_LINK_COUNT = '(0)';
const TEXT_RADIX = 10;

class ProductFiltersView {
  private categoryCountSpan: HTMLSpanElement[] = [];

  private categoryLinks: LinkModel[] = [];

  private categoryList: HTMLUListElement;

  private filters: HTMLDivElement;

  private params: ProductFiltersParams;

  constructor(params: ProductFiltersParams) {
    this.params = params;
    this.categoryList = this.createCategoryList();
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

    this.params.products.forEach((product) => {
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

    this.params.categories.forEach((category) => {
      const li = createBaseElement({
        cssClasses: [styles.categoryItem],
        tag: 'li',
      });

      li.append(this.createCategoryLink(category).getHTML());
      this.categoryList.append(li);

      observeStore(selectCurrentLanguage, () => {
        this.categoryCountSpan.length = 0;
        this.categoryLinks.length = 0;
        this.categoryList.innerHTML = '';
        this.categoryList.append(title);
        this.params.categories.forEach((category) => {
          this.categoryList.append(this.createCategoryLink(category).getHTML());
        });
      });
    });

    return this.categoryList;
  }

  private createHTML(): HTMLDivElement {
    this.filters = createBaseElement({
      cssClasses: [styles.filters],
      tag: 'div',
    });

    this.filters.append(this.categoryList);

    return this.filters;
  }

  public getCategoryLinks(): LinkModel[] {
    return this.categoryLinks;
  }

  public getHTML(): HTMLDivElement {
    return this.filters;
  }

  public switchSelectCategory(categoryLink: LinkModel): void {
    categoryLink.getHTML().classList.toggle(styles.activeLink);
  }

  public updateParams(params: ProductFiltersParams): void {
    this.params = params;
    this.params.categories.forEach((category) => {
      const currentSpan = this.categoryCountSpan.find((span) => span.id === category.id) ?? null;
      if (currentSpan) {
        currentSpan.innerText = BASE_CATEGORY_LINK_COUNT;
      }
      this.params.products.forEach((product) => {
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
