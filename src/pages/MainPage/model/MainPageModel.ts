import type RouterModel from '@/app/Router/model/RouterModel.ts';
import type { Page } from '@/shared/types/common.ts';

import EventMediatorModel from '@/shared/EventMediator/model/EventMediatorModel.ts';
import observeStore, { selectCurrentUser } from '@/shared/Store/observer.ts';
import { MEDIATOR_EVENT } from '@/shared/constants/events.ts';
import { PAGE_ID } from '@/shared/constants/pages.ts';

import MainPageView from '../view/MainPageView.ts';

class MainPageModel implements Page {
  private eventMediator = EventMediatorModel.getInstance();

  private router: RouterModel;

  private view: MainPageView;

  constructor(parent: HTMLDivElement, router: RouterModel) {
    this.router = router;
    this.view = new MainPageView(parent);
    this.init();
  }

  private init(): void {
    this.subscribeToEventMediator();
    this.subscribeToStore();
  }

  private subscribeToEventMediator(): void {
    this.eventMediator.subscribe(MEDIATOR_EVENT.CHANGE_PAGE, (route) => this.switchPageVisibility(route));
  }

  private subscribeToStore(): boolean {
    observeStore(selectCurrentUser, () => {
      this.router.navigateTo(PAGE_ID.MAIN_PAGE);
    });
    return true;
  }

  private switchPageVisibility(route: unknown): boolean {
    if (route === PAGE_ID.MAIN_PAGE || route === PAGE_ID.DEFAULT_PAGE) {
      this.view.show();
    } else {
      this.view.hide();
      return false;
    }
    return true;
  }

  public getHTML(): HTMLDivElement {
    return this.view.getHTML();
  }
}

export default MainPageModel;
