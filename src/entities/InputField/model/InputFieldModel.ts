import type { InputFieldParams, InputFieldValidatorParams } from '@/shared/types/interfaces.ts';

import InputFieldValidatorModel from '@/features/InputFieldValidator/model/InputFieldValidatorModel.ts';
import { EVENT_NAMES } from '@/shared/constants/enums.ts';

import InputFieldView from '../view/InputFieldView.ts';

class InputFieldModel {
  private isValid = false;

  private validator: InputFieldValidatorModel | null = null;

  private view: InputFieldView;

  constructor(inputFieldParams: InputFieldParams, validParams: InputFieldValidatorParams | null) {
    this.view = new InputFieldView(inputFieldParams);

    if (validParams) {
      this.validator = new InputFieldValidatorModel(validParams, this.isValid);
      this.setInputHandler();
    }
  }

  private inputHandler(): boolean {
    const errorField = this.view.getErrorField();
    const errors = this.validator?.validate(this.view.getValue());
    if (errors === true) {
      if (errorField) {
        errorField.textContent = '';
      }
      this.isValid = true;
    } else {
      if (errorField && errors) {
        const [firstError] = errors;
        errorField.textContent = firstError;
      }
      this.isValid = false;
    }

    return true;
  }

  private setInputHandler(): boolean {
    const input = this.view.getInput().getHTML();
    input.addEventListener(EVENT_NAMES.INPUT, () => {
      this.inputHandler();
    });

    return true;
  }

  public getIsValid(): boolean {
    return this.isValid;
  }

  public getView(): InputFieldView {
    return this.view;
  }
}

export default InputFieldModel;