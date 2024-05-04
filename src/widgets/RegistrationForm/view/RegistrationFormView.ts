import type { InputParams } from '@/shared/types/form';

import InputFieldModel from '@/entities/InputField/model/InputFieldModel.ts';
import ButtonModel from '@/shared/Button/model/ButtonModel.ts';
import InputModel from '@/shared/Input/model/InputModel.ts';
import { BUTTON_TYPE, FORM_SUBMIT_BUTTON_TEXT } from '@/shared/constants/buttons.ts';
import {
  CHECKBOX_PARAMS,
  FORM_TEXT,
  INPUT_TYPE,
  REGISTRATION_FORM_BILLING_ADDRESS_CITY_FIELD_PARAMS,
  REGISTRATION_FORM_BILLING_ADDRESS_COUNTRY_FIELD_PARAMS,
  REGISTRATION_FORM_BILLING_ADDRESS_POSTAL_CODE_FIELD_PARAMS,
  REGISTRATION_FORM_BILLING_ADDRESS_STREET_FIELD_PARAMS,
  REGISTRATION_FORM_BIRTHDAY_FIELD_PARAMS,
  REGISTRATION_FORM_EMAIL_FIELD_PARAMS,
  REGISTRATION_FORM_FIRST_NAME_FIELD_PARAMS,
  REGISTRATION_FORM_INPUT_FIELD_PARAMS,
  REGISTRATION_FORM_INPUT_FIELD_VALIDATION_PARAMS,
  REGISTRATION_FORM_LAST_NAME_FIELD_PARAMS,
  REGISTRATION_FORM_PASSWORD_FIELD_PARAMS,
  REGISTRATION_FORM_SHIPPING_ADDRESS_CITY_FIELD_PARAMS,
  REGISTRATION_FORM_SHIPPING_ADDRESS_COUNTRY_FIELD_PARAMS,
  REGISTRATION_FORM_SHIPPING_ADDRESS_POSTAL_CODE_FIELD_PARAMS,
  REGISTRATION_FORM_SHIPPING_ADDRESS_STREET_FIELD_PARAMS,
  REGISTRATION_FORM_TITLE_TEXT,
} from '@/shared/constants/forms.ts';
import TAG_NAME from '@/shared/constants/tags.ts';
import createBaseElement from '@/shared/utils/createBaseElement.ts';

import styles from './registrationForm.module.scss';

class RegistrationFormView {
  private billingAddressWrapper: HTMLDivElement;

  private checkboxDefaultBillingAddress: InputModel;

  private checkboxDefaultShippingAddress: InputModel;

  private checkboxSingleAddress: InputModel;

  private credentialsWrapper: HTMLDivElement;

  private form: HTMLFormElement;

  private inputFields: InputFieldModel[] = [];

  private personalDataWrapper: HTMLDivElement;

  private shippingAddressWrapper: HTMLDivElement;

  private submitFormButton: ButtonModel;

  constructor() {
    this.inputFields = this.createInputFields();
    this.credentialsWrapper = this.createCredentialsWrapper();
    this.personalDataWrapper = this.createPersonalDataWrapper();
    this.checkboxSingleAddress = this.createCheckboxSingleAddress();
    this.checkboxDefaultShippingAddress = this.createCheckboxDefaultShippingAddress();
    this.shippingAddressWrapper = this.createShippingAddressWrapper();
    this.checkboxDefaultBillingAddress = this.createCheckboxDefaultBillingAddress();
    this.billingAddressWrapper = this.createBillingAddressWrapper();
    this.submitFormButton = this.createSubmitFormButton();
    this.form = this.createHTML();
  }

  private createBillingAddressWrapper(): HTMLDivElement {
    const copyInputFields = this.inputFields;
    const filteredInputFields = copyInputFields.filter(
      (inputField) =>
        inputField.getView().getInput().getHTML().id ===
          REGISTRATION_FORM_BILLING_ADDRESS_STREET_FIELD_PARAMS.inputParams.id ||
        inputField.getView().getInput().getHTML().id ===
          REGISTRATION_FORM_BILLING_ADDRESS_CITY_FIELD_PARAMS.inputParams.id ||
        inputField.getView().getInput().getHTML().id ===
          REGISTRATION_FORM_BILLING_ADDRESS_COUNTRY_FIELD_PARAMS.inputParams.id ||
        inputField.getView().getInput().getHTML().id ===
          REGISTRATION_FORM_BILLING_ADDRESS_POSTAL_CODE_FIELD_PARAMS.inputParams.id,
    );

    this.billingAddressWrapper = this.createWrapperElement(
      REGISTRATION_FORM_TITLE_TEXT.BILLING_ADDRESS,
      [styles.billingAddressWrapper],
      filteredInputFields,
    );

    const checkBoxLabel = createBaseElement({
      cssClasses: [styles.checkboxLabel],
      tag: TAG_NAME.LABEL,
    });

    const checkBoxText = createBaseElement({
      cssClasses: [styles.checkboxText],
      innerContent: FORM_TEXT.DEFAULT_ADDRESS,
      tag: TAG_NAME.SPAN,
    });

    checkBoxLabel.append(checkBoxText, this.checkboxDefaultBillingAddress.getHTML());

    this.billingAddressWrapper.append(checkBoxLabel);

    return this.billingAddressWrapper;
  }

  private createCheckBoxLabel(innerContent: string, checkBoxElement: HTMLInputElement): HTMLLabelElement {
    const checkboxLabel = createBaseElement({
      cssClasses: [styles.checkboxLabel],
      tag: TAG_NAME.LABEL,
    });

    const checkBoxText = createBaseElement({
      cssClasses: [styles.checkboxText],
      innerContent,
      tag: TAG_NAME.SPAN,
    });

    checkboxLabel.append(checkBoxText, checkBoxElement);
    return checkboxLabel;
  }

  private createCheckboxDefaultBillingAddress(): InputModel {
    const checkboxParams: InputParams = {
      autocomplete: CHECKBOX_PARAMS.AUTOCOMPLETE,
      id: CHECKBOX_PARAMS.BILLING_ID,
      placeholder: '',
      type: INPUT_TYPE.CHECK_BOX,
    };
    this.checkboxDefaultBillingAddress = new InputModel(checkboxParams);
    return this.checkboxDefaultBillingAddress;
  }

  private createCheckboxDefaultShippingAddress(): InputModel {
    const checkboxParams: InputParams = {
      autocomplete: CHECKBOX_PARAMS.AUTOCOMPLETE,
      id: CHECKBOX_PARAMS.SHIPPING_ID,
      placeholder: '',
      type: INPUT_TYPE.CHECK_BOX,
    };
    this.checkboxDefaultShippingAddress = new InputModel(checkboxParams);
    return this.checkboxDefaultShippingAddress;
  }

  private createCheckboxSingleAddress(): InputModel {
    const checkboxParams: InputParams = {
      autocomplete: CHECKBOX_PARAMS.AUTOCOMPLETE,
      id: CHECKBOX_PARAMS.SINGLE_ID,
      placeholder: '',
      type: INPUT_TYPE.CHECK_BOX,
    };
    this.checkboxSingleAddress = new InputModel(checkboxParams);

    return this.checkboxSingleAddress;
  }

  private createCredentialsWrapper(): HTMLDivElement {
    const copyInputFields = this.inputFields;
    const filteredInputFields = copyInputFields.filter(
      (inputField) =>
        inputField.getView().getInput().getHTML().id === REGISTRATION_FORM_PASSWORD_FIELD_PARAMS.inputParams.id ||
        inputField.getView().getInput().getHTML().id === REGISTRATION_FORM_EMAIL_FIELD_PARAMS.inputParams.id,
    );

    this.credentialsWrapper = this.createWrapperElement(
      REGISTRATION_FORM_TITLE_TEXT.CREDENTIALS,
      [styles.credentialsWrapper],
      filteredInputFields,
    );

    return this.credentialsWrapper;
  }

  private createHTML(): HTMLFormElement {
    this.form = createBaseElement({
      cssClasses: [styles.registrationForm],
      tag: TAG_NAME.FORM,
    });

    this.form.append(
      this.credentialsWrapper,
      this.personalDataWrapper,
      this.shippingAddressWrapper,
      this.billingAddressWrapper,
      this.submitFormButton.getHTML(),
    );
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

  private createPersonalDataWrapper(): HTMLDivElement {
    const copyInputFields = this.inputFields;
    const filteredInputFields = copyInputFields.filter(
      (inputField) =>
        inputField.getView().getInput().getHTML().id === REGISTRATION_FORM_FIRST_NAME_FIELD_PARAMS.inputParams.id ||
        inputField.getView().getInput().getHTML().id === REGISTRATION_FORM_LAST_NAME_FIELD_PARAMS.inputParams.id ||
        inputField.getView().getInput().getHTML().id === REGISTRATION_FORM_BIRTHDAY_FIELD_PARAMS.inputParams.id,
    );

    this.personalDataWrapper = this.createWrapperElement(
      REGISTRATION_FORM_TITLE_TEXT.PERSONAL,
      [styles.personalDataWrapper],
      filteredInputFields,
    );

    return this.personalDataWrapper;
  }

  // eslint-disable-next-line max-lines-per-function
  private createShippingAddressWrapper(): HTMLDivElement {
    const copyInputFields = this.inputFields;
    const filteredInputFields = copyInputFields.filter(
      (inputField) =>
        inputField.getView().getInput().getHTML().id ===
          REGISTRATION_FORM_SHIPPING_ADDRESS_STREET_FIELD_PARAMS.inputParams.id ||
        inputField.getView().getInput().getHTML().id ===
          REGISTRATION_FORM_SHIPPING_ADDRESS_CITY_FIELD_PARAMS.inputParams.id ||
        inputField.getView().getInput().getHTML().id ===
          REGISTRATION_FORM_SHIPPING_ADDRESS_COUNTRY_FIELD_PARAMS.inputParams.id ||
        inputField.getView().getInput().getHTML().id ===
          REGISTRATION_FORM_SHIPPING_ADDRESS_POSTAL_CODE_FIELD_PARAMS.inputParams.id,
    );

    this.shippingAddressWrapper = this.createWrapperElement(
      REGISTRATION_FORM_TITLE_TEXT.SHIPPING_ADDRESS,
      [styles.shippingAddressWrapper],
      filteredInputFields,
    );

    const settingsAddressWrapper = createBaseElement({
      cssClasses: [styles.settingsAddressWrapper],
      tag: TAG_NAME.DIV,
    });

    settingsAddressWrapper.append(
      this.createCheckBoxLabel(FORM_TEXT.DEFAULT_ADDRESS, this.checkboxDefaultShippingAddress.getHTML()),
      this.createCheckBoxLabel(FORM_TEXT.SINGLE_ADDRESS, this.checkboxSingleAddress.getHTML()),
    );

    this.shippingAddressWrapper.append(settingsAddressWrapper);

    return this.shippingAddressWrapper;
  }

  private createSubmitFormButton(): ButtonModel {
    this.submitFormButton = new ButtonModel({
      attrs: {
        type: BUTTON_TYPE.SUBMIT,
      },
      text: FORM_SUBMIT_BUTTON_TEXT.REGISTRATION,
    });

    this.submitFormButton.setDisabled();

    return this.submitFormButton;
  }

  private createWrapperElement(title: string, cssClasses: string[], inputFields: InputFieldModel[]): HTMLDivElement {
    const wrapperElement = createBaseElement({
      cssClasses,
      tag: TAG_NAME.DIV,
    });
    const titleElement = createBaseElement({
      cssClasses: [styles.title],
      innerContent: title,
      tag: TAG_NAME.H3,
    });
    wrapperElement.append(titleElement);

    inputFields.forEach((inputField) => {
      const inputFieldElement = inputField.getView().getHTML();
      if (inputFieldElement instanceof HTMLLabelElement) {
        wrapperElement.append(inputFieldElement);
      } else if (inputFieldElement instanceof InputModel) {
        wrapperElement.append(inputFieldElement.getHTML());
      }
    });
    return wrapperElement;
  }

  public getBillingAddressWrapper(): HTMLDivElement {
    return this.billingAddressWrapper;
  }

  public getHTML(): HTMLFormElement {
    return this.form;
  }

  public getInputFields(): InputFieldModel[] {
    return this.inputFields;
  }

  public getShippingAddressWrapper(): HTMLDivElement {
    return this.shippingAddressWrapper;
  }

  public getSingleAddressCheckBox(): InputModel {
    return this.checkboxSingleAddress;
  }

  public getSubmitFormButton(): ButtonModel {
    return this.submitFormButton;
  }

  public switchVisibilityBillingAddressWrapper(isVisible: boolean): void {
    this.billingAddressWrapper.classList.toggle(styles.hidden, isVisible);
  }
}

export default RegistrationFormView;
