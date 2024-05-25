import type { MessageStatusType, ServerMessageKeysType } from '@/shared/constants/messages.ts';

import getStore from '@/shared/Store/Store.ts';
import SERVER_MESSAGE_ANIMATE_DETAILS, {
  SERVER_MESSAGE_PROGRESS_BAR_ANIMATE_DETAILS_END,
  SERVER_MESSAGE_PROGRESS_BAR_ANIMATE_DETAILS_START,
} from '@/shared/constants/animations.ts';
import { MESSAGE_STATUS, SERVER_MESSAGE } from '@/shared/constants/messages.ts';
import createBaseElement from '@/shared/utils/createBaseElement.ts';

import styles from './serverMessageView.module.scss';

class ServerMessageView {
  private progressBar: HTMLDivElement;

  private serverMessage: HTMLSpanElement;

  private serverWrapper: HTMLDivElement;

  constructor() {
    this.progressBar = this.createProgressBar();
    this.serverMessage = this.createServerMessage();
    this.serverWrapper = this.createHTML();
  }

  private createHTML(): HTMLDivElement {
    this.serverWrapper = createBaseElement({
      cssClasses: [styles.serverMessageWrapper],
      tag: 'div',
    });

    this.serverWrapper.append(this.serverMessage, this.progressBar);
    document.body.append(this.serverWrapper);
    return this.serverWrapper;
  }

  private createProgressBar(): HTMLDivElement {
    this.progressBar = createBaseElement({
      cssClasses: [styles.progressBar],
      tag: 'div',
    });

    return this.progressBar;
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

    this.progressBar.animate(SERVER_MESSAGE_PROGRESS_BAR_ANIMATE_DETAILS_START.params, {
      delay: SERVER_MESSAGE_PROGRESS_BAR_ANIMATE_DETAILS_START.delay,
      duration: SERVER_MESSAGE_PROGRESS_BAR_ANIMATE_DETAILS_START.duration,
      easing: SERVER_MESSAGE_PROGRESS_BAR_ANIMATE_DETAILS_START.easing,
      fill: 'forwards',
    });

    this.progressBar.animate(SERVER_MESSAGE_PROGRESS_BAR_ANIMATE_DETAILS_END.params, {
      delay: SERVER_MESSAGE_PROGRESS_BAR_ANIMATE_DETAILS_END.delay,
      duration: SERVER_MESSAGE_PROGRESS_BAR_ANIMATE_DETAILS_END.duration,
      easing: SERVER_MESSAGE_PROGRESS_BAR_ANIMATE_DETAILS_END.easing,
      fill: 'forwards',
    });
    return true;
  }

  public getHTML(): HTMLDivElement {
    return this.serverWrapper;
  }

  public setServerMessage(keyOrMessage: ServerMessageKeysType, status: MessageStatusType, message?: string): boolean {
    this.serverWrapper.classList.toggle(styles.error, status === MESSAGE_STATUS.ERROR);
    this.serverWrapper.classList.toggle(styles.success, status === MESSAGE_STATUS.SUCCESS);

    this.serverMessage.textContent = SERVER_MESSAGE[getStore().getState().currentLanguage][keyOrMessage];
    this.serverMessage.textContent = message || this.serverMessage.textContent;

    this.startAnimation();
    return true;
  }
}

export default ServerMessageView;
