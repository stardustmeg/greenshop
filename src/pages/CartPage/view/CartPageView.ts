import type SummaryModel from '@/entities/Summary/model/SummaryModel';
import type { LanguageChoiceType } from '@/shared/constants/common';
import type { Cart } from '@/shared/types/cart';
import type { languageVariants } from '@/shared/types/common';
import type ProductOrderModel from '@/widgets/ProductOrder/model/ProductOrderModel';

import RouterModel from '@/app/Router/model/RouterModel.ts';
import ButtonModel from '@/shared/Button/model/ButtonModel.ts';
import ConfirmModel from '@/shared/Confirm/model/ConfirmModel.ts';
import InputModel from '@/shared/Input/model/InputModel.ts';
import LinkModel from '@/shared/Link/model/LinkModel.ts';
import modal from '@/shared/Modal/model/ModalModel.ts';
import USER_MESSAGE from '@/shared/constants/confirmUserMessage.ts';
import { CART_PAGE_TITLE, PAGE_ID } from '@/shared/constants/pages.ts';
import clearOutElement from '@/shared/utils/clearOutElement.ts';
import createBaseElement from '@/shared/utils/createBaseElement.ts';
import getCurrentLanguage from '@/shared/utils/getCurrentLanguage.ts';
import { cartPrice } from '@/shared/utils/messageTemplates.ts';

import styles from './cartPageView.module.scss';

type ClearCallback = () => void;
type DiscountCallback = (discount: string) => void;
type textElementsType = {
  element: HTMLAnchorElement | HTMLButtonElement | HTMLParagraphElement | HTMLTableCellElement;
  textItem: languageVariants;
};

class CartPageView {
  private addDiscountCallback: DiscountCallback;

  private cartCouponSummary: SummaryModel;

  private clear: ButtonModel;

  private clearCallback: ClearCallback;

  private couponButton: ButtonModel;

  private discountList: HTMLUListElement;

  private discountTotal: HTMLElement;

  private empty: HTMLDivElement;

  private language: LanguageChoiceType;

  private page: HTMLDivElement;

  private parent: HTMLDivElement;

  private productCouponSummary: SummaryModel;

  private productRow: HTMLTableRowElement[] = [];

  private productWrap: HTMLDivElement;

  private subTotal: HTMLParagraphElement;

  private table: HTMLTableElement | null = null;

  private tableBody: HTMLTableSectionElement | null = null;

  private textElement: textElementsType[] = [];

  private total: HTMLParagraphElement;

  private totalDiscountTitle: HTMLParagraphElement;

  private totalWrap: HTMLDivElement;

  constructor(
    parent: HTMLDivElement,
    cartCouponSummary: SummaryModel,
    productCouponSummary: SummaryModel,
    clearCallback: ClearCallback,
    addDiscountCallback: DiscountCallback,
  ) {
    this.language = getCurrentLanguage();
    this.parent = parent;
    this.parent.innerHTML = '';
    this.cartCouponSummary = cartCouponSummary;
    this.productCouponSummary = productCouponSummary;
    this.clearCallback = clearCallback;
    this.addDiscountCallback = addDiscountCallback;
    this.page = this.createPageHTML();
    this.productWrap = this.createWrapHTML();
    this.productWrap.classList.add(styles.products);
    this.subTotal = createBaseElement({ cssClasses: [styles.totalTitle], tag: 'p' });
    this.total = createBaseElement({ cssClasses: [styles.totalPrice], tag: 'p' });
    this.discountTotal = createBaseElement({ cssClasses: [styles.couponsWrap], tag: 'summary' });
    this.discountList = createBaseElement({ cssClasses: [styles.couponsList], tag: 'ul' });
    this.couponButton = this.createCouponButton();
    this.totalDiscountTitle = this.createTotalDiscountTitle();
    this.clear = this.createClearButton();
    this.totalWrap = this.createWrapHTML();
    this.totalWrap.classList.add(styles.total);
    this.page.append(this.productWrap);
    this.page.append(this.totalWrap);
    this.empty = this.createEmptyHTML();
    window.scrollTo(0, 0);
  }

  private addTableHeader(): void {
    const productsWrap = createBaseElement({ cssClasses: [styles.productsWrap], tag: 'div' });
    this.table = createBaseElement({ cssClasses: [styles.table], tag: 'table' });
    const thead = createBaseElement({ cssClasses: [styles.thead, styles.head], tag: 'thead' });
    const tr = createBaseElement({ cssClasses: [styles.tr, styles.head], tag: 'tr' });
    const thImage = createBaseElement({
      cssClasses: [styles.th, styles.imgCell, styles.mainText],
      innerContent: CART_PAGE_TITLE.PRODUCT[this.language],
      tag: 'th',
    });
    this.textElement.push({ element: thImage, textItem: CART_PAGE_TITLE.PRODUCT });
    const thProduct = createBaseElement({ cssClasses: [styles.th, styles.nameCell, styles.mainText], tag: 'th' });
    const thPrice = createBaseElement({
      cssClasses: [styles.th, styles.priceCell, styles.mainText],
      innerContent: CART_PAGE_TITLE.PRICE[this.language],
      tag: 'th',
    });
    this.textElement.push({ element: thPrice, textItem: CART_PAGE_TITLE.PRICE });
    const thQuantity = createBaseElement({
      cssClasses: [styles.th, styles.quantityCell, styles.mainText],
      innerContent: CART_PAGE_TITLE.QUANTITY[this.language],
      tag: 'th',
    });
    this.textElement.push({ element: thQuantity, textItem: CART_PAGE_TITLE.QUANTITY });
    const thTotal = createBaseElement({
      cssClasses: [styles.th, styles.totalCell, styles.mainText],
      innerContent: CART_PAGE_TITLE.TOTAL[this.language],
      tag: 'th',
    });
    this.textElement.push({ element: thTotal, textItem: CART_PAGE_TITLE.TOTAL });
    const thDelete = this.createDeleCell();
    this.tableBody = createBaseElement({ cssClasses: [styles.tbody], tag: 'tbody' });
    this.table.append(thead, this.tableBody);
    thead.append(tr);
    tr.append(thImage, thProduct, thPrice, thQuantity, thTotal, thDelete);
    productsWrap.append(this.table);
    this.productWrap.append(productsWrap);
  }

  private addTotalInfo(): void {
    const totalBlockWrap = createBaseElement({ cssClasses: [styles.totalsWrap], tag: 'div' });
    const title = createBaseElement({
      cssClasses: [styles.totalTitle, styles.border, styles.mobileHide],
      innerContent: CART_PAGE_TITLE.CART_TOTAL[this.language],
      tag: 'p',
    });
    this.textElement.push({ element: title, textItem: CART_PAGE_TITLE.CART_TOTAL });
    const couponTitle = createBaseElement({
      cssClasses: [styles.title, styles.mobileHide],
      innerContent: CART_PAGE_TITLE.COUPON_APPLY[this.language],
      tag: 'p',
    });
    this.textElement.push({ element: couponTitle, textItem: CART_PAGE_TITLE.COUPON_APPLY });
    const couponWrap = this.createCouponHTML();
    const subtotalWrap = this.createSubtotalHTML();
    const discountWrap = this.createDiscountHTML();
    const totalWrap = this.createTotalHTML();
    const finalButton = createBaseElement({
      cssClasses: [styles.button, styles.checkoutBtn],
      innerContent: CART_PAGE_TITLE.BUTTON_CHECKOUT[this.language],
      tag: 'button',
    });
    this.textElement.push({ element: finalButton, textItem: CART_PAGE_TITLE.BUTTON_CHECKOUT });
    const continueLink = this.createCatalogLinkHTML();
    continueLink.getHTML().classList.add(styles.mobileHide);
    totalBlockWrap.append(
      title,
      couponTitle,
      couponWrap,
      this.productCouponSummary.getHTML(),
      subtotalWrap,
      this.cartCouponSummary.getHTML(),
      discountWrap,
      totalWrap,
      finalButton,
      continueLink.getHTML(),
    );
    this.totalWrap.append(totalBlockWrap);
  }

  private createCatalogLinkHTML(): LinkModel {
    const link = new LinkModel({
      attrs: {
        href: PAGE_ID.CATALOG_PAGE,
      },
      classes: [styles.continue],
      text: CART_PAGE_TITLE.CONTINUE[this.language],
    });
    this.textElement.push({ element: link.getHTML(), textItem: CART_PAGE_TITLE.CONTINUE });

    link.getHTML().addEventListener('click', (event) => {
      event.preventDefault();
      RouterModel.getInstance().navigateTo(PAGE_ID.CATALOG_PAGE);
    });
    return link;
  }

  private createClearButton(): ButtonModel {
    return new ButtonModel({
      classes: [styles.continue, styles.clear],
      text: CART_PAGE_TITLE.CLEAR[this.language],
    });
  }

  private createCouponButton(): ButtonModel {
    return new ButtonModel({
      classes: [styles.button, styles.applyBtn],
      text: CART_PAGE_TITLE.BUTTON_COUPON[this.language],
    });
  }

  private createCouponHTML(): HTMLDivElement {
    const couponWrap = createBaseElement({ cssClasses: [styles.totalWrap], tag: 'div' });
    const couponInput = new InputModel({
      id: 'coupon',
      placeholder: CART_PAGE_TITLE.INPUT_COUPON[this.language],
    });
    couponInput.getHTML().classList.add(styles.couponInput);

    this.textElement.push({ element: couponInput.getHTML(), textItem: CART_PAGE_TITLE.INPUT_COUPON });
    this.textElement.push({ element: this.couponButton.getHTML(), textItem: CART_PAGE_TITLE.BUTTON_COUPON });
    this.couponButton.getHTML().addEventListener('click', () => {
      this.couponButton.setDisabled();
      this.addDiscountCallback(couponInput.getHTML().value);
      couponInput.getHTML().value = '';
      this.couponButton.setEnabled();
    });
    couponWrap.append(couponInput.getHTML(), this.couponButton.getHTML());
    return couponWrap;
  }

  private createDeleCell(): HTMLTableCellElement {
    const tdDelete = createBaseElement({ cssClasses: [styles.th, styles.deleteCell, styles.mainText], tag: 'th' });

    this.textElement.push({ element: this.clear.getHTML(), textItem: CART_PAGE_TITLE.CLEAR });
    this.clear.getHTML().addEventListener('click', () => {
      const confirmModel = new ConfirmModel(() => this.clearCallback(), USER_MESSAGE[getCurrentLanguage()].CLEAR_CART);
      modal.setContent(confirmModel.getHTML());
      modal.show();
    });
    tdDelete.append(this.clear.getHTML());
    return tdDelete;
  }

  private createDiscountHTML(): HTMLDetailsElement {
    const discountWrap = createBaseElement({ cssClasses: [styles.totalWrap], tag: 'details' });
    discountWrap.append(this.discountTotal, this.discountList);
    this.textElement.push({ element: this.totalDiscountTitle, textItem: CART_PAGE_TITLE.COUPON_DISCOUNT });
    return discountWrap;
  }

  private createEmptyHTML(): HTMLDivElement {
    const empty = createBaseElement({ cssClasses: [styles.empty, styles.hide], tag: 'div' });
    const emptyTitle = createBaseElement({
      cssClasses: [styles.emptyTitle],
      innerContent: CART_PAGE_TITLE.EMPTY[this.language],
      tag: 'p',
    });
    this.textElement.push({ element: emptyTitle, textItem: CART_PAGE_TITLE.EMPTY });
    const continueLink = this.createCatalogLinkHTML();
    empty.append(emptyTitle, continueLink.getHTML());
    this.page.append(empty);
    return empty;
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
    const subtotalTitle = createBaseElement({
      cssClasses: [styles.title],
      innerContent: CART_PAGE_TITLE.SUBTOTAL[this.language],
      tag: 'p',
    });
    subtotalWrap.append(subtotalTitle, this.subTotal);
    this.textElement.push({ element: subtotalTitle, textItem: CART_PAGE_TITLE.SUBTOTAL });
    return subtotalWrap;
  }

  private createTotalDiscountTitle(): HTMLParagraphElement {
    return createBaseElement({
      cssClasses: [styles.title],
      innerContent: CART_PAGE_TITLE.COUPON_DISCOUNT[this.language],
      tag: 'p',
    });
  }

  private createTotalHTML(): HTMLDivElement {
    const totalWrap = createBaseElement({ cssClasses: [styles.totalWrap], tag: 'div' });
    const totalTitle = createBaseElement({
      cssClasses: [styles.totalTitle],
      innerContent: CART_PAGE_TITLE.TOTAL[this.language],
      tag: 'p',
    });
    totalWrap.append(totalTitle, this.total);
    this.textElement.push({ element: totalTitle, textItem: CART_PAGE_TITLE.TOTAL });
    return totalWrap;
  }

  private createWrapHTML(): HTMLDivElement {
    return createBaseElement({
      cssClasses: [styles.wrap],
      tag: 'div',
    });
  }

  public getCouponButton(): HTMLButtonElement {
    return this.couponButton.getHTML();
  }

  public getHTML(): HTMLDivElement {
    return this.page;
  }

  public renderCart(productsItem: ProductOrderModel[]): void {
    clearOutElement(this.productWrap, this.totalWrap, this.discountTotal, this.discountList);
    this.productWrap.classList.remove(styles.hide);
    this.totalWrap.classList.remove(styles.hide);
    this.empty.classList.add(styles.hide);
    this.productRow.map((productEl) => productEl.remove());
    this.productRow = [];
    this.addTableHeader();
    productsItem.forEach((productEl) => this.tableBody?.append(productEl.getHTML()));
    this.addTotalInfo();
  }

  public renderEmpty(): void {
    clearOutElement(this.productWrap, this.totalWrap, this.discountTotal, this.discountList);
    this.productWrap.classList.add(styles.hide);
    this.totalWrap.classList.add(styles.hide);
    this.empty.classList.remove(styles.hide);
  }

  public updateLanguage(): void {
    this.language = getCurrentLanguage();
    this.textElement.forEach((textEl) => {
      const elHTML = textEl.element;
      if (elHTML instanceof HTMLInputElement) {
        elHTML.placeholder = textEl.textItem[this.language];
      } else {
        elHTML.textContent = textEl.textItem[this.language];
      }
    });
  }

  public updateTotal(cart: Cart): void {
    clearOutElement(this.discountTotal, this.discountList);
    const totalDiscount = cart.discountsCart.reduce((acc, discount) => acc + discount.value, 0);
    const subTotal = cart.total + totalDiscount;
    this.subTotal.innerHTML = cartPrice(subTotal.toFixed(2));
    this.total.innerHTML = cartPrice(cart.total.toFixed(2));
  }
}

export default CartPageView;
