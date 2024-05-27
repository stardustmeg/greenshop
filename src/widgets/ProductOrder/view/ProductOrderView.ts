import type { CartProduct } from '@/shared/types/cart';

import getStore from '@/shared/Store/Store.ts';
import { LANGUAGE_CHOICE, TABLET_WIDTH } from '@/shared/constants/common.ts';
import SVG_DETAILS from '@/shared/constants/svg.ts';
import { CartActive } from '@/shared/types/cart.ts';
import createBaseElement from '@/shared/utils/createBaseElement.ts';
import createSVGUse from '@/shared/utils/createSVGUse.ts';
import Hammer from 'hammerjs';

import styles from './productOrderView.module.scss';

type CallbackActive = (active: CartActive) => Promise<void>;

class ProductOrderView {
  private callback: CallbackActive;

  private price: HTMLTableCellElement;

  private quantity: HTMLParagraphElement;

  private total: HTMLTableCellElement;

  private view: HTMLTableRowElement;

  constructor(productItem: CartProduct, callback: CallbackActive) {
    this.callback = callback;
    this.quantity = createBaseElement({
      cssClasses: [styles.quantityCell, styles.quantityText],
      innerContent: productItem.quantity.toString(),
      tag: 'p',
    });
    this.price = createBaseElement({
      cssClasses: [styles.td, styles.priceCell, styles.priceText],
      innerContent: `$${productItem.price.toFixed(2)}`,
      tag: 'td',
    });
    this.total = createBaseElement({
      cssClasses: [styles.td, styles.totalCell, styles.totalText],
      innerContent: `$${productItem.totalPrice.toFixed(2)}`,
      tag: 'td',
    });
    this.view = this.createHTML(productItem);
  }

  private createDeleCell(): HTMLTableCellElement {
    const tdDelete = createBaseElement({ cssClasses: [styles.td, styles.deleteCell, styles.hide], tag: 'td' });
    const deleteButton = createBaseElement({ cssClasses: [styles.deleteButton], tag: 'button' });
    deleteButton.addEventListener('click', () => this.callback(CartActive.DELETE));
    tdDelete.append(deleteButton);
    const svg = document.createElementNS(SVG_DETAILS.SVG_URL, 'svg');
    svg.append(createSVGUse(SVG_DETAILS.DELETE));
    deleteButton.append(svg);
    return tdDelete;
  }

  private createHTML(productItem: CartProduct): HTMLTableRowElement {
    this.view = createBaseElement({ cssClasses: [styles.tr, styles.trProduct], tag: 'tr' });
    const imgCell = this.createImgCell(productItem);
    const tdProduct = createBaseElement({
      cssClasses: [styles.td, styles.nameCell, styles.mainText],
      innerContent: productItem.name[Number(getStore().getState().currentLanguage === LANGUAGE_CHOICE.RU)].value,
      tag: 'td',
    });
    const tdSize = createBaseElement({
      cssClasses: [styles.td, styles.sizeCell, styles.sizeText],
      innerContent: productItem.size ? `Size: ${productItem.size}` : '',
      tag: 'td',
    });
    const quantityCell = this.createQuantityCell();
    const deleteCell = this.createDeleCell();
    this.view.append(imgCell, tdProduct, tdSize, this.price, quantityCell, this.total, deleteCell);
    const animation = new Hammer(this.view);
    animation.on('swipeleft', () => {
      if (window.innerWidth <= TABLET_WIDTH) {
        this.view.style.transform = 'translateX(-100px)';
        deleteCell.classList.remove(styles.hide);
      }
    });
    animation.on('swiperight', () => {
      if (window.innerWidth <= TABLET_WIDTH) {
        this.view.style.transform = 'none';
        deleteCell.classList.add(styles.hide);
      }
    });
    return this.view;
  }

  private createImgCell(productItem: CartProduct): HTMLTableCellElement {
    const tdImage = createBaseElement({ cssClasses: [styles.td, styles.imgCell], tag: 'td' });
    const img = createBaseElement({ cssClasses: [styles.img], tag: 'img' });
    img.src = productItem.images;
    img.alt = productItem.name[Number(getStore().getState().currentLanguage === LANGUAGE_CHOICE.RU)].value;
    tdImage.append(img);
    return tdImage;
  }

  private createQuantityCell(): HTMLTableCellElement {
    const tdQuantity = createBaseElement({
      cssClasses: [styles.td, styles.quantityCell, styles.quantityText],
      tag: 'td',
    });
    const plusButton = createBaseElement({
      cssClasses: [styles.quantityCell, styles.quantityButton],
      innerContent: '+',
      tag: 'button',
    });
    const minusButton = createBaseElement({
      cssClasses: [styles.quantityCell, styles.quantityButton],
      innerContent: '-',
      tag: 'button',
    });
    tdQuantity.append(minusButton, this.quantity, plusButton);
    plusButton.addEventListener('click', () => this.callback(CartActive.PLUS));
    minusButton.addEventListener('click', () => this.callback(CartActive.MINUS));
    return tdQuantity;
  }

  public getHTML(): HTMLDivElement {
    return this.view;
  }

  public updateInfo(productItem: CartProduct): void {
    this.quantity.textContent = productItem.quantity.toString();
    this.price.textContent = `$${productItem.price.toFixed(2)}`;
    this.total.textContent = `$${productItem.totalPrice.toFixed(2)}`;
  }
}

export default ProductOrderView;
