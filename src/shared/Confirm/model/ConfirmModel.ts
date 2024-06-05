import LoaderModel from '@/shared/Loader/model/LoaderModel.ts';
import modal from '@/shared/Modal/model/ModalModel.ts';
import { LOADER_SIZE } from '@/shared/constants/sizes.ts';
import { showErrorMessage } from '@/shared/utils/userMessage.ts';

import ConfirmView from '../view/ConfirmView.ts';

class ConfirmModel {
  private callback: () => Promise<void> | void;

  private view: ConfirmView;

  constructor(callback: () => Promise<void> | void, message: string) {
    this.callback = callback;
    this.view = new ConfirmView(message);
    this.setCancelButtonHandler();
    this.setConfirmButtonHandler();
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
      .addEventListener('click', async () => {
        const loader = new LoaderModel(LOADER_SIZE.SMALL).getHTML();
        this.view.getConfirmButton().getHTML().append(loader);
        try {
          await this.callback();
        } catch (error) {
          showErrorMessage(error);
        } finally {
          loader.remove();
        }
        modal.hide();
      });
  }

  public getHTML(): HTMLDivElement {
    return this.view.getHTML();
  }
}

export default ConfirmModel;
