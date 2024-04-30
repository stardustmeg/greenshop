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
    text: 'Enter your email',
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
    text: 'Enter your password',
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
