export const EMAIL = {
  inputParams: {
    autocomplete: 'off',
    id: 'registration_email',
    placeholder: 'user@example.com',
    type: 'text',
  },
  labelParams: {
    for: 'registration_email',
    text: {
      en: 'Email',
      ru: 'Электронная почта',
    },
  },
} as const;

export const PASSWORD = {
  inputParams: {
    autocomplete: 'off',
    id: 'registration_password',
    placeholder: '***********',
    type: 'password',
  },
  labelParams: {
    for: 'registration_password',
    text: {
      en: 'Password',
      ru: 'Пароль',
    },
  },
} as const;

export const FIRST_NAME = {
  inputParams: {
    autocomplete: 'off',
    id: 'firstName',
    placeholder: 'John',
    type: 'text',
  },
  labelParams: {
    for: 'firstName',
    text: {
      en: 'First name',
      ru: 'Имя',
    },
  },
} as const;

export const LAST_NAME = {
  inputParams: {
    autocomplete: 'off',
    id: 'lastName',
    placeholder: 'Doe',
    type: 'text',
  },
  labelParams: {
    for: 'lastName',
    text: {
      en: 'Last name',
      ru: 'Фамилия',
    },
  },
} as const;

export const BIRTHDAY = {
  inputParams: {
    autocomplete: 'off',
    id: 'birthDate',
    lang: 'en',
    placeholder: '01.01.2000',
    type: 'date',
  },
  labelParams: {
    for: 'birthDate',
    text: {
      en: 'Date of birth',
      ru: 'Дата рождения',
    },
  },
} as const;

export const SHIPPING_ADDRESS_STREET = {
  inputParams: {
    autocomplete: 'off',
    id: 'address',
    placeholder: '595 Hornby St. 5th Floor',
    type: 'text',
  },
  labelParams: {
    for: 'address',
    text: {
      en: 'Address',
      ru: 'Адрес',
    },
  },
} as const;

export const SHIPPING_ADDRESS_CITY = {
  inputParams: {
    autocomplete: 'off',
    id: 'city',
    placeholder: 'Vancouver',
    type: 'text',
  },
  labelParams: {
    for: 'city',
    text: {
      en: 'City',
      ru: 'Город',
    },
  },
} as const;

export const SHIPPING_ADDRESS_COUNTRY = {
  inputParams: {
    autocomplete: 'off',
    id: 'shippingCountry',
    placeholder: 'Canada',
    type: 'text',
  },
  labelParams: {
    for: 'shippingCountry',
    text: {
      en: 'Country',
      ru: 'Страна',
    },
  },
} as const;

export const SHIPPING_ADDRESS_POSTAL_CODE = {
  inputParams: {
    autocomplete: 'off',
    id: 'postalCode',
    placeholder: 'A1B 2C3',
    type: 'text',
  },
  labelParams: {
    for: 'postalCode',
    text: {
      en: 'Postal code',
      ru: 'Почтовый индекс',
    },
  },
} as const;

export const BILLING_ADDRESS_STREET = {
  inputParams: {
    autocomplete: 'off',
    id: 'billing_address',
    placeholder: '595 Hornby St. 5th Floor',
    type: 'text',
  },
  labelParams: {
    for: 'billing_address',
    text: {
      en: 'Address',
      ru: 'Адрес',
    },
  },
} as const;

export const BILLING_ADDRESS_CITY = {
  inputParams: {
    autocomplete: 'off',
    id: 'billing_city',
    placeholder: 'Vancouver',
    type: 'text',
  },
  labelParams: {
    for: 'billing_city',
    text: {
      en: 'City',
      ru: 'Город',
    },
  },
} as const;

export const BILLING_ADDRESS_COUNTRY = {
  inputParams: {
    autocomplete: 'off',
    id: 'billing_country',
    placeholder: 'Canada',
    type: 'text',
  },
  labelParams: {
    for: 'billing_country',
    text: {
      en: 'Country',
      ru: 'Страна',
    },
  },
} as const;

export const BILLING_ADDRESS_POSTAL_CODE = {
  inputParams: {
    autocomplete: 'off',
    id: 'billing_postalCode',
    placeholder: 'A1B 2C3',
    type: 'text',
  },
  labelParams: {
    for: 'billing_postalCode',
    text: {
      en: 'Postal code',
      ru: 'Почтовый индекс',
    },
  },
} as const;

export const INPUT = [
  EMAIL,
  PASSWORD,
  FIRST_NAME,
  LAST_NAME,
  BIRTHDAY,
  SHIPPING_ADDRESS_STREET,
  SHIPPING_ADDRESS_CITY,
  SHIPPING_ADDRESS_COUNTRY,
  SHIPPING_ADDRESS_POSTAL_CODE,
  BILLING_ADDRESS_STREET,
  BILLING_ADDRESS_CITY,
  BILLING_ADDRESS_COUNTRY,
  BILLING_ADDRESS_POSTAL_CODE,
];

export const CHECKBOX = {
  AUTOCOMPLETE: 'off',
  BILLING_ID: 'billingDefault',
  SHIPPING_ID: 'shippingDefault',
  SINGLE_ID: 'singleDefault',
} as const;
