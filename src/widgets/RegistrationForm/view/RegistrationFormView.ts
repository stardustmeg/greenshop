import type { InputParams } from '@/shared/types/interfaces';

import InputFieldModel from '@/entities/InputField/model/InputFieldModel.ts';
import ButtonModel from '@/shared/Button/model/ButtonModel.ts';
import InputModel from '@/shared/Input/model/InputModel.ts';
import {
  BUTTON_TYPES,
  CHECKBOX_PARAMS,
  FORM_SUBMIT_BUTTON_TEXT,
  FORM_TEXT,
  INPUT_TYPES,
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
  TAG_NAMES,
} from '@/shared/constants/enums.ts';
import createBaseElement from '@/shared/utils/createBaseElement.ts';

import REGISTRATION_FORM_STYLES from './registrationForm.module.scss';

class RegistrationFormView {
  private billingAddressWrapper: HTMLDivElement;

  private checkboxDefaultBillingAddress: InputModel;

  private checkboxDefaultShippingAddress: InputModel;

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
      [REGISTRATION_FORM_STYLES.billingAddressWrapper],
      filteredInputFields,
    );

    const checkBoxLabel = createBaseElement({
      cssClasses: [REGISTRATION_FORM_STYLES.checkboxLabel],
      tag: TAG_NAMES.LABEL,
    });

    const checkBoxText = createBaseElement({
      cssClasses: [REGISTRATION_FORM_STYLES.checkboxText],
      innerContent: FORM_TEXT.DEFAULT_ADDRESS,
      tag: TAG_NAMES.SPAN,
    });

    checkBoxLabel.append(checkBoxText, this.checkboxDefaultBillingAddress.getHTML());

    this.billingAddressWrapper.append(checkBoxLabel);

    return this.billingAddressWrapper;
  }

  private createCheckboxDefaultBillingAddress(): InputModel {
    const checkboxParams: InputParams = {
      autocomplete: CHECKBOX_PARAMS.AUTOCOMPLETE,
      id: CHECKBOX_PARAMS.BILLING_ID,
      placeholder: '',
      type: INPUT_TYPES.CHECK_BOX,
    };
    this.checkboxDefaultBillingAddress = new InputModel(checkboxParams);
    return this.checkboxDefaultBillingAddress;
  }

  private createCheckboxDefaultShippingAddress(): InputModel {
    const checkboxParams: InputParams = {
      autocomplete: CHECKBOX_PARAMS.AUTOCOMPLETE,
      id: CHECKBOX_PARAMS.SHIPPING_ID,
      placeholder: '',
      type: INPUT_TYPES.CHECK_BOX,
    };
    this.checkboxDefaultShippingAddress = new InputModel(checkboxParams);
    return this.checkboxDefaultShippingAddress;
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
      [REGISTRATION_FORM_STYLES.credentialsWrapper],
      filteredInputFields,
    );

    return this.credentialsWrapper;
  }

  private createHTML(): HTMLFormElement {
    this.form = createBaseElement({
      cssClasses: [REGISTRATION_FORM_STYLES.registrationForm],
      tag: TAG_NAMES.FORM,
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
      [REGISTRATION_FORM_STYLES.personalDataWrapper],
      filteredInputFields,
    );

    return this.personalDataWrapper;
  }

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
      [REGISTRATION_FORM_STYLES.shippingAddressWrapper],
      filteredInputFields,
    );

    const checkBoxLabel = createBaseElement({
      cssClasses: [REGISTRATION_FORM_STYLES.checkboxLabel],
      tag: TAG_NAMES.LABEL,
    });

    const checkBoxText = createBaseElement({
      cssClasses: [REGISTRATION_FORM_STYLES.checkboxText],
      innerContent: FORM_TEXT.DEFAULT_ADDRESS,
      tag: TAG_NAMES.SPAN,
    });

    checkBoxLabel.append(checkBoxText, this.checkboxDefaultShippingAddress.getHTML());

    this.shippingAddressWrapper.append(checkBoxLabel);

    return this.shippingAddressWrapper;
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

  private createWrapperElement(title: string, cssClasses: string[], inputFields: InputFieldModel[]): HTMLDivElement {
    const wrapperElement = createBaseElement({
      cssClasses,
      tag: TAG_NAMES.DIV,
    });
    const titleElement = createBaseElement({
      cssClasses: [REGISTRATION_FORM_STYLES.title],
      innerContent: title,
      tag: TAG_NAMES.H3,
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

  public getSubmitFormButton(): ButtonModel {
    return this.submitFormButton;
  }
}

export default RegistrationFormView;
