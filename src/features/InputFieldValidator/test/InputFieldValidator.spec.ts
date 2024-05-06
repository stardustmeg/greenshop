import type { InputFieldValidatorParams } from '@/shared/types/form';

import InputFieldValidatorModel from '../model/InputFieldValidatorModel.ts';

const validatorParams: InputFieldValidatorParams = {
  key: '',
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

const validator = new InputFieldValidatorModel(validatorParams, true);

describe('Checking InputFieldValidatorModel', () => {
  it('InputFieldValidatorModel instance should be defined', () => {
    expect(InputFieldValidatorModel).toBeDefined();
  });

  it('should return true', () => {
    expect(validator.validate('test')).toStrictEqual(true);
  });
});
