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
  searchValue: '',
  selectedFilters: {
    category: new Set(),
    metaFilter: 'All products',
    price: null,
    size: null,
  },
  selectedSorting: {
    direction: 'asc',
    field: 'price',
  },
  shippingCountry: '',
};

export default initialState;
