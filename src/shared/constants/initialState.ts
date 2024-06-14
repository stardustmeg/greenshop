import type { State } from '../Store/reducer';

import { LANGUAGE_CHOICE } from './common.ts';
import { PAGE_ID } from './pages.ts';

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
