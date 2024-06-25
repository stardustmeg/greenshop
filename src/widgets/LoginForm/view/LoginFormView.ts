import ButtonModel from '@/shared/Button/model/ButtonModel.ts';
import { BUTTON_TEXT, BUTTON_TEXT_KEY, BUTTON_TYPE } from '@/shared/constants/buttons.ts';
import createBaseElement from '@/shared/utils/createBaseElement.ts';
import getCurrentLanguage from '@/shared/utils/getCurrentLanguage.ts';
import observeCurrentLanguage from '@/shared/utils/observeCurrentLanguage.ts';

import styles from './loginForm.module.scss';

class LoginFormView {
  private form: HTMLFormElement;

  private submitFormButton: ButtonModel;

  constructor() {
    this.submitFormButton = this.createSubmitFormButton();
    this.form = this.createHTML();
  }

  private createHTML(): HTMLFormElement {
    this.form = createBaseElement({
      cssClasses: [styles.loginForm],
      tag: 'form',
    });

    this.form.append(this.submitFormButton.getHTML());
    return this.form;
  }

  private createSubmitFormButton(): ButtonModel {
    this.submitFormButton = new ButtonModel({
      attrs: {
        type: BUTTON_TYPE.SUBMIT,
      },
      classes: [styles.submitFormButton],
      text: BUTTON_TEXT[getCurrentLanguage()].LOGIN,
    });

    observeCurrentLanguage(this.submitFormButton.getHTML(), BUTTON_TEXT, BUTTON_TEXT_KEY.LOGIN);

    this.submitFormButton.setDisabled();

    return this.submitFormButton;
  }

  public getHTML(): HTMLFormElement {
    return this.form;
  }

  public getSubmitFormButton(): ButtonModel {
    return this.submitFormButton;
  }
}

export default LoginFormView;
