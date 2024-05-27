import type { State } from '../Store/reducer';

import { PAGE_ID } from './pages.ts';

const initialState: State = {
  anonymToken: null,
  anonymousCartId: null,
  anonymousId: null,
  authToken: null,
  billingCountry: '',
  currentLanguage: 'en',
  currentPage: PAGE_ID.DEFAULT_PAGE,
  isAppThemeLight: true,
  isUserLoggedIn: false,
  shippingCountry: '',
};

export default initialState;
