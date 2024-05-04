import type RouterModel from '@/app/Router/model/RouterModel';

import EventMediatorModel from '@/shared/EventMediator/model/EventMediatorModel.ts';
import getStore from '@/shared/Store/Store.ts';
import observeStore, { selectCurrentUser } from '@/shared/Store/observer.ts';
import { EVENT_NAME, MEDIATOR_EVENT } from '@/shared/constants/events.ts';
import { PAGE_ID } from '@/shared/constants/pages.ts';

import NavigationView from '../view/NavigationView.ts';

class NavigationModel {
  private eventMediator = EventMediatorModel.getInstance();

  private router: RouterModel;

  private view = new NavigationView();

  constructor(router: RouterModel) {
    this.router = router;
    this.init();
  }

  private checkCurrentUser(): boolean {
    const { currentUser } = getStore().getState();
    const navigationLinks = this.view.getNavigationLinks();
    if (!currentUser) {
      navigationLinks.get(PAGE_ID.LOGIN_PAGE)?.setEnabled();
    } else {
      navigationLinks.get(PAGE_ID.LOGIN_PAGE)?.setDisabled();
    }
    return true;
  }

  private init(): boolean {
    this.setNavigationLinksHandlers();
    this.observeCurrentUser();
    this.subscribeToEventMediator();
    return true;
  }

  private observeCurrentUser(): boolean {
    observeStore(selectCurrentUser, () => this.checkCurrentUser.bind(this));
    return true;
  }

  private setNavigationLinksHandlers(): boolean {
    const navigationLinks = this.view.getNavigationLinks();
    navigationLinks.forEach((link, route) => {
      link.getHTML().addEventListener(EVENT_NAME.CLICK, (event) => {
        event.preventDefault();
        this.router.navigateTo(route);
      });
    });

    return true;
  }

  private subscribeToEventMediator(): boolean {
    this.eventMediator.subscribe(MEDIATOR_EVENT.CHANGE_PAGE, (route) => {
      const navigationLinks = this.view.getNavigationLinks();
      const currentLink = navigationLinks.get(String(route));
      navigationLinks.forEach((link) => link.setEnabled());
      currentLink?.setDisabled();
      this.checkCurrentUser();
    });
    return true;
  }

  public getHTML(): HTMLElement {
    return this.view.getHTML();
  }
}

export default NavigationModel;
