import InputFieldModel from '@/entities/InputField/model/InputFieldModel.ts';
import ButtonModel from '@/shared/Button/model/ButtonModel.ts';
import InputModel from '@/shared/Input/model/InputModel.ts';
import getStore from '@/shared/Store/Store.ts';
import { BUTTON_TEXT } from '@/shared/constants/buttons.ts';
import { INPUT_TYPE } from '@/shared/constants/forms.ts';
import * as FORM_FIELDS from '@/shared/constants/forms/fieldParams.ts';
import * as FORM_VALIDATION from '@/shared/constants/forms/validationParams.ts';
import SVG_DETAILS from '@/shared/constants/svg.ts';
import createBaseElement from '@/shared/utils/createBaseElement.ts';
import createSVGUse from '@/shared/utils/createSVGUse.ts';

import styles from './passwordEditView.module.scss';

class PasswordEditView {
  private cancelButton: ButtonModel;

  private inputFields: InputFieldModel[] = [];

  private newPasswordField: InputFieldModel;

  private oldPasswordField: InputFieldModel;

  private saveChangesButton: ButtonModel;

  private showNewPasswordElement: HTMLDivElement;

  private showOldPasswordElement: HTMLDivElement;

  private view: HTMLDivElement;

  constructor() {
    this.saveChangesButton = this.createSaveChangesButton();
    this.cancelButton = this.createCancelButton();
    this.showOldPasswordElement = this.createShowOldPasswordElement();
    this.showNewPasswordElement = this.createShowNewPasswordElement();
    this.oldPasswordField = this.createOldPasswordField();
    this.newPasswordField = this.createNewPasswordField();
    this.view = this.createHTML();
  }

  private createCancelButton(): ButtonModel {
    this.cancelButton = new ButtonModel({
      classes: [styles.cancelButton],
      text: BUTTON_TEXT[getStore().getState().currentLanguage].CANCEL,
    });
    return this.cancelButton;
  }

  private createHTML(): HTMLDivElement {
    this.view = createBaseElement({
      cssClasses: [styles.wrapper],
      tag: 'div',
    });

    this.inputFields.forEach((inputField) => {
      const inputFieldElement = inputField.getView().getHTML();
      const inputHTML = inputField.getView().getInput().getHTML();
      if (inputFieldElement instanceof HTMLLabelElement) {
        inputFieldElement.classList.add(styles.label);
        inputHTML.classList.add(styles.input);
        this.view.append(inputFieldElement);
      } else if (inputFieldElement instanceof InputModel) {
        this.view.append(inputFieldElement.getHTML());
      }
    });

    this.view.append(this.cancelButton.getHTML(), this.saveChangesButton.getHTML());
    return this.view;
  }

  private createNewPasswordField(): InputFieldModel {
    this.newPasswordField = new InputFieldModel(FORM_FIELDS.NEW_PASSWORD, FORM_VALIDATION.PASSWORD_VALIDATE);
    this.inputFields.push(this.newPasswordField);
    const inputElement = this.newPasswordField.getView().getHTML();
    if (inputElement instanceof HTMLLabelElement) {
      inputElement.append(this.showNewPasswordElement);
    }
    return this.newPasswordField;
  }

  private createOldPasswordField(): InputFieldModel {
    this.oldPasswordField = new InputFieldModel(FORM_FIELDS.OLD_PASSWORD, FORM_VALIDATION.PASSWORD_VALIDATE);
    this.inputFields.push(this.oldPasswordField);
    const inputElement = this.oldPasswordField.getView().getHTML();
    if (inputElement instanceof HTMLLabelElement) {
      inputElement.append(this.showOldPasswordElement);
    }
    return this.oldPasswordField;
  }

  private createSaveChangesButton(): ButtonModel {
    this.saveChangesButton = new ButtonModel({
      classes: [styles.saveChangesButton],
      text: BUTTON_TEXT[getStore().getState().currentLanguage].SAVE_CHANGES,
    });
    return this.saveChangesButton;
  }

  private createShowNewPasswordElement(): HTMLDivElement {
    this.showNewPasswordElement = createBaseElement({
      cssClasses: [styles.showPasswordElement],
      tag: 'div',
    });
    this.switchPasswordElementSVG(INPUT_TYPE.PASSWORD, this.showNewPasswordElement);
    return this.showNewPasswordElement;
  }

  private createShowOldPasswordElement(): HTMLDivElement {
    this.showOldPasswordElement = createBaseElement({
      cssClasses: [styles.showPasswordElement],
      tag: 'div',
    });
    this.switchPasswordElementSVG(INPUT_TYPE.PASSWORD, this.showOldPasswordElement);
    return this.showOldPasswordElement;
  }

  public getCancelButton(): ButtonModel {
    return this.cancelButton;
  }

  public getHTML(): HTMLDivElement {
    return this.view;
  }

  public getInputFields(): InputFieldModel[] {
    return this.inputFields;
  }

  public getNewPasswordField(): InputFieldModel {
    return this.newPasswordField;
  }

  public getOldPasswordField(): InputFieldModel {
    return this.oldPasswordField;
  }

  public getSaveChangesButton(): ButtonModel {
    return this.saveChangesButton;
  }

  public getShowNewPasswordElement(): HTMLDivElement {
    return this.showNewPasswordElement;
  }

  public getShowOldPasswordElement(): HTMLDivElement {
    return this.showOldPasswordElement;
  }

  public switchPasswordElementSVG(type: string, el: HTMLDivElement): SVGSVGElement {
    const element = el;
    const svg = document.createElementNS(SVG_DETAILS.SVG_URL, 'svg');
    element.innerHTML = '';
    svg.append(createSVGUse(type === INPUT_TYPE.PASSWORD ? SVG_DETAILS.CLOSE_EYE : SVG_DETAILS.OPEN_EYE));
    element.append(svg);
    return svg;
  }
}

export default PasswordEditView;
