import getStore from '../Store/Store.ts';
import { LANGUAGE_CHOICE } from '../constants/buttons.ts';
import { SERVER_MESSAGE } from '../constants/messages.ts';
import { PAGE_DESCRIPTION, USER_INFO_TEXT } from '../constants/pages.ts';

const textTemplate = (beginning: string, variable: number | string, end?: string): string => {
  const start = beginning ? `${beginning} ` : '';
  const ending = end ? `${end}` : '';
  return `${start}${variable}${ending}`;
};

export const userInfoName = (name: string): string =>
  textTemplate(USER_INFO_TEXT[getStore().getState().currentLanguage].NAME, name);

export const userInfoLastName = (name: string): string =>
  textTemplate(USER_INFO_TEXT[getStore().getState().currentLanguage].LAST_NAME, name);

export const userInfoEmail = (email: string): string =>
  textTemplate(USER_INFO_TEXT[getStore().getState().currentLanguage].EMAIL, email);

export const userInfoDateOfBirth = (date: string): string =>
  textTemplate(USER_INFO_TEXT[getStore().getState().currentLanguage].DATE_OF_BIRTH, date);

export const greeting = (name: string): string =>
  textTemplate(PAGE_DESCRIPTION[getStore().getState().currentLanguage].GREETING, name, '!');

export const createGreetingMessage = (): string =>
  `${greeting(getStore().getState().currentUser?.firstName ?? '')} ${SERVER_MESSAGE[getStore().getState().currentLanguage].SUCCESSFUL_LOGIN}`;

const maxLengthMessageRu = (maxLength: number): string =>
  textTemplate('Максимальная длина не должна превышать', maxLength, ' символов');

const maxLengthMessageEn = (maxLength: number): string =>
  textTemplate('Maximum length should not exceed', maxLength, ' characters');

export const maxLengthMessage = (maxLength: number): string =>
  getStore().getState().currentLanguage === LANGUAGE_CHOICE.EN
    ? maxLengthMessageEn(maxLength)
    : maxLengthMessageRu(maxLength);

const maxAgeRu = (maxAge: number): string => textTemplate('Вам должно быть не более', maxAge, ' лет');

const maxAgeEn = (maxAge: number): string => textTemplate('You must be at most', maxAge, ' years old');

export const maxAgeMessage = (maxAge: number): string =>
  getStore().getState().currentLanguage === LANGUAGE_CHOICE.EN ? maxAgeEn(maxAge) : maxAgeRu(maxAge);

const minAgeRu = (minAge: number): string => textTemplate('Вам должно быть не менее', minAge, ' лет');

const minAgeEn = (minAge: number): string => textTemplate('You must be at least', minAge, ' years old');

export const minAgeMessage = (minAge: number): string =>
  getStore().getState().currentLanguage === LANGUAGE_CHOICE.EN ? minAgeEn(minAge) : minAgeRu(minAge);

const minLengthMessageRu = (minLength: number): string =>
  textTemplate('Минимальная длина должна быть не менее', minLength, ' символов');

const minLengthMessageEn = (minLength: number): string =>
  textTemplate('Minimum length should be at least', minLength, ' characters');

export const minLengthMessage = (minLength: number): string =>
  getStore().getState().currentLanguage === LANGUAGE_CHOICE.EN
    ? minLengthMessageEn(minLength)
    : minLengthMessageRu(minLength);
