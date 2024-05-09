import type { Page } from '@/shared/types/common.ts';

import RouterModel from '@/app/Router/model/RouterModel.ts';
import LoginPageModel from '@/pages/LoginPage/model/LoginPageModel.ts';
import MainPageModel from '@/pages/MainPage/model/MainPageModel.ts';
import NotFoundPageModel from '@/pages/NotFoundPage/model/NotFoundPageModel.ts';
import RegistrationPageModel from '@/pages/RegistrationPage/model/RegistrationPageModel.ts';
import { PAGE_ID } from '@/shared/constants/pages.ts';
import FooterModel from '@/widgets/Footer/model/FooterModel.ts';
import HeaderModel from '@/widgets/Header/model/HeaderModel.ts';

import AppView from '../view/AppView.ts';

class AppModel {
  private appView: AppView = new AppView();

  private router = new RouterModel();

  constructor() {
    document.body.append(this.appView.getHTML());
    this.appView.getHTML().insertAdjacentElement('beforebegin', new HeaderModel(this.router).getHTML());
    this.appView.getHTML().insertAdjacentElement('afterend', new FooterModel(this.router).getHTML());
    this.router.setRoutes(this.createRoutes());
  }

  private createRoutes(): Map<string, () => Page> {
    return new Map(
      Object.entries({
        [PAGE_ID.DEFAULT_PAGE]: () => new MainPageModel(this.appView.getHTML()),
        [PAGE_ID.LOGIN_PAGE]: () => new LoginPageModel(this.appView.getHTML(), this.router),
        [PAGE_ID.MAIN_PAGE]: () => new MainPageModel(this.appView.getHTML()),
        [PAGE_ID.NOT_FOUND_PAGE]: () => new NotFoundPageModel(this.appView.getHTML(), this.router),
        [PAGE_ID.REGISTRATION_PAGE]: () => new RegistrationPageModel(this.appView.getHTML(), this.router),
      }),
    );
  }

  public isWorking(): boolean {
    if (!this.appView.getHTML()) {
      return false;
    }
    return true;
  }
}

export default AppModel;
