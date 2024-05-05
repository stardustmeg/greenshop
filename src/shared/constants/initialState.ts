import type { State } from '../Store/reducer';

const initialState: State = {
  billingCountry: '',
  categories: [],
  currentLanguage: 'en',
  currentUser: null,
  products: [],
  shippingCountry: '',
};

export default initialState;
