import type { BreadcrumbLink } from '@/shared/types/link.ts';

import BreadcrumbsView from '../view/BreadcrumbsView.ts';

class BreadcrumbsModel {
  private breadcrumbLinksData: BreadcrumbLink[] = [];

  private view: BreadcrumbsView;

  constructor() {
    this.view = new BreadcrumbsView(this.breadcrumbLinksData);
  }

  public addBreadcrumbLinks(linkData: BreadcrumbLink[]): void {
    this.breadcrumbLinksData.push(...linkData);
    this.view.drawLinks();
  }

  public getHTML(): HTMLDivElement {
    return this.view.getHTML();
  }

  public removeBreadcrumbLink(linkData: BreadcrumbLink): void {
    this.breadcrumbLinksData = this.breadcrumbLinksData.filter((link) => link !== linkData);
    this.view.drawLinks();
  }
}

export default BreadcrumbsModel;
