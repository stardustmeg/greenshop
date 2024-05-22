import type { CartProduct } from '@/shared/types/cart';

import getStore from '@/shared/Store/Store.ts';
import { LANGUAGE_CHOICE } from '@/shared/constants/common.ts';
import SVG_DETAILS from '@/shared/constants/svg.ts';
import createBaseElement from '@/shared/utils/createBaseElement.ts';
import createSVGUse from '@/shared/utils/createSVGUse.ts';

import styles from './productOrderView.module.scss';

class ProductOrderView {
  private view: HTMLTableRowElement;

  constructor(productItem: CartProduct) {
    this.view = this.createHTML(productItem);
  }

  private createDeleCell(): HTMLTableCellElement {
    const tdDelete = createBaseElement({ cssClasses: [styles.td, styles.deleteCell], tag: 'td' });
    const deleteButton = createBaseElement({ cssClasses: [styles.deleteButton], tag: 'button' });
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
    const tdPrice = createBaseElement({
      cssClasses: [styles.td, styles.priceCell, styles.priceText],
      innerContent: `$${productItem.price.toFixed(2)}`,
      tag: 'td',
    });
    const quantityCell = this.createQuantityCell(productItem);
    const tdTotal = createBaseElement({
      cssClasses: [styles.td, styles.totalCell, styles.totalText],
      innerContent: `$${productItem.totalPrice.toFixed(2)}`,
      tag: 'td',
    });
    const deleteCell = this.createDeleCell();
    this.view.append(imgCell, tdProduct, tdSize, tdPrice, quantityCell, tdTotal, deleteCell);
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

  private createQuantityCell(productItem: CartProduct): HTMLTableCellElement {
    const tdQuantity = createBaseElement({
      cssClasses: [styles.td, styles.quantityCell, styles.quantityText],
      tag: 'td',
    });
    const quantity = createBaseElement({
      cssClasses: [styles.quantityCell, styles.quantityText],
      innerContent: productItem.quantity.toString(),
      tag: 'p',
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
    tdQuantity.append(minusButton, quantity, plusButton);
    return tdQuantity;
  }

  public getHTML(): HTMLDivElement {
    return this.view;
  }
}

export default ProductOrderView;
