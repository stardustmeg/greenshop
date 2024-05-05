export const INPUT_TYPE = {
  CHECK_BOX: 'checkbox',
  COLOR: 'color',
  DATE: 'date',
  EMAIL: 'email',
  NUMBER: 'number',
  PASSWORD: 'password',
  RANGE: 'range',
  SEARCH: 'search',
  TEXT: 'text',
} as const;

export const FORM_TEXT = {
  DEFAULT_ADDRESS: 'Use as default address',
  SINGLE_ADDRESS: 'Use as billing address',
};

export const USER_COUNTRY_ADDRESS = {
  BILLING: 'billingCountry',
  SHIPPING: 'shippingCountry',
} as const;

export const USER_ADDRESS_TYPE = {
  BILLING: 'billingAddress',
  SHIPPING: 'shippingAddress',
} as const;

export const USER_POSTAL_CODE = {
  BILLING_POSTAL_CODE: 'billing_PostalCode',
  POSTAL_CODE: 'postalCode',
} as const;

export const LOGIN_FORM_KEY = 'login_';

export const LOGIN_FORM_EMAIL_FIELD_PARAMS = {
  inputParams: {
    autocomplete: 'off',
    id: `${LOGIN_FORM_KEY}email`,
    placeholder: 'user@example.com',
    type: 'text',
  },
  labelParams: {
    for: `${LOGIN_FORM_KEY}email`,
    text: '',
  },
} as const;

export const LOGIN_FORM_PASSWORD_FIELD_PARAMS = {
  inputParams: {
    autocomplete: 'off',
    id: `${LOGIN_FORM_KEY}password`,
    placeholder: '***********',
    type: 'password',
  },
  labelParams: {
    for: `${LOGIN_FORM_KEY}password`,
    text: '',
  },
} as const;

export const LOGIN_FORM_INPUT_FIELD_PARAMS = [LOGIN_FORM_EMAIL_FIELD_PARAMS, LOGIN_FORM_PASSWORD_FIELD_PARAMS];

const LOGIN_FORM_EMAIL_FIELD_VALIDATE_PARAMS = {
  key: `${LOGIN_FORM_KEY}email`,
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

const LOGIN_FORM_PASSWORD_FIELD_VALIDATE_PARAMS = {
  key: `${LOGIN_FORM_KEY}password`,
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

export const LOGIN_FORM_INPUT_FIELD_VALIDATION_PARAMS = [
  LOGIN_FORM_EMAIL_FIELD_VALIDATE_PARAMS,
  LOGIN_FORM_PASSWORD_FIELD_VALIDATE_PARAMS,
];

export const REGISTRATION_FORM_KEY = 'registration_';

export const REGISTRATION_FORM_EMAIL_FIELD_PARAMS = {
  inputParams: {
    autocomplete: 'off',
    id: 'registration_email',
    placeholder: 'user@example.com',
    type: 'text',
  },
  labelParams: {
    for: 'registration_email',
    text: 'Email *',
  },
} as const;

export const REGISTRATION_FORM_PASSWORD_FIELD_PARAMS = {
  inputParams: {
    autocomplete: 'off',
    id: 'registration_password',
    placeholder: '***********',
    type: 'password',
  },
  labelParams: {
    for: 'registration_password',
    text: 'Password *',
  },
} as const;

export const REGISTRATION_FORM_FIRST_NAME_FIELD_PARAMS = {
  inputParams: {
    autocomplete: 'off',
    id: 'firstName',
    placeholder: 'John',
    type: 'text',
  },
  labelParams: {
    for: 'firstName',
    text: 'First name *',
  },
} as const;

export const REGISTRATION_FORM_LAST_NAME_FIELD_PARAMS = {
  inputParams: {
    autocomplete: 'off',
    id: 'lastName',
    placeholder: 'Doe',
    type: 'text',
  },
  labelParams: {
    for: 'lastName',
    text: 'Last name *',
  },
} as const;

export const REGISTRATION_FORM_BIRTHDAY_FIELD_PARAMS = {
  inputParams: {
    autocomplete: 'off',
    id: 'birthDate',
    lang: 'en',
    placeholder: '01.01.2000',
    type: 'date',
  },
  labelParams: {
    for: 'birthDate',
    text: 'Date of Birth *',
  },
} as const;

export const REGISTRATION_FORM_SHIPPING_ADDRESS_STREET_FIELD_PARAMS = {
  inputParams: {
    autocomplete: 'off',
    id: 'address',
    placeholder: '595 Hornby St. 5th Floor',
    type: 'text',
  },
  labelParams: {
    for: 'address',
    text: 'Address *',
  },
} as const;

export const REGISTRATION_FORM_SHIPPING_ADDRESS_CITY_FIELD_PARAMS = {
  inputParams: {
    autocomplete: 'off',
    id: 'city',
    placeholder: 'Vancouver',
    type: 'text',
  },
  labelParams: {
    for: 'city',
    text: 'City *',
  },
} as const;

export const REGISTRATION_FORM_SHIPPING_ADDRESS_COUNTRY_FIELD_PARAMS = {
  inputParams: {
    autocomplete: 'off',
    id: 'shippingCountry',
    placeholder: 'Canada',
    type: 'text',
  },
  labelParams: {
    for: 'shippingCountry',
    text: 'Country *',
  },
} as const;

export const REGISTRATION_FORM_SHIPPING_ADDRESS_POSTAL_CODE_FIELD_PARAMS = {
  inputParams: {
    autocomplete: 'off',
    id: 'postalCode',
    placeholder: 'A1B 2C3',
    type: 'text',
  },
  labelParams: {
    for: 'postalCode',
    text: 'Postal code *',
  },
} as const;

export const REGISTRATION_FORM_BILLING_ADDRESS_STREET_FIELD_PARAMS = {
  inputParams: {
    autocomplete: 'off',
    id: 'billing_address',
    placeholder: '595 Hornby St. 5th Floor',
    type: 'text',
  },
  labelParams: {
    for: 'billing_address',
    text: 'Address *',
  },
} as const;

export const REGISTRATION_FORM_BILLING_ADDRESS_CITY_FIELD_PARAMS = {
  inputParams: {
    autocomplete: 'off',
    id: 'billing_city',
    placeholder: 'Vancouver',
    type: 'text',
  },
  labelParams: {
    for: 'billing_city',
    text: 'City *',
  },
} as const;

export const REGISTRATION_FORM_BILLING_ADDRESS_COUNTRY_FIELD_PARAMS = {
  inputParams: {
    autocomplete: 'off',
    id: 'billing_country',
    placeholder: 'Canada',
    type: 'text',
  },
  labelParams: {
    for: 'billing_country',
    text: 'Country *',
  },
} as const;

export const REGISTRATION_FORM_BILLING_ADDRESS_POSTAL_CODE_FIELD_PARAMS = {
  inputParams: {
    autocomplete: 'off',
    id: 'billing_postalCode',
    placeholder: 'A1B 2C3',
    type: 'text',
  },
  labelParams: {
    for: 'billing_postalCode',
    text: 'Postal code *',
  },
} as const;

export const REGISTRATION_FORM_INPUT_FIELD_PARAMS = [
  REGISTRATION_FORM_EMAIL_FIELD_PARAMS,
  REGISTRATION_FORM_PASSWORD_FIELD_PARAMS,
  REGISTRATION_FORM_FIRST_NAME_FIELD_PARAMS,
  REGISTRATION_FORM_LAST_NAME_FIELD_PARAMS,
  REGISTRATION_FORM_BIRTHDAY_FIELD_PARAMS,
  REGISTRATION_FORM_SHIPPING_ADDRESS_STREET_FIELD_PARAMS,
  REGISTRATION_FORM_SHIPPING_ADDRESS_CITY_FIELD_PARAMS,
  REGISTRATION_FORM_SHIPPING_ADDRESS_COUNTRY_FIELD_PARAMS,
  REGISTRATION_FORM_SHIPPING_ADDRESS_POSTAL_CODE_FIELD_PARAMS,
  REGISTRATION_FORM_BILLING_ADDRESS_STREET_FIELD_PARAMS,
  REGISTRATION_FORM_BILLING_ADDRESS_CITY_FIELD_PARAMS,
  REGISTRATION_FORM_BILLING_ADDRESS_COUNTRY_FIELD_PARAMS,
  REGISTRATION_FORM_BILLING_ADDRESS_POSTAL_CODE_FIELD_PARAMS,
];

const REGISTRATION_FORM_EMAIL_FIELD_VALIDATE_PARAMS = {
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

const REGISTRATION_FORM_PASSWORD_FIELD_VALIDATE_PARAMS = {
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

const REGISTRATION_FORM_FIRST_NAME_FIELD_VALIDATE_PARAMS = {
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

const REGISTRATION_FORM_LAST_NAME_FIELD_VALIDATE_PARAMS = {
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

const REGISTRATION_FORM_BIRTHDAY_FIELD_VALIDATE_PARAMS = {
  key: 'birthDate',
  required: true,
  validBirthday: {
    maxAge: 120,
    message: 'Enter correct birthday (01.01.2000)',
    minAge: 18,
    pattern: /^\d{4}-\d{2}-\d{2}$/,
  },
} as const;

export const REGISTRATION_FORM_SHIPPING_ADDRESS_STREET_FIELD_VALIDATE_PARAMS = {
  key: 'address',
  minLength: 1,
  required: true,
};

export const REGISTRATION_FORM_SHIPPING_ADDRESS_CITY_FIELD_VALIDATE_PARAMS = {
  key: 'city',
  minLength: 1,
  notSpecialSymbols: {
    message: 'City must contain only letters',
    pattern: /^[a-zA-Z]*$/,
  },

  required: true,
};

export const REGISTRATION_FORM_SHIPPING_ADDRESS_COUNTRY_FIELD_VALIDATE_PARAMS = {
  key: 'shippingCountry',
  required: true,
  validCountry: true,
};

export const REGISTRATION_FORM_SHIPPING_ADDRESS_POSTAL_CODE_FIELD_VALIDATE_PARAMS = {
  key: 'postalCode',
  required: true,
  validPostalCode: true,
};

export const REGISTRATION_FORM_BILLING_ADDRESS_STREET_FIELD_VALIDATE_PARAMS = {
  key: 'billing_address',
  minLength: 1,
  required: true,
};

export const REGISTRATION_FORM_BILLING_ADDRESS_CITY_FIELD_VALIDATE_PARAMS = {
  key: 'billing_city',
  minLength: 1,
  notSpecialSymbols: {
    message: 'City must contain only letters',
    pattern: /^[a-zA-Z]*$/,
  },
  required: true,
};

export const REGISTRATION_FORM_BILLING_ADDRESS_COUNTRY_FIELD_VALIDATE_PARAMS = {
  key: 'billing_country',
  required: true,
  validCountry: true,
};

export const REGISTRATION_FORM_BILLING_ADDRESS_POSTAL_CODE_FIELD_VALIDATE_PARAMS = {
  key: 'billing_postalCode',
  required: true,
  validPostalCode: true,
};

export const REGISTRATION_FORM_INPUT_FIELD_VALIDATION_PARAMS = [
  REGISTRATION_FORM_EMAIL_FIELD_VALIDATE_PARAMS,
  REGISTRATION_FORM_PASSWORD_FIELD_VALIDATE_PARAMS,
  REGISTRATION_FORM_FIRST_NAME_FIELD_VALIDATE_PARAMS,
  REGISTRATION_FORM_LAST_NAME_FIELD_VALIDATE_PARAMS,
  REGISTRATION_FORM_BIRTHDAY_FIELD_VALIDATE_PARAMS,
  REGISTRATION_FORM_SHIPPING_ADDRESS_STREET_FIELD_VALIDATE_PARAMS,
  REGISTRATION_FORM_SHIPPING_ADDRESS_CITY_FIELD_VALIDATE_PARAMS,
  REGISTRATION_FORM_SHIPPING_ADDRESS_COUNTRY_FIELD_VALIDATE_PARAMS,
  REGISTRATION_FORM_SHIPPING_ADDRESS_POSTAL_CODE_FIELD_VALIDATE_PARAMS,
  REGISTRATION_FORM_BILLING_ADDRESS_STREET_FIELD_VALIDATE_PARAMS,
  REGISTRATION_FORM_BILLING_ADDRESS_CITY_FIELD_VALIDATE_PARAMS,
  REGISTRATION_FORM_BILLING_ADDRESS_COUNTRY_FIELD_VALIDATE_PARAMS,
  REGISTRATION_FORM_BILLING_ADDRESS_POSTAL_CODE_FIELD_VALIDATE_PARAMS,
];

export const REGISTRATION_FORM_TITLE_TEXT = {
  BILLING_ADDRESS: 'Billing address',
  CREDENTIALS: 'Credentials',
  PERSONAL: 'Personal',
  SHIPPING_ADDRESS: 'Shipping address',
} as const;

export const PASSWORD_TEXT = {
  HIDDEN: '********',
  SHOWN: 'Password123',
};

export const CHECKBOX_PARAMS = {
  AUTOCOMPLETE: 'off',
  BILLING_ID: 'billingDefault',
  SHIPPING_ID: 'shippingDefault',
  SINGLE_ID: 'singleDefault',
} as const;
