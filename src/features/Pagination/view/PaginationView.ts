import RouterModel from '@/app/Router/model/RouterModel.ts';
import ButtonModel from '@/shared/Button/model/ButtonModel.ts';
import { DEFAULT_PAGE, SEARCH_PARAMS_FIELD } from '@/shared/constants/product.ts';
import createBaseElement from '@/shared/utils/createBaseElement.ts';

import styles from './paginationView.module.scss';

const PREV_TEXT = '<';
const NEXT_TEXT = '>';

class PaginationView {
  private callback: (page: string) => void;

  private nextPageButton: ButtonModel;

  private pageButtons: ButtonModel[] = [];

  private prevPageButton: ButtonModel;

  private productInfo: { productTotalCount: number; productsPerPageCount: number };

  private view: HTMLDivElement;

  constructor(
    productInfo: { productTotalCount: number; productsPerPageCount: number },
    callback: (page: string) => void,
  ) {
    this.productInfo = productInfo;
    this.callback = callback;
    this.nextPageButton = this.createNextPageButton();
    this.prevPageButton = this.createPrevPageButton();
    this.view = this.createHTML();
  }

  private createHTML(): HTMLDivElement {
    this.view = createBaseElement({
      cssClasses: [styles.pagination],
      tag: 'div',
    });

    this.redrawPagination();

    return this.view;
  }

  private createNextPageButton(): ButtonModel {
    this.nextPageButton = new ButtonModel({
      classes: [styles.pageButton],
      text: NEXT_TEXT,
    });

    this.nextPageButton.getHTML().addEventListener('click', () => {
      const currentPage = RouterModel.getSearchParams().get(SEARCH_PARAMS_FIELD.PAGE);
      if (currentPage) {
        this.callback(String(Number(currentPage) + DEFAULT_PAGE));
      } else {
        this.callback(String(DEFAULT_PAGE + DEFAULT_PAGE));
      }
    });

    return this.nextPageButton;
  }

  private createPageButton(page: number): HTMLButtonElement {
    const btn = new ButtonModel({
      classes: [styles.pageButton],
      text: page.toString(),
    });

    btn.getHTML().addEventListener('click', () => this.callback(page.toString()));

    this.pageButtons.push(btn);

    return btn.getHTML();
  }

  private createPrevPageButton(): ButtonModel {
    this.prevPageButton = new ButtonModel({
      classes: [styles.pageButton],
      text: PREV_TEXT,
    });

    this.prevPageButton.getHTML().addEventListener('click', () => {
      const currentPage = RouterModel.getSearchParams().get(SEARCH_PARAMS_FIELD.PAGE);
      if (currentPage) {
        this.callback(String(Number(currentPage) - DEFAULT_PAGE));
      }
    });
    return this.prevPageButton;
  }

  private redrawPagination(): void {
    if (this.productInfo.productTotalCount > this.productInfo.productsPerPageCount) {
      const pagesCount = Math.ceil(this.productInfo.productTotalCount / this.productInfo.productsPerPageCount);
      const pages = Array(pagesCount)
        .fill(0)
        .map((_, index) => index + DEFAULT_PAGE)
        .map(this.createPageButton.bind(this));
      this.view.append(this.prevPageButton.getHTML(), ...pages, this.nextPageButton.getHTML());
    }
  }

  private switchStateNavigationButtons(page: number): void {
    const prevButton = this.prevPageButton.getHTML();
    const nextButton = this.nextPageButton.getHTML();

    prevButton.disabled = page === DEFAULT_PAGE;
    nextButton.disabled = page === this.pageButtons.length;
  }

  public getHTML(): HTMLDivElement {
    return this.view;
  }

  public setSelectedButton(page: number): void {
    this.pageButtons.forEach((btn) => {
      btn.getHTML().classList.remove(styles.active);
    });
    this.pageButtons[page - DEFAULT_PAGE]?.getHTML().classList.add(styles.active);
    this.switchStateNavigationButtons(page);
  }
}

export default PaginationView;
