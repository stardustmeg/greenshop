import type InputFieldModel from '@/entities/InputField/model/InputFieldModel.ts';
import type { UserCredentials } from '@/shared/types/user.ts';

import getCustomerModel from '@/shared/API/customer/model/CustomerModel.ts';
import EventMediatorModel from '@/shared/EventMediator/model/EventMediatorModel.ts';
import LoaderModel from '@/shared/Loader/model/LoaderModel.ts';
import serverMessageModel from '@/shared/ServerMessage/model/ServerMessageModel.ts';
import getStore from '@/shared/Store/Store.ts';
import { setCurrentUser } from '@/shared/Store/actions.ts';
import MEDIATOR_EVENT from '@/shared/constants/events.ts';
import { INPUT_TYPE, PASSWORD_TEXT } from '@/shared/constants/forms.ts';
import { MESSAGE_STATUS, SERVER_MESSAGE } from '@/shared/constants/messages.ts';
import { SIZES } from '@/shared/constants/sizes.ts';
import { isUserCredentialsData } from '@/shared/types/validation/user.ts';
import formattedText from '@/shared/utils/formattedText.ts';
import { greeting } from '@/shared/utils/messageTemplate.ts';

import LoginFormView from '../view/LoginFormView.ts';

class LoginFormModel {
  private eventMediator = EventMediatorModel.getInstance();

  private view: LoginFormView = new LoginFormView();

  constructor() {
    this.init();
  }

  private createGreetingMessage(name: string): string {
    const greetingMessage = `${greeting(name)} ${SERVER_MESSAGE.SUCCESSFUL_LOGIN}`;
    return greetingMessage;
  }

  private getFormData(): UserCredentials {
    const userData: UserCredentials = {
      email: formattedText(this.view.getEmailField().getView().getValue()),
      password: formattedText(this.view.getPasswordField().getView().getValue()),
    };

    this.view.getInputFields().forEach((inputField) => inputField.getView().getInput().clear());
    this.view.getSubmitFormButton().setDisabled();
    return userData;
  }

  private init(): boolean {
    this.view.getInputFields().forEach((inputField) => this.setInputFieldHandlers(inputField));
    this.setPreventDefaultToForm();
    this.setSubmitFormHandler();
    this.subscribeToEventMediator();
    this.setSwitchPasswordVisibilityHandler();
    return true;
  }

  private loginUser(userLoginData: UserCredentials): void {
    const loader = new LoaderModel(SIZES.MEDIUM).getHTML();
    this.view.getSubmitFormButton().getHTML().append(loader);
    getCustomerModel()
      .hasEmail(userLoginData.email)
      .then((response) => {
        if (response) {
          this.loginUserHandler(userLoginData);
        } else {
          serverMessageModel.showServerMessage(SERVER_MESSAGE.INVALID_EMAIL, MESSAGE_STATUS.ERROR);
        }
      })
      .catch(() => {
        serverMessageModel.showServerMessage(SERVER_MESSAGE.BAD_REQUEST, MESSAGE_STATUS.ERROR);
      })
      .finally(() => loader.remove());
  }

  private loginUserHandler(userLoginData: UserCredentials): void {
    const loader = new LoaderModel(SIZES.MEDIUM).getHTML();
    this.view.getSubmitFormButton().getHTML().append(loader);
    getCustomerModel()
      .authCustomer(userLoginData)
      .then((data) => {
        getStore().dispatch(setCurrentUser(data));
        if (data) {
          serverMessageModel.showServerMessage(this.createGreetingMessage(data.firstName), MESSAGE_STATUS.SUCCESS);
        }
      })
      .catch(() => {
        serverMessageModel.showServerMessage(SERVER_MESSAGE.INCORRECT_PASSWORD, MESSAGE_STATUS.ERROR);
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
    submitButton.addEventListener('click', () => this.loginUser(this.getFormData()));
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

  private subscribeToEventMediator(): boolean {
    this.eventMediator.subscribe(MEDIATOR_EVENT.USER_LOGIN, (userLoginData) => {
      if (isUserCredentialsData(userLoginData)) {
        this.loginUser(userLoginData);
      }
    });
    return true;
  }

  private switchSubmitFormButtonAccess(): boolean {
    if (this.view.getInputFields().every((inputField) => inputField.getIsValid())) {
      this.view.getSubmitFormButton().setEnabled();
    } else {
      this.view.getSubmitFormButton().setDisabled();
    }

    return true;
  }

  public getFirstInputField(): InputFieldModel {
    return this.view.getInputFields()[0];
  }

  public getHTML(): HTMLFormElement {
    return this.view.getHTML();
  }
}

export default LoginFormModel;
