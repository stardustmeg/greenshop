import KEY from './constants.ts';

export const EMAIL_FIELD = {
  inputParams: {
    autocomplete: 'off',
    id: `${KEY}email`,
    placeholder: 'user@example.com',
    type: 'text',
  },
  labelParams: {
    for: `${KEY}email`,
    text: {
      en: '',
      ru: '',
    },
  },
} as const;

export const PASSWORD_FIELD = {
  inputParams: {
    autocomplete: 'off',
    id: `${KEY}password`,
    placeholder: '***********',
    type: 'password',
  },
  labelParams: {
    for: `${KEY}password`,
    text: {
      en: '',
      ru: '',
    },
  },
} as const;

export const INPUT_FIELD = [EMAIL_FIELD, PASSWORD_FIELD];
