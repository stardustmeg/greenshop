export const EMAIL_VALIDATE = {
  key: 'registration_email',
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

export const PASSWORD_VALIDATE = {
  key: 'registration_password',
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

export const FIRST_NAME_VALIDATE = {
  key: 'firstName',
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
      ru: 'Имя не может содержать пробелы',
    },
    pattern: /^\S+$/,
  },
  required: true,
} as const;

export const LAST_NAME_VALIDATE = {
  key: 'lastName',
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
      ru: 'Фамилия не может содержать пробелы',
    },
    pattern: /^\S+$/,
  },
  required: true,
} as const;

export const BIRTHDAY_VALIDATE = {
  key: 'birthDate',
  required: true,
  validBirthday: {
    maxAge: 120,
    messages: {
      en: 'Enter correct birthday (01.01.2000)',
      ru: 'Введите корректный день рождения (01.01.2000)',
    },
    minAge: 18,
    pattern: /^\d{4}-\d{2}-\d{2}$/,
  },
} as const;

export const SHIPPING_ADDRESS_STREET_VALIDATE = {
  key: 'address',
  minLength: 1,
  required: true,
};

export const SHIPPING_ADDRESS_CITY_VALIDATE = {
  key: 'city',
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

export const SHIPPING_ADDRESS_COUNTRY_VALIDATE = {
  key: 'shippingCountry',
  required: true,
  validCountry: true,
};

export const SHIPPING_ADDRESS_POSTAL_CODE_VALIDATE = {
  key: 'postalCode',
  required: true,
  validPostalCode: true,
};

export const BILLING_ADDRESS_STREET_VALIDATE = {
  key: 'billing_address',
  minLength: 1,
  required: true,
};

export const BILLING_ADDRESS_CITY_VALIDATE = {
  key: 'billing_city',
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

export const BILLING_ADDRESS_COUNTRY_VALIDATE = {
  key: 'billing_country',
  required: true,
  validCountry: true,
};

export const BILLING_ADDRESS_POSTAL_CODE_VALIDATE = {
  key: 'billing_postalCode',
  required: true,
  validPostalCode: true,
};

export const INPUT_VALIDATION = [
  EMAIL_VALIDATE,
  PASSWORD_VALIDATE,
  FIRST_NAME_VALIDATE,
  LAST_NAME_VALIDATE,
  BIRTHDAY_VALIDATE,
  SHIPPING_ADDRESS_STREET_VALIDATE,
  SHIPPING_ADDRESS_CITY_VALIDATE,
  SHIPPING_ADDRESS_COUNTRY_VALIDATE,
  SHIPPING_ADDRESS_POSTAL_CODE_VALIDATE,
  BILLING_ADDRESS_STREET_VALIDATE,
  BILLING_ADDRESS_CITY_VALIDATE,
  BILLING_ADDRESS_COUNTRY_VALIDATE,
  BILLING_ADDRESS_POSTAL_CODE_VALIDATE,
];
