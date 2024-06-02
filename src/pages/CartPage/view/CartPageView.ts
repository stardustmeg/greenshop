import type { LanguageChoiceType } from '@/shared/constants/common';
import type { Cart } from '@/shared/types/cart';
import type { languageVariants } from '@/shared/types/common';
import type ProductOrderModel from '@/widgets/ProductOrder/model/ProductOrderModel';

import RouterModel from '@/app/Router/model/RouterModel.ts';
import InputModel from '@/shared/Input/model/InputModel.ts';
import LinkModel from '@/shared/Link/model/LinkModel.ts';
import getStore from '@/shared/Store/Store.ts';
import { INPUT_TYPE } from '@/shared/constants/forms.ts';
import { PAGE_ID } from '@/shared/constants/pages.ts';
import createBaseElement from '@/shared/utils/createBaseElement.ts';

import styles from './cartPageView.module.scss';

type ClearCallback = () => void;
type DiscountCallback = (discount: string) => void;
type textElementsType = {
  element: HTMLAnchorElement | HTMLButtonElement | HTMLParagraphElement | HTMLTableCellElement;
  textItem: languageVariants;
};

const TITLE = {
  BUTTON_CHECKOUT: { en: 'Proceed To Checkout', ru: 'Оформить заказ' },
  BUTTON_COUPON: { en: 'Apply', ru: 'Применить' },
  CART_TOTAL: { en: 'Cart Totals', ru: 'Итого по корзине' },
  CLEAR: { en: 'Clear all', ru: 'Очистить' },
  CONTINUE: { en: 'Continue Shopping', ru: 'Продолжить покупки' },
  COUPON_APPLY: { en: 'Coupon Apply', ru: 'Применить купон' },
  COUPON_DISCOUNT: { en: 'Coupon Discount', ru: 'Скидка по купону' },
  EMPTY: {
    en: `Oops! Looks like you haven't added the item to your cart yet.`,
    ru: `Ой! Похоже, вы еще не добавили товар в корзину.`,
  },
  INPUT_COUPON: { en: 'Enter coupon here...', ru: 'Введите купон здесь...' },
  PRICE: { en: 'Price', ru: 'Цена' },
  PRODUCT: { en: 'Product', ru: 'Продукт' },
  QUANTITY: { en: 'Quantity', ru: 'Количество' },
  SUBTOTAL: { en: 'Subtotal', ru: 'Сумма' },
  TOTAL: { en: 'Total', ru: 'Итого' },
};
class CartPageView {
  private addDiscountCallback: DiscountCallback;

  private clear: LinkModel;

  private clearCallback: ClearCallback;

  private couponButton: HTMLButtonElement;

  private discount: HTMLParagraphElement;

  private empty: HTMLDivElement;

  private language: LanguageChoiceType;

  private page: HTMLDivElement;

  private parent: HTMLDivElement;

  private productRow: HTMLTableRowElement[] = [];

  private productWrap: HTMLDivElement;

  private subTotal: HTMLParagraphElement;

  private table: HTMLTableElement | null = null;

  private tableBody: HTMLTableSectionElement | null = null;

  private textElement: textElementsType[] = [];

  private total: HTMLParagraphElement;

  private totalWrap: HTMLDivElement;

  constructor(parent: HTMLDivElement, clearCallback: ClearCallback, addDiscountCallback: DiscountCallback) {
    this.language = getStore().getState().currentLanguage;
    this.parent = parent;
    this.parent.innerHTML = '';
    this.clearCallback = clearCallback;
    this.addDiscountCallback = addDiscountCallback;
    this.page = this.createPageHTML();
    this.productWrap = this.createWrapHTML();
    this.productWrap.classList.add(styles.products);
    this.subTotal = createBaseElement({ cssClasses: [styles.totalTitle], tag: 'p' });
    this.total = createBaseElement({ cssClasses: [styles.totalPrice], tag: 'p' });
    this.discount = createBaseElement({ cssClasses: [styles.title], tag: 'p' });
    this.couponButton = createBaseElement({
      cssClasses: [styles.button, styles.applyBtn],
      innerContent: TITLE.BUTTON_COUPON[this.language],
      tag: 'button',
    });
    this.clear = new LinkModel({ classes: [styles.continue, styles.clear], text: TITLE.CLEAR[this.language] });
    this.totalWrap = this.createWrapHTML();
    this.totalWrap.classList.add(styles.total);
    this.page.append(this.productWrap);
    this.page.append(this.totalWrap);
    this.empty = this.createEmptyHTML();
    window.scrollTo(0, 0);
  }

  private addTableHeader(): void {
    this.table = createBaseElement({ cssClasses: [styles.table], tag: 'table' });
    const thead = createBaseElement({ cssClasses: [styles.thead, styles.head], tag: 'thead' });
    const tr = createBaseElement({ cssClasses: [styles.tr, styles.head], tag: 'tr' });
    const thImage = createBaseElement({
      cssClasses: [styles.th, styles.imgCell, styles.mainText],
      innerContent: TITLE.PRODUCT[this.language],
      tag: 'th',
    });
    this.textElement.push({ element: thImage, textItem: TITLE.PRODUCT });
    const thProduct = createBaseElement({ cssClasses: [styles.th, styles.nameCell, styles.mainText], tag: 'th' });
    const thPrice = createBaseElement({
      cssClasses: [styles.th, styles.priceCell, styles.mainText],
      innerContent: TITLE.PRICE[this.language],
      tag: 'th',
    });
    this.textElement.push({ element: thPrice, textItem: TITLE.PRICE });
    const thQuantity = createBaseElement({
      cssClasses: [styles.th, styles.quantityCell, styles.mainText],
      innerContent: TITLE.QUANTITY[this.language],
      tag: 'th',
    });
    this.textElement.push({ element: thQuantity, textItem: TITLE.QUANTITY });
    const thTotal = createBaseElement({
      cssClasses: [styles.th, styles.totalCell, styles.mainText],
      innerContent: TITLE.TOTAL[this.language],
      tag: 'th',
    });
    this.textElement.push({ element: thTotal, textItem: TITLE.TOTAL });
    const thDelete = this.createDeleCell();
    this.tableBody = createBaseElement({ cssClasses: [styles.tbody], tag: 'tbody' });
    this.table.append(thead, this.tableBody);
    thead.append(tr);
    tr.append(thImage, thProduct, thPrice, thQuantity, thTotal, thDelete);
    this.productWrap.append(this.table);
  }

  private addTotalInfo(): void {
    const title = createBaseElement({
      cssClasses: [styles.totalTitle, styles.border, styles.mobileHide],
      innerContent: TITLE.CART_TOTAL[this.language],
      tag: 'p',
    });
    this.textElement.push({ element: title, textItem: TITLE.CART_TOTAL });
    const couponTitle = createBaseElement({
      cssClasses: [styles.title, styles.mobileHide],
      innerContent: TITLE.COUPON_APPLY[this.language],
      tag: 'p',
    });
    this.textElement.push({ element: couponTitle, textItem: TITLE.COUPON_APPLY });
    const couponWrap = this.createCouponHTML();
    const subtotalWrap = this.createSubtotalHTML();
    const discountWrap = this.createDiscountHTML();
    const totalWrap = this.createTotalHTML();
    const finalButton = createBaseElement({
      cssClasses: [styles.button, styles.checkoutBtn],
      innerContent: TITLE.BUTTON_CHECKOUT[this.language],
      tag: 'button',
    });
    this.textElement.push({ element: finalButton, textItem: TITLE.BUTTON_CHECKOUT });
    const continueLink = this.createCatalogLinkHTML();
    continueLink.getHTML().classList.add(styles.mobileHide);
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
      classes: [styles.continue],
      text: TITLE.CONTINUE[this.language],
    });
    this.textElement.push({ element: link.getHTML(), textItem: TITLE.CONTINUE });

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
      placeholder: TITLE.INPUT_COUPON[this.language],
      type: INPUT_TYPE.TEXT,
    });
    couponInput.getHTML().classList.add(styles.couponInput);

    this.textElement.push({ element: couponInput.getHTML(), textItem: TITLE.INPUT_COUPON });
    this.textElement.push({ element: this.couponButton, textItem: TITLE.BUTTON_COUPON });
    this.couponButton.addEventListener('click', (evn: Event) => {
      evn.preventDefault();
      this.addDiscountCallback(couponInput.getHTML().value);
      couponInput.getHTML().value = '';
    });
    couponWrap.append(couponInput.getHTML(), this.couponButton);
    return couponWrap;
  }

  private createDeleCell(): HTMLTableCellElement {
    const tdDelete = createBaseElement({ cssClasses: [styles.th, styles.deleteCell, styles.mainText], tag: 'th' });

    this.textElement.push({ element: this.clear.getHTML(), textItem: TITLE.CLEAR });
    this.clear.getHTML().addEventListener('click', (event) => {
      event.preventDefault();
      this.clearCallback();
    });
    tdDelete.append(this.clear.getHTML());
    return tdDelete;
  }

  private createDiscountHTML(): HTMLDivElement {
    const discountWrap = createBaseElement({ cssClasses: [styles.totalWrap], tag: 'div' });
    const discountTitle = createBaseElement({
      cssClasses: [styles.title],
      innerContent: TITLE.COUPON_DISCOUNT[this.language],
      tag: 'p',
    });
    discountWrap.append(discountTitle, this.discount);
    this.textElement.push({ element: discountTitle, textItem: TITLE.COUPON_DISCOUNT });
    return discountWrap;
  }

  private createEmptyHTML(): HTMLDivElement {
    const empty = createBaseElement({ cssClasses: [styles.empty, styles.hide], tag: 'div' });
    const emptyTitle = createBaseElement({
      cssClasses: [styles.emptyTitle],
      innerContent: TITLE.EMPTY[this.language],
      tag: 'p',
    });
    this.textElement.push({ element: emptyTitle, textItem: TITLE.EMPTY });
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
      innerContent: TITLE.SUBTOTAL[this.language],
      tag: 'p',
    });
    subtotalWrap.append(subtotalTitle, this.subTotal);
    this.textElement.push({ element: subtotalTitle, textItem: TITLE.SUBTOTAL });
    return subtotalWrap;
  }

  private createTotalHTML(): HTMLDivElement {
    const totalWrap = createBaseElement({ cssClasses: [styles.totalWrap], tag: 'div' });
    const totalTitle = createBaseElement({
      cssClasses: [styles.totalTitle],
      innerContent: TITLE.TOTAL[this.language],
      tag: 'p',
    });
    totalWrap.append(totalTitle, this.total);
    this.textElement.push({ element: totalTitle, textItem: TITLE.TOTAL });
    return totalWrap;
  }

  private createWrapHTML(): HTMLDivElement {
    const wrap = createBaseElement({
      cssClasses: [styles.wrap],
      tag: 'div',
    });

    return wrap;
  }

  public getCouponButton(): HTMLButtonElement {
    return this.couponButton;
  }

  public getHTML(): HTMLDivElement {
    return this.page;
  }

  public renderCart(productsItem: ProductOrderModel[]): void {
    this.productWrap.innerHTML = '';
    this.totalWrap.innerHTML = '';
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
    this.productWrap.innerHTML = '';
    this.totalWrap.innerHTML = '';
    this.productWrap.classList.add(styles.hide);
    this.totalWrap.classList.add(styles.hide);
    this.empty.classList.remove(styles.hide);
  }

  public updateLanguage(): void {
    this.language = getStore().getState().currentLanguage;
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
    this.subTotal.innerHTML = `$ ${(cart.total + cart.discounts).toFixed(2)}`;
    this.discount.innerHTML = `-$ ${cart.discounts.toFixed(2)}`;
    this.total.innerHTML = `$ ${cart.total.toFixed(2)}`;
  }
}
export default CartPageView;
