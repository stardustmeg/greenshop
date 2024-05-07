import SERVER_MESSAGE_ANIMATE_DETAILS from '@/shared/constants/animations.ts';
import { MESSAGE_STATUS, type MessageStatusType } from '@/shared/constants/messages.ts';
import createBaseElement from '@/shared/utils/createBaseElement.ts';

import styles from './serverMessageView.module.scss';

class ServerMessageView {
  private serverMessage: HTMLSpanElement;

  private serverWrapper: HTMLDivElement;

  constructor() {
    this.serverMessage = this.createServerMessage();
    this.serverWrapper = this.createHTML();
  }

  private createHTML(): HTMLDivElement {
    this.serverWrapper = createBaseElement({
      cssClasses: [styles.serverMessageWrapper],
      tag: 'div',
    });

    this.serverWrapper.append(this.serverMessage);
    document.body.append(this.serverWrapper);
    return this.serverWrapper;
  }

  private createServerMessage(): HTMLSpanElement {
    this.serverMessage = createBaseElement({
      cssClasses: [styles.serverMessage],
      tag: 'span',
    });

    return this.serverMessage;
  }

  private startAnimation(): boolean {
    this.serverWrapper.animate(SERVER_MESSAGE_ANIMATE_DETAILS.params, {
      duration: SERVER_MESSAGE_ANIMATE_DETAILS.duration,
      easing: SERVER_MESSAGE_ANIMATE_DETAILS.easing,
    });
    return true;
  }

  public getHTML(): HTMLDivElement {
    return this.serverWrapper;
  }

  public setServerMessage(message: string, status: MessageStatusType): boolean {
    this.serverWrapper.classList.toggle(styles.error, status === MESSAGE_STATUS.ERROR);
    this.serverWrapper.classList.toggle(styles.success, status === MESSAGE_STATUS.SUCCESS);
    this.serverMessage.textContent = message;
    this.startAnimation();
    return true;
  }
}

export default ServerMessageView;
