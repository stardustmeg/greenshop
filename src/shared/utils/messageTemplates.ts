import getStore from '../Store/Store.ts';
import { LANGUAGE_CHOICE } from '../constants/common.ts';
import { SERVER_MESSAGE } from '../constants/messages.ts';
import { PAGE_DESCRIPTION, PAGE_TITLE, USER_INFO_TEXT } from '../constants/pages.ts';
import { ADDRESS_TYPE } from '../types/address.ts';
import { keyExistsInPageTitle } from './isKeyOf.ts';

const textTemplate = (beginning: string, variable: number | string, end?: string): string => {
  const start = beginning ? `${beginning} ` : '';
  const ending = end ? `${end}` : '';
  return `${start}${variable}${ending}`;
};

export const appTitle = (projectTitle: string, currentPageTitle: string): string => {
  const { currentLanguage } = getStore().getState();
  if (keyExistsInPageTitle(currentPageTitle)) {
    return `${projectTitle} | ${PAGE_TITLE[currentLanguage][currentPageTitle]}`;
  }

  return `${projectTitle} | ${currentPageTitle}`;
};

export const addressTemplate = (streetName = '', city = '', country: null | string = null, postalCode = ''): string =>
  `${streetName}, ${city}, ${country}, ${postalCode}`;

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
  `${SERVER_MESSAGE[getStore().getState().currentLanguage].SUCCESSFUL_LOGIN}`;

const maxLengthMessageRu = (maxLength: number): string =>
  textTemplate('Максимальная длина не должна превышать', maxLength, ' символов');

const maxLengthMessageEn = (maxLength: number): string =>
  textTemplate('Maximum length should not exceed', maxLength, ' characters');

export const maxLengthMessage = (maxLength: number): string =>
  getStore().getState().currentLanguage === LANGUAGE_CHOICE.EN
    ? maxLengthMessageEn(maxLength)
    : maxLengthMessageRu(maxLength);

const maxAgeRu = (maxAge: number): string => textTemplate('Вам должно быть не более', maxAge, ' лет');

export const defaultBillingAddress = (address: string): string =>
  textTemplate('', address, USER_INFO_TEXT[getStore().getState().currentLanguage].DEFAULT_BILLING_ADDRESS);

export const defaultShippingAddress = (address: string): string =>
  textTemplate('', address, USER_INFO_TEXT[getStore().getState().currentLanguage].DEFAULT_SHIPPING_ADDRESS);

export const billingAddressMessage = (address: string): string =>
  textTemplate('', address, USER_INFO_TEXT[getStore().getState().currentLanguage].BILLING);

export const shippingAddressMessage = (address: string): string =>
  textTemplate('', address, USER_INFO_TEXT[getStore().getState().currentLanguage].SHIPPING);

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

export function addressMessage(text: string, type?: string): string {
  switch (type) {
    case ADDRESS_TYPE.BILLING:
      return billingAddressMessage(text);
    case ADDRESS_TYPE.SHIPPING:
      return shippingAddressMessage(text);
    default:
      return text;
  }
}
