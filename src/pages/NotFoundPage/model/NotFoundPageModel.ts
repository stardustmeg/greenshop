import type RouterModel from '@/app/Router/model/RouterModel.ts';
import type { Page } from '@/shared/types/common.ts';

import EventMediatorModel from '@/shared/EventMediator/model/EventMediatorModel.ts';
import getStore from '@/shared/Store/Store.ts';
import { EVENT_NAMES, MEDIATOR_EVENTS, PAGE_DESCRIPTION, PAGES_IDS } from '@/shared/constants/enums.ts';

import NotFoundPageView from '../view/NotFoundPageView.ts';

class NotFoundPageModel implements Page {
  private eventMediator = EventMediatorModel.getInstance();

  private router: RouterModel;

  private view: NotFoundPageView;

  constructor(parent: HTMLDivElement, router: RouterModel) {
    this.view = new NotFoundPageView(parent);
    this.router = router;
    this.init();
  }

  private createPageDescription(): string {
    const { currentUser } = getStore().getState();

    const textDescription = currentUser
      ? `Hi, ${currentUser.firstName}. ${PAGE_DESCRIPTION[404]}`
      : PAGE_DESCRIPTION[404];
    return textDescription;
  }

  private init(): boolean {
    this.subscribeToEventMediator();
    this.toMainButtonHandler();
    return true;
  }

  private subscribeToEventMediator(): void {
    this.eventMediator.subscribe(MEDIATOR_EVENTS.CHANGE_PAGE, (route) => this.switchPageVisibility(route));
  }

  private switchPageVisibility(route: unknown): boolean {
    if (route === PAGES_IDS.NOT_FOUND_PAGE) {
      this.view.show();
      this.view.setPageDescription(this.createPageDescription());
    } else {
      this.view.hide();
      return false;
    }
    return true;
  }

  private toMainButtonHandler(): boolean {
    const toMainButton = this.view.getToMainButton().getHTML();
    toMainButton.addEventListener(EVENT_NAMES.CLICK, this.router.navigateTo.bind(this.router, PAGES_IDS.MAIN_PAGE));
    return true;
  }

  public getHTML(): HTMLDivElement {
    return this.view.getHTML();
  }
}

export default NotFoundPageModel;
