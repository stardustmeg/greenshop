import type InputFieldModel from '@/entities/InputField/model/InputFieldModel.ts';
import type { AddressType } from '@/shared/types/address.ts';
import type { PersonalData, User } from '@/shared/types/user.ts';

import AddressModel from '@/entities/Address/model/AddressModel.ts';
import CredentialsModel from '@/entities/Credentials/model/CredentialsModel.ts';
import PersonalInfoModel from '@/entities/PersonalInfo/model/PersonalInfoModel.ts';
import getCustomerModel from '@/shared/API/customer/model/CustomerModel.ts';
import LoaderModel from '@/shared/Loader/model/LoaderModel.ts';
import getStore from '@/shared/Store/Store.ts';
import { setBillingCountry, switchIsUserLoggedIn } from '@/shared/Store/actions.ts';
import { SERVER_MESSAGE_KEY } from '@/shared/constants/messages.ts';
import { LOADER_SIZE } from '@/shared/constants/sizes.ts';
import { ADDRESS } from '@/shared/types/address.ts';
import getCurrentLanguage from '@/shared/utils/getCurrentLanguage.ts';
import { createRegistrationMessage } from '@/shared/utils/messageTemplates.ts';
import { showErrorMessage, showSuccessMessage } from '@/shared/utils/userMessage.ts';

import RegistrationFormView from '../view/RegistrationFormView.ts';

class RegisterFormModel {
  private addressWrappers: Record<Exclude<AddressType, typeof ADDRESS.GENERAL>, AddressModel> = {
    [ADDRESS.BILLING]: new AddressModel(
      {
        setDefault: true,
      },
      ADDRESS.BILLING,
    ),
    [ADDRESS.SHIPPING]: new AddressModel(
      {
        setAsBilling: true,
        setDefault: true,
      },
      ADDRESS.SHIPPING,
    ),
  };

  private credentialsWrapper = new CredentialsModel();

  private inputFields: InputFieldModel[] = [];

  private personalInfoWrapper = new PersonalInfoModel();

  private view = new RegistrationFormView();

  constructor() {
    this.init();
  }

  private getFormUserData(): User {
    const { birthDate, firstName, lastName } = this.personalInfoWrapper.getFormPersonalInfo();
    const { email, password } = this.credentialsWrapper.getFormCredentials();
    const userData: User = {
      addresses: [],
      billingAddress: [],
      birthDate,
      defaultBillingAddressId: null,
      defaultShippingAddressId: null,
      email,
      firstName,
      id: '',
      lastName,
      locale: getCurrentLanguage(),
      password,
      shippingAddress: [],
      version: 0,
    };

    this.view.getSubmitFormButton().setDisabled();
    return userData;
  }

  private getPersonalData(): PersonalData {
    const { firstName, lastName } = this.personalInfoWrapper.getFormPersonalInfo();
    const { email } = this.credentialsWrapper.getFormCredentials();
    return {
      email,
      firstName,
      lastName,
    };
  }

  private init(): void {
    this.getHTML().append(this.credentialsWrapper.getHTML());
    this.getHTML().append(this.personalInfoWrapper.getHTML());

    this.inputFields.push(
      ...this.credentialsWrapper.getView().getInputFields(),
      ...this.personalInfoWrapper.getView().getInputFields(),
    );

    Object.values(this.addressWrappers)
      .reverse()
      .forEach((addressWrapper) => {
        this.inputFields.push(...addressWrapper.getView().getInputFields());
        this.getHTML().append(addressWrapper.getHTML());
      });
    this.inputFields.forEach((inputField) => this.setInputFieldHandlers(inputField));
    this.setPreventDefaultToForm();
    this.setSubmitFormHandler();
    const checkboxSingleAddress = this.addressWrappers[ADDRESS.SHIPPING]
      .getView()
      .getAddressAsBillingCheckBox()
      ?.getHTML();
    checkboxSingleAddress?.addEventListener('change', () =>
      this.singleAddressCheckBoxHandler(checkboxSingleAddress.checked),
    );

    this.credentialsWrapper.getHTML().append(this.credentialsWrapper.getView().getTitle());
  }

  private registerUser(): void {
    const submitButton = this.view.getSubmitFormButton();
    const loader = new LoaderModel(LOADER_SIZE.SMALL).getHTML();
    submitButton.getHTML().append(loader);
    const customer = this.getFormUserData();
    this.updateUserAddresses(customer);
    getCustomerModel()
      .registerNewCustomer(customer)
      .then((newUserData) => {
        if (newUserData) {
          getStore().dispatch(switchIsUserLoggedIn(false));
          getStore().dispatch(switchIsUserLoggedIn(true));
          showSuccessMessage(createRegistrationMessage(newUserData.firstName));
        }
      })
      .catch(() => {
        showErrorMessage(SERVER_MESSAGE_KEY.USER_EXISTS);
        submitButton.setEnabled();
      })
      .finally(() => loader.remove());
  }

  private setInputFieldHandlers(inputField: InputFieldModel): void {
    const inputHTML = inputField.getView().getInput().getHTML();
    inputHTML.addEventListener('input', () => {
      this.switchSubmitFormButtonAccess();
    });
  }

  private setPreventDefaultToForm(): void {
    this.getHTML().addEventListener('submit', (event) => {
      event.preventDefault();
    });
  }

  private setSubmitFormHandler(): void {
    const submitButton = this.view.getSubmitFormButton();
    submitButton.getHTML().addEventListener('click', () => {
      submitButton.setDisabled();
      this.registerUser();
    });
  }

  private singleAddressCheckBoxHandler(isChecked: boolean): void {
    if (!isChecked) {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
      });
    }

    const billingAddressView = this.addressWrappers[ADDRESS.BILLING].getView();
    const shippingAddress = this.addressWrappers[ADDRESS.SHIPPING];
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
  }

  private switchSubmitFormButtonAccess(): void {
    if (this.inputFields.every((inputField) => inputField.getIsValid())) {
      this.view.getSubmitFormButton().setEnabled();
    } else {
      this.view.getSubmitFormButton().setDisabled();
    }
  }

  private updateUserAddresses(userData: User | null): User | null {
    const { billing, shipping } = this.addressWrappers;
    const personalData = this.getPersonalData();
    const checkboxSingleAddress = shipping.getView().getAddressAsBillingCheckBox()?.getHTML();
    const checkboxDefaultShippingAddress = shipping.getView().getAddressByDefaultCheckBox()?.getHTML();
    const checkboxDefaultBillingAddress = billing.getView().getAddressByDefaultCheckBox()?.getHTML();

    const currentUserData = userData;

    const shippingAddress = shipping.getAddressData(personalData);
    currentUserData?.addresses.push(shippingAddress);
    currentUserData?.shippingAddress.push(shippingAddress);
    if (!currentUserData) {
      return null;
    }

    if (checkboxDefaultShippingAddress?.checked) {
      currentUserData.defaultShippingAddressId = shippingAddress;
    }

    if (checkboxSingleAddress?.checked && checkboxDefaultShippingAddress?.checked) {
      currentUserData.defaultBillingAddressId = shippingAddress;
      return currentUserData;
    }

    const billingAddress = billing.getAddressData(personalData);
    currentUserData?.billingAddress.push(billingAddress);
    currentUserData?.addresses.push(billingAddress);
    if (!currentUserData) {
      return null;
    }

    if (checkboxDefaultBillingAddress?.checked) {
      currentUserData.defaultBillingAddressId = billingAddress;
    }

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
