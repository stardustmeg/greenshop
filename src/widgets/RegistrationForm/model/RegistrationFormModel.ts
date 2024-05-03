import type InputFieldModel from '@/entities/InputField/model/InputFieldModel.ts';
import type { UserRegisterData } from '@/shared/types/user.ts';

import CountryChoiceModel from '@/features/CountryChoice/model/CountryChoiceModel.ts';
import getCustomerModel from '@/shared/API/customer/model/CustomerModel.ts';
import serverMessageModel from '@/shared/ServerMessage/model/ServerMessageModel.ts';
import getStore from '@/shared/Store/Store.ts';
import { setCurrentUser } from '@/shared/Store/actions.ts';
import { EVENT_NAME } from '@/shared/constants/events.ts';
import {
  REGISTRATION_FORM_BILLING_ADDRESS_COUNTRY_FIELD_PARAMS,
  REGISTRATION_FORM_KEY,
  REGISTRATION_FORM_SHIPPING_ADDRESS_COUNTRY_FIELD_PARAMS,
} from '@/shared/constants/forms.ts';
import { MESSAGE_STATUS, SERVER_MESSAGE } from '@/shared/constants/messages.ts';
import isKeyOfUserData from '@/shared/utils/isKeyOfUserData.ts';

import RegistrationFormView from '../view/RegistrationFormView.ts';

class RegisterFormModel {
  private inputFields: InputFieldModel[] = [];

  private isValidInputFields: Record<string, boolean> = {};

  private userData: UserRegisterData = {
    address: '',
    birthDate: 0,
    city: '',
    country: '',
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    postalCode: '',
  };

  private view: RegistrationFormView = new RegistrationFormView();

  constructor() {
    this.init();
  }

  private createBillingCountryChoice(): boolean {
    const billingAddressInput = this.view
      .getInputFields()
      .find(
        (inputField) =>
          inputField.getView().getInput().getHTML().id ===
          REGISTRATION_FORM_BILLING_ADDRESS_COUNTRY_FIELD_PARAMS.inputParams.id,
      )
      ?.getView()
      .getInput()
      .getHTML();
    const billingAddressWrapper = this.view.getBillingAddressWrapper();

    if (billingAddressInput) {
      const countryChoiceModel = new CountryChoiceModel(billingAddressInput);
      billingAddressWrapper.append(countryChoiceModel.getHTML());
    }
    return true;
  }

  private createShippingCountryChoice(): boolean {
    const shippingAddressInput = this.view
      .getInputFields()
      .find(
        (inputField) =>
          inputField.getView().getInput().getHTML().id ===
          REGISTRATION_FORM_SHIPPING_ADDRESS_COUNTRY_FIELD_PARAMS.inputParams.id,
      )
      ?.getView()
      .getInput()
      .getHTML();
    const shippingAddressWrapper = this.view.getShippingAddressWrapper();

    if (shippingAddressInput) {
      const countryChoiceModel = new CountryChoiceModel(shippingAddressInput);
      shippingAddressWrapper.append(countryChoiceModel.getHTML());
    }
    return true;
  }

  private getFormData(): UserRegisterData {
    this.inputFields.forEach((inputField) => {
      const input = inputField.getView().getInput();
      const inputHTML = input.getHTML();
      const inputValue = input.getValue();

      const key = inputHTML.id.replace(REGISTRATION_FORM_KEY, '');

      if (isKeyOfUserData(this.userData, key)) {
        this.userData[key] = inputValue;
        this.isValidInputFields[inputHTML.id] = false;
      }

      input.clear();
    });

    this.view.getSubmitFormButton().setDisabled();
    return this.userData;
  }

  private init(): boolean {
    this.inputFields = this.view.getInputFields();
    this.inputFields.forEach((inputField) => this.setInputFieldHandlers(inputField));
    this.setPreventDefaultToForm();
    this.setSubmitFormHandler();
    this.createBillingCountryChoice();
    this.createShippingCountryChoice();

    return true;
  }

  private setInputFieldHandlers(inputField: InputFieldModel): boolean {
    const inputHTML = inputField.getView().getInput().getHTML();
    this.isValidInputFields[inputHTML.id] = false;
    inputHTML.addEventListener(EVENT_NAME.INPUT, () => {
      this.isValidInputFields[inputHTML.id] = inputField.getIsValid();
      this.switchSubmitFormButtonAccess();
    });
    return true;
  }

  private setPreventDefaultToForm(): boolean {
    this.getHTML().addEventListener(EVENT_NAME.SUBMIT, (event) => {
      event.preventDefault();
    });

    return true;
  }

  private setSubmitFormHandler(): boolean {
    const submitButton = this.view.getSubmitFormButton().getHTML();
    submitButton.addEventListener(EVENT_NAME.CLICK, () => {
      const formData = this.getFormData();
      const customerModel = getCustomerModel();
      customerModel
        .registrationNewCustomer(formData)
        .then((data) => {
          const userInfo = {
            email: formData.email,
            password: formData.password,
          };
          customerModel
            .authCustomer(userInfo)
            .then(() => getStore().dispatch(setCurrentUser(data)))
            .catch(() => {});
          serverMessageModel.showServerMessage(SERVER_MESSAGE.SUCCESSFUL_REGISTRATION, MESSAGE_STATUS.SUCCESS);
          Object.entries(this.isValidInputFields).forEach(([key]) => {
            this.isValidInputFields[key] = false;
          });
        })
        .catch(() => serverMessageModel.showServerMessage(SERVER_MESSAGE.INCORRECT_REGISTRATION, MESSAGE_STATUS.ERROR));
    });
    return true;
  }

  private switchSubmitFormButtonAccess(): boolean {
    if (Object.values(this.isValidInputFields).every((value) => value)) {
      this.view.getSubmitFormButton().setEnabled();
      this.view.getSubmitFormButton().getHTML().focus();
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
