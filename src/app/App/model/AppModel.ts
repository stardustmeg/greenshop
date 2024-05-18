/* eslint-disable max-lines-per-function */
import type { Page, PageParams, PagesType } from '@/shared/types/page.ts';

import RouterModel from '@/app/Router/model/RouterModel.ts';
import modal from '@/shared/Modal/model/ModalModel.ts';
import { PAGE_ID } from '@/shared/constants/pages.ts';
import FooterModel from '@/widgets/Footer/model/FooterModel.ts';
import HeaderModel from '@/widgets/Header/model/HeaderModel.ts';

import AppView from '../view/AppView.ts';

class AppModel {
  private appView: AppView = new AppView();

  private router: RouterModel | null = null;

  constructor() {
    this.initialize().catch(() => {
      throw new Error('AppModel initialization error');
    });
  }

  private createRoutes(): Promise<PagesType> {
    const routesMap = {
      [PAGE_ID.ABOUT_US_PAGE]: async (): Promise<Page> => {
        const { default: AboutUsPageModel } = await import('@/pages/AboutUsPage/model/AboutUsPageModel.ts');
        return new AboutUsPageModel(this.appView.getHTML());
      },
      [PAGE_ID.BLOG]: async (): Promise<Page> => {
        const { default: PostListModel } = await import('@/pages/Blog/PostList/model/PostListModel.ts');
        return new PostListModel(this.appView.getHTML());
      },
      [PAGE_ID.CART_PAGE]: async (): Promise<Page> => {
        const { default: CartPageModel } = await import('@/pages/CartPage/model/CartPageModel.ts');
        return new CartPageModel(this.appView.getHTML());
      },
      [PAGE_ID.CATALOG_PAGE]: async (params: PageParams): Promise<Page> => {
        const { default: CatalogPageModel } = await import('@/pages/CatalogPage/model/CatalogPageModel.ts');
        return new CatalogPageModel(this.appView.getHTML(), params);
      },
      [PAGE_ID.DEFAULT_PAGE]: async (): Promise<Page> => {
        const { default: MainPageModel } = await import('@/pages/MainPage/model/MainPageModel.ts');
        return new MainPageModel(this.appView.getHTML(), this.router);
      },
      [PAGE_ID.LOGIN_PAGE]: async (): Promise<Page> => {
        const { default: LoginPageModel } = await import('@/pages/LoginPage/model/LoginPageModel.ts');
        return new LoginPageModel(this.appView.getHTML(), this.router);
      },
      [PAGE_ID.MAIN_PAGE]: async (): Promise<Page> => {
        const { default: MainPageModel } = await import('@/pages/MainPage/model/MainPageModel.ts');
        return new MainPageModel(this.appView.getHTML(), this.router);
      },
      [PAGE_ID.NOT_FOUND_PAGE]: async (): Promise<Page> => {
        const { default: NotFoundPageModel } = await import('@/pages/NotFoundPage/model/NotFoundPageModel.ts');
        return new NotFoundPageModel(this.appView.getHTML(), this.router);
      },
      [PAGE_ID.PRODUCT_PAGE]: async (params: PageParams): Promise<Page> => {
        const { default: ProductPageModel } = await import('@/pages/ProductPage/model/ProductPageModel.ts');
        return new ProductPageModel(this.appView.getHTML(), params);
      },
      [PAGE_ID.REGISTRATION_PAGE]: async (): Promise<Page> => {
        const { default: RegistrationPageModel } = await import(
          '@/pages/RegistrationPage/model/RegistrationPageModel.ts'
        );
        return new RegistrationPageModel(this.appView.getHTML(), this.router);
      },
      [PAGE_ID.USER_PROFILE_PAGE]: async (): Promise<Page> => {
        const { default: UserProfilePageModel } = await import('@/pages/UserProfilePage/model/UserProfilePageModel.ts');
        return new UserProfilePageModel(this.appView.getHTML(), this.router);
      },
    };

    const routes = new Map<string, (params: PageParams) => Promise<Page>>();
    Object.entries(routesMap).forEach(([key, value]) => routes.set(key, value));

    return Promise.resolve(routes);
  }

  private async initialize(): Promise<void> {
    const routes = await this.createRoutes();
    this.router = new RouterModel(routes);
    document.body.append(this.appView.getHTML());
    this.appView
      .getHTML()
      .insertAdjacentElement('beforebegin', new HeaderModel(this.router, this.appView.getHTML()).getHTML());
    this.appView.getHTML().insertAdjacentElement('afterend', new FooterModel(this.router).getHTML());
    this.appView.getHTML().insertAdjacentElement('afterend', modal.getHTML());
  }

  public start(): boolean {
    if (!this.appView.getHTML()) {
      return false;
    }
    return true;
  }
}

export default AppModel;
