import { PAGE_ID } from '../constants/pages.ts';
import { appTitle } from './messageTemplates.ts';

const {
  VITE_APP_NEXT_SEGMENT: NEXT_SEGMENT,
  VITE_APP_PATH_SEGMENTS_TO_KEEP: PATH_SEGMENTS_TO_KEEP,
  VITE_APP_PROJECT_TITLE: PROJECT_TITLE,
} = import.meta.env;

const getPageTitle = (currentPage: string, hasRoute: boolean): string => {
  let currentPageTitle: string;

  if (hasRoute) {
    currentPageTitle = currentPage === PAGE_ID.DEFAULT_PAGE ? PAGE_ID.MAIN_PAGE : currentPage;
  } else {
    currentPageTitle = PAGE_ID.NOT_FOUND_PAGE;
  }

  const trimmedTitle = currentPageTitle.slice(PATH_SEGMENTS_TO_KEEP, -NEXT_SEGMENT);

  return appTitle(PROJECT_TITLE, trimmedTitle);
};

const setPageTitle = (currentPage: string, hasRoute: boolean): void => {
  document.title = getPageTitle(currentPage, hasRoute);
};

export default setPageTitle;
