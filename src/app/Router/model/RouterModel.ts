import type { PagesType } from '@/shared/types/page';

import getStore from '@/shared/Store/Store.ts';
import observeStore, { selectCurrentLanguage } from '@/shared/Store/observer.ts';
import { PAGE_ID } from '@/shared/constants/pages.ts';
import { isValidPath, isValidState } from '@/shared/types/validation/paths.ts';
import setPageTitle from '@/shared/utils/setPageTitle.ts';
import { showErrorMessage } from '@/shared/utils/userMessage.ts';

const DEFAULT_SEGMENT = import.meta.env.VITE_APP_DEFAULT_SEGMENT;
const NEXT_SEGMENT = import.meta.env.VITE_APP_NEXT_SEGMENT;
const PATH_SEGMENTS_TO_KEEP = import.meta.env.VITE_APP_PATH_SEGMENTS_TO_KEEP;
const SEARCH_SEGMENT = import.meta.env.VITE_APP_SEARCH_SEGMENT;

class RouterModel {
  private static router: RouterModel;

  private routes: PagesType = new Map();

  constructor(routes: PagesType) {
    if (!RouterModel.router) {
      RouterModel.router = this;
    }

    this.routes = routes;
    document.addEventListener('DOMContentLoaded', () => {
      const currentPath =
        (window.location.pathname + window.location.search).slice(NEXT_SEGMENT).split(DEFAULT_SEGMENT) ||
        PAGE_ID.DEFAULT_PAGE;
      this.navigateTo(currentPath.join(DEFAULT_SEGMENT));
    });

    window.addEventListener('popstate', (event) => {
      const currentState: unknown = event.state;
      let [currentPage] = '';
      let currentPath = '';

      if (isValidState(currentState)) {
        [currentPage] = currentState.path.split(DEFAULT_SEGMENT)[PATH_SEGMENTS_TO_KEEP].split(SEARCH_SEGMENT);
        currentPath = currentState.path;
      }

      if (!isValidState(currentState) || !isValidPath(currentPage)) {
        window.location.pathname = PAGE_ID.DEFAULT_PAGE;
        return;
      }

      this.handleRequest(currentPage, currentPath).catch(showErrorMessage);
    });
  }

  public static changeSearchParams(callback: (url: URL) => void): void {
    const url = new URL(decodeURIComponent(window.location.href));
    callback(url);
    const path = url.pathname + url.search.toString();
    window.history.pushState({ path: path.slice(NEXT_SEGMENT) }, '', path);
  }

  public static clearSearchParams(): void {
    const url = new URL(decodeURIComponent(window.location.href));
    const path = `${DEFAULT_SEGMENT}${url.pathname.split(DEFAULT_SEGMENT)[NEXT_SEGMENT]}${DEFAULT_SEGMENT}`;
    window.history.pushState({ path: path.slice(NEXT_SEGMENT) }, '', path);
  }

  public static getCurrentPage(): string {
    return window.location.pathname.slice(PATH_SEGMENTS_TO_KEEP).split(DEFAULT_SEGMENT)[NEXT_SEGMENT];
  }

  public static getInstance(): RouterModel {
    return RouterModel.router;
  }

  public static getPageID(): null | string {
    return (
      (window.location.pathname + window.location.search)
        .slice(NEXT_SEGMENT)
        .split(DEFAULT_SEGMENT)
        .join(DEFAULT_SEGMENT)
        .split(DEFAULT_SEGMENT)
        [NEXT_SEGMENT]?.split(SEARCH_SEGMENT)[PATH_SEGMENTS_TO_KEEP] || null
    );
  }

  public static getSavedPath(): string {
    const path =
      window.location.pathname.slice(NEXT_SEGMENT).split(DEFAULT_SEGMENT).join(DEFAULT_SEGMENT) || PAGE_ID.DEFAULT_PAGE;
    return path + window.location.search;
  }

  public static getSearchParams(): URLSearchParams {
    return new URL(decodeURIComponent(window.location.href)).searchParams;
  }

  private async checkPageAndParams(currentPage: string, path: string): Promise<boolean | null> {
    const hasRoute = this.routes.has(currentPage);

    setPageTitle(currentPage, hasRoute);
    observeStore(selectCurrentLanguage, () => this.checkPageAndParams(currentPage, path));

    if (!hasRoute) {
      await this.routes.get(PAGE_ID.NOT_FOUND_PAGE)?.();
      return null;
    }

    return hasRoute;
  }

  private async handleRequest(currentPage: string, path: string): Promise<void> {
    try {
      await this.checkPageAndParams(currentPage, path);
      this.routes.get(currentPage)?.().catch(showErrorMessage);
    } catch (error) {
      showErrorMessage(error);
    }
  }

  public navigateTo(path: string): void {
    const currentPage =
      path.split(DEFAULT_SEGMENT)[PATH_SEGMENTS_TO_KEEP].split(SEARCH_SEGMENT)[PATH_SEGMENTS_TO_KEEP] ||
      PAGE_ID.DEFAULT_PAGE;

    if (currentPage !== getStore().getState().currentPage || currentPage === PAGE_ID.DEFAULT_PAGE) {
      this.handleRequest(currentPage, path).catch(showErrorMessage);
    }
    history.pushState({ path }, '', `/${path}`);
  }
}

export default RouterModel;
