const TOOLTIP_TEXT = {
  en: {
    EDIT_PASSWORD: 'Edit password',
  },
  ru: {
    EDIT_PASSWORD: 'Изменить пароль',
  },
} as const;

export const TOOLTIP_TEXT_KEYS = {
  EDIT_PASSWORD: 'EDIT_PASSWORD',
};

export type TooltipTextKeysType = (typeof TOOLTIP_TEXT_KEYS)[keyof typeof TOOLTIP_TEXT_KEYS];

export default TOOLTIP_TEXT;
