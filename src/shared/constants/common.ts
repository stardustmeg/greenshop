export const AUTOCOMPLETE_OPTION = {
  OFF: 'off',
  ON: 'on',
} as const;

export const LANGUAGE_CHOICE = {
  EN: 'en',
  RU: 'ru',
} as const;

export const DATA_KEYS = {
  ADDRESS_TYPE: 'data-addressType',
  DIRECTION: 'data-direction',
} as const;

export const TABLET_WIDTH = 768;

export const SCROLL_TO_TOP_THRESHOLD = 200;

export type LanguageChoiceType = (typeof LANGUAGE_CHOICE)[keyof typeof LANGUAGE_CHOICE];
