import type { Variant } from '../types/product.ts';

import { LANGUAGE_CHOICE } from '../constants/common.ts';
import { SERVER_MESSAGE } from '../constants/messages.ts';
import { USER_INFO_TEXT } from '../constants/pages.ts';
import { PRODUCT_INFO_TEXT } from '../constants/product.ts';
import getCurrentLanguage from './getCurrentLanguage.ts';

const textTemplate = (beginning: string, variable: number | string, end?: string): string => {
  const start = beginning ? `${beginning} ` : '';
  const ending = end ? `${end}` : '';
  return `${start}${variable}${ending}`;
};

export const cartPrice = (price: string): string => `$${price}`;

export const minusCartPrice = (price: string): string => `-$${price}`;

export const discountText = (): string => PRODUCT_INFO_TEXT[getCurrentLanguage()].DISCOUNT_LABEL;

export const discountPercent = (currentVariant: Variant): string =>
  `${Math.round((1 - currentVariant.discount / currentVariant.price) * 100)}%`;

export const productAddedToCartMessage = (name: string): string =>
  textTemplate(name, SERVER_MESSAGE[getCurrentLanguage()].SUCCESSFUL_ADD_PRODUCT_TO_CART);

export const productRemovedFromCartMessage = (name: string): string =>
  textTemplate(name, SERVER_MESSAGE[getCurrentLanguage()].SUCCESSFUL_DELETE_PRODUCT_FROM_CART);

export const productAddedToWishListMessage = (name: string): string =>
  textTemplate(name, SERVER_MESSAGE[getCurrentLanguage()].SUCCESSFUL_ADD_PRODUCT_TO_WISHLIST);

export const productRemovedFromWishListMessage = (name: string): string =>
  textTemplate(name, SERVER_MESSAGE[getCurrentLanguage()].SUCCESSFUL_DELETE_PRODUCT_FROM_WISHLIST);

export const promoCodeAppliedMessage = (promocode: string): string =>
  textTemplate(promocode, SERVER_MESSAGE[getCurrentLanguage()].SUCCESSFUL_ADD_COUPON_TO_CART);

export const promoCodeDeleteMessage = (promocode: string): string =>
  textTemplate(promocode, SERVER_MESSAGE[getCurrentLanguage()].SUCCESSFUL_DELETE_COUPON_FROM_CART);

export const promoCodeCopiedMessage = (promocode: string): string =>
  textTemplate(promocode, SERVER_MESSAGE[getCurrentLanguage()].SUCCESSFUL_COPY_PROMO_CODE_TO_CLIPBOARD);

export const SKUCopiedMessage = (key: string): string =>
  textTemplate(`SKU ${key}`, SERVER_MESSAGE[getCurrentLanguage()].SUCCESSFUL_COPY_TO_CLIPBOARD);

export const userInfoName = (name: string): string => textTemplate(USER_INFO_TEXT[getCurrentLanguage()].NAME, name);

export const userInfoLastName = (name: string): string =>
  textTemplate(USER_INFO_TEXT[getCurrentLanguage()].LAST_NAME, name);

export const userInfoEmail = (email: string): string => textTemplate(USER_INFO_TEXT[getCurrentLanguage()].EMAIL, email);

export const userInfoDateOfBirth = (date: string): string =>
  textTemplate(USER_INFO_TEXT[getCurrentLanguage()].DATE_OF_BIRTH, date);

export const createGreetingMessage = (name: string): string =>
  textTemplate(`Hi, ${name}!`, SERVER_MESSAGE[getCurrentLanguage()].SUCCESSFUL_LOGIN);

const maxLengthMessageRu = (maxLength: number): string =>
  textTemplate('Максимальная длина не должна превышать', maxLength, ' символов');

const maxLengthMessageEn = (maxLength: number): string =>
  textTemplate('Maximum length should not exceed', maxLength, ' characters');

export const maxLengthMessage = (maxLength: number): string =>
  getCurrentLanguage() === LANGUAGE_CHOICE.EN ? maxLengthMessageEn(maxLength) : maxLengthMessageRu(maxLength);

const maxAgeRu = (maxAge: number): string => textTemplate('Вам должно быть не более', maxAge, ' лет');

const maxAgeEn = (maxAge: number): string => textTemplate('You must be at most', maxAge, ' years old');

export const maxAgeMessage = (maxAge: number): string =>
  getCurrentLanguage() === LANGUAGE_CHOICE.EN ? maxAgeEn(maxAge) : maxAgeRu(maxAge);

const minAgeRu = (minAge: number): string => textTemplate('Вам должно быть не менее', minAge, ' лет');

const minAgeEn = (minAge: number): string => textTemplate('You must be at least', minAge, ' years old');

export const minAgeMessage = (minAge: number): string =>
  getCurrentLanguage() === LANGUAGE_CHOICE.EN ? minAgeEn(minAge) : minAgeRu(minAge);

const minLengthMessageRu = (minLength: number): string =>
  textTemplate('Минимальная длина должна быть не менее', minLength, ' символов');

const minLengthMessageEn = (minLength: number): string =>
  textTemplate('Minimum length should be at least', minLength, ' characters');

export const minLengthMessage = (minLength: number): string =>
  getCurrentLanguage() === LANGUAGE_CHOICE.EN ? minLengthMessageEn(minLength) : minLengthMessageRu(minLength);
