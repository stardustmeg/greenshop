import type { Page } from '@/shared/types/common.ts';

import { PAGE_ID } from '@/shared/constants/pages.ts';
import { isValidPath, isValidState } from '@/shared/types/validation/paths.ts';

const PROJECT_TITLE = import.meta.env.VITE_APP_PROJECT_TITLE;
const DEFAULT_SEGMENT = import.meta.env.VITE_APP_DEFAULT_SEGMENT;
const NEXT_SEGMENT = import.meta.env.VITE_APP_NEXT_SEGMENT;

class RouterModel {
  private routes: Map<string, () => Promise<Page>> = new Map();

  constructor() {
    document.addEventListener('DOMContentLoaded', async () => {
      const currentPath = window.location.pathname.split(DEFAULT_SEGMENT)[NEXT_SEGMENT] || PAGE_ID.DEFAULT_PAGE;
      await this.navigateTo(currentPath);
    });

    window.addEventListener('popstate', async (event) => {
      const currentPath: unknown = event.state;

      if (!isValidState(currentPath) || !isValidPath(currentPath.path)) {
        window.location.pathname = PAGE_ID.DEFAULT_PAGE;
        return;
      }

      await this.handleRequest(currentPath.path);
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
    const hasRoute = this.routes.has(path);
    this.changeAppTitle(path === PAGE_ID.DEFAULT_PAGE ? PAGE_ID.MAIN_PAGE : path, hasRoute);

    if (!hasRoute) {
      await this.routes.get(PAGE_ID.NOT_FOUND_PAGE)?.();
      return;
    }

    await this.routes.get(path)?.();
    history.pushState({ path }, '', path);
  }

  public setRoutes(routes: Map<string, () => Promise<Page>>): Map<string, () => Promise<Page>> {
    this.routes = routes;
    return this.routes;
  }
}

export default RouterModel;
