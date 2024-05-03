import type InputFieldModel from '@/entities/InputField/model/InputFieldModel.ts';
import type { UserRegisterData } from '@/shared/types/user.ts';

import getCustomerModel from '@/shared/API/customer/model/CustomerModel.ts';
import serverMessageModel from '@/shared/ServerMessage/model/ServerMessageModel.ts';
import getStore from '@/shared/Store/Store.ts';
import { setCurrentUser, setRegisterFormCountry } from '@/shared/Store/actions.ts';
import observeStore, { selectRegisterFormCountry } from '@/shared/Store/observer.ts';
import {
  EVENT_NAMES,
  MESSAGE_STATUS,
  REGISTRATION_FORM_COUNTRY_FIELD_VALIDATE_PARAMS,
  REGISTRATION_FORM_KEY,
  REGISTRATION_FORM_POSTAL_CODE_FIELD_VALIDATE_PARAMS,
  SERVER_MESSAGE,
} from '@/shared/constants/enums.ts';
import getCountryIndex from '@/shared/utils/getCountryIndex.ts';
import isKeyOfUserData from '@/shared/utils/isKeyOfUserData.ts';

import RegistrationFormView from '../view/RegistrationFormView.ts';
import REGISTRATION_FORM_STYLES from '../view/registrationForm.module.scss';

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

    return true;
  }

  private setCountryItemsHandlers(input: HTMLInputElement): boolean {
    const inputHTML = input;
    this.view.getCountryItems().forEach((countryItem) => {
      const currentItem = countryItem;
      currentItem.addEventListener(EVENT_NAMES.CLICK, () => {
        if (currentItem.textContent) {
          inputHTML.value = currentItem.textContent;
          const store = getStore();
          const currentCountryIndex = getCountryIndex(currentItem.textContent);
          store.dispatch(setRegisterFormCountry(currentCountryIndex));
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
      inputHTML.addEventListener(EVENT_NAMES.INPUT, () => {
        this.view.switchVisibilityCountryItems(inputHTML);
        const currentCountryIndex = getCountryIndex(inputHTML.value);
        getStore().dispatch(setRegisterFormCountry(currentCountryIndex));
      });
      document.addEventListener(EVENT_NAMES.CLICK, (event) => {
        const countryDropList = this.view.getCountryDropList();
        if (!countryDropList.classList.contains(REGISTRATION_FORM_STYLES.hidden) && event.target !== inputHTML) {
          this.view.hideCountryDropList();
        }
      });
    }

    if (inputHTML.id === REGISTRATION_FORM_POSTAL_CODE_FIELD_VALIDATE_PARAMS.key) {
      observeStore(selectRegisterFormCountry, () => {
        const event = new Event(EVENT_NAMES.INPUT);
        inputHTML.dispatchEvent(event);
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

  private setSubmitFormHandler(): boolean {
    const submitButton = this.view.getSubmitFormButton().getHTML();
    submitButton.addEventListener(EVENT_NAMES.CLICK, () => {
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
