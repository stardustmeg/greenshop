import type { State } from './reducer.ts';

import { LANGUAGE_CHOICE } from '../constants/common.ts';
import { PAGE_ID } from '../constants/pages.ts';

const initialState: State = {
  anonymousCartId: null,
  anonymousId: null,
  anonymousShopListId: null,
  anonymousToken: null,
  authToken: null,
  billingCountry: '',
  currentLanguage: LANGUAGE_CHOICE.EN,
  currentPage: PAGE_ID.DEFAULT_PAGE,
  defaultCountry: '',
  isAppThemeLight: true,
  isUserLoggedIn: false,
  shippingCountry: '',
};

export default initialState;
