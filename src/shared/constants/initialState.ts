import type { State } from '../Store/reducer';

const initialState: State = {
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
