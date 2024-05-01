import type InputFieldModel from '@/entities/InputField/model/InputFieldModel.ts';

import { EVENT_NAMES, REGISTRATION_FORM_COUNTRY_FIELD_VALIDATE_PARAMS } from '@/shared/constants/enums.ts';

import RegistrationFormView from '../view/RegistrationFormView.ts';
import REGISTRATION_FORM_STYLES from '../view/registrationForm.module.scss';

class RegisterFormModel {
  private inputFields: InputFieldModel[] = [];

  private isValidInputFields: Record<string, boolean> = {};

  private view: RegistrationFormView = new RegistrationFormView();

  constructor() {
    this.init();
  }

  private init(): boolean {
    this.inputFields = this.view.getInputFields();
    this.inputFields.forEach((inputField) => this.setInputFieldHandlers(inputField));
    this.setPreventDefaultToForm();

    return true;
  }

  private setCountryItemsHandlers(input: HTMLInputElement): boolean {
    const inputHTML = input;
    this.view.getCountryItems().forEach((countryItem) => {
      const currentItem = countryItem;
      currentItem.addEventListener(EVENT_NAMES.CLICK, () => {
        if (currentItem.textContent) {
          inputHTML.value = currentItem.textContent;
          const event = new Event(EVENT_NAMES.INPUT);
          inputHTML.dispatchEvent(event);
          this.view.hideCountryDropList();
        }
      });
    });
    return true;
  }

  private setInputFieldHandlers(inputField: InputFieldModel): boolean {
    const inputHTML = inputField.getView().getInput().getHTML();
    this.isValidInputFields[inputHTML.id] = false;
    inputHTML.addEventListener(EVENT_NAMES.INPUT, () => {
      this.isValidInputFields[inputHTML.id] = inputField.getIsValid();
      this.switchSubmitFormButtonAccess();
    });

    if (inputHTML.id === REGISTRATION_FORM_COUNTRY_FIELD_VALIDATE_PARAMS.key) {
      this.setCountryItemsHandlers(inputHTML);
      inputHTML.addEventListener(EVENT_NAMES.FOCUS, () => this.view.showCountryDropList());
      inputHTML.addEventListener(EVENT_NAMES.INPUT, () => this.view.switchVisibilityCountryItems(inputHTML));
      document.addEventListener(EVENT_NAMES.CLICK, (event) => {
        const countryDropList = this.view.getCountryDropList();
        if (!countryDropList.classList.contains(REGISTRATION_FORM_STYLES.hidden) && event.target !== inputHTML) {
          this.view.hideCountryDropList();
        }
      });
    }
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

export default RegisterFormModel;
