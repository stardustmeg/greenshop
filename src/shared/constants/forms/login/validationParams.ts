import KEY from './constants.ts';

export const EMAIL_FIELD_VALIDATE = {
  key: `${KEY}email`,
  notWhitespace: {
    messages: { en: 'Email must not contain white spaces', ru: 'Почтовый адрес не может содержать пробелы' },
    pattern: /^\S+$/,
  },
  required: true,
  validMail: {
    messages: {
      en: 'Enter correct email (user@example.com)',
      ru: 'Введите корректный почтовый адрес (user@example.com)',
    },
    pattern: /^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/,
  },
} as const;

export const PASSWORD_FIELD_VALIDATE = {
  key: `${KEY}password`,
  minLength: 8,
  notWhitespace: {
    messages: { en: 'Password must not contain white spaces', ru: 'Пароль не может содержать пробелы' },
    pattern: /^\S+$/,
  },
  required: true,
  requiredSymbols: {
    messages: {
      en: 'Password must contain English letters, at least one letter in upper and lower case and at least one number',
      ru: 'Пароль должен содержать английские буквы, хотя бы одну букву в верхнем регистре и в нижнем регистре и хотя бы одну цифру',
    },
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+/,
  },
} as const;

const INPUT_VALIDATION = [EMAIL_FIELD_VALIDATE, PASSWORD_FIELD_VALIDATE];

export default INPUT_VALIDATION;
