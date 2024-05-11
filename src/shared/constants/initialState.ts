import type { State } from '../Store/reducer';

const initialState: State = {
  appTheme: 'light',
  billingCountry: '',
  categories: [],
  currentLanguage: 'en',
  currentPage: '',
  currentUser: null,
  isUserLoggedIn: false,
  products: [],
  shippingCountry: '',
};

export default initialState;
