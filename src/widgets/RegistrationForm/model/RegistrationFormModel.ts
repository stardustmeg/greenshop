import type InputFieldModel from '@/entities/InputField/model/InputFieldModel.ts';
import type { AddressType } from '@/shared/types/address.ts';
import type { Address, PersonalData, User, UserCredentials } from '@/shared/types/user.ts';

import AddressModel from '@/entities/Address/model/AddressModel.ts';
import getCustomerModel, { CustomerModel } from '@/shared/API/customer/model/CustomerModel.ts';
import EventMediatorModel from '@/shared/EventMediator/model/EventMediatorModel.ts';
import LoaderModel from '@/shared/Loader/model/LoaderModel.ts';
import serverMessageModel from '@/shared/ServerMessage/model/ServerMessageModel.ts';
import getStore from '@/shared/Store/Store.ts';
import { setBillingCountry, setCurrentUser } from '@/shared/Store/actions.ts';
import MEDIATOR_EVENT from '@/shared/constants/events.ts';
import { INPUT_TYPE, PASSWORD_TEXT } from '@/shared/constants/forms.ts';
import { MESSAGE_STATUS, SERVER_MESSAGE } from '@/shared/constants/messages.ts';
import { SIZES } from '@/shared/constants/sizes.ts';
import { ADDRESS_TYPE } from '@/shared/types/address.ts';
import formattedText from '@/shared/utils/formattedText.ts';

import RegistrationFormView from '../view/RegistrationFormView.ts';

class RegisterFormModel {
  private addressWrappers: Record<AddressType, AddressModel> = {
    [ADDRESS_TYPE.BILLING]: new AddressModel(ADDRESS_TYPE.BILLING, {
      setDefault: true,
    }),
    [ADDRESS_TYPE.SHIPPING]: new AddressModel(ADDRESS_TYPE.SHIPPING, {
      setAsBilling: true,
      setDefault: true,
    }),
  };

  private eventMediator = EventMediatorModel.getInstance();

  private inputFields: InputFieldModel[] = [];

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

  private getCredentialsData(): UserCredentials {
    return {
      email: formattedText(this.view.getEmailField().getView().getValue()),
      password: formattedText(this.view.getPasswordField().getView().getValue()),
    };
  }

  private getFormUserData(): User {
    const userData: User = {
      addresses: [],
      birthDate: formattedText(this.view.getDateOfBirthField().getView().getValue()),
      defaultBillingAddressId: null,
      defaultShippingAddressId: null,
      email: formattedText(this.view.getEmailField().getView().getValue()),
      firstName: formattedText(this.view.getFirstNameField().getView().getValue()),
      id: '',
      lastName: formattedText(this.view.getLastNameField().getView().getValue()),
      locale: '',
      password: formattedText(this.view.getPasswordField().getView().getValue()),
      version: 0,
    };

    this.view.getSubmitFormButton().setDisabled();
    return userData;
  }

  private getPersonalData(): PersonalData {
    return {
      email: formattedText(this.view.getEmailField().getView().getValue()),
      firstName: formattedText(this.view.getFirstNameField().getView().getValue()),
      lastName: formattedText(this.view.getLastNameField().getView().getValue()),
    };
  }

  private init(): boolean {
    this.inputFields = this.view.getInputFields();
    Object.values(this.addressWrappers)
      .reverse()
      .forEach((addressWrapper) => {
        this.inputFields.push(...addressWrapper.getView().getInputFields());
        this.getHTML().append(addressWrapper.getHTML());
      });
    this.inputFields.forEach((inputField) => this.setInputFieldHandlers(inputField));
    this.setPreventDefaultToForm();
    this.setSubmitFormHandler();
    const checkboxSingleAddress = this.addressWrappers[ADDRESS_TYPE.SHIPPING]
      .getView()
      .getAddressAsBillingCheckBox()
      ?.getHTML();
    checkboxSingleAddress?.addEventListener('change', () =>
      this.singleAddressCheckBoxHandler(checkboxSingleAddress.checked),
    );
    this.setSwitchPasswordVisibilityHandler();
    return true;
  }

  private registerUser(): void {
    const loader = new LoaderModel(SIZES.MEDIUM).getHTML();
    this.view.getSubmitFormButton().getHTML().append(loader);
    getCustomerModel()
      .registerNewCustomer(this.getFormUserData())
      .then((newUserData) => {
        if (newUserData) {
          this.successfulUserRegistration(newUserData);
          serverMessageModel.showServerMessage(SERVER_MESSAGE.SUCCESSFUL_REGISTRATION, MESSAGE_STATUS.SUCCESS);
        }
      })
      .catch(() => {
        serverMessageModel.showServerMessage(SERVER_MESSAGE.USER_EXISTS, MESSAGE_STATUS.ERROR);
      })
      .finally(() => loader.remove());
  }

  private resetInputFieldsValidation(): void {
    const checkboxSingleAddress = this.addressWrappers[ADDRESS_TYPE.SHIPPING]
      .getView()
      .getAddressAsBillingCheckBox()
      ?.getHTML();
    const checkboxDefaultShippingAddress = this.addressWrappers[ADDRESS_TYPE.SHIPPING]
      .getView()
      .getAddressByDefaultCheckBox()
      ?.getHTML();
    const checkboxDefaultBillingAddress = this.addressWrappers[ADDRESS_TYPE.BILLING]
      .getView()
      .getAddressByDefaultCheckBox()
      ?.getHTML();
    if (checkboxSingleAddress) {
      checkboxSingleAddress.checked = false;
    }
    if (checkboxDefaultShippingAddress) {
      checkboxDefaultShippingAddress.checked = false;
    }
    if (checkboxDefaultBillingAddress) {
      checkboxDefaultBillingAddress.checked = false;
    }
    this.addressWrappers[ADDRESS_TYPE.BILLING].getView().switchVisibilityAddressWrapper(false);
  }

  private setInputFieldHandlers(inputField: InputFieldModel): boolean {
    const inputHTML = inputField.getView().getInput().getHTML();
    inputHTML.addEventListener('input', () => {
      this.switchSubmitFormButtonAccess();
    });
    return true;
  }

  private setPreventDefaultToForm(): boolean {
    this.getHTML().addEventListener('submit', (event) => {
      event.preventDefault();
    });

    return true;
  }

  private setSubmitFormHandler(): boolean {
    const submitButton = this.view.getSubmitFormButton().getHTML();
    submitButton.addEventListener('click', () => this.registerUser());
    return true;
  }

  private setSwitchPasswordVisibilityHandler(): boolean {
    this.view.getShowPasswordElement().addEventListener('click', () => {
      const input = this.view.getPasswordField().getView().getInput().getHTML();
      input.type = input.type === INPUT_TYPE.PASSWORD ? INPUT_TYPE.TEXT : INPUT_TYPE.PASSWORD;
      input.placeholder = input.type === INPUT_TYPE.PASSWORD ? PASSWORD_TEXT.HIDDEN : PASSWORD_TEXT.SHOWN;
      this.view.switchPasswordElementSVG(input.type);
    });
    return true;
  }

  private singleAddressCheckBoxHandler(isChecked: boolean): boolean {
    if (!isChecked) {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
      });
    }

    const billingAddressView = this.addressWrappers[ADDRESS_TYPE.BILLING].getView();
    const shippingAddress = this.addressWrappers[ADDRESS_TYPE.SHIPPING];
    shippingAddress
      .getView()
      .getInputFields()
      .forEach((inputFields) => {
        const inputElement = inputFields.getView();
        const billingInput = billingAddressView
          .getInputFields()
          .find(
            (inputField) =>
              inputField.getView().getInput().getHTML().placeholder === inputElement.getInput().getHTML().placeholder,
          );
        if (billingInput) {
          billingInput.getView().getInput().getHTML().value = inputElement.getInput().getHTML().value;
        }

        getStore().dispatch(setBillingCountry(getStore().getState().shippingCountry));
      });
    billingAddressView.switchVisibilityAddressWrapper(isChecked);
    this.switchSubmitFormButtonAccess();

    return true;
  }

  private successfulUserRegistration(newUserData: User): void {
    this.eventMediator.notify(MEDIATOR_EVENT.USER_LOGIN, this.getCredentialsData());
    this.updateUserData(newUserData).catch(() => {
      serverMessageModel.showServerMessage(SERVER_MESSAGE.BAD_REQUEST, MESSAGE_STATUS.ERROR);
    });
  }

  private switchSubmitFormButtonAccess(): boolean {
    if (this.inputFields.every((inputField) => inputField.getIsValid())) {
      this.view.getSubmitFormButton().setEnabled();
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
          CustomerModel.actionEditFirstName(formattedText(this.view.getFirstNameField().getView().getValue())),
          CustomerModel.actionEditLastName(formattedText(this.view.getLastNameField().getView().getValue())),
          CustomerModel.actionEditDateOfBirth(formattedText(this.view.getDateOfBirthField().getView().getValue())),
        ],
        currentUserData,
      );
    }

    return currentUserData;
  }

  private async updateUserAddresses(userData: User | null): Promise<User | null> {
    const { billing, shipping } = this.addressWrappers;
    const personalData = this.getPersonalData();
    const checkboxSingleAddress = shipping.getView().getAddressAsBillingCheckBox()?.getHTML();
    const checkboxDefaultShippingAddress = shipping.getView().getAddressByDefaultCheckBox()?.getHTML();
    const checkboxDefaultBillingAddress = billing.getView().getAddressByDefaultCheckBox()?.getHTML();

    let currentUserData = userData;

    currentUserData = await this.addAddress(shipping.getAddressData(personalData), currentUserData);
    if (!currentUserData) {
      return null;
    }
    const shippingAddressID = currentUserData.addresses[currentUserData.addresses.length - 1].id;

    if (checkboxDefaultShippingAddress?.checked) {
      currentUserData = await this.editDefaultShippingAddress(shippingAddressID, currentUserData);
    }

    if (checkboxSingleAddress?.checked && checkboxDefaultShippingAddress?.checked) {
      currentUserData = await this.editDefaultBillingAddress(shippingAddressID, currentUserData);
      return currentUserData;
    }

    currentUserData = await this.addAddress(billing.getAddressData(personalData), currentUserData);
    if (!currentUserData) {
      return null;
    }
    const billingAddressID = currentUserData.addresses[currentUserData.addresses.length - 1].id;

    if (checkboxDefaultBillingAddress?.checked) {
      currentUserData = await this.editDefaultBillingAddress(billingAddressID, currentUserData);
    }

    return currentUserData;
  }

  private async updateUserData(newUserData: User): Promise<User | null> {
    let currentUserData: User | null = newUserData;

    currentUserData = await this.updatePersonalData(currentUserData);

    currentUserData = await this.updateUserAddresses(currentUserData);

    getStore().dispatch(setCurrentUser(currentUserData));
    this.inputFields.forEach((inputField) => inputField.getView().getInput().clear());
    this.resetInputFieldsValidation();
    return currentUserData;
  }

  public getFirstInputField(): InputFieldModel {
    return this.inputFields[0];
  }

  public getHTML(): HTMLFormElement {
    return this.view.getHTML();
  }
}

export default RegisterFormModel;
