import KEY from './constants.ts';

const EMAIL_FIELD_VALIDATE = {
  key: `${KEY}email`,
  notWhitespace: {
    message: 'Email must not contain white spaces',
    pattern: /^\S+$/,
  },
  required: true,
  validMail: {
    message: 'Enter correct email (user@example.com)',
    pattern: /^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/,
  },
} as const;

const PASSWORD_FIELD_VALIDATE = {
  key: `${KEY}password`,
  minLength: 8,
  notWhitespace: {
    message: 'Password must not contain white spaces',
    pattern: /^\S+$/,
  },
  required: true,
  requiredSymbols: {
    message: 'Password must contain English letters, at least 1 letter in upper and lower case and at least 1 number',
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+/,
  },
} as const;

const INPUT_FIELD_VALIDATION = [EMAIL_FIELD_VALIDATE, PASSWORD_FIELD_VALIDATE];

export default INPUT_FIELD_VALIDATION;
