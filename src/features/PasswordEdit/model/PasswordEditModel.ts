import type InputFieldModel from '@/entities/InputField/model/InputFieldModel.ts';

import getCustomerModel from '@/shared/API/customer/model/CustomerModel.ts';
import LoaderModel from '@/shared/Loader/model/LoaderModel.ts';
import modal from '@/shared/Modal/model/ModalModel.ts';
import serverMessageModel from '@/shared/ServerMessage/model/ServerMessageModel.ts';
import { INPUT_TYPE, PASSWORD_TEXT } from '@/shared/constants/forms.ts';
import { MESSAGE_STATUS, SERVER_MESSAGE_KEYS } from '@/shared/constants/messages.ts';
import { LOADER_SIZE } from '@/shared/constants/sizes.ts';
import showErrorMessage from '@/shared/utils/userMessage.ts';

import PasswordEditView from '../view/PasswordEditView.ts';

class PasswordEditModel {
  private view = new PasswordEditView();

  constructor() {
    this.init();
  }

  private init(): void {
    this.view.getInputFields().forEach((inputField) => this.setInputFieldHandlers(inputField));
    this.setPreventDefaultToForm();
    this.setSwitchOldPasswordVisibilityHandler();
    this.setSwitchNewPasswordVisibilityHandler();
    this.setSubmitFormHandler();
    this.setCancelButtonHandler();
  }

  private async saveNewPassword(): Promise<boolean> {
    const loader = new LoaderModel(LOADER_SIZE.SMALL).getHTML();
    this.view.getSubmitButton().getHTML().append(loader);
    try {
      await getCustomerModel()
        .getCurrentUser()
        .then(async (user) => {
          if (user) {
            try {
              await getCustomerModel().editPassword(
                user,
                this.view.getOldPasswordField().getView().getValue(),
                this.view.getNewPasswordField().getView().getValue(),
              );
              serverMessageModel.showServerMessage(SERVER_MESSAGE_KEYS.PASSWORD_CHANGED, MESSAGE_STATUS.SUCCESS);
              modal.hide();
            } catch {
              serverMessageModel.showServerMessage(SERVER_MESSAGE_KEYS.PASSWORD_NOT_CHANGED, MESSAGE_STATUS.ERROR);
            }
          }
        });
    } catch (error) {
      showErrorMessage(error);
    } finally {
      loader.remove();
    }
    return true;
  }

  private setCancelButtonHandler(): boolean {
    this.view
      .getCancelButton()
      .getHTML()
      .addEventListener('click', () => {
        modal.hide();
      });
    return true;
  }

  private setInputFieldHandlers(inputField: InputFieldModel): boolean {
    const inputHTML = inputField.getView().getInput().getHTML();
    inputHTML.addEventListener('input', () => this.switchSubmitFormButtonAccess());
    return true;
  }

  private setPreventDefaultToForm(): boolean {
    this.view.getHTML().addEventListener('submit', (event) => event.preventDefault());
    return true;
  }

  private setSubmitFormHandler(): boolean {
    const submitButton = this.view.getSubmitButton().getHTML();
    submitButton.addEventListener('click', this.saveNewPassword.bind(this));
    return true;
  }

  private setSwitchNewPasswordVisibilityHandler(): boolean {
    this.view.getShowNewPasswordElement().addEventListener('click', () => {
      const input = this.view.getNewPasswordField().getView().getInput().getHTML();
      input.type = input.type === INPUT_TYPE.PASSWORD ? INPUT_TYPE.TEXT : INPUT_TYPE.PASSWORD;
      input.placeholder = input.type === INPUT_TYPE.PASSWORD ? PASSWORD_TEXT.HIDDEN : PASSWORD_TEXT.SHOWN;
      this.view.switchPasswordElementSVG(input.type, this.view.getShowNewPasswordElement());
    });
    return true;
  }

  private setSwitchOldPasswordVisibilityHandler(): boolean {
    this.view.getShowOldPasswordElement().addEventListener('click', () => {
      const input = this.view.getOldPasswordField().getView().getInput().getHTML();
      input.type = input.type === INPUT_TYPE.PASSWORD ? INPUT_TYPE.TEXT : INPUT_TYPE.PASSWORD;
      input.placeholder = input.type === INPUT_TYPE.PASSWORD ? PASSWORD_TEXT.HIDDEN : PASSWORD_TEXT.SHOWN;
      this.view.switchPasswordElementSVG(input.type, this.view.getShowOldPasswordElement());
    });
    return true;
  }

  private switchSubmitFormButtonAccess(): boolean {
    if (this.view.getInputFields().every((inputField) => inputField.getIsValid())) {
      this.view.getSubmitButton().setEnabled();
    } else {
      this.view.getSubmitButton().setDisabled();
    }
    return true;
  }

  public getHTML(): HTMLFormElement {
    return this.view.getHTML();
  }

  public getView(): PasswordEditView {
    return this.view;
  }
}

export default PasswordEditModel;
