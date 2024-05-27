import type { PageParams, PagesType } from '@/shared/types/page';

import { PAGE_ID } from '@/shared/constants/pages.ts';
import { isValidPath, isValidState } from '@/shared/types/validation/paths.ts';
import formattedText from '@/shared/utils/formattedText.ts';
import showErrorMessage from '@/shared/utils/userMessage.ts';

const PROJECT_TITLE = import.meta.env.VITE_APP_PROJECT_TITLE;
const DEFAULT_SEGMENT = import.meta.env.VITE_APP_DEFAULT_SEGMENT;
const NEXT_SEGMENT = import.meta.env.VITE_APP_NEXT_SEGMENT;
const PATH_SEGMENTS_TO_KEEP = import.meta.env.VITE_APP_PATH_SEGMENTS_TO_KEEP;

class RouterModel {
  private static router: RouterModel;

  private routes: PagesType = new Map();

  constructor(routes: PagesType) {
    if (!RouterModel.router) {
      RouterModel.router = this;
    }

    this.routes = routes;
    document.addEventListener('DOMContentLoaded', () => {
      const currentPath = window.location.pathname.slice(NEXT_SEGMENT).split(DEFAULT_SEGMENT) || PAGE_ID.DEFAULT_PAGE;
      this.navigateTo(currentPath.join(DEFAULT_SEGMENT));
    });

    window.addEventListener('popstate', (event) => {
      const currentState: unknown = event.state;
      let currentPage = '';
      let currentPath = '';

      if (isValidState(currentState)) {
        currentPage = currentState.path.split(DEFAULT_SEGMENT)[PATH_SEGMENTS_TO_KEEP] + DEFAULT_SEGMENT;
        currentPath = currentState.path;
      }

      if (!isValidState(currentState) || !isValidPath(currentPage)) {
        window.location.pathname = PAGE_ID.DEFAULT_PAGE;
        return;
      }

      this.handleRequest(currentPage, currentPath);
    });
  }

  public static appendSearchParams(key: string, value: string): void {
    const url = new URL(decodeURIComponent(window.location.href));
    url.searchParams.append(key, value);
    const path = url.pathname + encodeURIComponent(url.search);
    window.history.pushState({ path: path.slice(1) }, '', path);
  }

  public static clearSearchParams(): void {
    const url = new URL(decodeURIComponent(window.location.href));
    const path = `${DEFAULT_SEGMENT}${url.pathname.split(DEFAULT_SEGMENT)[NEXT_SEGMENT]}${DEFAULT_SEGMENT}`;
    window.history.pushState({ path: path.slice(1) }, '', path);
  }

  public static deleteSearchParams(key: string): void {
    const url = new URL(decodeURIComponent(window.location.href));
    url.searchParams.delete(key);
    const path = url.pathname + encodeURIComponent(url.search);
    window.history.pushState({ path: path.slice(1) }, '', path);
  }

  public static getInstance(): RouterModel {
    return RouterModel.router;
  }

  public static getSearchParams(): URLSearchParams {
    return new URL(decodeURIComponent(window.location.href)).searchParams;
  }

  public static setSearchParams(key: string, value: string): void {
    const url = new URL(decodeURIComponent(window.location.href));
    url.searchParams.delete(key);
    url.searchParams.set(key, value);
    const path = url.pathname + encodeURIComponent(url.search);
    window.history.pushState({ path: path.slice(1) }, '', path);
  }

  private async checkPageAndParams(
    currentPage: string,
    path: string,
  ): Promise<{ hasRoute: boolean; params: PageParams } | null> {
    const hasRoute = this.routes.has(currentPage);
    const decodePath = decodeURIComponent(path);
    const id = decodePath.split(DEFAULT_SEGMENT).slice(PATH_SEGMENTS_TO_KEEP, -NEXT_SEGMENT)[NEXT_SEGMENT];
    const title = `${PROJECT_TITLE} | ${hasRoute ? formattedText(currentPage === PAGE_ID.DEFAULT_PAGE ? PAGE_ID.MAIN_PAGE.slice(PATH_SEGMENTS_TO_KEEP, -NEXT_SEGMENT) : currentPage.slice(PATH_SEGMENTS_TO_KEEP, -NEXT_SEGMENT)) : PAGE_ID.NOT_FOUND_PAGE.slice(PATH_SEGMENTS_TO_KEEP, -NEXT_SEGMENT)}`;
    document.title = title;

    if (!hasRoute) {
      await this.routes.get(PAGE_ID.NOT_FOUND_PAGE)?.({});
      return null;
    }

    return {
      hasRoute,
      params: {
        [currentPage.slice(PATH_SEGMENTS_TO_KEEP, -NEXT_SEGMENT)]: {
          id: id ?? null,
        },
      },
    };
  }

  private handleRequest(currentPage: string, path: string): void {
    this.checkPageAndParams(currentPage, path)
      .then((check) => {
        if (check) {
          this.routes.get(currentPage)?.(check.params).catch(showErrorMessage);
        }
      })
      .catch(showErrorMessage);
  }

  public navigateTo(path: string): void {
    const currentPage = path.split(DEFAULT_SEGMENT)[PATH_SEGMENTS_TO_KEEP] + DEFAULT_SEGMENT || PAGE_ID.DEFAULT_PAGE;
    this.checkPageAndParams(currentPage, path)
      .then((check) => {
        if (check) {
          this.routes.get(currentPage)?.(check.params).catch(showErrorMessage);
          history.pushState({ path }, '', `/${path}`);
        }
      })
      .catch(showErrorMessage);
  }
}

export default RouterModel;
