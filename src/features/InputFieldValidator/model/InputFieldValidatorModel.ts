import type { InputFieldValidatorParams } from '@/shared/types/form';

import getStore from '@/shared/Store/Store.ts';
import { LANGUAGE_CHOICE } from '@/shared/constants/buttons.ts';
import COUNTRIES_LIST from '@/shared/constants/countriesList.ts';
import { USER_POSTAL_CODE } from '@/shared/constants/forms.ts';
import { ERROR_MESSAGE } from '@/shared/constants/messages.ts';
import { postcodeValidator } from 'postcode-validator';

class InputFieldValidatorModel {
  private isValid: boolean;

  private validParams;

  constructor(validParams: InputFieldValidatorParams, isValid: boolean) {
    this.validParams = validParams;
    this.isValid = isValid;
  }

  private checkMaxAge(value: string): boolean | string {
    const { currentLanguage } = getStore().getState();
    const today = new Date();
    const birthDate = new Date(value);
    const age = today.getFullYear() - birthDate.getFullYear();
    if (this.validParams.validBirthday && age > this.validParams.validBirthday.maxAge) {
      const errorMessage =
        currentLanguage === LANGUAGE_CHOICE.EN
          ? `You must be at most ${this.validParams.validBirthday.maxAge} years old`
          : `Вам должно быть не более ${this.validParams.validBirthday.maxAge} лет`;
      return errorMessage;
    }
    return true;
  }

  private checkMaxLength(value: string): boolean | string {
    const { currentLanguage } = getStore().getState();
    if (this.validParams.maxLength && value.length > this.validParams.maxLength) {
      const errorMessage =
        currentLanguage === LANGUAGE_CHOICE.EN
          ? `Max length should not exceed ${this.validParams.maxLength}`
          : `Максимальная длина не должна превышать ${this.validParams.maxLength} символов`;
      return errorMessage;
    }
    return true;
  }

  private checkMinAge(value: string): boolean | string {
    const { currentLanguage } = getStore().getState();
    const today = new Date();
    const birthDate = new Date(value);
    const age = today.getFullYear() - birthDate.getFullYear();
    if (this.validParams.validBirthday && age < this.validParams.validBirthday.minAge) {
      const errorMessage =
        currentLanguage === LANGUAGE_CHOICE.EN
          ? `You must be at least ${this.validParams.validBirthday.minAge} years old`
          : `Вам должно быть не менее ${this.validParams.validBirthday.minAge} лет`;
      return errorMessage;
    }
    return true;
  }

  private checkMinLength(value: string): boolean | string {
    const { currentLanguage } = getStore().getState();
    if (this.validParams.minLength && value.length < this.validParams.minLength) {
      const errorMessage =
        currentLanguage === LANGUAGE_CHOICE.EN
          ? `Min length should be at least ${this.validParams.minLength}`
          : `Минимальная длина должна быть не менее ${this.validParams.minLength} символов`;
      return errorMessage;
    }
    return true;
  }

  private checkNotSpecialSymbols(value: string): boolean | string {
    const { currentLanguage } = getStore().getState();
    if (this.validParams.notSpecialSymbols && !this.validParams.notSpecialSymbols.pattern.test(value)) {
      const errorMessage = this.validParams.notSpecialSymbols.messages[currentLanguage];
      return errorMessage;
    }
    return true;
  }

  private checkRequired(value: string): boolean | string {
    const { currentLanguage } = getStore().getState();
    if (this.validParams.required && value.trim() === '') {
      return ERROR_MESSAGE[currentLanguage].REQUIRED_FIELD;
    }
    return true;
  }

  private checkRequiredSymbols(value: string): boolean | string {
    const { currentLanguage } = getStore().getState();
    if (this.validParams.requiredSymbols && !this.validParams.requiredSymbols.pattern.test(value)) {
      const errorMessage = this.validParams.requiredSymbols.messages[currentLanguage];
      return errorMessage;
    }
    return true;
  }

  private checkValidAge(value: string): boolean | string {
    const { currentLanguage } = getStore().getState();
    if (this.validParams.validBirthday && !this.validParams.validBirthday.pattern.test(value)) {
      const errorMessage = this.validParams.validBirthday.messages[currentLanguage];
      return errorMessage;
    }
    return true;
  }

  private checkValidCountry(value: string): boolean | string {
    if (this.validParams.validCountry) {
      const { currentLanguage } = getStore().getState();
      if (
        !Object.keys(COUNTRIES_LIST[currentLanguage]).find(
          (countryName) => countryName.toLowerCase() === value.toLowerCase(),
        )
      ) {
        return ERROR_MESSAGE[currentLanguage].INVALID_COUNTRY;
      }
    }
    return true;
  }

  private checkValidMail(value: string): boolean | string {
    const { currentLanguage } = getStore().getState();
    if (this.validParams.validMail && !this.validParams.validMail.pattern.test(value)) {
      const errorMessage = this.validParams.validMail.messages[currentLanguage];
      return errorMessage;
    }
    return true;
  }

  private checkValidPostalCode(value: string): boolean | string {
    const { currentLanguage } = getStore().getState();
    if (this.validParams.validPostalCode) {
      const { billingCountry, shippingCountry } = getStore().getState();
      const currentCountry = this.validParams.key === USER_POSTAL_CODE.POSTAL_CODE ? shippingCountry : billingCountry;
      try {
        const result = postcodeValidator(value, currentCountry);
        if (!result) {
          return ERROR_MESSAGE[currentLanguage].INVALID_POSTAL_CODE;
        }
      } catch (error) {
        return ERROR_MESSAGE[currentLanguage].WRONG_REGION;
      }
    }
    return true;
  }

  private checkWhitespace(value: string): boolean | string {
    const { currentLanguage } = getStore().getState();
    if (this.validParams.notWhitespace && !this.validParams.notWhitespace.pattern.test(value)) {
      const errorMessage = this.validParams.notWhitespace.messages[currentLanguage];
      return errorMessage;
    }

    return true;
  }

  public validate(value: string): boolean | string[] {
    const errors = [
      this.checkRequired(value),
      this.checkRequired(value),
      this.checkWhitespace(value),
      this.checkNotSpecialSymbols(value),
      this.checkMinLength(value),
      this.checkMaxLength(value),
      this.checkRequiredSymbols(value),
      this.checkValidMail(value),
      this.checkValidAge(value),
      this.checkMinAge(value),
      this.checkMaxAge(value),
      this.checkValidCountry(value),
      this.checkValidPostalCode(value),
    ];

    const errorMessages: string[] = [];
    errors.forEach((error) => {
      if (typeof error === 'string') {
        errorMessages.push(error);
      }
    });

    if (errorMessages.length) {
      return errorMessages;
    }

    this.isValid = true;
    return this.isValid;
  }
}

export default InputFieldValidatorModel;
