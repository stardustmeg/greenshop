import AppView from '../view/AppView.ts';

class AppModel {
  private appView: AppView = new AppView();

  public getHTML(): HTMLDivElement {
    return this.appView.getHTML();
  }
}

export default AppModel;
