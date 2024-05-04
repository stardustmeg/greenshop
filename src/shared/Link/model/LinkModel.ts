import type { LinkAttributes } from '@/shared/types/link.ts';

import LinkView from '../view/LinkView.ts';

class LinkModel {
  private params: LinkAttributes;

  private view: LinkView;

  constructor(params: LinkAttributes) {
    this.params = params;

    this.view = new LinkView(this.params);
  }

  public getHTML(): HTMLAnchorElement {
    return this.view.getHTML();
  }

  public setDisabled(): boolean {
    this.view.setDisabled();
    return true;
  }

  public setEnabled(): boolean {
    this.view.setEnabled();
    return true;
  }
}

export default LinkModel;
