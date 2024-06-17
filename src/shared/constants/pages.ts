import type { LanguageChoiceType } from './common';

export const PAGE_TITLE: Record<LanguageChoiceType, Record<string, string>> = {
  en: {
    404: '404',
    about: 'About us',
    addresses: 'Addresses',
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
    addresses: 'Адреса',
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
    ABOUT: 'Mad Wizards Team 🧙🏻🪄✨',
    BLOG: 'Blog',
    LOGIN: 'Enter your email and password to login.',
    REGISTRATION: 'Enter your information to register.',
  },
  ru: {
    404: 'Это не та страница, которую вы ищете. Пожалуйста, вернитесь на главную страницу.',
    ABOUT: 'Команда Бешеных Магов 🧙🏻🪄✨',
    BLOG: 'Блог',
    LOGIN: 'Введите свой адрес электронной почты и пароль для входа.',
    REGISTRATION: 'Введите свои данные для регистрации.',
  },
} as const;

export const BLOG_DESCRIPTION = {
  en: {
    LIST_DESCRIPTION:
      'Empowering all people to be plant people — a collection of articles from ours team of plant experts across a variety of plant care topics to inspire confidence in the next generation of plant parents. Welcome to GREENSHOP',
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

export const PAGE_DESCRIPTION_KEY = {
  404: '404',
  BLOG: 'BLOG',
  GREETING: 'GREETING',
  LOGIN: 'LOGIN',
  REGISTRATION: 'REGISTRATION',
} as const;

export const PAGE_ANSWER = {
  en: {
    LOGIN: "Don't have an account yet?",
    REGISTRATION: 'Already have an account?',
  },
  ru: {
    LOGIN: 'Ещё нет аккаунта?',
    REGISTRATION: 'Уже есть аккаунт?',
  },
} as const;

export const PAGE_ANSWER_KEY = {
  LOGIN: 'LOGIN',
  REGISTRATION: 'REGISTRATION',
} as const;

export const PAGE_ID = {
  ABOUT_US_PAGE: 'about',
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

export type PageIdType = (typeof PAGE_ID)[keyof typeof PAGE_ID];

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

export const CART_PAGE_TITLE = {
  BUTTON_CHECKOUT: { en: 'Proceed to Checkout', ru: 'Оформить заказ' },
  BUTTON_COUPON: { en: 'Apply', ru: 'Применить' },
  CART_TOTAL: { en: 'Cart Totals', ru: 'Итого по корзине' },
  CLEAR: { en: 'Clear all', ru: 'Очистить' },
  CONTINUE: { en: 'Continue Shopping', ru: 'Продолжить покупки' },
  COUPON_APPLY: { en: 'Apply Coupon', ru: 'Применить купон' },
  COUPON_DISCOUNT: { en: 'Cart Discount', ru: 'Скидка на корзину' },
  EMPTY: {
    en: "Oops! Looks like you haven't added any items to your cart yet",
    ru: 'Ой! Похоже, вы еще не добавили товар в корзину',
  },
  INPUT_COUPON: { en: 'Enter coupon here...', ru: 'Введите купон здесь...' },
  PRICE: { en: 'Price', ru: 'Цена' },
  PRODUCT: { en: 'Product', ru: 'Продукт' },
  QUANTITY: { en: 'Quantity', ru: 'Количество' },
  SUBTOTAL: { en: 'Subtotal', ru: 'Сумма' },
  TOTAL: { en: 'Total', ru: 'Итого' },
} as const;
