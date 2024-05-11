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
  shippingCountry: '',
};

export default initialState;
