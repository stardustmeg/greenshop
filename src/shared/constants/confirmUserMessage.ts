export const USER_MESSAGE = {
  en: {
    CONFIRM: 'Are you sure you want to proceed?',
    DELETE_ADDRESS: 'Are you sure you want to delete this address?',
  },
  ru: {
    CONFIRM: 'Вы уверены, что хотите продолжить?',
    DELETE_ADDRESS: 'Вы уверены, что хотите удалить этот адрес?',
  },
} as const;

export const USER_MESSAGE_KEYS = {
  CONFIRM: 'CONFIRM',
  DELETE_ADDRESS: 'DELETE_ADDRESS',
};

export type UserMessageKeysType = (typeof USER_MESSAGE_KEYS)[keyof typeof USER_MESSAGE_KEYS];
