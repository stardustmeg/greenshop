import type { State } from '../Store/reducer';

const initialState: State = {
  billingCountry: '',
  categories: [],
  currentLanguage: 'en',
  currentPage: '',
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
