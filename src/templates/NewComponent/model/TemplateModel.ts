import NameView from '../view/TemplateView.ts';

class NameModel {
  private view = new NameView();

  constructor() {
    this.init();
  }

  private init(): void {}

  public getHTML(): HTMLDivElement {
    return this.view.getHTML();
  }
}

export default NameModel;
