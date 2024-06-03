import getStore from '../Store/Store.ts';
import { PAGE_ID, PAGE_TITLE } from '../constants/pages.ts';
import { keyExistsInPageTitle } from './isKeyOf.ts';

const appTitle = (projectTitle: string, currentPageTitle: string): string => {
  const { currentLanguage } = getStore().getState();
  if (keyExistsInPageTitle(currentPageTitle)) {
    return `${projectTitle} | ${PAGE_TITLE[currentLanguage][currentPageTitle]}`;
  }
  return `${projectTitle} | ${currentPageTitle}`;
};

const getPageTitle = (currentPage: string, hasRoute: boolean): string => {
  const { VITE_APP_PATH_SEGMENTS_TO_KEEP: PATH_SEGMENTS_TO_KEEP, VITE_APP_PROJECT_TITLE: PROJECT_TITLE } = import.meta
    .env;

  let currentPageTitle: string;

  if (hasRoute) {
    currentPageTitle = currentPage === PAGE_ID.DEFAULT_PAGE ? PAGE_ID.MAIN_PAGE : currentPage;
  } else {
    currentPageTitle = PAGE_ID.NOT_FOUND_PAGE;
  }

  const trimmedTitle = currentPageTitle.slice(PATH_SEGMENTS_TO_KEEP);

  return appTitle(PROJECT_TITLE, trimmedTitle);
};

const setPageTitle = (currentPage: string, hasRoute: boolean): void => {
  document.title = getPageTitle(currentPage, hasRoute);
};

export default setPageTitle;
