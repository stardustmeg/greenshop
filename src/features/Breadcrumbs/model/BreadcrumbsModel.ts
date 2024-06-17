import type { BreadcrumbLink } from '@/shared/types/link.ts';

import BreadcrumbsView from '../view/BreadcrumbsView.ts';

class BreadcrumbsModel {
  private breadcrumbLinksData: BreadcrumbLink[] = [];

  private view = new BreadcrumbsView();

  public addBreadcrumbLinks(linksData: BreadcrumbLink[]): void {
    this.breadcrumbLinksData.push(...linksData);
    this.view.drawLinks(this.breadcrumbLinksData);
  }

  public clearBreadcrumbLinks(): void {
    this.breadcrumbLinksData = [];
    this.view.clearBreadcrumbLinks();
  }

  public getHTML(): HTMLDivElement {
    return this.view.getHTML();
  }

  public removeBreadcrumbLink(linkData: BreadcrumbLink): void {
    this.breadcrumbLinksData = this.breadcrumbLinksData.filter((link) => link !== linkData);
    this.view.drawLinks(this.breadcrumbLinksData);
  }
}

export default BreadcrumbsModel;
