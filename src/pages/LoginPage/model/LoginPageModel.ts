import type { PageInterface } from '@/shared/types/interfaces.ts';

import LoginPageView from '../view/LoginPageView.ts';

class LoginPageModel implements PageInterface {
  private view: LoginPageView;

  constructor(parent: HTMLDivElement) {
    this.view = new LoginPageView(parent);
  }

  public getHTML(): HTMLDivElement {
    return this.view.getHTML();
  }
}

export default LoginPageModel;
