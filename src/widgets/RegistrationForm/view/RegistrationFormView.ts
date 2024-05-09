import InputFieldModel from '@/entities/InputField/model/InputFieldModel.ts';
import ButtonModel from '@/shared/Button/model/ButtonModel.ts';
import InputModel from '@/shared/Input/model/InputModel.ts';
import getStore from '@/shared/Store/Store.ts';
import { BUTTON_TEXT, BUTTON_TEXT_KEYS, BUTTON_TYPE } from '@/shared/constants/buttons.ts';
import { INPUT_TYPE } from '@/shared/constants/forms.ts';
import * as FORM_CONSTANT from '@/shared/constants/forms/register/constant.ts';
import * as FORM_FIELDS from '@/shared/constants/forms/register/fieldParams.ts';
import * as FORM_VALIDATION from '@/shared/constants/forms/register/validationParams.ts';
import SVG_DETAILS from '@/shared/constants/svg.ts';
import createBaseElement from '@/shared/utils/createBaseElement.ts';
import createSVGUse from '@/shared/utils/createSVGUse.ts';
import observeCurrentLanguage from '@/shared/utils/observeCurrentLanguage.ts';

import styles from './registrationForm.module.scss';

class RegistrationFormView {
  private credentialsWrapper: HTMLDivElement;

  private dateOfBirthField: InputFieldModel;

  private emailField: InputFieldModel;

  private firstNameField: InputFieldModel;

  private form: HTMLFormElement;

  private inputFields: InputFieldModel[] = [];

  private lastNameField: InputFieldModel;

  private passwordField: InputFieldModel;

  private personalDataWrapper: HTMLDivElement;

  private showPasswordElement: HTMLDivElement;

  private submitFormButton: ButtonModel;

  constructor() {
    this.showPasswordElement = this.createShowPasswordElement();
    this.emailField = this.createEmailField();
    this.passwordField = this.createPasswordField();
    this.firstNameField = this.createFirstNameField();
    this.lastNameField = this.createLastNameField();
    this.dateOfBirthField = this.createDateOfBirthField();
    this.credentialsWrapper = this.createCredentialsWrapper();
    this.personalDataWrapper = this.createPersonalDataWrapper();
    this.submitFormButton = this.createSubmitFormButton();
    this.form = this.createHTML();
  }

  private createCredentialsWrapper(): HTMLDivElement {
    this.credentialsWrapper = this.createWrapperElement(
      FORM_CONSTANT.TITLE_TEXT_KEYS.CREDENTIALS,
      [styles.credentialsWrapper],
      [this.emailField, this.passwordField],
    );

    return this.credentialsWrapper;
  }

  private createDateOfBirthField(): InputFieldModel {
    this.dateOfBirthField = new InputFieldModel(FORM_FIELDS.BIRTHDAY, FORM_VALIDATION.BIRTHDAY_VALIDATE);
    this.inputFields.push(this.dateOfBirthField);
    return this.dateOfBirthField;
  }

  private createEmailField(): InputFieldModel {
    this.emailField = new InputFieldModel(FORM_FIELDS.EMAIL, FORM_VALIDATION.EMAIL_VALIDATE);
    this.inputFields.push(this.emailField);
    return this.emailField;
  }

  private createFirstNameField(): InputFieldModel {
    this.firstNameField = new InputFieldModel(FORM_FIELDS.FIRST_NAME, FORM_VALIDATION.FIRST_NAME_VALIDATE);
    this.inputFields.push(this.firstNameField);
    return this.firstNameField;
  }

  private createHTML(): HTMLFormElement {
    this.form = createBaseElement({
      cssClasses: [styles.registrationForm],
      tag: 'form',
    });

    this.form.append(this.credentialsWrapper, this.personalDataWrapper, this.submitFormButton.getHTML());
    return this.form;
  }

  private createLastNameField(): InputFieldModel {
    this.lastNameField = new InputFieldModel(FORM_FIELDS.LAST_NAME, FORM_VALIDATION.LAST_NAME_VALIDATE);
    this.inputFields.push(this.lastNameField);
    return this.lastNameField;
  }

  private createPasswordField(): InputFieldModel {
    this.passwordField = new InputFieldModel(FORM_FIELDS.PASSWORD, FORM_VALIDATION.PASSWORD_VALIDATE);
    this.inputFields.push(this.passwordField);
    const inputElement = this.passwordField.getView().getHTML();
    if (inputElement instanceof HTMLLabelElement) {
      inputElement.append(this.showPasswordElement);
    }
    return this.passwordField;
  }

  private createPersonalDataWrapper(): HTMLDivElement {
    const currentInputFields = [this.firstNameField, this.lastNameField, this.dateOfBirthField];

    this.personalDataWrapper = this.createWrapperElement(
      FORM_CONSTANT.TITLE_TEXT_KEYS.PERSONAL,
      [styles.personalDataWrapper],
      currentInputFields,
    );

    return this.personalDataWrapper;
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
      text: BUTTON_TEXT[currentLanguage].REGISTRATION,
    });

    observeCurrentLanguage(this.submitFormButton.getHTML(), BUTTON_TEXT, BUTTON_TEXT_KEYS.REGISTRATION);

    this.submitFormButton.setDisabled();

    return this.submitFormButton;
  }

  private createWrapperElement(
    title: FORM_CONSTANT.TitleTextKeysType,
    cssClasses: string[],
    inputFields: InputFieldModel[],
  ): HTMLDivElement {
    const { currentLanguage } = getStore().getState();
    const wrapperElement = createBaseElement({
      cssClasses,
      tag: 'div',
    });
    const titleElement = createBaseElement({
      cssClasses: [styles.title],
      innerContent: FORM_CONSTANT.TITLE_TEXT[currentLanguage][title],
      tag: 'h3',
    });
    wrapperElement.append(titleElement);
    observeCurrentLanguage(titleElement, FORM_CONSTANT.TITLE_TEXT, title);

    inputFields.forEach((inputField) => {
      const inputFieldElement = inputField.getView().getHTML();
      const inputHTML = inputField.getView().getInput().getHTML();
      if (inputFieldElement instanceof HTMLLabelElement) {
        inputFieldElement.classList.add(styles.label);
        inputHTML.classList.add(styles.input);
        wrapperElement.append(inputFieldElement);
      } else if (inputFieldElement instanceof InputModel) {
        wrapperElement.append(inputFieldElement.getHTML());
      }
    });
    return wrapperElement;
  }

  public getDateOfBirthField(): InputFieldModel {
    return this.dateOfBirthField;
  }

  public getEmailField(): InputFieldModel {
    return this.emailField;
  }

  public getFirstNameField(): InputFieldModel {
    return this.firstNameField;
  }

  public getHTML(): HTMLFormElement {
    return this.form;
  }

  public getInputFields(): InputFieldModel[] {
    return this.inputFields;
  }

  public getLastNameField(): InputFieldModel {
    return this.lastNameField;
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

export default RegistrationFormView;
