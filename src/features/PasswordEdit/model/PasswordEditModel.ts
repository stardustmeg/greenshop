import type InputFieldModel from '@/entities/InputField/model/InputFieldModel.ts';

import getCustomerModel from '@/shared/API/customer/model/CustomerModel.ts';
import LoaderModel from '@/shared/Loader/model/LoaderModel.ts';
import modal from '@/shared/Modal/model/ModalModel.ts';
import { INPUT_TYPE, PASSWORD_TEXT } from '@/shared/constants/forms.ts';
import { SERVER_MESSAGE_KEY } from '@/shared/constants/messages.ts';
import { LOADER_SIZE } from '@/shared/constants/sizes.ts';
import { showErrorMessage, showSuccessMessage } from '@/shared/utils/userMessage.ts';

import PasswordEditView from '../view/PasswordEditView.ts';

class PasswordEditModel {
  private view = new PasswordEditView();

  constructor() {
    this.init();
  }

  private clearInputFields(): void {
    this.view.getInputFields().forEach((inputField) => {
      inputField.getView().getInput().setValue('');
      const errorField = inputField.getView().getErrorField();
      if (errorField?.textContent) {
        errorField.textContent = '';
      }
    });
  }

  private init(): void {
    this.view.getInputFields().forEach((inputField) => this.setInputFieldHandlers(inputField));
    this.setPreventDefaultToForm();
    this.setSwitchOldPasswordVisibilityHandler();
    this.setSwitchNewPasswordVisibilityHandler();
    this.setSubmitFormHandler();
    this.setCancelButtonHandler();
  }

  private async saveNewPassword(): Promise<void> {
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
              showSuccessMessage(SERVER_MESSAGE_KEY.PASSWORD_CHANGED);
              this.clearInputFields();
            } catch {
              showErrorMessage(SERVER_MESSAGE_KEY.PASSWORD_NOT_CHANGED);
            }
          }
        });
    } catch (error) {
      showErrorMessage(error);
    } finally {
      loader.remove();
      modal.hide();
    }
  }

  private setCancelButtonHandler(): void {
    this.view
      .getCancelButton()
      .getHTML()
      .addEventListener('click', () => {
        this.clearInputFields();
        modal.hide();
      });
  }

  private setInputFieldHandlers(inputField: InputFieldModel): void {
    const inputHTML = inputField.getView().getInput().getHTML();
    inputHTML.addEventListener('input', () => this.switchSubmitFormButtonAccess());
  }

  private setPreventDefaultToForm(): void {
    this.view.getHTML().addEventListener('submit', (event) => event.preventDefault());
  }

  private setSubmitFormHandler(): void {
    const submitButton = this.view.getSubmitButton();
    submitButton.getHTML().addEventListener('click', async () => {
      submitButton.setDisabled();
      await this.saveNewPassword();
    });
  }

  private setSwitchNewPasswordVisibilityHandler(): void {
    this.view.getShowNewPasswordElement().addEventListener('click', () => {
      const input = this.view.getNewPasswordField().getView().getInput().getHTML();
      input.type = input.type === INPUT_TYPE.PASSWORD ? INPUT_TYPE.TEXT : INPUT_TYPE.PASSWORD;
      input.placeholder = input.type === INPUT_TYPE.PASSWORD ? PASSWORD_TEXT.HIDDEN : PASSWORD_TEXT.SHOWN;
      this.view.switchPasswordElementSVG(input.type, this.view.getShowNewPasswordElement());
    });
  }

  private setSwitchOldPasswordVisibilityHandler(): void {
    this.view.getShowOldPasswordElement().addEventListener('click', () => {
      const input = this.view.getOldPasswordField().getView().getInput().getHTML();
      input.type = input.type === INPUT_TYPE.PASSWORD ? INPUT_TYPE.TEXT : INPUT_TYPE.PASSWORD;
      input.placeholder = input.type === INPUT_TYPE.PASSWORD ? PASSWORD_TEXT.HIDDEN : PASSWORD_TEXT.SHOWN;
      this.view.switchPasswordElementSVG(input.type, this.view.getShowOldPasswordElement());
    });
  }

  private switchSubmitFormButtonAccess(): void {
    if (this.view.getInputFields().every((inputField) => inputField.getIsValid())) {
      this.view.getSubmitButton().setEnabled();
    } else {
      this.view.getSubmitButton().setDisabled();
    }
  }

  public getHTML(): HTMLFormElement {
    return this.view.getHTML();
  }

  public getView(): PasswordEditView {
    return this.view;
  }
}

export default PasswordEditModel;
