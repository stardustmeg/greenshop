import InputFieldModel from '@/entities/InputField/model/InputFieldModel.ts';
import InputModel from '@/shared/Input/model/InputModel.ts';
import { INPUT_TYPE } from '@/shared/constants/forms.ts';
import * as FORM_FIELDS from '@/shared/constants/forms/fieldParams.ts';
import * as FORM_CONSTANT from '@/shared/constants/forms/text.ts';
import * as FORM_VALIDATION from '@/shared/constants/forms/validationParams.ts';
import SVG_DETAIL from '@/shared/constants/svg.ts';
import createBaseElement from '@/shared/utils/createBaseElement.ts';
import createSVGUse from '@/shared/utils/createSVGUse.ts';
import getCurrentLanguage from '@/shared/utils/getCurrentLanguage.ts';
import observeCurrentLanguage from '@/shared/utils/observeCurrentLanguage.ts';

import styles from './credentialsView.module.scss';

class CredentialsView {
  private credentialsWrapper: HTMLDivElement;

  private emailField: InputFieldModel;

  private inputFields: InputFieldModel[] = [];

  private passwordField: InputFieldModel;

  private showPasswordElement: HTMLDivElement;

  private title: HTMLHeadingElement;

  constructor() {
    this.title = this.createTitle();
    this.showPasswordElement = this.createShowPasswordElement();
    this.emailField = this.createEmailField();

    this.passwordField = this.createPasswordField();
    this.credentialsWrapper = this.createHTML();
  }

  private createEmailField(): InputFieldModel {
    this.emailField = new InputFieldModel(FORM_FIELDS.EMAIL, FORM_VALIDATION.EMAIL_VALIDATE);
    this.inputFields.push(this.emailField);
    return this.emailField;
  }

  private createHTML(): HTMLDivElement {
    this.credentialsWrapper = createBaseElement({
      cssClasses: [styles.credentialsWrapper],
      tag: 'div',
    });

    this.inputFields.forEach((inputField) => {
      const inputFieldElement = inputField.getView().getHTML();
      const inputHTML = inputField.getView().getInput().getHTML();
      if (inputFieldElement instanceof HTMLLabelElement) {
        inputFieldElement.classList.add(styles.label);
        inputHTML.classList.add(styles.input);
        this.credentialsWrapper.append(inputFieldElement);
      } else if (inputFieldElement instanceof InputModel) {
        this.credentialsWrapper.append(inputFieldElement.getHTML());
      }
    });

    return this.credentialsWrapper;
  }

  private createPasswordField(): InputFieldModel {
    this.passwordField = new InputFieldModel(FORM_FIELDS.PASSWORD, FORM_VALIDATION.PASSWORD_VALIDATE);
    this.inputFields.push(this.passwordField);
    const inputElement = this.passwordField.getView().getHTML();
    if (inputElement instanceof HTMLLabelElement) {
      inputElement.append(this.showPasswordElement);
    }
    return this.passwordField;
  }

  private createShowPasswordElement(): HTMLDivElement {
    this.showPasswordElement = createBaseElement({
      cssClasses: [styles.showPasswordElement],
      tag: 'div',
    });
    this.switchPasswordElementSVG(INPUT_TYPE.PASSWORD);
    return this.showPasswordElement;
  }

  private createTitle(): HTMLHeadingElement {
    this.title = createBaseElement({
      cssClasses: [styles.title],
      innerContent: FORM_CONSTANT.TITLE_TEXT[getCurrentLanguage()].CREDENTIALS,
      tag: 'h3',
    });
    observeCurrentLanguage(this.title, FORM_CONSTANT.TITLE_TEXT, FORM_CONSTANT.TITLE_TEXT_KEYS.CREDENTIALS);
    return this.title;
  }

  public getEmailField(): InputFieldModel {
    return this.emailField;
  }

  public getHTML(): HTMLDivElement {
    return this.credentialsWrapper;
  }

  public getInputFields(): InputFieldModel[] {
    return this.inputFields;
  }

  public getPasswordField(): InputFieldModel {
    return this.passwordField;
  }

  public getShowPasswordElement(): HTMLDivElement {
    return this.showPasswordElement;
  }

  public getTitle(): HTMLHeadingElement {
    return this.title;
  }

  public switchPasswordElementSVG(type: string): SVGSVGElement {
    const svg = document.createElementNS(SVG_DETAIL.SVG_URL, 'svg');
    this.showPasswordElement.innerHTML = '';
    svg.append(createSVGUse(type === INPUT_TYPE.PASSWORD ? SVG_DETAIL.CLOSE_EYE : SVG_DETAIL.OPEN_EYE));
    this.showPasswordElement.append(svg);
    return svg;
  }
}

export default CredentialsView;
