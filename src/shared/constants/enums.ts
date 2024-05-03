import type { State } from '../Store/reducer';

export const initialState: State = {
  currentUser: null,
  registerFormCountry: '',
};

export const INPUT_TYPES = {
  COLOR: 'color',
  DATE: 'date',
  EMAIL: 'email',
  NUMBER: 'number',
  PASSWORD: 'password',
  RANGE: 'range',
  SEARCH: 'search',
  TEXT: 'text',
} as const;

export const BUTTON_TYPES = {
  BUTTON: 'button',
  RESET: 'reset',
  SUBMIT: 'submit',
} as const;

export const IS_DISABLED = {
  DISABLED: true,
  ENABLED: false,
} as const;

export const MESSAGE_STATUS = {
  ERROR: 'error',
  SUCCESS: 'success',
} as const;

export type MessageStatusType = (typeof MESSAGE_STATUS)[keyof typeof MESSAGE_STATUS];

export const SERVER_MESSAGE = {
  INCORRECT_LOGIN: 'Incorrect login or password',
  INCORRECT_REGISTRATION: 'User with this email already exists, please check your email',
  SUCCESSFUL_LOGIN: 'Your login was successful',
  SUCCESSFUL_REGISTRATION: 'Your registration was successful',
} as const;

export const TAG_NAMES = {
  A: 'a',
  ADDRESS: 'address',
  ARTICLE: 'article',
  ASIDE: 'aside',
  AUDIO: 'audio',
  BLOCKQUOTE: 'blockquote',
  BUTTON: 'button',
  CANVAS: 'canvas',
  DETAILS: 'details',
  DIV: 'div',
  DIVIDER: 'hr',
  FOOTER: 'footer',
  FORM: 'form',
  H1: 'h1',
  H2: 'h2',
  H3: 'h3',
  H4: 'h4',
  H5: 'h5',
  H6: 'h6',
  HEADER: 'header',
  I: 'i',
  IMG: 'img',
  INPUT: 'input',
  LABEL: 'label',
  LI: 'li',
  MAIN: 'main',
  MAP: 'map',
  MARK: 'mark',
  NAV: 'nav',
  OL: 'ol',
  P: 'p',
  PRE: 'pre',
  SECTION: 'section',
  SELECT: 'select',
  SOURCE: 'source',
  SPAN: 'span',
  SUMMARY: 'summary',
  SVG: 'svg',
  TABLE: 'table',
  TBODY: 'tbody',
  TD: 'td',
  TEXTAREA: 'textarea',
  TFOOT: 'tfoot',
  TH: 'th',
  THEAD: 'thead',
  TR: 'tr',
  TRACK: 'track',
  UL: 'ul',
  VIDEO: 'video',
} as const;

export const EVENT_NAMES = {
  ANIMATIONEND: 'animationend',
  ANIMATIONITERATION: 'animationiteration',
  ANIMATIONSTART: 'animationstart',
  BEFOREUNLOAD: 'beforeunload',
  BLUR: 'blur',
  CHANGE: 'change',
  CLICK: 'click',
  CLOSE: 'close',
  CONTEXTMENU: 'contextmenu',
  DOM_CONTENT_LOADED: 'DOMContentLoaded',
  ERROR: 'error',
  FOCUS: 'focus',
  HASHCHANGE: 'hashchange',
  INPUT: 'input',
  KEYDOWN: 'keydown',
  KEYUP: 'keyup',
  LOAD: 'load',
  MESSAGE: 'message',
  MOUSEENTER: 'mouseenter',
  MOUSELEAVE: 'mouseleave',
  MOUSEWHEEL: 'mousewheel',
  OPEN: 'open',
  POPSTATE: 'popstate',
  RESIZE: 'resize',
  SCROLL: 'scroll',
  SUBMIT: 'submit',
  TRANSITIONEND: 'transitionend',
} as const;

export const PAGES_IDS = {
  DEFAULT_PAGE: '',
  LOGIN_PAGE: 'login',
  MAIN_PAGE: 'main',
  NOT_FOUND_PAGE: '404',
  REGISTRATION_PAGE: 'registration',
} as const;

export const MEDIATOR_EVENTS = {
  CHANGE_PAGE: 'changePage',
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
    message: 'Email must not contain whitespaces',
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
    message: 'Password must not contain whitespaces',
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

export const FORM_SUBMIT_BUTTON_TEXT = {
  LOGIN: 'Login',
  REGISTRATION: 'Register',
} as const;

export const SVG_DETAILS = {
  CLOSE_EYE: 'closeEye',
  LOGO: 'logo',
  OPEN_EYE: 'openEye',

  SVG_URL: 'http://www.w3.org/2000/svg',
} as const;

export const PAGE_LINK_TEXT = {
  LOGIN: 'Login',
  MAIN: 'Main',
  REGISTRATION: 'Register',
} as const;

export const PAGE_DESCRIPTION = {
  404: 'This is not the page you are looking for. Please go back to the main page.',
  LOGIN: 'Enter your email and password to login.',
  REGISTRATION: 'Enter your information to register.',
} as const;

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
    text: 'Email',
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
    text: 'Password',
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
    text: 'First name',
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
    text: 'Last name',
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
    text: 'Date of Birth',
  },
} as const;

export const REGISTRATION_FORM_STREET_FIELD_PARAMS = {
  inputParams: {
    autocomplete: 'off',
    id: 'address',
    placeholder: '595 Hornby St. 5th Floor',
    type: 'text',
  },
  labelParams: {
    for: 'address',
    text: 'Address',
  },
} as const;

export const REGISTRATION_FORM_CITY_FIELD_PARAMS = {
  inputParams: {
    autocomplete: 'off',
    id: 'city',
    placeholder: 'Vancouver',
    type: 'text',
  },
  labelParams: {
    for: 'city',
    text: 'City',
  },
} as const;

export const REGISTRATION_FORM_COUNTRY_FIELD_PARAMS = {
  inputParams: {
    autocomplete: 'off',
    id: 'country',
    placeholder: 'Canada',
    type: 'text',
  },
  labelParams: {
    for: 'country',
    text: 'Country',
  },
} as const;

export const REGISTRATION_FORM_POSTAL_CODE_FIELD_PARAMS = {
  inputParams: {
    autocomplete: 'off',
    id: 'postalCode',
    placeholder: 'A1B 2C3',
    type: 'text',
  },
  labelParams: {
    for: 'postalCode',
    text: 'Postal code',
  },
} as const;

export const REGISTRATION_FORM_INPUT_FIELD_PARAMS = [
  REGISTRATION_FORM_EMAIL_FIELD_PARAMS,
  REGISTRATION_FORM_PASSWORD_FIELD_PARAMS,
  REGISTRATION_FORM_FIRST_NAME_FIELD_PARAMS,
  REGISTRATION_FORM_LAST_NAME_FIELD_PARAMS,
  REGISTRATION_FORM_BIRTHDAY_FIELD_PARAMS,
  REGISTRATION_FORM_STREET_FIELD_PARAMS,
  REGISTRATION_FORM_CITY_FIELD_PARAMS,
  REGISTRATION_FORM_COUNTRY_FIELD_PARAMS,
  REGISTRATION_FORM_POSTAL_CODE_FIELD_PARAMS,
];

const REGISTRATION_FORM_EMAIL_FIELD_VALIDATE_PARAMS = {
  key: 'registration_email',
  notWhitespace: {
    message: 'Email must not contain whitespaces',
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
    message: 'Password must not contain whitespaces',
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
    message: 'First name must not contain whitespaces',
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
    message: 'Last name must not contain whitespaces',
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

export const REGISTRATION_FORM_STREET_FIELD_VALIDATE_PARAMS = {
  key: 'address',
  minLength: 1,
  required: true,
};

export const REGISTRATION_FORM_CITY_FIELD_VALIDATE_PARAMS = {
  key: 'city',
  minLength: 1,
  notSpecialSymbols: {
    message: 'City must contain only letters',
    pattern: /^[a-zA-Z]*$/,
  },

  required: true,
};

export const REGISTRATION_FORM_COUNTRY_FIELD_VALIDATE_PARAMS = {
  key: 'country',
  required: true,
  validCountry: true,
};

export const REGISTRATION_FORM_POSTAL_CODE_FIELD_VALIDATE_PARAMS = {
  key: 'postalCode',
  required: true,
  validPostalCode: true,
};

export const REGISTRATION_FORM_INPUT_FIELD_VALIDATION_PARAMS = [
  REGISTRATION_FORM_EMAIL_FIELD_VALIDATE_PARAMS,
  REGISTRATION_FORM_PASSWORD_FIELD_VALIDATE_PARAMS,
  REGISTRATION_FORM_FIRST_NAME_FIELD_VALIDATE_PARAMS,
  REGISTRATION_FORM_LAST_NAME_FIELD_VALIDATE_PARAMS,
  REGISTRATION_FORM_BIRTHDAY_FIELD_VALIDATE_PARAMS,
  REGISTRATION_FORM_STREET_FIELD_VALIDATE_PARAMS,
  REGISTRATION_FORM_CITY_FIELD_VALIDATE_PARAMS,
  REGISTRATION_FORM_COUNTRY_FIELD_VALIDATE_PARAMS,
  REGISTRATION_FORM_POSTAL_CODE_FIELD_VALIDATE_PARAMS,
];

export const PASSWORD_TEXT = {
  HIDDEN: '********',
  SHOWN: 'Password123',
};

export const COUNTRIES: Record<string, string> = {
  Afghanistan: 'AF',
  Albania: 'AL',
  Algeria: 'DZ',
  Andorra: 'AD',
  Angola: 'AO',
  'Antigua and Barbuda': 'AG',
  Argentina: 'AR',
  Armenia: 'AM',
  Australia: 'AU',
  Austria: 'AT',
  Azerbaijan: 'AZ',
  Bahamas: 'BS',
  Bahrain: 'BH',
  Bangladesh: 'BD',
  Barbados: 'BB',
  Belarus: 'BY',
  Belgium: 'BE',
  Belize: 'BZ',
  Benin: 'BJ',
  Bhutan: 'BT',
  Bolivia: 'BO',
  'Bosnia and Herzegovina': 'BA',
  Botswana: 'BW',
  Brazil: 'BR',
  Brunei: 'BN',
  Bulgaria: 'BG',
  'Burkina Faso': 'BF',
  Burundi: 'BI',
  'Cabo Verde': 'CV',
  Cambodia: 'KH',
  Cameroon: 'CM',
  Canada: 'CA',
  'Central African Republic': 'CF',
  Chad: 'TD',
  Chile: 'CL',
  China: 'CN',
  'Christmas Island': 'CX',
  'Cocos (Keeling) Islands': 'CC',
  Colombia: 'CO',
  Comoros: 'KM',
  'Congo, Democratic Republic of the': 'CD',
  'Congo, Republic of the': 'CG',
  'Costa Rica': 'CR',
  Croatia: 'HR',
  Cuba: 'CU',
  Curaçao: 'CW',
  Cyprus: 'CY',
  'Czech Republic': 'CZ',
  "Côte d'Ivoire": 'CI',
  Denmark: 'DK',
  Djibouti: 'DJ',
  Dominica: 'DM',
  'Dominican Republic': 'DO',
  Ecuador: 'EC',
  Egypt: 'EG',
  'El Salvador': 'SV',
  'Equatorial Guinea': 'GQ',
  Eritrea: 'ER',
  Estonia: 'EE',
  Eswatini: 'SZ',
  Ethiopia: 'ET',
  Fiji: 'FJ',
  Finland: 'FI',
  France: 'FR',
  Gabon: 'GA',
  Gambia: 'GM',
  Georgia: 'GE',
  Germany: 'DE',
  Ghana: 'GH',
  Greece: 'GR',
  Grenada: 'GD',
  Guatemala: 'GT',
  Guinea: 'GN',
  'Guinea-Bissau': 'GW',
  Guyana: 'GY',
  Haiti: 'HT',
  Honduras: 'HN',
  Hungary: 'HU',
  Iceland: 'IS',
  India: 'IN',
  Indonesia: 'ID',
  Iran: 'IR',
  Iraq: 'IQ',
  Ireland: 'IE',
  Israel: 'IL',
  Italy: 'IT',
  Jamaica: 'JM',
  Japan: 'JP',
  Jordan: 'JO',
  Kazakhstan: 'KZ',
  Kenya: 'KE',
  Kiribati: 'KI',
  'Korea, North': 'KP',
  'Korea, South': 'KR',
  Kosovo: 'XK',
  Kuwait: 'KW',
  Kyrgyzstan: 'KG',
  Laos: 'LA',
  Latvia: 'LV',
  Lebanon: 'LB',
  Lesotho: 'LS',
  Liberia: 'LR',
  Libya: 'LY',
  Liechtenstein: 'LI',
  Lithuania: 'LT',
  Luxembourg: 'LU',
  Madagascar: 'MG',
  Malawi: 'MW',
  Malaysia: 'MY',
  Maldives: 'MV',
  Mali: 'ML',
  Malta: 'MT',
  'Marshall Islands': 'MH',
  Mauritania: 'MR',
  Mauritius: 'MU',
  Mexico: 'MX',
  Micronesia: 'FM',
  Moldova: 'MD',
  Monaco: 'MC',
  Mongolia: 'MN',
  Montenegro: 'ME',
  Morocco: 'MA',
  Mozambique: 'MZ',
  Myanmar: 'MM',
  Namibia: 'NA',
  Nauru: 'NR',
  Nepal: 'NP',
  Netherlands: 'NL',
  'New Zealand': 'NZ',
  Nicaragua: 'NI',
  Niger: 'NE',
  Nigeria: 'NG',
  'North Macedonia': 'MK',
  Norway: 'NO',
  Oman: 'OM',
  Pakistan: 'PK',
  Palau: 'PW',
  Palestine: 'PS',
  Panama: 'PA',
  'Papua New Guinea': 'PG',
  Paraguay: 'PY',
  Peru: 'PE',
  Philippines: 'PH',
  Poland: 'PL',
  Portugal: 'PT',
  Qatar: 'QA',
  Romania: 'RO',
  Russia: 'RU',
  Rwanda: 'RW',
  'Saint Kitts and Nevis': 'KN',
  'Saint Lucia': 'LC',
  'Saint Vincent and the Grenadines': 'VC',
  Samoa: 'WS',
  'San Marino': 'SM',
  'Sao Tome and Principe': 'ST',
  'Saudi Arabia': 'SA',
  Senegal: 'SN',
  Serbia: 'RS',
  Seychelles: 'SC',
  'Sierra Leone': 'SL',
  Singapore: 'SG',
  Slovakia: 'SK',
  Slovenia: 'SI',
  'Solomon Islands': 'SB',
  Somalia: 'SO',
  'South Africa': 'ZA',
  'South Sudan': 'SS',
  Spain: 'ES',
  'Sri Lanka': 'LK',
  Sudan: 'SD',
  Suriname: 'SR',
  Sweden: 'SE',
  Switzerland: 'CH',
  Syria: 'SY',
  Taiwan: 'TW',
  Tajikistan: 'TJ',
  Tanzania: 'TZ',
  Thailand: 'TH',
  'Timor-Leste': 'TL',
  Togo: 'TG',
  Tonga: 'TO',
  'Trinidad and Tobago': 'TT',
  Tunisia: 'TN',
  Turkey: 'TR',
  Turkmenistan: 'TM',
  Tuvalu: 'TV',
  Uganda: 'UG',
  Ukraine: 'UA',
  'United Arab Emirates': 'AE',
  'United Kingdom': 'GB',
  'United States': 'US',
  Uruguay: 'UY',
  Uzbekistan: 'UZ',
  Vanuatu: 'VU',
  'Vatican City': 'VA',
  Venezuela: 'VE',
  Vietnam: 'VN',
  Yemen: 'YE',
  Zambia: 'ZM',
  Zimbabwe: 'ZW',
} as const;

const SERVER_MESSAGE_ANIMATE_PARAMS = [
  { transform: 'translateX(110%)' },
  { transform: 'translateX(-10%)' },
  { transform: 'translateX(-10%)' },
  { opacity: 1, transform: 'translateX(-10%)' },
  { opacity: 0, transform: 'translate(-10%, -110%)' },
];

export const SERVER_MESSAGE_ANIMATE_DETAILS = {
  duration: 5500,
  easing: 'cubic-bezier(0, 0.2, 0.58, 0.7)',
  params: SERVER_MESSAGE_ANIMATE_PARAMS,
};
