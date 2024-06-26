import clearOutElement from '@/shared/utils/clearOutElement.ts';
import createBaseElement from '@/shared/utils/createBaseElement.ts';

import styles from './modalView.module.scss';

class ModalView {
  private callback: () => void = () => {};

  private modal: HTMLDivElement;

  private modalContent: HTMLDivElement;

  private modalOverlay: HTMLDivElement;

  constructor() {
    this.modalContent = this.createModalContent();
    this.modalOverlay = this.createModalOverlay();
    this.modal = this.createHTML();

    document.addEventListener('click', (event) => {
      if (event.target === this.modalOverlay && !this.modalContent.classList.contains(styles.modalContent_hidden)) {
        this.hide(this.callback);
        this.callback = (): void => {};
      }
    });

    document.addEventListener('keydown', ({ key }) => {
      if (
        !this.modalContent.classList.contains(styles.modalContent_hidden) &&
        key === 'Escape' &&
        !this.modalContent.classList.contains(styles.modalContent_hidden)
      ) {
        this.hide(this.callback);
        this.callback = (): void => {};
      }
    });
  }

  private createHTML(): HTMLDivElement {
    this.modal = createBaseElement({
      cssClasses: [styles.modal, styles.modal_hidden],
      tag: 'div',
    });

    this.modalOverlay.append(this.modalContent);
    this.modal.append(this.modalOverlay);

    return this.modal;
  }

  private createModalContent(): HTMLDivElement {
    this.modalContent = createBaseElement({
      cssClasses: [styles.modalContent, styles.modalContent_hidden, 'modalProductInfoWrapper'],
      tag: 'div',
    });

    return this.modalContent;
  }

  private createModalOverlay(): HTMLDivElement {
    this.modalOverlay = createBaseElement({
      cssClasses: [styles.modalOverlay, styles.modalOverlay_hidden],
      tag: 'div',
    });

    return this.modalOverlay;
  }

  private setCallback(callback: () => void): void {
    this.callback = callback;
  }

  public getHTML(): HTMLDivElement {
    return this.modal;
  }

  public getModalContent(): HTMLDivElement {
    return this.modalContent;
  }

  public getModalOverlay(): HTMLDivElement {
    return this.modalOverlay;
  }

  public hide(callback?: () => void): void {
    callback?.();
    this.modal.classList.add(styles.modal_hidden);
    this.modalOverlay.classList.add(styles.modalOverlay_hidden);
    this.modalContent.classList.add(styles.modalContent_hidden);
    document.body.classList.remove('stop-scroll');
  }

  public setContent(content: HTMLElement): void {
    clearOutElement(this.modalContent);
    this.modalContent.append(content);
  }

  public show(callback?: () => void): void {
    if (callback) {
      this.setCallback(callback);
    }

    this.modal.classList.remove(styles.modal_hidden);
    this.modalOverlay.classList.remove(styles.modalOverlay_hidden);
    this.modalContent.classList.remove(styles.modalContent_hidden);
    document.body.classList.add('stop-scroll');
  }
}

export default ModalView;
