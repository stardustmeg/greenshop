const TOOLTIP_TEXT = {
  en: {
    ADD_BILLING_ADDRESS: 'Add new billing address',
    ADD_SHIPPING_ADDRESS: 'Add new shipping address',
    DELETE_ADDRESS: 'Delete address',
    EDIT_ADDRESS: 'Edit address',
    EDIT_PASSWORD: 'Edit password',
  },
  ru: {
    ADD_BILLING_ADDRESS: 'Добавить новый адрес выставления счетов',
    ADD_SHIPPING_ADDRESS: 'Добавить новый адрес доставки',
    DELETE_ADDRESS: 'Удалить адрес',
    EDIT_ADDRESS: 'Изменить адрес',
    EDIT_PASSWORD: 'Изменить пароль',
  },
} as const;

export const TOOLTIP_TEXT_KEYS = {
  ADD_BILLING_ADDRESS: 'ADD_BILLING_ADDRESS',
  ADD_SHIPPING_ADDRESS: 'ADD_SHIPPING_ADDRESS',
  DELETE_ADDRESS: 'DELETE_ADDRESS',
  EDIT_ADDRESS: 'EDIT_ADDRESS',
  EDIT_PASSWORD: 'EDIT_PASSWORD',
};

export type TooltipTextKeysType = (typeof TOOLTIP_TEXT_KEYS)[keyof typeof TOOLTIP_TEXT_KEYS];

export default TOOLTIP_TEXT;
