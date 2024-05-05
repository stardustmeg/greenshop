import type InputFieldModel from '@/entities/InputField/model/InputFieldModel.ts';
import type { Address, User } from '@/shared/types/user.ts';

import CountryChoiceModel from '@/features/CountryChoice/model/CountryChoiceModel.ts';
import getCustomerModel, { CustomerModel } from '@/shared/API/customer/model/CustomerModel.ts';
import serverMessageModel from '@/shared/ServerMessage/model/ServerMessageModel.ts';
import getStore from '@/shared/Store/Store.ts';
import { setCurrentUser } from '@/shared/Store/actions.ts';
import { EVENT_NAME } from '@/shared/constants/events.ts';
import {
  REGISTRATION_FORM_BILLING_ADDRESS_CITY_FIELD_PARAMS,
  REGISTRATION_FORM_BILLING_ADDRESS_COUNTRY_FIELD_PARAMS,
  REGISTRATION_FORM_BILLING_ADDRESS_POSTAL_CODE_FIELD_PARAMS,
  REGISTRATION_FORM_BILLING_ADDRESS_STREET_FIELD_PARAMS,
  REGISTRATION_FORM_KEY,
  REGISTRATION_FORM_SHIPPING_ADDRESS_CITY_FIELD_PARAMS,
  REGISTRATION_FORM_SHIPPING_ADDRESS_COUNTRY_FIELD_PARAMS,
  REGISTRATION_FORM_SHIPPING_ADDRESS_POSTAL_CODE_FIELD_PARAMS,
  REGISTRATION_FORM_SHIPPING_ADDRESS_STREET_FIELD_PARAMS,
} from '@/shared/constants/forms.ts';
import { MESSAGE_STATUS, SERVER_MESSAGE } from '@/shared/constants/messages.ts';
import isKeyOfUserData from '@/shared/utils/isKeyOfUserData.ts';

import RegistrationFormView from '../view/RegistrationFormView.ts';

class RegisterFormModel {
  private inputFields: InputFieldModel[] = [];

  private isValidInputFields: Record<string, boolean> = {};

  private userData: User = {
    addresses: [],
    birthDate: '',
    defaultBillingAddressId: null,
    defaultShippingAddressId: null,
    email: '',
    firstName: '',
    id: '',
    lastName: '',
    locale: '',
    password: '',
    version: 0,
  };

  private view: RegistrationFormView = new RegistrationFormView();

  constructor() {
    this.init();
  }

  private createBillingCountryChoice(): boolean {
    return this.createCountryChoice(
      REGISTRATION_FORM_BILLING_ADDRESS_COUNTRY_FIELD_PARAMS.inputParams.id,
      this.view.getBillingAddressWrapper(),
    );
  }

  private createCountryChoice(inputFieldId: string, wrapper: HTMLElement): boolean {
    const addressInput = this.view
      .getInputFields()
      .find((inputField) => inputField.getView().getInput().getHTML().id === inputFieldId)
      ?.getView()
      .getInput()
      .getHTML();

    if (addressInput) {
      const countryChoiceModel = new CountryChoiceModel(addressInput);
      wrapper.append(countryChoiceModel.getHTML());
    }
    return true;
  }

  private createShippingCountryChoice(): boolean {
    return this.createCountryChoice(
      REGISTRATION_FORM_SHIPPING_ADDRESS_COUNTRY_FIELD_PARAMS.inputParams.id,
      this.view.getShippingAddressWrapper(),
    );
  }

  private getAddressDataFromBillingForm(): Address {
    const addressData: Address = {
      city: this.getAddressValue(REGISTRATION_FORM_BILLING_ADDRESS_CITY_FIELD_PARAMS),
      country: getStore().getState().billingCountry,
      email: this.userData.email,
      firstName: this.userData.firstName,
      id: '',
      lastName: this.userData.lastName,
      postalCode: this.getAddressValue(REGISTRATION_FORM_BILLING_ADDRESS_POSTAL_CODE_FIELD_PARAMS),
      state: '',
      streetName: this.getAddressValue(REGISTRATION_FORM_BILLING_ADDRESS_STREET_FIELD_PARAMS),
      streetNumber: '',
    };
    return addressData;
  }

  private getAddressDataFromShippingForm(): Address {
    const addressData: Address = {
      city: this.getAddressValue(REGISTRATION_FORM_SHIPPING_ADDRESS_CITY_FIELD_PARAMS),
      country: getStore().getState().shippingCountry,
      email: this.userData.email,
      firstName: this.userData.firstName,
      id: '',
      lastName: this.userData.lastName,
      postalCode: this.getAddressValue(REGISTRATION_FORM_SHIPPING_ADDRESS_POSTAL_CODE_FIELD_PARAMS),
      state: '',
      streetName: this.getAddressValue(REGISTRATION_FORM_SHIPPING_ADDRESS_STREET_FIELD_PARAMS),
      streetNumber: '',
    };
    return addressData;
  }

  private getAddressValue(field: { inputParams: { id: string } }): string {
    return (
      this.inputFields
        .find((inputField) => inputField.getView().getInput().getHTML().id === field.inputParams.id)
        ?.getView()
        .getValue() || ''
    );
  }

  private getFormUserData(): User {
    this.inputFields.forEach((inputField) => {
      const input = inputField.getView().getInput();
      const inputHTML = input.getHTML();
      const inputValue = input.getValue();

      const key = inputHTML.id.replace(REGISTRATION_FORM_KEY, '');

      if (isKeyOfUserData(this.userData, key)) {
        this.userData[key] = inputValue;
        this.isValidInputFields[inputHTML.id] = false;
        input.clear();
      }
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
    const checkboxSingleAddress = this.view.getSingleAddressCheckBox().getHTML();
    checkboxSingleAddress.addEventListener(EVENT_NAME.CHANGE, () =>
      this.singleAddressCheckBoxHandler(checkboxSingleAddress.checked),
    );
    return true;
  }

  private loginUser(): void {
    const userDataWithLogin = {
      email: this.userData.email,
      password: this.userData.password,
    };
    getCustomerModel()
      .authCustomer(userDataWithLogin)
      .then(() => getStore().dispatch(setCurrentUser(this.userData)))
      .catch(() => {});
  }

  private registerUser(): void {
    this.getFormUserData();
    getCustomerModel()
      .registrationNewCustomer(this.userData)
      .then((newUserData) => {
        if (newUserData) {
          this.successfulUserRegistration(newUserData);
          serverMessageModel.showServerMessage(SERVER_MESSAGE.SUCCESSFUL_REGISTRATION, MESSAGE_STATUS.SUCCESS);
        }
      })
      .catch(() => {
        serverMessageModel.showServerMessage(SERVER_MESSAGE.INCORRECT_REGISTRATION, MESSAGE_STATUS.ERROR);
      });
  }

  private resetInputFieldsValidation(): void {
    Object.entries(this.isValidInputFields).forEach(([key]) => {
      this.isValidInputFields[key] = false;
    });
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
    submitButton.addEventListener(EVENT_NAME.CLICK, () => this.registerUser());
    return true;
  }

  private singleAddressCheckBoxHandler(isChecked: boolean): boolean {
    const billingAddressFieldID = [
      REGISTRATION_FORM_BILLING_ADDRESS_COUNTRY_FIELD_PARAMS.inputParams.id,
      REGISTRATION_FORM_BILLING_ADDRESS_STREET_FIELD_PARAMS.inputParams.id,
      REGISTRATION_FORM_BILLING_ADDRESS_CITY_FIELD_PARAMS.inputParams.id,
      REGISTRATION_FORM_BILLING_ADDRESS_POSTAL_CODE_FIELD_PARAMS.inputParams.id,
    ];

    this.view.switchVisibilityBillingAddressWrapper(isChecked);

    if (!isChecked) {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
      });
    }

    billingAddressFieldID.forEach((id) => {
      this.inputFields
        .find((inputField) => inputField.getView().getInput().getHTML().id === id)
        ?.getView()
        .getInput()
        .clear();
      this.isValidInputFields[id] = isChecked;
    });

    this.switchSubmitFormButtonAccess();

    return true;
  }

  private successfulUserRegistration(newUserData: User): void {
    // TBD: move login user to login form
    this.loginUser();
    this.updateUserData(newUserData).catch(() => {});
    this.resetInputFieldsValidation();
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

  // eslint-disable-next-line max-lines-per-function
  private async updateUserData(newUserData: User): Promise<User> {
    let currentUserData: User | null = newUserData;

    const shippingAddress = this.getAddressDataFromShippingForm();
    const billingAddress = this.getAddressDataFromBillingForm();

    const checkboxSingleAddress = this.view.getSingleAddressCheckBox().getHTML();
    const checkboxDefaultShippingAddress = this.view.getCheckboxDefaultShippingAddress().getHTML();
    const checkboxDefaultBillingAddress = this.view.getCheckboxDefaultBillingAddress().getHTML();

    currentUserData = await getCustomerModel().editCustomer(
      [
        CustomerModel.actionEditFirstName(this.userData.firstName),
        CustomerModel.actionEditLastName(this.userData.lastName),
        CustomerModel.actionEditDateOfBirth(this.userData.birthDate),
        CustomerModel.actionAddAddress(shippingAddress),
      ],
      this.userData,
    );

    if (checkboxDefaultShippingAddress.checked && currentUserData) {
      currentUserData = await getCustomerModel().editCustomer(
        [
          CustomerModel.actionEditDefaultShippingAddress(
            currentUserData.addresses[currentUserData.addresses.length - 1].id,
          ),
        ],
        currentUserData,
      );
    }

    if (checkboxSingleAddress.checked && checkboxDefaultShippingAddress.checked && currentUserData) {
      currentUserData = await getCustomerModel().editCustomer(
        [CustomerModel.actionAddAddress(shippingAddress)],
        currentUserData,
      ); // TBD: add type billing or shipping

      if (currentUserData) {
        await getCustomerModel().editCustomer(
          [
            CustomerModel.actionEditDefaultBillingAddress(
              currentUserData.addresses[currentUserData.addresses.length - 1].id,
            ),
          ],
          currentUserData,
        );
      }
      return this.userData;
    }

    if (checkboxDefaultBillingAddress.checked && currentUserData) {
      currentUserData = await getCustomerModel().editCustomer(
        [CustomerModel.actionAddAddress(billingAddress)],
        currentUserData,
      ); // TBD: add type billing or shipping

      if (currentUserData) {
        await getCustomerModel().editCustomer(
          [
            CustomerModel.actionEditDefaultBillingAddress(
              currentUserData.addresses[currentUserData.addresses.length - 1].id,
            ),
          ],
          currentUserData,
        );
      }
    }

    if (currentUserData) {
      this.userData = currentUserData;
    }

    getStore().dispatch(setCurrentUser(this.userData));
    return this.userData;
  }

  public getFirstInputField(): InputFieldModel {
    return this.inputFields[0];
  }

  public getHTML(): HTMLFormElement {
    return this.view.getHTML();
  }
}

export default RegisterFormModel;
