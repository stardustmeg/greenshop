import type { Cart } from '@/shared/types/cart.ts';
import type { ProductInfoParams, Variant } from '@/shared/types/product.ts';

import RouterModel from '@/app/Router/model/RouterModel.ts';
import ProductModalSliderModel from '@/entities/ProductModalSlider/model/ProductModalSliderModel.ts';
import ProductPriceModel from '@/entities/ProductPrice/model/ProductPriceModel.ts';
import WishlistButtonModel from '@/features/WishlistButton/model/WishlistButtonModel.ts';
import getCartModel from '@/shared/API/cart/model/CartModel.ts';
import EventMediatorModel from '@/shared/EventMediator/model/EventMediatorModel.ts';
import LoaderModel from '@/shared/Loader/model/LoaderModel.ts';
import modal from '@/shared/Modal/model/ModalModel.ts';
import getStore from '@/shared/Store/Store.ts';
import { LANGUAGE_CHOICE } from '@/shared/constants/common.ts';
import MEDIATOR_EVENT from '@/shared/constants/events.ts';
import { LOADER_SIZE } from '@/shared/constants/sizes.ts';
import { buildProductPathName } from '@/shared/utils/buildPathname.ts';
import { productAddedToCartMessage, productRemovedFromCartMessage } from '@/shared/utils/messageTemplates.ts';
import { showErrorMessage, showSuccessMessage } from '@/shared/utils/userMessage.ts';
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

  private wishlistButton: WishlistButtonModel;

  constructor(params: ProductInfoParams) {
    this.params = params;
    this.view = new ProductInfoView(this.params);
    this.currentVariant =
      this.params.variant.find(({ size }) => size === this.params.currentSize) ?? this.params.variant[0];
    this.price = new ProductPriceModel(this.currentVariant);
    this.wishlistButton = new WishlistButtonModel(this.params);
    this.init();
  }

  private addProductToCart(): void {
    const loader = new LoaderModel(LOADER_SIZE.EXTRA_SMALL).getHTML();
    this.view.getSwitchToCartButton().getHTML().append(loader);
    getCartModel()
      .addProductToCart({
        name: this.params.name[Number(getStore().getState().currentLanguage === LANGUAGE_CHOICE.RU)].value,
        productId: this.params.id,
        quantity: 1,
        variantId: this.currentVariant.id,
      })
      .then(() => {
        this.view.switchToCartButtonText(true);
        showSuccessMessage(
          productAddedToCartMessage(
            this.params.name[Number(getStore().getState().currentLanguage === LANGUAGE_CHOICE.RU)].value,
          ),
        );
        EventMediatorModel.getInstance().notify(MEDIATOR_EVENT.REDRAW_PRODUCTS, '');
      })
      .catch(showErrorMessage)
      .finally(() => loader.remove());
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
          showSuccessMessage(
            productRemovedFromCartMessage(
              this.params.name[Number(getStore().getState().currentLanguage === LANGUAGE_CHOICE.RU)].value,
            ),
          );
          EventMediatorModel.getInstance().notify(MEDIATOR_EVENT.REDRAW_PRODUCTS, '');
        })
        .catch(showErrorMessage)
        .finally(() => loader.remove());
    }
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
    this.view.getButtonsWrapper().append(this.wishlistButton.getHTML().getHTML());
    this.switchToCartButtonHandler();
    this.setSizeButtonHandler();
  }

  private setSizeButtonHandler(): void {
    this.view.getSizeButtons().forEach((sizeButton) => {
      sizeButton.getHTML().addEventListener('click', () => {
        const currentVariant = this.params.variant.find(({ size }) => size === sizeButton.getHTML().textContent);
        const path = `${buildProductPathName(this.params.key, { size: [currentVariant?.size ?? this.params.variant[0].size] })}`;
        RouterModel.getInstance().navigateTo(path);
        modal.hide();
        this.currentVariant = currentVariant ?? this.params.variant[0];
        this.params.currentSize = currentVariant?.size ?? this.params.variant[0].size;
        this.view.updateParams(this.params);
        this.price.getHTML().remove();
        this.price = new ProductPriceModel(this.currentVariant);
        this.view.getRightWrapper().append(this.price.getHTML());
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

  public getHTML(): HTMLDivElement {
    return this.view.getHTML();
  }
}

export default ProductInfoModel;
