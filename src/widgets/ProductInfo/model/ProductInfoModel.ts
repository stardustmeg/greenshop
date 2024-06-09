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
import { PAGE_ID } from '@/shared/constants/pages.ts';
import { SEARCH_PARAMS_FIELD } from '@/shared/constants/product.ts';
import { LOADER_SIZE } from '@/shared/constants/sizes.ts';
import * as buildPath from '@/shared/utils/buildPathname.ts';
import { productAddedToCartMessage, productRemovedFromCartMessage } from '@/shared/utils/messageTemplates.ts';
import { showErrorMessage, showSuccessMessage } from '@/shared/utils/userMessage.ts';
import Swiper from 'swiper';
import 'swiper/css';
import 'swiper/css/bundle';
import { Autoplay, Keyboard, Navigation } from 'swiper/modules';

import ProductInfoView from '../view/ProductInfoView.ts';

const SLIDER_DELAY = 5000;
const SLIDER_PER_VIEW = 1;

class ProductInfoModel {
  private currentVariant: Variant;

  private params: ProductInfoParams;

  private price: ProductPriceModel;

  private savedPath?: string;

  private slider: Swiper | null = null;

  private view: ProductInfoView;

  private wishlistButton: WishlistButtonModel;

  constructor(params: ProductInfoParams, savedPath?: string) {
    this.params = params;
    this.savedPath = savedPath;
    this.view = new ProductInfoView(this.params);
    this.currentVariant =
      this.params.variant.find(({ size }) => size === this.params.currentSize) ?? this.params.variant[0];
    this.price = new ProductPriceModel({ new: this.currentVariant.discount, old: this.currentVariant.price });
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

  private checkPath(savedPath: string): string {
    let result = savedPath;

    if (RouterModel.getCurrentPage() === PAGE_ID.CATALOG_PAGE) {
      result = savedPath;
    } else if (RouterModel.getCurrentPage() === PAGE_ID.PRODUCT_PAGE) {
      result = buildPath.productPathWithIDAndQuery(this.params.key, {
        size: [this.currentVariant.size],
        slide: [RouterModel.getSearchParams().get(SEARCH_PARAMS_FIELD.SLIDE)],
      });
    }
    return result;
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
    this.slider = new Swiper(this.view.getSlider(), {
      autoplay: {
        delay: SLIDER_DELAY,
      },
      keyboard: {
        enabled: true,
      },
      loop: true,
      modules: [Autoplay, Keyboard, Navigation],
      navigation: {
        nextEl: this.view.getNextSlideButton().getHTML(),
        prevEl: this.view.getPrevSlideButton().getHTML(),
      },
      slidesPerView: SLIDER_PER_VIEW,
    });
    this.slider.enable();
    this.slider.slideTo(Number(RouterModel.getSearchParams().get(SEARCH_PARAMS_FIELD.SLIDE)) - 1 || 0, 0, false);
    this.sliderHandler();
    this.nextSlideButtonHandler();
    this.prevSlideButtonHandler();

    this.view.getRightWrapper().append(this.price.getHTML());
    this.view.getButtonsWrapper().append(this.wishlistButton.getHTML().getHTML());
    this.switchToCartButtonHandler();
    this.setSizeButtonHandler();
  }

  private nextSlideButtonHandler(): void {
    const nextSlideButton = this.view.getNextSlideButton();
    nextSlideButton.getHTML().addEventListener('click', () => {
      const slideInSearch = Number(RouterModel.getSearchParams().get(SEARCH_PARAMS_FIELD.SLIDE));

      if (slideInSearch < this.view.getSliderSlides().length) {
        RouterModel.setSearchParams(SEARCH_PARAMS_FIELD.SLIDE, String(slideInSearch + 1));
      } else {
        RouterModel.setSearchParams(SEARCH_PARAMS_FIELD.SLIDE, String(1));
      }
    });
  }

  private prevSlideButtonHandler(): void {
    const prevSlideButton = this.view.getPrevSlideButton();
    prevSlideButton.getHTML().addEventListener('click', () => {
      const slideInSearch = Number(RouterModel.getSearchParams().get(SEARCH_PARAMS_FIELD.SLIDE));

      if (slideInSearch > 1) {
        RouterModel.setSearchParams(SEARCH_PARAMS_FIELD.SLIDE, String(slideInSearch - 1));
      } else {
        RouterModel.setSearchParams(SEARCH_PARAMS_FIELD.SLIDE, String(this.view.getSliderSlides().length));
      }
    });
  }

  private setSizeButtonHandler(): void {
    this.view.getSizeButtons().forEach((sizeButton) => {
      sizeButton.getHTML().addEventListener('click', () => {
        const currentVariant = this.params.variant.find(({ size }) => size === sizeButton.getHTML().textContent);
        const path = `${buildPath.productPathWithIDAndQuery(this.params.key, { size: [currentVariant?.size ?? this.params.variant[0].size], slide: [RouterModel.getSearchParams().get(SEARCH_PARAMS_FIELD.SLIDE)] })}`;
        RouterModel.getInstance().navigateTo(path);
        modal.hide();
        this.currentVariant = currentVariant ?? this.params.variant[0];
        this.params.currentSize = currentVariant?.size ?? this.params.variant[0].size;
        this.view.updateParams(this.params);
        this.price.getHTML().remove();
        this.price = new ProductPriceModel({ new: this.currentVariant.discount, old: this.currentVariant.price });
        this.view.getRightWrapper().append(this.price.getHTML());
      });
    });
  }

  private sliderHandler(): void {
    this.view.getSliderSlides().forEach((slide, index) => {
      slide.addEventListener('click', () => {
        if (this.slider) {
          RouterModel.setSearchParams(SEARCH_PARAMS_FIELD.SLIDE, String(this.slider.activeIndex + 1));
        }
        const router = RouterModel.getInstance();
        const modalSlider = new ProductModalSliderModel(this.params);
        modal.show(() => router.navigateTo(this.checkPath(this.savedPath ?? '')));
        modalSlider.getModalSlider()?.slideTo(index);
        modal.setContent(modalSlider.getHTML());
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
