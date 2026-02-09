import type InputFieldModel from '@/entities/InputField/model/InputFieldModel.ts';
import type { UserCredentials } from '@/shared/types/user.ts';

import { INPUT_TYPE, PASSWORD_TEXT } from '@/shared/constants/forms.ts';

import CredentialsView from '../view/CredentialsView.ts';

class CredentialsModel {
  private view: CredentialsView;

  constructor() {
    this.view = new CredentialsView();
    this.init();
  }

  private init(): void {
    this.setSwitchPasswordVisibilityHandler();
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

  public getFormCredentials(): UserCredentials {
    const userData: UserCredentials = {
      email: this.view.getEmailField().getView().getValue(),
      password: this.view.getPasswordField().getView().getValue(),
    };
    return userData;
  }

  public getHTML(): HTMLDivElement {
    return this.view.getHTML();
  }

  public getInputFields(): InputFieldModel[] {
    return this.view.getInputFields();
  }

  public getView(): CredentialsView {
    return this.view;
  }
}

export default CredentialsModel;
