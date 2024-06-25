import type { InputFieldParams, InputFieldValidatorParams } from '@/shared/types/form';

import * as Validator from '../validators/validators.ts';

class InputFieldValidatorModel {
  private inputFieldParams: InputFieldParams;

  private isValid = false;

  private validParams;

  constructor(inputFieldParams: InputFieldParams, validParams: InputFieldValidatorParams) {
    this.inputFieldParams = inputFieldParams;
    this.validParams = validParams;
  }

  public validate(value: string): boolean | string[] {
    const errors = [
      Validator.checkRequired(value, this.validParams),
      Validator.checkWhitespace(value, this.validParams),
      Validator.checkNotSpecialSymbols(value, this.validParams),
      Validator.checkRequiredSymbols(value, this.validParams),
      Validator.checkMinLength(value, this.validParams),
      Validator.checkMaxLength(value, this.validParams),
      Validator.checkValidMail(value, this.validParams),
      Validator.checkValidAge(value, this.validParams),
      Validator.checkMinAge(value, this.validParams),
      Validator.checkMaxAge(value, this.validParams),
      Validator.checkValidCountry(value, this.validParams),
      Validator.checkValidPostalCode(value, this.validParams, this.inputFieldParams),
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
