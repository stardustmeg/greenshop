export const EMAIL_VALIDATE = {
  notWhitespace: {
    messages: { en: 'Email must not contain white spaces', ru: 'Адрес электронной почты не должен содержать пробелы' },
    pattern: /^\S+$/,
  },
  required: true,
  validMail: {
    messages: {
      en: 'Enter correct email (user@example.com)',
      ru: 'Введите правильный адрес электронной почты (user@example.com)',
    },
    pattern:
      /^(?!.*[_.-]{2})(?!^[_.-])(?!.*[_\\-]$)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?)*\.[a-zA-Z]{2,6}$/,
  },
} as const;

export const PASSWORD_VALIDATE = {
  minLength: 8,
  notWhitespace: {
    messages: { en: 'Password must not contain white spaces', ru: 'Пароль не должен содержать пробелы' },
    pattern: /^\S+$/,
  },
  required: true,
  requiredSymbols: {
    messages: {
      en: 'Password must contain English letters, at least one letter in upper and lower case and at least one number',
      ru: 'Пароль должен содержать английские буквы, как минимум одну букву в верхнем и нижнем регистре, а также хотя бы одну цифру',
    },
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+/,
  },
} as const;

export const FIRST_NAME_VALIDATE = {
  minLength: 1,
  notSpecialSymbols: {
    messages: {
      en: 'First name must contain only letters',
      ru: 'Имя должно содержать только буквы',
    },
    pattern: /^[a-zA-Zа-яА-я\s]*$/,
  },
  notWhitespace: {
    messages: {
      en: 'First name must not contain white spaces',
      ru: 'Имя не должно содержать пробелы',
    },
    pattern: /^\S+$/,
  },
  required: true,
} as const;

export const LAST_NAME_VALIDATE = {
  minLength: 1,
  notSpecialSymbols: {
    messages: {
      en: 'Last name must contain only letters',
      ru: 'Фамилия должна содержать только буквы',
    },
    pattern: /^[a-zA-Zа-яА-я\s]*$/,
  },
  notWhitespace: {
    messages: {
      en: 'Last name must not contain white spaces',
      ru: 'Фамилия не должна содержать пробелы',
    },
    pattern: /^\S+$/,
  },
  required: true,
} as const;

export const BIRTHDAY_VALIDATE = {
  required: true,
  validBirthday: {
    maxAge: 120,
    messages: {
      en: 'Enter correct birthday (01.01.2000)',
      ru: 'Введите правильную дату рождения (01.01.2000)',
    },
    minAge: 18,
    pattern: /^\d{4}-\d{2}-\d{2}$/,
  },
} as const;

export const ADDRESS_STREET_VALIDATE = {
  minLength: 1,
  required: true,
};

export const ADDRESS_CITY_VALIDATE = {
  minLength: 1,
  notSpecialSymbols: {
    messages: {
      en: 'City must contain only letters',
      ru: 'Город должен содержать только буквы',
    },
    pattern: /^[a-zA-Zа-яА-я\s]*$/,
  },

  required: true,
};

export const ADDRESS_COUNTRY_VALIDATE = {
  required: true,
  validCountry: true,
};

export const ADDRESS_POSTAL_CODE_VALIDATE = {
  required: true,
  validPostalCode: true,
};

export const INPUT_VALIDATION = [
  EMAIL_VALIDATE,
  PASSWORD_VALIDATE,
  FIRST_NAME_VALIDATE,
  LAST_NAME_VALIDATE,
  BIRTHDAY_VALIDATE,
  ADDRESS_STREET_VALIDATE,
  ADDRESS_CITY_VALIDATE,
  ADDRESS_COUNTRY_VALIDATE,
  ADDRESS_POSTAL_CODE_VALIDATE,
];
