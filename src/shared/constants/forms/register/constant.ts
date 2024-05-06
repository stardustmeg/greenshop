export const KEY = 'registration_';

export const TITLE_TEXT = {
  en: {
    BILLING_ADDRESS: 'Billing address',
    CREDENTIALS: 'Credentials',
    PERSONAL: 'Personal',
    SHIPPING_ADDRESS: 'Shipping address',
  },
  ru: {
    BILLING_ADDRESS: 'Адрес выставления счетов',
    CREDENTIALS: 'Логин и пароль',
    PERSONAL: 'Личные данные',
    SHIPPING_ADDRESS: 'Адрес доставки',
  },
} as const;

export const TITLE_TEXT_KEYS = {
  BILLING_ADDRESS: 'BILLING_ADDRESS',
  CREDENTIALS: 'CREDENTIALS',
  PERSONAL: 'PERSONAL',
  SHIPPING_ADDRESS: 'SHIPPING_ADDRESS',
} as const;

export type TitleTextKeysType = (typeof TITLE_TEXT_KEYS)[keyof typeof TITLE_TEXT_KEYS];
