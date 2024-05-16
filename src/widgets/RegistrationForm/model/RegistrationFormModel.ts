import type InputFieldModel from '@/entities/InputField/model/InputFieldModel.ts';
import type { AddressType } from '@/shared/types/address.ts';
import type { PersonalData, User } from '@/shared/types/user.ts';

import AddressModel from '@/entities/Address/model/AddressModel.ts';
import PersonalInfoModel from '@/entities/PersonalInfo/model/PersonalInfoModel.ts';
import getCustomerModel from '@/shared/API/customer/model/CustomerModel.ts';
import LoaderModel from '@/shared/Loader/model/LoaderModel.ts';
import serverMessageModel from '@/shared/ServerMessage/model/ServerMessageModel.ts';
import getStore from '@/shared/Store/Store.ts';
import { setBillingCountry, setCurrentUser, switchIsUserLoggedIn } from '@/shared/Store/actions.ts';
import { INPUT_TYPE, PASSWORD_TEXT } from '@/shared/constants/forms.ts';
import { MESSAGE_STATUS, SERVER_MESSAGE_KEYS } from '@/shared/constants/messages.ts';
import { LOADER_SIZE } from '@/shared/constants/sizes.ts';
import { ADDRESS_TYPE } from '@/shared/types/address.ts';

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

  private inputFields: InputFieldModel[] = [];

  private personalInfoWrapper = new PersonalInfoModel();

  private view: RegistrationFormView = new RegistrationFormView();

  constructor() {
    this.init();
  }

  private getFormUserData(): User {
    const { birthDate, firstName, lastName } = this.personalInfoWrapper.getFormPersonalInfo();
    const userData: User = {
      addresses: [],
      billingAddress: [],
      birthDate,
      defaultBillingAddressId: null,
      defaultShippingAddressId: null,
      email: this.view.getEmailField().getView().getValue(),
      firstName,
      id: '',
      lastName,
      locale: getStore().getState().currentLanguage,
      password: this.view.getPasswordField().getView().getValue(),
      shippingAddress: [],
      version: 0,
    };

    this.view.getSubmitFormButton().setDisabled();
    return userData;
  }

  private getPersonalData(): PersonalData {
    const { firstName, lastName } = this.personalInfoWrapper.getFormPersonalInfo();
    return {
      email: this.view.getEmailField().getView().getValue(),
      firstName,
      lastName,
    };
  }

  private init(): boolean {
    this.inputFields = this.view.getInputFields();
    this.getHTML().append(this.personalInfoWrapper.getHTML());
    this.inputFields.push(...this.personalInfoWrapper.getView().getInputFields());
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
    const loader = new LoaderModel(LOADER_SIZE.SMALL).getHTML();
    this.view.getSubmitFormButton().getHTML().append(loader);
    const customer = this.getFormUserData();
    this.updateUserAddresses(customer);
    getCustomerModel()
      .registerNewCustomer(customer)
      .then((newUserData) => {
        if (newUserData) {
          getStore().dispatch(setCurrentUser(newUserData));
          getStore().dispatch(switchIsUserLoggedIn(false));
          getStore().dispatch(switchIsUserLoggedIn(true));
          serverMessageModel.showServerMessage(SERVER_MESSAGE_KEYS.SUCCESSFUL_REGISTRATION, MESSAGE_STATUS.SUCCESS);
        }
      })
      .catch(() => {
        serverMessageModel.showServerMessage(SERVER_MESSAGE_KEYS.USER_EXISTS, MESSAGE_STATUS.ERROR);
      })
      .finally(() => loader.remove());
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

  private switchSubmitFormButtonAccess(): boolean {
    if (this.inputFields.every((inputField) => inputField.getIsValid())) {
      this.view.getSubmitFormButton().setEnabled();
    } else {
      this.view.getSubmitFormButton().setDisabled();
    }

    return true;
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
