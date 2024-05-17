import type { AddCartItem, Cart } from '@/shared/types/cart.ts';
import type { Variant } from '@/shared/types/product.ts';
import type ProductCardParams from '@/shared/types/productCard';
import type { ShoppingList, ShoppingListProduct } from '@/shared/types/shopping-list.ts';

import getCartModel from '@/shared/API/cart/model/CartModel.ts';
import getShoppingListModel from '@/shared/API/shopping-list/model/ShoppingListModel.ts';
import showErrorMessage from '@/shared/utils/userMessage.ts';

import ProductCardView from '../view/ProductCardView.ts';

class ProductCardModel {
  private currentVariant: Variant;

  private params: ProductCardParams;

  private view: ProductCardView;

  constructor(params: ProductCardParams, currentSize: null | string, shoppingList: ShoppingList, cart: Cart) {
    this.params = params;
    this.currentVariant = this.params.variant.find(({ size }) => size === currentSize) ?? this.params.variant[0];
    this.view = new ProductCardView(params, this.currentVariant);
    this.init(shoppingList, cart);
  }

  private addProductToCartHandler(): void {
    getCartModel()
      .addProductToCart(this.getProductMeta())
      .then(() => this.view.getAddToCardButton().setDisabled())
      .catch(showErrorMessage);
  }

  private addProductToWishListHandler(): void {
    getShoppingListModel()
      .addProduct(this.params.id)
      .then(() => this.view.switchStateWishListButton(true))
      .catch(showErrorMessage);
  }

  private deleteProductToWishListHandler(productInWishList: ShoppingListProduct): void {
    getShoppingListModel()
      .deleteProduct(productInWishList)
      .then(() => this.view.switchStateWishListButton(false))
      .catch(showErrorMessage);
  }

  private getProductMeta(): AddCartItem {
    return {
      productId: this.params.id,
      quantity: 1,
      variantId: this.currentVariant.id,
    };
  }

  private hasProductInCart(cart: Cart): void {
    const result = cart.products.find((product) => product.productId === this.params.id);
    if (result) {
      this.view.getAddToCardButton().setDisabled();
    }
  }

  private hasProductInWishList(shoppingList: ShoppingList): void {
    const result = shoppingList.products.find((product) => product.productId === this.params.id);
    this.view.switchStateWishListButton(Boolean(result));
  }

  private init(shoppingList: ShoppingList, cart: Cart): void {
    this.setButtonHandlers();
    this.hasProductInWishList(shoppingList);
    this.hasProductInCart(cart);
  }

  private setButtonHandlers(): void {
    const addToCardButton = this.view.getAddToCardButton();
    const switchToWishListButton = this.view.getSwitchToWishListButton();
    addToCardButton.getHTML().addEventListener('click', () => this.addProductToCartHandler());
    switchToWishListButton.getHTML().addEventListener('click', async () => {
      const shoppingList = await getShoppingListModel().getShoppingList();
      const productInWishList = shoppingList.products.find((product) => product.productId === this.params.id);
      if (productInWishList) {
        this.deleteProductToWishListHandler(productInWishList);
      } else {
        this.addProductToWishListHandler();
      }
    });
  }

  public getHTML(): HTMLLIElement {
    return this.view.getHTML();
  }
}

export default ProductCardModel;
