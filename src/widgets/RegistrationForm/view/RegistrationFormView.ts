import InputFieldModel from '@/entities/InputField/model/InputFieldModel.ts';
import ButtonModel from '@/shared/Button/model/ButtonModel.ts';
import {
  BUTTON_TYPES,
  COUNTRIES,
  FORM_SUBMIT_BUTTON_TEXT,
  REGISTRATION_FORM_INPUT_FIELD_PARAMS,
  REGISTRATION_FORM_INPUT_FIELD_VALIDATION_PARAMS,
  TAG_NAMES,
} from '@/shared/constants/enums.ts';
import createBaseElement from '@/shared/utils/createBaseElement.ts';

import REGISTRATION_FORM_STYLES from './registrationForm.module.scss';

class RegistrationFormView {
  private countryDropList: HTMLDivElement;

  private countryItems: HTMLDivElement[] = [];

  private countryWrapper: HTMLDivElement;

  private form: HTMLFormElement;

  private inputFields: InputFieldModel[] = [];

  private submitFormButton: ButtonModel;

  constructor() {
    this.inputFields = this.createInputFields();
    this.submitFormButton = this.createSubmitFormButton();
    this.countryDropList = this.createCountryDropList();
    this.countryWrapper = this.createCountryWrapper();
    this.form = this.createHTML();
  }

  private createCountryDropList(): HTMLDivElement {
    this.countryDropList = createBaseElement({
      cssClasses: [REGISTRATION_FORM_STYLES.countryDropList, REGISTRATION_FORM_STYLES.hidden],
      tag: TAG_NAMES.DIV,
    });

    Object.entries(COUNTRIES).forEach(([countryCode]) => {
      this.countryDropList.append(this.createCountryItem(countryCode));
    });

    return this.countryDropList;
  }

  private createCountryItem(countryCode: string): HTMLDivElement {
    const countryItem = createBaseElement({
      cssClasses: [REGISTRATION_FORM_STYLES.countryItem],
      innerContent: countryCode,
      tag: TAG_NAMES.DIV,
    });

    this.countryItems.push(countryItem);

    return countryItem;
  }

  private createCountryWrapper(): HTMLDivElement {
    this.countryWrapper = createBaseElement({
      cssClasses: [REGISTRATION_FORM_STYLES.countryWrapper],
      tag: TAG_NAMES.DIV,
    });

    return this.countryWrapper;
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

    this.countryWrapper.append(this.countryDropList);
    this.form.append(this.countryWrapper, this.submitFormButton.getHTML());
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

  public getCountryDropList(): HTMLDivElement {
    return this.countryDropList;
  }

  public getCountryItems(): HTMLDivElement[] {
    return this.countryItems;
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

  public hideCountryDropList(): void {
    this.countryDropList.classList.add(REGISTRATION_FORM_STYLES.hidden);
  }

  public showCountryDropList(): void {
    this.countryDropList.classList.remove(REGISTRATION_FORM_STYLES.hidden);
  }

  public switchVisibilityCountryItems(inputHTML: HTMLInputElement): boolean {
    const filterValue = inputHTML.value.toLowerCase();
    this.countryItems.forEach((countryItem) => {
      const itemValue = countryItem.textContent?.toLowerCase();
      countryItem.classList.toggle(REGISTRATION_FORM_STYLES.hidden, !itemValue?.includes(filterValue));
    });

    return true;
  }
}

export default RegistrationFormView;
