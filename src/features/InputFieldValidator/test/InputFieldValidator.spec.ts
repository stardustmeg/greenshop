import type { InputFieldParams, InputFieldValidatorParams } from '@/shared/types/form';

import InputFieldValidatorModel from '../model/InputFieldValidatorModel.ts';

/**
 * @vitest-environment jsdom
 */

const validatorParams: InputFieldValidatorParams = {
  maxLength: 10,
  minLength: 2,
  notSpecialSymbols: {
    messages: {
      en: 'Not special symbols',
      ru: 'Не специальные символы',
    },
    pattern: /[a-zA-Z0-9]/,
  },
  notWhitespace: {
    messages: {
      en: 'Not white spaces',
      ru: 'Не пробелы',
    },
    pattern: /\S/,
  },
};

const fieldParams: InputFieldParams = {
  inputParams: {
    autocomplete: 'off',
    data: {
      addressType: 'shippingAddress',
    },
    placeholder: 'Canada',
    type: 'text',
  },
  labelParams: {
    text: {
      en: 'Country',
      ru: 'Страна',
    },
  },
};

const validator = new InputFieldValidatorModel(fieldParams, validatorParams);

describe('Checking InputFieldValidatorModel', () => {
  it('InputFieldValidatorModel instance should be defined', () => {
    expect(InputFieldValidatorModel).toBeDefined();
  });

  it('should return true', () => {
    expect(validator.validate('test')).toStrictEqual(true);
  });
});
