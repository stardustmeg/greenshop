import type { Cart, Coupon } from '@/shared/types/cart.ts';
import type { Page } from '@/shared/types/page.ts';

import SummaryModel from '@/entities/Summary/model/SummaryModel.ts';
import getCartModel from '@/shared/API/cart/model/CartModel.ts';
import getCustomerModel from '@/shared/API/customer/model/CustomerModel.ts';
import LoaderModel from '@/shared/Loader/model/LoaderModel.ts';
import getStore from '@/shared/Store/Store.ts';
import { setCurrentPage } from '@/shared/Store/actions.ts';
import observeStore, { selectCurrentLanguage } from '@/shared/Store/observer.ts';
import { SERVER_MESSAGE_KEY } from '@/shared/constants/messages.ts';
import { PAGE_ID } from '@/shared/constants/pages.ts';
import { LOADER_SIZE } from '@/shared/constants/sizes.ts';
import { CartActive } from '@/shared/types/cart.ts';
import { promoCodeAppliedMessage, promoCodeDeleteMessage } from '@/shared/utils/messageTemplates.ts';
import { showErrorMessage, showSuccessMessage } from '@/shared/utils/userMessage.ts';
import ProductOrderModel from '@/widgets/ProductOrder/model/ProductOrderModel.ts';

import CartPageView from '../view/CartPageView.ts';

const HAPPY_BIRTHDAY = 'HAPPY-BIRTHDAY-10';
const TITLE_SUMMARY = {
  cart: { en: 'Cart Discount', ru: 'Скидка на корзину' },
  product: { en: 'Product Discount', ru: 'Скидка на продукты' },
};

class CartPageModel implements Page {
  private cart: Cart | null = null;

  private cartCouponSummary: SummaryModel;

  private productCouponSummary: SummaryModel;

  private productsItem: ProductOrderModel[] = [];

  private view: CartPageView;

  constructor(parent: HTMLDivElement) {
    this.cartCouponSummary = new SummaryModel(TITLE_SUMMARY.cart, this.deleteDiscountHandler.bind(this));
    this.productCouponSummary = new SummaryModel(TITLE_SUMMARY.product, this.deleteDiscountHandler.bind(this));
    this.view = new CartPageView(
      parent,
      this.cartCouponSummary,
      this.productCouponSummary,
      this.clearCart.bind(this),
      this.addDiscountHandler.bind(this),
    );

    this.init().catch(showErrorMessage);
  }

  private async addDiscountHandler(discountCode: string): Promise<void> {
    if (discountCode.trim()) {
      if (discountCode.trim() === HAPPY_BIRTHDAY) {
        await this.checkBirthday();
      }
      const loader = new LoaderModel(LOADER_SIZE.SMALL).getHTML();
      this.view.getCouponButton().append(loader);
      await getCartModel()
        .addCoupon(discountCode)
        .then((cart) => {
          if (cart) {
            showSuccessMessage(promoCodeAppliedMessage(discountCode));
            this.cart = cart;
            this.productsItem.forEach((productItem) => {
              const idLine = productItem.getProduct().lineItemId;
              const updateLine = this.cart?.products.find((item) => item.lineItemId === idLine);
              if (updateLine) {
                productItem.setProduct(updateLine);
                productItem.updateProductHandler(CartActive.UPDATE).catch(showErrorMessage);
              }
            });
            this.cartCouponSummary.update(this.cart.discountsCart);
            this.productCouponSummary.update(this.cart.discountsProduct);
            this.view.updateTotal(this.cart);
          }
        })
        .catch(showErrorMessage)
        .finally(() => loader.remove());
    }
  }

  private changeProductHandler(cart: Cart): void {
    this.cart = cart;
    this.productsItem = this.productsItem.filter((productItem) => {
      const searchEl = this.cart?.products.find((item) => item.lineItemId === productItem.getProduct().lineItemId);
      if (!searchEl) {
        productItem.getHTML().remove();
        return false;
      }
      return true;
    });

    if (!this.productsItem.length) {
      this.view.renderEmpty();
    }
    this.cartCouponSummary.update(this.cart.discountsCart);
    this.productCouponSummary.update(this.cart.discountsProduct);
    this.view.updateTotal(this.cart);
  }

  private async checkBirthday(): Promise<void> {
    if (!getStore().getState().isUserLoggedIn) {
      throw showErrorMessage(SERVER_MESSAGE_KEY.COUPON_NEED_LOGIN);
    }
    const customer = await getCustomerModel().getCurrentUser();
    if (customer?.birthDate) {
      if (customer?.birthDate) {
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);
        const birthDate = new Date(customer.birthDate);
        birthDate.setFullYear(currentDate.getFullYear());
        birthDate.setHours(0, 0, 0, 0);
        const startBirthdayPeriod = new Date(birthDate);
        startBirthdayPeriod.setDate(birthDate.getDate() - 3);
        const endBirthdayPeriod = new Date(birthDate);
        endBirthdayPeriod.setDate(birthDate.getDate() + 3);

        if (currentDate >= startBirthdayPeriod && currentDate <= endBirthdayPeriod) {
          return;
        }
        throw showErrorMessage(SERVER_MESSAGE_KEY.COUPON_WRONG_DATE);
      }
    }
  }

  private async clearCart(): Promise<void> {
    await getCartModel()
      .clearCart()
      .then((cart) => {
        this.cart = cart;
        showSuccessMessage(SERVER_MESSAGE_KEY.SUCCESSFUL_CLEAR_CART);
        this.productsItem = this.productsItem.filter((productItem) => {
          const searchEl = this.cart?.products.find((item) => item.lineItemId === productItem.getProduct().lineItemId);
          if (!searchEl) {
            productItem.getHTML().remove();
            return false;
          }
          return true;
        });
        this.renderCart();
      })
      .catch((error: Error) => {
        showErrorMessage(error);
        return this.cart;
      });
  }

  private async deleteDiscountHandler(coupon: Coupon): Promise<void> {
    const loader = new LoaderModel(LOADER_SIZE.SMALL).getHTML();
    this.view.getCouponButton().append(loader);
    await getCartModel()
      .deleteCoupon(coupon.cartDiscount)
      .then((cart) => {
        if (cart) {
          showSuccessMessage(promoCodeDeleteMessage(coupon.discountCode));
          this.cart = cart;
          this.productsItem.forEach((productItem) => {
            const idLine = productItem.getProduct().lineItemId;
            const updateLine = this.cart?.products.find((item) => item.lineItemId === idLine);
            if (updateLine) {
              productItem.setProduct(updateLine);
              productItem.updateProductHandler(CartActive.UPDATE).catch(showErrorMessage);
            }
          });
          this.cartCouponSummary.update(this.cart.discountsCart);
          this.productCouponSummary.update(this.cart.discountsProduct);
          this.view.updateTotal(this.cart);
        }
      })
      .catch(showErrorMessage)
      .finally(() => loader.remove());
  }

  private async init(): Promise<void> {
    getStore().dispatch(setCurrentPage(PAGE_ID.CART_PAGE));
    this.cart = await getCartModel().addProductInfo();
    this.renderCart();
    observeStore(selectCurrentLanguage, () => this.view.updateLanguage());
  }

  private renderCart(): void {
    if (this.cart) {
      this.cart.products.forEach((product) => {
        this.productsItem.push(new ProductOrderModel(product, this.changeProductHandler.bind(this)));
      });

      this.cart.discountsCart.forEach((discount) => {
        this.cartCouponSummary.addCoupon(discount);
      });
      this.cart.discountsProduct.forEach((discount) => {
        this.productCouponSummary.addCoupon(discount);
      });
      if (this.productsItem.length) {
        this.view.renderCart(this.productsItem);
      } else {
        this.view.renderEmpty();
      }
      this.cartCouponSummary.update(this.cart.discountsCart);
      this.productCouponSummary.update(this.cart.discountsProduct);
      this.view.updateTotal(this.cart);
    }
  }

  public getHTML(): HTMLDivElement {
    return this.view.getHTML();
  }
}

export default CartPageModel;
