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

export const DEFAULT_ADDRESS = {
  setDefault: true,
};

export type FormTextKeysType = (typeof FORM_TEXT_KEYS)[keyof typeof FORM_TEXT_KEYS];

export const USER_COUNTRY_ADDRESS = {
  BILLING: 'billing',
  SHIPPING: 'shipping',
} as const;

export const USER_ADDRESS_TYPE = {
  BILLING: 'billing',
  SHIPPING: 'shipping',
} as const;

export type UserAddressType = (typeof USER_ADDRESS_TYPE)[keyof typeof USER_ADDRESS_TYPE];

export const ADDRESS_TYPE = {
  BILLING: 'billing',
  DEFAULT_BILLING: 'default billing',
  DEFAULT_SHIPPING: 'default shipping',
  SHIPPING: 'shipping',
} as const;

export type AddressTypeType = (typeof ADDRESS_TYPE)[keyof typeof ADDRESS_TYPE];

export const LABEL_TYPE = {
  en: {
    BILLING: 'billing',
    DEFAULT_BILLING: 'default billing',
    DEFAULT_SHIPPING: 'default shipping',
    SHIPPING: 'shipping',
  },
  ru: {
    BILLING: 'Выставление счетов',
    DEFAULT_BILLING: 'По умолчанию для выставления счетов',
    DEFAULT_SHIPPING: 'По умолчанию для доставки',
    SHIPPING: 'Доставка',
  },
} as const;

export type LabelTypeType = (typeof LABEL_TYPE)[keyof typeof LABEL_TYPE];

export const USER_POSTAL_CODE = {
  BILLING_POSTAL_CODE: 'billing_PostalCode',
  POSTAL_CODE: 'postalCode',
} as const;

export const PASSWORD_TEXT = {
  HIDDEN: '********',
  SHOWN: 'Password123',
};

export const ADDRESS_TEXT = {
  en: {
    CITY: 'City: ',
    COUNTRY: 'Country: ',
    POSTAL_CODE: 'Postal code: ',
    STREET: 'Street: ',
  },
  ru: {
    CITY: 'Город: ',
    COUNTRY: 'Страна: ',
    POSTAL_CODE: 'Почтовый индекс: ',
    STREET: 'Улица: ',
  },
} as const;
