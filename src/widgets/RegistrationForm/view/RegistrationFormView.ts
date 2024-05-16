import ButtonModel from '@/shared/Button/model/ButtonModel.ts';
import getStore from '@/shared/Store/Store.ts';
import { BUTTON_TEXT, BUTTON_TEXT_KEYS, BUTTON_TYPE } from '@/shared/constants/buttons.ts';
import createBaseElement from '@/shared/utils/createBaseElement.ts';
import observeCurrentLanguage from '@/shared/utils/observeCurrentLanguage.ts';

import styles from './registrationForm.module.scss';

class RegistrationFormView {
  private form: HTMLFormElement;

  private submitFormButton: ButtonModel;

  constructor() {
    this.submitFormButton = this.createSubmitFormButton();
    this.form = this.createHTML();
  }

  private createHTML(): HTMLFormElement {
    this.form = createBaseElement({
      cssClasses: [styles.registrationForm],
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
      text: BUTTON_TEXT[getStore().getState().currentLanguage].REGISTRATION,
    });
    observeCurrentLanguage(this.submitFormButton.getHTML(), BUTTON_TEXT, BUTTON_TEXT_KEYS.REGISTRATION);
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

export default RegistrationFormView;
