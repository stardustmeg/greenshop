import NameView from '../view/TemplateView.ts';

class NameModel {
  private view = new NameView();

  // constructor() {}

  public getHTML(): void {
    return this.view.getHTML();
  }
}

export default NameModel;
