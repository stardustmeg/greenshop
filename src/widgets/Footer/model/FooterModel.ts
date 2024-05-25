import FooterView from '../view/FooterView.ts';

class FooterModel {
  private view = new FooterView();

  public getHTML(): HTMLElement {
    return this.view.getHTML();
  }
}

export default FooterModel;
