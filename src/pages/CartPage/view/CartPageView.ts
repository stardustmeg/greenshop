import type { Cart } from '@/shared/types/cart';
import type ProductOrderModel from '@/widgets/ProductOrder/model/ProductOrderModel';

import RouterModel from '@/app/Router/model/RouterModel.ts';
import InputModel from '@/shared/Input/model/InputModel.ts';
import LinkModel from '@/shared/Link/model/LinkModel.ts';
// import getStore from '@/shared/Store/Store.ts';
import { INPUT_TYPE } from '@/shared/constants/forms.ts';
import { PAGE_ID } from '@/shared/constants/pages.ts';
// import SVG_DETAILS from '@/shared/constants/svg.ts';
// import { buildPathName } from '@/shared/utils/buildPathname.ts';
import createBaseElement from '@/shared/utils/createBaseElement.ts';
// import createSVGUse from '@/shared/utils/createSVGUse.ts';

import styles from './cartPageView.module.scss';

type ClearCallback = () => void;

class CartPageView {
  private clearCallback: ClearCallback;

  private page: HTMLDivElement;

  private parent: HTMLDivElement;

  private productRow: HTMLTableRowElement[] = [];

  private productWrap: HTMLDivElement;

  private subTotal: HTMLParagraphElement;

  private table: HTMLTableElement | null = null;

  private tableBody: HTMLTableSectionElement | null = null;

  private total: HTMLParagraphElement;

  private totalWrap: HTMLDivElement;

  constructor(parent: HTMLDivElement, clearCallback: ClearCallback) {
    this.parent = parent;
    this.parent.innerHTML = '';
    this.clearCallback = clearCallback;
    this.page = this.createPageHTML();
    this.productWrap = this.createWrapHTML();
    this.productWrap.classList.add(styles.products);
    this.subTotal = createBaseElement({
      cssClasses: [styles.totalTitle],
      // innerContent: `$ ${totalPriceSum.toFixed(2)}`,
      tag: 'p',
    });
    this.total = createBaseElement({
      cssClasses: [styles.totalPrice],
      // innerContent: `$ ${totalPriceSum.toFixed(2)}`,
      tag: 'p',
    });
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
    const thDelete = this.createDeleCell();
    // createBaseElement({ cssClasses: [styles.th, styles.deleteCell, styles.mainText], tag: 'th' });
    this.tableBody = createBaseElement({ cssClasses: [styles.tbody], tag: 'tbody' });
    this.table.append(thead, this.tableBody);
    thead.append(tr);
    tr.append(thImage, thProduct, thPrice, thQuantity, thTotal, thDelete);
    this.productWrap.append(this.table);
  }

  private addTotalInfo(): void {
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
    const subtotalWrap = this.createSubtotalHTML();
    const discountWrap = this.createDiscountHTML();
    const totalWrap = this.createTotalHTML();
    const finalButton = createBaseElement({
      cssClasses: [styles.button, styles.checkoutBtn],
      innerContent: 'Proceed To Checkout',
      tag: 'button',
    });
    const continueLink = this.createCatalogLinkHTML();
    this.totalWrap.append(
      title,
      couponTitle,
      couponWrap,
      subtotalWrap,
      discountWrap,
      totalWrap,
      finalButton,
      continueLink.getHTML(),
    );
  }

  private createCatalogLinkHTML(): LinkModel {
    const link = new LinkModel({
      attrs: {
        href: PAGE_ID.CATALOG_PAGE,
      },
      classes: [styles.continue, styles.mobileHide],
      text: 'Continue Shopping',
    });

    link.getHTML().addEventListener('click', (event) => {
      event.preventDefault();
      RouterModel.getInstance().navigateTo(PAGE_ID.CATALOG_PAGE);
    });
    return link;
  }

  private createCouponHTML(): HTMLDivElement {
    const couponWrap = createBaseElement({ cssClasses: [styles.totalWrap], tag: 'div' });
    const couponInput = new InputModel({
      autocomplete: 'off',
      id: 'coupon',
      placeholder: 'Enter coupon here...',
      type: INPUT_TYPE.TEXT,
    });
    couponInput.getHTML().classList.add(styles.couponInput);
    const couponButton = createBaseElement({
      cssClasses: [styles.button, styles.applyBtn],
      innerContent: 'Apply',
      tag: 'button',
    });
    couponWrap.append(couponInput.getHTML(), couponButton);
    return couponWrap;
  }

  private createDeleCell(): HTMLTableCellElement {
    const tdDelete = createBaseElement({ cssClasses: [styles.th, styles.deleteCell, styles.mainText], tag: 'th' });
    const clear = new LinkModel({
      // attrs: {
      //   href: PAGE_ID.CATALOG_PAGE,
      // },
      classes: [styles.continue, styles.clear],
      text: 'Clear all',
    });

    clear.getHTML().addEventListener('click', (event) => {
      event.preventDefault();
      this.clearCallback();
    });
    // const deleteButton = createBaseElement({ cssClasses: [styles.deleteButton], innerContent: 'Clear', tag: 'button' });
    // deleteButton.addEventListener('click', () => {});
    tdDelete.append(clear.getHTML());
    // const svg = document.createElementNS(SVG_DETAILS.SVG_URL, 'svg');
    // svg.append(createSVGUse(SVG_DETAILS.DELETE));
    // deleteButton.append(svg);
    return tdDelete;
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

  private createSubtotalHTML(): HTMLDivElement {
    const subtotalWrap = createBaseElement({ cssClasses: [styles.totalWrap], tag: 'div' });
    const subtotalTitle = createBaseElement({ cssClasses: [styles.title], innerContent: 'Subtotal', tag: 'p' });

    // const subtotalValue = createBaseElement({
    //   cssClasses: [styles.totalTitle],
    //   innerContent: `$ ${totalPriceSum.toFixed(2)}`,
    //   tag: 'p',
    // });
    subtotalWrap.append(subtotalTitle, this.subTotal);
    return subtotalWrap;
  }

  private createTotalHTML(): HTMLDivElement {
    const totalWrap = createBaseElement({ cssClasses: [styles.totalWrap], tag: 'div' });
    const totalTitle = createBaseElement({ cssClasses: [styles.totalTitle], innerContent: 'Total', tag: 'p' });
    // const totalValue = createBaseElement({
    //   cssClasses: [styles.totalPrice],
    //   innerContent: `$ ${totalPriceSum.toFixed(2)}`,
    //   tag: 'p',
    // });
    totalWrap.append(totalTitle, this.total);
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
    // const totalPriceSum = productsItem.reduce((sum, product) => sum + product.getProduct().totalPrice, 0);
    this.addTotalInfo();
  }

  public updateTotal(cart: Cart): void {
    const total = cart.products.reduce((sum, product) => sum + product.totalPrice, 0);
    this.subTotal.innerHTML = `$ ${total.toFixed(2)}`;
    this.total.innerHTML = `$ ${total.toFixed(2)}`;
  }
}
export default CartPageView;
