/* eslint-disable max-lines-per-function */
import type { Page, PagesType } from '@/shared/types/page.ts';

import RouterModel from '@/app/Router/model/RouterModel.ts';
import modal from '@/shared/Modal/model/ModalModel.ts';
import ScrollToTopModel from '@/shared/ScrollToTop/model/ScrollToTopModel.ts';
import { PAGE_ID } from '@/shared/constants/pages.ts';
import { showErrorMessage } from '@/shared/utils/userMessage.ts';
import FooterModel from '@/widgets/Footer/model/FooterModel.ts';
import HeaderModel from '@/widgets/Header/model/HeaderModel.ts';

import AppView from '../view/AppView.ts';

class AppModel {
  private appView: AppView = new AppView();

  constructor() {
    this.initialize().catch((error) => {
      showErrorMessage(error);
    });
  }

  private createRoutes(): Promise<PagesType> {
    const routesMap = {
      [PAGE_ID.ABOUT_US_PAGE]: async (): Promise<Page> => {
        const { default: AboutUsPageModel } = await import('@/pages/AboutUsPage/model/AboutUsPageModel.ts');
        return new AboutUsPageModel(this.appView.getHTML());
      },
      [PAGE_ID.BLOG]: async (): Promise<Page> => {
        const { default: BlogPageModel } = await import('@/pages/BlogPage/model/BlogPageModel.ts');
        return new BlogPageModel(this.appView.getHTML());
      },
      [PAGE_ID.CART_PAGE]: async (): Promise<Page> => {
        const { default: CartPageModel } = await import('@/pages/CartPage/model/CartPageModel.ts');
        return new CartPageModel(this.appView.getHTML());
      },
      [PAGE_ID.CATALOG_PAGE]: async (): Promise<Page> => {
        const { default: CatalogPageModel } = await import('@/pages/CatalogPage/model/CatalogPageModel.ts');
        return new CatalogPageModel(this.appView.getHTML());
      },
      [PAGE_ID.COOPERATION_PAGE]: async (): Promise<Page> => {
        const { default: CooperationPageModel } = await import('@/pages/CooperationPage/model/CooperationPageModel.ts');
        return new CooperationPageModel(this.appView.getHTML());
      },
      [PAGE_ID.DEFAULT_PAGE]: async (): Promise<Page> => {
        const { default: MainPageModel } = await import('@/pages/MainPage/model/MainPageModel.ts');
        return new MainPageModel(this.appView.getHTML());
      },
      [PAGE_ID.LOGIN_PAGE]: async (): Promise<Page> => {
        const { default: LoginPageModel } = await import('@/pages/LoginPage/model/LoginPageModel.ts');
        return new LoginPageModel(this.appView.getHTML());
      },
      [PAGE_ID.MAIN_PAGE]: async (): Promise<Page> => {
        const { default: MainPageModel } = await import('@/pages/MainPage/model/MainPageModel.ts');
        return new MainPageModel(this.appView.getHTML());
      },
      [PAGE_ID.NOT_FOUND_PAGE]: async (): Promise<Page> => {
        const { default: NotFoundPageModel } = await import('@/pages/NotFoundPage/model/NotFoundPageModel.ts');
        return new NotFoundPageModel(this.appView.getHTML());
      },
      [PAGE_ID.PRODUCT_PAGE]: async (): Promise<Page> => {
        const { default: ProductPageModel } = await import('@/pages/ProductPage/model/ProductPageModel.ts');
        return new ProductPageModel(this.appView.getHTML());
      },
      [PAGE_ID.REGISTRATION_PAGE]: async (): Promise<Page> => {
        const { default: RegistrationPageModel } = await import(
          '@/pages/RegistrationPage/model/RegistrationPageModel.ts'
        );
        return new RegistrationPageModel(this.appView.getHTML());
      },
      [PAGE_ID.USER_ADDRESSES_PAGE]: async (): Promise<Page> => {
        const { default: UserAddressesPageModel } = await import(
          '@/pages/UserAddressesPage/model/UserAddressesPageModel.ts'
        );
        return new UserAddressesPageModel(this.appView.getHTML());
      },
      [PAGE_ID.USER_PROFILE_PAGE]: async (): Promise<Page> => {
        const { default: UserProfilePageModel } = await import('@/pages/UserProfilePage/model/UserProfilePageModel.ts');
        return new UserProfilePageModel(this.appView.getHTML());
      },
      [PAGE_ID.WISHLIST_PAGE]: async (): Promise<Page> => {
        const { default: WishlistPageModel } = await import('@/pages/WishlistPage/model/WishlistPageModel.ts');
        return new WishlistPageModel(this.appView.getHTML());
      },
    };

    const routes = new Map<string, () => Promise<Page>>();
    Object.entries(routesMap).forEach(([key, value]) => routes.set(key, value));

    return Promise.resolve(routes);
  }

  private async initialize(): Promise<RouterModel> {
    const routes = await this.createRoutes();
    const router = new RouterModel(routes);
    const scrollToTop = new ScrollToTopModel();
    document.body.append(this.appView.getHTML(), scrollToTop.getHTML().getHTML());
    this.appView.getHTML().insertAdjacentElement('beforebegin', new HeaderModel(this.appView.getHTML()).getHTML());
    this.appView.getHTML().insertAdjacentElement('afterend', new FooterModel().getHTML());
    this.appView.getHTML().insertAdjacentElement('afterend', modal.getHTML());
    return router;
  }

  public start(): boolean {
    if (!this.appView.getHTML()) {
      return false;
    }
    return true;
  }
}

export default AppModel;
