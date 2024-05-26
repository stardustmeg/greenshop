import type ProductOrderModel from '@/widgets/ProductOrder/model/ProductOrderModel';

import InputModel from '@/shared/Input/model/InputModel.ts';
import { INPUT_TYPE } from '@/shared/constants/forms.ts';
import createBaseElement from '@/shared/utils/createBaseElement.ts';

import styles from './cartPageView.module.scss';

class CartPageView {
  private page: HTMLDivElement;

  private parent: HTMLDivElement;

  private productRow: HTMLTableRowElement[] = [];

  private productWrap: HTMLDivElement;

  private table: HTMLTableElement | null = null;

  private tableBody: HTMLTableSectionElement | null = null;

  private totalWrap: HTMLDivElement;

  constructor(parent: HTMLDivElement) {
    this.parent = parent;
    this.parent.innerHTML = '';
    this.page = this.createPageHTML();
    this.productWrap = this.createWrapHTML();
    this.productWrap.classList.add(styles.products);
    this.totalWrap = this.createWrapHTML();
    this.totalWrap.classList.add(styles.total);
    window.scrollTo(0, 0);
  }

  private addTableHeader(): void {
    this.table = createBaseElement({ cssClasses: [styles.table], tag: 'table' });
    const thead = createBaseElement({ cssClasses: [styles.thead, styles.head], tag: 'thead' });
    const tr = createBaseElement({ cssClasses: [styles.tr, styles.head], tag: 'tr' });
    const thImage = createBaseElement({
      cssClasses: [styles.th, styles.imgCell, styles.mainText],
      innerContent: 'Product',
      tag: 'th',
    });
    const thProduct = createBaseElement({ cssClasses: [styles.th, styles.nameCell, styles.mainText], tag: 'th' });
    const thPrice = createBaseElement({
      cssClasses: [styles.th, styles.priceCell, styles.mainText],
      innerContent: 'Price',
      tag: 'th',
    });
    const thQuantity = createBaseElement({
      cssClasses: [styles.th, styles.quantityCell, styles.mainText],
      innerContent: 'Quantity',
      tag: 'th',
    });
    const thTotal = createBaseElement({
      cssClasses: [styles.th, styles.totalCell, styles.mainText],
      innerContent: 'Total',
      tag: 'th',
    });
    const thDelete = createBaseElement({ cssClasses: [styles.th, styles.deleteCell, styles.mainText], tag: 'th' });
    this.tableBody = createBaseElement({ cssClasses: [styles.tbody], tag: 'tbody' });
    this.table.append(thead, this.tableBody);
    thead.append(tr);
    tr.append(thImage, thProduct, thPrice, thQuantity, thTotal, thDelete);
    this.productWrap.append(this.table);
  }

  private addTotalInfo(totalPriceSum: number): void {
    const title = createBaseElement({
      cssClasses: [styles.totalTitle, styles.border, styles.mobileHide],
      innerContent: 'Cart Totals',
      tag: 'p',
    });
    const couponTitle = createBaseElement({
      cssClasses: [styles.title, styles.mobileHide],
      innerContent: 'Coupon Apply',
      tag: 'p',
    });
    const couponWrap = this.createCouponHTML();
    const subtotalWrap = this.createSubtotalHTML(totalPriceSum);
    const discountWrap = this.createDiscountHTML();
    const totalWrap = this.createTotalHTML(totalPriceSum);
    const finalButton = createBaseElement({
      cssClasses: [styles.button],
      innerContent: 'Proceed To Checkout',
      tag: 'button',
    });
    const continueLink = createBaseElement({
      cssClasses: [styles.continue, styles.mobileHide],
      innerContent: 'Continue Shopping',
      tag: 'a',
    });
    this.totalWrap.append(
      title,
      couponTitle,
      couponWrap,
      subtotalWrap,
      discountWrap,
      totalWrap,
      finalButton,
      continueLink,
    );
  }

  private createCouponHTML(): HTMLDivElement {
    const couponWrap = createBaseElement({ cssClasses: [styles.totalWrap], tag: 'div' });
    const couponInput = new InputModel({
      autocomplete: 'off',
      id: 'coupon',
      placeholder: 'Enter coupon here...',
      type: INPUT_TYPE.TEXT,
    });
    couponInput.getHTML().classList.add('couponInput');
    const couponButton = createBaseElement({ cssClasses: [styles.button], innerContent: 'Apply', tag: 'button' });
    couponWrap.append(couponInput.getHTML(), couponButton);
    return couponWrap;
  }

  private createDiscountHTML(): HTMLDivElement {
    const discountWrap = createBaseElement({ cssClasses: [styles.totalWrap], tag: 'div' });
    const discountTitle = createBaseElement({ cssClasses: [styles.title], innerContent: 'Coupon Discount', tag: 'p' });
    const discountValue = createBaseElement({ cssClasses: [styles.title], innerContent: '(-) 00.00', tag: 'p' });
    discountWrap.append(discountTitle, discountValue);
    return discountWrap;
  }

  private createPageHTML(): HTMLDivElement {
    this.page = createBaseElement({
      cssClasses: [styles.cartPage],
      tag: 'div',
    });

    this.parent.append(this.page);

    return this.page;
  }

  private createSubtotalHTML(totalPriceSum: number): HTMLDivElement {
    const subtotalWrap = createBaseElement({ cssClasses: [styles.totalWrap], tag: 'div' });
    const subtotalTitle = createBaseElement({ cssClasses: [styles.title], innerContent: 'Subtotal', tag: 'p' });
    const subtotalValue = createBaseElement({
      cssClasses: [styles.totalTitle],
      innerContent: `$ ${totalPriceSum.toFixed(2)}`,
      tag: 'p',
    });
    subtotalWrap.append(subtotalTitle, subtotalValue);
    return subtotalWrap;
  }

  private createTotalHTML(totalPriceSum: number): HTMLDivElement {
    const totalWrap = createBaseElement({ cssClasses: [styles.totalWrap], tag: 'div' });
    const totalTitle = createBaseElement({ cssClasses: [styles.totalTitle], innerContent: 'Total', tag: 'p' });
    const totalValue = createBaseElement({
      cssClasses: [styles.totalPrice],
      innerContent: `$ ${totalPriceSum.toFixed(2)}`,
      tag: 'p',
    });
    totalWrap.append(totalTitle, totalValue);
    return totalWrap;
  }

  private createWrapHTML(): HTMLDivElement {
    const wrap = createBaseElement({
      cssClasses: [styles.wrap],
      tag: 'div',
    });

    this.page.append(wrap);

    return wrap;
  }

  public getHTML(): HTMLDivElement {
    return this.page;
  }

  public renderCart(productsItem: ProductOrderModel[]): void {
    this.productWrap.innerHTML = '';
    this.totalWrap.innerHTML = '';
    this.productRow.map((productEl) => productEl.remove());
    this.productRow = [];
    this.addTableHeader();
    productsItem.forEach((productEl) => this.tableBody?.append(productEl.getHTML()));
    const totalPriceSum = productsItem.reduce((sum, product) => sum + product.getProduct().totalPrice, 0);
    this.addTotalInfo(totalPriceSum);
  }
}
export default CartPageView;
