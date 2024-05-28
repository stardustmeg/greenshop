import modal from '@/shared/Modal/model/ModalModel.ts';

import ConfirmView from '../view/ConfirmView.ts';

class ConfirmModel {
  private callback: () => void;

  private view = new ConfirmView();

  constructor(callback: () => void) {
    this.callback = callback;
    this.setConfirmButtonHandler();
    this.setCancelButtonHandler();
  }

  private setCancelButtonHandler(): void {
    this.view
      .getCancelButton()
      .getHTML()
      .addEventListener('click', () => {
        modal.hide();
      });
  }

  private setConfirmButtonHandler(): void {
    this.view
      .getConfirmButton()
      .getHTML()
      .addEventListener('click', () => {
        this.callback();
        modal.hide();
      });
  }

  public getHTML(): HTMLDivElement {
    return this.view.getHTML();
  }
}

export default ConfirmModel;
