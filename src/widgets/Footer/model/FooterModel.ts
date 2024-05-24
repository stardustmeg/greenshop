import NavigationModel from '@/entities/Navigation/model/NavigationModel.ts';

import FooterView from '../view/FooterView.ts';

class FooterModel {
  private navigation: NavigationModel;

  private view = new FooterView();

  constructor() {
    this.navigation = new NavigationModel();
    this.init();
  }

  private init(): boolean {
    this.view.getWrapper().append(this.navigation.getHTML());
    return true;
  }

  public getHTML(): HTMLElement {
    return this.view.getHTML();
  }
}

export default FooterModel;
