import type { Cart, CartProduct, EditCartItem } from '@/shared/types/cart.ts';

import getCartModel from '@/shared/API/cart/model/CartModel.ts';
import LoaderModel from '@/shared/Loader/model/LoaderModel.ts';
import getStore from '@/shared/Store/Store.ts';
import observeStore, { selectCurrentLanguage } from '@/shared/Store/observer.ts';
import { LANGUAGE_CHOICE } from '@/shared/constants/common.ts';
import { LOADER_SIZE } from '@/shared/constants/sizes.ts';
import { CartActive } from '@/shared/types/cart.ts';
import { productRemovedFromCartMessage } from '@/shared/utils/messageTemplates.ts';
import { showErrorMessage, showSuccessMessage } from '@/shared/utils/userMessage.ts';

import ProductOrderView from '../view/ProductOrderView.ts';

type Callback = (cart: Cart) => void;

class ProductOrderModel {
  private callback: Callback;

  private productItem: CartProduct;

  private view: ProductOrderView;

  constructor(productItem: CartProduct, callback: Callback) {
    this.callback = callback;
    this.productItem = productItem;
    this.view = new ProductOrderView(this.productItem, this.updateProductHandler.bind(this));
    this.init();
  }

  private async activeDelete(): Promise<void> {
    const loader = new LoaderModel(LOADER_SIZE.EXTRA_SMALL).getHTML();
    this.view.getDeleteButton().append(loader);
    await getCartModel()
      .deleteProductFromCart(this.productItem)
      .then((cart) => {
        if (cart) {
          showSuccessMessage(
            productRemovedFromCartMessage(
              this.productItem.name[Number(getStore().getState().currentLanguage === LANGUAGE_CHOICE.RU)].value,
            ),
          );
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

  public getHTML(): HTMLDivElement {
    return this.view.getHTML();
  }

  public getProduct(): CartProduct {
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
      default:
        break;
    }
  }
}

export default ProductOrderModel;
