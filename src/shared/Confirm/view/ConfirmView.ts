import ButtonModel from '@/shared/Button/model/ButtonModel.ts';
import { BUTTON_TEXT, BUTTON_TEXT_KEY } from '@/shared/constants/buttons.ts';
import createBaseElement from '@/shared/utils/createBaseElement.ts';
import getCurrentLanguage from '@/shared/utils/getCurrentLanguage.ts';
import observeCurrentLanguage from '@/shared/utils/observeCurrentLanguage.ts';

import styles from './confirmView.module.scss';

class ConfirmView {
  private cancelButton: ButtonModel;

  private confirmButton: ButtonModel;

  private userMessage: HTMLSpanElement;

  private view: HTMLDivElement;

  constructor(userMessage: string) {
    this.userMessage = this.createUserMessage(userMessage);
    this.cancelButton = this.createCancelButton();
    this.confirmButton = this.createConfirmButton();
    this.view = this.createHTML();
  }

  private createCancelButton(): ButtonModel {
    this.cancelButton = new ButtonModel({
      classes: [styles.cancelButton],
      text: BUTTON_TEXT[getCurrentLanguage()].CANCEL,
    });

    observeCurrentLanguage(this.cancelButton.getHTML(), BUTTON_TEXT, BUTTON_TEXT_KEY.CANCEL);

    return this.cancelButton;
  }

  private createConfirmButton(): ButtonModel {
    this.confirmButton = new ButtonModel({
      classes: [styles.confirmButton],
      text: BUTTON_TEXT[getCurrentLanguage()].CONFIRM,
    });

    observeCurrentLanguage(this.confirmButton.getHTML(), BUTTON_TEXT, BUTTON_TEXT_KEY.CONFIRM);

    return this.confirmButton;
  }

  private createHTML(): HTMLDivElement {
    this.view = createBaseElement({
      cssClasses: [styles.wrapper],
      tag: 'div',
    });
    this.view.append(this.userMessage, this.cancelButton.getHTML(), this.confirmButton.getHTML());
    return this.view;
  }

  private createUserMessage(message: string): HTMLSpanElement {
    this.userMessage = createBaseElement({
      cssClasses: [styles.userMessage],
      innerContent: message,
      tag: 'span',
    });

    return this.userMessage;
  }

  public getCancelButton(): ButtonModel {
    return this.cancelButton;
  }

  public getConfirmButton(): ButtonModel {
    return this.confirmButton;
  }

  public getHTML(): HTMLDivElement {
    return this.view;
  }
}

export default ConfirmView;
