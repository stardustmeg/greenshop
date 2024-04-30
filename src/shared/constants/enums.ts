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

export const LOGIN_FORM_EMAIL_FIELD_PARAMS = {
  inputParams: {
    autocomplete: 'off',
    id: 'email',
    placeholder: 'user@example.com',
    type: 'text',
  },
  labelParams: {
    for: 'email',
    text: '',
  },
} as const;

export const LOGIN_FORM_PASSWORD_FIELD_PARAMS = {
  inputParams: {
    autocomplete: 'off',
    id: 'password',
    placeholder: '***********',
    type: 'password',
  },
  labelParams: {
    for: 'password',
    text: '',
  },
} as const;

export const LOGIN_FORM_INPUT_FIELD_PARAMS = [LOGIN_FORM_EMAIL_FIELD_PARAMS, LOGIN_FORM_PASSWORD_FIELD_PARAMS];

const LOGIN_FORM_EMAIL_FIELD_VALIDATE_PARAMS = {
  key: 'email',
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
  key: 'password',
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
  OPEN_EYE: 'openEye',
  SVG_URL: 'http://www.w3.org/2000/svg',
} as const;

export const PAGE_LINK_TEXT = {
  LOGIN: 'Login',
  MAIN: 'Main',
  REGISTRATION: 'Register',
} as const;

export const PAGE_DESCRIPTION = {
  LOGIN: 'Enter your email and password to login.',
  REGISTRATION: 'Enter your email and password to register.',
} as const;

export const REGISTRATION_FORM_EMAIL_FIELD_PARAMS = {
  inputParams: {
    autocomplete: 'off',
    id: 'email',
    placeholder: 'user@example.com',
    type: 'text',
  },
  labelParams: {
    for: 'email',
    text: '',
  },
} as const;

export const REGISTRATION_FORM_PASSWORD_FIELD_PARAMS = {
  inputParams: {
    autocomplete: 'off',
    id: 'password',
    placeholder: '***********',
    type: 'password',
  },
  labelParams: {
    for: 'password',
    text: '',
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
    text: '',
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
    text: '',
  },
} as const;

export const REGISTRATION_FORM_BIRTHDAY_FIELD_PARAMS = {
  inputParams: {
    autocomplete: 'off',
    id: 'birthday',
    lang: 'en',
    placeholder: '01.01.2000',
    type: 'date',
  },
  labelParams: {
    for: 'birthday',
    text: '',
  },
} as const;

export const REGISTRATION_FORM_STREET_FIELD_PARAMS = {
  inputParams: {
    autocomplete: 'off',
    id: 'street',
    placeholder: 'Street',
    type: 'text',
  },
  labelParams: {
    for: 'street',
    text: '',
  },
};

export const REGISTRATION_FORM_CITY_FIELD_PARAMS = {
  inputParams: {
    autocomplete: 'off',
    id: 'city',
    placeholder: 'City',
    type: 'text',
  },
  labelParams: {
    for: 'city',
    text: '',
  },
};

export const REGISTRATION_FORM_INPUT_FIELD_PARAMS = [
  REGISTRATION_FORM_EMAIL_FIELD_PARAMS,
  REGISTRATION_FORM_PASSWORD_FIELD_PARAMS,
  REGISTRATION_FORM_FIRST_NAME_FIELD_PARAMS,
  REGISTRATION_FORM_LAST_NAME_FIELD_PARAMS,
  REGISTRATION_FORM_BIRTHDAY_FIELD_PARAMS,
  REGISTRATION_FORM_STREET_FIELD_PARAMS,
  REGISTRATION_FORM_CITY_FIELD_PARAMS,
];

const REGISTRATION_FORM_EMAIL_FIELD_VALIDATE_PARAMS = {
  key: 'email',
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
  key: 'password',
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
  key: 'birthday',
  required: true,
  validBirthday: {
    maxAge: 120,
    message: 'Enter correct birthday (01.01.2000)',
    minAge: 18,
    pattern: /^\d{4}-\d{2}-\d{2}$/,
  },
} as const;

export const REGISTRATION_FORM_STREET_FIELD_VALIDATE_PARAMS = {
  key: 'street',
  minLength: 1,
  notWhitespace: {
    message: 'Street must not contain whitespaces',
    pattern: /^\S.*\S$/,
  },
  required: true,
};

export const REGISTRATION_FORM_CITY_FIELD_VALIDATE_PARAMS = {
  key: 'city',
  minLength: 1,
  notSpecialSymbols: {
    message: 'City must contain only letters',
    pattern: /^[a-zA-Z]*$/,
  },
  notWhitespace: {
    message: 'City must not contain whitespaces',
    pattern: /^\S.*\S$/,
  },
  required: true,
};

export const REGISTRATION_FORM_INPUT_FIELD_VALIDATION_PARAMS = [
  REGISTRATION_FORM_EMAIL_FIELD_VALIDATE_PARAMS,
  REGISTRATION_FORM_PASSWORD_FIELD_VALIDATE_PARAMS,
  REGISTRATION_FORM_FIRST_NAME_FIELD_VALIDATE_PARAMS,
  REGISTRATION_FORM_LAST_NAME_FIELD_VALIDATE_PARAMS,
  REGISTRATION_FORM_BIRTHDAY_FIELD_VALIDATE_PARAMS,
  REGISTRATION_FORM_STREET_FIELD_VALIDATE_PARAMS,
  REGISTRATION_FORM_CITY_FIELD_VALIDATE_PARAMS,
];
