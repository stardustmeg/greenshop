import createBaseElement from '@/shared/utils/createBaseElement.ts';

import styles from './modalView.module.scss';

class ModalView {
  private modal: HTMLDivElement;

  private modalContent: HTMLDivElement;

  private modalOverlay: HTMLDivElement;

  constructor() {
    this.modalContent = this.createModalContent();
    this.modalOverlay = this.createModalOverlay();
    this.modal = this.createHTML();

    document.addEventListener('click', ({ target }) => {
      if (target instanceof HTMLDivElement && !this.modalContent.contains(target)) {
        this.hide();
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
      cssClasses: [styles.modalContent, styles.modalContent_hidden],
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

  public getHTML(): HTMLDivElement {
    return this.modal;
  }

  public getModalContent(): HTMLDivElement {
    return this.modalContent;
  }

  public getModalOverlay(): HTMLDivElement {
    return this.modalOverlay;
  }

  public hide(): void {
    this.modal.classList.add(styles.modal_hidden);
    this.modalOverlay.classList.add(styles.modalOverlay_hidden);
    this.modalContent.classList.add(styles.modalContent_hidden);
    document.body.classList.remove('stop-scroll');
  }

  public setContent(content: HTMLElement): void {
    this.modalContent.innerHTML = '';
    this.modalContent.append(content);
  }

  public show(): void {
    this.modal.classList.remove(styles.modal_hidden);
    this.modalOverlay.classList.remove(styles.modalOverlay_hidden);
    this.modalContent.classList.remove(styles.modalContent_hidden);
    document.body.classList.add('stop-scroll');
  }
}

export default ModalView;
