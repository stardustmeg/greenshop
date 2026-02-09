import { PAGE_TITLE } from '../constants/pages.ts';
import getCurrentLanguage from './getCurrentLanguage.ts';

const keyExistsInPageTitle = (key: string): boolean => key in PAGE_TITLE[getCurrentLanguage()];

export default keyExistsInPageTitle;
