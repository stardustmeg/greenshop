import type { LanguageChoiceType } from './common';

export const PAGE_TITLE: Record<LanguageChoiceType, Record<string, string>> = {
  en: {
    404: '404',
    about: 'About us',
    address: 'Address',
    blog: 'Blog',
    cart: 'Cart',
    catalog: 'Catalog',
    cooperation: 'Cooperation',
    login: 'Login',
    main: 'Main',
    product: 'Product',
    profile: 'Profile',
    register: 'Register',
    wishlist: 'Wishlist',
  },
  ru: {
    404: '404',
    about: 'О нас',
    address: 'Адрес',
    blog: 'Блог',
    cart: 'Корзина',
    catalog: 'Каталог',
    cooperation: 'Сотрудничество',
    login: 'Вход',
    main: 'Главная',
    product: 'Товар',
    profile: 'Профиль',
    register: 'Регистрация',
    wishlist: 'Избранное',
  },
} as const;

export const PAGE_DESCRIPTION = {
  en: {
    404: 'This is not the page you are looking for. Please go back to the main page.',
    BLOG: 'Blog',
    GREETING: 'Hi, ',
    LOGIN: 'Enter your email and password to login.',
    REGISTRATION: 'Enter your information to register.',
  },
  ru: {
    404: 'Это не та страница, которую вы ищете. Пожалуйста, вернитесь на главную страницу.',
    BLOG: 'Блог',
    GREETING: 'Привет, ',
    LOGIN: 'Введите свой адрес электронной почты и пароль для входа.',
    REGISTRATION: 'Введите свои данные для регистрации.',
  },
} as const;

export const BLOG_DESCRIPTION = {
  en: {
    LIST_DESCRIPTION:
      'Empowering all people to be plant people—a collection of articles from ours team of plant experts across a variety of plant care topics to inspire confidence in the next generation of plant parents. Welcome to GREENSHOP',
    LIST_TITLE: 'Your Journey to Plant Parenthood',
    WIDGET_DESCRIPTIONS: 'This is where we share our experiences with all green friend lovers',
    WIDGET_TITLE: 'Our Blog Posts',
  },
  ru: {
    LIST_DESCRIPTION:
      'Дать возможность всем людям стать родителями растений - сборник статей от нашей команды экспертов по уходу за растениями на самые разные темы, чтобы вселить уверенность в следующее поколение родителей растений. Добро пожаловать на сайт GREENSHOP',
    LIST_TITLE: 'Превращение в заботливого родителя растений',
    WIDGET_DESCRIPTIONS: 'Здесь мы делимся своим опытом со всеми любителями зеленых друзей',
    WIDGET_TITLE: 'Наши статьи в Блоге',
  },
} as const;

export const PAGE_DESCRIPTION_KEYS = {
  404: '404',
  BLOG: 'BLOG',
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
  ADDRESS: 'address',
  BLOG: 'blog',
  CART_PAGE: 'cart',
  CATALOG_PAGE: 'catalog',
  COOPERATION_PAGE: 'cooperation',
  DEFAULT_PAGE: '',
  LOGIN_PAGE: 'login',
  MAIN_PAGE: 'main',
  NOT_FOUND_PAGE: '404',
  PRODUCT_PAGE: 'product',
  REGISTRATION_PAGE: 'register',
  USER_ADDRESSES_PAGE: 'addresses',
  USER_PROFILE_PAGE: 'profile',
  WISHLIST_PAGE: 'wishlist',
} as const;

export const USER_INFO_TEXT = {
  en: {
    BILLING: ' (billing)',
    DATE_OF_BIRTH: 'Date of Birth: ',
    DEFAULT_BILLING_ADDRESS: ' (default billing)',
    DEFAULT_SHIPPING_ADDRESS: ' (default shipping)',
    EMAIL: 'Email: ',
    LAST_NAME: 'Last Name: ',
    NAME: 'First Name: ',
    SHIPPING: ' (shipping)',
  },
  ru: {
    BILLING: ' (оплата)',
    DATE_OF_BIRTH: 'Дата рождения: ',
    DEFAULT_BILLING_ADDRESS: ' (по умолчанию - для оплаты)',
    DEFAULT_SHIPPING_ADDRESS: ' (по умолчанию - для доставки)',
    EMAIL: 'Электронная почта: ',
    LAST_NAME: 'Фамилия: ',
    NAME: 'Имя: ',
    SHIPPING: ' (доставка)',
  },
} as const;

export const USER_INFO_TEXT_KEYS = {
  BILLING: 'BILLING',
  DATE_OF_BIRTH: 'DATE_OF_BIRTH',
  DEFAULT_BILLING_ADDRESS: 'DEFAULT_BILLING_ADDRESS',
  DEFAULT_SHIPPING_ADDRESS: 'DEFAULT_SHIPPING_ADDRESS',
  EMAIL: 'EMAIL',
  LAST_NAME: 'LAST_NAME',
  NAME: 'NAME',
  SHIPPING: 'SHIPPING',
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

export type PageIdType = (typeof PAGE_ID)[keyof typeof PAGE_ID];
