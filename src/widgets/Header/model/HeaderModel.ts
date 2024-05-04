import type RouterModel from '@/app/Router/model/RouterModel.ts';

import NavigationModel from '@/entities/Navigation/model/NavigationModel.ts';

import HeaderView from '../view/HeaderView.ts';

class HeaderModel {
  private navigation: NavigationModel;

  private router: RouterModel;

  private view = new HeaderView();

  constructor(router: RouterModel) {
    this.router = router;
    this.navigation = new NavigationModel(this.router);
    this.init();
  }

  private init(): boolean {
    this.getHTML().append(this.navigation.getHTML());
    return true;
  }

  public getHTML(): HTMLElement {
    return this.view.getHTML();
  }
}
export default HeaderModel;
