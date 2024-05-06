export const INPUT_TYPE = {
  CHECK_BOX: 'checkbox',
  COLOR: 'color',
  DATE: 'date',
  EMAIL: 'email',
  NUMBER: 'number',
  PASSWORD: 'password',
  RANGE: 'range',
  SEARCH: 'search',
  TEXT: 'text',
} as const;

export const FORM_TEXT = {
  DEFAULT_ADDRESS: 'Use as default address',
  SINGLE_ADDRESS: 'Use as billing address',
};

export const USER_COUNTRY_ADDRESS = {
  BILLING: 'billingCountry',
  SHIPPING: 'shippingCountry',
} as const;

export const USER_ADDRESS_TYPE = {
  BILLING: 'billingAddress',
  SHIPPING: 'shippingAddress',
} as const;

export const USER_POSTAL_CODE = {
  BILLING_POSTAL_CODE: 'billing_PostalCode',
  POSTAL_CODE: 'postalCode',
} as const;

export const PASSWORD_TEXT = {
  HIDDEN: '********',
  SHOWN: 'Password123',
};
