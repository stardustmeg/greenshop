import ModalView from '../view/ModalView.ts';

class ModalModel {
  private view = new ModalView();

  public getHTML(): HTMLDivElement {
    return this.view.getHTML();
  }

  public getView(): ModalView {
    return this.view;
  }

  public hide(callback?: () => void): void {
    if (callback) {
      this.view.hide(callback);
    } else {
      this.view.hide();
    }
  }

  public setContent(content: HTMLElement): void {
    this.view.setContent(content);
  }

  public show(callback?: () => void): void {
    if (callback) {
      this.view.show(callback);
    } else {
      this.view.show();
    }
  }
}

const modal = new ModalModel();

export default modal;
