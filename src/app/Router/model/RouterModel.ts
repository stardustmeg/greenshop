import type { Page } from '@/shared/types/common.ts';

import { PAGE_ID } from '@/shared/constants/pages.ts';
import { isValidState } from '@/shared/types/validation/paths.ts';

const PROJECT_TITLE = import.meta.env.VITE_APP_PROJECT_TITLE;
const DEFAULT_SEGMENT = import.meta.env.VITE_APP_DEFAULT_SEGMENT;
const NEXT_SEGMENT = import.meta.env.VITE_APP_NEXT_SEGMENT;
const PATH_SEGMENTS_TO_KEEP = import.meta.env.VITE_APP_PATH_SEGMENTS_TO_KEEP;

class RouterModel {
  private routes: Map<string, () => Promise<Page>> = new Map();

  constructor() {
    document.addEventListener('DOMContentLoaded', async () => {
      const currentPath = window.location.pathname.slice(NEXT_SEGMENT).split(DEFAULT_SEGMENT) || PAGE_ID.DEFAULT_PAGE;
      await this.navigateTo(currentPath.join(DEFAULT_SEGMENT));
    });

    window.addEventListener('popstate', async (event) => {
      const currentPath: unknown = event.state;
      let currentPage = '';

      if (isValidState(currentPath)) {
        currentPage = currentPath.path.split(DEFAULT_SEGMENT)[PATH_SEGMENTS_TO_KEEP] || PAGE_ID.DEFAULT_PAGE;
      }

      await this.handleRequest(currentPage);
    });
  }

  private changeAppTitle(path: string, hasRoute: boolean): void {
    const title = `${PROJECT_TITLE} | ${hasRoute ? path : PAGE_ID.NOT_FOUND_PAGE}`;
    document.title = title;
  }

  private async handleRequest(path: string): Promise<void> {
    const hasRoute = this.routes.has(path);
    this.changeAppTitle(path === PAGE_ID.DEFAULT_PAGE ? PAGE_ID.MAIN_PAGE : path, hasRoute);

    if (!hasRoute) {
      await this.routes.get(PAGE_ID.NOT_FOUND_PAGE)?.();
      return;
    }

    await this.routes.get(path)?.();
  }

  public async navigateTo(path: string): Promise<void> {
    const currentPath = path.split(DEFAULT_SEGMENT)[PATH_SEGMENTS_TO_KEEP] || PAGE_ID.DEFAULT_PAGE;
    const hasRoute = this.routes.has(currentPath);
    this.changeAppTitle(currentPath === PAGE_ID.DEFAULT_PAGE ? PAGE_ID.MAIN_PAGE : currentPath, hasRoute);

    if (!hasRoute) {
      await this.routes.get(PAGE_ID.NOT_FOUND_PAGE)?.();
      return;
    }

    await this.routes.get(currentPath)?.();
    history.pushState({ path }, '', `/${path}`);
  }

  public setRoutes(routes: Map<string, () => Promise<Page>>): Map<string, () => Promise<Page>> {
    this.routes = routes;
    return this.routes;
  }
}

export default RouterModel;
