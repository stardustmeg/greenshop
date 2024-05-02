import type { PageInterface } from '@/shared/types/interfaces.ts';

import RouterModel from '@/app/Router/model/RouterModel.ts';
import LoginPageModel from '@/pages/LoginPage/model/LoginPageModel.ts';
import MainPageModel from '@/pages/MainPage/model/MainPageModel.ts';
import NotFoundPageModel from '@/pages/NotFoundPage/model/NotFoundPageModel.ts';
import RegistrationPageModel from '@/pages/RegistrationPage/model/RegistrationPageModel.ts';
import { PAGES_IDS } from '@/shared/constants/enums.ts';

import AppView from '../view/AppView.ts';

class AppModel {
  private appView: AppView = new AppView();

  private router = new RouterModel();

  constructor() {
    this.router.setPages(this.initPages());
  }

  private initPages(): Map<string, PageInterface> {
    const root = this.getHTML();
    const loginPage = new LoginPageModel(root, this.router);
    const mainPage = new MainPageModel(root, this.router);
    const registrationPage = new RegistrationPageModel(root, this.router);
    const notFoundPage = new NotFoundPageModel(root);
    const pages: Map<string, PageInterface> = new Map(
      Object.entries({
        [PAGES_IDS.DEFAULT_PAGE]: mainPage,
        [PAGES_IDS.LOGIN_PAGE]: loginPage,
        [PAGES_IDS.MAIN_PAGE]: mainPage,
        [PAGES_IDS.NOT_FOUND_PAGE]: notFoundPage,
        [PAGES_IDS.REGISTRATION_PAGE]: registrationPage,
      }),
    );
    return pages;
  }

  public getHTML(): HTMLDivElement {
    return this.appView.getHTML();
  }
}

export default AppModel;
