import type { AddCartItem, Cart } from '@/shared/types/cart.ts';
import type { Product, ProductInfoParams, Variant } from '@/shared/types/product.ts';

import RouterModel from '@/app/Router/model/RouterModel.ts';
import ProductPriceModel from '@/entities/ProductPrice/model/ProductPriceModel.ts';
import WishlistButtonModel from '@/features/WishlistButton/model/WishlistButtonModel.ts';
import getCartModel from '@/shared/API/cart/model/CartModel.ts';
import modal from '@/shared/Modal/model/ModalModel.ts';
import getStore from '@/shared/Store/Store.ts';
import { LANGUAGE_CHOICE } from '@/shared/constants/common.ts';
import * as buildPath from '@/shared/utils/buildPathname.ts';
import { productAddedToCartMessage } from '@/shared/utils/messageTemplates.ts';
import { showErrorMessage, showSuccessMessage } from '@/shared/utils/userMessage.ts';
import ProductInfoModel from '@/widgets/ProductInfo/model/ProductInfoModel.ts';

import ProductCardView from '../view/ProductCardView.ts';

class ProductCardModel {
  private currentSize: null | string;

  private currentVariant: Variant;

  private params: Product;

  private price: ProductPriceModel;

  private view: ProductCardView;

  private wishlistButton: WishlistButtonModel;

  constructor(params: Product, currentSize: null | string, cart: Cart) {
    this.params = params;
    this.currentSize = currentSize ?? this.params.variant[0].size;
    this.currentVariant = this.params.variant.find(({ size }) => size === currentSize) ?? this.params.variant[0];
    this.view = new ProductCardView(params, currentSize);
    this.price = new ProductPriceModel({ new: this.currentVariant.discount, old: this.currentVariant.price });
    this.wishlistButton = new WishlistButtonModel(this.params);
    this.init(cart);
  }

  private addProductToCartHandler(): void {
    getCartModel()
      .addProductToCart(this.getProductMeta())
      .then(() => {
        showSuccessMessage(productAddedToCartMessage(this.getProductMeta().name));
        this.view.getAddToCartButton().setDisabled();
      })
      .catch(showErrorMessage);
  }

  private getProductMeta(): AddCartItem {
    return {
      name: this.params.name[Number(getStore().getState().currentLanguage === LANGUAGE_CHOICE.RU)].value,
      productId: this.params.id,
      quantity: 1,
      variantId: this.currentVariant.id,
    };
  }

  private goDetailsPageHandler(): void {
    const goDetailsPageLink = this.view.getGoDetailsPageLink();
    goDetailsPageLink.getHTML().addEventListener('click', (event) => {
      event.preventDefault();
      const path = buildPath.productPathWithIDAndQuery(this.params.key, {
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

  private init(cart: Cart): void {
    this.setAddToCartButtonHandler();
    this.hasProductInCart(cart);
    this.goDetailsPageHandler();
    this.setCardHandler();
    this.view.getBottomWrapper().append(this.price.getHTML());
    this.view.getButtonsWrapper().append(this.wishlistButton.getHTML().getHTML());
  }

  private setAddToCartButtonHandler(): void {
    this.view
      .getAddToCartButton()
      .getHTML()
      .addEventListener('click', () => this.addProductToCartHandler());
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
