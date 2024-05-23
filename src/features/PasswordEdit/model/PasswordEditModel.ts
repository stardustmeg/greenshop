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
    this.setSwitchOldPasswordVisibilityHandler();
    this.setSwitchNewPasswordVisibilityHandler();
    this.setCancelButtonHandler();
    this.setSaveChangesButtonHandler();
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

  private setSaveChangesButtonHandler(): boolean {
    this.view
      .getSaveChangesButton()
      .getHTML()
      .addEventListener('click', async () => {
        const loader = new LoaderModel(LOADER_SIZE.SMALL).getHTML();
        this.view.getSaveChangesButton().getHTML().append(loader);
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
        } catch {
          showErrorMessage();
        } finally {
          loader.remove();
        }
      });
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

  public getHTML(): HTMLDivElement {
    return this.view.getHTML();
  }

  public getView(): PasswordEditView {
    return this.view;
  }
}

export default PasswordEditModel;
