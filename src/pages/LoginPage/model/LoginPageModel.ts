import type { PageInterface } from '@/shared/types/interfaces.ts';

import LoginPageView from '../view/LoginPageView.ts';

class LoginPageModel implements PageInterface {
  private loginPageView: LoginPageView;

  constructor(parent: HTMLDivElement) {
    this.loginPageView = new LoginPageView(parent);
  }

  public getHTML(): HTMLDivElement {
    return this.loginPageView.getHTML();
  }
}

export default LoginPageModel;
