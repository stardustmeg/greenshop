import type InputFieldModel from '@/entities/InputField/model/InputFieldModel.ts';
import type { Address, User } from '@/shared/types/user.ts';

import CountryChoiceModel from '@/features/CountryChoice/model/CountryChoiceModel.ts';
import getCustomerModel, { CustomerModel } from '@/shared/API/customer/model/CustomerModel.ts';
import EventMediatorModel from '@/shared/EventMediator/model/EventMediatorModel.ts';
import serverMessageModel from '@/shared/ServerMessage/model/ServerMessageModel.ts';
import getStore from '@/shared/Store/Store.ts';
import { setCurrentUser } from '@/shared/Store/actions.ts';
import { EVENT_NAME, MEDIATOR_EVENT } from '@/shared/constants/events.ts';
import * as CONSTANT_FORMS from '@/shared/constants/forms.ts';
import { MESSAGE_STATUS, SERVER_MESSAGE } from '@/shared/constants/messages.ts';
import isKeyOfUserData from '@/shared/utils/isKeyOfUserData.ts';

import RegistrationFormView from '../view/RegistrationFormView.ts';

class RegisterFormModel {
  private eventMediator = EventMediatorModel.getInstance();

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

  private async addAddress(address: Address, userData: User | null): Promise<User | null> {
    let currentUserData = userData;
    if (currentUserData) {
      currentUserData = await getCustomerModel().editCustomer(
        [CustomerModel.actionAddAddress(address)],
        currentUserData,
      );
    }
    return currentUserData;
  }

  private createBillingCountryChoice(): boolean {
    return this.createCountryChoice(
      CONSTANT_FORMS.REGISTRATION_FORM_BILLING_ADDRESS_COUNTRY_FIELD_PARAMS.inputParams.id,
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
      CONSTANT_FORMS.REGISTRATION_FORM_SHIPPING_ADDRESS_COUNTRY_FIELD_PARAMS.inputParams.id,
      this.view.getShippingAddressWrapper(),
    );
  }

  private async editDefaultBillingAddress(addressId: string, userData: User | null): Promise<User | null> {
    let currentUserData = userData;
    if (currentUserData) {
      currentUserData = await getCustomerModel().editCustomer(
        [CustomerModel.actionEditDefaultBillingAddress(addressId)],
        currentUserData,
      );
    }
    return currentUserData;
  }

  private async editDefaultShippingAddress(addressId: string, userData: User | null): Promise<User | null> {
    let currentUserData = userData;
    if (currentUserData) {
      currentUserData = await getCustomerModel().editCustomer(
        [CustomerModel.actionEditDefaultShippingAddress(addressId)],
        currentUserData,
      );
    }
    return currentUserData;
  }

  private getAddressData(key: string): Address {
    const addressData =
      key === CONSTANT_FORMS.USER_ADDRESS_TYPE.BILLING
        ? this.getAddressDataHandler(
            [
              CONSTANT_FORMS.REGISTRATION_FORM_BILLING_ADDRESS_CITY_FIELD_PARAMS,
              CONSTANT_FORMS.REGISTRATION_FORM_BILLING_ADDRESS_POSTAL_CODE_FIELD_PARAMS,
              CONSTANT_FORMS.REGISTRATION_FORM_BILLING_ADDRESS_STREET_FIELD_PARAMS,
            ],
            CONSTANT_FORMS.USER_COUNTRY_ADDRESS.BILLING,
          )
        : this.getAddressDataHandler(
            [
              CONSTANT_FORMS.REGISTRATION_FORM_SHIPPING_ADDRESS_CITY_FIELD_PARAMS,
              CONSTANT_FORMS.REGISTRATION_FORM_SHIPPING_ADDRESS_POSTAL_CODE_FIELD_PARAMS,
              CONSTANT_FORMS.REGISTRATION_FORM_SHIPPING_ADDRESS_STREET_FIELD_PARAMS,
            ],
            CONSTANT_FORMS.USER_COUNTRY_ADDRESS.SHIPPING,
          );

    return addressData;
  }

  private getAddressDataHandler(
    [city, postalCode, street]: { inputParams: { id: string } }[],
    country: string,
  ): Address {
    const store = getStore().getState();
    const addressData: Address = {
      city: this.getAddressValue(city),
      country: country === CONSTANT_FORMS.USER_COUNTRY_ADDRESS.BILLING ? store.billingCountry : store.shippingCountry,
      email: this.userData.email,
      firstName: this.userData.firstName,
      id: '',
      lastName: this.userData.lastName,
      postalCode: this.getAddressValue(postalCode),
      state: '',
      streetName: this.getAddressValue(street),
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

      const key = inputHTML.id.replace(CONSTANT_FORMS.REGISTRATION_FORM_KEY, '');

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
      CONSTANT_FORMS.REGISTRATION_FORM_BILLING_ADDRESS_COUNTRY_FIELD_PARAMS.inputParams.id,
      CONSTANT_FORMS.REGISTRATION_FORM_BILLING_ADDRESS_STREET_FIELD_PARAMS.inputParams.id,
      CONSTANT_FORMS.REGISTRATION_FORM_BILLING_ADDRESS_CITY_FIELD_PARAMS.inputParams.id,
      CONSTANT_FORMS.REGISTRATION_FORM_BILLING_ADDRESS_POSTAL_CODE_FIELD_PARAMS.inputParams.id,
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
    const userDataWithLogin = {
      email: this.userData.email,
      password: this.userData.password,
    };
    this.eventMediator.notify(MEDIATOR_EVENT.USER_LOGIN, userDataWithLogin);
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

  private async updatePersonalData(userData: User | null): Promise<User | null> {
    let currentUserData = userData;
    if (currentUserData) {
      currentUserData = await getCustomerModel().editCustomer(
        [
          CustomerModel.actionEditFirstName(this.userData.firstName),
          CustomerModel.actionEditLastName(this.userData.lastName),
          CustomerModel.actionEditDateOfBirth(this.userData.birthDate),
        ],
        currentUserData,
      );
    }

    return currentUserData;
  }

  private async updateUserAddresses(userData: User | null): Promise<User | null> {
    const shippingAddress = this.getAddressData(CONSTANT_FORMS.USER_ADDRESS_TYPE.SHIPPING);
    const billingAddress = this.getAddressData(CONSTANT_FORMS.USER_ADDRESS_TYPE.BILLING);
    const checkboxSingleAddress = this.view.getSingleAddressCheckBox().getHTML();
    const checkboxDefaultShippingAddress = this.view.getCheckboxDefaultShippingAddress().getHTML();
    const checkboxDefaultBillingAddress = this.view.getCheckboxDefaultBillingAddress().getHTML();
    let currentUserData = userData;

    currentUserData = await this.addAddress(shippingAddress, currentUserData);

    if (checkboxDefaultShippingAddress.checked && currentUserData) {
      currentUserData = await this.editDefaultShippingAddress(
        currentUserData.addresses[currentUserData.addresses.length - 1].id,
        currentUserData,
      );
    }

    if (checkboxSingleAddress.checked && checkboxDefaultShippingAddress.checked) {
      currentUserData = await this.addAddress(shippingAddress, currentUserData);
      if (currentUserData) {
        currentUserData = await this.editDefaultBillingAddress(
          currentUserData.addresses[currentUserData.addresses.length - 1].id,
          currentUserData,
        );
      }
      return currentUserData;
    }

    if (checkboxDefaultBillingAddress.checked) {
      currentUserData = await this.addAddress(billingAddress, currentUserData);
      if (currentUserData) {
        currentUserData = await this.editDefaultBillingAddress(
          currentUserData.addresses[currentUserData.addresses.length - 1].id,
          currentUserData,
        );
      }
    }

    return currentUserData;
  }

  private async updateUserData(newUserData: User): Promise<User> {
    let currentUserData: User | null = newUserData;

    currentUserData = await this.updatePersonalData(currentUserData);

    if (currentUserData) {
      this.userData = currentUserData;
    }

    currentUserData = await this.updateUserAddresses(currentUserData);

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
