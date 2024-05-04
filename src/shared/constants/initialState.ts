import type { State } from '../Store/reducer';

const initialState: State = {
  billingCountry: '',
  categories: [],
  currentUser: null,
  products: [],
  shippingCountry: '',
};

export default initialState;
