import { EVENT_NAMES } from '@/shared/constants/enums.ts';

import type InputFieldModel from '@/entities/InputField/model/InputFieldModel.ts';

import LoginFormView from '../view/LoginFormView.ts';

class LoginFormModel {
  private inputFields: InputFieldModel[] = [];

  private isValidInputFields: Record<string, boolean> = {};

  private view: LoginFormView = new LoginFormView();

  constructor() {
    this.init();
  }

  private init(): boolean {
    this.inputFields = this.view.getInputFields();
    this.inputFields.forEach((inputField) => this.setInputFieldHandlers(inputField));
    this.setPreventDefaultToForm();

    return true;
  }

  private setInputFieldHandlers(inputField: InputFieldModel): boolean {
    const inputHTML = inputField.getView().getInput().getHTML();
    this.isValidInputFields[inputHTML.id] = false;
    inputHTML.addEventListener(EVENT_NAMES.INPUT, () => {
      this.isValidInputFields[inputHTML.id] = inputField.getIsValid();
      this.switchSubmitFormButtonAccess();
    });
    return true;
  }

  private setPreventDefaultToForm(): boolean {
    this.getHTML().addEventListener(EVENT_NAMES.SUBMIT, (event) => {
      event.preventDefault();
    });

    return true;
  }

  private switchSubmitFormButtonAccess(): boolean {
    if (Object.values(this.isValidInputFields).every((value) => value)) {
      this.view.getSubmitFormButton().setEnabled();
    } else {
      this.view.getSubmitFormButton().setDisabled();
    }

    return true;
  }

  public getFirstInputField(): InputFieldModel {
    return this.inputFields[0];
  }

  public getHTML(): HTMLFormElement {
    return this.view.getHTML();
  }
}

export default LoginFormModel;
