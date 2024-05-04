import type RouterModel from '@/app/Router/model/RouterModel';

import { EVENT_NAME } from '@/shared/constants/events.ts';

import NavigationView from '../view/NavigationView.ts';

class NavigationModel {
  private router: RouterModel;

  private view = new NavigationView();

  constructor(router: RouterModel) {
    this.router = router;
    this.init();
  }

  private init(): boolean {
    this.setNavigationLinksHandlers();
    return true;
  }

  private setNavigationLinksHandlers(): boolean {
    const navigationLinks = this.view.getNavigationLinks();
    navigationLinks.forEach((value, key) => {
      value.getHTML().addEventListener(EVENT_NAME.CLICK, (event) => {
        event.preventDefault();
        this.router.navigateTo(key);
      });
    });

    return true;
  }

  public getHTML(): HTMLElement {
    return this.view.getHTML();
  }
}

export default NavigationModel;
