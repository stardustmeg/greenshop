const TOOLTIP_TEXT = {
  en: {
    DELETE_ADDRESS: 'Delete address',
    EDIT_ADDRESS: 'Edit address',
    EDIT_PASSWORD: 'Edit password',
  },
  ru: {
    DELETE_ADDRESS: 'Удалить адрес',
    EDIT_ADDRESS: 'Изменить адрес',
    EDIT_PASSWORD: 'Изменить пароль',
  },
} as const;

export const TOOLTIP_TEXT_KEYS = {
  DELETE_ADDRESS: 'DELETE_ADDRESS',
  EDIT_ADDRESS: 'EDIT_ADDRESS',
  EDIT_PASSWORD: 'EDIT_PASSWORD',
};

export type TooltipTextKeysType = (typeof TOOLTIP_TEXT_KEYS)[keyof typeof TOOLTIP_TEXT_KEYS];

export default TOOLTIP_TEXT;
