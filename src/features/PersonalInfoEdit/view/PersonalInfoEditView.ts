import InputFieldModel from '@/entities/InputField/model/InputFieldModel.ts';
import ButtonModel from '@/shared/Button/model/ButtonModel.ts';
import InputModel from '@/shared/Input/model/InputModel.ts';
import { BUTTON_TEXT } from '@/shared/constants/buttons.ts';
import { EMAIL } from '@/shared/constants/forms/fieldParams.ts';
import { EMAIL_VALIDATE } from '@/shared/constants/forms/validationParams.ts';
import createBaseElement from '@/shared/utils/createBaseElement.ts';
import getCurrentLanguage from '@/shared/utils/getCurrentLanguage.ts';

import styles from './personalInfoEditView.module.scss';
import './personalInfoEditView.scss';

class PersonalInfoEditView {
  private cancelButton: ButtonModel;

  private emailField: InputFieldModel;

  private saveChangesButton: ButtonModel;

  private view: HTMLFormElement;

  constructor() {
    this.emailField = this.createEmailField();
    this.saveChangesButton = this.createSaveChangesButton();
    this.cancelButton = this.createCancelButton();
    this.view = this.createHTML();
  }

  private createCancelButton(): ButtonModel {
    this.cancelButton = new ButtonModel({
      classes: [styles.cancelButton],
      text: BUTTON_TEXT[getCurrentLanguage()].CANCEL,
    });
    return this.cancelButton;
  }

  private createEmailField(): InputFieldModel {
    this.emailField = new InputFieldModel(EMAIL, EMAIL_VALIDATE);
    return this.emailField;
  }

  private createHTML(): HTMLFormElement {
    this.view = createBaseElement({
      cssClasses: [styles.wrapper, 'modalForm'],
      tag: 'form',
    });

    const inputFieldElement = this.emailField.getView().getHTML();
    const inputHTML = this.emailField.getView().getInput().getHTML();
    if (inputFieldElement instanceof HTMLLabelElement) {
      inputFieldElement.classList.add(styles.label, styles.labelEmail);
      inputHTML.classList.add(styles.input);
      this.view.append(inputFieldElement);
    } else if (inputFieldElement instanceof InputModel) {
      this.view.append(inputFieldElement.getHTML());
    }

    this.view.append(this.saveChangesButton.getHTML(), this.cancelButton.getHTML());
    return this.view;
  }

  private createSaveChangesButton(): ButtonModel {
    this.saveChangesButton = new ButtonModel({
      classes: [styles.saveChangesButton],
      text: BUTTON_TEXT[getCurrentLanguage()].SAVE_CHANGES,
    });
    this.saveChangesButton.setDisabled();
    return this.saveChangesButton;
  }

  public getCancelButton(): ButtonModel {
    return this.cancelButton;
  }

  public getEmailField(): InputFieldModel {
    return this.emailField;
  }

  public getHTML(): HTMLFormElement {
    return this.view;
  }

  public getSaveChangesButton(): ButtonModel {
    return this.saveChangesButton;
  }
}

export default PersonalInfoEditView;
