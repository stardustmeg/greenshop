const EMAIL_VALIDATE = {
  key: 'registration_email',
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

const PASSWORD_VALIDATE = {
  key: 'registration_password',
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

const FIRST_NAME_VALIDATE = {
  key: 'firstName',
  minLength: 1,
  notSpecialSymbols: {
    message: 'First name must contain only letters',
    pattern: /^[a-zA-Z]*$/,
  },
  notWhitespace: {
    message: 'First name must not contain white spaces',
    pattern: /^\S+$/,
  },
  required: true,
} as const;

const LAST_NAME_VALIDATE = {
  key: 'lastName',
  minLength: 1,
  notSpecialSymbols: {
    message: 'Last name must contain only letters',
    pattern: /^[a-zA-Z]*$/,
  },
  notWhitespace: {
    message: 'Last name must not contain white spaces',
    pattern: /^\S+$/,
  },
  required: true,
} as const;

const BIRTHDAY_VALIDATE = {
  key: 'birthDate',
  required: true,
  validBirthday: {
    maxAge: 120,
    message: 'Enter correct birthday (01.01.2000)',
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
    message: 'City must contain only letters',
    pattern: /^[a-zA-Z]*$/,
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
    message: 'City must contain only letters',
    pattern: /^[a-zA-Z]*$/,
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
