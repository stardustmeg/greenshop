import type { AddCartItem, Cart } from '@/shared/types/cart.ts';
import type { Product, ProductInfoParams, Variant } from '@/shared/types/product.ts';
import type { ShoppingList, ShoppingListProduct } from '@/shared/types/shopping-list.ts';

import RouterModel from '@/app/Router/model/RouterModel.ts';
import ProductPriceModel from '@/entities/ProductPrice/model/ProductPriceModel.ts';
import getCartModel from '@/shared/API/cart/model/CartModel.ts';
import getShoppingListModel from '@/shared/API/shopping-list/model/ShoppingListModel.ts';
import modal from '@/shared/Modal/model/ModalModel.ts';
import serverMessageModel from '@/shared/ServerMessage/model/ServerMessageModel.ts';
import { MESSAGE_STATUS, SERVER_MESSAGE_KEYS } from '@/shared/constants/messages.ts';
import { PAGE_ID } from '@/shared/constants/pages.ts';
import { buildPathName } from '@/shared/utils/buildPathname.ts';
import showErrorMessage from '@/shared/utils/userMessage.ts';
import ProductInfoModel from '@/widgets/ProductInfo/model/ProductInfoModel.ts';

import ProductCardView from '../view/ProductCardView.ts';

class ProductCardModel {
  private currentSize: null | string;

  private currentVariant: Variant;

  private params: Product;

  private price: ProductPriceModel;

  private view: ProductCardView;

  constructor(params: Product, currentSize: null | string, shoppingList: ShoppingList, cart: Cart) {
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
      .then(() => {
        serverMessageModel.showServerMessage(
          SERVER_MESSAGE_KEYS.SUCCESSFUL_ADD_PRODUCT_TO_CART,
          MESSAGE_STATUS.SUCCESS,
        );
        this.view.getAddToCartButton().setDisabled();
      })
      .catch(showErrorMessage);
  }

  private addProductToWishListHandler(): void {
    getShoppingListModel()
      .addProduct(this.params.id)
      .then(() => {
        serverMessageModel.showServerMessage(
          SERVER_MESSAGE_KEYS.SUCCESSFUL_ADD_PRODUCT_TO_WISHLIST,
          MESSAGE_STATUS.SUCCESS,
        );
        this.view.switchStateWishListButton(true);
      })
      .catch(showErrorMessage);
  }

  private deleteProductToWishListHandler(productInWishList: ShoppingListProduct): void {
    getShoppingListModel()
      .deleteProduct(productInWishList)
      .then(() => {
        serverMessageModel.showServerMessage(
          SERVER_MESSAGE_KEYS.SUCCESSFUL_DELETE_PRODUCT_FROM_WISHLIST,
          MESSAGE_STATUS.SUCCESS,
        );
        this.view.switchStateWishListButton(false);
      })
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
      this.view.getAddToCartButton().setDisabled();
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
    this.setCardHandler();
  }

  private setButtonHandlers(): void {
    const addToCartButton = this.view.getAddToCartButton();
    const switchToWishListButton = this.view.getSwitchToWishListButton();
    addToCartButton.getHTML().addEventListener('click', () => this.addProductToCartHandler());
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

  private setCardHandler(): void {
    this.getHTML().addEventListener('click', ({ target }) => {
      if (
        target instanceof HTMLElement &&
        !this.view.getButtonsWrapper().contains(target) &&
        !this.view.getMoreButton().getHTML().contains(target)
      ) {
        const params: ProductInfoParams = {
          ...this.params,
          currentSize: this.currentSize,
        };
        modal.show();
        modal.setContent(new ProductInfoModel(params).getHTML());
      }
    });
  }

  public getHTML(): HTMLLIElement {
    return this.view.getHTML();
  }
}

export default ProductCardModel;
