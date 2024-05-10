import type { Page } from '@/shared/types/common.ts';

import { PAGE_ID } from '@/shared/constants/pages.ts';

const DEFAULT_SEGMENT = import.meta.env.VITE_APP_DEFAULT_SEGMENT;
const NEXT_SEGMENT = import.meta.env.VITE_APP_NEXT_SEGMENT;
const PATH_SEGMENTS_TO_KEEP = import.meta.env.VITE_APP_PATH_SEGMENTS_TO_KEEP;
const PROJECT_TITLE = import.meta.env.VITE_APP_PROJECT_TITLE;

class RouterModel {
  private routes: Map<string, () => Promise<Page>> = new Map();

  constructor() {
    document.addEventListener('DOMContentLoaded', async () => {
      const currentPath = window.location.pathname
        .split(DEFAULT_SEGMENT)
        .slice(PATH_SEGMENTS_TO_KEEP + NEXT_SEGMENT)
        .join(DEFAULT_SEGMENT);
      await this.navigateTo(currentPath);
    });
  }

  private changeAppTitle(path: string, hasRoute: boolean): void {
    const title = `${PROJECT_TITLE} | ${hasRoute ? path : PAGE_ID.NOT_FOUND_PAGE}`;
    document.title = title;
  }

  public async navigateTo(path: string): Promise<void> {
    const pathnameApp = window.location.pathname
      .split(DEFAULT_SEGMENT)
      .slice(NEXT_SEGMENT, PATH_SEGMENTS_TO_KEEP + NEXT_SEGMENT)
      .join(DEFAULT_SEGMENT);
    const url = `${pathnameApp}/${path}`;

    const pathParts = url.split(DEFAULT_SEGMENT);
    const hasRoute = this.routes.has(pathParts[1]);
    this.changeAppTitle(pathParts[1], hasRoute);

    if (!hasRoute) {
      await this.routes.get(PAGE_ID.NOT_FOUND_PAGE)?.();
      return;
    }

    await this.routes.get(pathParts[1])?.();
    history.pushState(path, '', url);
  }

  public setRoutes(routes: Map<string, () => Promise<Page>>): Map<string, () => Promise<Page>> {
    this.routes = routes;
    return this.routes;
  }
}

export default RouterModel;
