import { USER_ADDRESS } from '../forms.ts';

export const EMAIL = {
  inputParams: {
    autocomplete: 'off',
    placeholder: 'user@example.com',
    type: 'text',
  },
  labelParams: {
    text: {
      en: 'Email',
      ru: 'Электронная почта',
    },
  },
} as const;

export const EMAIL_NOT_LABEL_TEXT = {
  inputParams: {
    autocomplete: 'off',
    placeholder: 'user@example.com',
    type: 'text',
  },
  labelParams: {
    text: {
      en: '',
      ru: '',
    },
  },
} as const;

export const PASSWORD = {
  inputParams: {
    autocomplete: 'off',
    placeholder: '***********',
    type: 'password',
  },
  labelParams: {
    text: {
      en: 'Password',
      ru: 'Пароль',
    },
  },
} as const;

export const OLD_PASSWORD = {
  inputParams: {
    autocomplete: 'off',
    placeholder: '***********',
    type: 'password',
  },
  labelParams: {
    text: {
      en: 'Current Password',
      ru: 'Текущий пароль',
    },
  },
} as const;

export const NEW_PASSWORD = {
  inputParams: {
    autocomplete: 'off',
    placeholder: '***********',
    type: 'password',
  },
  labelParams: {
    text: {
      en: 'New Password',
      ru: 'Новый пароль',
    },
  },
} as const;

export const FIRST_NAME = {
  inputParams: {
    autocomplete: 'off',
    placeholder: 'John',
    type: 'text',
  },
  labelParams: {
    text: {
      en: 'First name',
      ru: 'Имя',
    },
  },
} as const;

export const LAST_NAME = {
  inputParams: {
    autocomplete: 'off',
    placeholder: 'Doe',
    type: 'text',
  },
  labelParams: {
    text: {
      en: 'Last name',
      ru: 'Фамилия',
    },
  },
} as const;

export const BIRTHDAY = {
  inputParams: {
    autocomplete: 'off',
    lang: 'en',
    placeholder: '01.01.2000',
    type: 'date',
  },
  labelParams: {
    text: {
      en: 'Date of birth',
      ru: 'Дата рождения',
    },
  },
} as const;

export const SHIPPING_ADDRESS_STREET = {
  inputParams: {
    autocomplete: 'off',
    placeholder: '595 Hornby St. 5th Floor',
    type: 'text',
  },
  labelParams: {
    text: {
      en: 'Address',
      ru: 'Адрес',
    },
  },
} as const;

export const SHIPPING_ADDRESS_CITY = {
  inputParams: {
    autocomplete: 'off',
    placeholder: 'Vancouver',
    type: 'text',
  },
  labelParams: {
    text: {
      en: 'City',
      ru: 'Город',
    },
  },
} as const;

export const SHIPPING_ADDRESS_COUNTRY = {
  inputParams: {
    autocomplete: 'off',
    data: {
      addressType: USER_ADDRESS.SHIPPING,
    },
    placeholder: 'Canada',
    type: 'text',
  },
  labelParams: {
    text: {
      en: 'Country',
      ru: 'Страна',
    },
  },
} as const;

export const SHIPPING_ADDRESS_POSTAL_CODE = {
  inputParams: {
    autocomplete: 'off',
    data: {
      addressType: USER_ADDRESS.SHIPPING,
    },
    placeholder: 'A1B 2C3',
    type: 'text',
  },
  labelParams: {
    text: {
      en: 'Postal code',
      ru: 'Почтовый индекс',
    },
  },
} as const;

export const BILLING_ADDRESS_STREET = {
  inputParams: {
    autocomplete: 'off',
    placeholder: '595 Hornby St. 5th Floor',
    type: 'text',
  },
  labelParams: {
    text: {
      en: 'Address',
      ru: 'Адрес',
    },
  },
} as const;

export const BILLING_ADDRESS_CITY = {
  inputParams: {
    autocomplete: 'off',
    placeholder: 'Vancouver',
    type: 'text',
  },
  labelParams: {
    text: {
      en: 'City',
      ru: 'Город',
    },
  },
} as const;

export const BILLING_ADDRESS_COUNTRY = {
  inputParams: {
    autocomplete: 'off',
    data: {
      addressType: USER_ADDRESS.BILLING,
    },
    placeholder: 'Canada',
    type: 'text',
  },
  labelParams: {
    text: {
      en: 'Country',
      ru: 'Страна',
    },
  },
} as const;

export const BILLING_ADDRESS_POSTAL_CODE = {
  inputParams: {
    autocomplete: 'off',
    data: {
      addressType: USER_ADDRESS.BILLING,
    },
    placeholder: 'A1B 2C3',
    type: 'text',
  },
  labelParams: {
    text: {
      en: 'Postal code',
      ru: 'Почтовый индекс',
    },
  },
} as const;

export const CHECKBOX = {
  AUTOCOMPLETE: 'off',
  BILLING_ID: 'billingDefault',
  SHIPPING_ID: 'shippingDefault',
  SINGLE_ID: 'singleDefault',
} as const;
