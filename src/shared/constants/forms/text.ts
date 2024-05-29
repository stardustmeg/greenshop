export const TITLE_TEXT = {
  en: {
    ADDRESS: 'Address',
    BILLING_ADDRESS: 'Billing Address',
    CREDENTIALS: 'Credentials',
    PERSONAL: 'Personal',
    SHIPPING_ADDRESS: 'Shipping Address',
  },
  ru: {
    ADDRESS: 'Адрес',
    BILLING_ADDRESS: 'Адрес выставления счетов',
    CREDENTIALS: 'Логин и пароль',
    PERSONAL: 'Личные данные',
    SHIPPING_ADDRESS: 'Адрес доставки',
  },
} as const;

export const TITLE_TEXT_KEYS = {
  ADDRESS: 'ADDRESS',
  BILLING_ADDRESS: 'BILLING_ADDRESS',
  CREDENTIALS: 'CREDENTIALS',
  PERSONAL: 'PERSONAL',
  SHIPPING_ADDRESS: 'SHIPPING_ADDRESS',
} as const;

export type TitleTextKeysType = (typeof TITLE_TEXT_KEYS)[keyof typeof TITLE_TEXT_KEYS];
