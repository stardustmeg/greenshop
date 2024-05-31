import { PAGE_ID } from '../constants/pages.ts';
import { appTitle } from './messageTemplates.ts';

const PROJECT_TITLE = import.meta.env.VITE_APP_PROJECT_TITLE;
const NEXT_SEGMENT = import.meta.env.VITE_APP_NEXT_SEGMENT;
const PATH_SEGMENTS_TO_KEEP = import.meta.env.VITE_APP_PATH_SEGMENTS_TO_KEEP;

const setPageTitle = (currentPage: string, hasRoute: boolean): void => {
  let currentPageTitle: string;

  if (hasRoute) {
    if (currentPage === PAGE_ID.DEFAULT_PAGE) {
      currentPageTitle = PAGE_ID.MAIN_PAGE.slice(PATH_SEGMENTS_TO_KEEP, -NEXT_SEGMENT);
    } else {
      currentPageTitle = currentPage.slice(PATH_SEGMENTS_TO_KEEP, -NEXT_SEGMENT);
    }
  } else {
    currentPageTitle = PAGE_ID.NOT_FOUND_PAGE.slice(PATH_SEGMENTS_TO_KEEP, -NEXT_SEGMENT);
  }

  document.title = appTitle(PROJECT_TITLE, currentPageTitle);
};

export default setPageTitle;
