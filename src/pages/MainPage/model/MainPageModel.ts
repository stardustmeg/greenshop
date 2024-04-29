import type { PageInterface } from '@/shared/types/interfaces.ts';

import MainPageView from '../view/MainPageView.ts';

class LoginPageModel implements PageInterface {
  private view: MainPageView;

  constructor(parent: HTMLDivElement) {
    this.view = new MainPageView(parent);
  }

  public getHTML(): HTMLDivElement {
    return this.view.getHTML();
  }
}

export default LoginPageModel;
