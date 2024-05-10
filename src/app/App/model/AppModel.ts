import type { Page } from '@/shared/types/common.ts';

import RouterModel from '@/app/Router/model/RouterModel.ts';
import { PAGE_ID } from '@/shared/constants/pages.ts';
import FooterModel from '@/widgets/Footer/model/FooterModel.ts';
import HeaderModel from '@/widgets/Header/model/HeaderModel.ts';

import AppView from '../view/AppView.ts';

class AppModel {
  private appView: AppView = new AppView();

  private router = new RouterModel();

  constructor() {
    this.initialize()
      .then()
      .catch(() => {
        throw new Error('AppModel initialization error');
      });
  }

  private createRoutes(): Promise<Map<string, () => Promise<Page>>> {
    const routesMap = {
      [PAGE_ID.DEFAULT_PAGE]: async (): Promise<Page> => {
        const { default: MainPageModel } = await import('@/pages/MainPage/model/MainPageModel.ts');
        return new MainPageModel(this.appView.getHTML());
      },
      [PAGE_ID.LOGIN_PAGE]: async (): Promise<Page> => {
        const { default: LoginPageModel } = await import('@/pages/LoginPage/model/LoginPageModel.ts');
        return new LoginPageModel(this.appView.getHTML(), this.router);
      },
      [PAGE_ID.MAIN_PAGE]: async (): Promise<Page> => {
        const { default: MainPageModel } = await import('@/pages/MainPage/model/MainPageModel.ts');
        return new MainPageModel(this.appView.getHTML());
      },
      [PAGE_ID.NOT_FOUND_PAGE]: async (): Promise<Page> => {
        const { default: NotFoundPageModel } = await import('@/pages/NotFoundPage/model/NotFoundPageModel.ts');
        return new NotFoundPageModel(this.appView.getHTML(), this.router);
      },
      [PAGE_ID.REGISTRATION_PAGE]: async (): Promise<Page> => {
        const { default: RegistrationPageModel } = await import(
          '@/pages/RegistrationPage/model/RegistrationPageModel.ts'
        );
        return new RegistrationPageModel(this.appView.getHTML(), this.router);
      },
    };

    const routes = new Map<string, () => Promise<Page>>();
    Object.entries(routesMap).forEach(([key, value]) => routes.set(key, value));

    return Promise.resolve(routes);
  }

  private async initialize(): Promise<void> {
    document.body.append(this.appView.getHTML());
    this.appView.getHTML().insertAdjacentElement('beforebegin', new HeaderModel(this.router).getHTML());
    this.appView.getHTML().insertAdjacentElement('afterend', new FooterModel(this.router).getHTML());

    const routes = await this.createRoutes();
    this.router.setRoutes(routes);
  }

  public start(): boolean {
    if (!this.appView.getHTML()) {
      return false;
    }
    return true;
  }
}

export default AppModel;
