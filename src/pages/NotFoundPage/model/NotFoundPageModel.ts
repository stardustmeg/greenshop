import type RouterModel from '@/app/Router/model/RouterModel.ts';
import type { Page } from '@/shared/types/common.ts';

import EventMediatorModel from '@/shared/EventMediator/model/EventMediatorModel.ts';
import getStore from '@/shared/Store/Store.ts';
import observeStore, { selectCurrentLanguage } from '@/shared/Store/observer.ts';
import MEDIATOR_EVENT from '@/shared/constants/events.ts';
import { PAGE_DESCRIPTION, PAGE_ID } from '@/shared/constants/pages.ts';

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
    const { currentLanguage, currentUser } = getStore().getState();
    const { GREETING } = PAGE_DESCRIPTION[currentLanguage];
    const textDescription = currentUser
      ? `${GREETING}${currentUser.firstName}. ${PAGE_DESCRIPTION[currentLanguage][404]}`
      : PAGE_DESCRIPTION[currentLanguage][404];
    return textDescription;
  }

  private init(): boolean {
    this.subscribeToEventMediator();
    this.toMainButtonHandler();
    this.observeStoreLanguage();
    return true;
  }

  private observeStoreLanguage(): boolean {
    observeStore(selectCurrentLanguage, () => {
      this.view.setPageDescription(this.createPageDescription());
    });
    return true;
  }

  private subscribeToEventMediator(): void {
    this.eventMediator.subscribe(MEDIATOR_EVENT.CHANGE_PAGE, (route) => this.switchPageVisibility(route));
  }

  private switchPageVisibility(route: unknown): boolean {
    if (route === PAGE_ID.NOT_FOUND_PAGE) {
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
    toMainButton.addEventListener('click', this.router.navigateTo.bind(this.router, PAGE_ID.MAIN_PAGE));
    return true;
  }

  public getHTML(): HTMLDivElement {
    return this.view.getHTML();
  }
}

export default NotFoundPageModel;
