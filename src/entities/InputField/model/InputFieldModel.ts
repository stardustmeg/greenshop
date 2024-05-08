import type { InputFieldParams, InputFieldValidatorParams } from '@/shared/types/form.ts';

import InputFieldValidatorModel from '@/features/InputFieldValidator/model/InputFieldValidatorModel.ts';
import observeStore, { selectCurrentLanguage } from '@/shared/Store/observer.ts';

import InputFieldView from '../view/InputFieldView.ts';

class InputFieldModel {
  private validator: InputFieldValidatorModel | null = null;

  private view: InputFieldView;

  constructor(inputFieldParams: InputFieldParams, validParams: InputFieldValidatorParams | null) {
    this.view = new InputFieldView(inputFieldParams);

    if (validParams) {
      this.validator = new InputFieldValidatorModel(validParams);
      this.setInputHandler();
    }

    observeStore(selectCurrentLanguage, () => this.inputHandler());
  }

  private inputHandler(): boolean {
    const errorField = this.view.getErrorField();

    if (!this.validator || !errorField) {
      return true;
    }

    const errors = this.validator.validate(this.view.getValue());
    errorField.textContent = '';

    if (errors instanceof Array) {
      const [firstError] = errors;
      errorField.textContent = firstError;
      return false;
    }

    return true;
  }

  private setInputHandler(): boolean {
    const input = this.view.getInput().getHTML();
    input.addEventListener('input', () => this.inputHandler());

    return true;
  }

  public getIsValid(): boolean {
    return this.inputHandler();
  }

  public getView(): InputFieldView {
    return this.view;
  }
}

export default InputFieldModel;
