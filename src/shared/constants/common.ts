export const AUTOCOMPLETE_OPTION = {
  OFF: 'off',
  ON: 'on',
} as const;

export const LANGUAGE_CHOICE = {
  EN: 'en',
  RU: 'ru',
} as const;

export type LanguageChoiceType = (typeof LANGUAGE_CHOICE)[keyof typeof LANGUAGE_CHOICE];

export const DATA_KEY = {
  ADDRESS: 'data-addressType',
  DIRECTION: 'data-direction',
} as const;

export const TABLET_WIDTH = 768;

export const SCROLL_TO_TOP_THRESHOLD = 200;
