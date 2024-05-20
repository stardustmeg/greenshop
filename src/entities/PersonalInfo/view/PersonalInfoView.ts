import InputFieldModel from '@/entities/InputField/model/InputFieldModel.ts';
import InputModel from '@/shared/Input/model/InputModel.ts';
import getStore from '@/shared/Store/Store.ts';
import * as FORM_FIELDS from '@/shared/constants/forms/fieldParams.ts';
import * as FORM_CONSTANT from '@/shared/constants/forms/text.ts';
import * as FORM_VALIDATION from '@/shared/constants/forms/validationParams.ts';
import createBaseElement from '@/shared/utils/createBaseElement.ts';
import observeCurrentLanguage from '@/shared/utils/observeCurrentLanguage.ts';

import styles from './personalInfoView.module.scss';

class PersonalInfoView {
  private dateOfBirthField: InputFieldModel;

  private firstNameField: InputFieldModel;

  private inputFields: InputFieldModel[] = [];

  private lastNameField: InputFieldModel;

  private personalDataWrapper: HTMLDivElement;

  constructor() {
    this.firstNameField = this.createFirstNameField();
    this.lastNameField = this.createLastNameField();
    this.dateOfBirthField = this.createDateOfBirthField();
    this.personalDataWrapper = this.createPersonalDataWrapper();
  }

  private createDateOfBirthField(): InputFieldModel {
    this.dateOfBirthField = new InputFieldModel(FORM_FIELDS.BIRTHDAY, FORM_VALIDATION.BIRTHDAY_VALIDATE);
    this.inputFields.push(this.dateOfBirthField);
    return this.dateOfBirthField;
  }

  private createFirstNameField(): InputFieldModel {
    this.firstNameField = new InputFieldModel(FORM_FIELDS.FIRST_NAME, FORM_VALIDATION.FIRST_NAME_VALIDATE);
    this.inputFields.push(this.firstNameField);
    return this.firstNameField;
  }

  private createLastNameField(): InputFieldModel {
    this.lastNameField = new InputFieldModel(FORM_FIELDS.LAST_NAME, FORM_VALIDATION.LAST_NAME_VALIDATE);
    this.inputFields.push(this.lastNameField);
    return this.lastNameField;
  }

  private createPersonalDataWrapper(): HTMLDivElement {
    this.personalDataWrapper = createBaseElement({
      cssClasses: [styles.personalDataWrapper],
      tag: 'div',
    });
    const titleElement = createBaseElement({
      cssClasses: [styles.title],
      innerContent: FORM_CONSTANT.TITLE_TEXT[getStore().getState().currentLanguage].PERSONAL,
      tag: 'h3',
    });
    this.personalDataWrapper.append(titleElement);
    observeCurrentLanguage(titleElement, FORM_CONSTANT.TITLE_TEXT, FORM_CONSTANT.TITLE_TEXT_KEYS.PERSONAL);
    this.inputFields.forEach((inputField) => {
      const inputFieldElement = inputField.getView().getHTML();
      const inputHTML = inputField.getView().getInput().getHTML();
      if (inputFieldElement instanceof HTMLLabelElement) {
        inputFieldElement.classList.add(styles.label);
        inputHTML.classList.add(styles.input);
        this.personalDataWrapper.append(inputFieldElement);
      } else if (inputFieldElement instanceof InputModel) {
        this.personalDataWrapper.append(inputFieldElement.getHTML());
      }
    });
    return this.personalDataWrapper;
  }

  public getDateOfBirthField(): InputFieldModel {
    return this.dateOfBirthField;
  }

  public getFirstNameField(): InputFieldModel {
    return this.firstNameField;
  }

  public getHTML(): HTMLDivElement {
    return this.personalDataWrapper;
  }

  public getInputFields(): InputFieldModel[] {
    return this.inputFields;
  }

  public getLastNameField(): InputFieldModel {
    return this.lastNameField;
  }
}

export default PersonalInfoView;
