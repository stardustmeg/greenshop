import type { State } from '../Store/reducer';

import { PAGE_ID } from './pages.ts';

const initialState: State = {
  anonymousCartId: null,
  anonymousId: null,
  billingCountry: '',
  currentLanguage: 'en',
  currentPage: PAGE_ID.DEFAULT_PAGE,
  currentUser: null,
  isAppThemeLight: true,
  isUserLoggedIn: false,
  selectedFilters: {
    category: new Set(),
    price: null,
    size: null,
  },
  shippingCountry: '',
};

export default initialState;
