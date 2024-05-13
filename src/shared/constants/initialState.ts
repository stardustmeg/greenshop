import type { State } from '../Store/reducer';

import { PAGE_ID } from './pages.ts';

const initialState: State = {
  billingCountry: '',
  categories: [],
  currentLanguage: 'en',
  currentPage: PAGE_ID.DEFAULT_PAGE,
  currentUser: null,
  isAppThemeLight: true,
  isUserLoggedIn: false,
  products: [],
  selectedFilters: {
    category: new Set(),
    price: null,
    size: null,
  },
  shippingCountry: '',
};

export default initialState;
