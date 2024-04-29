import type { PageInterface } from '@/shared/types/interfaces.ts';

import RegistrationPageView from '../view/RegistrationPageView.ts';

class LoginPageModel implements PageInterface {
  private view: RegistrationPageView;

  constructor(parent: HTMLDivElement) {
    this.view = new RegistrationPageView(parent);
  }

  public getHTML(): HTMLDivElement {
    return this.view.getHTML();
  }
}

export default LoginPageModel;
