import getStore from '../Store/Store.ts';
import { LANGUAGE_CHOICE } from '../constants/common.ts';
import { SERVER_MESSAGE } from '../constants/messages.ts';
import { PAGE_DESCRIPTION, USER_INFO_TEXT } from '../constants/pages.ts';
import { ADDRESS_TYPE } from '../types/address.ts';

const textTemplate = (beginning: string, variable: number | string, end?: string): string => {
  const start = beginning ? `${beginning} ` : '';
  const ending = end ? `${end}` : '';
  return `${start}${variable}${ending}`;
};

export const cartPrice = (price: string): string => `$${price}`;
export const minusCartPrice = (price: string): string => `-$${price}`;

export const productAddedToCartMessage = (name: string): string =>
  textTemplate(name, SERVER_MESSAGE[getStore().getState().currentLanguage].SUCCESSFUL_ADD_PRODUCT_TO_CART);

export const productRemovedFromCartMessage = (name: string): string =>
  textTemplate(name, SERVER_MESSAGE[getStore().getState().currentLanguage].SUCCESSFUL_DELETE_PRODUCT_FROM_CART);

export const productAddedToWishListMessage = (name: string): string =>
  textTemplate(name, SERVER_MESSAGE[getStore().getState().currentLanguage].SUCCESSFUL_ADD_PRODUCT_TO_WISHLIST);

export const productRemovedFromWishListMessage = (name: string): string =>
  textTemplate(name, SERVER_MESSAGE[getStore().getState().currentLanguage].SUCCESSFUL_DELETE_PRODUCT_FROM_WISHLIST);

export const promoCodeAppliedMessage = (promocode: string): string =>
  textTemplate(promocode, SERVER_MESSAGE[getStore().getState().currentLanguage].SUCCESSFUL_ADD_COUPON_TO_CART);

export const promoCodeDeleteMessage = (promocode: string): string =>
  textTemplate(promocode, SERVER_MESSAGE[getStore().getState().currentLanguage].SUCCESSFUL_DELETE_COUPON_FROM_CART);

export const promoCodeCopiedMessage = (promocode: string): string =>
  textTemplate(
    promocode,
    SERVER_MESSAGE[getStore().getState().currentLanguage].SUCCESSFUL_COPY_PROMO_CODE_TO_CLIPBOARD,
  );

export const notFoundMessage = (name: string): string =>
  textTemplate(`Hi, ${name}!`, PAGE_DESCRIPTION[getStore().getState().currentLanguage][404]);

export const SKUCopiedMessage = (key: string): string =>
  textTemplate(`SKU ${key}`, SERVER_MESSAGE[getStore().getState().currentLanguage].SUCCESSFUL_COPY_TO_CLIPBOARD);

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

export const createGreetingMessage = (name: string): string =>
  textTemplate(`Hi, ${name}!`, SERVER_MESSAGE[getStore().getState().currentLanguage].SUCCESSFUL_LOGIN);

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
