import type RouterModel from '@/app/Router/model/RouterModel.ts';

import NavigationModel from '@/entities/Navigation/model/NavigationModel.ts';
import { EVENT_NAME } from '@/shared/constants/events.ts';
import { PAGE_ID } from '@/shared/constants/pages.ts';

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
    this.setLogoHandler();
    return true;
  }

  private setLogoHandler(): boolean {
    const logo = this.view.getLinkLogo().getHTML();
    logo.addEventListener(EVENT_NAME.CLICK, (event) => {
      event.preventDefault();
      this.router.navigateTo(PAGE_ID.DEFAULT_PAGE);
    });
    return true;
  }

  public getHTML(): HTMLElement {
    return this.view.getHTML();
  }
}
export default HeaderModel;
