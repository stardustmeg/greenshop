import { ERROR_MESSAGE_ANIMATE_DETAILS, TAG_NAMES } from '@/shared/constants/enums.ts';
import createBaseElement from '@/shared/utils/createBaseElement.ts';

import ERROR_MESSAGE_STYLES from './errorMessageView.module.scss';

class ErrorMessageView {
  private errorMessage: HTMLSpanElement;

  private errorWrapper: HTMLDivElement;

  constructor() {
    this.errorMessage = this.createErrorMessage();
    this.errorWrapper = this.createHTML();
  }

  private createErrorMessage(): HTMLSpanElement {
    this.errorMessage = createBaseElement({
      cssClasses: [ERROR_MESSAGE_STYLES.errorMessage],
      tag: TAG_NAMES.SPAN,
    });

    return this.errorMessage;
  }

  private createHTML(): HTMLDivElement {
    this.errorWrapper = createBaseElement({
      cssClasses: [ERROR_MESSAGE_STYLES.errorMessageWrapper],
      tag: TAG_NAMES.DIV,
    });

    this.errorWrapper.append(this.errorMessage);
    document.body.append(this.errorWrapper);
    return this.errorWrapper;
  }

  private startAnimation(): boolean {
    this.errorWrapper.animate(ERROR_MESSAGE_ANIMATE_DETAILS.params, {
      duration: ERROR_MESSAGE_ANIMATE_DETAILS.duration,
      easing: ERROR_MESSAGE_ANIMATE_DETAILS.easing,
    });
    return true;
  }

  public getHTML(): HTMLDivElement {
    return this.errorWrapper;
  }

  public setErrorMessage(message: string): boolean {
    this.errorMessage.textContent = message;
    this.startAnimation();
    return true;
  }
}

export default ErrorMessageView;
