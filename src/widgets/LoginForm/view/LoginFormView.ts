import InputFieldModel from '@/entities/InputField/model/InputFieldModel.ts';
import ButtonModel from '@/shared/Button/model/ButtonModel.ts';
import getStore from '@/shared/Store/Store.ts';
import { BUTTON_TEXT, BUTTON_TEXT_KEYS, BUTTON_TYPE } from '@/shared/constants/buttons.ts';
import { INPUT_TYPE } from '@/shared/constants/forms.ts';
import * as FORM_INPUTS from '@/shared/constants/forms/login/fieldParams.ts';
import * as FORM_VALIDATION from '@/shared/constants/forms/login/validationParams.ts';
import SVG_DETAILS from '@/shared/constants/svg.ts';
import createBaseElement from '@/shared/utils/createBaseElement.ts';
import createSVGUse from '@/shared/utils/createSVGUse.ts';
import observeCurrentLanguage from '@/shared/utils/observeCurrentLanguage.ts';

import styles from './loginForm.module.scss';

class LoginFormView {
  private emailField: InputFieldModel;

  private form: HTMLFormElement;

  private inputFields: InputFieldModel[] = [];

  private passwordField: InputFieldModel;

  private showPasswordElement: HTMLDivElement;

  private submitFormButton: ButtonModel;

  constructor() {
    this.showPasswordElement = this.createShowPasswordElement();
    this.emailField = this.createEmailField();
    this.passwordField = this.createPasswordField();
    this.submitFormButton = this.createSubmitFormButton();
    this.form = this.createHTML();
  }

  private createEmailField(): InputFieldModel {
    this.emailField = new InputFieldModel(FORM_INPUTS.EMAIL_FIELD, FORM_VALIDATION.EMAIL_FIELD_VALIDATE);
    this.inputFields.push(this.emailField);
    return this.emailField;
  }

  private createHTML(): HTMLFormElement {
    this.form = createBaseElement({
      cssClasses: [styles.loginForm],
      tag: 'form',
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

  private createPasswordField(): InputFieldModel {
    this.passwordField = new InputFieldModel(FORM_INPUTS.PASSWORD_FIELD, FORM_VALIDATION.PASSWORD_FIELD_VALIDATE);
    this.inputFields.push(this.passwordField);
    const inputElement = this.passwordField.getView().getHTML();
    if (inputElement instanceof HTMLLabelElement) {
      inputElement.append(this.showPasswordElement);
    }
    return this.passwordField;
  }

  private createShowPasswordElement(): HTMLDivElement {
    this.showPasswordElement = createBaseElement({
      cssClasses: [styles.showPasswordElement],
      tag: 'div',
    });
    this.switchPasswordElementSVG(INPUT_TYPE.PASSWORD);
    return this.showPasswordElement;
  }

  private createSubmitFormButton(): ButtonModel {
    const { currentLanguage } = getStore().getState();
    this.submitFormButton = new ButtonModel({
      attrs: {
        type: BUTTON_TYPE.SUBMIT,
      },
      classes: [styles.submitFormButton],
      text: BUTTON_TEXT[currentLanguage].LOGIN,
    });

    observeCurrentLanguage(this.submitFormButton.getHTML(), BUTTON_TEXT, BUTTON_TEXT_KEYS.LOGIN);

    this.submitFormButton.setDisabled();

    return this.submitFormButton;
  }

  public getEmailField(): InputFieldModel {
    return this.emailField;
  }

  public getHTML(): HTMLFormElement {
    return this.form;
  }

  public getInputFields(): InputFieldModel[] {
    return this.inputFields;
  }

  public getPasswordField(): InputFieldModel {
    return this.passwordField;
  }

  public getShowPasswordElement(): HTMLDivElement {
    return this.showPasswordElement;
  }

  public getSubmitFormButton(): ButtonModel {
    return this.submitFormButton;
  }

  public switchPasswordElementSVG(type: string): SVGSVGElement {
    const svg = document.createElementNS(SVG_DETAILS.SVG_URL, 'svg');
    this.showPasswordElement.innerHTML = '';
    svg.append(createSVGUse(type === INPUT_TYPE.PASSWORD ? SVG_DETAILS.CLOSE_EYE : SVG_DETAILS.OPEN_EYE));
    this.showPasswordElement.append(svg);
    return svg;
  }
}

export default LoginFormView;
