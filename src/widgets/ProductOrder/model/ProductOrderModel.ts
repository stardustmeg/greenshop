import type { Cart, CartProduct, EditCartItem } from '@/shared/types/cart.ts';

import ProductPriceModel from '@/entities/ProductPrice/model/ProductPriceModel.ts';
import getCartModel from '@/shared/API/cart/model/CartModel.ts';
import LoaderModel from '@/shared/Loader/model/LoaderModel.ts';
import observeStore, { selectCurrentLanguage } from '@/shared/Store/observer.ts';
import { LOADER_SIZE } from '@/shared/constants/sizes.ts';
import { CartActive } from '@/shared/types/cart.ts';
import getLanguageValue from '@/shared/utils/getLanguageValue.ts';
import { productRemovedFromCartMessage } from '@/shared/utils/messageTemplates.ts';
import { showErrorMessage, showSuccessMessage } from '@/shared/utils/userMessage.ts';

import ProductOrderView from '../view/ProductOrderView.ts';

type Callback = (cart: Cart) => void;

class ProductOrderModel {
  private callback: Callback;

  private price: ProductPriceModel;

  private productItem: CartProduct;

  private total: ProductPriceModel;

  private view: ProductOrderView;

  constructor(productItem: CartProduct, callback: Callback) {
    this.callback = callback;
    this.productItem = productItem;
    this.price = new ProductPriceModel({ new: this.productItem.priceCouponDiscount, old: this.productItem.price });
    this.total = new ProductPriceModel({
      new:
        this.productItem.totalPrice === this.productItem.totalPriceCouponDiscount
          ? 0
          : this.productItem.totalPriceCouponDiscount,
      old: this.productItem.totalPrice,
    });
    this.view = new ProductOrderView(this.productItem, this.price, this.total, this.updateProductHandler.bind(this));
    this.init();
  }

  private async activeDelete(): Promise<void> {
    const loader = new LoaderModel(LOADER_SIZE.EXTRA_SMALL).getHTML();
    this.view.getDeleteButton().append(loader);
    await getCartModel()
      .deleteProductFromCart(this.productItem)
      .then((cart) => {
        if (cart) {
          showSuccessMessage(productRemovedFromCartMessage(getLanguageValue(this.productItem.name)));
          const updateItem = cart.products.find((item) => item.lineItemId === this.productItem.lineItemId);
          this.updateView(updateItem);
          this.callback(cart);
        }
      })
      .catch((error) => {
        showErrorMessage(error);
      })
      .finally(() => loader.remove());
  }

  private async activeMinus(): Promise<void> {
    const active: EditCartItem = {
      lineId: this.productItem.lineItemId,
      quantity: this.productItem.quantity - 1,
    };
    const cart = await getCartModel().editProductCount(active);
    const updateItem = cart.products.find((item) => item.lineItemId === this.productItem.lineItemId);
    this.updateView(updateItem);
    this.callback(cart);
  }

  private async activePlus(): Promise<void> {
    const active: EditCartItem = {
      lineId: this.productItem.lineItemId,
      quantity: this.productItem.quantity + 1,
    };
    const cart = await getCartModel().editProductCount(active);
    const updateItem = cart.products.find((item) => item.lineItemId === this.productItem.lineItemId);
    this.updateView(updateItem);
    this.callback(cart);
  }

  private init(): void {
    observeStore(selectCurrentLanguage, () => this.view.updateLanguage());
  }

  private updateView(item: CartProduct | undefined): void {
    if (item) {
      this.productItem = item;
      this.view.updateInfo(this.productItem);
    } else {
      this.getHTML().remove();
    }
  }

  public getHTML(): HTMLTableRowElement {
    return this.view.getHTML();
  }

  public getProduct(): CartProduct {
    return this.productItem;
  }

  public setProduct(product: CartProduct): CartProduct {
    this.productItem = product;
    return this.productItem;
  }

  public async updateProductHandler(active: CartActive): Promise<void> {
    switch (active) {
      case CartActive.DELETE: {
        await this.activeDelete();
        break;
      }
      case CartActive.MINUS: {
        await this.activeMinus();
        break;
      }
      case CartActive.PLUS: {
        await this.activePlus();
        break;
      }
      case CartActive.UPDATE: {
        this.updateView(this.productItem);
        break;
      }
      default:
        break;
    }
  }
}

export default ProductOrderModel;
