import type { PageInterface } from '@/shared/types/interfaces.ts';

import { EVENT_NAMES, PAGES_IDS } from '@/shared/constants/enums.ts';

class RouterModel {
  private pages: Map<string, PageInterface> = new Map();

  constructor() {
    document.addEventListener(EVENT_NAMES.DOM_CONTENT_LOADED, () => {
      const currentPath = window.location.pathname
        .split(ROUTER_DETAILS.DEFAULT_SEGMENT)
        .slice(ROUTER_DETAILS.PATH_SEGMENTS_TO_KEEP + ROUTER_DETAILS.NEXT_SEGMENT)
        .join(ROUTER_DETAILS.DEFAULT_SEGMENT);
      this.handleRequest(currentPath);
      this.eventMediator.notify(MEDIATOR_EVENTS.CHANGE_PAGE, currentPath.split(ROUTER_DETAILS.DEFAULT_SEGMENT).join());
    });

    window.addEventListener(EVENT_NAMES.POPSTATE, () => {
      const currentPath = window.location.pathname
        .split(ROUTER_DETAILS.DEFAULT_SEGMENT)
        .slice(ROUTER_DETAILS.PATH_SEGMENTS_TO_KEEP + ROUTER_DETAILS.NEXT_SEGMENT)
        .join(ROUTER_DETAILS.DEFAULT_SEGMENT);
      this.handleRequest(currentPath);
    });
  }

  private handleRequest(path: string): void {
    const pathParts = path.split(ROUTER_DETAILS.DEFAULT_SEGMENT);
    const hasRoute = this.pages.has(pathParts.join(''));
    if (!hasRoute) {
      window.location.pathname = `${PAGES_IDS.FOR_DEPLOY}`;
      this.eventMediator.notify(MEDIATOR_EVENTS.CHANGE_PAGE, PAGES_IDS.DEFAULT_PAGE);
      return;
    }

    this.eventMediator.notify(MEDIATOR_EVENTS.CHANGE_PAGE, pathParts.join());
  }

  public navigateTo(route: string): void {
    this.handleRequest(route);

    const pathnameApp = window.location.pathname
      .split(ROUTER_DETAILS.DEFAULT_SEGMENT)
      .slice(ROUTER_DETAILS.NEXT_SEGMENT, ROUTER_DETAILS.PATH_SEGMENTS_TO_KEEP + ROUTER_DETAILS.NEXT_SEGMENT)
      .join(ROUTER_DETAILS.DEFAULT_SEGMENT);
    const url = `/${pathnameApp}/${route}`;
    window.history.pushState({}, '', url);
  }

  public setPages(pages: Map<string, PageInterface>): void {
    this.pages = pages;
  }
}

export default RouterModel;
