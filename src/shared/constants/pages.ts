export const PAGE_LINK_TEXT = {
  en: {
    ABOUT: 'About us',
    CATALOG: 'Catalog',
    LOGIN: 'Login',
    MAIN: 'Main',
    REGISTRATION: 'Register',
  },
  ru: {
    ABOUT: 'О нас',
    CATALOG: 'Каталог',
    LOGIN: 'Вход',
    MAIN: 'Главная',
    REGISTRATION: 'Регистрация',
  },
} as const;

export const PAGE_LINK_TEXT_KEYS = {
  ABOUT: 'ABOUT',
  CATALOG: 'CATALOG',
  LOGIN: 'LOGIN',
  MAIN: 'MAIN',
  REGISTRATION: 'REGISTRATION',
} as const;

export const PAGE_DESCRIPTION = {
  en: {
    404: 'This is not the page you are looking for. Please go back to the main page.',
    GREETING: 'Hi, ',
    LOGIN: 'Enter your email and password to login.',
    REGISTRATION: 'Enter your information to register.',
  },
  ru: {
    404: 'Это не та страница, которую вы ищете. Пожалуйста, вернитесь на главную страницу.',
    GREETING: 'Привет, ',
    LOGIN: 'Введите свой адрес электронной почты и пароль для входа.',
    REGISTRATION: 'Введите свои данные для регистрации.',
  },
} as const;

export const PAGE_DESCRIPTION_KEYS = {
  404: '404',
  GREETING: 'GREETING',
  LOGIN: 'LOGIN',
  REGISTRATION: 'REGISTRATION',
} as const;

export type PageDescriptionKeysType = (typeof PAGE_DESCRIPTION_KEYS)[keyof typeof PAGE_DESCRIPTION_KEYS];

export const PAGE_ANSWER = {
  en: {
    LOGIN: `Don't have an account yet?`,
    REGISTRATION: `Already have an account?`,
  },
  ru: {
    LOGIN: `Ещё нет аккаунта?`,
    REGISTRATION: `Уже есть аккаунт?`,
  },
} as const;

export const PAGE_ANSWER_KEYS = {
  LOGIN: 'LOGIN',
  REGISTRATION: 'REGISTRATION',
} as const;

export const PAGE_ID = {
  ABOUT_US_PAGE: 'about',
  CART_PAGE: 'cart',
  CATALOG_PAGE: 'catalog',
  DEFAULT_PAGE: '',
  ITEM_PAGE: 'item',
  LOGIN_PAGE: 'login',
  MAIN_PAGE: 'main',
  NOT_FOUND_PAGE: '404',
  REGISTRATION_PAGE: 'register',
  USER_PROFILE_PAGE: 'profile',
} as const;

export const USER_INFO_TEXT = {
  en: {
    DATE_OF_BIRTH: 'Date of Birth: ',
    EMAIL: 'Email: ',
    LAST_NAME: 'Last Name: ',
    NAME: 'First Name: ',
  },
  ru: {
    DATE_OF_BIRTH: 'Дата рождения: ',
    EMAIL: 'Электронная почта: ',
    LAST_NAME: 'Фамилия: ',
    NAME: 'Имя: ',
  },
} as const;

export const USER_INFO_TEXT_KEYS = {
  DATE_OF_BIRTH: 'DATE_OF_BIRTH',
  EMAIL: 'EMAIL',
  LAST_NAME: 'LAST_NAME',
  NAME: 'NAME',
} as const;

export type UserInfoTextKeysType = (typeof USER_INFO_TEXT_KEYS)[keyof typeof USER_INFO_TEXT_KEYS];

export const USER_INFO_MENU_LINK = {
  en: {
    ADDRESSES: 'Addresses',
    ORDERS: 'Orders',
    PERSONAL_INFO: 'Personal Info',
    SUPPORT: 'Support',
    WISHLIST: 'Wishlist',
  },
  ru: {
    ADDRESSES: 'Адреса',
    ORDERS: 'Заказы',
    PERSONAL_INFO: 'Персональные данные',
    SUPPORT: 'Поддержка',
    WISHLIST: 'Избранное',
  },
} as const;

export const USER_INFO_MENU_LINK_KEYS = {
  ADDRESSES: 'ADDRESSES',
  ORDERS: 'ORDERS',
  PERSONAL_INFO: 'PERSONAL_INFO',
  SUPPORT: 'SUPPORT',
  WISHLIST: 'WISHLIST',
} as const;

export type UserInfoMenuLinkKeysType = (typeof USER_INFO_MENU_LINK_KEYS)[keyof typeof USER_INFO_MENU_LINK_KEYS];
