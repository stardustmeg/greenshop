import type { PageInterface } from '@/shared/types/interfaces.ts';

import RegistrationPageView from '../view/RegistrationPageView.ts';

class RegistrationPageModel implements PageInterface {
  private view: RegistrationPageView;

  constructor(parent: HTMLDivElement) {
    this.view = new RegistrationPageView(parent);
  }

  public getHTML(): HTMLDivElement {
    return this.view.getHTML();
  }
}

export default RegistrationPageModel;
