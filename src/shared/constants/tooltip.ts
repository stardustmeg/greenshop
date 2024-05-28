const TOOLTIP_TEXT: Record<string, Record<string, string>> = {
  en: {
    ADD_BILLING_ADDRESS: 'Add new billing address',
    ADD_SHIPPING_ADDRESS: 'Add new shipping address',
    DELETE_ADDRESS: 'Delete address',
    EDIT_ADDRESS: 'Edit address',
    EDIT_BILLING_ADDRESS: 'Edit billing address',
    EDIT_DEFAULT_BILLING_ADDRESS: 'Edit default billing address',
    EDIT_DEFAULT_SHIPPING_ADDRESS: 'Edit default shipping address',
    EDIT_PASSWORD: 'Edit password',
    EDIT_SHIPPING_ADDRESS: 'Edit shipping address',
  },
  ru: {
    ADD_BILLING_ADDRESS: 'Добавить новый адрес выставления счетов',
    ADD_SHIPPING_ADDRESS: 'Добавить новый адрес доставки',
    DELETE_ADDRESS: 'Удалить адрес',
    EDIT_ADDRESS: 'Изменить адрес',
    EDIT_BILLING_ADDRESS: 'Изменить адрес выставления счетов',
    EDIT_DEFAULT_BILLING_ADDRESS: 'Изменить адрес выставления счетов по умолчанию',
    EDIT_DEFAULT_SHIPPING_ADDRESS: 'Изменить адрес доставки по умолчанию',
    EDIT_PASSWORD: 'Изменить пароль',
    EDIT_SHIPPING_ADDRESS: 'Изменить адрес доставки',
  },
} as const;

export const TOOLTIP_TEXT_KEYS = {
  ADD_BILLING_ADDRESS: 'ADD_BILLING_ADDRESS',
  ADD_SHIPPING_ADDRESS: 'ADD_SHIPPING_ADDRESS',
  DELETE_ADDRESS: 'DELETE_ADDRESS',
  EDIT_ADDRESS: 'EDIT_ADDRESS',
  EDIT_BILLING_ADDRESS: 'EDIT_BILLING_ADDRESS',
  EDIT_DEFAULT_BILLING_ADDRESS: 'EDIT_DEFAULT_BILLING_ADDRESS',
  EDIT_DEFAULT_SHIPPING_ADDRESS: 'EDIT_DEFAULT_SHIPPING_ADDRESS',
  EDIT_PASSWORD: 'EDIT_PASSWORD',
  EDIT_SHIPPING_ADDRESS: 'EDIT_SHIPPING_ADDRESS',
};

export type TooltipTextKeysType = (typeof TOOLTIP_TEXT_KEYS)[keyof typeof TOOLTIP_TEXT_KEYS];

export default TOOLTIP_TEXT;
