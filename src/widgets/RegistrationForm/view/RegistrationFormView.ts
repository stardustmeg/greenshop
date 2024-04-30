import InputFieldModel from '@/entities/InputField/model/InputFieldModel.ts';
import ButtonModel from '@/shared/Button/model/ButtonModel.ts';
import {
  BUTTON_TYPES,
  FORM_SUBMIT_BUTTON_TEXT,
  REGISTRATION_FORM_INPUT_FIELD_PARAMS,
  REGISTRATION_FORM_INPUT_FIELD_VALIDATION_PARAMS,
  TAG_NAMES,
} from '@/shared/constants/enums.ts';
import createBaseElement from '@/shared/utils/createBaseElement.ts';

import REGISTRATION_FORM_STYLES from './registrationForm.module.scss';

class RegistrationFormView {
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
      cssClasses: [REGISTRATION_FORM_STYLES.registrationForm],
      tag: TAG_NAMES.FORM,
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
    REGISTRATION_FORM_INPUT_FIELD_PARAMS.forEach((inputFieldParams) => {
      const currentValidateParams = REGISTRATION_FORM_INPUT_FIELD_VALIDATION_PARAMS.find(
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
        type: BUTTON_TYPES.SUBMIT,
      },
      text: FORM_SUBMIT_BUTTON_TEXT.REGISTRATION,
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

export default RegistrationFormView;
