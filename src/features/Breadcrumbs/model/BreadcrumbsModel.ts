import type { BreadCrumbLink } from '@/shared/types/link.ts';

import BreadcrumbsView from '../view/BreadcrumbsView.ts';

class BreadcrumbsModel {
  private view: BreadcrumbsView;

  constructor(navigationLinks: BreadCrumbLink[]) {
    this.view = new BreadcrumbsView(navigationLinks);
  }

  public getHTML(): HTMLDivElement {
    return this.view.getHTML();
  }
}

export default BreadcrumbsModel;
