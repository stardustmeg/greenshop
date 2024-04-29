import type { PageInterface } from '@/shared/types/interfaces.ts';

import NotFoundPageView from '../view/NotFoundPageView.ts';

class NotFoundPageModel implements PageInterface {
  private view: NotFoundPageView;

  constructor(parent: HTMLDivElement) {
    this.view = new NotFoundPageView(parent);
  }

  public getHTML(): HTMLDivElement {
    return this.view.getHTML();
  }
}

export default NotFoundPageModel;
