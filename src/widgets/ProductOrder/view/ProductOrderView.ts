import type ProductPriceModel from '@/entities/ProductPrice/model/ProductPriceModel';
import type { LanguageChoiceType } from '@/shared/constants/common.ts';
import type { CartProduct } from '@/shared/types/cart';
import type { languageVariants } from '@/shared/types/common';

import LinkModel from '@/shared/Link/model/LinkModel.ts';
import { LANGUAGE_CHOICE, TABLET_WIDTH } from '@/shared/constants/common.ts';
import SVG_DETAILS from '@/shared/constants/svg.ts';
import { CartActive } from '@/shared/types/cart.ts';
import * as buildPath from '@/shared/utils/buildPathname.ts';
import createBaseElement from '@/shared/utils/createBaseElement.ts';
import createSVGUse from '@/shared/utils/createSVGUse.ts';
import getCurrentLanguage from '@/shared/utils/getCurrentLanguage.ts';
import Hammer from 'hammerjs';

import styles from './productOrderView.module.scss';

type CallbackActive = (active: CartActive) => Promise<void>;

type textElementsType = {
  element: HTMLTableCellElement;
  textItem: languageVariants;
};

const TITLE = {
  MINUS: '-',
  NAME: {
    en: '',
    ru: '',
  },
  PLUS: '+',
  SIZE: {
    en: 'Size',
    ru: 'Размер',
  },
};
class ProductOrderView {
  private callback: CallbackActive;

  private deleteButton: HTMLButtonElement;

  private language: LanguageChoiceType;

  private priceElement: ProductPriceModel;

  private productItem: CartProduct;

  private quantity: HTMLParagraphElement;

  private textElement: textElementsType[] = [];

  private totalElement: ProductPriceModel;

  private view: HTMLTableRowElement;

  constructor(
    productItem: CartProduct,
    priceElement: ProductPriceModel,
    totalElement: ProductPriceModel,
    callback: CallbackActive,
  ) {
    this.productItem = productItem;
    this.priceElement = priceElement;
    this.totalElement = totalElement;
    this.totalElement.getHTML().classList.add(styles.priceElement);
    this.priceElement.getHTML().classList.add(styles.priceElement);
    this.language = getCurrentLanguage();
    this.callback = callback;
    this.quantity = createBaseElement({
      cssClasses: [styles.quantityCell, styles.quantityText],
      innerContent: this.productItem.quantity.toString(),
      tag: 'p',
    });
    this.deleteButton = createBaseElement({ cssClasses: [styles.deleteButton], tag: 'button' });
    this.view = this.createHTML();
  }

  private createDeleCell(): HTMLTableCellElement {
    const tdDelete = createBaseElement({ cssClasses: [styles.td, styles.deleteCell, styles.hide], tag: 'td' });
    this.deleteButton.addEventListener('click', () => this.callback(CartActive.DELETE));
    tdDelete.append(this.deleteButton);
    const svg = document.createElementNS(SVG_DETAILS.SVG_URL, 'svg');
    svg.append(createSVGUse(SVG_DETAILS.DELETE));
    this.deleteButton.append(svg);
    return tdDelete;
  }

  private createHTML(): HTMLTableRowElement {
    this.view = createBaseElement({ cssClasses: [styles.tr, styles.trProduct], tag: 'tr' });
    const imgCell = this.createImgCell();
    const tdProduct = this.createTdProduct();
    const tdSize = this.createTdSize();
    const tdPrice = this.createTdPrice();
    this.textElement.push({ element: tdSize, textItem: TITLE.SIZE });
    this.textElement.push({ element: tdProduct, textItem: TITLE.NAME });
    const tdTotal = this.createTdTotal();
    const quantityCell = this.createQuantityCell();
    const deleteCell = this.createDeleCell();
    this.view.append(imgCell, tdProduct, tdSize, tdPrice, quantityCell, tdTotal, deleteCell);
    const animation = new Hammer(this.view);
    animation.on('swipeleft', () => {
      if (window.innerWidth <= TABLET_WIDTH) {
        this.view.classList.add(styles.swipeRow);
        deleteCell.classList.add(styles.swipeDelete);
        deleteCell.classList.remove(styles.hide);
      }
    });
    animation.on('swiperight', () => {
      if (window.innerWidth <= TABLET_WIDTH) {
        this.view.classList.remove(styles.swipeRow);
        deleteCell.classList.remove(styles.swipeDelete);
        deleteCell.classList.add(styles.hide);
      }
    });
    window.addEventListener('resize', () => {
      if (window.innerWidth > TABLET_WIDTH) {
        this.view.classList.remove(styles.swipeRow);
        deleteCell.classList.remove(styles.swipeDelete);
        deleteCell.classList.add(styles.hide);
      }
    });
    return this.view;
  }

  private createImgCell(): HTMLTableCellElement {
    const tdImage = createBaseElement({ cssClasses: [styles.td, styles.imgCell], tag: 'td' });
    const href = `${buildPath.productPathWithIDAndQuery(this.productItem.key, { size: [this.productItem.size] })}`;
    const link = new LinkModel({
      attrs: {
        href,
      },
      classes: [styles.goDetailsPageLink],
    });
    const img = createBaseElement({ cssClasses: [styles.img], tag: 'img' });
    img.src = this.productItem.images;
    img.alt = this.productItem.name[Number(getCurrentLanguage() === LANGUAGE_CHOICE.RU)].value;
    link.getHTML().append(img);
    tdImage.append(link.getHTML());
    return tdImage;
  }

  private createQuantityCell(): HTMLTableCellElement {
    const tdQuantity = createBaseElement({
      cssClasses: [styles.td, styles.quantityCell, styles.quantityText],
      tag: 'td',
    });
    const plusButton = createBaseElement({
      cssClasses: [styles.quantityCell, styles.quantityButton],
      innerContent: TITLE.PLUS,
      tag: 'button',
    });
    const minusButton = createBaseElement({
      cssClasses: [styles.quantityCell, styles.quantityButton],
      innerContent: TITLE.MINUS,
      tag: 'button',
    });
    tdQuantity.append(minusButton, this.quantity, plusButton);
    plusButton.addEventListener('click', () => this.callback(CartActive.PLUS));
    minusButton.addEventListener('click', () => this.callback(CartActive.MINUS));
    return tdQuantity;
  }

  private createTdPrice(): HTMLTableCellElement {
    const td = createBaseElement({
      cssClasses: [styles.td, styles.priceCell, styles.priceText],
      tag: 'td',
    });
    td.append(this.priceElement.getHTML());
    return td;
  }

  private createTdProduct(): HTMLTableCellElement {
    const td = createBaseElement({
      cssClasses: [styles.td, styles.nameCell, styles.mainText],
      tag: 'td',
    });
    const href = `${buildPath.productPathWithIDAndQuery(this.productItem.key, { size: [this.productItem.size] })}`;
    const link = new LinkModel({
      attrs: {
        href,
      },
      classes: [styles.nameLink],
      text: this.productItem.name[Number(getCurrentLanguage() === LANGUAGE_CHOICE.RU)].value,
    });
    td.append(link.getHTML());
    return td;
  }

  private createTdSize(): HTMLTableCellElement {
    return createBaseElement({
      cssClasses: [styles.td, styles.sizeCell, styles.sizeText],
      innerContent: this.productItem.size ? `${TITLE.SIZE[this.language]}: ${this.productItem.size}` : '',
      tag: 'td',
    });
  }

  private createTdTotal(): HTMLTableCellElement {
    const td = createBaseElement({
      cssClasses: [styles.td, styles.totalCell, styles.totalText],
      tag: 'td',
    });
    td.append(this.totalElement.getHTML());
    return td;
  }

  public getDeleteButton(): HTMLButtonElement {
    return this.deleteButton;
  }

  public getHTML(): HTMLDivElement {
    return this.view;
  }

  public updateInfo(productItem: CartProduct): void {
    this.productItem = productItem;
    this.quantity.textContent = this.productItem.quantity.toString();

    this.priceElement.updatePrice({ new: this.productItem.priceCouponDiscount, old: this.productItem.price });
    this.totalElement.updatePrice({
      new:
        this.productItem.totalPrice === this.productItem.totalPriceCouponDiscount
          ? 0
          : this.productItem.totalPriceCouponDiscount,
      old: this.productItem.totalPrice,
    });
  }

  public updateLanguage(): void {
    this.language = getCurrentLanguage();
    this.textElement.forEach((textEl) => {
      const elHTML = textEl.element;
      if (textEl.textItem === TITLE.SIZE) {
        elHTML.textContent = this.productItem.size ? `${TITLE.SIZE[this.language]}: ${this.productItem.size}` : '';
      } else if (textEl.textItem === TITLE.NAME) {
        elHTML.textContent = this.productItem.name[Number(this.language === LANGUAGE_CHOICE.RU)].value;
      }
    });
  }
}

export default ProductOrderView;
