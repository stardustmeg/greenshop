import type { PageInterface } from '@/shared/types/interfaces.ts';

import { EVENT_NAMES, PAGES_IDS } from '@/shared/constants/enums.ts';

const DEFAULT_SEGMENT = import.meta.env.VITE_APP_DEFAULT_SEGMENT;
const NEXT_SEGMENT = import.meta.env.VITE_APP_NEXT_SEGMENT;
const PATH_SEGMENTS_TO_KEEP = import.meta.env.VITE_APP_PATH_SEGMENTS_TO_KEEP;

class RouterModel {
  private pages: Map<string, PageInterface> = new Map();

  constructor() {
    document.addEventListener(EVENT_NAMES.DOM_CONTENT_LOADED, () => {
      const currentPath = window.location.pathname
        .split(DEFAULT_SEGMENT)
        .slice(PATH_SEGMENTS_TO_KEEP + NEXT_SEGMENT)
        .join(DEFAULT_SEGMENT);
      this.handleRequest(currentPath);
      // this.eventMediator.notify(MEDIATOR_EVENTS.CHANGE_PAGE, currentPath.split(DEFAULT_SEGMENT).join());
    });

    window.addEventListener(EVENT_NAMES.POPSTATE, () => {
      const currentPath = window.location.pathname
        .split(DEFAULT_SEGMENT)
        .slice(PATH_SEGMENTS_TO_KEEP + NEXT_SEGMENT)
        .join(DEFAULT_SEGMENT);
      this.handleRequest(currentPath);
    });
  }

  private handleRequest(path: string): void {
    const pathParts = path.split(DEFAULT_SEGMENT);
    const hasRoute = this.pages.has(pathParts.join(''));
    if (!hasRoute) {
      this.navigateTo(PAGES_IDS.NOT_FOUND_PAGE);
      // return;
    }

    // this.eventMediator.notify(MEDIATOR_EVENTS.CHANGE_PAGE, pathParts.join());
  }

  public navigateTo(route: string): void {
    this.handleRequest(route);

    const pathnameApp = window.location.pathname
      .split(DEFAULT_SEGMENT)
      .slice(NEXT_SEGMENT, PATH_SEGMENTS_TO_KEEP + NEXT_SEGMENT)
      .join(DEFAULT_SEGMENT);
    const url = `/${pathnameApp}/${route}`;
    window.history.pushState({}, '', url);
  }

  public setPages(pages: Map<string, PageInterface>): void {
    this.pages = pages;
  }
}

export default RouterModel;
