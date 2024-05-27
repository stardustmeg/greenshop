import type { Cart } from '@/shared/types/cart.ts';
import type { ProductInfoParams, Variant } from '@/shared/types/product.ts';
import type { ShoppingListProduct } from '@/shared/types/shopping-list.ts';

import RouterModel from '@/app/Router/model/RouterModel.ts';
import ProductModalSliderModel from '@/entities/ProductModalSlider/model/ProductModalSliderModel.ts';
import ProductPriceModel from '@/entities/ProductPrice/model/ProductPriceModel.ts';
import getCartModel from '@/shared/API/cart/model/CartModel.ts';
import getShoppingListModel from '@/shared/API/shopping-list/model/ShoppingListModel.ts';
import EventMediatorModel from '@/shared/EventMediator/model/EventMediatorModel.ts';
import LoaderModel from '@/shared/Loader/model/LoaderModel.ts';
import modal from '@/shared/Modal/model/ModalModel.ts';
import serverMessageModel from '@/shared/ServerMessage/model/ServerMessageModel.ts';
import MEDIATOR_EVENT from '@/shared/constants/events.ts';
import { MESSAGE_STATUS, SERVER_MESSAGE_KEYS } from '@/shared/constants/messages.ts';
import { PAGE_ID } from '@/shared/constants/pages.ts';
import { LOADER_SIZE } from '@/shared/constants/sizes.ts';
import { buildPathName } from '@/shared/utils/buildPathname.ts';
import showErrorMessage from '@/shared/utils/userMessage.ts';
import Swiper from 'swiper';
import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/bundle';
import { Autoplay, Thumbs } from 'swiper/modules';

import ProductInfoView from '../view/ProductInfoView.ts';

const SLIDER_DELAY = 5000;
const SLIDER_PER_VIEW = 1;

class ProductInfoModel {
  private bigSlider: Swiper | null = null;

  private currentVariant: Variant;

  private params: ProductInfoParams;

  private price: ProductPriceModel;

  private smallSlider: Swiper | null = null;

  private view: ProductInfoView;

  constructor(params: ProductInfoParams) {
    this.params = params;
    this.view = new ProductInfoView(this.params);
    this.currentVariant =
      this.params.variant.find(({ size }) => size === this.params.currentSize) ?? this.params.variant[0];
    this.price = new ProductPriceModel(this.currentVariant);
    this.init();
  }

  private addProductToCart(): void {
    const loader = new LoaderModel(LOADER_SIZE.EXTRA_SMALL).getHTML();
    this.view.getSwitchToCartButton().getHTML().append(loader);
    getCartModel()
      .addProductToCart({ productId: this.params.id, quantity: 1, variantId: this.currentVariant.id })
      .then(() => {
        this.view.switchToCartButtonText(true);
        serverMessageModel.showServerMessage(
          SERVER_MESSAGE_KEYS.SUCCESSFUL_ADD_PRODUCT_TO_CART,
          MESSAGE_STATUS.SUCCESS,
        );
        EventMediatorModel.getInstance().notify(MEDIATOR_EVENT.REDRAW_PRODUCTS, '');
      })
      .catch(showErrorMessage)
      .finally(() => loader.remove());
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
        EventMediatorModel.getInstance().notify(MEDIATOR_EVENT.REDRAW_PRODUCTS, '');
      })
      .catch(showErrorMessage);
  }

  private deleteProductFromCart(cart: Cart): void {
    const currentProduct = cart.products.find((product) => product.key === this.params.key);
    if (currentProduct) {
      const loader = new LoaderModel(LOADER_SIZE.EXTRA_SMALL).getHTML();
      this.view.getSwitchToCartButton().getHTML().append(loader);
      getCartModel()
        .deleteProductFromCart(currentProduct)
        .then(() => {
          this.view.switchToCartButtonText(false);
          serverMessageModel.showServerMessage(
            SERVER_MESSAGE_KEYS.SUCCESSFUL_DELETE_PRODUCT_FROM_CART,
            MESSAGE_STATUS.SUCCESS,
          );
          EventMediatorModel.getInstance().notify(MEDIATOR_EVENT.REDRAW_PRODUCTS, '');
        })
        .catch(showErrorMessage)
        .finally(() => loader.remove());
    }
  }

  private deleteProductToWishListHandler(productInWishList: ShoppingListProduct): void {
    getShoppingListModel()
      .deleteProduct(productInWishList)
      .then(() => {
        serverMessageModel.showServerMessage(
          SERVER_MESSAGE_KEYS.SUCCESSFUL_DELETE_PRODUCT_FROM_WISHLIST,
          MESSAGE_STATUS.SUCCESS,
        );
        EventMediatorModel.getInstance().notify(MEDIATOR_EVENT.REDRAW_PRODUCTS, '');
        this.view.switchStateWishListButton(false);
      })
      .catch(showErrorMessage);
  }

  private init(): void {
    this.smallSlider = new Swiper(this.view.getSmallSlider(), {
      direction: 'vertical',
      slidesPerView: this.params.images.length,
    });
    this.bigSlider = new Swiper(this.view.getBigSlider(), {
      autoplay: {
        delay: SLIDER_DELAY,
      },
      direction: 'vertical',
      loop: true,
      modules: [Autoplay, Thumbs],
      slidesPerView: SLIDER_PER_VIEW,
      thumbs: {
        swiper: this.smallSlider,
      },
    });
    this.bigSlider.autoplay.start();

    this.view.getBigSliderSlides().forEach((slide, index) => {
      slide.addEventListener('click', () => {
        const modalSlider = new ProductModalSliderModel(this.params);
        modal.show();
        modalSlider.getModalSlider()?.slideTo(index);
        modal.setContent(modalSlider.getHTML());
      });
    });

    this.view.getRightWrapper().append(this.price.getHTML());
    this.switchToCartButtonHandler();
    this.switchToWishListButtonHandler();
    this.setSizeButtonHandler();
  }

  private setSizeButtonHandler(): void {
    this.view.getSizeButtons().forEach((sizeButton) => {
      sizeButton.getHTML().addEventListener('click', () => {
        const currentVariant = this.params.variant.find(({ size }) => size === sizeButton.getHTML().textContent);

        if (currentVariant) {
          const path = `${buildPathName(PAGE_ID.PRODUCT_PAGE, this.params.key, {
            size: [currentVariant.size ?? this.params.variant[0].size],
          })}`;
          RouterModel.getInstance().navigateTo(path);
          modal.hide();
        }
      });
    });
  }

  private switchToCartButtonHandler(): void {
    const switchToCartButton = this.view.getSwitchToCartButton();

    switchToCartButton.getHTML().addEventListener('click', () => {
      getCartModel()
        .getCart()
        .then((cart) => {
          if (
            cart.products.find((product) => product.key === this.params.key && product.size === this.params.currentSize)
          ) {
            this.deleteProductFromCart(cart);
          } else {
            this.addProductToCart();
          }
        })
        .catch(showErrorMessage);
    });
  }

  private switchToWishListButtonHandler(): void {
    const switchToWishListButton = this.view.getSwitchToWishListButton();
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

  public getHTML(): HTMLDivElement {
    return this.view.getHTML();
  }
}

export default ProductInfoModel;
