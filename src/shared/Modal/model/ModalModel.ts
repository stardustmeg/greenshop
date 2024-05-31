import ModalView from '../view/ModalView.ts';

class ModalModel {
  private view = new ModalView();

  public getHTML(): HTMLDivElement {
    return this.view.getHTML();
  }

  public hide(): void {
    this.view.hide();
  }

  public removeContent(): void {
    this.view.removeContent();
  }

  public setContent(content: HTMLElement): void {
    this.view.setContent(content);
  }

  public show(): void {
    this.view.show();
  }
}

const modal = new ModalModel();

export default modal;
