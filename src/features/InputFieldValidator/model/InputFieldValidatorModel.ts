import type { InputFieldValidatorParams } from '@/shared/types/interfaces';

import { COUNTRIES } from '@/shared/constants/enums.ts';

class InputFieldValidatorModel {
  private isValid: boolean;

  private validParams;

  constructor(validParams: InputFieldValidatorParams, isValid: boolean) {
    this.validParams = validParams;
    this.isValid = isValid;
  }

  private checkMaxAge(value: string): boolean | string {
    const today = new Date();
    const birthDate = new Date(value);
    const age = today.getFullYear() - birthDate.getFullYear();
    if (this.validParams.validBirthday && age > this.validParams.validBirthday.maxAge) {
      const errorMessage = `You must be at most ${this.validParams.validBirthday.maxAge} years old`;
      return errorMessage;
    }

    return true;
  }

  private checkMaxLength(value: string): boolean | string {
    if (this.validParams.maxLength && value.length > this.validParams.maxLength) {
      const errorMessage = `Max length should not exceed ${this.validParams.maxLength}`;
      return errorMessage;
    }

    return true;
  }

  private checkMinAge(value: string): boolean | string {
    const today = new Date();
    const birthDate = new Date(value);
    const age = today.getFullYear() - birthDate.getFullYear();
    if (this.validParams.validBirthday && age < this.validParams.validBirthday.minAge) {
      const errorMessage = `You must be at least ${this.validParams.validBirthday.minAge} years old`;
      return errorMessage;
    }

    return true;
  }

  private checkMinLength(value: string): boolean | string {
    if (this.validParams.minLength && value.length < this.validParams.minLength) {
      const errorMessage = `Min length should be at least ${this.validParams.minLength}`;
      return errorMessage;
    }

    return true;
  }

  private checkNotSpecialSymbols(value: string): boolean | string {
    if (this.validParams.notSpecialSymbols && !this.validParams.notSpecialSymbols.pattern.test(value)) {
      const errorMessage = this.validParams.notSpecialSymbols.message;
      return errorMessage;
    }

    return true;
  }

  private checkRequired(value: string): boolean | string {
    if (this.validParams.required && value.trim() === '') {
      const errorMessage = 'Field is required';
      return errorMessage;
    }

    return true;
  }

  private checkRequiredSymbols(value: string): boolean | string {
    if (this.validParams.requiredSymbols && !this.validParams.requiredSymbols.pattern.test(value)) {
      const errorMessage = this.validParams.requiredSymbols.message;
      return errorMessage;
    }

    return true;
  }

  private checkValidAge(value: string): boolean | string {
    if (this.validParams.validBirthday && !this.validParams.validBirthday.pattern.test(value)) {
      const errorMessage = this.validParams.validBirthday.message;
      return errorMessage;
    }

    return true;
  }

  private checkValidCountry(value: string): boolean | string {
    if (this.validParams.validCountry) {
      if (!Object.keys(COUNTRIES).find((countryCode) => countryCode === value)) {
        const errorMessage = 'Invalid country';
        return errorMessage;
      }
    }

    return true;
  }

  private checkValidMail(value: string): boolean | string {
    if (this.validParams.validMail && !this.validParams.validMail.pattern.test(value)) {
      const errorMessage = this.validParams.validMail.message;
      return errorMessage;
    }

    return true;
  }

  private checkWhitespace(value: string): boolean | string {
    if (this.validParams.notWhitespace && !this.validParams.notWhitespace.pattern.test(value)) {
      const errorMessage = this.validParams.notWhitespace.message;
      return errorMessage;
    }

    return true;
  }

  public validate(value: string): boolean | string[] {
    const errors = [
      this.checkWhitespace(value),
      this.checkRequired(value),
      this.checkNotSpecialSymbols(value),
      this.checkMinLength(value),
      this.checkMaxLength(value),
      this.checkRequiredSymbols(value),
      this.checkValidMail(value),
      this.checkValidAge(value),
      this.checkMinAge(value),
      this.checkMaxAge(value),
      this.checkValidCountry(value),
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
