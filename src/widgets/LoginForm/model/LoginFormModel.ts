import type InputFieldModel from '@/entities/InputField/model/InputFieldModel.ts';
import type { UserCredentials } from '@/shared/types/user.ts';

import CredentialsModel from '@/entities/Credentials/model/CredentialsModel.ts';
import getCustomerModel from '@/shared/API/customer/model/CustomerModel.ts';
import LoaderModel from '@/shared/Loader/model/LoaderModel.ts';
import getStore from '@/shared/Store/Store.ts';
import { setCurrentLanguage, switchIsUserLoggedIn } from '@/shared/Store/actions.ts';
import { SERVER_MESSAGE_KEY } from '@/shared/constants/messages.ts';
import { LOADER_SIZE } from '@/shared/constants/sizes.ts';
import isLanguageChoiceType from '@/shared/types/validation/language.ts';
import { createGreetingMessage } from '@/shared/utils/messageTemplates.ts';
import { showErrorMessage, showSuccessMessage } from '@/shared/utils/userMessage.ts';

import LoginFormView from '../view/LoginFormView.ts';
import styles from '../view/loginForm.module.scss';

class LoginFormModel {
  private credentialsWrapper = new CredentialsModel();

  private view: LoginFormView = new LoginFormView();

  constructor() {
    this.init();
  }

  private init(): void {
    this.credentialsWrapper.getHTML().classList.add(styles.loginCredentialsWrapper);
    this.credentialsWrapper.getInputFields().forEach((inputField) => this.setInputFieldHandlers(inputField));
    this.setPreventDefaultToForm();
    this.setSubmitFormHandler();
    this.getHTML().append(this.credentialsWrapper.getHTML());
  }

  private loginUser(userLoginData: UserCredentials): void {
    this.view.getSubmitFormButton().setDisabled();
    const loader = new LoaderModel(LOADER_SIZE.SMALL).getHTML();
    this.view.getSubmitFormButton().getHTML().append(loader);
    getCustomerModel()
      .hasEmail(userLoginData.email)
      .then((response) => {
        if (response) {
          this.loginUserHandler(userLoginData);
        } else {
          showErrorMessage(SERVER_MESSAGE_KEY.INVALID_EMAIL);
        }
      })
      .catch((error) => showErrorMessage(error))
      .finally(() => loader.remove());
  }

  private loginUserHandler(userLoginData: UserCredentials): void {
    const loader = new LoaderModel(LOADER_SIZE.SMALL).getHTML();
    this.view.getSubmitFormButton().getHTML().append(loader);
    getCustomerModel()
      .authCustomer(userLoginData)
      .then((data) => {
        if (data) {
          getStore().dispatch(switchIsUserLoggedIn(true));
          if (isLanguageChoiceType(data.locale)) {
            getStore().dispatch(setCurrentLanguage(data.locale));
          }
          showSuccessMessage(createGreetingMessage(data.firstName));
        }
      })
      .catch(() => {
        showErrorMessage(SERVER_MESSAGE_KEY.INCORRECT_PASSWORD);
      })
      .finally(() => loader.remove());
  }

  private setInputFieldHandlers(inputField: InputFieldModel): boolean {
    const inputHTML = inputField.getView().getInput().getHTML();

    inputHTML.addEventListener('input', () => this.switchSubmitFormButtonAccess());
    return true;
  }

  private setPreventDefaultToForm(): boolean {
    this.getHTML().addEventListener('submit', (event) => event.preventDefault());
    return true;
  }

  private setSubmitFormHandler(): boolean {
    const submitButton = this.view.getSubmitFormButton().getHTML();
    submitButton.addEventListener('click', () => this.loginUser(this.credentialsWrapper.getFormCredentials()));
    return true;
  }

  private switchSubmitFormButtonAccess(): boolean {
    if (this.credentialsWrapper.getInputFields().every((inputField) => inputField.getIsValid())) {
      this.view.getSubmitFormButton().setEnabled();
    } else {
      this.view.getSubmitFormButton().setDisabled();
    }

    return true;
  }

  public getFirstInputField(): InputFieldModel {
    return this.credentialsWrapper.getInputFields()[0];
  }

  public getHTML(): HTMLFormElement {
    return this.view.getHTML();
  }
}

export default LoginFormModel;
