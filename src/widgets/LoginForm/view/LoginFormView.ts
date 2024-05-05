import InputFieldModel from '@/entities/InputField/model/InputFieldModel.ts';
import ButtonModel from '@/shared/Button/model/ButtonModel.ts';
import { BUTTON_TYPE, FORM_SUBMIT_BUTTON_TEXT } from '@/shared/constants/buttons.ts';
import * as FORM_INPUTS from '@/shared/constants/forms/login/fieldParams.ts';
import * as FORM_VALIDATION from '@/shared/constants/forms/login/validationParams.ts';
import TAG_NAME from '@/shared/constants/tags.ts';
import createBaseElement from '@/shared/utils/createBaseElement.ts';

import styles from './loginForm.module.scss';

class LoginFormView {
  private form: HTMLFormElement;

  private inputFields: InputFieldModel[] = [];

  private submitFormButton: ButtonModel;

  constructor() {
    this.inputFields = this.createInputFields();
    this.submitFormButton = this.createSubmitFormButton();
    this.form = this.createHTML();
  }

  private createHTML(): HTMLFormElement {
    this.form = createBaseElement({
      cssClasses: [styles.loginForm],
      tag: TAG_NAME.FORM,
    });

    this.inputFields.forEach((inputField) => {
      const inputFieldElement = inputField.getView().getHTML();

      if (inputFieldElement instanceof HTMLLabelElement) {
        this.form.append(inputFieldElement);
      } else {
        this.form.append(inputFieldElement.getHTML());
      }
    });

    this.form.append(this.submitFormButton.getHTML());
    return this.form;
  }

  private createInputFields(): InputFieldModel[] {
    FORM_INPUTS.INPUT_FIELD.forEach((inputFieldParams) => {
      const currentValidateParams = FORM_VALIDATION.default.find(
        (validParams) => validParams.key === inputFieldParams.inputParams.id,
      );

      if (currentValidateParams) {
        const inputField = new InputFieldModel(inputFieldParams, currentValidateParams);
        this.inputFields.push(inputField);
      } else {
        this.inputFields.push(new InputFieldModel(inputFieldParams, null));
      }
    });

    return this.inputFields;
  }

  private createSubmitFormButton(): ButtonModel {
    this.submitFormButton = new ButtonModel({
      attrs: {
        type: BUTTON_TYPE.SUBMIT,
      },
      classes: [styles.submitFormButton],
      text: FORM_SUBMIT_BUTTON_TEXT.LOGIN,
    });

    this.submitFormButton.setDisabled();

    return this.submitFormButton;
  }

  public getHTML(): HTMLFormElement {
    return this.form;
  }

  public getInputFields(): InputFieldModel[] {
    return this.inputFields;
  }

  public getSubmitFormButton(): ButtonModel {
    return this.submitFormButton;
  }
}

export default LoginFormView;
