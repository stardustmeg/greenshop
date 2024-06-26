const TOOLTIP_TEXT: Record<string, Record<string, string>> = {
  en: {
    ADD_BILLING_ADDRESS: 'Add new billing address',
    ADD_SHIPPING_ADDRESS: 'Add new shipping address',
    DELETE_ADDRESS: 'Delete address',
    EDIT_ADDRESS: 'Edit address',
    EDIT_PASSWORD: 'Edit password',
    EDIT_SHIPPING_ADDRESS: 'Switch shipping address status',
    SCROLL_TO_TOP: 'Scroll to top',
    SWITCH_BILLING_ADDRESS: 'Switch billing address status',
    SWITCH_DEFAULT_BILLING_ADDRESS: 'Switch default billing address status',
    SWITCH_DEFAULT_SHIPPING_ADDRESS: 'Switch default shipping address status',
    SWITCH_SHIPPING_ADDRESS: 'Switch shipping address status',
  },
  ru: {
    ADD_BILLING_ADDRESS: 'Добавить новый адрес выставления счетов',
    ADD_SHIPPING_ADDRESS: 'Добавить новый адрес доставки',
    DELETE_ADDRESS: 'Удалить адрес',
    EDIT_ADDRESS: 'Изменить адрес',
    EDIT_PASSWORD: 'Изменить пароль',
    SCROLL_TO_TOP: 'Наверх',
    SWITCH_BILLING_ADDRESS: 'Изменить статус адреса выставления счетов',
    SWITCH_DEFAULT_BILLING_ADDRESS: 'Изменить статус адреса выставления счетов по умолчанию',
    SWITCH_DEFAULT_SHIPPING_ADDRESS: 'Изменить статус адреса доставки по умолчанию',
    SWITCH_SHIPPING_ADDRESS: 'Изменить статус адреса доставки',
  },
} as const;

export const TOOLTIP_TEXT_KEY = {
  ADD_BILLING_ADDRESS: 'ADD_BILLING_ADDRESS',
  ADD_SHIPPING_ADDRESS: 'ADD_SHIPPING_ADDRESS',
  DELETE_ADDRESS: 'DELETE_ADDRESS',
  EDIT_ADDRESS: 'EDIT_ADDRESS',
  EDIT_PASSWORD: 'EDIT_PASSWORD',
  SCROLL_TO_TOP: 'SCROLL_TO_TOP',
  SWITCH_BILLING_ADDRESS: 'SWITCH_BILLING_ADDRESS',
  SWITCH_DEFAULT_BILLING_ADDRESS: 'SWITCH_DEFAULT_BILLING_ADDRESS',
  SWITCH_DEFAULT_SHIPPING_ADDRESS: 'SWITCH_DEFAULT_SHIPPING_ADDRESS',
  SWITCH_SHIPPING_ADDRESS: 'SWITCH_SHIPPING_ADDRESS',
};

export type TooltipTextKeyType = (typeof TOOLTIP_TEXT_KEY)[keyof typeof TOOLTIP_TEXT_KEY];

export default TOOLTIP_TEXT;
