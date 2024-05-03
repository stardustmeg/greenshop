import type { Page } from '@/shared/types/common.ts';

import RouterModel from '@/app/Router/model/RouterModel.ts';
import LoginPageModel from '@/pages/LoginPage/model/LoginPageModel.ts';
import MainPageModel from '@/pages/MainPage/model/MainPageModel.ts';
import NotFoundPageModel from '@/pages/NotFoundPage/model/NotFoundPageModel.ts';
import RegistrationPageModel from '@/pages/RegistrationPage/model/RegistrationPageModel.ts';
import { PAGE_ID } from '@/shared/constants/pages.ts';

import AppView from '../view/AppView.ts';

class AppModel {
  private appView: AppView = new AppView();

  private router = new RouterModel();

  constructor() {
    this.router.setPages(this.initPages());
  }

  private initPages(): Map<string, Page> {
    const root = this.getHTML();
    const loginPage = new LoginPageModel(root, this.router);
    const mainPage = new MainPageModel(root, this.router);
    const registrationPage = new RegistrationPageModel(root, this.router);
    const notFoundPage = new NotFoundPageModel(root, this.router);
    const pages: Map<string, Page> = new Map(
      Object.entries({
        [PAGE_ID.DEFAULT_PAGE]: mainPage,
        [PAGE_ID.LOGIN_PAGE]: loginPage,
        [PAGE_ID.MAIN_PAGE]: mainPage,
        [PAGE_ID.NOT_FOUND_PAGE]: notFoundPage,
        [PAGE_ID.REGISTRATION_PAGE]: registrationPage,
      }),
    );
    return pages;
  }

  public getHTML(): HTMLDivElement {
    return this.appView.getHTML();
  }
}

export default AppModel;
