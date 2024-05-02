import type InputFieldModel from '@/entities/InputField/model/InputFieldModel.ts';
import type { UserLoginData } from '@/shared/types/interfaces.ts';

import getCustomerModel from '@/shared/API/customer/model/CustomerModel.ts';
import errorMessageModel from '@/shared/ErrorMessage/model/ErrorMessageModel.ts';
import getStore from '@/shared/Store/Store.ts';
import { setCurrentUser } from '@/shared/Store/actions.ts';
import { EVENT_NAMES, LOGIN_FORM_KEY } from '@/shared/constants/enums.ts';
import isKeyOfLoginData from '@/shared/utils/isKeyOfLoginData.ts';

import LoginFormView from '../view/LoginFormView.ts';

class LoginFormModel {
  private inputFields: InputFieldModel[] = [];

  private isValidInputFields: Record<string, boolean> = {};

  private userData: UserLoginData = {
    email: '',
    password: '',
  };

  private view: LoginFormView = new LoginFormView();

  constructor() {
    this.init();
  }

  private getFormData(): UserLoginData {
    this.inputFields.forEach((inputField) => {
      const input = inputField.getView().getInput();
      const inputHTML = input.getHTML();
      const inputValue = input.getValue();

      const key = inputHTML.id.replace(LOGIN_FORM_KEY, '');

      if (isKeyOfLoginData(this.userData, key)) {
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

  private setInputFieldHandlers(inputField: InputFieldModel): boolean {
    const inputHTML = inputField.getView().getInput().getHTML();
    this.isValidInputFields[inputHTML.id] = false;
    inputHTML.addEventListener(EVENT_NAMES.INPUT, () => {
      this.isValidInputFields[inputHTML.id] = inputField.getIsValid();
      this.switchSubmitFormButtonAccess();
    });
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
        .authCustomer(formData)
        .then((data) => {
          getStore().dispatch(setCurrentUser(data));
        })
        .catch(() => {
          // TBD: fix error message
          errorMessageModel.showErrorMessage('Incorrect email or password');
        });
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

export default LoginFormModel;
