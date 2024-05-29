import ButtonModel from '@/shared/Button/model/ButtonModel.ts';
import getStore from '@/shared/Store/Store.ts';
import { BUTTON_TEXT } from '@/shared/constants/buttons.ts';
import createBaseElement from '@/shared/utils/createBaseElement.ts';

import styles from './addressEditView.module.scss';

class AddressEditView {
  private cancelButton: ButtonModel;

  private saveChangesButton: ButtonModel;

  private view: HTMLFormElement;

  constructor() {
    this.saveChangesButton = this.createSaveChangesButton();
    this.cancelButton = this.createCancelButton();
    this.view = this.createHTML();
  }

  private createCancelButton(): ButtonModel {
    this.cancelButton = new ButtonModel({
      classes: [styles.cancelButton],
      text: BUTTON_TEXT[getStore().getState().currentLanguage].CANCEL,
    });
    return this.cancelButton;
  }

  private createHTML(): HTMLFormElement {
    this.view = createBaseElement({
      cssClasses: [styles.wrapper],
      tag: 'form',
    });

    this.view.append(this.cancelButton.getHTML(), this.saveChangesButton.getHTML());
    return this.view;
  }

  private createSaveChangesButton(): ButtonModel {
    this.saveChangesButton = new ButtonModel({
      classes: [styles.saveChangesButton],
      text: BUTTON_TEXT[getStore().getState().currentLanguage].SAVE_CHANGES,
    });
    this.saveChangesButton.setDisabled();
    return this.saveChangesButton;
  }

  public getCancelButton(): ButtonModel {
    return this.cancelButton;
  }

  public getHTML(): HTMLFormElement {
    return this.view;
  }

  public getSaveChangesButton(): ButtonModel {
    return this.saveChangesButton;
  }
}

export default AddressEditView;
