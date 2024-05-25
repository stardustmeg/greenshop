import FooterView from '../view/FooterView.ts';

class FooterModel {
  private view = new FooterView();

  constructor() {
    this.init();
  }

  private init(): boolean {
    return true;
  }

  public getHTML(): HTMLElement {
    return this.view.getHTML();
  }
}

export default FooterModel;
