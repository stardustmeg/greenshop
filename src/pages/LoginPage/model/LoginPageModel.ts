import type { PageInterface } from '@/shared/types/interfaces.ts';

import LoginFormModel from '@/widgets/LoginForm/model/LoginFormModel.ts';

import LoginPageView from '../view/LoginPageView.ts';

class LoginPageModel implements PageInterface {
  private loginForm = new LoginFormModel();

  private view: LoginPageView;

  constructor(parent: HTMLDivElement) {
    this.view = new LoginPageView(parent);
    this.init();
  }

  private init(): boolean {
    this.getHTML().append(this.loginForm.getHTML());
    return true;
  }

  public getHTML(): HTMLDivElement {
    return this.view.getHTML();
  }
}

export default LoginPageModel;
