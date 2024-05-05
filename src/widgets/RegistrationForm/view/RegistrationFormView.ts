import type { InputParams } from '@/shared/types/form';

import InputFieldModel from '@/entities/InputField/model/InputFieldModel.ts';
import ButtonModel from '@/shared/Button/model/ButtonModel.ts';
import InputModel from '@/shared/Input/model/InputModel.ts';
import { BUTTON_TYPE, FORM_SUBMIT_BUTTON_TEXT } from '@/shared/constants/buttons.ts';
import { FORM_TEXT, INPUT_TYPE } from '@/shared/constants/forms.ts';
import * as FORM_CONSTANT from '@/shared/constants/forms/register/constant.ts';
import * as FORM_FIELDS from '@/shared/constants/forms/register/fieldParams.ts';
import * as FORM_VALIDATION from '@/shared/constants/forms/register/validationParams.ts';
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
        inputField.getView().getInput().getHTML().id === FORM_FIELDS.BILLING_ADDRESS_STREET.inputParams.id ||
        inputField.getView().getInput().getHTML().id === FORM_FIELDS.BILLING_ADDRESS_CITY.inputParams.id ||
        inputField.getView().getInput().getHTML().id === FORM_FIELDS.BILLING_ADDRESS_COUNTRY.inputParams.id ||
        inputField.getView().getInput().getHTML().id === FORM_FIELDS.BILLING_ADDRESS_POSTAL_CODE.inputParams.id,
    );

    this.billingAddressWrapper = this.createWrapperElement(
      FORM_CONSTANT.TITLE_TEXT.BILLING_ADDRESS,
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
      autocomplete: FORM_FIELDS.CHECKBOX.AUTOCOMPLETE,
      id: FORM_FIELDS.CHECKBOX.BILLING_ID,
      placeholder: '',
      type: INPUT_TYPE.CHECK_BOX,
    };
    this.checkboxDefaultBillingAddress = new InputModel(checkboxParams);
    return this.checkboxDefaultBillingAddress;
  }

  private createCheckboxDefaultShippingAddress(): InputModel {
    const checkboxParams: InputParams = {
      autocomplete: FORM_FIELDS.CHECKBOX.AUTOCOMPLETE,
      id: FORM_FIELDS.CHECKBOX.SHIPPING_ID,
      placeholder: '',
      type: INPUT_TYPE.CHECK_BOX,
    };
    this.checkboxDefaultShippingAddress = new InputModel(checkboxParams);
    return this.checkboxDefaultShippingAddress;
  }

  private createCheckboxSingleAddress(): InputModel {
    const checkboxParams: InputParams = {
      autocomplete: FORM_FIELDS.CHECKBOX.AUTOCOMPLETE,
      id: FORM_FIELDS.CHECKBOX.SINGLE_ID,
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
        inputField.getView().getInput().getHTML().id === FORM_FIELDS.PASSWORD.inputParams.id ||
        inputField.getView().getInput().getHTML().id === FORM_FIELDS.EMAIL.inputParams.id,
    );

    this.credentialsWrapper = this.createWrapperElement(
      FORM_CONSTANT.TITLE_TEXT.CREDENTIALS,
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
    FORM_FIELDS.INPUT.forEach((inputFieldParams) => {
      const currentValidateParams = FORM_VALIDATION.INPUT_VALIDATION.find(
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
        inputField.getView().getInput().getHTML().id === FORM_FIELDS.FIRST_NAME.inputParams.id ||
        inputField.getView().getInput().getHTML().id === FORM_FIELDS.LAST_NAME.inputParams.id ||
        inputField.getView().getInput().getHTML().id === FORM_FIELDS.BIRTHDAY.inputParams.id,
    );

    this.personalDataWrapper = this.createWrapperElement(
      FORM_CONSTANT.TITLE_TEXT.PERSONAL,
      [styles.personalDataWrapper],
      filteredInputFields,
    );

    return this.personalDataWrapper;
  }

  private createShippingAddressWrapper(): HTMLDivElement {
    const copyInputFields = this.inputFields;
    const filteredInputFields = copyInputFields.filter(
      (inputField) =>
        inputField.getView().getInput().getHTML().id === FORM_FIELDS.SHIPPING_ADDRESS_STREET.inputParams.id ||
        inputField.getView().getInput().getHTML().id === FORM_FIELDS.SHIPPING_ADDRESS_CITY.inputParams.id ||
        inputField.getView().getInput().getHTML().id === FORM_FIELDS.SHIPPING_ADDRESS_COUNTRY.inputParams.id ||
        inputField.getView().getInput().getHTML().id === FORM_FIELDS.SHIPPING_ADDRESS_POSTAL_CODE.inputParams.id,
    );

    this.shippingAddressWrapper = this.createWrapperElement(
      FORM_CONSTANT.TITLE_TEXT.SHIPPING_ADDRESS,
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

  public getCheckboxDefaultBillingAddress(): InputModel {
    return this.checkboxDefaultBillingAddress;
  }

  public getCheckboxDefaultShippingAddress(): InputModel {
    return this.checkboxDefaultShippingAddress;
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
