import type { AddCartItem, Cart } from '@/shared/types/cart.ts';
import type { Variant } from '@/shared/types/product.ts';
import type ProductCardParams from '@/shared/types/productCard';
import type { ShoppingList, ShoppingListProduct } from '@/shared/types/shopping-list.ts';

import RouterModel from '@/app/Router/model/RouterModel.ts';
import ProductPriceModel from '@/entities/ProductPrice/model/ProductPriceModel.ts';
import getCartModel from '@/shared/API/cart/model/CartModel.ts';
import getShoppingListModel from '@/shared/API/shopping-list/model/ShoppingListModel.ts';
import { PAGE_ID } from '@/shared/constants/pages.ts';
import { buildPathName } from '@/shared/utils/buildPathname.ts';
import showErrorMessage from '@/shared/utils/userMessage.ts';

import ProductCardView from '../view/ProductCardView.ts';

class ProductCardModel {
  private currentSize: null | string;

  private currentVariant: Variant;

  private params: ProductCardParams;

  private price: ProductPriceModel;

  private view: ProductCardView;

  constructor(params: ProductCardParams, currentSize: null | string, shoppingList: ShoppingList, cart: Cart) {
    this.params = params;
    this.currentSize = currentSize;
    this.currentVariant = this.params.variant.find(({ size }) => size === currentSize) ?? this.params.variant[0];
    this.view = new ProductCardView(params, currentSize);
    this.price = new ProductPriceModel(this.currentVariant);
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

  private goDetailsPageHandler(): void {
    const goDetailsPageLink = this.view.getGoDetailsPageLink();
    goDetailsPageLink.getHTML().addEventListener('click', (event) => {
      event.preventDefault();
      const path = buildPathName(PAGE_ID.PRODUCT_PAGE, this.params.key, {
        size: [this.currentSize ?? this.params.variant[0].size],
      });

      RouterModel.getInstance().navigateTo(path);
    });
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
    this.goDetailsPageHandler();
    this.view.getBottomWrapper().append(this.price.getHTML());
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
