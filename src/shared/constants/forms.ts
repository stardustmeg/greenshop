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
  en: {
    DEFAULT_BILLING_ADDRESS: 'Use as default for billing',
    DEFAULT_SHIPPING_ADDRESS: 'Use as default for shipping',
    SINGLE_ADDRESS: 'Use shipping address as billing',
  },
  ru: {
    DEFAULT_BILLING_ADDRESS: 'Использовать по умолчанию для выставления счетов',
    DEFAULT_SHIPPING_ADDRESS: 'Использовать по умолчанию для доставки',
    SINGLE_ADDRESS: 'Использовать адрес доставки для выставления счетов',
  },
} as const;

export const FORM_TEXT_KEYS = {
  DEFAULT_BILLING_ADDRESS: 'DEFAULT_BILLING_ADDRESS',
  DEFAULT_SHIPPING_ADDRESS: 'DEFAULT_SHIPPING_ADDRESS',
  SINGLE_ADDRESS: 'SINGLE_ADDRESS',
} as const;

export type FormTextKeysType = (typeof FORM_TEXT_KEYS)[keyof typeof FORM_TEXT_KEYS];

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
