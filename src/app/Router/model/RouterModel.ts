import type { Page } from '@/shared/types/common.ts';

import EventMediatorModel from '@/shared/EventMediator/model/EventMediatorModel.ts';
import { EVENT_NAME, MEDIATOR_EVENT } from '@/shared/constants/events.ts';
import { PAGE_ID } from '@/shared/constants/pages.ts';

const DEFAULT_SEGMENT = import.meta.env.VITE_APP_DEFAULT_SEGMENT;
const NEXT_SEGMENT = import.meta.env.VITE_APP_NEXT_SEGMENT;
const PATH_SEGMENTS_TO_KEEP = import.meta.env.VITE_APP_PATH_SEGMENTS_TO_KEEP;
const PROJECT_TITLE = import.meta.env.VITE_APP_PROJECT_TITLE;

class RouterModel {
  private eventMediator = EventMediatorModel.getInstance();

  private pages: Map<string, Page> = new Map();

  constructor() {
    document.addEventListener(EVENT_NAME.DOM_CONTENT_LOADED, () => {
      const currentPath = window.location.pathname
        .split(DEFAULT_SEGMENT)
        .slice(PATH_SEGMENTS_TO_KEEP + NEXT_SEGMENT)
        .join(DEFAULT_SEGMENT);
      this.handleRequest(currentPath);
    });
  }

  private handleRequest(path: string): null | string {
    const pathParts = path.split(DEFAULT_SEGMENT);
    const hasRoute = this.pages.has(pathParts.join(''));
    if (!hasRoute) {
      document.title = `${PROJECT_TITLE} | ${PAGE_ID.NOT_FOUND_PAGE}`;
      this.eventMediator.notify(MEDIATOR_EVENT.CHANGE_PAGE, PAGE_ID.NOT_FOUND_PAGE);
      return null;
    }
    document.title = `${PROJECT_TITLE} | ${pathParts.join('')}`;
    this.eventMediator.notify(MEDIATOR_EVENT.CHANGE_PAGE, pathParts.join(''));
    return pathParts.join('');
  }

  public navigateTo(route: string): History {
    if (this.pages.has(route)) {
      const pathnameApp = window.location.pathname
        .split(DEFAULT_SEGMENT)
        .slice(NEXT_SEGMENT, PATH_SEGMENTS_TO_KEEP + NEXT_SEGMENT)
        .join(DEFAULT_SEGMENT);
      const url = `${pathnameApp}/${route}`;
      const titleRoute = route === '' ? PAGE_ID.MAIN_PAGE : route;
      document.title = `${PROJECT_TITLE} | ${titleRoute}`;

      history.pushState(route, '', url);

      this.eventMediator.notify(MEDIATOR_EVENT.CHANGE_PAGE, route);
    }
    return window.history;
  }

  public setPages(pages: Map<string, Page>): Map<string, Page> {
    this.pages = pages;
    return this.pages;
  }
}

export default RouterModel;
