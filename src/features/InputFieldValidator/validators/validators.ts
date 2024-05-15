import type { InputFieldParams, InputFieldValidatorParams } from '@/shared/types/form.ts';

import getStore from '@/shared/Store/Store.ts';
import observeStore, { selectCurrentLanguage } from '@/shared/Store/observer.ts';
import COUNTRIES_LIST from '@/shared/constants/countriesList.ts';
import { USER_ADDRESS_TYPE } from '@/shared/constants/forms.ts';
import { ERROR_MESSAGE } from '@/shared/constants/messages.ts';
import { checkInputLanguage } from '@/shared/utils/getCountryIndex.ts';
import { maxAgeMessage, maxLengthMessage, minAgeMessage, minLengthMessage } from '@/shared/utils/messageTemplate.ts';
import { postcodeValidator } from 'postcode-validator';

export const checkMaxLength = (value: string, validParams: InputFieldValidatorParams): boolean | string => {
  if (validParams.maxLength && value.length > validParams.maxLength) {
    return maxLengthMessage(validParams.maxLength);
  }
  return true;
};

export const checkMaxAge = (value: string, validParams: InputFieldValidatorParams): boolean | string => {
  const today = new Date();
  const birthDate = new Date(value);
  const age = today.getFullYear() - birthDate.getFullYear();
  if (validParams.validBirthday && age > validParams.validBirthday.maxAge) {
    return maxAgeMessage(validParams.validBirthday.maxAge);
  }
  return true;
};

export const checkMinAge = (value: string, validParams: InputFieldValidatorParams): boolean | string => {
  const today = new Date();
  const birthDate = new Date(value);
  const age = today.getFullYear() - birthDate.getFullYear();
  if (validParams.validBirthday && age < validParams.validBirthday.minAge) {
    return minAgeMessage(validParams.validBirthday.minAge);
  }
  return true;
};

export const checkMinLength = (value: string, validParams: InputFieldValidatorParams): boolean | string => {
  if (validParams.minLength && value.length < validParams.minLength) {
    return minLengthMessage(validParams.minLength);
  }
  return true;
};

export const checkNotSpecialSymbols = (value: string, validParams: InputFieldValidatorParams): boolean | string => {
  if (validParams.notSpecialSymbols && !validParams.notSpecialSymbols.pattern.test(value)) {
    return validParams.notSpecialSymbols.messages[getStore().getState().currentLanguage];
  }
  return true;
};

export const checkRequired = (value: string, validParams: InputFieldValidatorParams): boolean | string => {
  if (validParams.required && value.trim() === '') {
    return ERROR_MESSAGE[getStore().getState().currentLanguage].REQUIRED_FIELD;
  }
  return true;
};

export const checkRequiredSymbols = (value: string, validParams: InputFieldValidatorParams): boolean | string => {
  if (validParams.requiredSymbols && !validParams.requiredSymbols.pattern.test(value)) {
    return validParams.requiredSymbols.messages[getStore().getState().currentLanguage];
  }
  return true;
};

export const checkValidAge = (value: string, validParams: InputFieldValidatorParams): boolean | string => {
  if (validParams.validBirthday && !validParams.validBirthday.pattern.test(value)) {
    return validParams.validBirthday.messages[getStore().getState().currentLanguage];
  }
  return true;
};

export const checkValidCountry = (value: string, validParams: InputFieldValidatorParams): boolean | string => {
  if (validParams.validCountry) {
    if (
      !Object.keys(COUNTRIES_LIST[checkInputLanguage(value)]).find(
        (countryName) => countryName.toLowerCase() === value.toLowerCase(),
      )
    ) {
      return ERROR_MESSAGE[getStore().getState().currentLanguage].INVALID_COUNTRY;
    }
  }
  observeStore(selectCurrentLanguage, () => checkValidCountry(value, validParams));
  return true;
};

export const checkValidMail = (value: string, validParams: InputFieldValidatorParams): boolean | string => {
  if (validParams.validMail && !validParams.validMail.pattern.test(value)) {
    return validParams.validMail.messages[getStore().getState().currentLanguage];
  }
  return true;
};

export const checkValidPostalCode = (
  value: string,
  validParams: InputFieldValidatorParams,
  inputParams: InputFieldParams,
): boolean | string => {
  if (validParams.validPostalCode && inputParams.inputParams.data) {
    const { billingCountry, shippingCountry } = getStore().getState();
    const currentCountry =
      inputParams.inputParams.data.addressType === USER_ADDRESS_TYPE.SHIPPING ? shippingCountry : billingCountry;
    try {
      const result = postcodeValidator(value, currentCountry);
      if (!result) {
        return ERROR_MESSAGE[getStore().getState().currentLanguage].INVALID_POSTAL_CODE;
      }
    } catch (error) {
      return ERROR_MESSAGE[getStore().getState().currentLanguage].WRONG_REGION;
    }
  }
  return true;
};

export const checkWhitespace = (value: string, validParams: InputFieldValidatorParams): boolean | string => {
  if (validParams.notWhitespace && !validParams.notWhitespace.pattern.test(value)) {
    return validParams.notWhitespace.messages[getStore().getState().currentLanguage];
  }
  return true;
};
