import type InputFieldModel from '@/entities/InputField/model/InputFieldModel.ts';
import type { User, UserLoginData } from '@/shared/types/user.ts';

import getCustomerModel from '@/shared/API/customer/model/CustomerModel.ts';
import EventMediatorModel from '@/shared/EventMediator/model/EventMediatorModel.ts';
import serverMessageModel from '@/shared/ServerMessage/model/ServerMessageModel.ts';
import getStore from '@/shared/Store/Store.ts';
import { setCurrentUser } from '@/shared/Store/actions.ts';
import { EVENT_NAME, MEDIATOR_EVENT } from '@/shared/constants/events.ts';
import { LOGIN_FORM_KEY } from '@/shared/constants/forms.ts';
import { MESSAGE_STATUS, SERVER_MESSAGE } from '@/shared/constants/messages.ts';
import { isUserLoginData } from '@/shared/types/validation/user.ts';
import isKeyOfUserData from '@/shared/utils/isKeyOfUserData.ts';

import LoginFormView from '../view/LoginFormView.ts';

class LoginFormModel {
  private eventMediator = EventMediatorModel.getInstance();

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

  private async checkHasEmailHandler(email: string): Promise<User | null> {
    const response = await getCustomerModel().hasEmail(email);
    return response;
  }

  private createGreetingMessage(name: string): string {
    const greeting = `Hello, ${name}! ${SERVER_MESSAGE.SUCCESSFUL_LOGIN}`;
    return greeting;
  }

  private getFormData(): UserLoginData {
    this.inputFields.forEach((inputField) => {
      const input = inputField.getView().getInput();
      const inputHTML = input.getHTML();
      const inputValue = input.getValue();

      const key = inputHTML.id.replace(LOGIN_FORM_KEY, '');

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
    this.subscribeToEventMediator();

    return true;
  }

  private loginUser(userLoginData: UserLoginData): void {
    this.checkHasEmailHandler(userLoginData.email)
      .then((response) => {
        if (response) {
          this.loginUserHandler(userLoginData);
        } else {
          serverMessageModel.showServerMessage(SERVER_MESSAGE.INVALID_EMAIL, MESSAGE_STATUS.ERROR);
        }
      })
      .catch(() => {});
  }

  private loginUserHandler(userLoginData: UserLoginData): void {
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
    this.getHTML().addEventListener(EVENT_NAME.SUBMIT, (event) => event.preventDefault());
    return true;
  }

  private setSubmitFormHandler(): boolean {
    const submitButton = this.view.getSubmitFormButton().getHTML();
    submitButton.addEventListener(EVENT_NAME.CLICK, () => {
      const formData = this.getFormData();
      this.loginUser(formData);
    });
    return true;
  }

  private subscribeToEventMediator(): boolean {
    this.eventMediator.subscribe(MEDIATOR_EVENT.USER_LOGIN, (userLoginData) => {
      if (isUserLoginData(userLoginData)) {
        this.loginUser(userLoginData);
      }
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
