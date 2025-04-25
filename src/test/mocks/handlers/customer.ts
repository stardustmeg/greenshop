import { HttpResponse, http } from 'msw';

const me = {
  addresses: [
    {
      city: 'Anytown',
      country: 'DK',
      email: 'test-test@example.com',
      firstName: 'Jane',
      id: 'sbSHz6YF',
      lastName: 'Smith',
      postalCode: '1234',
      state: '',
      streetName: 'Main Street 123',
      streetNumber: '',
    },
  ],
  authenticationMode: 'Password',
  billingAddressIds: ['sbSHz6YF'],
  createdAt: '2024-06-16T08:57:27.551Z',
  createdBy: {
    anonymousId: '533d1e77-4d6f-4567-a6b0-6a332a11892f',
    clientId: 'BPJMQ0wyC-4dA_1sd04SlJQx',
    isPlatformClient: false,
  },
  dateOfBirth: '1990-01-01',
  defaultBillingAddressId: 'sbSHz6YF',
  defaultShippingAddressId: 'sbSHz6YF',
  email: 'test-test@example.com',
  firstName: 'Jane',
  id: '9b59ebfc-76b3-4904-af39-e0ee2f2a7d7a',
  isEmailVerified: false,
  lastMessageSequenceNumber: 1,
  lastModifiedAt: '2024-06-16T08:57:27.551Z',
  lastModifiedBy: {
    anonymousId: '533d1e77-4d6f-4567-a6b0-6a332a11892f',
    clientId: 'BPJMQ0wyC-4dA_1sd04SlJQx',
    isPlatformClient: false,
  },
  lastName: 'Smith',
  locale: 'en',
  password: '****HOM=',
  shippingAddressIds: ['sbSHz6YF'],
  stores: [],
  version: 1,
  versionModifiedAt: '2024-06-16T08:57:27.551Z',
};
const customer = {
  cart: {
    anonymousId: '533d1e77-4d6f-4567-a6b0-6a332a11892f',
    cartState: 'Active',
    createdAt: '2024-06-16T08:54:22.342Z',
    createdBy: {
      anonymousId: '533d1e77-4d6f-4567-a6b0-6a332a11892f',
      clientId: 'BPJMQ0wyC-4dA_1sd04SlJQx',
      isPlatformClient: false,
    },
    customLineItems: [],
    customerId: '9b59ebfc-76b3-4904-af39-e0ee2f2a7d7a',
    deleteDaysAfterLastModification: 2,
    directDiscounts: [],
    discountCodes: [],
    id: 'a97100b4-e2b8-4e6d-96b0-efa8973df56f',
    inventoryMode: 'None',
    itemShippingAddresses: [],
    lastMessageSequenceNumber: 1,
    lastModifiedAt: '2024-06-16T08:54:22.342Z',
    lastModifiedBy: {
      anonymousId: '533d1e77-4d6f-4567-a6b0-6a332a11892f',
      clientId: 'BPJMQ0wyC-4dA_1sd04SlJQx',
      isPlatformClient: false,
    },
    lineItems: [],
    origin: 'Customer',
    refusedGifts: [],
    shipping: [],
    shippingMode: 'Single',
    taxCalculationMode: 'LineItemLevel',
    taxMode: 'Platform',
    taxRoundingMode: 'HalfEven',
    totalPrice: {
      centAmount: 0,
      currencyCode: 'USD',
      fractionDigits: 2,
      type: 'centPrecision',
    },
    type: 'Cart',
    version: 2,
    versionModifiedAt: '2024-06-16T08:57:27.571Z',
  },
  customer: me,
};

const meList = {
  count: 1,
  limit: 20,
  offset: 0,
  results: [me],
  total: 1,
};

const handlers = [
  http.post(`${import.meta.env.VITE_APP_CTP_API_URL}/${import.meta.env.VITE_APP_CTP_PROJECT_KEY}/me/signup`, () =>
    HttpResponse.json(customer),
  ),
  http.post(`${import.meta.env.VITE_APP_CTP_API_URL}/${import.meta.env.VITE_APP_CTP_PROJECT_KEY}/me/login`, () =>
    HttpResponse.json(customer),
  ),
  http.get(`${import.meta.env.VITE_APP_CTP_API_URL}/${import.meta.env.VITE_APP_CTP_PROJECT_KEY}/customers`, () =>
    HttpResponse.json(meList),
  ),
  http.post(`${import.meta.env.VITE_APP_CTP_API_URL}/${import.meta.env.VITE_APP_CTP_PROJECT_KEY}/me`, () =>
    HttpResponse.json(me),
  ),
  http.post(`${import.meta.env.VITE_APP_CTP_API_URL}/${import.meta.env.VITE_APP_CTP_PROJECT_KEY}/me/password`, () =>
    HttpResponse.json(me),
  ),
];

export default handlers;
